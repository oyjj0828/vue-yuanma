/**
 * Watcher
 * @param {Object} vm
 * @param {Function} updateComponent
 * @param {Function} cb
 * @param {Boolean} options
 * @returns {Watcher}
 */
import { pushTarget, popTarget } from "./dep"
import { nextTick } from "../utils/nextTick"

let id = 0

export default class Watcher {
  constructor(vm, updateComponent, cb, options) {
    this.vm = vm
    this.exprOrFn = updateComponent
    this.cb = cb
    this.options = options
    this.user = options.user
    this.id = id++
    this.deps = []
    this.depsId = new Set()
    if(typeof this.exprOrFn === 'function'){
      this.getter = this.exprOrFn
    }
    else{
      this.getter = function(){
        let path = this.exprOrFn.split('.')
        let obj = vm
        for(let i=0;i<path.length;i++){
          obj = obj[path[i]]
        }
        return obj
      }
    }
    this.value = this.get()
  }
  // 初次渲染
  get(){
    pushTarget(this)
    let value = this.getter()  // 新值
    popTarget()
    return value
  }
  run(){
    let newVal = this.get()
    let oldVal = this.value  // 旧值
    this.value = newVal
    if(this.user){
      this.cb.call(this.vm, newVal, oldVal)
    }
  }
  // 更新
  update(){
    // this.getter()
    queueWatcher(this)
  }
  addDep(dep){
    if(!this.depsId.has(dep.id)){
      this.depsId.add(dep.id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
}

let has = {}
let queue = []
let pending = false

function flushSchedulerQueue(){
  queue.forEach(watcher => {
    watcher.run()
    !watcher.user && watcher.cb && watcher.cb.call(watcher.vm)
  })
  has = {}
  queue = []
  pending = false
}
function queueWatcher(watcher){
  const id = watcher.id
  if(has[id] == null){
    has[id] = true
    queue.push(watcher)
    if(!pending){
      pending = true
      nextTick(flushSchedulerQueue)
    }
  }
}

