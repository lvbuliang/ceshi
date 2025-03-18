<template>
    <div style='padding-right:16px;height: calc(100% - 45px);padding-bottom: 11px;'>
      <div class='echart_daa'>
        <echart1 class='echart_class' ref="chart_line_one"/>  
        <echart2 class='echart_class' ref="chart_line_one2"/> 
      </div>
      <div class='maxheight354' v-if='renwudata&&renwudata.length>0'>
        <div >
          <div v-for="(item, numberdata) in renwudata" :key="'s_' + numberdata" class='renwulist'>
            <context :itemdata='item' :numberi ='numberdata' :active='active' form='task'></context>                
          </div>
        </div>
      </div>
      <div class='maxheight354no' v-else >
          <nodata title='暂无任务' height='100%' :projectstatus='projectstatus'></nodata>                
      </div>
      
  </div>   
</template>

<script>
import nodata from "../children/nodata.vue";
import context from "../children/context.vue";
import echart1 from '../children/echart1.vue'
import echart2 from '../children/echart2.vue';
import pingjia from "@/assets/process/right/pingjia.png";
import noproject from "@/assets/process/right/noproject.png";
import yellow from "@/assets/process/right/yellow.png";
import blue from "@/assets/process/right/blue.png";
import red from "@/assets/process/right/red.png";
export default {

  //组件注册
  components: {
    context,
    echart1,
    echart2,
    nodata
  },
  props: {
    renwudata: {
      type: Array,
      default: function () {
        return [];
      },
    },
    echart_data_renwu: {
      type: Object,
    },
    projectstatus: {
      type: Number,
    },
  },
  watch:{
      'echart_data_renwu': {
        handler(val) {
          if (val) {
            this.$refs.chart_line_one.initChart(val)
            this.$refs.chart_line_one2.initChart(val.echartCount)
          }
        }
      }
    },
  data() {
    return {
      xData: [],
      activeName:'first',
      pingjia:pingjia,
      noproject:noproject,
      yellow:yellow,
      blue:blue,
      red:red,
      active:0,
      renwulist:[],
    };
  },
  methods: {
    
    getstatus(data){
      if(data ==1){
        return "审查通过"
      }else{
        return "待审查"
      }
    },
    handleClick(){}
  },
  mounted() {

  },
};
</script>

<style lang="scss" scoped>
  .echart_daa{
    height:85px;
    width:100%;
    display: flex;
    .echart_class{
      flex:1;
      width:50%;
      display: flex;
      justify-content: center;
    }
  }
  .maxheight354no{
    margin-top:18px;
    height: calc(100% - 103px);
    width: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
  }
  .maxheight354{
    margin-top:18px;
    max-height: calc(100% - 103px);
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .maxheight354::-webkit-scrollbar {/*滚动条整体样式*/
        width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
.maxheight354::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
         -webkit-box-shadow: inset 0 0 5px #D8D8D8;
        background: #D8D8D8;
    }
.maxheight354::-webkit-scrollbar-track {/*滚动条里面轨道*/
        // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        // border-radius: 10px;
        background: #fafafa;
    }
    .renwulist:hover{
          border: 1px solid #1890FF;
        }
  .renwulist{
    margin: 9px 0px 0px 17px;
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
  .renwulist:first-child{
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
