<template>
  <div class='success_title'>
    <img :src="imgUrl" alt="">
    <div class='result_data'>{{result_name}}</div>
    <div class='result_data2'>{{name}}{{result_name}}，{{time}}s后本页面自动关闭</div>
  </div>
</template>

<script>
export default {
  name: "success_msg",

  data() {
    return {
      imgUrl: require("@/assets/success_msg.png"),
      // result_name:'提交成功',
      time:3,
    };
  },
  props: {
    name: {
      type: String,
    },
    result_name:{
      type:String,
      default: '提交成功'
    }
  },
  mounted() {
    var that = this;
    that.$parent.routeClose(3000)
    this.timer1 = setInterval(this.timecount, 1000);
  },
  methods: {
    timecount() {
      if(this.time > 0 ){
        this.time--
      }else{
        clearInterval(this.timer1);
      }
    }
  },
  beforeRouteLeave(to, form, next) {
    clearInterval(this.timer1);
  },
  beforeDestroy() {
    clearInterval(this.timer1);
  }
};
</script>

<style  lang="scss" scoped>
  .success_title{
    width: 100%;
    text-align: center !important;
    height: 416px;
    padding-top: 102px;
    display: block !important;
    img{
      height: 104px;
      width:104px;
    }
    .result_data{
      margin-top: 24px;
      height: 28px;
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
    .result_data2{
      margin-top: 5px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 20px;
    }
  }
</style>