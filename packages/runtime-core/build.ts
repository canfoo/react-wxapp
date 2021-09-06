import * as path from 'path'
import * as fse from 'fs-extra'
import babel from '../common/babel'
import { outputDir, inputRoot } from '../common/const'
import { emptyDir, getRelativeAppPath, getRelativeComponentPath } from '../common/util'
import { config } from '../common/configure'
import tarnsform from './transform'
import { baseWxml } from './template/base'

async function buildSinglePage(page) {
    const pagePath = path.join(inputRoot, `${page}`)
    const pageJs = `${pagePath}.jsx`
    const outPageDirPath = path.join(outputDir, page)
    console.log(`开始处理：${inputRoot}/${page} ...`.info)

    const code = fse.readFileSync(pageJs).toString()
    const outputPageJSPath = `${outPageDirPath}.js`
    const outputPageJSONPath = `${outPageDirPath}.json`
    const outputPageWXMLPath = `${outPageDirPath}.wxml`
    const outputPageWXSSPath = `${outPageDirPath}.wxss`
    const sourceDirPath = path.dirname(pagePath)
    const relativeAppPath = getRelativeAppPath(path.dirname(outPageDirPath))
    const relativeComponentsPath = getRelativeComponentPath(path.dirname(outPageDirPath))

    const result = tarnsform({
        code,
        sourceDirPath,
        relativeAppPath,
        relativeComponentsPath
    })

    fse.ensureDirSync(path.dirname(outputPageJSPath))
    let resCode = await babel(result.code, outputPageJSPath)
    result.code = `
${resCode.code}    
Page(require('${relativeAppPath}').createPage(${result.className}))
    `
    fse.writeFileSync(outputPageJSONPath, result.json)
    console.log(`输出文件：${outputDir}/${page}.json`.info)
    fse.writeFileSync(outputPageJSPath, result.code)
    console.log(`输出文件：${outputDir}/${page}.js`.info)
    fse.writeFileSync(outputPageWXMLPath, result.wxml)
    console.log(`输出文件：${outputDir}/${page}.wxml`.info)
    fse.writeFileSync(outputPageWXSSPath, result.style)
    console.log(`输出文件：${outputDir}/${page}.wxss`.info)
}

function buildPages() {
    config.pages.forEach(page => {
        buildSinglePage(page)
    })
}

function buildProjectConfig() {
    fse.writeFileSync(path.join(outputDir, 'project.config.json'), `
{
    "miniprogramRoot": "./",
    "projectname": "app",
    "description": "app",
    "appid": "touristappid",
    "setting": {
        "urlCheck": true,
        "es6": false,
        "postcss": false,
        "minified": false
    },
    "compileType": "miniprogram"
}
    `)
}

function buildEntry() {
    fse.writeFileSync(path.join(outputDir, './app.js'), `App({})`)
    fse.writeFileSync(path.join(outputDir, './app.json'), JSON.stringify(config, undefined, 2))
}

async function copyNpm() {
    const allFiles = await fse.readdirSync(path.join(__dirname, './npm'))
    allFiles.forEach(async (fileName) => {
        const _fileName = `./npm/${fileName}`
        const fileContent = fse.readFileSync(path.join(__dirname, _fileName)).toString()
        const outputNpmPath = path.join(outputDir, _fileName)
        let resCode = await babel(fileContent, outputNpmPath)
        fse.ensureDirSync(path.dirname(outputNpmPath))
        fse.writeFileSync(outputNpmPath, resCode.code)
    })

    const outputBaseWxml = path.join(outputDir, '/base.wxml')
    fse.ensureDirSync(path.dirname(outputBaseWxml))
    fse.writeFileSync(outputBaseWxml, baseWxml)

    
}


export default async function build() {
    if (!fse.existsSync(outputDir)) {
        fse.ensureDirSync(outputDir)
    }

    emptyDir(outputDir, new Set([
        'project.config.json'
    ]))

    await copyNpm()
    await buildPages()
    await buildEntry()
    await buildProjectConfig()
}
