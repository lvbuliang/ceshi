<template>
  <div class="singleProject-contentCard">
    <div class="singleProject-contentCard-title">
      <img src="../../../assets/singleProject/tilte_icon.png" alt="">
      <span>{{title}}</span>
      <div class="btn" v-if="btnName && roleCode == 'JSDW_JBR'" @click="handleClickBtn">
        <i class="el-icon-plus"></i>
        {{btnName}}
      </div>
    </div>
    <div class="singleProject-contentCard-content">
      <slot name="content"></slot>
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
  computed: {
    roleCode: function() {
      return JSON.parse(sessionStorage.getItem('userInfo')).roles[0].roleCode
    }
  },
  components: {
  },
  methods: {
    handleClickBtn() {
      this.$emit('handleClick')
    }
  },
};
</script>

<style lang="scss">
.singleProject-contentCard{
  border-radius: 8px;
  border: 1px solid #EFEFEF;
  padding: 16px;
  // padding-bottom: 8px;
  margin-bottom: 16px;
  .singleProject-contentCard-title{
    margin-bottom:16px;
    display:flex;
    align-items: center;
    position: relative;
    img{
      width:4px;
      height:16px;
      margin-right: 4px;
    }
    span{
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 24px;
    }
    .btn{
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1890FF;
    }
  }
}
</style>