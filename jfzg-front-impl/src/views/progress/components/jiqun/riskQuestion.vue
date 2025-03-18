<template>
  <!-- 风险/问题 -->
  <div class="riskQuestion">
    <div class="tabCard">
      <tabCard :titleList="tabList" @switchTab="switchTabRisk"></tabCard>
      <div class="fxrisk" style="display: flex;margin-top: 10px">
        <span class="t">问题</span>
        <div>
          <span class="riskHColor riskHBg">高{{ qrQuestionDataCopy.highNum || 0 }}</span>
          <span class="riskMColor riskMBg">中{{ qrQuestionDataCopy.secondary || 0 }}</span>
          <span class="mgr0 riskDColor riskDBg">低{{ qrQuestionDataCopy.lowNum || 0 }}</span>
        </div>
      </div>
      <div class="fxrisk" style="margin-top: 16px; display: flex">
        <span class="t">风险</span>
        <div class="riskSpan">
          <span class="riskHColor riskHBg">高{{ qrTaskDataCopy.highNum || 0 }}</span>
          <span class="riskMColor riskMBg">中{{ qrTaskDataCopy.secondary || 0 }}</span>
          <span class="mgr0 riskDColor riskDBg">低{{ qrTaskDataCopy.lowNum || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tabCard from "./tabCard"; //tab切换

export default {
  components: { tabCard },
  data() {
    return {
      tabList: [],
      qrQuestionDataCopy: {},
      qrTaskDataCopy: {},
    };
  },
  props: {
    riskQuestion_data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    switchTabRisk(data) {
      if (data === "0") {
        this.qrQuestionDataCopy = {
          highNum: this.riskQuestion_data.quesSelf.highQuestion,
          secondary: this.riskQuestion_data.quesSelf.middleQuestion,
          lowNum: this.riskQuestion_data.quesSelf.lowQuestion,
        };
        this.qrTaskDataCopy = {
          highNum: this.riskQuestion_data.riskSelf.highRisk,
          secondary: this.riskQuestion_data.riskSelf.middleRisk,
          lowNum: this.riskQuestion_data.riskSelf.lowRisk,
        };
      } else {
        this.qrQuestionDataCopy = {
          highNum: this.riskQuestion_data.quesStat.highQuestion,
          secondary: this.riskQuestion_data.quesStat.middleQuestion,
          lowNum: this.riskQuestion_data.quesStat.lowQuestion,
        };
        this.qrTaskDataCopy = {
          highNum: this.riskQuestion_data.riskStat.highRisk,
          secondary: this.riskQuestion_data.riskStat.middleRisk,
          lowNum: this.riskQuestion_data.riskStat.lowRisk,
        };
      }
    },
  },
  created() {
    if (this.$store.state.user.theme == "yuhua") {
      this.tabList = [{ name: "自检情况", value: "0" }];
    } else {
      this.tabList = [
        { name: "自检情况", value: "0" },
        { name: "统筹情况", value: "1" },
      ];
    }

    //初始化展示自检情况下的问题和风险
    this.qrQuestionDataCopy = {
      highNum: this.riskQuestion_data.quesSelf.highQuestion,
      secondary: this.riskQuestion_data.quesSelf.middleQuestion,
      lowNum: this.riskQuestion_data.quesSelf.lowQuestion,
    };
    this.qrTaskDataCopy = {
      highNum: this.riskQuestion_data.riskSelf.highRisk,
      secondary: this.riskQuestion_data.riskSelf.middleRisk,
      lowNum: this.riskQuestion_data.riskSelf.lowRisk,
    };
    // quesSelf: // <=问题自检
    // riskSelf: // <=风险自检

    // quesStat: // <=问题统筹
    // riskStat: // <=风险统筹
  },
};
</script>
<style lang="scss" scoped>
/**风险 */
.tabCard {
  margin-top: 14px;
}
::v-deep .el-tabs {
  > .el-tabs__header {
    border: none;
    .el-tabs__nav {
      border: none;
      .el-tabs__item {
        border: 1px solid #dfe4ed;
        height: 100%;
      }
      .is-active {
        background: #007aff;
        color: #fff;
      }
    }
  }
}
.fxrisk {
  font-size: 12px;
  span.t {
    color: #666;
    font-size: 14px;
    padding-left: 0;
    padding-right: 20px;
  }
  span {
    display: inline-block;
    // margin-right: 6px;
    padding: 2px 15px;
    border-radius: 10px;
  }
}
.riskHBg {
  margin-right: 12px;
}
.riskMBg {
  margin-right: 8px;
}
</style>