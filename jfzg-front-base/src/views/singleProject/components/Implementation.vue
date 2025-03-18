<template>
  <div class="Implementation">
    <div class="Implementation-tabs">
      <div v-for="item in tabs" @mouseover="selectStyle(item)"
        @mouseout="outStyle(item)" @click="handleCheckTab(item.id)" :key="item.id" class="Implementation-tabs-item" :class="{active:activeTabindex == item.id}">
        <img :src="activeTabindex == item.id || item.hoverIndex?item.activeicon:item.icon" alt="">
        <span>{{item.name}}</span></div>
    </div>
    <!-- 实施方案 -->
    <div class="Implementation-content" v-show="activeTabindex == 0">
      <Steps :defaultIndex="stepIndex" @stepClick="stepClick"></Steps>
      <div class="Implementation-content-item" v-show="stepIndex == 0">
        <!-- 项目成员登记 -->
      <Newwenjian></Newwenjian>
      </div>
      <div class="Implementation-content-item" v-show="stepIndex == 1">
        <!-- 里程碑设置 -->
        <Licenbei></Licenbei>
      </div>    
      <div class="Implementation-content-item" v-show="stepIndex == 2">
        <!-- 交付物设置 -->
        <Jiaofu></Jiaofu>
      </div>
      <div class="Implementation-content-item" v-show="stepIndex == 3">
        <!-- 任务设置 -->
        <newtaskList></newtaskList>
      </div>
    </div>
    <!-- 风险问题 -->
    <div class="Implementation-content" v-show="activeTabindex == 1">
      <div v-if="echartsshow" class="echartsPie">
        <div class="echartsPieBox">
        <RiskAndProblemPie :id="'riskChart'" :className="'riskChart'" :title="'风险情况'" :echartData="riskechartData"></RiskAndProblemPie>
      </div>
      <div class="echartsPieBox">
        <RiskAndProblemPie :id="'problemChart'" :className="'problemChart'" :title="'问题情况'" :echartData="problemechartData"></RiskAndProblemPie>
      </div>
      </div>
      <div style="width: 100%" v-else>
        <EmptyFile :title="'暂无内容'"></EmptyFile>
      </div>
    </div>
    <!-- 里程碑汇报-->
    <div class="Implementation-content" v-show="activeTabindex == 2">
      <milestonelist></milestonelist>
    </div>
    <!-- 任务管理 -->
    <div class="Implementation-content" v-show="activeTabindex == 3">
      <newtaskList></newtaskList>
    </div>
  </div>
</template>

<script>
import Newwenjian from "./newwenjian.vue"
import Jiaofu from "./jiaofu.vue"
import Licenbei from "./licenbei.vue"
import TaskList from "./taskList.vue"
import Steps from "@/components/silgleSteps.vue"
import RiskAndProblemPie from "@/components/Charts/RiskAndProblemPie.vue"
import {getCountRiskLevel} from "@/api/singleProject.js"
import newtaskList from "./newtaskList.vue"
import milestonelist from "./milestonelist.vue"
import EmptyFile from "./emptyFile.vue"
export default {
  props:{
  },
  data() {
    return {
      activeTabindex: 0,
      tabs: [
        {
          id: 0,
          name: '实施方案',
          icon: require('@/assets/singleProject/single_icon26.png'),
          activeicon: require('@/assets/singleProject/single_icon30.png'),
          hoverIndex:false
        },
        {
          id: 1,
          name: '风险与问题',
          icon:require('@/assets/singleProject/single_icon27.png'),
          activeicon:require('@/assets/singleProject/single_icon31.png') ,
          hoverIndex:false
        },
        {
          id: 2,
          name: '里程碑汇报',
          icon:require('@/assets/singleProject/single_icon28.png'),
          activeicon: require('@/assets/singleProject/single_icon32.png'),
          hoverIndex:false
        },
        {
          id: 3,
          name: '任务管理',
          icon:require('@/assets/singleProject/single_icon29.png'),
          activeicon: require('@/assets/singleProject/single_icon33.png'),
          hoverIndex:false
        }
      ],
      riskechartData: [],
      problemechartData: [],
      stepIndex: 0,
      echartsshow: true
    };
  },
  created() {
    this.getCountRiskLevel()
  },
  methods:{
    selectStyle(item){
      item.hoverIndex = true
    },
    outStyle(item){
      item.hoverIndex = false
    },
    // 切换tab
    handleCheckTab(index) {
      this.activeTabindex = index
    },
    // 获取风险与问题数据
    getCountRiskLevel() {
      getCountRiskLevel({projectId:this.$route.query.projectId}).then(res=>{
        if (res.data.risk[0].total == 0) {
          this.echartsshow = false
        }
        for (let index = 0; index < res.data.risk.length; index++) {
          this.riskechartData.push({
            name: res.data.risk[index].chName,
            value: res.data.risk[index].riskNum,
            rate: res.data.risk[index].percent
        })
        }
        for (let index = 0; index < res.data.problem.length; index++) {
          this.problemechartData.push({
            name: res.data.problem[index].chName,
            value: res.data.problem[index].riskNum,
            rate: res.data.problem[index].percent
        })
        }
        
      })
    },
    // 点击步骤条
    stepClick(index) {
      this.stepIndex = index
    }
  },
  components:{
    Newwenjian,
    Jiaofu,
    Licenbei,
    TaskList,
    Steps,
    RiskAndProblemPie,
    newtaskList,
    milestonelist,
    EmptyFile
  }
};
</script>

<style lang="scss">
.Implementation{
  .Implementation-tabs{
    margin-bottom: 24px;
    display: flex;
    .Implementation-tabs-item{
      flex-grow: 1;
      height: 40px;
      background: #FFFFFF;
      border-radius: 8px;
      border: 1px solid #EFEFEF;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #999999;
      margin-right: 8px;
      cursor: pointer;
      img{
        width:14px;
        vertical-align: middle;
        margin-right: 3px;
      }
      span{
        display: inline-block;
        vertical-align: middle;
      }
      &.active{
        background: #E6F7FF;
        border-radius: 8px;
        border: 1px solid transparent;
        color: #1890FF;
      }
      &:hover{
        color: #1890FF;
      }
    }
  }
  .Implementation-content{
    .echartsPie{
      display: flex;
      .echartsPieBox{
        padding:24px 202px 24px 24px;
        background: #FAFAFA;  
        border-radius: 8px;
        margin-right: 17px;
      }
    }
  }
}
</style>