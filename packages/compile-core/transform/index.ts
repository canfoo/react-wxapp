import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { parseCode } from '../../common/ast'
import template from '@babel/template'
import generator from '@babel/generator'
import compileRender from './compileRender'

const LEO_NAME = 'Leo'
const LEO_PACKAGE_NAME = 'react'
const LEO_COMPONENTS_NAME = '@leo/components'
const WEPAGEPARH = '../../npm/app.js'
const CREATE_DATA = '_createData'

interface TarnsformOption {
    code: string
    sourceDirPath: string
}

export default function tarnsform(options: TarnsformOption) {
    let code = options.code
    const ast = parseCode(code)

    let mainClass = null
    let configObj = null
    let outTemplate = null
    let style = null
    let result: any = {}
    let renderPath = null
    let initState = new Set()

    traverse(ast, {
        ClassDeclaration(path) {
            mainClass = path
        },
        ClassMethod(path) {
            if (t.isIdentifier(path.node.key)) {
                const node = path.node
                const methodName = node.key.name
                if (methodName === 'render') {
                    renderPath = path
                    path.node.key.name = CREATE_DATA
                }
                if (methodName === 'constructor') {
                    path.traverse({
                        AssignmentExpression(p) {
                            if (
                                t.isMemberExpression(p.node.left) &&
                                t.isThisExpression(p.node.left.object) &&
                                t.isIdentifier(p.node.left.property) &&
                                p.node.left.property.name === 'state' &&
                                t.isObjectExpression(p.node.right)
                            ) {
                                const properties = p.node.right.properties
                                properties.forEach(p => {
                                    if (t.isObjectProperty(p) && t.isIdentifier(p.key)) {
                                        initState.add(p.key.name)
                                    }
                                })
                            }
                        }
                    })
                }
            }
        },
        ClassProperty(path) {
            const keyName = path.node.key.name
            if (keyName === 'config') {
                let config = eval('(' + generator(path.node.value).code + ')')
                config.usingComponents = {}
            }
        },
        ImportDeclaration(path) {
            const source = path.node.source.value
            path.traverse({
                ImportSpecifier(path) {
                    const name = path.node.imported.name
                    if (source === LEO_PACKAGE_NAME && name === 'Component') {
                        path.node.local = t.identifier('__BaseComponent')
                    }
                }
            })
            if (source === LEO_PACKAGE_NAME) {
                path.node.source.value = WEPAGEPARH
            }
            // if (/css$/.test(source)) {
            //     let cssPath = nodePath.join(isEntry ? inputRoot : sourceDirPath, source)
            //     style = compileStyle(cssPath, projectConfig)
            //     path.remove()
            // }
        },
        CallExpression(path) {
            const callee = path.node.callee
            if (callee.object && callee.object.name === LEO_NAME && callee.property.name === 'render') {
                path.remove()  // 移除 Leo.render(<App />, document.getElementById('app'));
            }
        },
        Program: {
            exit(astPath) {
                mainClass.scope.rename('Component', '__BaseComponent')
                astPath.traverse({
                    ClassDeclaration(path) {
                        const node = path.node
                        let hasCreateData = false
                        if (node.superClass) {  // 该类有extend关键字
                            path.traverse({
                                ClassMethod(astPath) {
                                    if (astPath.get('key').isIdentifier({ name: '_createData' })) {
                                        hasCreateData = true
                                    }
                                }
                            })
                            if (hasCreateData) {
                                let className = node.id.name
                                if (className === 'App') {
                                    node.id.name = className = '_App'
                                }
                                // astPath.node.body.push(template(`export default ${className}`)())
                                astPath.node.body.push(template(`Component(require('${WEPAGEPARH}').createComponent(${className}))`)())
                            }
                        }
                    },
                })
            }
        }
    })

    outTemplate = compileRender(renderPath)
    ast.program.body = ast.program.body.filter(item => !(t.isImportDeclaration(item) && item.source.value === LEO_COMPONENTS_NAME))


    renderPath.traverse({
        BlockStatement(path) {
            path.node.body = []
            path.node.body.unshift(template('this.__state = arguments[0] || this.state || {};')())
        }
    })

    code = generator(ast).code

    result.code = code
    result.configObj = configObj
    result.wxml = outTemplate
    result.style = style

    return result
}