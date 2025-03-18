<template>
  <div class="flx">
    <div class="flxBox">
      <p class="fs16 flxWidth">
        里程碑阶段汇报
        <span class="num">26次</span>
      </p>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <p class="fsCenter">风险问题数量</p>
        <SLineChart :echartInfo="echartInfo5"></SLineChart>
      </el-col>
      <el-col :span="8">
        <p class="fsCenter">交付物提交数量</p>
        <barBackground :echartInfo="echartInfo7"></barBackground>
      </el-col>
      <el-col :span="8">
        <p class="fsCenter">任务推进数量</p>
        <SLineChart :echartInfo="echartInfo6"></SLineChart>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import tabCircle from "../components/tabCircle"; //圆圈切换
import SLineChart from "./Echarts/SLineChart"; // 圆滑曲线进度
import barBackground from "./Echarts/barBackground"; //柱状
export default {
  components: { tabCircle, SLineChart, barBackground },
  data() {
    return {
      //汇报情况
      echartInfo5: {
        id: "chart5",
        chartWidth: 300,
        chartHeight: 200,
        ydata: ["10", "3", "30", "10"],
        showYLine: false, //y轴显示
        formatter: true, //显示y轴特殊
        showValue: "none", //折线上的值
        xdata: ["第一周", "第二周", "第三周", "第四周"],
        areaStyleColor: "rgba(255, 149, 53, 0.6)",
        lineStyleColor: "#FFB235",
      },
      echartInfo6: {
        id: "chart6",
        chartWidth: 300,
        chartHeight: 200,
        ydata: ["10", "20", "30", "30"],
        showYLine: false, //y轴显示
        formatter: true, //显示y轴特殊
        showValue: "none", //折线上的值
        xdata: ["第一周", "第二周", "第三周", "第四周"],
      },
      /**柱状图 */
      echartInfo7: {
        id: "chart7",
        chartWidth: 360,
        chartHeight: 240,
        xdata: ["第一周", "第二周", "第三周", "第四周"],
        ydata: ["10", "20", "30", "30"],
        data: [
          { value: 10, name: "1" },
          { value: 20, name: "2" },
          { value: 90, name: "3" },
        ],
        color: ["rgba(255,0,0,1)", "rgba(0,122,255, 1)", "rgba(109,203,42, 1)"],
      },
    };
  },
  methods: {
    /**切换日周月 */
    activeTab(data) {
      if (data == 0) {
      } else if (data == 1) {
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.flxWidth {
  flex-grow: 1;
}
.flx {
  margin: 0 20px 20px;
  padding: 20px;
  border: 1px solid #e6e6e6;
  .flxBox {
    display: flex;
    margin-bottom: 20px;
  }
  .num {
    display: inline-block;
    margin-left: 20px;
    color: #3aa0ff;
    font-weight: bold;
  }
  .fsCenter {
    text-align: center;
    margin-top: 30px;
    margin-bottom: -20px;
    color: #555555;
  }
}
</style>