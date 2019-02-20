const Router = require("koa-router");
const Redis = require("koa-redis");
const nodeMailer = require("nodemailer");
const User = require("../dbs/models/users");
const Passport = require("./utils/passport");
const Email = require("../dbs/config");
const axios = require("./utils/axios");

// 创建一个路由对象
let router = new Router({
  prefix: "/users" // 添加路由访问前缀
});

// 声明一个对象，获取redis静态资源
let Store = new Redis().client;

/** -----注册接口----- */
router.post("/signup", async ctx => {
  /** 获取请求参数
   * post ctx.request.body
   * get  ctx.request.url
   */
  const { username, password, email, code } = ctx.request.body;

  if (code) {
    // 获取验证码 nodemail 属于约定方式，如何存就如何取
    const saveCode = await Store.hget(`nodemail:${username}`, "code");
    // 获取过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, "expire");
    // 验证码对比
    if (code === saveCode) {
      // 判断是否过期
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: "验证吗已过期，请重新尝试"
        };
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: "请填写正确的验证码"
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: "请填写验证码"
    };
  }

  // 从数据库中进行查找用户名，用来判断数据是否已经存在
  let user = await User.find({
    username
  });

  if (user.length) {
    ctx.body = {
      code: -1,
      msg: "用户名已被注册"
    };
    return;
  }
  
  // 创建用户名(User.create是mongoose数据表中自带的方法)
  let nuser = await User.create({
    username,
    password,
    email
  });

  if (nuser) {
    let res = await axios.post("/users/signin", {
      username,
      password
    });
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: "注册成功",
        user: res.data.user
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "error"
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: "注册失败"
    };
  }
});
/** -----登录接口----- */
router.post("/signin", async (ctx, next) => {
  return Passport.authenticate("local", function(err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      };
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: "登录成功",
          user
        };
        return ctx.login(user);
      } else {
        ctx.body = {
          code: 1,
          msg: info
        };
      }
    }
  })(ctx, next);
});

router.get("/fix", async ctx => {
  //Store.hset(`test`, "name", "111");
  ctx.session.name = "nidie";
  ctx.body = {
    code: 0
  };
});
/**
 * -----邮箱发送接口-----
 */
router.post("/verify", async (ctx, next) => {
  let username = ctx.request.body.username;
  const saveExpire = await Store.hget(`nodemail:${username}`, "expire");
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: "验证请求过于频繁，1分钟内1次"
    };
    return false;
  }

  // 发送对象
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  });

  // 接收信息
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  };

  // 邮件中显示的内容
  let mailOptions = {
    from: `认证邮件<${Email.smtp.user}>`,
    to: ko.email,
    subject: "《慕课网高仿美团网全栈实战》注册码", // 邮件主题
    html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的邀请码是${ko.code}` // 邮件内容
  };

  // 发送邮件
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    } else {
      // 如果发送成功，将数据存储起来
      Store.hmset(`nodemail:${ko.user}`, "code", ko.code, "expire", ko.expire, "email", ko.email);
    }
  });
  // 响应主体内容
  ctx.body = {
    code: 0,
    msg: "验证码已经发送，可能会有延时，有效期1分钟"
  };
});
/**
 * 退出登录
 */
router.get("/exit", async (ctx, next) => {
  await ctx.logout();
  // 是否注销操作
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0 // 使用0来代表请求接口成功
    };
  } else {
    ctx.body = {
      code: -1
    };
  }
});
/**
 * 获取用户信息
 */
router.get("/getUser", async ctx => {
  // 判断是否登录状态
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user;
    ctx.body = {
      user: username,
      email
    };
  } else {
    ctx.body = {
      user: "",
      email: ""
    };
  }
});

module.exports = router;
