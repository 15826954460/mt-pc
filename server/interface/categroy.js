const Router = require("koa-router");
const axios = require("./utils/axios");
const Config = require("../dbs/config");
const Province = require("../dbs/models/province");
const Categroy = require("../dbs/models/categroy")

let router = new Router({ prefix: "/categroy" });

const sign = Config.sign;

router.get("/crumbs", async ctx => {
  // let result = await Categroy.findOne({city: ctx.query.city.replace('市', '') || '北京'})
  // if (result) {
  //   ctx.body = {
  //     areas: result.areas,
  //     types: result.types
  //   }
  // } else {
  //   ctx.body = {
  //     areas: [],
  //     types: []
  //   }
  // }

  let {
    status,
    data: { areas, types }
  } = await axios.get(`${Config.requestUrl}/categroy/crumbs`, {
    params: {
      city: ctx.query.city.replace("市", "") || "北京",
      sign
    }
  });
  ctx.body = {
    areas: status === 200 ? areas : [],
    types: status === 200 ? types : []
  };
});

module.exports = router;
