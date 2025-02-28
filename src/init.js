import { initState } from "./initState"
import { compileToFunction } from "./compiler/index"
export function initMixin(Vue){
  Vue.prototype._init = function(options){
    let vm = this
    vm.$options = options
    // 初始化状态
    initState(vm)

    // 渲染
    if(vm.$options.el){
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function(el){
    let vm = this
    let options = vm.$options
    if(!options.render){
      let template = options.template
      if(!template && el){
        template = document.querySelector(el).outerHTML
      }
      // 生成ast语法树
      // 将模板编译成render函数
      const render = compileToFunction(template)
    }
  }
}