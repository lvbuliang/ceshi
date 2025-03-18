<template>
  <div class="page"
    v-if="page.total && page.total > 5">
    <div class="pageBox">
      <div class="pageR">
        <el-pagination @current-change="handleChange"
          :page-size="page.pageSize"
          :page-sizes="[5, 10, 20, 30]"
          :current-page="page.pageNum"
          background
          layout="prev, pager, next,sizes,jumper"
          @size-change="handleSizeChange"
          :total="page.total"></el-pagination>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>
<script>
export default {
  props: {
    page: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    //下一页
    handleChange (val) {
      this.$emit("Change", val);
    },
    /**
     * 分页大小
     */
    handleSizeChange (val) {
      this.$emit("sizeChange", val);
    },

  }
}
</script>
<style  scoped>
.page {
  text-align: center;
}
</style>