import { arrayMethods } from "./array"
import { Dep } from "./dep"
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
    this.dep = new Dep()
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
  let childDep = observer(value)  // 递归实现深度代理
  const dep = new Dep()
  Object.defineProperty(data, key, {
    get(){
      if(Dep.target){
        dep.depend()
        if(childDep.dep){
          childDep.dep.depend()
        }
      }
      return value
    },
    set(newValue){
      if(newValue === value){
        return
      }
      observer(newValue)
      value = newValue
      dep.notify()
    }
  })
}