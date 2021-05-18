/*
 ** 自定义Promise函数模块：IIFE
 ** 重要的是先理解Promise函数内部的实现，以及一些原理，然后再根据自己理解去实现。
 */
(function (window) {
    const PENDING = 'pending'
    const RESOLVED = 'resolved'
    const REJECTED = 'rejected'
    /*
     ** Promise构造函数
     ** excutor：执行器函数（同步执行）
     */
    function Promise(excutor) {
        // 将当前Promise对象保存起来
        const self = this
        self.status = 'pending' // 给Promise对象指定status属性，初始值为pending
        self.data = undefined // 给Promise对象指定一个用于存储结果数据的属性
        self.callbacks = [] // 每个元素的结构：{ onResolved(){}, onRejected(){}}

        function resolve(value) {
            // 如果当前状态不是pending，直接结束
            if (self.status !== 'pending') {
                return
            }
            // 将状态改为resolved
            self.status = 'resolved'
            // 保存value数据
            self.data = value
            // 如果有待执行callback函数，立即异步执行回调函数onResolved
            if (self.callbacks.length > 0) {
                setTimeout(() => { // 放入队列中执行所有成功的回调
                    self.callbacks.forEach(callbacksobj => {
                        callbacksobj.onResolved(value)
                    });
                })
            }

        }

        function reject(reason) {
            if (self.status !== 'pending') {
                return
            }
            // 将状态改为rejected
            self.status = 'rejected'
            // 保存value数据
            self.data = reason
            // 如果有待执行callback函数，立即异步执行回调函数onRejected
            if (self.callbacks.length > 0) {
                setTimeout(() => { // 放入队列中执行所有失败的回调
                    self.callbacks.forEach(callbacksobj => {
                        callbacksobj.onRejected(reason)
                    });
                })
            }
        }
        // 立即同步执行excutor
        // 使用try catch是因为防止直接throw抛出错误，这个时候既没有调resolve，也没有调reject，直接抛出错误了
        try {
            excutor(resolve, reject)
        } catch (error) {  // 如果执行器抛出异常，Promise对象变为rejected状态
            reject(error)
        }

    }
    /*
     ** Promise原型对象的then()===（同步执行的，只是根据状态来分别调不同的回调函数）
     ** 指定成功和失败的回调函数
     ** 返回一个新的Promise对象
     */
    Promise.prototype.then = function (onResolved, onRejected) {
        // 向后传递成功的value
        onResolved = typeof onResolved === 'function'?onResolved:value=>value
        // 指定默认的失败的回调（实现异常穿透的关键点） 向后传递失败的reason
        onRejected = typeof onRejected === 'function'?onRejected:reason=>{throw reason}
        const self = this
        // 返回一个新的promise对象
        return new Promise((resolve, reject) => {
            /*
            **调用指定回调函数处理，根据执行结果，改变return的promise的状态
            */
            function handle(callback) {
                /*
                **1、如果抛出异常，return的promise就会失败，reason就是error
                **2、如果回调函数返回的不是promise，return的promise就会成功，value就是返回的值
                **3、如果回调函数返回是promise，return的promise结果就是这个promise的结果
                */
                try {
                    const result = callback(self.data)
                    // 3、如果回调函数返回是promise，return的promise结果就是这个promise的结果
                    if (result instanceof Promise) {
                        result.then(
                            value => resolve(value), // 当result成功时，让return的promise也成功
                            reason => reject(reason) // 当result失败时，让return的promise也失败
                        )
                        // result.then(resolve,reject)   
                    } else {
                        // 3、如果回调函数返回的不是promise，return的promise就会成功，value就是返回的值
                        resolve(result)
                    }
                } catch (error) {
                    // 1、如果抛出异常，return的promise就会失败，reason就是error
                    reject(error)
                }
            }

            // 当前状态是pending状态，将回调函数保存起来
            if (self.status === PENDING) {
                self.callbacks.push({
                    onResolved(value) {
                        handle(onResolved)
                    },
                    onRejected(reason) {
                        handle(onRejected)
                    }
                })
            } else if (self.status === RESOLVED) {  // 如果当前是resolved状态，异步执行onResolved并改变return的promise状态
                setTimeout(() => {
                    handle(onResolved)
                })
            } else { // 'rejected'  如果当前是rejected状态，异步执行onRejected并改变return的promise状态
                setTimeout(() => {
                    handle(onRejected)
                })
            }
        })
    }
    /*
     ** Promise原型对象的catch()===（同步执行的，只是根据状态来分别调不同的回调函数）
     ** 指定失败的回调函数
     ** 返回一个新的Promise对象
     */
    Promise.prototype.catch = function (onRejected) {
        // const self = this
        return this.then(undefined,onRejected)
    }

    /*
     ** Promise函数对象的resolve方法
     ** 返回一个指定结果的成功的Promise对象
     */
    Promise.resolve = function (value) {
        const self = this

    }

    /*
     ** Promise函数对象的reject方法
     ** 返回一个指定reason的失败的Promise对象
     */
    Promise.reject = function (reason) {
        const self = this

    }

    /*
     ** Promise函数对象的all方法
     ** 返回一个Promise，只有当所有Promise都成功才成功，否则只要有一个失败的就都失败
     */
    Promise.all = function (Promises) {
        const self = this

    }

    /*
     ** Promise函数对象的race方法
     ** 返回一个Promise，其结果由第一个完成的Promise来决定
     */
    Promise.race = function (Promises) {
        const self = this


    }

    /*
     ** Promise函数对象的allSettled方法
     */
    Promise.allSettled = function (Promises) {
        const self = this


    }


    // 向外暴露Promise函数
    window.Promise = Promise

})(window)