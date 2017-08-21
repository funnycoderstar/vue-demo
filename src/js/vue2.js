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