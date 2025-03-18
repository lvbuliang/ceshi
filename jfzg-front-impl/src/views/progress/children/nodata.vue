<template>
     <div class='nodata' :style="'height:' + height||'75px'">
        <div class='nodata_content'>
          <span style='color:#999999'>{{title}}</span>
          <img :src="pleaseadd" alt="" v-if="((title=='暂无任务' &&checkCodeInArr('M005_003_001_001'))||((title=='暂无风险'||title=='暂无问题') &&checkCodeInArr('M005_003_002_003'))||(title=='暂无交付物' &&checkCodeInArr('M005_003_002_003')))&&projectstatus==1">
          <span class='add' @click='add' v-if="((title=='暂无任务' &&checkCodeInArr('M005_003_001_001'))||((title=='暂无风险'||title=='暂无问题') &&checkCodeInArr('M005_003_002_003'))||(title=='暂无交付物' &&checkCodeInArr('M005_003_002_003')))&&projectstatus==1">立即新增</span>
        </div>
      </div>
      
</template>

<script>
import pleaseadd from "@/assets/process/pleaseadd.png";

export default {

  //组件注册
  components: {

  },
  props: {
    title: {
      type: String,
    },
    height: {
      type: String,
    },
    projectstatus: {
      type: Number,
    },
    
  },
  data() {
    return {
      pleaseadd:pleaseadd,
    }
  },
  methods: {
    checkCodeInArr(code, arr){
        arr = sessionStorage.getItem('permission_btns') || []
        if (!code) {
          return true;
        }
        arr = typeof arr == 'string' ? JSON.parse(arr) : arr
        let flag = false;
        for (let k = 0; k < arr.length; k++) {
          if (arr[k].permissionCode == code) {
            flag = true;
            break;
          }
        }
        return flag;
    },
    add(){
      this.$parent.$emit('addclick')
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
  .nodata{
    display: flex;
    align-items:center;
    justify-content:center;
    img{
      width: 17px;
      height: 12px;
    }
    .add{
      cursor: pointer;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1890FF;
      line-height: 22px;
    }
  }
</style>
