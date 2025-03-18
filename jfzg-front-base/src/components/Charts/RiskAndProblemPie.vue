<template>
  <div class="riskAndProblemPie">
    <div
      :id="id"
      :class="className"
      :style="{ height: height, width: width }"
    />
    <ul>
      <li v-for="(item, index) in echartData" :key="index">
        <b :style="{ backgroundColor: colors[index] }"></b>
        <div class="box">
          <span class="name">{{ item.name }}</span>
          <span class="number">{{ item.value }}个</span>
          <span class="rate">{{ item.rate }}</span>
        </div>
      </li>
    </ul>
  </div>
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
      default: "192px",
    },
    height: {
      type: String,
      default: "192px",
    },
    echartData: {
      type: [Array],
      default() {
        return [
          { name: "高", value: 40, rate: "40%" },
          { name: "中", value: 30, rate: "30%" },
          { name: "低", value: 30, rate: "30%" },
        ];
      },
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      chart: null,
      colors: ["#1890FE", "#FFC64D", "#F5222D"],
    };
  },
  watch: {
    echartData: {
      handler(v) {
        this.initChart();
      },
      deep: true,
    },
  },
  computed: {
    total() {
      return this.echartData.reduce((p, c) => p + c.value, 0);
    },
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
          title: [
            {
              text: this.title,
              left: "center",
              top: "77px",
              textStyle: {
                fontWeight: "normal",
                fontSize: 14,
                color: "#666",
              },
            },
            {
              text: this.total+'个',
              left: "center",
              top: "97px",
              textStyle: {
                fontWeight: "normal",
                fontSize: 18,
                color: "#333",
              },
            },
          ],
          tooltip: {
            trigger: "item",
          },

          color: this.colors,
          legend: {
            show: false,
          },
          series: [
            {
              name: "",
              type: "pie",
              radius: ["75%", "95%"],
              avoidLabelOverlap: false,

              label: {
                show: false,
                position: "center",
              },

              emphasis: {
                label: {
                  show: false,
                },
              },

              labelLine: {
                show: false,
              },
              data: this.echartData,
            },
          ],
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.riskAndProblemPie {
  position: relative;
  ul {
    position: absolute;
    top: 48px;
    left: 224px;
    li {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .box {
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: 5px;
      }
      b {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      span {
        font-size: 12px;
      }
      .name {
        color: #666666;
      }
      .number {
        color: #333333;
      }
      .rate {
        color: #999999;
      }
    }
  }
}
</style>
