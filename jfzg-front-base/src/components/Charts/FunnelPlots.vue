<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
  ></div>
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
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    echartData: {
      handler(v) {
        this.initChart(v.allProject, v.buyProject, v.doProject, v.checkProject);
      },
      deep: true,
    },
  },
  mounted() {
    this.initChart(
      this.echartData.allProject,
      this.echartData.buyProject,
      this.echartData.doProject,
      this.echartData.checkProject
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
    initChart(data1, data2, data3, data4) {
      let data5 = data1 - data2 - data3 - data4;
      this.$nextTick(() => {
        if (!this.chart) {
          this.chart = echarts.init(document.getElementById(this.id));
        }
        this.chart.setOption({
          /* color: [
             new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "#FB8B29",
              },
              {
                offset: 1,
                color: "#ffffff",
              },
            ]), 
          ],*/
          tooltip: {
            trigger: "item",
            formatter(e) {
              return `${e.name} : ${e.data.value}个`;
            },
          },
          emphasis: {
            // disabled: true,
            itemStyle: {
              color: "inherit",
            },
          },
          // toolbox: {
          //   orient: "vertical",
          //   top
          series: [
            {
              name: "Access From",
              type: "pie",
              selectedMode: "single",
              radius: [0, "30%"],
              labelLine: {
                length: 10,
              },
              label: {
                position: "outside",
                fontSize: 12,
                textBorderWidth: 0,
                formatter: "{b}{c}个",
              },
              // labelLine: {
              //   show: false
              // },

              data: [
                {
                  value: data2,
                  name: "项目采购",
                  itemStyle: {
                    color: "#749BFF",
                  },
                  emphasis: {
                    itemStyle: {
                      opacity: 1,
                    },
                  },
                },
                {
                  value: data3,
                  name: "项目实施",
                  itemStyle: {
                    color: "#63C6FF",
                  },
                },
                {
                  value: data4,
                  name: "项目验收",
                  itemStyle: {
                    color: "#C69AFF",
                  },
                },
                {
                  value: data5,
                  name: "其他",
                  itemStyle: {
                    color: "#f7f7f7",
                  },
                  emphasis: {
                    itemStyle: {
                      opacity: 1,
                    },
                  },
                },
              ],
            },
            {
              name: "Access From",
              type: "pie",
              radius: ["50%", "70%"],
              labelLine: {
                length: 10,
              },
              label: {
                // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: "#F6F8FC",
                borderColor: "#8C8D8E",
                fontSize: 12,
                textBorderWidth: 0,
                formatter: "{b}{c}个",
                // borderWidth: 1,
                // borderRadius: 4,
                rich: {
                  a: {
                    color: "#6E7079",
                    lineHeight: 22,
                    align: "center",
                  },
                  hr: {
                    borderColor: "#8C8D8E",
                    width: "100%",
                    borderWidth: 1,
                    height: 0,
                  },
                  b: {
                    color: "#4C5058",
                    fontSize: 14,
                    fontWeight: "bold",
                    lineHeight: 33,
                  },
                  per: {
                    color: "#fff",
                    backgroundColor: "#4C5058",
                    padding: [3, 4],
                    borderRadius: 4,
                  },
                },
              },
              data: [
                {
                  value: data1,
                  name: "项目总数",
                  itemStyle: {
                    color: "#5592FE",
                    borderColor: "none",
                  },
                  emphasis: {
                    itemStyle: {
                      opacity: 1,
                    },
                  },
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
