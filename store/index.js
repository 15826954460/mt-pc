import Vue from "vue";
import Vuex from "vuex";
import geo from "./modules/geo";
import home from "./modules/home";
import search from "./modules/search";
import axios from "../server/interface/utils/axios";
Vue.use(Vuex);

const store = () =>
  new Vuex.Store({
    modules: {
      geo,
      home,
      search
    },
    actions: {
      /**
       * nuxtServerInit 用法参见 https://zh.nuxtjs.org/guide/vuex-store
       * vue SSR 相关参考 https://juejin.im/post/5b72d3d7518825613c02abd6
       * app 为页面的上下文 server/index.js   app = new koa()
       */
      async nuxtServerInit({ commit }, { app }) {
        // 获取城市定位
        const {
          status,
          data: { province, city }
        } = await axios.get("/geo/getPosition");
        // 执行geo模块下的setPosition方法,将获取的对象进行传入
        commit("geo/setPosition", status === 200 ? { city, province } : { city: "", province: "" });

        // 获取菜单
        const {
          status: status2,
          data: { menu }
        } = await axios.get("/geo/menu");

        commit("home/setMenu", status2 === 200 ? menu : []);

        // 获取热门城市
        const {
          status: status3,
          data: { result }
        } = await axios.get("/search/hotPlace", {
          params: {
            city: app.store.state.geo.position.city.replace("市", "")
          }
        });
        commit("search/setHotPlace", status3 === 200 ? result : []);
      }
    }
  });

export default store;
