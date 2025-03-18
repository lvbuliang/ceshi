<template>
  <FFieldset title="资金统筹" class="mgb40 zjtcBoxmm">
    <div slot="content" class="box box1">
      <div class="top">
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="xmygztz" class="svg-icon"></svg-icon>
          </span>
          <span class="txt">项目计划金额(万元)</span>
          <p class="fs16">{{ total.planAmount | changeMoney }}</p>
        </div>
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="xmljwctz"></svg-icon>
          </span>
          <span class="txt">项目中标金额(万元)</span>
          <p class="fs16">{{ total.totalCumulativePay | changeMoney }}</p>
        </div>
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="yjtz"></svg-icon>
          </span>
          <span class="txt">本月付款总金额(万元)</span>
          <p class="fs16">{{ total.applyAmount | changeMoney }}</p>
        </div>
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="nddytz"></svg-icon>
          </span>
          <span class="txt">累计付款总金额(万元)</span>
          <p class="fs16">{{ total.thisMonthPay | changeMoney }}</p>
        </div>
      </div>
    </div>
  </FFieldset>
</template>
<script>
import FFieldset from "../FHeader/FFieldset.vue";
import { changeMoney } from "@/utils/plan";
export default {
  components: {
    FFieldset,
  },
  props: {
    total: [Object],
  },
  filters: {
    changeMoney,
  },
};
</script>
<style lang="scss">
.zjtcBoxmm {
  .inner {
    background: #fff !important;
  }
}
</style>
<style lang="scss" scoped>
$border-focus-color: #007aff;
.num40 {
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
}
.fs16 {
  font-size: 30px;
  color: #555;
  font-weight: bold;
  i {
    font-style: normal;
    font-size: 14px;
    font-weight: normal;
  }
  span {
    color: #999;
  }
}
.txt {
  display: inline-block;
  margin-bottom: 20px;
  color: #999;
}
//资金统筹
.zjtcBoxmm {
  display: block;
  .inner {
    background: #fff !important;
  }

  .box {
    margin: 30px 0;
    box-sizing: border-box;
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .box1 {
    margin-top: 0;
    background: #fff;
  }
  .top {
    display: flex;
    flex-wrap: wrap;
    .topBox {
      flex: 0 0 260px;
      background: #fff;
      margin-left: 10px;
      margin-bottom: 10px;
      padding: 24px 10px;
      border-right: 1px solid #e9e9e9;
      border-radius: 4px;
      .icon {
        display: inline-block;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    .topBox:nth-child(1) {
      margin-left: 0px;
    }
    .topBox:nth-child(4) {
      border-right: 0px solid #e9e9e9;
    }

    .bg {
      border-right: 0;
    }

    img {
      vertical-align: text-bottom;
      margin-right: 10px;
    }
    .topBox1 {
      text-align: left;
    }
  }
  .rg {
    float: right;
    width: 160px;
  }
  .lf {
    width: 160px;
  }
  .bottom {
    margin-top: 30px;
  }
}
.svg-icon {
  width: 18px;
  height: 18px;
}
</style>>

