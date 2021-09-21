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
## 2、Promise的理解和使用
what why how
### 2.1、Promise是什么？
#### 2.1.1、理解
```
1、抽象表达：
   Promise是JS中进行异步编程的新的解决方案(旧的是谁？)

2、具体表达：
（1）、从语法上来说：Promise是一个构造函数
（2）、从功能上来说：Promise对象用来封装一个异步操作并可以获取其结果   

```
#### 2.1.2、Promise的状态改变
```
1、pendding变为resolved
2、pendding变为rejected
说明：只有这2种，且一个promise对象只能改变一次
     无论变成成功还是失败，都会有一个结果数据
     成功的结果数据一般称为value，失败的结果数据一般称为reason
```
#### 2.1.3、Promise的基本流程
```
// 1. 创建一个新的promise对象
new Promise((resolve,reject)=>{ // 执行器函数
// 2.执行异步操作函数
  setTimeout(()=>{
     const time = Date.now() // 如果当前时间是偶数就代表成功，否则代表失败
     // 3.1 如果成功了，调用resolve(value)
     if(time%2===0){
        resolve('成功的数据，time='+time)
     }else{
        // 3.2 如果失败了，调用reject(reason)
        reject('失败的数据，time='+time)
     }
  },1000)


})
p.then(
   value =>{ // 接收得到成功的value数据  onResolved
     console.log(value)
   },
   reason =>{ // 接收得到失败的reason数据  onRejected
     console.log(reason)
   }
)
```
### 2.2、为什么要用Promise？

#### 2.2.1、指定回调函数的方式更加灵活
```
1、旧的：必须在启动异步任务前指定
2、promise：启动异步任务 => 返回promise对象 =>给promise对象绑定回调函数（甚至可以在异步任务结束后指定/多个）
```
#### 2.2.2、支持链式调用，可以解决回调地狱问题
```
什么是回调地狱？回调函数嵌套调用，外部回调函数异步执行的结果是嵌套的回调函数执行的条件
回调地狱的缺点？不便于阅读 、不便于异常处理
解决方案？promise链式调用
终极解决方案? async/await
```
### 2.3、如何使用Promise？
#### 2.3.1、API
```
1、Promise构造函数：Promise(excutor){}
(1) excutor函数：同步执行 执行器 (resolve,reject)=>{}
(2) resolve函数：内部定义成功时我们调用的函数 value=>{}
(3) reject函数：内部定义失败时我们调用的函数 reason=>{}
说明excutor会在Promise内部立即同步回调，异步操作在执行器中执行。
2、Promise.prototype.then 方法:(onResolved,onRejected)也就是((value)=>{},(reason)=>{})
  onResolved函数：成功的回调函数 (value)=>{}
  onRejected函数：成功的回调函数 (reason)=>{}
  说明：指定用于得到成功value的成功回调和用于得到失败reason的失败回调
       返回一个新的promise对象
3、Promise.prototype.catch方法：(onRejected) 也就是((reason)=>{})  
   onRejected函数：失败的回调函数(reason)=>{} 
   说明：then()的语法糖，相当于：then(undefined, onRejected)   
4、Promise.resolve方法：(value)=>{}
   value: 成功的数据或Promise对象
   说明：返回一个成功/失败的promise对象    
5、Promise.reject方法：(reason)=>{}
   reason: 失败的原因
   说明：返回一个失败的promise对象  
6、Promise.all方法：(promises)=>{}
   promises: 包含n个promise的数组
   说明：返回一个新的promise，只有所有的promise都成功才成功，只要有一个失败了就直接失败
7、Promise.race方法：(promises)=>{}
   promises: 包含n个promise的数组
   说明：返回一个新的promise，第一个完成的promise的结果状态就是最终的结果状态 

   对比展示
   // 产生一个成功值为1的promise对象
   const p1 = new Promise((resolve,reject)=>{
      resolve(1)
   })
   const p2 = Promse.resolve(2)   
   const p3 = Promse.reject(3)  
   p1.then(value=>{console.log(value)}) 
   p2.then(value=>{console.log(value)}) 
   p3.catch(reason=>{console.log(reason)}) 

   const pAll = Promise.all([p1,p2,p3])
   pAll.then(values=>{
      console.log('all onResolved()',values)
   },
   reason=>{
      console.log('all onRejected()',reason)
   })
   const pRace = Promise.race([p1,p2,p3])
   pRace.then(value=>{
      console.log('race onResolved()',value)
   },
   reason=>{
      console.log('race onRejected()',reason)
   })
```
#### 2.3.2、promise的几个关键问题

