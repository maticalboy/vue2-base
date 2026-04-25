import Vue from 'vue'

/**
 * 自动获取焦点的自定义指令  ---范晓翰 2024.3.8
 */
Vue.directive('focus', {
    bind() { },
    // 当被绑定的元素插入到 DOM 中时
    inserted(el, binding, vnode) {
        el.querySelector('input').focus()
    },
    update: function (el, binding, vnode) {
        el.querySelector('input').focus()
    },
    componentUpdated() { },
    unbind() { }
})
