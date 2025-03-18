<template>
  <div class="chart4-container">
    <dv-scroll-board :config="config" style="width: 100%; height: 220px" />
  </div>
</template>

<script>
export default {
  name: "chart_4",
  data() {
    return {
      config: {
        header: ["单位名称", "承接合同数", "承接总额(万元)"],
        data: [
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "20", "2000.681"],
          ["郑州天正科技公司 ", "12", "2000.681"],
        ],
        index: true,
        columnWidth: [50],
        align: ["center"],
        carousel: "page",
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
