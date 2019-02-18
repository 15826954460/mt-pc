const pkg = require("./package");

module.exports = {
  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { hid: "description", name: "description", content: pkg.description }],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: [
    "element-ui/lib/theme-chalk/reset.css", // 第三方的css样式，通过node_modules模块来加载
    "element-ui/lib/theme-chalk/index.css",
    "@/assets/css/main.css" // 引入自定义的css文件(这里的引用将会被全局使用,页面级别的使用@import来引入)
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/element-ui"],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    // 通过modules引入axios对象，将会直接挂载在实例上面
  ],
  // 设置axios代理
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // proxy: true
  },
  // axios 跨域代理访问
  proxy: {
    // '/api': {
    //   target: 'xxx.target.com',
    //   pathRewrite: { '^/api': '' }
    // }
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/
        // })
      }
    }
  }
};
