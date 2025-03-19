const { port } = require("./package");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
//https://jfzgdev.jiefanghao.com12.13
let baseUrl =
  process.env.NODE_ENV === "development" ? "http://172.20.19.160:81" : "";
baseUrl += "/front-res/plugins";
const cdn = {
  js: [
    `${baseUrl}/vue/vue.js`,
    `${baseUrl}/element-ui/index.js`,
    `${baseUrl}/sr-qiankun-ui/sr-ui.js`,
  ],
  css: [`${baseUrl}/sr-qiankun-ui/theme-chalk/index.css`],
};
module.exports = {
  productionSourceMap: false,
  // publicPath: './',
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn;
      return args;
    });
    // Configure TerserPlugin to remove console and debugger statements in production
    config.optimization.minimizer("terser").tap((args) => {
      args[0].terserOptions = {
        ...args[0].terserOptions,
        compress: {
          ...args[0].terserOptions.compress,
          drop_console: true, // Remove console statements
          drop_debugger: true, // Remove debugger statements
        },
      };
      return args;
    });
    config.optimization.splitChunks({
      chunks: "all",
      maxSize: 500000,
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial", // only package third parties that are initially dependent
        },
        commons: {
          name: "chunk-commons",
          test: resolve("src/components"), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    });
  },
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    // https: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/Bing": {
        target: "https://cn.bing.com/",
        changeOrigin: true,
        pathRewrite: {
          "^/Bing": "",
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "./src/assets/css/variables/variables.scss";`,
      },
    },
        // 确保CSS被提取，而不是通过JavaScript动态注入
        extract: true
  },
  configureWebpack: {
    externals: {
      vue: "Vue",
      "element-ui": "ElementUI",
    },
    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  },
};
