<template>
  <div id="echart-line3" ref="myEchart3"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "chart_3",
  data() {
    return {
      option: {
        grid: {
          left: 0,
          bottom: 20,
          top: 50,
        },
        title: {
          text: "阶段概览",
          x:'right',
          y:'top',
          textAlign: 'left',
          padding: [10, 10, 10, 10],
          textStyle: {
            color: "#fff",
            fontFamily: "sans-serif",
            lineHeight: 30,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            console.log("params:", params.name, params.value);
            let color = params.color;
            var htmlStr = "<div>";
            htmlStr += params.name + "<br/>";
            //为了保证和原来的效果一样，这里自己实现了一个点的效果
            htmlStr +=
              '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
              color +
              ';"></span>';
            htmlStr += params.value + "个";
            htmlStr += "</div>";

            return htmlStr;
          },
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0, //这个一定要有，别忘记了
            //y轴文字的配置
            textStyle: {
              color: "#fff", //Y轴内容文字颜色
              fontSize: 10,
            },
          },
          data: ["立项", "采购", "交底", "实施", "初验", "终验", "结项"],
        //   lineStyle: {
        //     width: 200,
        //   },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: { show: false },
        },
        series: [
          {
            label: {
              color: "#fff",
              show: true,
              position: "top",
            },
            data: [
              {
                value: 10,
                itemStyle: {
                  color: "pink",
                },
              },
              {
                value: 20,
                itemStyle: {
                  color: "orange",
                },
              },
              {
                value: 15,
                itemStyle: {
                  color: "red",
                },
              },
              {
                value: 10,
                itemStyle: {
                  color: "yellow",
                },
              },
              {
                value: 5,
                itemStyle: {
                  color: "purple",
                },
              },
              {
                value: 30,
                itemStyle: {
                  color: "green",
                },
              },
              {
                value: 20,
                itemStyle: {
                  color: "gray",
                },
              },
            ],
            type: "bar",
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChartOptions();
    });
  },
  methods: {
    initChartOptions() {
      //渲染
      let myChart = echarts.init(document.getElementById("echart-line3"));
      this.option && myChart.setOption(this.option);
    },
  },
};
</script>
<style scoped>
#echart-line3 {
  /* width: 100%; */
  height: 300px;
}
</style>
