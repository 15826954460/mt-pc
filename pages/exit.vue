<template>
  <div class=""/>
</template>

<script>
const axios = require("../server/interface/utils/axios");
export default {
  layout: 'blank',
  
  /** 
   * 关于middleware的工作流，参考 https://zh.nuxtjs.org/guide
   * middleware 在页面render的时候回执行
   * 先退出到空的退出页面，然后再自动跳到主页面
   */
  middleware: async (ctx)=>{
    let {status, data} = await axios.get("/users/exit")
    if(status === 200 && data && data.code === 0) {
      window.location.href = "/" // 退出登陆也是跳转到首页
    }
  }
}
</script>
