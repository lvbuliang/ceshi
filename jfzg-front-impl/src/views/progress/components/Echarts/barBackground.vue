<template>
  <div :id="echartInfo.id" ref="myChart"></div>
</template>
<script>
export default {
  props: {
    echartInfo: {
      type: Object,
      default() {
        return {};
      }
    }
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
          xAxis: {
            type: "category",
            boundaryGap: true,
            // x轴的数据
            data: this.echartInfo.xdata,
            // 是否显示x轴
            show: true,
            // x轴的线配置
            axisLine: {
              show: false
            },
            // x轴的刻度线配置
            axisTick: {
              // 刻度线
              show: false
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "line" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          yAxis: {
            type: "value",
            show: true,
            // 坐标轴的分割段数
            splitNumber: 3,
            // 网格线的配置
            splitLine: {
              show: true,
              // 网格线的样式
              lineStyle: {
                type: "dashed"
              }
            },
            // 同x轴
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            },
            // 控制坐标轴的数值
            axisTick: {
              show: false
            }
          },
          series: [
            {
              // 图表的数据
              data: this.echartInfo.ydata,
              // 图表的类型
              type: "bar",
              // 是否显示背景色
              // showBackground: true,
              barWidth: 17,
              itemStyle: {
                color: "rgba(184, 202, 216, 1)"
              }
            }
          ]
        });
      });
    },
    init() {
      this.$refs.myChart.style.width = `${this.echartInfo.chartWidth}px`;
      this.$refs.myChart.style.height = `${this.echartInfo.chartHeight}px`;
    }
  },
  mounted() {
    this.drawLine();
    this.init();
  }
};
</script>
<style lang="scss" scoped>
#myChart {
  margin-left: -20px;
  margin-top: -24px;
}
</style>