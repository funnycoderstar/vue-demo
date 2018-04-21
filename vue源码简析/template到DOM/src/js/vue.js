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