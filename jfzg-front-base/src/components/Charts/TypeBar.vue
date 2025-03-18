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
      default: "500px",
    },
    typeBarData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      chart: null,
      formatter: function (e) {},
    };
  },
  watch: {
    typeBarData: {
      handler(v) {
        this.initChart(v[0].ydata, v[0].data1, v[0].data2, v[0].data3);
      },
      deep: true,
    },
  },
  mounted() {
    this.initChart(
      this.typeBarData[0].ydata,
      this.typeBarData[0].data1,
      this.typeBarData[0].data2,
      this.typeBarData[0].data3
    );
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart(ydata, data1, data2, data3) {
      this.$nextTick(() => {
        if (!this.chart) {
          this.chart = echarts.init(document.getElementById(this.id));
        }
        this.chart.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            // 提示文字样式
            textStyle: {
              fontWeight: "normal",
              fontSize: 12,
            },
            // appendToBody: true,
            confine: true,
          },
          legend: {
            // itemWidth: 12,
            // itemHeight: 5,
            bottom: "7%",
            left: "center",
          },
          grid: {
            top: "1%",
            left: "1%",
            // left: "3%",
            // right: "4%",
            // bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
            // 背景为虚线
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
              },
            },
            axisLabel: {
              formatter: function (value) {
                return value + "个";
              },
            },
          },
          yAxis: {
            type: "category",
            data: ydata,
            axisLabel: {
              formatter: function (value) {
                var val = "";
                if (value.length > 7) {
                  val = value.substr(0, 7) + "...";
                  return val;
                } else {
                  return value;
                }
              },
            },
          },
          series: [
            {
              name: "计划内项目",
              type: "bar",
              data: data1,
              barWidth: 5,
              barGap: "100%",
              itemStyle: {
                borderRadius: [0, 5, 5, 0], // 重点
                color: "#39BE40",
              },
              label: {
                show: true, //开启显示
                position: "right", //柱形上方
                fontSize: 10,
                textStyle: {
                  //数值样式
                  color: "#39BE40",
                },
                formatter: "{@score}个",
              },
            },
            {
              name: "专项增补项目",
              type: "bar",
              data: data2,
              barWidth: 5,
              barGap: "100%",
              itemStyle: {
                borderRadius: [0, 5, 5, 0], // 设置圆角
                color: "#5592FE",
              },
              label: {
                show: true, //开启显示
                position: "right", //柱形上方
                fontSize: 10,

                textStyle: {
                  //数值样式
                  color: "#5592FE",
                },
                formatter: "{@score}个",
              },
            },
            {
              name: "备案制项目",
              type: "bar",
              data: data3,
              barWidth: 5,
              barGap: "100%",
              itemStyle: {
                borderRadius: [0, 5, 5, 0], // 重点
                color: "#68BBCA",
              },
              label: {
                show: true, //开启显示
                position: "right", //柱形上方
                fontSize: 10,
                textStyle: {
                  //数值样式
                  color: "#68BBCA",
                },
                formatter: "{@score}个",
              },
            },
          ],
        });
      });
    },
  },
};
</script>
