const mongoose = require("mongoose"); // 引入mongoose
const Schema = mongoose.Schema; // 引入 mongoose 模型
// 建表对表中要存入的字段进行描述
const UserSchema = new Schema({
  username: {
    type: String, // 字符串类型
    unique: true, // 唯一的
    require: true // 必须的
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  }
});
// 生成一个用户的注册表
module.exports = mongoose.model("User", UserSchema);
