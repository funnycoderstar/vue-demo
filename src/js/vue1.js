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