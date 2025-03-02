/**
 * 编译器
 * 1. 解析模板，把模板变成ast语法树
 * 2. 标记静态节点
 * 3. 通过ast产生的语法树，生成render函数
 * 4. 生成静态树
 * 5. vm._update(vm._render())
 * 
 */

import { parseHTML } from './parseAst'
import { generate } from './generate'

export function compileToFunction(template) {
  let ast = parseHTML(template)
  // 从ast语法树生成render函数
  // (1) 将ast语法树转化成render字符串
  // (2) 将字符串变成函数
  let code = generate(ast)  // 得到render函数的字符串
  let render =  new Function(`with(this){return ${code}}`)  // 创建render函数
  return render
}