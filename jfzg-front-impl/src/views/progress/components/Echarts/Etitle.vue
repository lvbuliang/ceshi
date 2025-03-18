<template>
  <div class="headTitle">
    <div class="title">
      <span>{{title}}</span>
    </div>
    <div class="sub">
      <slot name="op"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
/**头部样式 */
.headTitle {
  display: flex;
  .title {
    flex-grow: 1;
    color: #999;
  }
  .sub {
    color: #007aff;
  }
}
</style>