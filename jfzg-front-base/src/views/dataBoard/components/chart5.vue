<template>
  <div id="echart-line5" ref="myEchart1"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "chart_1",
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            console.log("params:", params.name, params.value);
            let color = params.color;
            var htmlStr = "<div>";
            htmlStr += params.name + "<br/>";
            //为了保证和原来的效果一样，这里自己实现了一个点的效果
            htmlStr +=
              '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
              color +
              ';"></span>';
            htmlStr += params.value + "个";
            htmlStr += "</div>";

            return htmlStr;
          },
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "通过预算评审项目数" },
              { value: 735, name: "完成采购项目数" },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChartOptions();
    });
  },
  methods: {
    initChartOptions() {
      //渲染
      let myChart = echarts.init(document.getElementById("echart-line5"));
      this.option && myChart.setOption(this.option);
    },
  },
};
</script>
<style scoped>
#echart-line5 {
  width: 140px;
  height: 140px;
}
</style>
