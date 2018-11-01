# mvvm
vue 响应式原理demo

## 基础数据劫持
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>mvvm</title>
  <link href="css.css" rel="stylesheet">
</head>
<body>
  <div id="app">
    <pre>
            <code>
var model = {
    a: <span id="model-a"></span>,
    b: { d: 20 },
    c: 1
}
            </code>
        </pre>
    <button id="add">页面点击让model.a加1</button>
    <div>
      <span>当前model.a的值：</span>
      <span id="model-a-val"></span>
    </div>
  </div>
  <script src="util.js"></script>
  <script src="dep.js"></script>
  <script src="observe.js"></script>
  <script src="watcher.js"></script>
  <script>
    var model = {
      a: 10,
      b: { d: 20 },
      c: 1
    }

    var $ = selector => document.querySelector(selector)

    // 劫持所有属性
    observe(model)

    $('#model-a').innerHTML = model.a
    $('#model-a-val').innerHTML = model.a

    // 观察a属性
    new Watcher(model, 'a', function (nVal, oVal) {
      $('#model-a').innerHTML = nVal
      $('#model-a-val').innerHTML = nVal
    })

    // 绑定事件
    $('#add').addEventListener('click', function () {
      console.log('改变前innerHTML', $('#model-a').innerHTML)
      model.a++
      console.log('改变后innerHTML', $('#model-a').innerHTML)
    })
  </script>
</body>
</html>
```

## 完整mvvm实现
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>mvvm</title>
  <link href="css.css" rel="stylesheet">
</head>
<body>
  <div id="app">
    <input type="text" v-model="name">
    <p>{{ getHello }}</p>
    <div>
      <span>i的值为：</span>
      <span v-text="i"></span>
    </div>
    <button v-on:click="clickBtn">执行i++</button>
    <pre>{{ obj }}</pre>
    <div>
      <span>obj.b:</span>
      <span>{{ obj.b }}</span>
    </div>
    <button v-on:click="changeObjB">修改obj.b</button>
  </div>

  <script src="util.js"></script>
  <script src="dep.js"></script>
  <script src="observe.js"></script>
  <script src="watcher.js"></script>
  <script src="compile.js"></script>
  <script src="mvvm.js"></script>
  <script>
    const vm = new Mvvm({
      el: '#app',
      data() {
        return {
          name: 'nashaofu',
          i: 0,
          obj: {
            a: 1,
            b: 2
          }
        }
      },
      computed: {
        getHello() {
          return 'Hello ' + this.name + ' !';
        }
      },
      watch: {
        i(nVal, oVal) {
          console.log(nVal, oVal)
        },
        'obj.b': (nVal, oVal) => {
          console.log('obj.b:', nVal, oVal)
        }
      },
      methods: {
        clickBtn() {
          this.i++
        },
        changeObjB() {
          this.obj.b++
          this.obj = this.obj
        }
      }
    })
    console.log(vm)
  </script>
</body>
</html>
```
