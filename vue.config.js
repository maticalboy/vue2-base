const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
    lintOnSave: false,
    transpileDependencies: true,


    css: {
        loaderOptions: {
            less: {
                additionalData: `@import "@/assets/css/global_style.less";`
            }
        },
    },
    devServer: {
        port: 9999,
        proxy: {
            '/CRGis': {
                target: 'http://10.0.0.201:8100/hacrgisv2new/v1/user/gate',
                changeOrigin: true,
                pathRewrite: {
                    '^/CRGis': ''
                }
            },
        }
    },

    productionSourceMap: false,

    configureWebpack: {
        output: {
            sourcePrefix: ' '
        },
        amd: {
            toUrlUndefined: true
        },

        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                'vue': path.resolve('./node_modules/vue'),
                'element-ui': path.resolve(__dirname, 'node_modules/element-ui'),
                '@': path.resolve('src'),
            }
        },

        plugins: [

        ],

        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vue: {
                        name: 'vue',
                        test: /[\\/]node_modules[\\/]vue/,
                        priority: 1
                    },
                    vuex: {
                        name: 'vuex',
                        test: /[\\/]node_modules[\\/]vuex/,
                        priority: 2
                    },
                    'vue-router': {
                        name: 'vue-router',
                        test: /[\\/]node_modules[\\/]vue-router/,
                        priority: 3
                    },
                    'element-ui': {
                        name: 'element-ui',
                        test: /[\\/]node_modules[\\/]element-ui/,
                        priority: 5
                    },
                    // 'ol': {
                    //     name: 'ol',
                    //     test: /[\\/]node_modules[\\/]ol/,
                    //     priority: 4
                    // },
                    'vendors': {
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -20
                    }
                }
            }
        }
    },

    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'vue2-基础副本',
            chunks: ['vendors', 'vue', 'vuex', 'vue-router', 'element-ui', 'index',]
        }
    },

})
