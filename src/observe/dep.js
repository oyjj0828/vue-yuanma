// 依赖收集
let id = 0

export class Dep {
  constructor(){
    // 存储所有的Watcher
    this.subs = []
    this.id = id++
  }
  addSub(watcher){
    this.subs.push(watcher)
  }
  notify(){
    this.subs.forEach(watcher => watcher.update())
  }
  depend(){
    if(Dep.target){
      Dep.target.addDep(this)
    }
  }
}


// Dep与Watcher是多对多的关系
Dep.target = null
export function pushTarget(watcher){
  Dep.target = watcher
}

export function popTarget(){
  Dep.target = null
}