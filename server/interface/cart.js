const Router = require('koa-router');
const axios =require('./utils/axios');
const Cart = require('../dbs/models/cart');
const md5 = require('crypto-js/md5');

let router = new Router({prefix: '/cart'})

// 创建购物车数据
router.post('/create', async ctx => {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  } else {
    let time = new Date()
    // 随机生成购物车id
    let cartNo = md5(Math.random() * 1000 + time).toString()
    let {
      params: {
        id, // 商品id
        detail
      }
    } = ctx.request.body
    let cart = new Cart({id, cartNo, time, user: ctx.session.passport.user, detail})
    let result = await cart.save() // 保存数据
    if (result) {
      ctx.body = {
        code: 0,
        msg: '',
        id: cartNo
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'fail'
      }
    }
  }
})

// 读取数据
router.post('/getCart', async ctx => {
  let {id} = ctx.request.body
  // console.log(id);
  try {
    let result = await Cart.findOne({cartNo: id}) // 读取数据库
    ctx.body = {
      code: 0,
      data: result
        ? result.detail[0]
        : {}
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    }
  }
})

module.exports = router
