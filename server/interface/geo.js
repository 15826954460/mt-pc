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
  // http://cp-tools.cn//geo/getPosition?sign=a3c9fe0782107295ee9f1709edd15218
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
  // http://cp-tools.cn/geo/menu?sign=a3c9fe0782107295ee9f1709edd15218
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
  // let province = await Province.find();
  // console.log(province);
  // ctx.body = {
  //   province: province.map(item => {
  //     return {
  //       id: item.id,
  //       name: item.value[0]
  //     }
  //   })
  // }
  // let {
  //   status,
  //   data: { province }
  // } = await axios.get(`${Config.requestUrl}/geo/province?sign=${sign}`);
  // ctx.body = {
  //   province: status === 200 ? province : []
  // };
});

router.get("/province/:id", async ctx => {});

module.exports = router;
