import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/element_modify.less'
import './assets/css/vue_color_modify.less'

import 'vue-color/vue2/style.css';

import App from './App.vue';

import router from './router'

import i18n from './lang'

// 兼容 Element
Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
})

new Vue({
    i18n,
    router,
    el: '#app',
    render: h => h(App)
});