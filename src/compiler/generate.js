const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  // 匹配{{xxx}}

export function generate(ast) {
  let code = genElement(ast)
  return code
}

// 将ast语法树转化成render字符串
function genElement(el) {
  if (el.type === 1) {
    return genTag(el)
  } else {
    let text = el.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }
    let tokens = genText(text)
    return `_v(${tokens.join('+')})`
  }
}

function genTag(el) {
  let children = genChildren(el)
  return `_c('${el.tag}',${genData(el)}${children ? `,${children}` : ''})`
}

function genText(text) {
  let tokens = []
  let lastIndex = defaultTagRE.lastIndex = 0
  let match, index
  while (match = defaultTagRE.exec(text)) {
    index = match.index
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)))
    }
    tokens.push(`_s(${match[1].trim()})`)
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }
  return tokens
}

function genChildren(el) {
  let children = el.children
  if (children) {
    return children.map(child => genElement(child)).join(',')
  }
  return false
}

function genData(el) {
  let data = ''
  if (el.attrs) {
    data += `${genProps(el.attrs)},`
  }
  data = data.replace(/,$/, '')  // 去除末尾的逗号
  return data
}

function genProps(attrs) {
  let props = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        key = key && key.trim()
        value = value && value.trim()
        obj[key] = value
      })
      attr.value = obj
    }
    props += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${props.slice(0, -1)}}`
}

