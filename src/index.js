import { initMixin } from "./init"

// src/main.js
function Vue(options){
  this._init(options)
}

initMixin(Vue)

export default Vue