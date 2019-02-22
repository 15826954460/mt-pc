<template>
  <div class>
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd v-for="item in list" :key="item">
        <!-- 通过锚点进行跳转 -->
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <!-- 根据拼音划分的省市模块 -->
    <dl v-for="item in block" :key="item.title" class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <span v-for="c in item.city" :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from "js-pinyin"; // 拼音的检索插件
const axios = require("../../server/interface/utils/axios");
export default {
  data() {
    return {
      list: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      block: []
    };
  },
  async mounted() {
    let self = this;
    let blocks = [];
    let {
      status,
      data: { city }
    } = await axios.get("/geo/city");
    if (status === 200) {
      let p; // 首字母
      let c; // 字母编码
      let d = {}; // 字母对应的所有的城市
      city.forEach(item => {
        // 使用第三方插件，获取首字母
        p = pyjs
          .getFullChars(item.name) // 将中文变成全拼音
          .toLocaleLowerCase()
          .slice(0, 1);
        c = p.charCodeAt(0); // 获取字母的code值
        // 
        if (c > 96 && c < 123) {
          if (!d[p]) {
            d[p] = [];
          }
          d[p].push(item.name);
        }
      });
      for (let [k, v] of Object.entries(d)) {
        blocks.push({
          title: k.toUpperCase(),
          city: v
        });
      }
      // 排序
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      self.block = blocks;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/changeCity/categroy.scss";
</style>
