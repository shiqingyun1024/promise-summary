/*
 ** 自定义promise函数模块：IIFE
 */
(function (window) {
    /*
     ** promise构造函数
     ** excutor：执行器函数（同步执行）
     */
    function Promise(excutor) {
        this.status = 'pending' // 给promise对象指定status属性，初始值为pending
        this.data = undefined // 给promise对象指定一个用于存储结果数据的属性
        this.callbacks = [] // 每个元素的结构：{ onResolved(){}, onRejected(){}}

        function resolve(value) {
            // 如果当前状态不是pending，直接结束
            if(this.status!=='pending'){
                return
            }
            // 将状态改为resolved
            this.status = 'resolved'
            // 保存value数据
            this.data = value
            // 如果有待执行callback函数，立即异步执行回调函数onResolved
            if (this.callbacks.length > o) {
                setTimeout(() => { // 放入队列中执行所有成功的回调
                    this.callbacks.forEach(callbacksobj => {
                        callbacksobj.onResolved(value)
                    });
                })
            }

        }

        function reject(reason) {
            if(this.status!=='pending'){
                return
            }
            // 将状态改为rejected
            this.status = 'rejected'
            // 保存value数据
            this.data = reason
            // 如果有待执行callback函数，立即异步执行回调函数onRejected
            if (this.callbacks.length > o) {
                setTimeout(() => { // 放入队列中执行所有失败的回调
                    this.callbacks.forEach(callbacksobj => {
                        callbacksobj.onRejected(reason)
                    });
                })
            }
        }
        // 立即同步执行excutor
        // 使用try catch是因为防止直接throw抛出错误，这个时候既没有调resolve，也没有调reject，直接抛出错误了
        try{
            excutor(resolve, reject)
        }catch(error){  // 如果执行器抛出异常，promise对象变为rejected状态
            reject(error)
        }
        
    }

    /*
     ** Promise原型对象的then()
     ** 指定成功和失败的回调函数
     ** 返回一个新的promise对象
     */
    Promise.prototype.then = function (onResolved, onRejected) {

    }
    /*
     ** Promise原型对象的catch()
     ** 指定失败的回调函数
     ** 返回一个新的promise对象
     */
    Promise.prototype.catch = function (onRejected) {

    }

    /*
     ** Promise函数对象的resolve方法
     ** 返回一个指定结果的成功的promise对象
     */
    Promise.resolve = function (value) {

    }

    /*
     ** Promise函数对象的reject方法
     ** 返回一个指定reason的失败的promise对象
     */
    Promise.reject = function (reason) {

    }

    /*
     ** Promise函数对象的reject方法
     */
    Promise.reject = function (reason) {

    }

    /*
     ** Promise函数对象的all方法
     ** 返回一个Promise，只有当所有promise都成功才成功，否则只要有一个失败的就都失败
     */
    Promise.all = function (promises) {

    }

    /*
     ** Promise函数对象的race方法
     ** 返回一个Promise，其结果由第一个完成的promise来决定
     */
    Promise.race = function (promises) {

    }

    /*
     ** Promise函数对象的allSettled方法
     */
    Promise.allSettled = function (promises) {

    }


    // 向外暴露promise函数
})(window)