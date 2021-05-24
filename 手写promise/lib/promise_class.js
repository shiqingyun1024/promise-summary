/*
 ** 自定义Promise函数模块：IIFE
 ** 重要的是先理解Promise函数内部的实现，以及一些原理，然后再根据自己理解去实现。
 */
(function (window) {
    const PENDING = 'pending'
    const RESOLVED = 'resolved'
    const REJECTED = 'rejected'

    class Promise {
        /*
         ** Promise构造函数
         ** excutor：执行器函数（同步执行）
         */
        constructor(excutor) {
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
            } catch (error) { // 如果执行器抛出异常，Promise对象变为rejected状态
                reject(error)
            }

        }
        /*
             ** Promise原型对象的then()===（同步执行的，只是根据状态来分别调不同的回调函数）
             ** 指定成功和失败的回调函数
             ** 返回一个新的Promise对象
             ** 返回promise的结果由onResolved/onRejected执行结果决定
             */
        then (onResolved, onRejected) {
            const self = this;
            // 指定回调函数的默认值（必须是函数）
            onResolved = typeof onResolved === 'function' ? onResolved : value => value
            onRejected = typeof onRejected === 'function' ? onRejected : reason => {
                throw reason
            }

            // 返回一个新的promise
            return new Promise((resolve, reject) => {
                /*
                执行指定的回调函数
                根据执行的结果改变return的promise的状态/数组
                
                */
                function handle(callback) {
                    /*
                     返回promise的结果由onResolved/onRejected执行结果决定
                     1、抛出异常，返回promise的结果为失败，reason为异常
                     2、返回的是promise，返回promise的结果就是这个结果
                     3、返回的不是promise，返回promise为成功，value就是返回值
                     */
                    try {
                        const result = callback(self.data)
                        if (result instanceof Promise) { // 2、返回的是promise，返回promise的结果就是这个结果
                            //   result.then(
                            //       value=> resolve(value),
                            //       reason=> reject(reason)
                            //   )

                            reasult.then(resolve, reject)
                        } else { // 3、返回的不是promise，返回promise为成功，value就是返回值
                            resolve(result)
                        }
                    } catch (error) { // 1、抛出异常，返回promise的结果为失败，reason为异常
                        reject(error)
                    }
                }
                // 当前promise的状态是resolved
                if (self.status === RESOLVED) {
                    // 立即异步执行成功的回调函数
                    setTimeout(() => {
                        handle(onResolved)
                    })
                } else if (self.status === REJECTED) { // 当前promise的状态是rejected
                    // 立即异步执行失败的回调函数
                    setTimeout(() => {
                        handle(onRejected)
                    })
                } else { // 当前promise的状态是pending
                    // 将成功和失败的回调函数保存callbacks容器中缓存
                    self.callbacks.push({
                        onResolved() {
                            handle(onResolved)
                        },
                        onRejected() {
                            handle(onRejected)
                        }
                    })
                }
            })
        }
        /*
         ** Promise原型对象的catch()===（同步执行的，只是根据状态来分别调不同的回调函数）
         ** 指定失败的回调函数
         ** 返回一个新的Promise对象
         */
        catch (onRejected) {
            // const self = this
            return this.then(undefined, onRejected)
        }

        /*
         ** Promise函数对象的resolve方法
         ** 返回一个指定结果的成功的Promise对象
         */
        static resolve (value) {
            // 返回一个成功/失败的promise
            return new Promise((resolve, reject) => {
                // value是promise
                if (value instanceof Promise) { // 因为这个时候value是promise，所以使用value的结果作为promise的结果
                    value.then(resolve, reject)
                } else { // value不是promise => promise变为成功，数据是value
                    resolve(value)
                }
            })
        }

        /*
         ** Promise函数对象的reject方法
         ** 返回一个指定reason的失败的Promise对象
         */
        static reject (reason) {
            // 返回一个失败的promise
            return new Promise((resolve, reject) => {
                reject(reason)
            })
        }

        /*
         ** Promise函数对象的all方法
         ** 返回一个Promise，只有当所有Promise都成功才成功，否则只要有一个失败的就都失败
         */
        static all (promises) {
            const values = new Array(promises.length) // 用来保存所有成功value的数组
            // 用来保存成功promise的数量
            let resolveCount = 0
            // 返回一个新的promise
            return new Promise((resolve, reject) => {
                // 遍历promises获取每个promise的结果
                promises.forEach((p, index) => {
                    Promise.resolve(p).then(
                        value => { // p成功，将成功的value保存到values中
                            resolveCount++
                            values[index] = value

                            // 如果全部成功了，将return的promise改为成功。
                            if (resolveCount === promises.length) {
                                resolve(values)
                            }

                        },
                        reason => { // 只要有一个失败了，return的promise就失败
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
        static race (promises) {
            // 返回一个promise
            return new Promise((resolve, reject) => {
                // 遍历promises获取每个promise的结果
                promises.forEach((p, index) => {
                    Promise.resolve(p).then(
                        value => { // 一旦第一个改变状态的成功了，return的promise就是成功的，而且是第一个改变状态的值。
                            resolve(value)
                        },
                        reason => { // 一旦有一个失败了，return的promise就失败
                            reject(reason)
                        }
                    )
                })
            })


        }

        /**
         * 返回一个promise对象。它在指定的时间后才确定结果
         * */
        static resolveDelay (value, time) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (value instanceof Promise) {
                        // 如果value是一个promise，取这个promise的结果值作为返回的promise的结果值
                        value.then(resolve, reject) // 如果value成功，调用resolve(val),如果value失败了，调用reject(reason)
                    } else {
                        resolve(value)
                    }
                }, time)
            })
        }

        /**
         * 返回一个promise对象。它在指定的时间后才失败
         * */
        static rejectDelay (reason, time) {
            // 返回一个失败的promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(reason)
                }, time)
            })
        }

        /*
         ** Promise函数对象的allSettled方法
         */
        allSettled (Promises) {
            const self = this


        }


    }



    // 向外暴露Promise函数
    window.Promise = Promise

})(window)