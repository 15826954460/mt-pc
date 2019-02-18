const Koa = require("koa");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt"); // 引用 nuxt 模块

/**************  以下部分为引入第三方包  ************/

const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser"); // 处理post相关的请求
const session = require("koa-generic-session"); // 处理session相关的数据结合 koa-redis 来使用
const Redis = require("koa-redis"); // 引用redis
const json = require("koa-json"); // 处理服务端像客户端返回的json格式化
const dbConfig = require("./dbs/config"); // 引用数据库相关配置
const passport = require("./interface/utils/passport");
const users = require("./interface/users"); // 引用模块的路由
const geo = require("./interface/geo");
const search = require("./interface/search");

/**************  以上部分为引入第三方包  **************/

const app = new Koa();

/*****************  以下部分为代解读代码  ***************/
app.keys = ["mt", "keyskeys"];
app.proxy = true;

// 和session相关的处理
app.use(
  session({
    key: "mt",
    prefix: "mt:uid",
    store: new Redis()
  })
);

// 扩展类型的数据格式
app.use(
  bodyParser({
    extendTypes: ["json", "form", "text"]
  })
);
app.use(json());

// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
});

// 出口登陆相关的session
app.use(passport.initialize());
app.use(passport.session());

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js");
config.dev = !(app.env === "production");
/***************  以上部分为代解读代码  ***************/

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  const { host = process.env.HOST || "127.0.0.1", port = process.env.PORT || 3000 } = nuxt.options.server;

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  /*****************  以下部分为代注释代码  ***************/

  app.use(users.routes()).use(users.allowedMethods()); // 引用用户模块路由
  // app.use(geo.routes()).use(geo.allowedMethods());
  // app.use(search.routes()).use(search.allowedMethods());

  /***************  以上部分为注释代码  ***************/

  app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });

  app.listen(port, host); // 监听域名的端口号

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();
