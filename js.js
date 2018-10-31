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
new Watcher(model, 'a', function(nVal, oVal) {
  $('#model-a').innerHTML = nVal
  $('#model-a-val').innerHTML = nVal
})

// 绑定事件
$('#add').addEventListener('click', function() {
  console.log('改变前innerHTML', $('#model-a').innerHTML)
  model.a++
  console.log('改变后innerHTML', $('#model-a').innerHTML)
})
