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
      default: "jiaofuwuDetail",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "68px",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption({
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: true, // 是否显示坐标轴刻度
            inside: true, // 坐标轴刻度是否朝内，默认朝外
            length: 5, // 坐标轴刻度的长度
            lineStyle: {
              color: "#FFF", // 刻度线的颜色
              width: 10, // 坐标轴刻度线宽
              type: "solid", // 坐标轴线线的类型（'solid'，实线类型；'dashed'，虚线类型；'dotted',点状类型）
            },
          },
        },
        yAxis: {
          show: false,
        },
        series: [
          {
            type: "line",
            smooth: 0.6,
            symbol: "none",
            markLine: {
              symbol: ["none", "none"],
              label: { show: false },
            },
            itemStyle: {
              color: "rgba(24, 144, 255,0.2)",
            },
            lineStyle: {
              color: '#1890FF',
              width: "2",
            },
            areaStyle: {},
            data: [
              ["1月", 0],
              ["2月", 560],
              ["3月", 30],
              ["4月", 200],
              ["5月", 300],
              ["6月", 0],
            ],
          },
        ],
        grid: {
          top: "0",
          left: "-5%",
          right: "6%",
          bottom: "0",
          containLabel: true,
        },
      });
    },
  },
};
</script>
