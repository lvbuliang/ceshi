const path = require('path');
const { name, port } = require('./package');
function resolve(dir) {
    return path.join(__dirname, dir);
}
const dev = process.env.NODE_ENV === 'development';
let baseUrl = dev? 'http://172.20.19.160:81' : '';
baseUrl += '/front-res/plugins';

const cdn = {
    js: [
        `${baseUrl}/vue/vue.js`,
        `${baseUrl}/element-ui/index.js`,
        `${baseUrl}/sr-qiankun-ui/sr-ui.js`,
    ],
    css: [`${baseUrl}/sr-qiankun-ui/theme-chalk/index.css`],
};

module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/'!!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: dev? `//localhost:${port}` : '/decl',
    chainWebpack: (config) => {
        // 1. 优化html-webpack-plugin配置，添加CDN资源注入
        config.plugin('html').tap((args) => {
            args[0].cdn = cdn;
            return args;
        });

        // 2. 更精细的代码分割配置，优化懒加载相关问题
        config.optimization.splitChunks({
            chunks: 'all',
            maxSize: 300000, // 适当调小最大块大小，避免过大块加载问题
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // 优先打包初始依赖的第三方库
                },
                commons: {
                    name: 'chunk-commons',
                    test: resolve('src/components'),
                    minChunks: 2, // 降低最小共用次数要求，使更多组件能被合理拆分
                    priority: 5,
                    reuseExistingChunk: true
                },
                // 新增：针对项目中自定义的工具类等模块的代码块分组
                utils: {
                    name: 'chunk-utils',
                    test: resolve('src/utils'),
                    minChunks: 1,
                    priority: 6,
                    chunks: 'all'
                },
                // 新增：针对业务逻辑相关的公共模块分组，比如多个页面共用的业务服务模块等
                businessCommon: {
                    name: 'chunk-business-common',
                    test: resolve('src/services'),
                    minChunks: 2,
                    priority: 7,
                    chunks: 'all'
                }
            }
        });

        config.module
        .rule('js')
        .include
        .add(/\.vue$/)
        .add(resolve('src'))
        .end()
        .use('babel')
        .loader('babel-loader')

    },
    outputDir: 'dist',
    assetsDir: 'static',
    filenameHashing: true,
    // tweak internal webpack configuration.
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    devServer: {
        // host: '0.0.0.0',
        hot: true,
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
        // 4. 添加错误处理相关配置，例如在构建时遇到错误不直接中断构建（可根据实际需求调整严格程度）
        optimization: {
            noEmitOnErrors: false // 原本默认为true，设置为false使得构建出错时仍生成部分可用文件，便于排查问题
        }
    },
// 微应用 vue.config.js
css: {
    extract: true, // 提取CSS为单独文件
  },
    // 5. 新增：生产环境下对资源文件添加哈希值，便于浏览器更好地缓存更新后的文件，避免旧文件缓存导致的问题
    productionSourceMap: false, // 关闭生产环境的source map，减小文件体积，若需要调试可设为true

};