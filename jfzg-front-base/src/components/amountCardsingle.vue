<template>
  <div class="amountCard">
    <!-- style="border-bottom: 1px dashed #efefef" -->
    <ul>
      <li v-for="(item, index) in config1" :key="index">
        <div class="top">
          <img :src="item.url" /> <span>{{ item.label }}</span>
        </div>
        <h3>{{ amounts[item.key] | floattwo }}</h3>
      </li>
    </ul>
    <ul>
      <li v-for="(item, index) in config2" :key="index">
        <div class="top">
          <img :src="item.url" /> <span>{{ item.label }}</span>
        </div>
        <h3>{{ amounts[item.key] | floattwo }}</h3>
      </li>
    </ul>
  </div>
</template>

<script>
const digitsRE = /(\d{3})(?=\d)/g;
export default {
  filters: {
    currency(value, currency, decimals) {
      value = parseFloat(value);
      if (!isFinite(value) || (!value && value !== 0)) return "";
      currency = currency != null ? currency : "";
      decimals = decimals != null ? decimals : 2;
      var stringified = Math.abs(value).toFixed(decimals);
      var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
      var i = _int.length % 3;
      var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
      var _float = decimals ? stringified.slice(-1 - decimals) : "";
      var sign = value < 0 ? "-" : "";
      return sign + currency + head + _int.slice(i).replace(digitsRE, "1,");
    },
    floattwo(value) {
      if (isNaN(value)) {
        return "0.00";
      } else {
        return Math.abs(value).toFixed(2);
      }
    },
  },
  props: {
    amounts: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      config1: [
        // {
        //   label: "总投资金额（万元）",
        //   url: require("@/assets/standtable/p1.png"),
        //   key: "totalInvestmentAmount",
        // },
        {
          label: "申报金额（万元）",
          url: require("@/assets/standtable/declaredAmount.png"),
          // key: "amountDeclared",
          key: "totalInvestmentAmount",
        },
        {
          // label: "送审金额（万元）",
          label: "批复金额（万元）",
          url: require("@/assets/standtable/censorship.png"),
          // key: "auditMoney",
          key: "totalApprovedAmount",
        },
        {
          label: "核减金额（万元）",
          url: require("@/assets/standtable/examination.png"),
          key: "deductionAmount",
        },
        {
          label: "合同金额（万元）",
          url: require("@/assets/standtable/p6.png"),
          key: "contractAmount",
        },
        {
          label: "已支付金额（万元）",
          url: require("@/assets/standtable/p7.png"),
          key: "totalProjectCumulativePayment",
        },
      ],
      config2: [
        // {
        //   label: "合同金额（万元）",
        //   url: require("@/assets/standtable/p6.png"),
        //   key: "contractAmount",
        // },
        // {
        //   label: "已支付金额（万元）",
        //   url: require("@/assets/standtable/p7.png"),
        //   key: "totalProjectCumulativePayment",
        // },
        // {
        //   label: "年度已支付金额（万元）",
        //   url: require("@/assets/standtable/p8.png"),
        //   key: "yearProjectCumulativePayment",
        // },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.amountCard {
  ul {
    display: flex;
    // flex-wrap: wrap;
    flex-wrap: nowrap;
    flex-direction: row;
    li {
      width: calc(25% - 6px);
      // height: 101px;
      margin-right: 8px;
      margin-bottom: 16px;
      padding-top: 16px;
      padding-left: 16px;
      // &:nth-child(4n) {
      &:nth-child(5n) {
        margin-right: 0;
      }
      .top {
        display: flex;
        align-items: center;

        img {
          width: 24px;
          margin-right: 4px;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
      }
      h3 {
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
    }
  }
}
</style>
