<template>
  <div
    id="echartsLiquidfill2"
    class="chart"
    style="height: 160px; width: 160px"
  />
</template>

<script>
import * as echarts from "echarts";
import "echarts-liquidfill";

export default {
  name: 'echart_8',
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
  methods: {
    initChart() {
      var myChart = echarts.init(document.getElementById("echartsLiquidfill2"));

      var value1 = 0.45;
      var value2 = 0.76;

      var option = {
        backgroundColor: "",
        title: [
          {
            text: "本年收缴率",
            x: "center",
            y: "80%",
            textStyle: {
              fontSize: 14,
              fontWeight: "100",
              color: "#5dc3ea",
              lineHeight: 16,
              textAlign: "center",
            },
          },
        ],
        series: [
          {
            type: "liquidFill",
            radius: "50%",
            center: ["50%", "50%"],
            waveAnimation: true, // 是否开启水波动画效果
            // amplitude: 3, // 水波的振幅大小
            // waveLength: 10, // 水波的长度
            // waveSpeed: 0.02, // 水波的速度
            animationEasing: "smooth", // 初始动画的加载效果线性（linear）、平滑（smooth）、加速（ease-in）、减速（ease-out）
            animationEasingUpdate: "smooth", // 数据更新动画的缓动效果,上同
            animationDuration: 100, // 初始动画时长单位毫秒
            animationDurationUpdate: 100, // 数据更新时长单位毫秒
            color: [
              {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#446bf5",
                  },
                  {
                    offset: 1,
                    color: "#2ca3e2",
                  },
                ],
                globalCoord: false,
              },
            ],
            data: [value1, value2], // data个数代表波浪数
            backgroundStyle: {
              borderWidth: 1,
              color: "RGBA(51, 66, 127, 0.7)",
            },
            label: {
              normal: {
                textStyle: {
                  fontSize: 20,
                  color: "#fff",
                },
              },
            },
            outline: {
              // show: false
              borderDistance: 0,
              itemStyle: {
                borderWidth: 2,
                borderColor: "#112165",
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss">
#echartsLiquidfill2 {
  div {
    cursor: inherit !important;
  }
}
</style>
