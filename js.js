;(function() {
  var a = {
    c: 10,
    e: { c: 20 },
    d: 1
  }

  console.log(a)
  var $ = selector => document.querySelector(selector)

  // 劫持所有属性
  observe(a)

  // 观察a.c
  // new Watcher(a, 'c', function(n, o) {
  //   console.log('a.c', n, o)
  // })

  // new Watcher(a, 'c', function(n, o) {
  //   console.log('a.c2', n, o)
  // })

  // new Watcher(a, 'e', function(n, o) {
  //   console.log(n, o)
  // })

  new Watcher(a, 'd', function(n, o) {
    $('#ad').innerHTML = n
  })

  $('#ad').innerHTML = a.d
  $('#add').addEventListener('click', function() {
    console.log('改变前innerHTML', $('#ad').innerHTML)
    a.d++
    console.log('改变后innerHTML', $('#ad').innerHTML)
  })
})()
