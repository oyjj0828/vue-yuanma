import { pushTarget, popTarget } from '../observe/dep'

let pending = false
let callbacks = []
function flushCallbacks(){
  callbacks.forEach(cb => cb())
  pending = false
  callbacks = []
}

let timeFunc
if(Promise){
  timeFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
}
else if(MutationObserver){
  let counter = 1
  let observer = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timeFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
}
else if(setImmediate){
  timeFunc = () => {
    setImmediate(flushCallbacks)
  }
}

export function nextTick(cb){
  callbacks.push(cb)
  if(!pending){
    pending = true
    timeFunc()
  }
}