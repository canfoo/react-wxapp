import { transform } from '@babel/core'
import npmResolve from './npmResolve'

const babelOptions = {
  sourceMap: true,
  presets: [
    '@babel/preset-react'
  ],
  plugins: [
    [
      'babel-plugin-define-variables',
      {
        defines: {
          'process.env.NODE_ENV': 'production',
        },
        builtIns: {
        }
      }
    ],
  ]
}

export default async function babel (content, file) {
  content = await npmResolve(content, file)
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
