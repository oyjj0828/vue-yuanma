/**
 * Watcher
 * @param {Object} vm
 * @param {Function} updateComponent
 * @param {Function} cb
 * @param {Boolean} options
 * @returns {Watcher}
 */
import { pushTarget, popTarget } from "./dep"

let id = 0

export default class Watcher {
  constructor(vm, updateComponent, cb, options) {
    this.vm = vm
    this.exprOrFn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = []
    this.depsId = new Set()
    if(typeof updateComponent === 'function'){
      this.getter = updateComponent
    }
    this.get()
  }
  // 初次渲染
  get(){
    pushTarget(this)
    this.getter()
    popTarget()
  }
  run(){
    this.get()
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
  queue.forEach(watcher => watcher.run())
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

