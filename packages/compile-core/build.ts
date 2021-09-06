import * as path from 'path'
import * as fse from 'fs-extra'
import { outputDir, inputRoot } from '../common/const'
import { emptyDir, getRelativeAppPath } from '../common/util'
import babel from '../common/babel'
import { config } from '../common/configure'
import tarnsform from './transform'

async function buildSinglePage(page) {
    const pagePath = path.join(inputRoot, `${page}`)
    const pageJs = `${pagePath}.jsx`
    const outPageDirPath = path.join(outputDir, page)
    console.log(`开始处理：${inputRoot}/${page} ...`.info)

    const code = fse.readFileSync(pageJs).toString()
    const outputPageJSPath = `${outPageDirPath}.js`
    const outputPageJSONPath = `${outPageDirPath}.json`
    const outputPageWXMLPath = `${outPageDirPath}.wxml`
    const outputPageWXSSPath = `${outPageDirPath}.wxss`
    const sourceDirPath = path.dirname(pagePath)
    const relativeAppPath = getRelativeAppPath(path.dirname(outPageDirPath))

    const result = tarnsform({
        code,
        sourceDirPath,
        relativeAppPath
    })

    fse.ensureDirSync(path.dirname(outputPageJSPath))

    let resCode = await babel(result.code, outputPageJSPath)

    result.code = `
${resCode.code}    
Page(require('${relativeAppPath}').createPage(${result.className}))
    `
    fse.writeFileSync(outputPageJSONPath, result.json)
    console.log(`输出文件：${outputDir}/${page}.json`.info)
    fse.writeFileSync(outputPageJSPath, result.code)
    console.log(`输出文件：${outputDir}/${page}.js`.info)
    fse.writeFileSync(outputPageWXMLPath, result.wxml)
    console.log(`输出文件：${outputDir}/${page}.wxml`.info)
    fse.writeFileSync(outputPageWXSSPath, result.style)
    console.log(`输出文件：${outputDir}/${page}.wxss`.info)
}

function buildPages() {
    config.pages.forEach(page => {
        buildSinglePage(page)
    })
}

function buildProjectConfig() {
    fse.writeFileSync(path.join(outputDir, 'project.config.json'), `
{
    "miniprogramRoot": "./",
    "projectname": "app",
    "description": "app",
    "appid": "touristappid",
    "setting": {
        "urlCheck": true,
        "es6": false,
        "postcss": false,
        "minified": false
    },
    "compileType": "miniprogram"
}
    `)
}

function buildEntry() {
    fse.writeFileSync(path.join(outputDir, './app.js'), `App({})`)
    fse.writeFileSync(path.join(outputDir, './app.json'), JSON.stringify(config, undefined, 2))
}

async function copyNpm() {
    const fileContent = fse.readFileSync(path.join(__dirname, './npm/app.js')).toString()
    const outputNpmPath = path.join(outputDir, '/npm/app.js')
    let resCode = await babel(fileContent, outputNpmPath)
    fse.ensureDirSync(path.dirname(outputNpmPath))
    fse.writeFileSync(outputNpmPath, resCode.code)
}

export default async function build() {
    if (!fse.existsSync(outputDir)) {
        fse.ensureDirSync(outputDir)
    }

    emptyDir(outputDir, new Set([
        'project.config.json'
    ]))

    await copyNpm()
    await buildPages()
    await buildEntry()
    await buildProjectConfig()
}
