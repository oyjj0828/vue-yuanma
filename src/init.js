import { initState } from "./initState"
import { compileToFunction } from "./compiler/index"
import { mountComponent } from "./lifeCycle"
import { mergeOptions } from "./utils/index"
import { callHook } from "./lifeCycle"

export function initMixin(Vue){
  Vue.prototype._init = function(options){
    let vm = this
    vm.$options = mergeOptions(Vue.options,options)
    // 调用beforeCreate钩子
    callHook(vm,'beforeCreate')
    // 初始化状态
    initState(vm)
    // 调用created钩子
    callHook(vm,'created')
    // 渲染
    if(vm.$options.el){
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function(el){
    let vm = this
    let options = vm.$options
    el = el && document.querySelector(el)
    vm.$el = el
    // 如果有render直接使用render
    // 如果没有render，看有没有template属性
    // 如果没有template，将el的outerHtml作为template
    if(!options.render){
      let template = options.template
      if(!template && el){
        template = el.outerHTML
      }
      // 生成ast语法树
      // 将模板编译成render函数
      const render = compileToFunction(template)
      options.render = render
    }
    mountComponent(vm, el)  // 组件挂载
  }

}