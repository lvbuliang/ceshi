<template>
  <div class="config_m">
    <div class="list">
      <label>专报月报获取周期配置：</label>
      每月&#x3000;&#x3000;
      <el-input-number
        :min="1"
        :max="activeMonthDays"
        v-model="monthPeriod"
        controls-position="right"
      ></el-input-number
      >&#x3000;&#x3000;号后
    </div>
    <div class="list">
      <label>专报季报获取周期配置：</label>
      当前季度后&#x3000;&#x3000;
      <el-input-number
        :min="1"
        :max="activeQuarterDays"
        v-model="quarterPeriod.first"
        controls-position="right"
      ></el-input-number
      >&#x3000;&#x3000;天&#x3000;&#x3000;和&#x3000;&#x3000;下一季度前
      <el-input-number
        :min="1"
        :max="nextQuarterDays"
        v-model="quarterPeriod.second"
        controls-position="right"
      ></el-input-number
      >&#x3000;&#x3000;天
    </div>
    <div class="list">
      <label>专报年报获取周期配置：</label>
      当前年度后&#x3000;&#x3000;
      <el-input-number
        :min="1"
        :max="activeYearDays"
        v-model="yearPeriod.first"
        controls-position="right"
      ></el-input-number
      >&#x3000;&#x3000;天&#x3000;&#x3000;和&#x3000;&#x3000;下一年度前
      <el-input-number
        :min="1"
        :max="nextYearDays"
        v-model="yearPeriod.second"
        controls-position="right"
      ></el-input-number
      >&#x3000;&#x3000;天
    </div>
    <div class="list">
      <el-button type="primary" @click="saveAndUpdate">保存</el-button>
      <el-button type @click="cencleHandle">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  api_addTimeConfigInfo, //时间配置信息新增
  api_queryTimeConfigList, //时间配置信息查询
  api_updateTimeConfigInfo, //时间配置信息修改
  api_queryCommWarnList, //待办预警查询
  api_updateCommWarnInfo, //待办预警修改
  api_queryMessageConfigList, //消息配置查询
  api_updateMessageConfigInfo, //消息配置修改
} from "@/api/configManage/configManage";
export default {
  data() {
    return {
      options: [
        {
          value: "0",
          label: "周日",
        },
        {
          value: "1",
          label: "周一",
        },
        {
          value: "2",
          label: "周二",
        },
        {
          value: "3",
          label: "周三",
        },
        {
          value: "4",
          label: "周四",
        },
        {
          value: "5",
          label: "周五",
        },
        {
          value: "6",
          label: "周六",
        },
      ],
      task_num: "1",
      day_time_start: "1",
      week_time_start: "1",
      month_time_start: "1",
      deliver_time: "1",
      keyId: "",
      nowTime: "",
      monthPeriod: "",
      quarterPeriod: {
        first: "",
        second: "",
      },
      yearPeriod: {
        first: "",
        second: "",
      },
      activeMonthDays: null,
      activeQuarter: null,
      activeQuarterDays: null,
      nextQuarterDays: null,
      activeYearDays: null,
      nextYearDays: null,
    };
  },
  mounted() {
    this.doHandleDate();
    this.queryTimeConfigList();
    this.getQuarter();
  },
  // 1 2 3,4 5 6,7 8 9,10 11 12
  methods: {
    //当前季度
    getQuarter() {
      var today = new Date();
      var year = today.getFullYear();
      var nextyear = today.getFullYear() + 1;
      var month = today.getMonth() + 1;
      this.getDay(year, month);
      // 闰年
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        this.activeYearDays = 366;
        this.nextYearDays = 365;
      }
      //平年
      else {
        this.activeYearDays = 365;
        if ((nextyear % 4 == 0 && nextyear % 100 != 0) || nextyear % 400 == 0) {
          this.nextYearDays = 366;
        } else {
          this.nextYearDays = 365;
        }
      }
      // ====================================================================
      //第一季度
      if (month <= 3) {
        this.activeQuarter = "第一季度";
        //闰年
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          this.activeQuarterDays = 91;
          this.nextQuarterDays = 91;
        }
        //平年
        else {
          this.activeQuarterDays = 90;
          this.nextQuarterDays = 91;
        }
      }
      //第二季度
      else if (month > 3 && month <= 6) {
        this.activeQuarter = "第二季度";
        this.activeQuarterDays = 91;
        this.nextQuarterDays = 92;
      }
      //第三季度
      else if (month > 6 && month <= 9) {
        this.activeQuarter = "第三季度";
        this.activeQuarterDays = 92;
        this.nextQuarterDays = 92;
      } //第四季度
      else if (month > 9 && month <= 12) {
        this.activeQuarter = "第四季度";
        this.activeQuarterDays = 92;
        //闰年
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          this.nextQuarterDays = 91;
        }
        //平年
        else {
          if (
            (nextyear % 4 == 0 && nextyear % 100 != 0) ||
            nextyear % 400 == 0
          ) {
            this.nextQuarterDays = 91;
          } else {
            this.nextQuarterDays = 90;
          }
        }
      }
    },
    getDay(year, month) {
      month = parseInt(month, 10);
      var temp = new Date(year, month, 0);
      this.activeMonthDays = temp.getDate();
    },
    // 保存更改
    saveAndUpdate() {
      // let monthDay = this.month_time_start.substring(
      //   this.month_time_start.length - 2
      // );
      this.updateTimeConfigInfo();
    },
    // 取消
    cencleHandle() {
      this.queryTimeConfigList();
    },
    // 时间配置信息更新
    updateTimeConfigInfo() {
      let data = {
        id: this.keyId,
        // workExpireDays: this.task_num,
        // dayDate: this.day_time_start,
        // weekDate: this.week_time_start,
        // monthDate: m,
        // deliveryDate: this.deliver_time,
        specialMonthDay: this.monthPeriod,
        specialQuarterlyBackDay: this.quarterPeriod.first,
        specialQuarterlyNextDay: this.quarterPeriod.second,
        specialYearBackDay: this.yearPeriod.first,
        specialYearNextDay: this.yearPeriod.second,
      };
      api_updateTimeConfigInfo(data).then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.queryTimeConfigList();
          this.$message({
            message: "修改成功",
            type: "success",
          });
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    // 获取当前年月
    doHandleDate() {
      var myDate = new Date();
      var tYear = myDate.getFullYear();
      var tMonth = myDate.getMonth();
      var m = tMonth + 1;
      if (m.toString().length == 1) {
        m = "0" + m;
      }
      this.nowTime = tYear + "-" + m;
    },
    //时间配置信息查询
    queryTimeConfigList() {
      api_queryTimeConfigList().then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.keyId = res.data.id;
          // this.task_num = res.data.workExpireDays;
          // this.day_time_start = res.data.dayDate;
          // this.week_time_start = res.data.weekDate + "";
          // this.month_time_start = this.nowTime + "-" + res.data.monthDate;
          // this.deliver_time = res.data.deliveryDate;
          this.monthPeriod = res.data.specialMonthDay;
          this.quarterPeriod.first = res.data.specialQuarterlyBackDay;
          this.quarterPeriod.second = res.data.specialQuarterlyNextDay;
          this.yearPeriod.first = res.data.specialYearBackDay;
          this.yearPeriod.second = res.data.specialYearNextDay;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.config_m /deep/ {
  width: 800px;
  height: 600px;
  overflow: hidden;
  margin-left: 300px;
  margin-top: 50px;
  .list:nth-last-child(1) {
    text-align: center;
  }
  .list:nth-last-child(2),
  .list:nth-last-child(3) {
    .el-input-number {
      width: 115px;
    }
  }
  .list:nth-last-child(4),
  .list:nth-last-child(5) {
    .el-input-number {
      width: 407px;
    }
  }
  .list {
    .el-select {
      margin-right: 10px;
      width: 450px;
    }
    .el-date-editor {
      margin-right: 10px;
    }
    .el-input-number {
      width: 450px;
    }
    .el-date-editor.el-input {
      width: 450px;
    }
    label {
      margin-right: 20px;
      display: inline-block;
      width: 180px;
      text-align: right;
      font-size: 14px;
      color: #000000;
    }
    margin: 32px;
  }
}
</style>