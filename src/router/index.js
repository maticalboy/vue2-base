import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/Home.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    }
]

let router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes
})


// router.beforeEach((async function beForEach(to, from, next) {
//     // 先判断是否有token，页面是否包含微信或支付宝的回调参数,如果有token并且不是回调页面，则获取用户信息，没有的话直接放行
//     if (getToken() && !((to.query.hasOwnProperty('code') && to.query.hasOwnProperty('state')) || (to.query.hasOwnProperty('auth_code') && to.query.hasOwnProperty('aliState')))) {
//         // 拉取用户信息，判断是否过期，如果过期则清除cookie
//         await router.app.$options.store.dispatch('pullUserInfo').then(resp => {
//             if (resp === null) {
//                 clearAllCookie()
//             }
//             next()
//         }).catch(() => {
//             clearAllCookie()
//             next()
//         })
//     }
//     else {
//         next()
//     }
// }))


export default router
