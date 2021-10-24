const ip = '192.168.19.8'
// const ip = '58.0.191.167'

module.exports = {
  chainWebpack: config =>{
    config.plugin('html')
      .tap(args => {
        args[0].title = "会议信息";
        return args;
      })
  },
  devServer: {
    open: true,
    proxy: {
      '/serverApi': {
        target: `http://${ip}:8910`, // 目标地址
        changeOrigin: true,
        pathRewrite: {
          '^/serverApi': ''
        }
      }
    }
  }
}
