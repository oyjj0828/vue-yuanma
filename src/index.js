import { initMixin } from "./init"
import { lifecycleMixin } from "./lifeCycle"
import { renderMixin } from "./vnode/index"
import { initGlobalApi } from "./global/index"
import { stateMixin } from "./initState"

// src/main.js
function Vue(options){
  this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)  // 添加_update方法
renderMixin(Vue)  // 添加_render方法
stateMixin(Vue)  // 添加$nextTick属性

// 初始化全局方法Vue.mixin Vue.Component Vue.extend
initGlobalApi(Vue)

export default Vue