##### 2.3.2.1、如何改变promise的状态？
```
(1)、resolve(value):如果当前是pendding就会变为resolved
(2)、reject(reason):如果当前是pendding就会变为rejected
(3)、抛出异常：如果当前是pendding就会变为rejected
const p = new Promise((resolve,reject)=>{
   // throw new Error('出错了') // 抛出异常，promise就会变为rejected，reason为抛出的error
   throw 3 // 抛出异常，promise就会变为rejected，reason为抛出的3
})
console.log(p)
```

##### 2.3.2.2、一个promise指定多个成功/失败回调函数，都会调用吗？
```
   会，当promise改变为对应状态时都会调用
```
##### 2.3.2.3、改变promise状态和指定回调函数谁先谁后？
```
(1)、都有可能，正常情况下是先指定回调函数再改变状态，但也可以先改状态再指定回调
(2)、如何先改状态再指定回调？
在执行器中直接调用resolve()/reject()
延迟更长时间才调用then()

// 常规：先指定回调函数，后改变的状态
new Promise((resolve,reject)=>{
   setTimeout(()=>{
      resolve(1)  // 后改变的状态（同时指定数据），异步执行回调函数
   },1000)
}).then( // 先指定回调函数，保存当前的回调函数
   value=>{},
   reason=>{console.log('reason',reason)}
)
new Promise((resolve,reject)=>{
      resolve(1)  // 先改变的状态（同时指定数据），保存当前的状态
}).then( // 后指定回调函数，异步执行回调函数
   value=>{console.log('value',value)},
   reason=>{console.log('reason',reason)}
)
(3) 什么时候才能得到数据？
如果先指定的回调，那当状态发生改变时，回调函数就会调用，得到数据
如果先改变的状态，那当指定回调时，回调函数就会调用，得到数据
(4)
```
##### 2.3.2.4. promise.then()返回的新的promise的结果状态由什么决定？
```
(1)简单表达：由then()指定的回调函数执行的结果决定
(2)详细表达：
  如果抛出异常，新promise变为rejected，reason为抛出的异常
  如果返回的是非promise的任意值，新的promise变为resolved，value为返回的值
  如果返回的是另外一个新的promise，此promise的结果就会成为新promise的结果
  如果返回的是一个异步函数，要用new promise()进行处理

new Promise((resolve,reject)=>{
   resolve(1)
}).then(
   value=>{
      console.log('onResolved1()',value)
      // return 2  // resolve
      // return Promise.resolve(3) // resolve
      // return Promise.reject(4)  // reject
      throw 5  // reject
   },
   reason=>{  // 这个函数返回的结果和它是失败的回调函数没关系，如果它返回的是return 2，那么下面的回调函数会调用resolve回调函数
      console.log('onRejected1()',reason) 
      // return 2  // resolve
      // return Promise.resolve(3) // resolve
      // return Promise.reject(4)  // reject
      throw 5  // reject
   }
).then(
   value=>{
      console.log('onResolved2()',value)
   },
   reason=>{
      console.log('onRejected2()',reason)
   }
)
```

