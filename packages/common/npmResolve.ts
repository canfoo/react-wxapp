import traverse from "@babel/traverse";
import * as t from "@babel/types";
import * as fse from 'fs-extra'
import generator from '@babel/generator'
import * as npath from 'path'
import { parseCode } from './ast'
import { judgeLibPath } from './util'
import { outputCompileRoot } from './const'
import babel from './babel'

const fileContent = new Map<string, any>()

function getDirPath(path) {
    const arr = path.split('/')
    arr.pop()
    return arr.join('/')
}

function getNpmRelativePath(path) {
    return path.replace(npath.join(npath.resolve('.'), 'node_modules'), '')
}

function getWxNpmPath(path) {
    return `/npm${getNpmRelativePath(path)}`
}

function getWxRelativePath(path, filePath) {
    const rpath = npath.relative(getDirPath(filePath), resloveWxNpmPath(path))
    return judgeLibPath(rpath) ? `./${rpath}` : rpath
}

function resloveWxNpmPath(path) {
    return npath.join(outputCompileRoot, getWxNpmPath(path))
}

function addJsFile(name) {
    if (/\.js$/.test(name)) {
        return name
    } else 
    return `${name}.js`
}

async function copyNpmToWX(filePath, npmPath, isRoot = false) {
    if (fileContent.has(filePath)) {
        return
    }
    const code = fse.readFileSync(filePath).toString()
    const ast = parseCode(code)
    traverse(ast, {
        CallExpression(path) {
            if (t.isIdentifier(path.node.callee, {name: 'require'})) {
                const sourcePath = path.node.arguments[0].value
                if (judgeLibPath(sourcePath)) {
                    let npmPath = ''
                    let mainPath = ''
                    let packagejson
                    if (/\//.test(sourcePath)) {
                        npmPath = npath.join(npath.resolve('.'), 'node_modules', sourcePath.split('/').shift())
                        mainPath = npath.join(npath.resolve('.'), 'node_modules', addJsFile(sourcePath))
                    } else {
                        npmPath = npath.join(npath.resolve('.'), 'node_modules', sourcePath)
                        packagejson = require(npath.join(npmPath, 'package.json'))
                        mainPath = npath.join(npmPath, packagejson.main || 'index.js')
                    }
                    copyNpmToWX(mainPath, npmPath)
                    path.node.arguments[0].value = getWxRelativePath(mainPath, resloveWxNpmPath(filePath))
                } else if (npmPath) {
                    const _filePath = npath.resolve(npmPath, addJsFile(sourcePath))
                    copyNpmToWX(_filePath, npmPath)
                }
            }
            
        }
    })
    fileContent.set(filePath, {code: generator(ast).code})
    if (isRoot) {
        fileContent.forEach(async (value, filePath) => {
            const _filePath = resloveWxNpmPath(filePath)
            if(!fse.existsSync(_filePath) && !fse.existsSync(getDirPath(_filePath))){
                fse.mkdirSync(getDirPath(_filePath), { recursive: true });     
            }
            const resCode = await babel(value.code, _filePath)
            fse.writeFileSync(_filePath, resCode.code)
        })
    }
}

export default async function npmResolve(code, filePath) {
    const ast = parseCode(code)
    traverse(ast, {
        CallExpression(path) {
            if (t.isIdentifier(path.node.callee, {name: 'require'})) {
                const sourcePath = path.node.arguments[0].value
                if (judgeLibPath(sourcePath)) {
                    const npmPath = npath.join(npath.resolve('.'), 'node_modules', sourcePath)
                    const packagejson = require(npath.join(npmPath, 'package.json'))
                    const mainPath = npath.join(npmPath, packagejson.main)
                    copyNpmToWX(mainPath, npmPath, true)
                    path.node.arguments[0].value = getWxRelativePath(mainPath, filePath)
                }
            }
            
        }
    })

    return generator(ast).code
}