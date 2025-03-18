<template>
  <div class="f-header-expand">
    <div class="title"><span>{{title}}</span><div class="span right flex flex-row" @click="emitFn"><span>更多</span><i class="el-icon-arrow-right right"></i></div></div>
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
  },
  methods:{
    emitFn() {
      this.$emit("emitFn")
    }
  }
}
</script>

<style lang="scss" scoped>
  .f-header-expand{
    width: 100%;
    border-radius: 2px;
    background: #fff;
    // padding: 10px 10px 20px 20px;
    .title {
      // margin: 0px 0 20px;
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
      .span span{
        line-height: 36px;
        padding-right: 0;
      }
      // &::before {
      //   content: "";
      //   display: block;
      //   position: absolute;
      //   top: 50%;
      //   left: 0;
      //   z-index: 3;
      //   width: 4px;
      //   height: 14px;
      //   transform: translateY(-6px);
      //   background-color: #659FFF;
      // }
      // &::after {
      //   content: "";
      //   display: block;
      //   width: 100%;
      //   border-bottom: 1px dashed #eeeeee;
      //   position: absolute;
      //   top: 50%;
      //   right: 0;
      //   z-index: 1;
      // }
      i {
        color: #5685F5;
        display: block;
        cursor: pointer;
        background: #fff;
        z-index: 4;
        font-size: 16px;
        padding: 10px 10px 10px 0;
      }
    }
    .box{
      padding:0px 30px;
    }
  }
</style>
