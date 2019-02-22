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

/** 获取所有身份 */
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

/** 获取省份 */
router.get("/province/:id", async ctx => {
  // let city = await City.findOne({id: ctx.params.id})
  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {province: item.province, id: item.id, name: item.name}
  //   })
  // }
  let {
    status,
    data: { city }
  } = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      city
    };
  } else {
    ctx.body = {
      city: []
    };
  }
});

/** 获取身份下的城市 */
router.get('/city', async (ctx) => {
  // let city = []
  // let result = await City.find()
  // result.forEach(item => {
  //   city = city.concat(item.value)
  // })
  // ctx.body = {
  //   code: 0,
  //   city: city.map(item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
  //         ? item.province
  //         : item.name
  //     }
  //   })
  // }
  let {status, data: {
      city
    }} = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

/** 热门城市 */
router.get('/hotCity', async (ctx) => {
  // let list = [
  //   '北京市',
  //   '上海市',
  //   '广州市',
  //   '深圳市',
  //   '天津市',
  //   '西安市',
  //   '杭州市',
  //   '南京市',
  //   '武汉市',
  //   '成都市'
  // ]
  // let result = await City.find()
  // let nList = []
  // result.forEach(item => {
  //   nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  // })
  // ctx.body = {
  //   hots: nList
  // }
  let {status, data: {
      hots
    }} = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})


module.exports = router;