##### 2.3.2.5.promise如何串联多个操作任务
```
（1）promise的then()返回一个新的promise，可以看成then()的链式调用
（2）通过then的链式调用串联多个同步/异步任务
new Promise((resolve,reject)=>{
   setTimeout(()=>{
      console.log('执行任务1（异步）')
      resolve(1)
   },1000)
}).then(
   value=>{
      console.log('任务1的结果：',value)
      console.log('执行任务2（同步）')
      return 2
   }
).then(
   value=>{
      console.log('任务2的结果：',value)
      return new Promise((resolve,reject)=>{
         // 启动任务3（异步）
         setTimeout(()=>{
           console.log('执行任务3（异步）')
           resolve(3)
         },1000)
      })
   }
).then(
   value=>{
      console.log('执行任务3的结果：',value)
   }
)
```
##### 2.3.2.6.promise异常穿透
```
（1）、当使用promise的then链式调用时，可以在最后指定失败的回调，异常是一步一步传下来的
（2）、前面任何操作除了异常，都会传到最后失败的回调中处理
new Promise((resolve,reject)=>{
   reject(1)
}).then(
   value=>{
      console.log('onResolved1',value)
      return 2
   }
).then(
   value=>{
      console.log('onResolved2',value)
      return 3
   }
).then(
   value=>{
      console.log('onResolved3',value)
      return 4
   }
).catch(error=>{
   console.log(error)
})
在catch中输出1，因为是失败的回调。不是一下子就跳转到catch方法的，而是一步一步穿透下来的，相当于下面的这个流程
new Promise((resolve,reject)=>{
   reject(1)
}).then(
   value=>{
      console.log('onResolved1',value)
      return 2
   },
   reason => { throw reason }
).then(
   value=>{
      console.log('onResolved2',value)
      return 3
   },
   reason => { throw reason }
).then(
   value=>{
      console.log('onResolved3',value)
      return 4
   },
   reason => { throw reason }  // 或者写成 reason => Promise.reject(reason)
).catch(error=>{
   console.log(error)
})


```
#### 2.3.2.7.中断promise链
```
（1）当使用promise的then链式调用时，在中间中断，在调用后面的回调函数
（2）办法：在回调函数中返回一个pendding状态的promise对象
new Promise((resolve,reject)=>{
   reject(1)
}).then(
   value=>{
      console.log('onResolved1',value)
      return 2
   }
).then(
   value=>{
      console.log('onResolved2',value)
      return 3
   }
).then(
   value=>{
      console.log('onResolved3',value)
      return new Promise(()=>{})  // 返回一个pendding的promise 中断promise链
   }
).catch(error=>{
   console.log(error)
})

```
## 3、自定义(手写)Promise
### 3.1、定义整体结构
### 3.2、Promise构造函数的实现
### 3.3、promise.then()/catch()的实现
### 3.4、Promise.resolve()/reject()的实现
```
// 返回一个指定了成功value的promise对象
// 一般数据或promise
Promise.resolve = function (value){
   return new Promise((resolve,reject)=>{
      if(value instanceof Promise){
         value.then(resolve,reject)
      }else{
         resolve(value)
      }
   })
}
```
### 3.5、Promise.all()/race()的实现
```
   /*
     ** Promise函数对象的all方法
     ** 返回一个Promise，只有当所有Promise都成功才成功，否则只要有一个失败的就都失败
     */
    Promise.all = function (promises) {
        const values = new Array(promises.length) // 用来保存所有成功value的数组
        // 用来保存成功promise的数量
        let resolveCount = 0
        // 返回一个新的promise
        return new Promise((resolve,reject)=>{
            // 遍历promises获取每个promise的结果
            promises.forEach((p,index)=>{
                Promise.resolve(p).then(
                    value=>{ // p成功，将成功的value保存到values中
                        resolveCount++
                        values[index]= value

                        // 如果全部成功了，将return的promise改为成功。
                        if(resolveCount === promises.length){
                            resolve(values)
                        }

                    },
                    reason=>{ // 只要有一个失败了，return的promise就失败
                      reject(reason)
                    }
                )
            })
        })

    }


    /*
     ** Promise函数对象的race方法
     ** 返回一个Promise，其结果由第一个完成的Promise来决定
     */
    Promise.race = function (promises) {
        // 返回一个promise
        return new Promise((resolve,reject)=>{
            // 遍历promises获取每个promise的结果
            promises.forEach((p,index)=>{
                Promise.resolve(p).then(
                    value=>{ // 一旦第一个改变状态的成功了，return的promise就是成功的，而且是第一个改变状态的值。
                      resolve(value)
                    },
                    reason=>{ // 一旦有一个失败了，return的promise就失败
                      reject(reason)
                    }
                )
            })
        })
    }
```
### 3.6、Promise.resolveDelay()/rejectDelay()的实现
```
<!-- 返回一个延迟指定时间才确定结果的promise对象 -->
Promise.resolveDelay = function(value,time){
   return new Promise((resolve,reject)=>{
      setTimeout(()=>{
         if(value instanceof Promise){
            <!-- 如果value是一个promise，取这个promise的结果值作为返回的promise的结果值 -->
            value.then(resolve,reject) // 如果value成功，调用resolve(val),如果value失败了，调用reject(reason)
         }else{
            resolve(value)
         }
      },time)
   })
}
```
### 3.7、ES5 function完整版本
### 3.8、ES6 class完整版

## 4、async与await
### 4.1、mdn文档
### 4.2、async函数
```
1、函数的返回值为promise对象
2、promise对象的结果由async函数执行的返回值决定
```
### 4.3、await 表达式
```
1、await  右侧的表达式一般为promise对象，但也可以是其他的值
2、如果表达式是promise对象，await返回的是promise成功的值
```
### 4.4、注意
```
await必须写在async函数中，但是async函数中可以没有await
如果await的promise失败了，就会抛出异常，需要通过try...catch来捕获处理
```

