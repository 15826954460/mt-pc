const Router = require("koa-router");
const Config = require("../dbs/config");
const axios = require("./utils/axios");
const Poi = require("../dbs/models/poi");

const router = new Router({
  prefix: "/search"
});

const sign = Config.sign;

router.get("/top", async ctx => {
  try {
    //   let top = await Poi.find({
    //     'name': new RegExp(ctx.query.input),
    //     city: ctx.query.city
    //   })
    //   ctx.body = {
    //     code: 0,
    //     top: top.map(item => {
    //       return {
    //         name: item.name,
    //         type: item.type
    //       }
    //     }),
    //     type: top.length ? top[0].type : ''
    //   }
  } catch (e) {
    //   ctx.body = {
    //     code: -1,
    //     top: []
    //   }
  }
  let {
    status,
    data: { top }
  } = await axios.get(`${Config.requestUrl}/search/top`, {
    params: {
      input: ctx.query.input,
      city: ctx.query.city,
      sign
    }
  });
  ctx.body = {
    top: status === 200 ? top : []
  };
});

/** 热门模块 */
router.get("/hotPlace", async ctx => {
  let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city;
  // 查找数据库中的数据
  try {
    //   let result = await Poi.find({
    //     city,
    //     type: ctx.query.type || '景点'
    //   }).limit(10)
    //
    //   ctx.body = {
    //     code: 0,
    //     result: result.map(item => {
    //       return {
    //         name: item.name,
    //         type: item.type
    //       }
    //     })
    //   }
  } catch (e) {
    //   ctx.body = {
    //     code: -1,
    //     result: []
    //   }
  }
  /**
   * vuex 为服务端和客户端共享的状态，可以通过ctx上下环境来获取
   * 如果客户端有就直接从客户端取，否则从查询参数中获取
   */
  let {
    status,
    data: { result }
  } = await axios.get(`${Config.requestUrl}/search/hotPlace`, {
    params: {
      city: city,
      sign
    }
  });
  ctx.body = {
    result: status === 200 ? result : []
  };
});

/** 根据关键字进行检索 */
router.get("/resultsByKeywords", async ctx => {
  const { city, keyword } = ctx.query; // 获取页面搜索的关键字
  let {
    status,
    data: { count, pois }
  } = await axios.get(`${Config.requestUrl}/search/resultsByKeywords`, {
    params: {
      city: city,
      keyword,
      sign
    }
  });
  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200 ? pois : []
  };
});

/** 获取获取商品详情列表：线上获取 */
router.get("/products", async ctx => {
  let keyword = ctx.query.keyword || "旅游";
  let city = ctx.query.city || "北京";
  let {
    status,
    data: { product, more }
  } = await axios.get(`${Config.requestUrl}/search/products`, {
    params: {
      keyword,
      city,
      sign
    }
  });
  if (status === 200) {
    ctx.body = {
      product,
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    };
  } else {
    ctx.body = {
      product: {},
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    };
  }
});

module.exports = router;
