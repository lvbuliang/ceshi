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
      this.$nextTick(() => {
        let myChart = this.$echarts.init(
          document.getElementById(`${this.echartInfo.id}`)
        );
        // 绘制图表
        myChart.setOption({
          title: {
            text: "",
            subtext: ""
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: []
          },
          grid: {
            top: "10%",
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "value",
            axisLabel: { color: "#333" }, // x轴字体颜色
            splitNumber: 9,
            data: this.echartInfo.xdata,
            //设置网格线
            splitLine: {
              lineStyle: {
                type: "dashed" //设置网格线类型 dotted：虚线   solid:实线
              },
              show: false
            },
            axisLabel: {
              color: "#999",
              formatter: "{value}%"
            },
            axisLine: {
              lineStyle: { color: "#fff" } // x轴坐标轴颜色
            },
            axisTick: {
              show: false, //是否显示刻度
              lineStyle: { color: "rgba(217,217,217,1)" } // x轴刻度的颜色
            }
          },
          yAxis: {
            type: "category",
            // data: this.echartInfo.ydata,
            triggerEvent: true, //点击事件
            max: 5,
            show: true,
            axisLine: {
              lineStyle: { color: "rgba(217,217,217,1)" } // x轴坐标轴颜色
            },
            //设置网格线
            splitLine: {
              lineStyle: {
                type: "dashed" //设置网格线类型 dotted：虚线   solid:实线
              },
              show: true
            },
            axisLabel: {
              color: "#999"
              // formatter: function(value, index) {
              //   return value.substring(0,20);
              // }
            }, // y轴字体颜色
            inverse: this.echartInfo.inverse, //反转
            axisTick: {
              show: true, //是否显示刻度
              lineStyle: { color: "rgba(217,217,217,1)" } // y轴刻度的颜色
            }
          },
          series: [
            {
              name: "",
              type: "bar",
              itemStyle: {
                normal: {
                  color: "#3AA0FF" //柱子的颜色
                }
              },
              barWidth: 20,
              label: {
                normal: {
                  show: true,
                  formatter: function(value, index) {
                    return value.data + "%";
                  },
                  position: "right"
                }
              },
              data: this.echartInfo.xdata
            }
          ]
        });
        //点击事件
        myChart.on("dblclick", param => {
          if (param.componentType == "yAxis") {
            this.$emit("getParams", param.value);
          }
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