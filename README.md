# vue源码简析

阅读vue的源码不仅可以深入的理解vue中的问题,还可以学习vue的程序设计;
简析的版本为 v2.5.16

# 前言

目前主要有
- vue响应式原理
- virtual-dom
- template到DOM

注: 每个模块里都包含了对vue源码对应部分的解析,还包含了一个简单的小例子;

# 需要知道的一些javaScript基础

[flow.js](https://zhenyong.github.io/flowtype/docs/five-simple-examples.html#_)

## Object.protoType

## Object.defineProperty()


## Object.getOwnPropertyDescriptor()

## Object.create()

## Object.keys()

## apply, call

## import, export 的复合写法:
在一个模块之中,先输入后输出同一个模块, import, export 语句可以写在一起;
```js
export { foo, bar } from 'my_module';
// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };

// 整体输出
export * from 'my_module';
```
上面代码中, import, export 语句可以结合在一起,写成一行,但是需要注意的是,写成一行后, foo和bar实际并没有导入当前模块,只是相对与外转发了这两个接口,导致当前模块不能使用foo和bar


