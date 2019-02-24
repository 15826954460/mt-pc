const Koa = require("koa");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt"); // 引用 nuxt 模块

/**************  以下部分为引入第三方包  ************/

const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser"); // 处理post相关的请求,方便获取请求参数
const session = require("koa-generic-session"); // 处理session相关的数据结合 koa-redis 来使用
const Redis = require("koa-redis"); // 引用redis
const json = require("koa-json"); // 处理服务端像客户端返回的json格式化
const dbConfig = require("./dbs/config"); // 引用数据库相关配置
const passport = require("./interface/utils/passport");

/** 引入路由模块 */
const users = require("./interface/users"); // 引用模块的路由
const persons = require("./interface/person");
const geo = require("./interface/geo");
const search = require("./interface/search");
const categroy = require("./interface/categroy");
const cart = require("./interface/cart");
const order = require("./interface/order");

/**************  以上部分为引入第三方包  **************/

const app = new Koa();

/*****************  以下部分为代解读代码  ***************/
app.keys = ["mt", "keyskeys"]; // cookie 设置秘钥
app.proxy = true;

// 将鉴权后的用户身份保存在cookie中
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

// 开启koa-passport对session的支持
app.use(passport.initialize()); // initialzie()函数的作用是只是简单为当前context添加passport字段，便于后面的使用
app.use(passport.session()); // 则是passport自带的策略，用于从session中提取用户信息

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
  app.use(users.routes()).use(users.allowedMethods());

  // 引用用户模块路由
  app.use(persons.routes()).use(persons.allowedMethods());
  app.use(geo.routes()).use(geo.allowedMethods());
  app.use(search.routes()).use(search.allowedMethods());
  app.use(categroy.routes()).use(categroy.allowedMethods());
  app.use(cart.routes()).use(cart.allowedMethods());
  app.use(order.routes()).use(order.allowedMethods());
  
  /***************  以上部分为注释代码  ***************/
  // 路由必须放在该部分之前
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
