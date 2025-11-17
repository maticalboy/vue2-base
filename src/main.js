import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/element_modify.less'
import './assets/css/vue_color_modify.less'

import 'vue-color/vue2/style.css';

import App from './App.vue';

import router from './router'

import i18n from './lang'

// 当页面进行缩放时，下拉框等位置会出现偏差，需要将缩放倍数考虑进去进行计算弹框的位置
import './util/element-ui-bug-fixed.js'

// 引入mavon-editor 第三方markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 生产环境注册 Service Worker 网络资源缓存减少带宽流量
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker 注册成功：', registration.scope);
                // 监听 SW 更新（可选）
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'waiting') {
                            console.log('有新的 Service Worker 待激活');
                            // 可提示用户刷新页面
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Service Worker 注册失败：', error);
            });
    });
}

Vue.use(mavonEditor)
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