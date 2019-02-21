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
      // nuxtServerInit
      // async nuxtServerInit({ commit }, { req, app }) {
      // {
      //   const {
      //     status,
      //     data: { province, city }
      //   } = await axios.get("/geo/getPosition");
      //   console.log(province, city)
      //   // commit("geo/setPosition", status === 200 ? { city, province } : { city: "", province: "" });
      // }
      //     {
      //       const {
      //         status,
      //         data: { menu }
      //       } = await axios.get("/geo/menu");
      //       commit("home/setMenu", status === 200 ? menu : []);
      //     }
      //     {
      //       //console.log(app)
      //       const {
      //         status,
      //         data: { result }
      //       } = await axios.get("/search/hotPlace", {
      //         params: {
      //           city: app.store.state.geo.position.city.replace("市", "")
      //         }
      //       });
      //       commit("search/setHotPlace", status === 200 ? result : []);
      //     }
        // }
    }
  });

export default store;
