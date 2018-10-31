/**
 * 存储依赖该变量的watcher
 */
function Dep() {
  this.uid = Dep.uid++
  this.dep = []
}
Dep.uid = 0
// Dep.target在运行时会被赋值为Watcher
Dep.target = null

Dep.prototype = {
  depend() {
    Dep.target.addDep(this)
  },
  notify() {
    this.dep.forEach(item => {
      item.update()
    })
  }
}
