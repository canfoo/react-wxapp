import { parse, ParserPlugin } from '@babel/parser'
import generator from '@babel/generator'


export function parseCode(code, extname = 'jsx') {
    const plugins: ParserPlugin[] = [
        'classProperties',
        'objectRestSpread',
        'optionalChaining',
        ['decorators', { decoratorsBeforeExport: true }],
        'classPrivateProperties',
        'doExpressions',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'throwExpressions'
    ]


    if (extname === '.ts') {
        plugins.push('typescript')
    } else if (extname === '.tsx') {
        plugins.push('typescript')
        plugins.push('jsx')
    } else {
        plugins.push('flow')
        plugins.push('jsx')
    }

    return parse(code, {
        sourceType: "module",
        plugins
    })
}


export function geneReactCode(ast) {
    let code = generator(ast, {
        comments: false,
        jsescOption: {},
    }).code
    return code
}
