/*
 ** 自定义Promise函数模块：IIFE
 */
(function (window) {
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
            if(self.status!=='pending'){
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
            if(self.status!=='pending'){
                return
            }
            // 将状态改为rejected
            self.status = 'rejected'
            // 保存value数据
            self.data = reason
            // 如果有待执行callback函数，立即异步执行回调函数onRejected
            if (self.callbacks.length > o) {
                setTimeout(() => { // 放入队列中执行所有失败的回调
                    self.callbacks.forEach(callbacksobj => {
                        callbacksobj.onRejected(reason)
                    });
                })
            }
        }
        // 立即同步执行excutor
        // 使用try catch是因为防止直接throw抛出错误，这个时候既没有调resolve，也没有调reject，直接抛出错误了
        try{
            excutor(resolve, reject)
        }catch(error){  // 如果执行器抛出异常，Promise对象变为rejected状态
            reject(error)
        }
        
    }
    /*
    ** 如果回调函数返回是promise，return的promise结果就是这个promise的结果
    */ 
   try{
       const result = onResolved(self.data)
    // 3.如果回调函数返回是promise，return的promise结果就是这个promise的结果
    if(result instanceof Promise){
        result.then(resolve,reject)
    }else{
    // 3.如果回调函数返回不是promise，return的promise就会成功，value就是返回的值
       resolve(result)
    }   
   }catch(error){
    //  1.如果抛出异常，return的promise就会失败，reason就是error
    reject(error)
   }

    /*
     ** Promise原型对象的then()
     ** 指定成功和失败的回调函数
     ** 返回一个新的Promise对象
     */
    Promise.prototype.then = function (onResolved, onRejected) {
      const self = this
      // 假设当前状态还是pending状态，将回调函数保存起来
      self.callbacks.push({
        onResolved, 
        onRejected
      })
    }
    /*
     ** Promise原型对象的catch()
     ** 指定失败的回调函数
     ** 返回一个新的Promise对象
     */
    Promise.prototype.catch = function (onRejected) {
        const self = this

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