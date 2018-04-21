/**
 * 1.深入data的响应式
 * 2.watch函数
 * 3.computed函数
 */
 function Observer(data) {
     // 遍历参数data的属性,给添加到this上
     for(let key of Object.keys(data)) {
         if(typeof data[key] === 'object') {
             data[key] = new Observer(data[key]);
         }
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                console.log('你访问了' + key);
                return data[key]; // 中括号法可以用变量作为属性名,而点方法不可以;
            },
            set: function(newVal) {
                console.log('你设置了' + key);
                console.log('新的' + key + '=' + newVal);
                if(newVal === data[key]) {
                    return;
                }
                data[key] = newVal;
            }
        })
     }
     
 }

const app1 = new Observer({
    name: '小明',
    age: 14,
})
const app2 = new Observer({
    city: 'beijing'
});
app1.name; // 访问data上面的name属性

// 给Observer加一个观察者
Observer.prototype.$watch = function(key, cb) {
    let value = this[key];
    Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('你订阅了' + key);
            return value;
        },
        set: function(newVal) {
            console.log(`检测到${key}值发生了变化,当前值为${newVal}`);
            cb(newVal); 
            value = newVal;
            return newVal;
        }
    })
};

app1.$watch('age', function(newVal) {
    console.log(`我年纪变了,我现在${newVal}岁了`);
})

app1.age = 19;