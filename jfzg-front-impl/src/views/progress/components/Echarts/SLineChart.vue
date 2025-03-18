<template>
  <!--曲线-->
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
      // 基于准备好的dom，初始化echarts实例
      this.$nextTick(() => {
        let myChart = this.$echarts.init(
          document.getElementById(`${this.echartInfo.id}`)
        );

        // 绘制图表
        myChart.setOption({
          title: {
            textStyle: {
              color: "#989898",
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 12,
            },
          },
          legend: {
            data: [""],
          },
          /**坐标轴指示器的颜色 */
          tooltip: {
            trigger: "axis",
            backgroundColor: "#fff", //背景颜色（此时为默认色）
            extraCssText:
              "box-shadow:0px 4px 10px 0px rgba(0,0,0,0.1);color:#333;padding:10px;font-size:12px",
            color: "#333",
            axisPointer: {
              lineStyle: {
                color: "blue",
              },
            },
            formatter: function (params, ticket, callback) {
              let tips = `<span><i class="el-icon-time" style='font-size:14px;display:inline-block;color:#ff8200;margin-right:6px;'></i>${
                params[0].name
              }</br>${params[0].seriesName}${params[0].value || "暂无"}</span>`;
              return tips;
            },
          },

          grid: {
            left: "0",
            right: "4%",
            bottom: "2px",
            top: "20px",
            containLabel: true,
          },

          xAxis: [
            {
              type: "category",
              boundaryGap: ["5%", "5%"],
              show: true,
              data: this.echartInfo.xdata,
              axisLabel: { color: "#666", interval: 0 }, // x轴字体颜色

              axisLine: {
                lineStyle: { color: "rgba(217,217,217,1)" }, // x轴坐标轴颜色
              },
              axisTick: {
                show: false, //是否显示刻度
                lineStyle: { color: "rgba(217,217,217,1)" }, // x轴刻度的颜色
              },
            },
          ],
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {
              type: "dashed",
              color: "#0090FF",
            },
          },
          yAxis: [
            {
              type: "value",
              splitNumber: 3, //y轴间隔
              minInterval: 1,

              show: this.echartInfo.showYLine || false, //是否显示y轴
              //设置网格线
              splitLine: {
                lineStyle: {
                  type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
                },
                show: true,
              },
              axisLabel: {
                color: "#666", // x轴字体颜色
                formatter: this.echartInfo.formatter
                  ? `{value}${this.echartInfo.formatter}`
                  : "{value}",
              },

              axisLine: {
                lineStyle: { color: "#fff" }, // x轴坐标轴颜色
              },
              axisTick: {
                show: false, //是否显示刻度
                lineStyle: { color: "rgba(217,217,217,1)" }, // x轴刻度的颜色
              },
            },
          ],
          series: [
            {
              type: "line",
              name: this.echartInfo.text,
              // symbol: this.echartInfo.showValue, //折线上的值
              smooth: false,
              symbol: "circle",
              //曲线值颜色
              lineStyle: {
                normal: {
                  // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                  color: this.echartInfo.color, // 背景渐变色
                },
              }, // 线条样式
              symbolSize: 6, // 折线点的大小

              itemStyle: {
                normal: {
                  color: "#007aff", //改变折线点的颜色
                },
              },
              areaStyle: {
                color: this.echartInfo.areaStyleColor
                  ? this.echartInfo.areaStyleColor
                  : "rgba(0, 122, 255, .1)", //区块颜色
              },
              data: this.echartInfo.ydata,
            },
          ],
        });
      });
    },
    init() {
      let { chartWidth, chartHeight } = this.echartInfo;
      this.$refs.myChart.style.width = `${
        typeof chartWidth == "string" ? chartWidth : chartWidth + "px"
      }`;
      this.$refs.myChart.style.height = `${
        typeof chartHeight == "string" ? chartHeight : chartHeight + "px"
      }`;
    },
  },
  mounted() {
    this.drawLine();
    this.init();
  },
};
</script>
