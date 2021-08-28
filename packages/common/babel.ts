import { transform } from '@babel/core'

const babelOptions = {
  sourceMap: true,
  presets: [
    '@babel/preset-react'
  ]
}

export default function babel (content, file) {
  let p
  let config: any = babelOptions
  try {
    if (!config) config = {}
    config.filename = file
    const res = transform(content, config)
    p = Promise.resolve(res)
  } catch (e) {
    p = Promise.reject(e)
  }
  return p
}
