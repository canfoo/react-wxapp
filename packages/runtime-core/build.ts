import * as path from 'path'
import * as fse from 'fs-extra'
import babel from '../common/babel'
import { outputRuntimeRoot, inputRoot } from '../common/const'

async function copyNpm() {
    const fileContent = fse.readFileSync(path.join(__dirname, './npm/runtime.js')).toString()
    const outputNpmPath = path.join(outputRuntimeRoot, '/npm/runtime.js')
    let resCode = await babel(fileContent, outputNpmPath)
    fse.ensureDirSync(path.dirname(outputNpmPath))
    fse.writeFileSync(outputNpmPath, resCode.code)

    console.log(path.join(path.resolve('.'), '/node_modules/react/umd/react.production.min.js'))
    fse.copySync(
        path.join(path.resolve('.'), '/node_modules/react/umd/react.production.min.js'),
        path.join(outputRuntimeRoot, '/npm/react.js')
    )
}


export default async function build() {
    console.log('outputRuntimeRoot', outputRuntimeRoot)
    if (!fse.existsSync(outputRuntimeRoot)) {
        fse.ensureDirSync(outputRuntimeRoot)
    }

    copyNpm()

    console.log('')
    console.log(`编译完成`.info)
}
