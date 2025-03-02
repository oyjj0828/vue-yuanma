// Description: 解析html生成ast


const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)  // 匹配开始标签
const startTagClose = /^\s*(\/?)>/  // 匹配开始标签的结束
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)  // 匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/  // 匹配属性

let root = null
let stack = []

// 入栈
function start(tag, attrs) {
  let element = createASTElement(tag, attrs)
  if (!root) {
    root = element
  }
  stack.push(element)
}

// 出栈
function end(tagName) {
  let element = stack.pop()
  if (element.tag !== tagName) {
    throw new Error('标签有误')
  }
  let currentParent = stack[stack.length - 1]
  if (currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}

function chars(text) {
  text = text.replace(/\s/g, '')
  if (text) {
    let parent = stack[stack.length - 1]
    parent.children.push({
      type: 3,
      text
    })
  }
}

// 创建ast元素
function createASTElement(tagName, attrs) {
  return {
    type: 1,
    tag: tagName,
    attrs,
    children: [],
    parent: null
  }
}

function parseHTML(html) {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      let startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if(endTagMatch){
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }
    else if(textEnd > 0){
      let text = html.substring(0, textEnd)
      if(text){
        chars(text)
        advance(text.length)
      }
    }
  }
  function parseStartTag(){
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5]})
        advance(attr[0].length)
      }
      if(end){
        advance(end[0].length)
        return match
      }
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  return root
}

export { parseHTML }