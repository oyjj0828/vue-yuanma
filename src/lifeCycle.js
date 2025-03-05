import Watcher from './observe/watcher'
import { patch } from './vnode/patch'
export function mountComponent(vm,el){
  // 调用beforeMount钩子
  callHook(vm,'beforeMount')
  // vm._render将render函数渲染成vnode
  // vm._update将vnode渲染成真实dom
  // vm._update(vm._render())
  let updateComponent = ()=>{
    vm._update(vm._render())
  }
  new Watcher(vm,updateComponent,()=>{
    callHook(vm,'updated')
  },true)  // true标识是否为渲染Watcher
  // 调用mounted钩子
  callHook(vm,'mounted')
}

export function lifecycleMixin(Vue){
  // _update将vnode渲染成真实dom
  Vue.prototype._update = function(vnode){
    // vnode -> patch -> dom
    let vm = this
    // 用虚拟节点创建真实节点替换掉原来的$el
    vm.$el = patch(vm.$el,vnode)
  }
}

export function callHook(vm,hook){
  // vm.$options.hook
  const handlers = vm.$options[hook]
  if(handlers){
    for(let i=0;i<handlers.length;i++){
      handlers[i].call(vm)
    }
  }
}