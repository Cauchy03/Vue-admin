'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// 如果端口设置为80
// 使用管理员权限执行命令行
// 例如, Mac: sudo npm run
// 您可以通过以下方式修改端口:
// port = 9528 npm run dev 或者 npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// 所有配置项说明均可在 https://cli.vuejs.org/config/
module.exports = {
  /**
   * 如果你计划在子路径下部署站点，则需要设置publicPath,
   * 例如GitHub Pages. 如果您计划将站点部署到 https://foo.github.io/bar/,
   * 那么publicPath应该设置为 "/bar/".
   * 在大多数情况下请使用 '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,//关闭默认语法检查
  productionSourceMap: false,
  devServer: {
    // 设置代理服务器
    proxy: {
      '/dev-api': {
        target: 'http://39.98.123.211:8170',
        pathRewrite: { '^/dev-api': '' },
        ws: true,// 用于支持websocket
        changeOrigin: true//用于请求控制头host值
      },
      '/api': {
        target: 'http://39.98.123.211:8510',
        pathRewrite: { '^/api': '' },
        ws: true,// 用于支持websocket
        changeOrigin: true//用于请求控制头host值
      }
    },
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // 在webpack的name字段中提供应用程序的标题
    // 可以在index.html中访问它以注入正确的标题
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // 它可以提高第一个屏幕的速度，建议打开预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 当页面很多时，会导致太多无意义的请求
    config.plugins.delete('prefetch')

    // 设置svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  },
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ]
}
