<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <img src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png" alt="美团">
      </el-col>
      <span>{{position.city}}</span>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input
            v-model="search"
            placeholder="搜索商家或地点"
            @focus="focus"
            @blur="blur"
            @input="input"
          />
          <button class="el-button el-button--primary">
            <i class="el-icon-search"/>
          </button>
          <dl v-if="isHotPlace" class="hotPlace">
            <dt>热门搜索</dt>
            <!-- $store.state.search.hotPlace.slice(0, 5) -->
            <dd v-for="(item, index) in hotPlace" :key="index">{{ item }}</dd>
          </dl>
          <dl v-if="isSearchList" class="searchList">
            <dd v-for="(item,index) in searchList" :key="index">{{ item.name}}</dd>
          </dl>
        </div>
        <p class="suggest">
          <!-- <a
            v-for="(item, index) in $store.state.search.hotPlace.slice(0, 5)"
            :key="index"
            href="#"
          >{{ item.name }}</a>-->
        </p>
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund"/>
            <p class="txt">随时退</p>
          </li>
          <li>
            <i class="single"/>
            <p class="txt">不满意免单</p>
          </li>
          <li>
            <i class="overdue"/>
            <p class="txt">过期退</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from "lodash"; // 参考 https://www.lodashjs.com/docs/4.17.5.html
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("geo");
const axios = require("../../../server/interface/utils/axios");

export default {
  data() {
    return {
      search: "", //当前输入框的值
      isFocus: false, //是否聚焦
      hotPlace: ["火锅", "火锅", "火锅", "火锅"], // 热门搜索数据
      searchList: [] // 搜索数据
    };
  },
  computed: {
    ...mapState({
      position: state => state.position
    }),
    isHotPlace() {
      return this.isFocus && !this.search;
    },
    isSearchList() {
      return this.isFocus && this.search;
    }
  },
  methods: {
    focus() {
      this.isFocus = true;
    },
    blur() {
      let _timer = setTimeout(() => {
        this.isFocus = false;
        clearTimeout(_timer);
      }, 200);
    },
    // 监听input事件[避免没输入一个字母就开始一次查询，所用采用延时机制，借用lodash第三方库]
    input: _.debounce(async function() {
      if (this.search) {
        let city = this.position.city.replace("市", "");
        this.searchList = [];
        let {
          status,
          data: { top }
        } = await axios.get("/search/top", {
          params: {
            input: this.search,
            city
          }
        });
        this.searchList = top.slice(0, 20); // 每次只截取前二十条
      } else {
        // 清空内容从新输入的时候，不请求接口，将内容清空避免下次内容返回前显示上一次的结果
        this.searchList = [];
      }
    }, 200)
  }
};
</script>

<style scoped>
</style>
