const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}

const cdn = {
  // 忽略打包的第三方库
  externals: {},

  // 通过cdn方式使用
  js: [],
  css: [],
};

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
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, {limit: 10000})
      );

    // config.when(process.env.NODE_ENV === 'production', config => {
    //   config.output.filename('js/[name].[contenthash:7].js').chunkFilename('js/[name].[contenthash:7].js').end();
    //   config.plugin('extract-css').tap(args => [{
    //     filename: 'css/[name].[contenthash:7].css',
    //     chunkFilename: 'css/[name].[contenthash:10].css'
    //   }])
    // })
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload');
    // 配置cdn引入
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn;
      return args;
    });
  },
  configureWebpack: (config) => {
    config.plugins.push(
      new CompressionPlugin({
        test: /\.(js|css|html)$/,//需要压缩的文件正则
        threshold: 10240,//文件大小大于这个值时启用压缩
        deleteOriginalAssets: false//压缩后保留原文件
      })
    )
    config.plugins.push(
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'] // 移除console
          }
        }
      })
    )
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
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          //采用多进程打包
          parallel: 4,
          terserOptions: {
            compress: {
              // 去除debug、console
              warnings: true,
              drop_debugger: true,
              drop_console: true
            } }
        })
      ],
      // 分割代码块
      splitChunks: {
        // chunks:'all',
        // maxSize: 480 * 1024, // 控制包的最大字节数
        cacheGroups: {
          //公用模块抽离
          common: {
            name: 'common',
            chunks: 'initial',
            priority: 2,
            minChunks: 2,
          },
          //第三方库抽离
          vendor: {
            priority: 1, //权重
            test: /node_modules/,
            chunks: 'initial',
            minSize: 0, //大于0个字节
            minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
          },
        },
      }
    }
  },

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: false,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项cc
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
