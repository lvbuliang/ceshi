<template>
  <div class="chart-6-container">
    <div class="top">
        <div class="label">合同数:</div>
        <div class="value">60</div>
    </div>
    <div class="bottom">
        <div class="label">订单数:</div>
        <div class="value">80</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chart_6",
};
</script>

<style lang="scss" scoped>
.chart-6-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .top, .bottom {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        height: 45%;
        font-size: 28px;
        font-weight: bold;
        .value {
            margin-left: 20px;
        }
    }
    .top {
        align-items: flex-end;
        margin-bottom: 10%;
    }
    .bottom {
        align-items: flex-start;
    }
}
</style>
