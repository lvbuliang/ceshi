<template>
  <div class="pagination">
    <div class="pageBox" v-if="page.total && (page.total > (page.num || 5))">
      <!-- <div class="pageL">共{{page.total}}条记录 第{{page.pageNum}}/{{page.pages}}页</div> -->
      <div class="pageR">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="page.pageSize"
          :page-sizes=" page.pageSizes || [5, 10, 20]"
          :current-page="page.pageNum"
          background
          :layout="page.laylout ||layoutdata "
          :total="page.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
// <!-- layout="sizes, prev, pager, next, jumper" -->
export default {
  data() {

    return {
      layoutdata:'prev, pager, next,jumper'
    };
  },
  props: {
    page: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      console.log("this.page", this.page);
      this.$emit("currentChange", val);
    }
  },
  created() {}
};
</script> 
<style lang="scss" scoped>
.pagination {
  text-align: center;
}
</style>