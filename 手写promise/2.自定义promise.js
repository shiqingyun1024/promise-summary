/*
** 自定义promise函数模块：IIFE
*/ 
(function(window){
/*
** promise构造函数
** excutor：执行器函数（同步执行）
*/ 
function Promise(excutor){

}

/*
** Promise原型对象的then()
** 指定成功和失败的回调函数
** 返回一个新的promise对象
*/ 
Promise.prototype.then = function(onResolved,onRejected){

}
/*
** Promise原型对象的catch()
** 指定失败的回调函数
** 返回一个新的promise对象
*/ 
Promise.prototype.catch = function(onRejected){

}

/*
** Promise函数对象的resolve方法
** 返回一个指定结果的成功的promise对象
*/ 
Promise.resolve = function(value){

}

/*
** Promise函数对象的reject方法
** 返回一个指定reason的失败的promise对象
*/ 
Promise.reject = function(reason){

}

/*
** Promise函数对象的reject方法
*/ 
Promise.reject = function(reason){

}

/*
** Promise函数对象的all方法
** 返回一个Promise，只有当所有promise都成功才成功，否则只要有一个失败的就都失败
*/ 
Promise.all = function(promises){

}

/*
** Promise函数对象的race方法
** 返回一个Promise，其结果由第一个完成的promise来决定
*/ 
Promise.race = function(promises){

}

/*
** Promise函数对象的allSettled方法
*/ 
Promise.allSettled = function(promises){

}


// 向外暴露promise函数
})(window)