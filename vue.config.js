const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    lintOnSave: false,
    transpileDependencies: true,
    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                'vue': path.resolve('./node_modules/vue'),
                'element-ui': path.resolve(__dirname, 'node_modules/element-ui'),
                '@': path.resolve('src'),
            }
        },
    }
})
