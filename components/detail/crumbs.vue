<template>
  <div class="m-crumbs">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">{{ position.city.replace('市','') }}美团</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">{{ position.city.replace('市','') }}{{ type }}</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">{{ position.city.replace('市','') }}{{ decodeURIComponent(keyword) }}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("geo");
export default {
  props: {
    keyword: {
      type:String,
      default:''
    },
    type: {
      type:String,
      default:''
    }
  },
  computed: {
    ...mapState({
      position: state => state.position
    })
  }
}
</script>
