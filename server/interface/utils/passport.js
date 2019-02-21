const passport = require("koa-passport");
const LocalStrategy = require("passport-local"); // 引用第三方更强大本地数据存储
const UserModel = require("../../dbs/models/users"); // 引入mongodb模块

// 具体参考 https://www.npmjs.com/package/passport-local 用法
passport.use(
  new LocalStrategy(async function(username, password, done) {
    let result = await UserModel.findOne({ username }); // 查询用户名
    if (result) {
      if (result.password === password) {
        return done(null, result);
      } else {
        return done(null, false, "密码错误");
      }
    } else {
      return done(null, false, "用户不存在");
    }
  })
);

// 序列化
passport.serializeUser(function(user, done) {
  done(null, user);
});

// 反序列化
passport.deserializeUser(function(user, done) {
  return done(null, user);
});

module.exports = passport;
