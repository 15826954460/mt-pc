const Router = require("koa-router");
const Redis = require("koa-redis");
const nodeMailer = require("nodemailer");
const User = require("../dbs/models/users");
const Passport = require("./utils/passport");
const Email = require("../dbs/config");
const axios = require("./utils/axios");

// 实例化一个user对象
let router = new Router({
  prefix: "/users" // 添加路由访问前缀
});

let Store = new Redis().client; // 获取redis客户端

/** -----登录接口----- */
router.post("/signin", async (ctx, next) => {
  // 验证本地的登陆信息
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
        // 执行登录操作后才会有 权限的验证
        return ctx.login(user); // 执行登录的动作
      } else {
        ctx.body = {
          code: 1, // 异常
          msg: info
        };
      }
    }
  })(ctx, next); // 传入上下文
});

/** -----发送验证码接口----- */
router.post("/verify", async (ctx, next) => {
  let username = ctx.request.body.username;
  let saveExpire = await Store.hget(`nodemail:${username}`, "expire");

  // 验证限制
  if (saveExpire && parseInt(new Date().getTime()) - parseInt(saveExpire) < 0) {
    ctx.body = {
      code: -2,
      limitmsg: "验证请求过于频繁，1分钟内1次"
    };
  }

  // 接收信息
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  };

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
    }
  });

  // 响应主体内容
  ctx.body = {
    code: 0
  };
});

/**  -----注册接口----- */
router.post("/signup", async (ctx, next) => {
  /** 获取请求参数
   * post ctx.request.body
   * get  ctx.request.url
   */
  const { username, password, email, code } = ctx.request.body;

  if (code) {
    // 获取验证码
    const saveCode = await Store.hget(`nodemail:${username}`, "code");
    // 获取过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, "expire");
    if (code === saveCode) {
      // 验证码对比
      if (new Date().getTime() - parseInt(saveExpire) > 0) {
        // 判断是否过期
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

  // 创建用户名(User.create是mongoose数据表中自带的方法),将数据写入数据库
  let nuser = await User.create({
    username,
    password,
    email
  });

  // 注册成功之后，直接登录操作
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

/** 退出登录 */
router.get("/exit", async (ctx, next) => {
  await ctx.logout(); // 执行退出动作
  // 是否注销操作  ctx.isAuthenticated  passport 提供的 api
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

/** ----获取用户信息---- */
router.get("/getUser", async ctx => {
  // 判断是否登录状态
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user;
    // console.log(11111122222, username, email);
    ctx.body = {
      username: username,
      email,
    };
  } else {
    ctx.body = {
      username: "",
      email: "",
    };
  }
});

module.exports = router;
