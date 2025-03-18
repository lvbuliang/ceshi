<template>
     <div class='' style='height: calc(100% - 44px);padding-bottom:12px'>
       <div class='echart_daa' v-show='!showmore' style='padding-right:16px'>
          <echart3 class='echart_class' ref="chart_line_one3"/>  
          <echart4 class='echart_class' ref="chart_line_one4"/> 
        </div>
        <div class='upup' :class="[!showmore?'upup':'upup2']" @mouseover="mouseOver" @mouseleave="mouseLeave" v-if='riskandquedata &&riskandquedata.length>0'>
          <div class='uppng'  v-if='riskhover' >
            <img v-if='showmore' :src="down" alt="" @click='hidemore'>
              <img v-else :src="up" alt="" @click='hidemore'>
          </div>
          <div :class="['overhover',riskhover?'hovershadow':'']"   :style="{'max-height':showmore?'max-height: calc(100%);':'max-height: calc(100% - 85px);'}">
            <div  :class="['maxheight100']" :style="{'max-height':showmore?'max-height: calc(100%);':'max-height: calc(100% - 85px);'}">
              <div >
                <div v-for="(item, numberdata) in riskandquedata" :key="'s_' + numberdata" class='fxlist'>
                  <context :itemdata='item' :numberi ='numberdata' :active='active' form='risk' :processType='processType'></context>                
                </div>
              </div>       
            </div> 

          
          </div>
        </div>
        <div class='upup' v-else>
          <div  style='position: relative;top: 10px;height:100%'>
            <nodata :title='title' height='100%' :projectstatus='projectstatus'></nodata>
          </div>
                            
          </div>
         
     </div>
</template>

<script>
import pingjia from "@/assets/process/right/pingjia.png";
import echart3 from '../children/echart3.vue'
import echart4 from '../children/echart4.vue'
import noproject from "@/assets/process/right/noproject.png";
import up from "@/assets/process/right/up.svg";
import down from "@/assets/process/right/down.svg";

import context from "../children/context_risk.vue";
import nodata from "../children/nodata.vue";

export default {

  //组件注册
  components: {
    context,
    echart3,
    echart4,
    nodata
  },
  props: {
    processType: {
      type: Number,
    },
    riskandquedata: {
      type: Array,
      default: function () {
        return [];
      },
    },
    echart_data_risk: {
      type: Object,
    },
    projectstatus: {
      type: Number,
    },
  },
  watch:{
      'echart_data_risk': {
        handler(val) {
          if (val) {
            this.$refs.chart_line_one3.initChart(val)
            this.$refs.chart_line_one4.initChart(val.groupsPercent)
          }
        }
      },
      'processType': {
        handler(val) {
          if (val ==1) {
            this.title='暂无风险'
          }else{
            this.title='暂无问题'
          }
        }
      }
    },
  data() {
    return {
      riskhover1:true,
      showmore:false,
      riskhover:false,
      iskhover1:true,
      up:up,
      down:down,
      title:'暂无风险',
      activeName:'first',
      pingjia:pingjia,
      noproject:noproject,
      active:0,
      renwulist:[],
    };
  },
  methods: {
    hidemore(){
      this.showmore = !this.showmore
    },
    mouseOver(){
      if(this.riskandquedata.length>0){
        this.riskhover = true
      }
      
    },
    mouseLeave(){
      this.riskhover = false
    },
    getstatus(data){
      if(data ==1){
        return "审查通过"
      }else{
        return "待审查"
      }
    },
    handleClick(){
    }
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
  .yinying{
    // box-shadow: 0px -8px 16px 0px rgba(0, 0, 0, 0.08);
  }
  .echart_daa{
    height:85px;
    width:100%;
    display: flex;
    position: relative;
    .echart_class{
      flex:1;
      width:50%;
      display: flex;
      justify-content: center;
    }
  }
  .upup{
    position: relative;
    top: -40px;
    margin-top: 20px;
    height: calc(100% - 53px);
  }
  .upup2{
    position: relative;
    top: -30px;
    margin-top: 20px;
    height: calc(100% - -22px);
  }
  .maxheight100{
    max-height: calc(100% - 85px);
    width: 100%;
    padding-top: 12px;
    padding-bottom: 12px;
    position: relative; 
  }
  .maxheight100no{
    max-height: calc(100% - 85px);
    width: 100%;
    padding-top: 12px;
    padding-bottom: 12px;
    position: relative; 
  }
  .uppng{
      position: absolute;
      top: 5px;
      display: flex;
      width: 100%;
      justify-content: center;
      cursor: pointer;
      z-index:333
    }
  .overhover{
    position: relative;
    top: 21px;
    margin-top: 12px;
    max-height: calc(100% - 21px);
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .hovershadow{
        box-shadow: 0px -8px 16px 0px rgba(0, 0, 0, 0.08);
  }
  .overhover::-webkit-scrollbar {/*滚动条整体样式*/
        width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
  .overhover::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
         -webkit-box-shadow: inset 0 0 5px #D8D8D8;
        background: #D8D8D8;
    }
.overhover::-webkit-scrollbar-track {/*滚动条里面轨道*/
        // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        // border-radius: 10px;
        background: #FAFAFA;
    }
  .fxlist{
    margin: 9px 17px 0px 17px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #EFEFEF;
    position: relative;
    .backcolor{
      cursor: pointer;
      height: 100%;
      border-radius: 8px;
      margin-bottom: 8px;
      display: flex;
      cursor: pointer;
      position: absolute;
      z-index: 11;
      top:0
    }  
  }
  .fxlist:first-child{
    margin-top: 0px;
  }
  .wenjianList{
    min-width: 235px;
    height: 40px;
    background: #FFFFFF;
    border-radius: 8px;
    margin-top: 8px;
    padding:8px 12px 8px 8px;
    display: flex;
    justify-content:space-between;
    .circle{
      vertical-align: middle;
      margin-right: 4px;
    }
    .buttun{
      height: 24px;
      line-height: 19px;
      background: #FFFFFF;
      border-radius: 12px;
      border: 1px solid #E5E5E5;
      padding: 2px 16px;
      
    }
  }
  .nowenjian{
      text-align: center;
      display:flex;
      position: relative;
      width: 100%;
      height: 90px;
      border-radius: 8px;
      margin-top: 16px;
      .up_title{
        cursor: pointer;
      }
      .center{
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%, -50%);
        img{
          width:80px;
          height: 60px;
        }
        .div{
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 22px;
        }
        span{
          color: #1890FF;
        }
      }
    }
</style>
