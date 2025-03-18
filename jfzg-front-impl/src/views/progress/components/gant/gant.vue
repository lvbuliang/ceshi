<template>
  <div>
    <div class="lcbTips">
      <div class="left">
        {{ overdueTimeStag.stageName }}
        <span class="cq yq" v-if="yuqiList.title == '逾期' && overdueTimeStag"
          >逾期 {{ overdueTimeStag.overdueTime }}天</span
        >
        <span class="cq" v-else>当前未逾期</span>
      </div>
      <div class="right">
        里程碑已完成：
        <span class="already">{{ yuqiList.statgeNum }}</span>
        <span class="total">/{{ yuqiList.total }}</span>
      </div>
    </div>
    <div class="gantPage">
      <!-- 分为两部分：表格和进度图（日历+进度） -->

      <div class="table" style>
        <!-- <gantTable :table="table" :formatter="tbFormat"></gantTable> -->
        <SrTable
          :data="table.data"
          :config="table.tableConfig"
          :page="table.page"
        ></SrTable>
      </div>

      <div class="gantBox">
        <!-- 当前月份 -->
        <template>
          <span class="left-arrow" v-if="isLeftTrue" @click="goLeft">
            <i class="el-icon-caret-left"></i>
          </span>
          <span class="left-arrow fs666" v-else>
            <i class="el-icon-caret-left"></i>
          </span>
        </template>
        <template>
          <span class="right-arrow" v-if="isRightTrue" @click="goRight">
            <i class="el-icon-caret-right"></i>
          </span>
          <span class="right-arrow fs666" v-else>
            <i class="el-icon-caret-right"></i>
          </span>
        </template>

        <!-- 定位单位年月 -->
        <div class="curMonth">
          <span class="t">{{ scrollYearMonth }}</span>
        </div>
        <div class="outer-box" ref="outer">
          <div class="gantBoxRow">
            <div class="day">
              <div class="compass" v-for="(item, i) in dayPosition" :key="i">
                <!-- <div class="month">
              <span>{{item.month}}</span>
                </div>-->
                <div>
                  <span :class="{ default: item.isDefault }">{{
                    item.day
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 审核情况checkSetbacks；上报情况setbacks-->
          <!-- v-if="setbacks == 'checkSetbacks'" -->
          <ul class="stepsBox">
            <!--计算宽度（40*m(开始时间与结束日期)）margin-left:距离最小日期的距离；）  -->
            <li v-for="(item, i) in table.data" :key="i">
              <!-- <span
                v-if="item.status"
                class="go"
                :style="{
                  backgroundColor: item.color,
                  marginLeft: item.goleft + 'px',
                  width: item.checkSetbacks == 0 ? 0 : item.goWidth + 'px',
                }"
              ></span>
              <span
                class="bg"
                :style="{
                  marginLeft: item.left + 'px',
                  width: item.width + 'px',
                }"
              ></span> -->
              <span
                :style="{
                  marginLeft: item.left + 15 + 'px',
                  display: 'flex',
                  'align-items': 'center',
                }"
              >
                <span
                  class="bg"
                  v-for="(it, index) in item.width / 40"
                  :key="index"
                  :style="{
                    width: 40 + 'px',
                    backgroundColor:
                      item.milestoneReviewName === '逾期'
                        ? '#F9455A'
                        : item.milestoneReviewName === '进行中'
                        ? '#007AFF'
                        : '#f0f2f5',
                  }"
                ></span>
              </span>
            </li>
          </ul>
          <!-- <ul class="stepsBox" v-else>
            <li v-for="(item, i) in table.data" :key="i">
              <span
                class="go"
                :style="{
                  backgroundColor: item.color,
                  marginLeft: item.goleft + 'px',
                  width: item.setbacks == 0 ? 0 : item.goWidth + 'px',
                }"
              ></span>
              <span
                class="bg"
                :style="{
                  marginLeft: item.left + 'px',
                  width: item.width + 'px',
                }"
              ></span>
            </li>
          </ul> -->
        </div>
      </div>
    </div>
    <div class="pages" v-if="table.page.total > (10)">
      <!-- <div class="ts">
        <i class="os el-icon-info"></i> 点击图中里程碑名称查看对应里程碑阶段的任务列表
      </div> -->
      <pagination
        style="margin-top: 4px"
        :page="table.page"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
    </div>
  </div>
