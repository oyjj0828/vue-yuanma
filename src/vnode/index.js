export function renderMixin(Vue){
  // _render将render函数渲染成vnode
  // render -> with(this) -> _c('div') -> vnode
  Vue.prototype._render = function(){
    const vm = this
    const render = vm.$options.render
    let vnode = render.call(vm)
    return vnode
  }
  Vue.prototype._c = function(){
    return createElement(...arguments)  // 元素vnode
  }
  Vue.prototype._v = function(text){
    return createTextVNode(text)  // 文本vnode
  }
  Vue.prototype._s = function(val){
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
  }
}

// 创建元素vnode
export function createElement(tag,data={},...children){
  let key = data.key
  if(key){
    delete data.key
  }
  return vnode(tag,data,key,children)
}

// 创建文本vnode
export function createTextVNode(text){
  return vnode(undefined,undefined,undefined,undefined,text)
}

// 创建vnode
function vnode(tag,data,key,children,text){
  return {
    tag,
    data,
    key,
    children,
    text
  }
}