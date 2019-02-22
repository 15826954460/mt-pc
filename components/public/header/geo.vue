<template>
  <div class="m-geo border">
    <i class="el-icon-location"/>
    {{ position.city }}
    <nuxt-link class="changeCity" to="/changeCity">切换城市</nuxt-link>[香河 廊坊 天津]
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("geo");
export default {
  computed: {
    // ...mapState(['position'])
    ...mapState({
      position: state => state.position
    })
  }
};
</script>

<style lang="scss">
</style>