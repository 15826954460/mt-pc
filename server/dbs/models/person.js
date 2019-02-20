var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 字段进行描述
var personSchema = new Schema({
  name: {
    type: String, // 字符串类型
    unique: true, // 唯一的
    require: true // 必须的
  },
  age: {
    type: String, // 字符串类型
    unique: true, // 唯一的
    require: true // 必须的
  }
});

// 注册一个测试表
module.exports = mongoose.model('Person', personSchema);