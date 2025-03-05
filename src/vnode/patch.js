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
  else{
    if(oldVnode.tag !==newVnode.tag || oldVnode.key !== newVnode.key){
      oldVnode.el = newVnode.el
      oldVnode.el.parentNode.replaceChild(createElm(newVnode),oldVnode.el)
    }
    if(oldVnode.tag === undefined){
      if(oldVnode.text !== newVnode.text){
        oldVnode.el.textContent = newVnode.text
      }
    }
    // tag与key都一致且非文本标签
    let el = newVnode.el = oldVnode.el
    updateProperties(newVnode,oldVnode.data)  // 更新属性
    let oldChildren = oldVnode.children || []
    let newChildren = newVnode.children || []
    if(oldChildren.length > 0 && newChildren.length === 0){
      el.innerHTML = ''  // 删除所有子节点
    }
    else if(oldChildren.length === 0 && newChildren.length > 0){
      for(let i=0;i<newChildren.length;i++){
        el.appendChild(createElm(newChildren[i]))
      }
    }
    else if(oldChildren.length > 0 && newChildren.length > 0){
      updateChildren(el,oldChildren,newChildren)
    }
  }
}

export function createElm(vnode){
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

function updateChildren(parent,oldChildren,newChildren){
  // 1.创建两个指针，分别指向oldChildren和newChildren
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]
  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
    if(oldStartVnode.key === newStartVnode.key){
      patch(oldStartVnode,newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } 
    else if(oldEndVnode.key === newEndVnode.key){
      patch(oldEndVnode,newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
    else if(oldEndVnode.key === newStartVnode.key){
      patch(oldEndVnode,newStartVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    }
    else if(oldStartVnode.key === newEndVnode.key){
      patch(oldStartVnode,newEndVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode= newChildren[--newEndIndex]
    }
    else{
      let moveIndex = oldChildren.findIndex(child=>child.key === newStartVnode.key)
      if(moveIndex > -1){
        let moveVnode = oldChildren[moveIndex]
        patch(moveVnode,newStartVnode)
        parent.insertBefore(moveVnode.el,oldStartVnode.el)
        oldChildren[moveIndex] = undefined
      }
      else{
        parent.insertBefore(createElm(newStartVnode),oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }
  if(newStartIndex <= newEndIndex){
    for(let i=newStartIndex;i<=newEndIndex;i++){
      parent.appendChild(createElm(newChildren[i]))
    }
  }
  if(oldStartIndex <= oldEndIndex){
    for(let i=oldStartIndex;i<=oldEndIndex;i++){
      let child = oldChildren[i]
      if(child){
        parent.removeChild(child.el)
      }
    }
  }
}

function updateProperties(vnode,oldProps={}){
  let newProps = vnode.data || {}
  let el = vnode.el
  for(let key in oldProps){
    if(!newProps[key]){
      el.removeAttribute(key)
    }
  }
  let oldStyle = oldProps.style || {}
  let newStyle = newProps.style || {}
  for(let key in oldStyle){
    if(!newStyle[key]){
      el.style[key] = ''
    }
  }
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