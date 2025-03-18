<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    config: {
      handler: function(value, old) {
        this.init();
      },
      deep: true
    }
  },
  mounted() {
    // $nextTick 监听不到动态传进来的数据
    // this.$nextTick(() => {
    //   this.init();
    // });

    this.init();
  },
  methods: {
    init() {
      this.$refs.echarts.style.width = `${this.config.chartWidth}px`;
      this.$refs.echarts.style.height = `${this.config.chartHeight}px`;
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.echarts);
      myChart.on('click', params => {
        this.$emit('handleClick', params);
      });
      myChart.setOption(this.config, true);
    }
  }
};
</script>

<style lang="scss" scoped>
#myChart {
  width: 400px;
  height: 200px;
}
</style>