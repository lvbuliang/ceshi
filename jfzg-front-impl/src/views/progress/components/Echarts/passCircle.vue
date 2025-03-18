<template>
  <div class="pass-circle-com">
    <div class="pass-circle-box">
      <div class="pass-data">
        <div class="num">{{passNum || 0}}</div>
        <div class="label">通过数</div>
      </div>
      <el-progress type="circle" color="#1890FE" :percentage="percentage" :width="114" :stroke-width="16" :show-text="false"></el-progress>
    </div>
    <div class="legend">
      <div class="legend-item">
        <span class="dot"></span>
        <label>通过数</label>
        <span class="pass-num">{{ echartInfo.passNum || 0 }}</span>
        <span class="pass-percent">{{percentage}}%</span>
      </div>
      <div class="legend-item">
        <span class="dot1"></span>
        <label>总数量</label>
        <span class="pass-num">{{ echartInfo.total }}</span>
        <span class="pass-percent">100%</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      echartInfo: {
        type: Object,
        default() {
          return {};
        },
      }
    },
    watch: {
      'echartInfo': {
        handler(val) {
          if (val) {
            this.passNum = val.passNum
            this.total = val.total
            if (this.passNum == 0 || this.total == 0) {
              this.percentage = 0
            } else {
              this.percentage = parseInt((this.passNum / this.total) * 100)
            }
          }
        }
      }
    },
    data() {
      return {
        passNum: 0,
        total: 0,
        percentage: 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pass-circle-com{
    display: flex;
    align-items: center;
    margin-top: 25px;
    margin-left: 16px;
    .pass-circle-box{
      position: relative;
      width: 114px;
      height: 114px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      .pass-data {
        position: absolute;
        color: #333333;
        font-weight: 400;
        text-align: center;
        .num{
          font-size: 18px;
          line-height: 24px;
        }
        .label{
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
    .legend{
      margin-left: 33px;
      .legend-item{
        font-size: 12px;
        font-weight: 400;
        display: flex;
        align-items: center;
        .dot, .dot1{
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
        }
        .dot{
          background: #1890FE;
        }
        .dot1 {
          background: #e5e9f2;
        }
        label,.pass-num {
          color: #333;
          margin-right: 10px;
          line-height: 17px;
        }
        .pass-percent{
          color: #999999;
          line-height: 17px;
        }
        &:not(:last-child) {
          margin-bottom: 17px;
        }
      }
    }
  }
</style>