## 5、JS异步之宏队列与微队列
### 5.1 原理图
![宏队列与微队列图](https://github.com/814657780/promise-summary/blob/main/手写promise/images/1.jpeg)
### 5.2 说明
```
1、JS中用来存储待执行回调函数的队列包含2个不同特定的队列
2、宏队列：用来保存待执行的宏任务（回调），比如：定时器回调（setTimeout、setInterval）/DOM事件回调/ajax回调
3、微队列：用来保存待执行的微任务（回调），比如：promise的回调/MutationObserver的回调 / async await
4、js执行时会区别这2个队列
（1）js引擎首先必须先执行所有的初始化同步任务代码
（2）每次准备取出第一个宏任务执行前，都要将所有的微任务一个一个取出来执行

微任务 > DOM渲染 > 宏任务
微任务是在DOM渲染之前触发
宏任务是在DOM渲染之后触发

```
## 6、promise相关面试题
```
```
## 7、event loop(事件循环/事件轮询)
- JS是单线程运行的
- 异步要基于回调来实现
- event loop就是异步回调的实现原理
### JS如何执行？
- 从前到后，一行一行执行。
- 如果某一行执行报错，则停止下面代码的执行。
- 先把同步代码执行完，再执行异步
### event loop的流程
```
主要流程是有：
1、Browser console  浏览器控制台
2、Call Stack  调用栈
3、Web APIs   web apis
4、callback queue 回调队列  --- 等调用栈空了之后，Event Loop 会一直轮询回调队列，如果有任务，就会加到调用栈中进行执行。
```
####  总结event loop的过程
- 同步代码，一行一行放在Call Stack（执行栈）执行
- 遇到异步，会先“记录下”，等待时机（定时，网络请求等）
- 时机到了，就移动到callback Queue（回调队列）
- 如果Call Stack为空（即同步代码执行完）Event Loop开始工作
- 轮询查找Callback Queue，如有则移动到Call Stack执行
- 然后继续轮询查找（永动机一样）
```
用自己的话术描述：
1、执行js代码的时候，是从上到下依次执行，遇到同步代码，会放在Call Stack（执行栈）中执行。
2、遇到异步代码，会先"记录下来"，也就是放在Web APIs里面，等待时机。
3、时机到了（就是如定时器时间到了，发送的请求后，数据响应回来了等），就移动到Callback Queue（回调队列）中。
4、如果Call Stack为空（即同步代码执行完）Event Loop开始工作
5、轮询查找Callback Queue，如有则移动到Call Stack执行。
6、然后等执行栈空了之后，继续轮询回调队列。
```
####  宏任务macroTask和微任务microTask
- 宏任务：setTimeout、setInterval、DOM事件回调、ajax回调、setImmediate(node)、requestAnimationFrame(浏览器)
- 微任务：promise的回调(.then、catch、finally)、MutationObserver的回调、async await、process.nextTick(node)
- 微任务执行时机比宏任务要早（记住）

### 回顾event loop过程（增加DOM渲染时机）
Call Stack 空闲 ---> 尝试DOM渲染 --->触发Event Loop
```
自己的话术去描述，每当Call Stack空闲时，都会去尝试DOM渲染，渲染完后，去触发Event loop，然后把任务放到Call Stack中执行，执行完后，如果Call Stack是空闲，那么就会尝试DOM渲染，渲染完后，去触发Event loop，然后把任务放到Call Stack中执行，执行完后，如果Call Stack是空闲，开始新一轮的循环。
```
### event loop 和 DOM渲染。
- 再次回归一遍event loop的过程。
- JS是单线程的，而且和DOM渲染公用一个线程。
- JS执行的时候，得留一些时机供DOM渲染。

总的来说，整个流程是：
- 每次Call Stack清空(即每次轮询结束)，即同步任务执行完。
- 都是DOM重新渲染的机会，DOM结构如有改变则重新渲染。
- 然后再去触发下一次Event Loop
一会会有个案例去证明这一点。

更进一步的流程是：
- 微任务：DOM渲染之前触发，如Promise
- 宏任务：DOM渲染之后触发，如setTimeout

为什么微任务在DOM渲染之前触发，宏任务在DOM渲染之后触发？
- 微任务是放在micro task queue（微任务队列）里面
- web APIs是浏览器定义的APIs，可以看宏任务这部分
- 微任务是ES6语法规定的（如：Promise）
- 宏任务是由浏览器规定的（如：setTimeout、setInterval、DOM回调，ajax回调等都是浏览器自己定义的api方法。）

总结上面的流程是：
1、Call Stack 清空。
2、执行当前的微任务。
3、尝试DOM渲染。
4、触发Event Loop，执行宏任务。

### 事件循环机制面试题
对于 面试题：说说事件循环机制(满分答案来了)这篇文章的理解（https://mp.weixin.qq.com/s/QgfE5Km1xiEkQqADMLmj-Q）
```
总的结论就是，执行宏任务，然后执行该宏任务产生的微任务，若微任务在执行过程中产生了新的微任务，则继续执行微任务，
微任务执行完毕后，再回到宏任务中进行下一轮循环。
```
#### async/await执行顺序 --- 重点（主要是这块的理解）
```
我们知道async隐式返回 Promise 作为结果的函数,那么可以简单理解为，await后面的函数执行完毕时，await会产生一个微任务(Promise.then是微任务)。但是我们要注意这个微任务产生的时机，它是执行完await之后，直接跳出async函数，执行其他代码(此处就是协程的运作，A暂停执行，控制权交给B)。其他代码执行完毕后，再回到async函数去执行剩下的代码，然后把await后面的代码注册到微任务队列当中
```











