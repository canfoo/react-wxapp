import * as path from 'path'
import * as fse from 'fs-extra'
import * as t from "@babel/types";
import generator from '@babel/generator'
import { outputDir } from './const'

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
    t.isMemberExpression(expression) &&
    t.isIdentifier(expression.property)
  ) {
    methodName = expression.property.name
  } else {
    console.log('事件方法没用正确解析'.error)
  }
  return methodName
}

export function getRelativeAppPath(dir) {
  return path.relative(dir, path.join(outputDir, '/npm/app.js'))
}

export function getRelativeComponentPath(dir) {
  return path.relative(dir, path.join(outputDir, '/npm/components.js'))
}

export function judgeLibPath(relativePath) {
  if (relativePath.startsWith('/')
      || relativePath.startsWith('.')
  ) {
      return false
  }

  return true
}

