<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from "echarts";
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "280px",
    },
    echartData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    echartData: {
      handler(v) {
        
       this.initChart(...v)
      },
      deep: true
    }
  },
  mounted() {
    this.initChart(...this.echartData);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {

    initChart(xdata, data1, data2) {
      this.$nextTick(() => {
        if (!this.chart) {
          this.chart = echarts.init(document.getElementById(this.id));
        }
        this.chart.setOption({
          title: {
            text: "个",
            left: '6%',
            top: '10%',
            textStyle: {
              color: "#666666",
              fontSize: 12,
              fontWeight: "normal",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: ["风险", "问题"],
            itemWidth: 12,
            itemHeight: 5,
            bottom: 24,
            left: "center",
          },
          xAxis: [
            {
              type: "category",
              data: xdata,
              axisTick: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: "#F3F3F3",
                },
              },
              axisLabel: {
                color: "#666",
                interval: 0
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              axisLine: {
                lineStyle: {
                  color: "#F3F3F3",
                },
              },
              axisLabel: {
                color: "#666",
              },
            },
          ],
          series: [
            {
              name: "风险",
              type: "bar",
              stack: "统计",
              barWidth: 15,
              emphasis: {
                focus: "series",
              },
              data: data1,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    1,
                    0,
                    0,
                    [
                      {
                        offset: 0,
                        color: "rgba(101, 175, 255, 1)", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(53, 119, 254, 1)", // 100% 处的颜色
                      },
                    ],
                    false
                  ),
                },
              },
            },
            {
              name: "问题",
              type: "bar",
              stack: "统计",
              barWidth: 15,
              emphasis: {
                focus: "series",
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    1,
                    0,
                    0,
                    [
                      {
                        offset: 0,
                        color: "rgba(249, 69, 90, 1)", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(252, 153, 89, 1)", // 100% 处的颜色
                      },
                    ],
                    false
                  ),
                },
              },
              data: data2,
            },
          ],
        });
        })
    },
  },
};
</script>
