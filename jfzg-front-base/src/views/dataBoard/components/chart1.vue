<template>
  <div id="echart-line1" ref="myEchart1"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "chart_1",
  data() {
    return {
      option: {
        grid: {
          left: 80,
          bottom: 20,
          top: 50
        },
        title: {
          text: "进度概览",
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
            console.log('params:', params.name, params.value);
            let color = params.color;
            var htmlStr ='<div>';
            htmlStr += params.name + '<br/>';
            //为了保证和原来的效果一样，这里自己实现了一个点的效果
            htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
            htmlStr += params.value + '个';
            htmlStr += '</div>';
            
            return htmlStr;  
          },
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: { show: false },
        },
        yAxis: {
          type: "category",
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
          splitLine: { show: false },
          lineStyle: {
            width: 200,
          },
          data: [
            "结项数",
            "终验项目数",
            "初验项目数",
            "完成试运行申请",
            "完成建设数",
            "启动建设数",
          ],
        },
        series: [
          {
            label: {
              color: "#fff",
              show: true,
              position: "right",
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
                value: 40,
                itemStyle: {
                  color: "green",
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
      let myChart = echarts.init(document.getElementById("echart-line1"));
      this.option && myChart.setOption(this.option);
    },
  },
};
</script>
<style scoped>
#echart-line1 {
  /* width: 100%; */
  height: 300px;
}
</style>
