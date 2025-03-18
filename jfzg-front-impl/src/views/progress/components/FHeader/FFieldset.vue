<template>
  <div class="wrap relative">
    <div class="inner">
      <div class="title">{{ title }}</div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: [String, Number]
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  padding-top: 20px;
  margin-bottom: 30px;
  .inner {
    border: 1px solid #71a8e4;
    padding-top: 60px;
    .title {
      position: absolute;
      top: 0;
      left: 30px;
      min-width: 152px;
      padding: 0 40px;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: #fff;
      background-color: #007aff;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: center;
    }
  }
}
</style>
