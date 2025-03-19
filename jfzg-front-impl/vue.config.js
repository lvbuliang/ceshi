const path = require('path')
const { name, port } = require('./package')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const dev = process.env.NODE_ENV === 'development'
let baseUrl = dev ? 'http://172.20.19.160:81' : ''
baseUrl += '/front-res/plugins'
const cdn = {
  js: [
    `${baseUrl}/vue/vue.js`,
    `${baseUrl}/element-ui/index.js`,
    `${baseUrl}/sr-qiankun-ui/sr-ui.js`,
  ],
  css: [`${baseUrl}/sr-qiankun-ui/theme-chalk/index.css`],
}
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: dev ? `//localhost:${port}` : '/impl',
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn
      return args
    })
    config.optimization.splitChunks({
      chunks: 'all',
      maxSize: 500000,
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial', // only package third parties that are initially dependent
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    })
  },
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    // https: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/': {
        target: 'https://assess-dev.jfh.com/jfassessserver',
        changOrigin: true,
      },
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
    externals: {
      vue: 'Vue',
      'element-ui': 'ElementUI',
    },
  },
// 微应用 vue.config.js
css: {
  extract: true, // 提取CSS为单独文件
},
}
