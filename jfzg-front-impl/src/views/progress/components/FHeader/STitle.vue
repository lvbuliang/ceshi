<template>
  <h5 class="small-title">
    <span :style="{color:spanColor}">{{ title }}</span>
  </h5>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    spanColor: {
      type: String,
      // default: "#007aff",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.small-title {
  // border-left: 4px solid #007aff;
  margin: 0px 0px 10px;
  span {
    // padding-left: 5px;
    color: #007aff;
    font-size: 14px;
  }
}
</style>
