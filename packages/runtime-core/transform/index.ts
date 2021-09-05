import traverse from "@babel/traverse";
import * as t from "@babel/types";
import * as fse from 'fs-extra'
import * as npath from 'path'
import { parseCode } from '../../common/ast'
import generator from '@babel/generator'

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
	let className = ''

	traverse(ast, {
		ClassDeclaration(path) {
			className = path.node.id.name
		},
		ImportDeclaration(path) {
			const source = path.node.source.value
			if (/css$/.test(source)) {
				let cssPath = npath.join(sourceDirPath, source)
				style = fse.readFileSync(cssPath).toString().replace(/px/g, 'rpx')
			}
		}
	})

	outTemplate = 'Comonent({})'

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