
> 查看 [vue源码](https://github.com/vuejs/vue/tree/dev/src) src/core/observer 目录下实现的vue的响应式


# 1.array.js  监听数组变化

array.js 监听数组变化, 实现了对改写数组原型来监听数组的变化,主要改写的有 push(), pop(), shift(), unshift(),splice(), sort(), reverse() 7中方法,主要分为两类

1.push(), unshift(), slice()可能会给数组添加新元素
2.其余不会新增元素


经常要用到的函数 def

def，在整个 Vue 源码中反复出现，利用Object.defineProperty() 在 obj 上定义属性 key（也又可能是修改已存在属性 key）：

```js
/**
 * Define a property.
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    // 转变为 boole 值，如果不传参，转为 false
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```
为了避免污染全局的Array,新建一个以 Array.prototype为原型的对象而后再这个对象本身附加属性,再把这个新建的对象作为原型或者作为属性添加到 Observer 的 value 中，来达到监视其变化的目的。

```js

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
```

遍历需要触发更新的几个方法,依次将其附加到 arrayMethods 上：

```js
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 获取原始的数组操作方法
  const original = arrayProto[method]
  // 在arrayMethods上新建属性method, 并为method 指定值(函数)
  // 即改写 arrayMethods 上的同名数组方法
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    // 存放新增数组元素
    let inserted
    // 对三个可能新增元素的方法单独考虑
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
     // 对新增元素进行 getter、setter 绑定
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 通知元素发生了变化
    ob.dep.notify()
    return result
  })
})

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
```
完整的Observer代码如下

```js

export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    
    if (Array.isArray(value)) {
      /*
      * 如果是数组,将修改后的可以监听数组元素变化的方法替换掉原型中的原生方法,达到可以监听到数组数据变化
      * 如果浏览器支持 _proto_, 直接把对象的 proto 指向这一组方法,如果不支持,则遍历这一组方法，依次添加到对象中，作为隐藏属性（即 enumerable: false，不能被 in 关键字找到）:
      */
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  
// 直接覆盖原型的方法来修改目标对象或数组
function protoAugment (target, src: Object, keys: any) {
    target.__proto__ = src
}
// 遍历这一组方法，依次添加到对象中，作为隐藏属性（即 enumerable: false，不能被 in 关键字找到）
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```

## Dep

Dep类是一个发布者,可以订阅多个观察者,依赖收集之后Deps会存在一个或多个Watcher对象,在数据变更的时候通知所有watcher

不理解的地方: 观察者模式; 哈希表,怎么给每个DOM元素生成哈希值

> 观察者模式, 类似在微信公众平台订阅了公众号,当他有新的文章发表后,就会推送给我们所有订阅的人


## Watcher

Watcher是一个观察者对象,依赖收集以后watcher对象会被保存在Deps, 数据变动的时候会由于Deps通知Watcher实例,然后由Watcher实例回调cb进行视图的更新


执行getter的时候收集依赖, 执行setter的时候通知依赖,进行数据修改