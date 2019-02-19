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

// compile our model
module.exports = mongoose.model('Person', personSchema);