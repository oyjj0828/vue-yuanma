import { observer } from './observe/index'
import { nextTick } from './utils/nextTick'
import Watcher from './observe/watcher'
export function initState(vm){
  let options = vm.$options
  if(options.props){
    initProps(vm)
  }
  if(options.methods){
    initMethods(vm)
  }
  if(options.data){
    initData(vm)
  }
  if(options.computed){
    initComputed(vm)
  }
  if(options.watch){
    initWatch(vm)
  }
}

function initProps(vm){

}

function initMethods(vm){

}

function initData(vm){
  let data = vm.$options.data
  for(let key in data){
    if(key in vm){
      console.error(`${key}已经定义在实例上了，请不要重复定义`) 
      return
    }
    if(key in (vm.$options.props || {})){
      console.error(`${key}已经定义在props上了，请不要重复定义`) 
      return 
    }
    if(key in (vm.$options.methods || {})){
      console.error(`${key}已经定义在methods上了，请不要重复定义`) 
      return
    }
  }
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  for(let key in data){
    proxy(vm, '_data', key)
  }
  observer(data)
}

function proxy(target, sourceKey, key){
  Object.defineProperty(target, key, {
    get(){
      return target[sourceKey][key]
    },
    set(newValue){
      target[sourceKey][key] = newValue
    }
  })
}

function initComputed(vm){
  let computed = vm.$options.computed
  for(let key in computed){
    Object.defineProperty(vm, key, {
      get(){ 
        typeof computed[key] === 'function' ? computed[key] : computed[key].get
      },
      set(){

      }
    })
  }
}

function initWatch(vm){
  for(let key in vm.$options.watch){
    const userDef = vm.$options.watch[key]
    let handler = userDef
    if(Array.isArray(userDef)){
      handler.forEach(item=>{
        createWatcher(vm, key, item)
      })
    }
    else{
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, exprOrFn, handler, options){
  if (typeof handler === 'object'){
    options = handler
    handler = handler.handler
  }
  else if (typeof handler === 'string'){
    handler = vm[handler]
  }
  return vm.$watch(exprOrFn, handler, options)
}

export function stateMixin(Vue){
  Vue.prototype.$nextTick = function(cb){
    nextTick(cb)
  }
  Vue.prototype.$watch = function(exprOrFn,handler,options={}){
    let vm = this
    options = {...options, user:true}
    let watcher = new Watcher(vm, exprOrFn, handler, options)
    console.log(watcher)
    if(options.immediate){
      watcher.run()
    }
  }
}