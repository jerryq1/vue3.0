const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin")
function resolve(dir) {
  return path.join(__dirname, '.', dir);
}
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  // 输出文件目录
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
  transpileDependencies: [],
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  /**
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {
    config.module.rule('compile')
      .test(/\.js$/)
      .include
      .add(resolve('src'))
      .add(resolve('test'))
      .add(resolve('node_modules/webpack-dev-server/client'))
      .add(resolve('node_modules'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          ['@babel/preset-env', {
            modules: false
          }]
        ]
      });
    },
  configureWebpack: (config) => {
      config.resolve = { // 配置解析别名
      extensions: ['.js', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        'public': path.resolve(__dirname, './public'),
        'components': path.resolve(__dirname, './src/components'),
        'common': path.resolve(__dirname, './src/common'),
        'api': path.resolve(__dirname, './src/api'),
        'views': path.resolve(__dirname, './src/views'),
        'data': path.resolve(__dirname, './src/data')
      }
      }
      config.plugins.push(
      new CompressionPlugin({
        test: /\.(js|css|html)$/,//需要压缩的文件正则
        threshold: 10240,//文件大小大于这个值时启用压缩
        deleteOriginalAssets: false//压缩后保留原文件
      })
     )
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      // 如发现 css.requireModuleExtension 报错，请查看这里：http://www.web-jshtml.cn/#/detailed?id=12
      sass: {
        prependData: `@import "./src/styles/main.scss";`
      }
    },
    // 启用 css.requireModuleExtension for all css / pre-processor files.
    requireModuleExtension: true
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: true, // 编译完成是否打开网页
    // host: '127.0.0.1', // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    host: '0.0.0.0', // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8881, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: true, // 开启热加载
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'https://apigw.gialen.com/h5/req', //对应自己的接口
        changeOrigin: true,
        secure: true, // false为http访问，true为https访问
        pathRewrite: {
          '^/api': '/'
        }
      }
    }, // 设置代理
    overlay: { // 全屏模式下是否显示脚本错误
      warnings: true,
      errors: true
    },
    // before: app => {
    // }
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {}
}
