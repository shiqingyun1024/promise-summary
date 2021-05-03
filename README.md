# promise-summary
promise相关的总结

## 1、准备
### 1.1、区别实例对象与函数对象
```
1、实例对象：new函数产生的对象，称为实例对象，简称为对象
2、函数对象：将函数作为对象使用时，简称为函数对象

function Fn(){

}
const fn = new Fn()
console.log(Fn.prototype)
Fn.bind({})
$('#test')
$.get('/test')
```
### 1.2、两种类型的回调函数
#### 1.2.1、同步回调
```
1、理解：立即执行，完全执行完了才结束，不会放入回调队列中
2、例子：数组遍历相关的回调函数/promise的excutor函数
```
#### 1.2.2、异步回调
```
1、理解：不会立即执行，会放入回调队列中将来执行。
2、例子：定时器回调 / ajax回调 / Promise的成功|失败的回调
```
### 1.3、js的error处理
#### 1.3.1、错误的类型
```
1、Error：所有错误的父类型
2、ReferenceError：引用的变量不存在
3、TypeError：数据类型不正确的错误
4、RangeError：数据值不在其所允许的范围内
5、SyntaxError：语法错误
```
#### 1.3.2、错误处理
```
1、捕获错误：try ... catch
2、抛出错误：throw error
```
#### 1.3.3、错误对象
```
message属性：错误相关信息
stack属性：函数调用栈记录信息
```
