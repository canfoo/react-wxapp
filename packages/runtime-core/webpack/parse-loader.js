import * as npath from "path"
import { parseCode, geneReactCode } from '../../common/ast'
import { inputFullPath } from '../const'

export default function (context) {

    const filepath = this.resourcePath

    console.log(`开始处理：${filepath.replace(inputFullPath, '')} ...`.info)
    let ast = parseCode(context, npath.extname(filepath))
    
    const code = geneReactCode(ast)

    return code 
}