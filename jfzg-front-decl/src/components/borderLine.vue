<template>
  <div class="borderLine">
    <div v-if="title" class="title">
      <img :src="imgUrl" alt />
      <span>
        <b v-if="isBold">{{title}}</b>
        <span v-else>{{title}}</span>
        <slot name="titleAfter"></slot>
      </span>
    </div>
    <div :class="isLine && 'contentBox'">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isBold: {
      // 是否加粗，默认加粗
      type: Boolean,
      default: true,
    },
    title: [Boolean, String], // 标题
    isLine: {
      // 是否开启左边框线，默认开启
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      imgUrl: require("@/assets/title_lg.png"),
    };
  },
};
</script>
<style lang="scss" scoped>
.borderLine {
  .title {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
      margin-right: 6px;
    }
  }

  .contentBox {
    border-left: 1px dashed #cccccc;
    margin-left: 10px;
    padding-left: 17px;
    margin-top: 8px;
  }
}
</style>
