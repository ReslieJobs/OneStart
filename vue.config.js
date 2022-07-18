const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/bdlx':{
        target: "http://suggestion.baidu.com",
        changeOrigin:true,
        pathRewrite:{
            '^/bdlx':''
        }
      },
      '/bing':{
        target: "https://cn.bing.com/HPImageArchive.aspx",
        changeOrigin:true,
        pathRewrite:{
            '^/bing':''
        }
      }
    }
  },
  pwa: {
    name: 'OneStart',
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    iconPaths: {
      faviconSVG: null,
      favicon: 'img/favicon.png',
      favicon64: 'img/favicon.png',
      favicon32: 'img/favicon.png',
      favicon16: 'img/favicon.png',
      appleTouchIcon: 'img/icon.png',
      maskIcon: 'img/icon.png',
      msTileImage: 'img/icon.png'
    },
    manifestOptions: {
      icons: [
        {
          'src': 'img/icon.png',
          'sizes': '192x192',
          'type': 'image/png'
        },
        {
          'src': 'img/icon.png',
          'sizes': '512x512',
          'type': 'image/png'
        },
        {
          'src': 'img/icon.png',
          'sizes': '192x192',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': 'img/icon.png',
          'sizes': '512x512',
          'type': 'image/png',
          'purpose': 'maskable'
        }
      ],
      background_color: '#ffffff'
    }
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  },
  chainWebpack: config => {
    //设置标题  默认不设置的话是项目名字
    config.plugin('html').tap(args => {
      args[0].title = "起始页"
      return args
    })
  },
  transpileDependencies: true,
  productionSourceMap: false
})
