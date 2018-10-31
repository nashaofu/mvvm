/**
 * 观察者对象
 * @param {*} obj
 * @param {*} exp
 * @param {*} callback
 */
function Watcher(obj, exp, callback) {
  this.obj = obj
  this.callback = callback || function() {}
  //   生成getter函数
  this.getter = this.parseGetter(exp)
  // 记录Watcher被收集到哪些Dep对象中去了
  // key为Dep对象的uid
  this.dep = {}
  // 初始化时，触发添加到监听队列
  this.uid = Watcher.uid++
  // 触发求值，收集依赖
  this.value = this.get()
}

Watcher.uid = 0

Watcher.prototype = {
  addDep(dep) {
    // 没有被收集到dep这个依赖中
    // 有可能会出现一个watcher被多个dep搜集的情况
    if (!this.dep[dep.uid]) {
      // 推送到依赖数组中
      dep.dep.push(this)
      // 标记为已经被收集
      this.dep[dep.uid] = dep
    }
  },
  // 收集一来到dep对象中
  get() {
    //  把Dep关联进来
    Dep.target = this
    // 由于会求值，所以会调用被劫持的getter函数
    // 所以此时进入到get函数
    // 由于设置了Dep.target,add.sub方法，从而创建了一个依赖链。
    const value = this.getter.call(this.obj, this.obj)
    Dep.target = null
    return value
  },
  update() {
    const newVal = this.get()
    // 这里有可能是对象/数组，所以不能直接比较，可以借助JSON来转换成字符串对比
    this.callback(newVal, this.value)
    this.value = newVal
  },
  parseGetter(exp) {
    return obj => get(obj, exp)
  }
}
