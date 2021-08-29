import traverse from "@babel/traverse";
import * as t from "@babel/types";
import * as fse from 'fs-extra'
import * as npath from 'path'
import { parseCode } from '../../common/ast'
import generator from '@babel/generator'
import compileRender from './parseTemplate'

const LEO_PACKAGE_NAME = 'react'
const LEO_COMPONENTS_NAME = '@leo/components'

interface TarnsformOption {
	code: string
	sourceDirPath: string
	relativeAppPath: string
}

export default function tarnsform(options: TarnsformOption) {
	let code = options.code
	const sourceDirPath = options.sourceDirPath
	const relativeAppPath = options.relativeAppPath
	const ast = parseCode(code)
	let outTemplate = null
	let style = null
	let result: any = {}
	let renderPath = null
	let initState = new Set()
	let className = ''

	traverse(ast, {
		ClassDeclaration(path) {
			className = path.node.id.name
		},
		ClassMethod(path) {
			if (t.isIdentifier(path.node.key)) {
				const node = path.node
				const methodName = node.key.name
				if (methodName === 'render') {
					renderPath = path
					path.node.key.name = 'createData'
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
		ImportDeclaration(path) {
			const source = path.node.source.value
			if (source === LEO_PACKAGE_NAME) {
				path.node.source.value = relativeAppPath
			}
			if (/css$/.test(source)) {
				let cssPath = npath.join(sourceDirPath, source)
				style = fse.readFileSync(cssPath).toString().replace(/px/g, 'rpx')
			}
		}
	})

	outTemplate = compileRender(renderPath)

	ast.program.body = ast.program.body.filter(item => (
		!(t.isImportDeclaration(item) && item.source.value === LEO_COMPONENTS_NAME)
		&& !(t.isImportDeclaration(item) && /css$/.test(item.source.value))
	))

	code = generator(ast).code
	result.code = code
	result.json = `
{
    "usingComponents": {}
}
    `
	result.wxml = outTemplate
	result.style = style
	result.className = className

	return result
}