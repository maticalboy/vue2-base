import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUS from './locales/en-US.js'
import zhCN from './locales/zh-CN.js'
import deDE from './locales/de-DE.js'
import frFR from './locales/fr-FR.js'
import esES from './locales/es-ES.js'
import itIT from './locales/it-IT.js'
import ptPT from './locales/pt-PT.js'

import ElementLocale from 'element-ui/lib/locale'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'
import deLocale from 'element-ui/lib/locale/lang/de'
import frLocale from 'element-ui/lib/locale/lang/fr'
import esLocale from 'element-ui/lib/locale/lang/es'
import itLocale from 'element-ui/lib/locale/lang/it'
import ptLocale from 'element-ui/lib/locale/lang/pt'

const messages = {
    'en-US': { ...enUS, ...enLocale },
    'zh-CN': { ...zhCN, ...zhLocale },
    'de-DE': { ...deDE, ...deLocale },
    'fr-FR': { ...frFR, ...frLocale },
    'es-ES': { ...esES, ...esLocale },
    'it-IT': { ...itIT, ...itLocale },
    'pt-PT': { ...ptPT, ...ptLocale }
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
        },
        'de-DE': {
            currency: {
                style: 'currency',
                currency: 'EUR'
            }
        },
        'fr-FR': {
            currency: {
                style: 'currency',
                currency: 'EUR'
            }
        },
        'es-ES': {
            currency: {
                style: 'currency',
                currency: 'EUR'
            }
        },
        'it-IT': {
            currency: {
                style: 'currency',
                currency: 'EUR'
            }
        },
        'pt-PT': {
            currency: {
                style: 'currency',
                currency: 'EUR'
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
        },
        'de-DE': {
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
        'fr-FR': {
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
        'es-ES': {
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
        'it-IT': {
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
        'pt-PT': {
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
