import * as path from 'path'

export const outputCompileRoot = path.join(path.resolve('.'), 'dist/compile')

export const outputRuntimeRoot = path.join(path.resolve('.'), 'dist/runtime')

export const outputDir =  process.env.BUILE_ENV === 'runtime' ? outputRuntimeRoot : outputCompileRoot

export const inputRoot = path.join(path.resolve('.'), 'src')

export const COMP_READY = '$leoCompReady'