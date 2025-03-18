<template>
  <div class="f-header-expand">
    <h5 class="title"><span>{{title}}</span><i :class="expand?'el-icon-arrow-down':'el-icon-arrow-up'" @click="expand=!expand"></i></h5>
    <div class="box" v-show="expand">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  },
  data() {
    return {
      expand: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .f-header-expand{
    width: 100%;
    border-radius: 2px;
    background: #fff;
    padding: 10px 10px 20px 20px;
    .title {
      margin: 0px 0 20px;
      position: relative;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      span {
        line-height: 1;
        display: inline-block;
        padding-left: 9px;
        padding-right: 12px;
        font-size: 16px;
        color: #333;
        background-color: #fff;
        position: relative;
        z-index: 2;
      }
      &::before {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 3;
        width: 4px;
        height: 14px;
        transform: translateY(-6px);
        background-color: #659FFF;
      }
      &::after {
        content: "";
        display: block;
        width: 100%;
        border-bottom: 1px dashed #eeeeee;
        position: absolute;
        top: 50%;
        right: 0;
        z-index: 1;
      }
      i {
        color: #5685F5;
        display: block;
        cursor: pointer;
        background: #fff;
        z-index: 4;
        font-size: 16px;
        padding: 10px;
      }
    }
    .box{
      padding:0px 30px;
    }
  }
</style>
