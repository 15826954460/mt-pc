const Router = require("koa-router");
const Config = require("../dbs/config");
const axios = require("./utils/axios");
const Province = require("../dbs/models/province");

let router = new Router({
  prefix: "/geo"
});

const sign = Config.sign; // 获取数据签名

/** ---获取当前城市定位--- */
router.get("/getPosition", async ctx => {
  // 获取省市
  let {
    status,
    data: { province, city }
  } = await axios.get(`${Config.requestUrl}/geo/getPosition?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      province,
      city
    };
  } else {
    ctx.body = {
      province: "",
      city: ""
    };
  }
});

/** ---获取菜单--- */
router.get("/menu", async ctx => {
  let {
    status,
    data: { menu }
  } = await axios.get(`${Config.requestUrl}/geo/menu?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      menu
    };
  } else {
    ctx.body = {
      menu: []
    };
  }
});

router.get("/province", async ctx => {
  // 数据库中的部分数据
  // let province = await Province.find(); // 查询数据
  // ctx.body = {
  //   province: province.map(item => {
  //     return {
  //       id: item.id,
  //       name: item.value[0]
  //     };
  //   })
  // };

  // 线上的数据(完整的)
  let {
    status,
    data: { province }
  } = await axios.get(`${Config.requestUrl}/geo/province?sign=${sign}`);

  ctx.body = {
    province: status === 200 ? province : []
  };
});

router.get("/province/:id", async ctx => {});

module.exports = router;
