<template>
  <!--进度条-->
  <div class="lineStatus">
    <span class="normal" v-if='percent.normal' :style="{width:percent.normal+'%'}"></span>
    <span class="abnormal" v-if='percent.abnormal' :style="{width:percent.abnormal+'%'}"></span>
  </div>
</template>
<script>
export default {
  props: {
    percent:[Object],
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.lineStatus {
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  position: relative;
  //现在的进度
  .normal {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 0%;
    height: 8px;
    background: #007aff;
    border-radius: 4px;
  }
  //应有的进度
  .abnormal {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 0%;
    height: 8px;
    background:#FF9535;
    border-radius: 4px;
  }
}
</style>