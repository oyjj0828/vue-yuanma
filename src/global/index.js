import { mergeOptions } from "../utils/index"
export function initGlobalApi(Vue){
  Vue.options = {}
  Vue.mixin = function(mixin){
    Vue.options = mergeOptions(this.options,mixin)
  }
}