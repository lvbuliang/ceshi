<template>
  <div class="flx">
    <div class="flxBox">
      <p class="fs16 flxWidth">
        事件汇报情况
        <span class="num">26次</span>
      </p>
      <p>
        <tabCircle @activeTab="activeTab"></tabCircle>
      </p>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <p class="fsCenter">风险问题数量</p>
        <SLineChart :echartInfo="echartInfo5" :key="active"></SLineChart>
      </el-col>
      <el-col :span="8">
        <p class="fsCenter">汇报事件数量</p>
        <SLineChart :echartInfo="echartInfo6" :key="active"></SLineChart>
      </el-col>
      <el-col :span="8">
        <p class="fsCenter">最新汇报</p>
        <div class="fsList">
          <ul>
            <li>
              <div class="title">长沙智慧城市事件汇报</div>
              <div class="date">2020-02-25</div>
            </li>
          </ul>
        </div>
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
      active: 0,
      //汇报情况
      echartInfo5: {
        id: "chart5",
        chartWidth: 300,
        chartHeight: 200,
        ydata: [
          "10",
          "3",
          "30",
          "10",
          "11",
          "9",
          "21",
          "10",
          "3",
          "30",
          "10",
          "11",
          "9",
          "21",
          "10",
          "3",
          "30",
          "10",
          "11",
          "9",
          "21",
        ],
        showYLine: false, //y轴显示
        formatter: true, //显示y轴特殊
        showValue: "none", //折线上的值
        xdata: [
          "1号",
          "2号",
          "3号",
          "4号",
          "5号",
          "6号",
          "8号",
          "9号",
          "10号",
          "11号",
          "12号",
          "13号",
          "14号",
          "15号",
          "16号",
          "17号",
          "18号",
          "19号",
          "20号",
          "21号",
          "22号",
        ],
        areaStyleColor: "rgba(255, 149, 53, 0.6)",
        lineStyleColor: "#FFB235",
      },
      echartInfo6: {
        id: "chart6",
        chartWidth: 300,
        chartHeight: 200,
        ydata: ["10", "20", "30", "30", "11", "20", "10"],
        showYLine: false, //y轴显示
        formatter: true, //显示y轴特殊
        showValue: "none", //折线上的值
        xdata: ["1号", "2号", "3号", "4号", "5号", "6号", "7号"],
      },
      /**柱状图 */
      echartInfo7: {
        id: "chart7",
        chartWidth: 360,
        chartHeight: 240,
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
      this.active = data;
      if (data == 0) {
        //周
        let week = ["第一周", "第二周", "第三周", "第四周"];
        this.echartInfo5.xdata = week;
        this.echartInfo6.xdata = week;
        this.echartInfo7.xdata = week;
      } else if (data == 1) {
        let month = [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ];
        this.$set(this.echartInfo5, "xdata", month);
        this.$set(this.echartInfo6, "xdata", month);
        this.$set(this.echartInfo7, "xdata", month);
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
    margin-top: 20px;
    margin-bottom: -20px;
    color: #555555;
  }
  .fsList {
    margin-top: 30px;
    ul li {
      display: flex;
      .title {
        flex-grow: 1;
      }
      .date {
        color: #999;
      }
    }
  }
}
</style>