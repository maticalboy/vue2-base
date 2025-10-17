import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/element_modify.less'

import App from './App.vue';

import router from './router'

import i18n from './lang'

Vue.use(ElementUI);

new Vue({
    i18n,
    router,
    el: '#app',
    render: h => h(App)
});