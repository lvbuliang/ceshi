<template>
  <div class="headTitle">
    <div class="title">
      <CTitle :title="title"></CTitle>
    </div>
    <div class="sub">
      <slot name="op"></slot>
    </div>
  </div>
</template>
<script>
import CTitle from "../FHeader/CTitle.vue";
export default {
  components: { CTitle },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
/**头部样式 */
.headTitle {
  display: flex;
  .title {
    flex-grow: 1;
  }
  .sub {
    color: #007aff;
  }
}
</style>
<style  lang="scss">
.headTitle {
  .sub .el-range-editor.el-input__inner {
    width: 198px;
  }
  .el-date-editor .el-range-separator {
    width: 10%;
  }
  .el-col-12 {
    width: 100%;
  }
}
</style>