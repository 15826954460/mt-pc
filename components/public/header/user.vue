<template>
  <div class="m-user">
    <template v-if="username">欢迎您，
      <span class="username">{{ username }}</span>
      <nuxt-link to="/exit">[退出]</nuxt-link>
    </template>
    <template v-else>
      <nuxt-link to="/login" class="login">立即登录</nuxt-link>
      <nuxt-link to="/register" class="register">注册</nuxt-link>
    </template>
  </div>
</template>

<script>
const axios = require("../../../server/interface/utils/axios");
export default {
  data() {
    return {
      username: ""
    };
  },
  // 异步获取，用户登陆之后的信息
  async mounted() {
    const {status, data:{ username }} = await axios.get('/users/getUser');
    if(status === 200) {
      this.username = username;
    }
  }
};
</script>

<style scoped>
</style>
