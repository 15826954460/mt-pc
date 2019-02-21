
const Router = require("koa-router");
const Person = require("../dbs/models/person");
let router = new Router({
  prefix: "/person" // 添加路由访问前缀
});
// 添加数据
router.post("/addPerson", async function(ctx) {
  // 构建一个实例
  const person = new Person({
    name: ctx.request.body.name,
    age: ctx.request.body.age
  });
  let code;
  try {
    await person.save(); // 存储数据(实例方法)
    code = 0;
  } catch (e) {
    code = -1;
  }
  ctx.body = { code };
});
// 读取数据
router.post('/getPerson', async function (ctx) {
  let results, result;
  let code;
  try {
    result = await Person.findOne({
      name: ctx.request.body.name
   }) 
   results = await Person.find({
    name: ctx.request.body.name
  })
    code = 0;
  } catch (e) {
    console.log(11111, e)
    code = -1;
  }
  ctx.body = {
    code,
    result,
    results
  }
})
// 修改数据
router.post('/updatePerson', async function(ctx) {
  await Person.where({
    name: ctx.request.body.name
  }).update({
    age: ctx.request.body.age
  })
  ctx.body = {
    code: 0
  }
})

// 删除数据
router.post('/removePerson', async function(ctx) {
  await Person.where({
    name: ctx.request.body.name
  }).remove({
    age: ctx.request.body.age
  })
  ctx.body = {
    code: 0
  }
})
/** 
 * 新建一个命令行窗口，输入 redis-cli 命令，看到当前redis本地域名和端口号 eg:127.0.0.1:6397
 * 通过 keys * 来查看所有的关键字
 * eg Store.hset("fix", "name", Math.random())
 * hget fix name   ==>   value
 * hget 关键字 可以获取 存储关键字的值
 * 关于redis的命令行进行增删改查，查看 http://www.runoob.com/redis/redis-sorted-sets.html 学习文档
 * 
*/


/** 
 * 建议使用 postman 进行模拟请求接口，使用方法自行百度
 * curl 为 shall 命令, 可以直接在命令行中请求接口
 * -d 为 post 请求
 * "name=lilei&age=22" 为请求参数
 * http://localhost:3000/person/addPerson 请求地址
 * 
 * 命令行请求接口为： curl -d "name=lilei&age=22" http://localhost:3000/person/addPerson
 * 
 * curl -d "username=bys&email=624793604@qq.com" http://localhost:3000/users/verify
*/
module.exports = router
