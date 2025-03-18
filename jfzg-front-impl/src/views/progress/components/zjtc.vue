<template>
  <FFieldset title="资金统筹" class="mgb40 zjtcBoxmm">
    <div slot="content" class="box box1">
      <div class="top">
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="xmygztz" class="svg-icon"></svg-icon>
          </span>
          <span class="txt">项目预估总投资</span>
          <p class="fs16">
            {{ total.planAmount | changeMoney }}
            <i>/万元</i>
          </p>
        </div>
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="xmljwctz"></svg-icon>
          </span>
          <span class="txt">项目累计完成投资</span>
          <p class="fs16">
            {{ total.totalCumulativePay | changeMoney }}
            <i>/万元</i>
          </p>
        </div>
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="wcl" style="color:red"></svg-icon>
          </span>
          <span class="txt">总投资完成率</span>
          <p class="fs16">
            {{ total.totalRate | changeMoney }}%
            <i></i>
          </p>
        </div>
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="yjtz"></svg-icon>
          </span>
          <span class="txt">本年度预估投资</span>
          <p class="fs16">
            {{ total.applyAmount | changeMoney }}
            <i>/万元</i>
          </p>
        </div>
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="nddytz"></svg-icon>
          </span>
          <span class="txt">本年度截至当月完成投资</span>
          <p class="fs16">
            {{ total.thisMonthPay | changeMoney }}
            <i>/万元</i>
          </p>
        </div>
        <div class="topBox">
          <span class="icon">
            <svg-icon iconClass="ndtzwcl"></svg-icon>
          </span>
          <span class="txt">本年度投资完成率</span>
          <p class="fs16">
            {{ total.yearRate | changeMoney }}%
            <i></i>
          </p>
        </div>
      </div>
    </div>
  </FFieldset>
</template>
<script>
import FFieldset from "./FHeader/FFieldset.vue";
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

  .box {
    margin: 30px 0;
    box-sizing: border-box;
    background: #fff;
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .box1 {
    margin-top: 0;
  }
  .top {
    display: flex;
    flex-wrap: wrap;
    .topBox {
      cursor: pointer;
      flex: 0 0 359px;
      margin-left: 10px;
      margin-bottom: 10px;
      padding: 24px 40px;
      border: 1px solid #e9e9e9;
      border-radius: 4px;
      .icon {
        display: inline-block;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    .topBox:nth-child(1),
    .topBox:nth-child(4) {
      margin-left: 0px;
    }
    .topBox:hover {
      border: 1px solid $border-focus-color;
      box-sizing: border-box;
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

