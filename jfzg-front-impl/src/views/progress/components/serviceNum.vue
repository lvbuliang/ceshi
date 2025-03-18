<template>
  <div class="fwnlZu">
    <FFieldset title="服务能力项目数统计" class="mgt30 zjtcBox1">
      <div slot="content">
        <div class="service-num">
            <div class="table-data">
              <serviceTable></serviceTable>
            </div>
            <div class="line"></div>
             <div class="pie">
                <p class="service-top">服务能力top6排行</p>
                <div class='lengendData_position'>
                  <div v-for="(item,index) in lengendData" class='lengendData_class' :key="index">
                    <span :style="item.color" class='color_tip'></span><span>{{item.value}}</span>
                  </div>
                </div>
                
                <div class="pie-data">
                  <Charts :config="chartConfigPie" v-if="chartConfigPie" />
                </div>
                
            </div>
        </div>
      </div>
    </FFieldset>
  </div>
</template>

<script>
import serviceTable from './serviceTableData.vue'
import Charts from './SR-Charts/Charts.vue';
import FFieldset from "./FHeader/FFieldset.vue";
import config1 from './config1.js';
import { api_statisticsByDictCode } from '@/api/progress'
export default {
  components: {
    FFieldset,
    Charts,
    serviceTable
  },
  props: {
    single: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      colorList: [ 'background:#7C6AF2', 'background:#C95FF2','background:#FF6383','background:#FF9F40','background:#FFCB48','background:#31DC72','background:#5C89FF'],
      lengendData:[],
      chartConfigPie:null,
    };
  },
  mounted(){
      this.getPieData()
  },
  methods: {
      // 获取饼图数据
      getPieData(){
        api_statisticsByDictCode().then(res => {
          // console.log(res.data)
          if(res.msg.code == '0000'){
            let pieData = []
            let lengendData = []
            res.data.map(item => {
              let obj = {
                value:item.num,
                name:item.num +'个项目'
              }
              pieData.push(obj)
              lengendData.push(item.chName)
            })
            let chartConfigPie1 = config1;
            for(var i=0;i<lengendData.length;i++){
              var map={
                color:this.colorList[i],
                value:lengendData[i]
              }
              this.lengendData.push(map);
            }
            chartConfigPie1['legend'].data = lengendData;
            chartConfigPie1['series'][0]['data'] = pieData;
            // chartConfigPie1['series'][0].label.normal.show=true;
            this.chartConfigPie = chartConfigPie1;
          }
        })
      }
  },
  created() {
    
  }
};
</script>
<style lang="scss" scoped>
.service-num{
    height:400px;
    display: flex;
    .table-data{
        width:70%;
        // border:solid 1px #ccc;
        padding:0 20px;
        box-sizing: border-box;
    }
    .line{
        width:1px;
        height:375px;
        border:1px solid rgba(233,233,233,1);
    }
    .pie{
        width:30%;
        padding:0 20px;
        .pie-data{
          margin-top:20px;
        }
    }
}
.service-top{ 
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
</style>
<style>
.pie-data canvas{
  left:-15px!important;
}
.zjtcBox1 .color_tip{
  height:9px;
  width: 9px;
  display: inline-block;
  margin-right: 4px;
  border-radius: 50%;
}
.zjtcBox1 .lengendData_class{
  display: inline-block;
  min-width: 100px;
  padding: 5px 0px;
}
.zjtcBox1  .color_title{
  height: 26px;
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  line-height: 26px;
}
.zjtcBox1  .lengendData_position{
  position: absolute;
  top: 325px;
}
.zjtcBox1  .pie{
  position: relative
}
/* .fwnlZu .zjtcBox1 .inner {
  background: #ecf2f9;
} */
</style>