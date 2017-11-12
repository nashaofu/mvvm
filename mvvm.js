var uid = 0
function Dep () {
  this.uid = ++uid
  this.dep = []
}
Dep.prototype = {
  depend () {
    Dep.target.addDep(this)
  },
  notify () {
    this.dep.forEach(item => {
      item.update()
    })
  }
}
Dep.target = null

function defineReactive (obj, key, val) {
  var dep = new Dep()
  def(obj, '__dep__', dep)
  observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set (nVal) {
      val = nVal
      observe(val)
      dep.notify()
    }
  })
}

function Watcher (obj, exp, callback) {
  this.obj = obj
  this.callback = callback || function () { }
  this.getter = this.parseGetter(exp)
  this.dep = {}
  //初始化时，触发添加到监听队列
  this.uid = ++uid
  this.value = this.get()
}

Watcher.prototype = {
  addDep (dep) {
    if (!this.dep[dep.uid]) {
      dep.dep.push(this)
      this.dep[dep.uid] = dep
    }
  },
  get: function () {
    Dep.target = this;
    var value = this.getter.call(this.obj, this.obj)
    console.dir('get:')
    console.dir(value)
    // 在parseExpression的时候，with + eval会将表达式中的变量绑定到vm模型中，在求值的时候会调用相应变量的getter事件。
    // 由于设置了Dep.target，所以会执行observer的add.sub方法，从而创建了一个依赖链。
    Dep.target = null;
    return value;
  },
  update: function () {
    var newVal = this.get()
    // 这里有可能是对象/数组，所以不能直接比较，可以借助JSON来转换成字符串对比
    this.callback(newVal, this.value)
  },
  parseGetter: function (exp) {
    if (/[^\w.$]/.test(exp)) return;

    var exps = exp.split('.');

    return function (obj) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }
      return obj;
    }
  }
}
function observe (value) {
  if (!value || typeof value !== 'object' || value.__dep__ instanceof Dep) {
    return
  }
  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key])
  })
}

function def (obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: true,
    writable: true,
    configurable: true
  })
}

var a = {
  c: 10,
  e: { c: 20 }
}
observe(a)
console.log(a)

new Watcher(a, 'c', function (n, o) {
  console.log('a.c', n, o)
})
new Watcher(a, 'c', function (n, o) {
  console.log('a.c2', n, o)
})
new Watcher(a, 'e', function (n, o) {
  console.log(n, o)
})
console.log(a)

