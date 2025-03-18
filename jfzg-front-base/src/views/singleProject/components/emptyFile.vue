<template>
  <div class="singleProject-emptyfile">
    <div class="singleProject-emptyfile-img">
      <img src="../../../assets/singleProject/empty-img.png" alt="">
    </div>
    <div class="singleProject-emptyfile-content">
      <p>
        <span>{{title}}</span>
        <span class="btn" v-if="btnName" @click="handleClickBtn">{{btnName}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    title: {
      type: String
    },  
    btnName:{
      type: String
    }
  },
  data() {
    return {
    };
  },
  components: {
  },
  methods: {
    handleClickBtn() {
      this.$emit('handleEmptyClick')
    }
  },
};
</script>

<style lang="scss">
.singleProject-emptyfile{
.singleProject-emptyfile-img{
  text-align: center;
  img{
    width: 80px;
  }
}
.singleProject-emptyfile-content{
  p{
    text-align: center;
    span{
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
    }
    .btn{
      color: #1890FF;
      cursor: pointer;
    }
  }
}
}
</style>