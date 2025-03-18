<template>
  <div class="chart-2-container">
    <div class="top">
      <dv-digital-flop :config="config" style="width: 350px; height: 160px" />
      <div class="num-title">系统数量</div>
    </div>
    <div class="bottom">
      <div class="item">
        <div class="label">项目数</div>
        <div class="value">20个</div>
      </div>
      <div class="item">
        <div class="label">完成立项数</div>
        <div class="value">30个</div>
      </div>
      <div class="item">
        <div class="label">完成采购数</div>
        <div class="value">80个</div>
      </div>
      <div class="item">
        <div class="label">完成预研申请数</div>
        <div class="value">10个</div>
      </div>
      <div class="item">
        <div class="label">完成交底数</div>
        <div class="value">120个</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chart_2",
  data() {
    return {
      config: {
        style: {
          fontSize: 60,
          fill: "#3de7c9",
        },
        number: [100],
        content: "{nt}",
      },
      config2: {
        number: [20],
        content: "{nt}个",
      },
      config3: {
        number: [50],
        content: "{nt}个",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.chart-2-container {
    flex: 1;
}
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70%;
  .num-title {
    font-weight: bold;
  }
}
.bottom {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 32%;
    text-align: left;
    margin: 2% 0 2% 1%;
    padding-left: 20px;
    display: flex;
    align-items: center;
    color: #fff;
    .label {
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .item:nth-child(4) {
    width: 37%;
  }
}
</style>
