<template>
  <div class="nameBox">
    <!-- <img :src="setting.icon"
      alt
      class="namgImg" /> -->
    <span>{{setting.unitName}}</span>

  </div>
</template>
<script>
export default {
  props: {
    setting: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      imgBox: require("@/assets/shishi/icon-logo.png")
    };
  }
};
</script>
<style lang="scss" scoped>
.nameBox {
  margin-top: 20px;
}
/**标题 */
.nameBox .namgImg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 10px;
}
.nameBox span {
  font-size: 16px;
  vertical-align: middle;
}
.tips {
  display: inline-block;
  margin-left: 30px;
  font-size: 12px !important;
  color: #666;
}
</style>