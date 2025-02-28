import { observer } from './observe/index'

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

}

function initWatch(vm){

}