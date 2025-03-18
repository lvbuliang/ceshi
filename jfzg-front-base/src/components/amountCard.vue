<template>
  <div class="amountCard">
    <ul>
      <li v-for="(item, index) in config" :key="index">
        <div class="top">
          <img :src="item.url" /> <span>{{ item.label }}</span>
        </div>
        <h3>{{ amounts[item.key] | currency}}</h3>
      </li>
    </ul>
  </div>
</template>

<script>
const digitsRE = /(\d{3})(?=\d)/g
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
      return (
        sign + currency + head + _int.slice(i).replace(digitsRE, "1,")+_float
      );
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
      config: [
        {
          label: "总投资金额（万元）",
          url: require("@/assets/standtable/p1.png"),
          key: "totalInvesAmount",
        },
        {
          label: "送审金额（万元）",
          url: require("@/assets/standtable/p2.png"),
          key: "sendAuditAmount",
        },
        // {
        //   label: "审定/概算金额（万元）",
        //   url: require("@/assets/standtable/p3.png"),
        //   key: "auditAmount",
        // },
        {
          label: "核减金额（万元）",
          url: require("@/assets/standtable/p4.png"),
          key: "reduceAmount",
        },
        // {
        //   label: "招标金额（万元）",
        //   url: require("@/assets/standtable/p5.png"),
        //   key: "invitationAmount",
        // },
        {
          label: "合同金额（万元）",
          url: require("@/assets/standtable/p6.png"),
          key: "contractAmount",
        },
        {
          label: "已支付金额（万元）",
          url: require("@/assets/standtable/p7.png"),
          key: "payAmount",
        },
        {
          label: "年度已支付金额（万元）",
          url: require("@/assets/standtable/p8.png"),
          key: "currYearTotalPayAmount",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.amountCard {
  ul {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    li {
      width: calc(25% - 6px);
      height: 101px;
      background: #fafafa;
      border-radius: 8px;
      margin-right: 8px;
      margin-bottom: 8px;
      padding-top: 16px;
      padding-left: 24px;
      &:nth-child(4n) {
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
          font-size: 12px;
          color: #666666;
        }
      }
      h3 {
        font-weight: 500;
        color: #333333;
        font-size: 36px;
      }
    }
  }
}
</style>