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
        item.addEventListener("oninput", () => {
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