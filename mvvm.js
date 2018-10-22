var uid = 0
function Dep() {
  this.uid = ++uid
  this.dep = []
}
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
Dep.target = null

/**
 * 劫持对象属性
 * @param {*} obj
 * @param {*} key
 * @param {*} val
 */
function defineReactive(obj, key, val) {
  var dep = new Dep()
  def(obj, '__dep__', dep)
  observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(val, key, Dep.target)
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set(nVal) {
      val = nVal
      observe(val)
      dep.notify()
    }
  })
}

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
  this.dep = {}
  // 初始化时，触发添加到监听队列
  this.uid = ++uid
  // 触发求值，收集依赖
  this.value = this.get()
}

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
  get: function() {
    //  把Dep关联进来
    Dep.target = this
    // 由于会求值，所以会调用被劫持的getter函数
    // 所以此时进入到get函数
    var value = this.getter.call(this.obj, this.obj)
    console.log('Watcher get:', value)
    // 在parseExpression的时候，with + eval会将表达式中的变量绑定到vm模型中，在求值的时候会调用相应变量的getter事件。
    // 由于设置了Dep.target，所以会执行observer的add.sub方法，从而创建了一个依赖链。
    Dep.target = null
    return value
  },
  update: function() {
    var newVal = this.get()
    // 这里有可能是对象/数组，所以不能直接比较，可以借助JSON来转换成字符串对比
    this.callback(newVal, this.value)
    this.value = newVal
  },
  parseGetter: function(exp) {
    var exps = exp.split('.')
    return function(obj) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!obj) return
        obj = obj[exps[i]]
      }
      return obj
    }
  }
}

/**
 * 循环对象的属性值
 * 如果是对象就再循环的去做数据劫持
 * @param {*} value
 */
function observe(value) {
  if (!value || typeof value !== 'object' || value.__dep__ instanceof Dep) {
    return
  }
  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key])
  })
}

/**
 * 个数据定义一个属性值
 * @param {*} obj
 * @param {*} key
 * @param {*} val
 */
function def(obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: true,
    writable: true,
    configurable: true
  })
}
