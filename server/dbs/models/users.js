const mongoose = require("mongoose"); // 引入mongoose
const Schema = mongoose.Schema; // 引入 mongoose 模型
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
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

module.exports = mongoose.model("User", UserSchema); // 使用 User 用户表
