<template>
  <!-- 集群标题样式 -->
  <div class="jqTitle">
    <div class="title">
      <div class="t1">{{info.title}}</div>
      <div class="t2">
        <svg-icon icon-class="icon_info" v-if='info.showtip'/>
        <span>{{info.subTitle}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return {
            title:'一级标题',
            subTitle:"标题提示",
            showtip:true
        };
      },
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.title {
  margin-bottom: 20px;
  display: flex;
  .t1 {
    font-size: 18px;
    font-weight: bold;
    margin-right: 16px;
  }
  .t2 {
    color: #666666;
    line-height: 20px;
    span {
      margin-left: 2px;
      vertical-align: text-bottom;
    }
  }
}
</style>
