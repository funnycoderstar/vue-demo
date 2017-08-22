> 自己动手实现数据的双向绑定

##### 目前实现了v-model, {{}}, v-on, v-bind的绑定
```
git clone https://github.com/funnycoderstar/vue-demo.git

然后打开根目录的index.html

最好看着代码看效果
```
- [参考一](https://segmentfault.com/a/1190000010487690#articleHeader5)
- [参考二](https://github.com/DMQ/mvvm)
- [参考三](https://github.com/youngwind/blog/issues/85#issuecomment-301400937)
- [参考四](https://segmentfault.com/a/1190000004847657)

#### 实现过程,直接上代码

##### 1,实现简单的v-model的绑定
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>实现v-model的绑定</title>
</head>
<body>
    <input type="text" id="input" v-model="a"/>
    <p>可以打开控制台,然后输入vm.查看view到model的绑定;然后改变input的值,再次在控制台输出vm.查看model到view的绑定</p>
    <!-- <script src="https://cdn.bootcss.com/vue/2.4.2/vue.js"></script> -->
    <script src="../js/vue1.js"></script>
    <script>
        window.vm = new Vue({
            data: {
                b: 10000,
                a: 1
            },
            el: '#input'
        });
        setInterval(() => {
            vm.a++;
        }, 1000);
    </script>
</body>
</html>
```

```js
function Vue(data) {
    const input = document.querySelector(data.el);
    let model = input.getAttribute('v-model');
    if(!data.data) {
        console.warn(`你没有定义data`);
        return;
    }
    if(model && data.data.hasOwnProperty(model)){
        // 实现model到view的绑定
        input.value = data.data[model];
        Object.defineProperty(this, model, {
            configurable: true,
            enumerable: true,
            get: function() {
                return data.data[model];
            },
            set: function(newVal) {

                input.value = data.data[model] = newVal;
            },
        })
        // 实现view到model的绑定
        input.addEventListener("input", () => {
            this[model] = input.value;
        });
    } else {
        console.warn(`你没有定义${model}属性`);
        return;
    }
}
```


##### 2,实现多个v-model的绑定

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>实现多个v-model的绑定</title>
</head>
<body>
    <div id="form">
        <input type="text" v-model="a" />
        <br />
        <input type="text" v-model="b" />
        <div>
            <input type="text" v-model="c" />
        </div>
    </div>
    <script src="../js/vue2.js"></script>
    <!-- <script src="https://cdn.bootcss.com/vue/2.4.2/vue.js"></script> -->
    <script>
        window.vm = new Vue({
            data: {
                a: 0,
                b: 100,
                c: 2,
            },
            el: '#form'
        });
    </script>
</body>
</html>

```

```js
function Vue(data) {
    const input = document.querySelectorAll('input');
    for (const item of input) {
        let model = item.getAttribute('v-model');
        item.value = data.data[model];
        Object.defineProperty(this, model, {
            configurable: true,
            enumerable: true,
            get: function () {
                return data.data[model];
            },
            set: function (newVal) {
                item.value = data.data[model] = newVal;
            },
        })
        item.addEventListener("input", () => {
            this[model] = item.value;
        });
    }

}

```

##### 3,实现{{}}的绑定
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>实现{{}}的绑定</title>
</head>
<body>
    <div id="form">
        <input type="text" v-model="a" />
        <input type="text" v-model="a" />
        <p>{{ a  }}</p>
        <br />
        <input type="text" v-model="b" />
        {{ b }}
        <div>
            <input type="text" v-model="c" />
            <p>{{ c  }}</p>
            <p>{{ c  }}</p>
        </div>
    </div>
    <script src="../js/vue3.js"></script>
    <!-- <script src="https://cdn.bootcss.com/vue/2.4.2/vue.js"></script> -->
    <script>
        window.vm = new Vue({
            data: {
                a: 0,
                b: 100,
                c: 2,
            },
            el: '#form'
        });
        console.log(vm);
    </script>
</body>
</html>
```

```js
function Vue(data) {
    const input = document.querySelectorAll('input');
    for (const item of input) {
        let model = item.getAttribute('v-model');
        item.value = data.data[model];
        Object.defineProperty(this, model, {
            configurable: true,
            enumerable: true,
            get: function () {
                return data.data[model];
            },
            set: function (newVal) {
                item.value = data.data[model] = newVal;
            },
        })
        item.addEventListener("input", () => {
            this[model] = item.value;
        });
    }
    const pss = document.querySelector(data.el).childNodes;
    let ps = [];
    let arr = [];
    function getText(value) {
        for (var i = 0, len = value.length; i < len; i++) {
            if (value[i].nodeType === 1) {
                getText(value[i].childNodes);
            } else if (value[i].nodeType === 3) {
                ps.push(value[i]);
            }
        }
    }
    getText(pss);
    const reg = /{{(.*)}}/;
    ps.forEach((i) => {
        if (reg.test(i.nodeValue)) {
            arr.push(i);
        }
    });
    console.log(arr);
    for (const p of arr) {
        let $p = reg.exec(p.nodeValue)[0].slice(2, p.nodeValue.length - 2).replace(/\s/g, '');
        p.nodeValue = data.data[$p];
        Object.defineProperty(this, $p, {
            configurable: true,
            enumerable: true,
            get: function () {
                return data.data[$p];
            },
            set: function (newVal) {
                p.nodeValue = data.data[$p] = newVal;
            },
        })
    }
}

// 错在多次赋值被覆盖的错误,所以思路应该变为找到所有绑定a, b, c的值,然后统一赋值
```


##### 4,实现v-bind,v-on的绑定

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Vue</title>
</head>
<body>
    <div id="form">
        <h4>这是测试v-model的效果</h4>
        <input type="text" v-model="a" />
        <input type="text" v-model="a" />
        <hr>
        <h4>这是测试{{}}的效果</h4>
        <div>{{ a }}</div>
        <p>{{ a }}</p>
        {{ a }}{{ b }} <br />
        <input type="text" v-model="b" />
        <p>{{ b }}</p>
        <div>
            <input type="text" v-model="c" />
            <p>{{ c }}</p>
        </div>
        <hr>
        <h4>这是测试v-bind和v-on的效果</h4>
        <img v-bind:src="src" v-bind:width="width1" :height="height" v-on:click="log" />
        <p>打开控制台,点击img,查看v-on的绑定效果</p>
    </div>
    <script src="../js/vue.js"></script>
    <!-- <script src="https://cdn.bootcss.com/vue/2.4.2/vue.js"></script> -->
    <script>
        window.obj = {
            a: 0,
            b: 100,
            c: '这是测试',
            src: "http://cdn.suisuijiang.com/message_1492395396308.png?imageView2/2/w/40/h/40",
            width1: 100,
            height: 100,
        };
        window.vm = new Vue({
            el: '#form',
            data: obj,
            methods: {
                log: function() {
                    console.log('你点击了图片');
                    console.log(`当前c的值为 ${this.c}`);
                }
            }
        });
    </script>
</body>
</html>
```
```js
/**
 * 解析dom指令
 * @param {*} $dom 根节点
 * @param {*} instructs 解析结果
 */
function handleInstruct($dom, instructs = {}) {
    function addInstruct(model, type, $node) {
        if (instructs[model]) {
            if (instructs[model][type]) {
                instructs[model][type].push($node);
            } else {
                instructs[model][type] = [$node];
            }
        } else {
            instructs[model] = {
                [type]: [$node]
            };
        }
    }

    if ($dom.attributes) {
        for (const attr of $dom.attributes) {
            if (attr.name === 'v-model') {
                const model = $dom.getAttribute('v-model');
                addInstruct(model, 'model', $dom);
            } else if (/^(v-bind|:)/.test(attr.nodeName)) {
                const parseResult = attr.nodeName.match(/^(?:v-bind)?:([a-zA-Z_$][a-zA-Z0-9_$]*)/);
                if (parseResult && parseResult[1]) {
                    addInstruct(attr.nodeValue.trim(), 'bind', {
                        $dom,
                        attr: parseResult[1]
                    });
                }
            } else if (/^(v-on|@)/.test(attr.name)) {
                const parseResult = attr.name.match(/^(?:v-on:|@)?([a-zA-Z_$][a-zA-Z0-9_$]*)/);
                if (parseResult && parseResult[1]) {
                    addInstruct(attr.nodeValue.trim(), 'on', {
                        $dom,
                        event: parseResult[1]
                    });
                }
            }
        }
    }

    if ($dom.childNodes) {
        for (const $child of $dom.childNodes) {
            switch ($child.nodeType) {
                // ELEMENT_NODE
                case 1: {
                    handleInstruct($child, instructs);
                    break;
                }
                // TEXT_NODE
                case 3: {
                    const parseResult = $child.data.match(/{{[ ]*([a-zA-Z_$][a-zA-Z0-9_$]*)[ ]*}}/g);
                    if (parseResult) {
                        parseResult.forEach(x => {
                            const model = x.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/);
                            if (model) {
                                addInstruct(model, 'expression', {
                                    $dom: $child,
                                    exp: $child.data
                                });
                            }
                        });
                    }
                    break;
                }
                default:
                    break;
            }
        }
    }

    return instructs;
}

function updateDom(vm, instructs, model, shouldRegisterEvent = false) {
    // 实现v-model的绑定
    if (instructs[model].model) {
        for (const $el of instructs[model].model) {
            $el.value =  vm[model];
            if (shouldRegisterEvent) {
                $el.oninput = () => {
                    this[model] = $el.value;
                };
            }
        }
    }
    // 实现{{}}的绑定
    if (instructs[model].expression) {
        for (let { $dom, exp } of instructs[model].expression) {
            const parseResult = exp.match(/{{[ ]*([a-zA-Z_$][a-zA-Z0-9_$]*)[ ]*}}/g);
            if (parseResult) {
                parseResult.forEach(x => {
                    const m = x.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/);
                    if (m) {
                        exp = exp.replace(new RegExp(`{{[ ]*${m[0]}[ ]*}}`), vm[m[0]]);
                    }
                });
            }
            $dom.textContent = exp;
        }
    }
    // 实现v-bind的绑定
    if (instructs[model].bind) {
        for (const {$dom, attr} of instructs[model].bind) {
            $dom.setAttribute(attr, vm[model]);
        }
    }
}

function Vue(params) {
    const $dom = document.querySelector(params.el);
    if (!$dom) {
        console.error(`dom "${params.el}" not exist`);
        return;
    }

    const vm = {};
    const instructs = handleInstruct($dom);
    // console.log(instructs);

    for (const model in instructs) {
        if (model && params.data && Object.prototype.hasOwnProperty.call(params.data, model)) {
            vm[model] = params.data[model];
            Object.defineProperty(this, model, {
                get: function() {
                    return vm[model];
                },
                set: function(newValue) {
                    vm[model] = newValue;
                    updateDom(vm, instructs, model);
                }
            });
            updateDom.call(this, vm, instructs, model, true);
        }
        // 实现v-on的绑定
        if (instructs[model].on) {
            for (const { $dom, event } of instructs[model].on) {
                $dom.addEventListener(event, params.methods[model].bind(this));
            }
        }
    }
}

window.Vue = Vue;
```

