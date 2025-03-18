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
      default: "300px",
    },
    echartData: {
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
    echartData: {
      handler(v) {
        this.initChart(...v);
      },
      deep: true,
    },
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
    initChart(data1, data2) {
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
          },
          legend: {
            // itemWidth: 12,
            // itemHeight: 5,
            bottom: "15%",
            // left: "20%",
          },
          grid: {
            top: "15%",
            left: "1%",
            width: "90%",
            // left: "3%",
            // right: "4%",
            bottom: "30%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: ["低风险", "中风险", "高风险"],
          },
          yAxis: {
            type: "value",
            minInterval: 1, //不允许出现小数位
            // splitNumber: 5,
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
          series: [
            {
              name: "风险",
              type: "bar",
              data: data1,
              barWidth: 10,
              barGap: "40%",
              itemStyle: {
                borderRadius: [5, 5, 0, 0], // 重点
                color: "#5592FE",
              },
            },
            {
              name: "问题",
              type: "bar",
              data: data2,
              barWidth: 10,
              itemStyle: {
                borderRadius: [5, 5, 0, 0], // 重点
                color: "#6ac5f9",
              },
            },
          ],
        });
      });
    },
  },
};
</script>
