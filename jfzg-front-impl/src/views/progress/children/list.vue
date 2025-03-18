<template>
    <div class='process_detail'  :style="{ height: clientHeight }">  
      <left @changePro = changePro></left>
      <right :projectId = projectId :projectstatus='status'></right>   
    </div>
</template>

<script>
import left from "../children/left.vue";
import right from "../children/right.vue";

export default {
  //组件注册
  components: {
    left,
    right
  },
  data() {
    return {
      projectId:null,
      clientHeight:'0px',
      status:1,//项目状态 1 建设中 2 已完成
    };
  },
  methods: {
    changePro(item){
      this.projectId = item.projectId
      this.status = item.status
    },
  },
  created() {},
  mounted(){
    this.clientHeight = document.getElementsByClassName('wl-scroll')[0].clientHeight +'px'
  },
};
</script>

<style lang="scss" scoped>
  .process_detail{
    display:flex;
    background: #fff;
    margin:-24px!important;
        overflow-x: auto;
  }

  
  @media screen and (max-width: 1440px) {
    .process_detail{
      overflow: auto;
    }
  }
  @media screen and (min-width: 1441px) and (max-width: 1920px){
    .process_detail{
      overflow: auto;
    }
  }
</style>
