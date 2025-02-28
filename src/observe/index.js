import { arrayMethods } from "./array"

export function observer(data){
  if(typeof data !== 'object' || data === null){
    return data
  }
  return new Observer(data)
}

class Observer {
  constructor(value){
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false
    })
    this.value = value
    // 判断数组
    if(Array.isArray(value)){
      value.__proto__ = arrayMethods
      // 观测数组中的对象类型
      this.observeArray(value)
    }
    // 遍历value，使用defineProperty重新定义属性
    else{
      this.walk(value)
    }
  }
  walk(data){
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
  observeArray(data){
    data.forEach(item => {
      observer(item)
    })
  }
}

function defineReactive(data, key, value){
  observer(value)
  Object.defineProperty(data, key, {
    get(){
      return value
    },
    set(newValue){
      if(newValue === value){
        return
      }
      observer(newValue)
      value = newValue
    }
  })
}