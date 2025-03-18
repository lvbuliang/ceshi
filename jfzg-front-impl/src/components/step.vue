<template>
  <div class="setpBox">
    <el-steps class="steps" :active="active" align-center>
      <el-step
        :title="item.nodeName"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <template slot="description">
          <div class="name">{{ item.userName ? item.userName : '' }}</div>
          <div class="time">{{ item.opTime ? item.opTime : '' }}</div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
  import {
  getprocess
} from "@/api/shishi/implement";
export default {
  data() {
    return {
      dataList:[],
      active:0
    }
  },
  created (){
    this.getprocess();
  },
  methods: {
    getprocess () {
      //liyufei mock
      var res = {"msg":{"code":"0000","reasonPhrase":"SUCCESS","message":"SUCCESS"},"data":[{"nodeName":"实施方案编制","taskDefKey":"SSFABZ","jfid":24,"userName":"苗瑞庚","opTime":null,"todo":true},{"nodeName":"一致性检查","taskDefKey":"YZXJC","jfid":30,"userName":"刘义堂","opTime":null,"todo":false},{"nodeName":"建设单位审核","taskDefKey":"JZDWSH","jfid":10,"userName":"高畅","opTime":null,"todo":false},{"nodeName":"完成","taskDefKey":null,"jfid":null,"userName":null,"opTime":null,"todo":false}]}
      var dataList = [];
      for(var i =0;i<res.data.length;i++){
        dataList.push(res.data[i])
      }
      for(var i =0;i<dataList.length;i++){
        if(dataList[i].todo){
          this.active =i;
          break;
        }
      }
      
      this.$set(this,'dataList',dataList)

    }
  },
}
</script>

<style lang="scss" scoped>
.setpBox {

  margin: 30px 0;
  .steps {
    /deep/ .el-step {
      width: 150px;
    }
    /deep/.el-steps {
    width: 654px;
    margin: 0 auto;
    cursor: auto !important;
  }
    /deep/ .el-step__head .el-step__icon {
      width: 30px;
      height: 30px;
      border-width: 6px;
    }
    /deep/ .is-finish {
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    /deep/ .el-step__title.is-process {
      color: rgba(0, 144, 255, 1);
    }
    /deep/ .el-step__description {
      font-size: 12px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
}
</style>
