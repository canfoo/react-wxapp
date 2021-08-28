import * as path from 'path'
import * as fse from 'fs-extra'
import * as t from "@babel/types";
import generator from '@babel/generator'


export function emptyDir(dir, ignoreArr) {
  const allFiles = fse.readdirSync(dir)
  for (let i = 0; i < allFiles.length; i++) {
    const partPath = allFiles[i]
    if (ignoreArr.has(partPath)) {
      continue
    }

    const absolutePath = path.resolve(dir, partPath)

    if (ignoreArr.has(absolutePath)) {
      continue
    }

    fse.removeSync(absolutePath)
  }
}

export function buildBlockElement(attrs) {
  let blockName = 'block'
  return t.jSXElement(
    t.jSXOpeningElement(t.jSXIdentifier(blockName), attrs),
    t.jSXClosingElement(t.jSXIdentifier(blockName)),
    []
  )
}

export function findMethodName(expression) {
  let methodName
  if (
    t.isIdentifier(expression) ||
    t.isJSXIdentifier(expression)
  ) {
    methodName = expression.name
  } else if (t.isStringLiteral(expression)) {
    methodName = expression.value
  } else if (
    t.isMemberExpression(expression) &&
    t.isIdentifier(expression.property)
  ) {
    const { code } = generator(expression)
    const ids = code.split('.')
    if (ids[0] === 'this' && ids[1] === 'props' && ids[2]) {
      methodName = code.replace('this.props.', '')
    } else {
      methodName = expression.property.name
    }
  } else if (
    t.isCallExpression(expression) &&
    t.isMemberExpression(expression.callee) &&
    t.isIdentifier(expression.callee.object)
  ) {
    methodName = expression.callee.object.name
  } else if (
    t.isCallExpression(expression) &&
    t.isMemberExpression(expression.callee) &&
    t.isMemberExpression(expression.callee.object) &&
    t.isIdentifier(expression.callee.property) &&
    expression.callee.property.name === 'bind' &&
    t.isIdentifier(expression.callee.object.property)
  ) {
    methodName = expression.callee.object.property.name
  } else {
    console.log('当 props 为事件时(props name 以 `on` 开头)，只能传入一个 this 作用域下的函数。'.error)
  }
  return methodName
}
