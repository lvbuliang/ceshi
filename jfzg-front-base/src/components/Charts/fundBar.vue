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
      default: "330px",
    },
    echartData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      chart: null,
      formatter: function (e) {},
      screenWidth: document.body.clientWidth,
    };
  },
  watch: {
    // 大于1820
    screenWidth(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val;
        this.timer = true;
        let that = this;
        setTimeout(function () {
          // 打印screenWidth变化的值
          that.initChart(that.echartData);
          that.timer = false;
        }, 400);
      }
    },

    echartData: {
      handler(v) {
        this.initChart(v);
      },
      deep: true,
    },
  },
  mounted() {
    let that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    this.initChart(this.echartData);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart(data) {
      let data1 = [data.var1, data.var2, data.var3, data.var4];
      this.$nextTick(() => {
        if (!this.chart) {
          this.chart = echarts.init(document.getElementById(this.id));
        }
        this.chart.setOption({
          grid: {
            top: "7%",
            left: "0%",
            right: "2%",
            bottom: "12%",
            containLabel: true,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          xAxis: [
            {
              type: "category",
              data: [
                "清单审核通过规模",
                "方案批复规模",
                "合同签约规模",
                "累计支付金额",
              ],
              axisTick: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: "#F3F3F3",
                },
              },
              /* axisLabel: {
                color: "#666",
                interval: 0,
              }, */
              axisLabel: {
                color: "#666",
                rotate: this.screenWidth > 1870 ? 0 : -38,
                // rotate: 0,
                // fontFamily: "PingFang SC-Medium, PingFang SC",
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
                formatter: function (value) {
                  return value + "万";
                },
              },
            },
          ],
          series: [
            {
              type: "bar",
              barWidth: 32,
              emphasis: {
                focus: "series",
              },
              data: data1,
              itemStyle: {
                color: "#5592FE",
              },
              // formatter: "{@score}万",
              label: {
                show: true, //开启显示
                position: "top", //柱形上方
                fontSize: 10,

                textStyle: {
                  //数值样式
                  color: "#666666",
                  fontSize: 12,
                },
                formatter: "{@score}万",
              },
            },
          ],
        });
      });
    },
  },
};
</script>
