<template>
  <div class="pagination">
    <div class="pageBox" v-if="page.total && (page.total > (page.num || 5))">
      <!-- <div class="pageL">共{{page.total}}条记录 第{{page.pageNum}}/{{page.pages}}页</div> -->
      <div class="pageR">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="page.pageSize"
          :page-sizes="page.pageSizes || [5, 10, 20]"
          :current-page="page.pageNum"
          background
          layout="total,prev, pager, next,sizes,jumper"
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
    return {};
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
  ::v-deep .pageBox{
    background-color: transparent;
    padding: 0;
    .el-pagination .el-pagination__total {
      height: 32px;
      line-height: 32px;
    }
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .el-pager li {
      background-color: #fff;
      color: rgba(0,0,0,.65);
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid #D9D9D9;
      height: 32px;
      line-height: 30px;
      min-width: 32px;
      font-weight: normal;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active,
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      background-color: #0090FF;
      color: #FFFFFF;
      border-color: #0090ff;
    }
    .el-pagination.is-background .btn-prev:disabled,
    .el-pagination.is-background .btn-next:disabled {
      color: #C0C4CC;
    }
    .el-pagination .el-select .el-input .el-input__inner {
      padding-right: 25px;
      border-radius: 4px;
    }
    .el-pagination__sizes .el-input .el-input__inner {
      font-size: 14px;
      padding-left: 8px;
    }
    .el-input--mini .el-input__inner,
    .el-pagination__editor.el-input .el-input__inner{
      height: 32px;
      line-height: 32px;
      border: 1px solid #D9D9D9;
      color: rgba(0,0,0,.65);
    }
  }
}
</style>