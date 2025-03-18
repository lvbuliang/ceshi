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
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "none",
            },
            formatter: function (params) {
              return params[0].name + ": " + params[0].value;
            },
          },
          grid: {
            top: "2%",
            bottom: "25%",
            left: "15%",
            right: "8%",
          },
          xAxis: {
            data: [
              "项目申报金额",
              "立项批复金额",
              "实际采购金额",
              "累计已支付金额",
            ],
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              color: "black",
              rotate: this.screenWidth > 1820 ? 0 : -20,
              // rotate: 0,
              fontFamily: "PingFang SC-Medium, PingFang SC",
            },
          },
          yAxis: {
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
              },
            },
            axisTick: { show: true },
            axisLine: { show: true },
            axisLabel: {
              show: true,
              formatter: function (value) {
                return value + "万";
              },
            },
          },
          color: ["#e54035"],
          series: [
            {
              name: "hill",
              type: "pictorialBar",
              barCategoryGap: "-130%",
              // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
              symbol:
                "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
              itemStyle: {
                normal: {
                  opacity: 0.4,
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: "#1A4AD0" }, //柱图渐变色
                    { offset: 0.5, color: "#4BE9EA" }, //柱图渐变色
                    { offset: 1, color: "#4BE9EA" }, //柱图渐变色
                  ]),
                  label: {
                    opacity: 1,
                    show: true,
                    position: "top",
                    textStyle: {
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "black",
                    },
                  },
                },
              },
              emphasis: {
                itemStyle: {
                  opacity: 1,
                },
              },
              data: data1,
              z: 10,
            },
            {
              name: "glyph",
              type: "pictorialBar",
              barGap: "-100%",
              symbolPosition: "end",
              symbolSize: 50,
              symbolOffset: [0, "-120%"],
              data: [
                {
                  value: 123,
                  symbol: "none",
                  symbolSize: [60, 60],
                },
                {
                  value: 60,
                  symbol: "none",
                  symbolSize: [50, 60],
                },
                {
                  value: 25,
                  symbol: "none",
                  symbolSize: [65, 35],
                },
                {
                  value: 18,
                  symbol: "none",
                  symbolSize: [50, 30],
                },
              ],
            },
          ],
        });
      });
    },
  },
};
</script>
