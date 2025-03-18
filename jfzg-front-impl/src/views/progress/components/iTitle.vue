<template>
  <div class="headTitle">
    <div class="title">
      <span>
        <img :src="iconTitle" alt />
        {{title}}
      </span>
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
      default: "",
    },
  },
  data() {
    return {
      iconTitle: require("../assets/iTitle.svg"),
    };
  },
};
</script>
<style lang="scss" scoped>
/**头部样式 */
.headTitle {
  display: flex;
  .title {
    flex-grow: 1;
    color: #333;
    font-weight: bold;
    font-size: 16px;
    height: 24px;
    display: flex;
    align-items: center;
    img {
      width: 4px;
      height: 16px;
      margin-right: 2px;
      vertical-align: middle;
    }
  }
  .sub {
    color: #007aff;
  }
}
</style>