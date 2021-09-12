import * as path from 'path'
import tarnsform from './transform'
import build from '../common/build'

build(path.join(__dirname, './npm'), tarnsform)