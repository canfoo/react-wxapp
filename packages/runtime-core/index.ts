import * as path from 'path'
import * as fse from 'fs-extra'
import { outputDir } from '../common/const'
import tarnsform from './transform'
import build from '../common/build'
import { baseWxml } from './template/base'

async function geneBaseWxml() {
    const outputBaseWxml = path.join(outputDir, '/base.wxml')
    fse.ensureDirSync(path.dirname(outputBaseWxml))
    fse.writeFileSync(outputBaseWxml, baseWxml)    
}

build(path.join(__dirname, './npm'), tarnsform).then(() => {
    geneBaseWxml()
})