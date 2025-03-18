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
      type: [Array],
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
        
       this.initChart()
      },
      deep: true
    }
  },
  mounted() {
    
    this.initChart();
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
      this.$nextTick(() => {
          if (!this.chart) {
         this.chart = echarts.init(document.getElementById(this.id));
      }

      this.chart.setOption({
        tooltip: {
          trigger: "item",
        },
        
        color: [
          "#3A7DFE",
          "#61AAFE",
          "#2DC2FF",
          "#7AD8FF",
          "#F5222D",
          "#FF935E",
          "#FFC64D",
          "#55C119",
        ],
        legend: {
          top: '25%',
          left: 426,
          itemWidth: 8,
          itemHeight: 8,
          orient: "vertical",
          itemGap: 14,
       
          textStyle: {
            color: "#666",
            fontSize: 12,
          },
         data:this.echartData,
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            center: [196, 140],
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                formatter: '{name|{b}}\n{value|{c}}',
                // formatter: this.echartData,
                rich: {
                    name:{
                        fontSize: 14,
                        lineHeight: 20,
                        color:'#666'
                    },
                    value: {
                        fontSize: 18,
                        color:'#333',
                       lineHeight: 25, 
                    },
                }
              },
            },
           
            labelLine: {
              show: false,
            },
            data: this.echartData,
          },
        ],
      });
      })
    


    },
  },
};
</script>
