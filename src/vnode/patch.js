export function patch(oldVnode,newVnode){
  // 1.判断oldVnode是真实节点还是虚拟节点
  if(oldVnode.nodeType){
    // 真实节点
    // 用虚拟节点创建真实节点替换掉原来的真实节点
    let newElm = createElm(newVnode)
    let parentNode = oldVnode.parentNode
    parentNode.insertBefore(newElm,oldVnode.nextSibling)
    parentNode.removeChild(oldVnode)
    return newElm
  }
}

function createElm(vnode){
  let {tag,data,children,text} = vnode
  if(typeof tag === 'string'){
    // 创建元素，放到vnode.el上
    vnode.el = document.createElement(tag)
    // 更新属性
    updateProperties(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    // 创建文本，放到vnode.el上
    vnode.el = document.createTextNode(text)
    
  }
  return vnode.el
}

function updateProperties(vnode){
  let newProps = vnode.data || {}
  let el = vnode.el
  for(let key in newProps){
    if(key === 'style'){
      for(let styleName in newProps.style){
        el.style[styleName] = newProps.style[styleName]
      }
    } else if(key === 'class'){
      el.className = newProps.class
    } else{
      el.setAttribute(key,newProps[key])
    }
  }
}