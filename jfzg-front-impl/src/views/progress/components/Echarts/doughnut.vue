<template>
  <!--饼图-->
  <div :id="echartInfo.id" ref="myChart"></div>
</template>
<script>
export default {
  props: {
    echartInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    drawLine() {
      var that = this;
      // 基于准备好的dom，初始化echarts实例
      that.$nextTick(() => {
        let myChart = that.$echarts.init(
          document.getElementById(`${that.echartInfo.id}`)
        );

        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: "item",
            show: true, // 鼠标滑过的提示框
            formatter: "{b} <br/>{d}%", // {c} 数量
          },
          legend: {
            orient: "vertical",
            left: 0,

            selectedMode: false, //取消图例的点击事件
            data: [],
          },
          grid: {
            left: "0%",
            bottom: "0%",
            containLabel: true,
          },

          series: [
            {
              lickable: false, //取消图表上的点击事件
              type: "pie",
              radius: ["40%", "70%"],
              center: ["50%", "50%"], // 饼图位置 默认居中
              // 偏移距离
              hoverOffset: 0,
              // 饼图文字配置
              label: {
                show: false,
                position: "center",
                formatter: function () {
                  return that.echartInfo.labelText || "";
                },
                fontSize: 16,
                color: "#333",
              },
              emphasis: {
                label: {
                  show: true, //去掉划过出现的文字 默认展示
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: that.echartInfo.data,
              itemStyle: {
                normal: {
                  // 设置饼图的颜色
                  // color: function(params) {
                  //   var colorList = that.echartInfo.color;
                  //   return colorList[params.dataIndex];
                  // },
                  // 饼图各块之间的间隙
                  borderWidth: that.echartInfo.borderWidth | 0,
                  borderColor: "#fff",
                },
              },
            },
          ],
        });
      });
    },
    init() {
      this.$refs.myChart.style.width = `${this.echartInfo.chartWidth}px`;
      this.$refs.myChart.style.height = `${this.echartInfo.chartHeight}px`;
    },
  },
  mounted() {
    this.drawLine();
    this.init();
  },
};
</script>
<style lang="scss" scoped>
#myChart {
  margin-left: -20px;
  margin-top: -24px;
}
</style>