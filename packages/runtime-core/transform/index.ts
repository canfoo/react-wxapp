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
    relativeComponentsPath: string
}

export default function tarnsform(options: TarnsformOption) {
	let code = options.code
	const sourceDirPath = options.sourceDirPath
	const relativeComponentsPath = options.relativeComponentsPath
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
            if (source === LEO_COMPONENTS_NAME) {
                path.node.source.value = relativeComponentsPath
            }
			if (/css$/.test(source)) {
				let cssPath = npath.join(sourceDirPath, source)
				style = fse.readFileSync(cssPath).toString().replace(/px/g, 'rpx')
			}
		}
	})

	outTemplate = `
<import src="/base.wxml"/>
<template is="TPL" data="{{root: root}}" />
    `

	ast.program.body = ast.program.body.filter(item => (!(t.isImportDeclaration(item) && /css$/.test(item.source.value))))

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