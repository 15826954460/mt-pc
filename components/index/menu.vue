<template>
  <div class="m-menu">
    <dl class="nav" @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd v-for="(item, index) in menu" :key="index" @mouseenter="mouseenter">
        <i :class="item.type"/>
        {{ item.name }}
        <span class="arrow"/>
      </dd>
    </dl>

    <div v-if="kind" class="detail" @mouseenter="menudetailenter" @mouseleave="menudetailleave">
      <template v-for="(item, index) in curdetail.child">
        <h4 :key="index">{{ item.title }}</h4>
        <span v-for="v in item.child" :key="v">{{ v }}</span>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      kind: "", // 类型
      menu: [
        {
          type: "food",
          name: "美食",
          child: [
            {
              title: "美食",
              child: ["代金券", "甜点饮品", "火锅", "自助餐", "小吃快餐"]
            }
          ]
        },
        {
          type: "takeout",
          name: "外卖",
          child: [
            {
              title: "外卖",
              child: ["美团外卖"]
            }
          ]
        },
        {
          type: "hotel",
          name: "酒店",
          child: [
            {
              title: "酒店星际",
              child: ["经济型", "舒适/三星", "高档/四星", "豪华/五星"]
            }
          ]
        }
      ]
    };
  },
  computed: {
    // 动态获取当前的menu
    curdetail() {
      return this.menu.filter(item => {
        return item.type === this.kind;
      })[0];
    }
  },
  methods: {
    // 左边菜单鼠标离开事件，延迟是为了鼠标移入菜单详情列表的时候不用将kind置为空
    mouseleave() {
      this._timer = setTimeout(() => {
        this.kind = "";
        clearTimeout(this._timer);
      }, 150);
    },
    // 鼠标进入菜单的时候获取当前菜单的类型
    mouseenter(e) {
      this.kind = e.target.querySelector("i").className; // 获取class也就是type
    },
    // 鼠标进入菜单详情
    menudetailenter() {
      // 通过清除定时器的方法来判断是否取消右边内容的显示
      clearTimeout(this._timer);
    },
    // 鼠标离开菜单详情
    menudetailleave() {
      this.kind = "";
    }
  }
};
</script>
<style>
</style>

