// 重写数组函数，函数劫持
// 对数组的7个方法进行重写
let oldArrayProtoMethods = Array.prototype

let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    let result = oldArrayProtoMethods[method].call(this, ...args)
    console.log('数组被修改了')
    // 有可能用户新增的数据是对象格式，需要再次进行劫持
    let inserted
    switch(method){
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    let ob = this.__ob__
    if(inserted){
      ob.observeArray(inserted)
    }
    return result
    // 数组修改后，通知视图更新
    // this.__ob__.dep.notify()
  }
})

export {
  arrayMethods
}