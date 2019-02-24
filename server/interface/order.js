const Router = require("koa-router");
const Config = require("../dbs/config");
const axios = require("./utils/axios");
const Cart = require("../dbs/models/cart");
const Order = require("../dbs/models/order");
const md5 = require("crypto-js/md5");

let router = new Router({
  prefix: "/order"
});

// 查看订单
router.post("/createOrder", async ctx => {
  let { id, price, count } = ctx.request.body;
  let time = new Date();
  let orderID = md5(Math.random() * 1000 + time).toString();
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: "please login"
    };
  } else {
    let findCart = Cart.findOne({ cartNo: id });
    let order = new Order({
      id: orderID,
      count,
      total: price * count,
      time,
      user: ctx.session.passport.user,
      name: findCart.detail[0].name,
      imgs: findCart.detail[0].imgs,
      status: 0
    });
    try {
      let result = await order.save();
      if (result) {
        await findCart.remove(); // 删除购物车
        ctx.body = {
          code: 0,
          id: orderID
        };
      } else {
        ctx.body = {
          code: -1
        };
      }
    } catch (err) {
      ctx.body = {
        code: -1,
        meg: err
      };
    }
  }
});

// 获取所有订单
router.post("/getOrders", async ctx => {
  ctx.body = {
    code: -1,
    list: [],
    ctx: ctx.isAuthenticated()
  };
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: "please login"
    };
  } else {
    try {
      // let results = await Order.find(); 数据库没有数据，暂时就这样
      if (results) {
        ctx.body = {
          code: 0,
          list: results
        };
      } else {
        ctx.body = {
          code: -1,
          list: []
        };
      }
    } catch (err) {
      ctx.body = {
        code: -1,
        list: []
      };
    }
  }
});

module.exports = router;