</template>
<script>
import pagination from "../FPagination/pagination";
import gantTable from "./gantTable";
import { taskStatusList } from "@/utils/filter";
import { milestone_list, overdueTime } from "@/api/progress";
import { api_userSetQuery } from "@/api/index.js";
import { milestonepermissionCode } from "@/views/milestone/const.js";
import { getCompareDate, compareTimeTwice } from "@/utils/plan";
import store from "@/store";
import treeVue from "../../../expert/children/addStep/tree.vue";
import uRowVue from "../../../../../../jfzg-front-h5/uview-ui/components/u-row/u-row.vue";
export default {
  props: {
    setbacks: [String],
    curList: [Array],
  },
  components: {
    gantTable,
    pagination,
  },
  data() {
    return {
      overdueTimeStag: {
        stageName: "",
        overdueTime: "",
      },
      userInfo: store.getters.userInfo,
      yuqiList: {
        title: "逾期", // 进度情况,只要有一个延期，就是延期，延期天数取最大值
        overdueTime: 0, //延期天数
        normal: "", //现有进度
        abnormal: "", //应有进度
        statgeNum: 0, // 当前里程碑进度
        total: 0, // 总里程碑
      },
      projectId: this.$route.query.projectId,
      i: 0,
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "100",
            fixed: "right",
            allTableHeader: "",
            hideHeaderSetting: true
          },
          innerBtn: [
            // // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编制",
              method: "edit",
              type: "text",
              size: "small",
              field: "status",
              value: [2, 3, 1000],
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidateEdit, //自定义判断是否展示按钮权限
            },
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              field: "status", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [null], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidateView, //自定义判断是否展示按钮权限
            },
            {
              name: "审查",
              method: "report",
              type: "text",
              size: "small",
              field: "status",
              value: [1000, 2, null],
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate_shencha, //自定义判断是否展示按钮权限
            },
            {
              name: "检查",
              method: "report",
              type: "text",
              size: "small",
              field: "status",
              value: [1000, 3, null],
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate_jiancha, //自定义判断是否展示按钮权限
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNo: 1, //当前页
          background: true,
          minSize:9999  //为了去除表格组件带的分页器
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },

      curYearMonth: "", //滑动日期，默认当前月份
      scrollYearMonth: "", //当前日期
      dayLine: [], //日期线
      dayPosition: [],
      scrollbarWidth: 0,
      scrollLeft: 0, //滚动条滚动距离
      scrollWidth: 0, //滚动条区域宽度
      cellWidth: 40,
      containWidth: 650,
      minDate: "", //最小日期
      step: 7, //默认前后，后退个数
      isLeftTrue: false,
      isRightTrue: false,
      stepLeft: 0,
      isDefaultStep: 0,
    };
  },
  mounted() {
    // 2  建设单位
    console.log("登录人", this.userInfo);
    if (this.projectId) {
       this.lcbNumInit();
      this.stageTaskSetbacksList();
     
    }
    this.scrollYearMonth = this.$moment().format("YYYY年MM月");
    this.curYearMonth = this.$moment().format("YYYY年MM月DD");
    this.getTbHeader();

    this.$nextTick(() => {
      this.$refs.outer.addEventListener("scroll", this.changeMonthScroll);
    });
  },
  watch: {
    scrollLeft(val) {
      this.scrollLeft = val;
      /**
       * 计算位置：走个多少格，每天都在第几格
       */
      //console.log('scrollLeft',this.scrollLeft)
      /**判断左箭头 */
      if (this.scrollLeft) {
        this.isLeftTrue = true;
      } else {
        this.isLeftTrue = false;
      }
      /**判断右箭头 */
      // console.log('总宽度',this.scrollWidth)
      if (!this.scrollLeft) {
        this.scrollWidth > this.$refs.outer.clientWidth
          ? (this.isRightTrue = true)
          : (this.isRightTrue = false);
      } else {
        this.scrollWidth > this.scrollLeft + this.$refs.outer.clientWidth
          ? (this.isRightTrue = true)
          : (this.isRightTrue = false);
      }

      this.dayPosition.map((item) => {
        if (item.position == parseInt(this.scrollLeft / this.cellWidth)) {
          if (this.i != 0) {
            this.scrollYearMonth = item.year + "年" + item.month + "月";
          }
          this.i++;
        }
      });
    },
  },

  methods: {
    btnValidateView(item, row) {
      console.log(item);
      let flag = false;
      if (
        (this.userInfo.currentRole.roleCode == "JLDW_JBR" && row.status == 3) ||
        row.status == 1000 ||
        this.userInfo.currentRole.roleCode == "CJDW_JBR"
      ) {
        flag = true;
      } else if (
        (this.userInfo.currentRole.roleCode == "JSDW_JBR" && row.status == 2) ||
        row.status == 1000 ||
        this.userInfo.currentRole.roleCode == "CJDW_JBR"
      ) {
        flag = true;
      }
      return flag;
    },
    btnValidateEdit(item, row) {
      let flag = false;
      if (this.userInfo.currentRole.roleCode == "CJDW_JBR") {
        flag = true;
      }
      return flag;
    },
    btnValidate_jiancha(item, row) {
      let flag = false;
      if (this.userInfo.currentRole.roleCode == "JLDW_JBR") {
        flag = true;
      }

      return flag;
    },
    btnValidate_shencha(item, row) {
      let flag = false;

      if (this.userInfo.currentRole.roleCode == "JSDW_JBR") {
        flag = true;
      }
      return flag;
    },
    edit(row) {
      this.$router.push({
        name: "milestoneEdit",
        query: {
          id: row.id,
          projectId: row.projectId,
          templateId: row.templateId,
          processId: row.processId,
          stageId: row.stageId,
        },
      });
    },
    report(row) {
      this.$router.push({
        name: "milestoneReport",
        query: {
          id: row.id,
          projectId: row.projectId,
          processId: row.processId,
          templateId: row.templateId,
          stageId: row.stageId,
        },
      });
    },
    see(row) {
      this.$router.push({
        name: `milestoneView`,
        query: {
          id: row.id,
          projectId: row.projectId,
          templateId: row.templateId,
          processId: row.processId,
          stageId: row.stageId,
          backName: "progressView",
        },
      });
    },
    goRight() {
      let width = this.step * this.cellWidth;
      // console.log('固定宽度',width)
      // console.log('rightscrollLeft',this.scrollLeft)

      if (this.scrollLeft) {
        this.scrollWidth - this.scrollLeft > width
          ? this.outerScrollTo(this.scrollLeft + width, 0)
          : this.outerScrollTo(this.scrollWidth - this.scrollLeft, 0);
      } else if (this.scrollLeft == undefined) {
        this.outerScrollTo(width, 0);
      }
    },
    outerScrollTo(_from, _to) {
      if (this.$refs.outer) {
        this.$refs.outer.scrollTo(_from, _to);
      }
    },
    /**向左：1每次移动width,结束条件left小于width */
    goLeft() {
      let width = this.step * this.cellWidth;
      // console.log('固定宽度',width)
      // console.log('leftscrollLeft',this.scrollLeft)
      if (this.scrollLeft > width) {
        this.outerScrollTo(this.scrollLeft - width, 0);
      } else {
        this.outerScrollTo(0, 0);
      }
    },
    /**
     * 表格数据处理
     */
    tbFormat(key, val, row) {
      if (key == "taskStatus") {
        return taskStatusList(row["taskStatus"]);
      }
    },
    // 里程碑完成度

    async lcbNumInit() {
      let res1 = await overdueTime({ projectId: this.projectId });
      if (res1.msg.code == "0000" && res1.data) {
        console.log("里程碑", res1.data);
        if (res1.data.overdueTimeStag) {
          this.$set(this, "overdueTimeStag", res1.data.overdueTimeStag);
        }

        this.$set(this, "yuqiList", {
          ...res1.data,
          title: !res1.data.overdueTime ? "正常" : "逾期",
        });
        console.log("里程碑", this.yuqiList);
      }
    },
    /**
     * 获取任务列表
     */
    stageTaskSetbacksList() {
      let params = {
        projectId: this.projectId, //后面直接传递数据过来就行
        pageNo: this.table.page.pageNo,
        pageSize: this.table.page.pageSize,
      };
      milestone_list(params).then((res) => {
        if (res.data) {
          console.log("里程碑列表", res.data.records);
          this.table.data = res.data.records;
          this.getMaxMinDate(this.table.data);

          //对数据进行扩展left和width
          // 计算宽度（40*m(开始时间与结束日期)）margin-left:距离最小日期的距离；）
          this.table.data.forEach((item, i) => {
            let diff = this.$moment(item.dueEndTime).diff(
              this.$moment(item.dueStartTime),
              "days"
            ); //最大日期最小日期间距;如果是0，代表同一天，width=cellWidth
            let godiff = this.$moment(item.lastTime).diff(
              this.$moment(item.firstTime),
              "days"
            );

            //距离最小日期间距
            let diffMin = this.$moment(item.dueStartTime).diff(
              this.$moment(this.minDate),
              "days"
            );
            //距离操作时间的距离
            let godiffMin = this.$moment(item.firstTime).diff(
              this.$moment(this.minDate),
              "days"
            );
            let color = "#007AFF";
            if (item.status) {
              color =
                item.status == 0
                  ? "#FF9535"
                  : item.status == 1
                  ? "#007AFF"
                  : "#F9455A"; //根据状态判断颜色
            }

            item["width"] = (diff + 1) * this.cellWidth;
            item["goWidth"] = (godiff + 1) * this.cellWidth;
            item["color"] = color;
            item["left"] = diffMin * this.cellWidth;
            item["goleft"] = godiffMin * this.cellWidth;
          });

          // console.log(this.table.data);

          this.table.page.total = res.data.total;
          this.table.page.pages = res.data.pages;
        }
      });
    },

    /**
     * 获取一段时间范围的内容
     */
    getRangeTime(start_time, end_time) {
      //如果最大值小于当前时间，默认显示当前时间日期
      var start_time = start_time;
      if (start_time == end_time) {
        // 如果开始和结束同一天，开始时间往前13
        start_time = this.$moment(start_time)
          .subtract("days", 13)
          .format("YYYY-MM-DD");
      }
      if (compareTimeTwice(end_time, this.$moment().format("YYYY-MM-DD"))) {
        var end_time = this.$moment(end_time)
          .subtract("days", -13)
          .format("YYYY-MM-DD");
      } else {
        var end_time = this.$moment(end_time)
          // 时间往后加13天
          .subtract("days", -13)
          .format("YYYY-MM-DD");
      }

      var bd = new Date(start_time),
        be = new Date(end_time);
      var bd_time = bd.getTime(),
        be_time = be.getTime(),
        time_diff = be_time - bd_time;

      var c_arr = []; //每天所在单元格位置
      let m = 0;
      let year = this.$moment(start_time).format("YYYY");
      let isDefault = false; //是否包含当天日期

      for (var i = 0; i <= time_diff; i += 86400000) {
        var ds = new Date(bd_time + i);
        // 计算月份
        let month =
          (ds.getMonth() + 1).toString().length == 1
            ? "0" + (ds.getMonth() + 1)
            : "" + (ds.getMonth() + 1);
        //计算天数
        let day =
          ds.getDate().toString().length == 1
            ? "0" + ds.getDate()
            : "" + ds.getDate();

        //计算年份
        if (month == "12" && day == "31") {
          year = parseInt(year) + 1;
        }
        //判断是否包含当天日期
        let ymd = year + "年" + month + "月" + day;
        if (ymd == this.$moment().format("YYYY年MM月DD")) {
          isDefault = true;
        } else {
          isDefault = false;
        }
        let obj = {
          month: month,
          position: m++,
          day: day,
          isDefault: isDefault,
          year: year,
        };
        c_arr.push(obj);
      }

      this.dayPosition = c_arr;

      this.dayPosition.map((item) => {
        if (item.isDefault) {
          this.$nextTick(() => {
            this.outerScrollTo(
              item.position * this.cellWidth - this.containWidth / 2,
              0
            );
          });
          this.scrollYearMonth = item.year + "年" + item.month + "月";
        }
      });
      // console.log(this.dayPosition, "this.dayPosition");
    },

    /**
     * 找出一组数据中最小和最大日期
     */
    getMaxMinDate(data, type) {
      let startDate = [];
      let endDate = [];
      data.map((item) => {
        startDate.push(item.dueStartTime);
        endDate.push(item.dueEndTime);
        if (item.firstTime) {
          startDate.push(item.firstTime);
        }
      });
      //startDate找最小值，endDate找最大值(如果最大值小于当前日期，日期显示到当前时间)
      this.minDate = getCompareDate(startDate, "min");

      this.getRangeTime(
        getCompareDate(startDate, "min"),
        getCompareDate(endDate, "max")
      );
      if (type == "min") {
        return getCompareDate(startDate, "min");
      } else {
        getCompareDate(endDate, "max");
      }
    },

    //日期滑动至月份改变
    changeMonthScroll() {
      this.scrollLeft =
        this.$refs.outer.scrollLeft || this.$refs.outer.pageXOffset;
      this.scrollWidth = this.$refs.outer.scrollWidth;
    },

    /**
     * 分页切换
     */
    currentChange(data) {
      this.table.page.pageNo = data;
      this.stageTaskSetbacksList();
    },

    sizeChange(data) {
      this.table.page.pageSize = data;
      this.stageTaskSetbacksList();
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: milestonepermissionCode }).then(
        (res) => {
          let headerData = JSON.parse(res.data.data).sort(
            (a, b) => a.index - b.index
          );
          this.table.tableConfig.operateConfig.allTableHeader = headerData;
          console.log("表头", headerData);
          headerData.forEach((item) => {
            if (item.label === "权重（%）") {
              item.isShow = false;
            }
          });

          this.table.tableConfig.header = headerData.filter(
            (item) => item.isShow
          );
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.lcbTips {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  height: 24px;
  align-items: center;
  .left {
    color: #666666;
    font-weight: bold;
    font-size: 16px;

    .cq {
      margin-left: 6px;
      font-size: 14px;
      font-weight: 400;
    }

    .yq {
      color: #f5222d;
      background: rgba(245, 34, 45, 0.1);
      border-radius: 8px;
      padding: 0px 8px;
    }
  }

  .right {
    color: #333;
    font-size: 14px;
    .already {
      color: #666;
    }
    .total {
      color: #999;
    }
  }
}
.pages {
  background: #fff;
  display: flex;
  padding: 0 30px;
  border: 1px solid #c5dcf1;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  border-top: 0;
  .ts {
    color: #666;
    line-height: 73px;
    font-size: 12px;
  }
  .os {
    color: #ff9535;
  }
}
.gantPage {
  display: flex;
  background: #fff;
  position: relative;
  .table {
    .sr_table {
      &::v-deep {
        .sr_table_bottom {
          margin-top: 0;
        }
      }
    }
  }
  .fs666 {
    color: #999;
  }

  .table {
    width: 500px;
    border: 1px solid #c5dcf1;
    border-right: 0;
    border-radius: 8px 0 0 0;
    overflow: hidden;
    ::v-deep .sr_table .el-table {
      border: none;
      th > .cell {
        height: 54px;
        line-height: 54px;
        background: #fafafa;
      }
      th.is-leaf {
        border-left: none;
      }
      td,
      th.is-leaf {
        border-bottom: 1px solid #f2f6fa;
      }
    }
  }

  .gantBox {
    flex: 1;
    position: relative;
    border: 1px solid #c5dcf1;
    border-radius: 0 8px 0 0;
    overflow: hidden;
    overflow-x: auto;
    .left-arrow {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 26px;
      color: #333;
      text-align: center;
      background: #f5f5f5;
      height: 55px;
      padding-top: 10px;
      z-index: 999;
      line-height: 55px;
      border-right: 1px solid #c5dcf1;
      border-bottom: 1px solid #c5dcf1;
    }

    .right-arrow {
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      width: 26px;
      color: #333;
      padding-top: 10px;
      text-align: center;
      background: #f5f5f5;
      height: 55px;
      z-index: 999;
      line-height: 55px;
      border-left: 1px solid #c5dcf1;
      border-bottom: 1px solid #c5dcf1;
    }

    .left-arrow,
    .right-arrow {
      cursor: pointer;
      &:hover {
        background: #e6f7ff;
      }
    }
    .curMonth {
      position: absolute;
      text-align: center;
      color: #1890ff;
      font-size: 12px;
      left: 45%;

      span.t {
        display: inline-block;
        height: 22px;
        background: #e6f7ff;
        border-radius: 0px 0px 4px 4px;
        padding: 2px 12px;
      }
    }
    .outer-box {
      width: 100%;
      min-height: 290px;
      overflow-x: auto;
    }
    .gantBoxRow {
      display: flex;
      position: relative;
      height: 55px;
    }
    .day {
      flex: 1;
      margin: 0 26px;
      display: flex;
      margin-top: 29px;
      position: relative;
      border-bottom: 1px solid #c5dcf1;

      .default {
        background: #007aff;
        color: #fff;
        display: inline-block;
        margin-top: -3px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
      .month {
        color: #ccc;
        height: 16px;
      }
      .compass {
        font-size: 12px;
        div {
          width: 40px;
        }
      }
    }
    .stepsBox {
      li {
        // height: 41px;
        // line-height: 41px;
        height: 81px;
        line-height: 81px;
        // &:not(:last-child) {
        //   border-bottom: 1px solid #F2F6FA;
        // }
        position: relative;
        display: flex;
        align-items: center;
        span {
          // position: absolute;
          // top: 50%;
          height: 6px;
          display: inline-block;
        }
        span.bg {
          background: #f0f2f5;
          margin-top: -2px;
        }
        span.go {
          // background: #007aff;
          margin-top: 8px;
          z-index: 99;
        }
      }
    }
  }
}
</style>
<style lang="scss">
html {
  overflow-y: scroll;
}

.gantPage {
  .table-components .el-table tr.el-table__row--striped td {
    background: #fff;
    border-bottom: 1px solid #c5dcf1;
  }

  .el-table td {
    border-bottom: 1px solid #c5dcf1;
  }
}
</style>