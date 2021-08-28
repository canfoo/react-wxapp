import * as path from 'path'
import * as fse from 'fs-extra'
import { outputRoot, inputRoot } from '../common/const'
import { emptyDir } from '../common/util'
import babel from '../common/babel'
import { config } from './configure'
import tarnsform from './transform'

async function buildSinglePage(page) {
    const pagePath = path.join(inputRoot, `${page}`)
    const pageJs = `${pagePath}.jsx`
    const outPageDirPath = path.join(outputRoot, page)
    console.log(`开始处理：${inputRoot}/${page} ...`.info)
    console.log('')

    const code = fse.readFileSync(pageJs).toString()
    const outputPageJSPath = `${outPageDirPath}.js`
    const outputPageJSONPath = `${outPageDirPath}.json`
    const outputPageWXMLPath = `${outPageDirPath}.wxml`
    const outputPageWXSSPath = `${outPageDirPath}.wxss`

    const transformResult = tarnsform({
        code,
        sourceDirPath: path.dirname(pagePath)
    })

    fse.ensureDirSync(path.dirname(outputPageJSPath))

    let resCode = await babel(transformResult.code, outputPageJSPath)
    transformResult.code = resCode.code
    fse.writeFileSync(outputPageJSONPath, transformResult.configObj)
    console.log(`输出文件：${outputRoot}/${page}.json`.info)
    fse.writeFileSync(outputPageJSPath, transformResult.code)
    console.log(`输出文件：${outputRoot}/${page}.js`.info)
    fse.writeFileSync(outputPageWXMLPath, transformResult.wxml)
    console.log(`输出文件：${outputRoot}/${page}.wxml`.info)
    fse.writeFileSync(outputPageWXSSPath, transformResult.style)
    console.log(`输出文件：${outputRoot}/${page}.wxss`.info)
}

function buildPages() {
    config.pages.forEach(page => {
        buildSinglePage(page)
    })
}

async function copyNpm() {
    const fileContent = fse.readFileSync(path.join(__dirname, './npm/app.js')).toString()
    const outputNpmPath = path.join(outputRoot, '/npm/app.js')
    let resCode = await babel(fileContent, outputNpmPath)
    fse.ensureDirSync(path.dirname(outputNpmPath))
    fse.writeFileSync(outputNpmPath, resCode.code)
}

export default async function build() {
    emptyDir(outputRoot, new Set([
        'project.config.json'
    ]))

    await copyNpm()
    await buildPages()

}
