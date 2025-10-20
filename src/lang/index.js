import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUS from './locales/en-US.js'
import zhCN from './locales/zh-CN.js'

import ElementLocale from 'element-ui/lib/locale'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'

const messages = {
    'en-US': { ...enUS, ...enLocale },
    'zh-CN': { ...zhCN, ...zhLocale }
}

Vue.use(VueI18n)

// 获取浏览器语言设置
const navigatorLang = navigator.language || 'en-US'
const defaultLang = Object.keys(messages).includes(navigatorLang)
    ? navigatorLang
    : 'en-US'

// 创建 i18n 实例
const i18n = new VueI18n({
    locale: localStorage.getItem('lang') || defaultLang,
    fallbackLocale: 'en-US',
    messages,
    numberFormats: {
        'en-US': {
            currency: {
                style: 'currency',
                currency: 'USD'
            }
        },
        'zh-CN': {
            currency: {
                style: 'currency',
                currency: 'CNY'
            }
        }
    },
    dateTimeFormats: {
        'en-US': {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
            }
        },
        'zh-CN': {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
            }
        }
    }
})

ElementLocale.i18n((key, value) => i18n.t(key, value))
export default i18n