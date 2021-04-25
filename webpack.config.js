const { resolve } = require('path')
const WebpackUserscript = require('webpack-userscript')

module.exports = {
    mode: 'production',
    entry: './src/main.js',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'app.js',
        clean: true
    },
    module: {},
    plugins: [
        new WebpackUserscript({ // https://cowsay.blog/post/431d1mdg/
            headers: {
                namespace: 'https://github.com/NekoChanTaiwan',
                license: 'MIT',
                match: 'https://nhentai.net/*',
                grant: ['none'],
                require: [
                    'https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js',
                    'https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js',
                    'https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.js',
                    'https://cdn.jsdelivr.net/gh/821938089/finder@2.0.0.1/finder.js'
                ]
            },
            metajs: false,
            pretty: true
        })
    ]
}