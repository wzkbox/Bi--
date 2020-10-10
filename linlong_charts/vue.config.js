module.exports = {
  publicPath: '/bi',
  // eslint 中的 semi代码规范 解决制表符错误 useEslint:false
  lintOnSave: false,
  devServer: {
    proxy: {  //配置跨域
      '/agent': {
        target: 'http://192.168.1.220:5001',  //这里后台的地址模拟的;应该填写你们真实的后台接口
        ws: true,
        changOrigin: true,  //允许跨域
        pathRewrite: {
          '^/agent': ''  //请求的时候使用这个api就可以
        }
      }
    }
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}
