import Vue from 'vue'
Vue.directive('dialog-keyboard', {
    bind(el, binding, vnode) {
        // 保存原始的事件处理函数
        const handleKeydown = (event) => {
            const keyMap = binding.value;

            // // 修复：检测事件目标是否为输入元素
            // const isInputElement =
            //     event.target.tagName === 'INPUT' ||
            //     event.target.tagName === 'TEXTAREA' ||
            //     event.target.isContentEditable;

            // // 如果是输入元素，跳过全局键盘事件处理
            // if (isInputElement) {
            //     return;
            // }

            // 检查按下的键是否有对应的处理函数
            if (keyMap && keyMap[event.key]) {
                event.preventDefault();
                // keyMap[event.key].call(vnode.context, event);
                const handlerConfig = keyMap[event.key];

                // 支持两种配置方式：
                // 1. 直接传递函数（向后兼容）
                // 2. 传递对象 { handler: 函数, args: 参数数组 }
                if (typeof handlerConfig === 'function') {
                    // 直接调用函数，传递事件对象
                    handlerConfig.call(vnode.context, event);
                } else if (handlerConfig && typeof handlerConfig.handler === 'function') {
                    // 调用函数并传递参数
                    const args = handlerConfig.args || [];
                    // 事件对象作为最后一个参数传递
                    handlerConfig.handler.call(vnode.context, ...args, event);
                }
            }
        };

        // 将处理函数保存到元素上，以便在unbind中移除
        el._keyboardHandler = handleKeydown;
    },

    inserted(el, binding, vnode) {
        // 获取对话框的根元素（通常是遮罩层）
        const getDialogRoot = () => {
            let parent = el;
            while (parent && parent.parentElement) {
                if (parent.classList && parent.classList.contains('el-dialog__wrapper')) {
                    return parent;
                }
                parent = parent.parentElement;
            }
            return document.body;
        };

        // 添加键盘事件监听
        const dialogRoot = getDialogRoot();
        dialogRoot.addEventListener('keydown', el._keyboardHandler);

        // 保存对话框根元素引用
        el._dialogRoot = dialogRoot;
    },

    unbind(el, binding, vnode) {
        // 移除事件监听
        if (el._dialogRoot && el._keyboardHandler) {
            el._dialogRoot.removeEventListener('keydown', el._keyboardHandler);
        }
    },
});