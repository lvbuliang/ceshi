<template>
  <!-- <div class="total-page"> -->
  <div id="apps">
    <!-- 项目日期 -->
    <div class="btnANDtext">
      <div class="btnez">
        <div class="btn">
          <!-- <el-button type="info" @click="btnSwitch">{{ switchBtn }}</el-button> -->
          <el-button plain round size="medium" @click="goback">返回</el-button>
          <!-- <el-button type="primary" @click="exportGantt" :disabled="exportDis"
              >导出</el-button
            > -->
        </div>
      </div>
      <div class="projectName">
        <div class="everyName">
          <span class="titleName">系统名称：</span>
          <span>{{ $route.query.systemNames }}</span>
        </div>
        <div class="everyName">
          <span class="titleName">项目名称：</span>
          <span>{{ $route.query.projectNames }}</span>
        </div>
        <div class="everyName" v-if="$route.query.sectionSort">
          <span class="bid_section">标段{{ $route.query.sectionSort }}</span>
        </div>
      </div>

      <div>
        <div class="tiptext">
          <div class="box">
            <div class="boxColor box1"></div>
            &nbsp;计划时间
          </div>
          <div class="box">
            <div class="boxColor box2"></div>
            &nbsp;实际时间
          </div>
          <!-- <div class="box">
            <div class="boxColor box3"></div>
            &nbsp;未开始
          </div> -->
          <!-- <div class="box">
            <div class="boxColor box5"></div>
            &nbsp;已超时
          </div> -->
        </div>
        <!-- <div class="tiptext">
          <div class="box">
            <div class="boxColor box4"></div>
            &nbsp;已完成
          </div>
          <div class="box">
            <div class="boxColor box5"></div>
            &nbsp;已超时
          </div>
        </div> -->
      </div>
    </div>
    <div class="wl-gantt-demo">
      <!-- date-type="monthAndDay" -->
      <wlGantt
        ref="wlDemo"
        class="wlGanttIntable"
        :loading="data.length == 0"
        use-real-time
        date-type="yearAndWeek"
        :arrayData="data"
        :columns="columns"
        :lazy="true"
        :usePreColumn="true"
        :useCard="false"
        :empty="emptyEext"
        :ganttOnly="ganttOnly"
        :ganttStartTime="ganttStartTime"
        :ganttEndTime="ganttEndTime"
        @preChange="preChange"
      >
      </wlGantt>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import WlGantt from "@/views/executionManagement/gantt/src/pages/wl-gantt/index.vue";
import {
  viewGantt,
  viewGanttTime,
  exportGanttApi,
} from "@/api/executionManagement";
export default {
  name: "executionManagementView",
  computed: {
    ganttStartTime() {
      return this.$route ? this.$route.query.ganttStartTime : "";
    },
    ganttEndTime() {
      return this.$route ? this.$route.query.ganttEndTime : "";
    },
    // viewData 项目名称 合同名称 系统名称
    // viewData() {
    //   return this.$route.query;
    // },
  },
  data() {
    return {
      viewData: {
        systemName: "",
        projectName: "",
        contractName: "",
      },
      widthB: "",
      projectTime: {},
      data: [], // 数据
      selected: [], // 选中数据
      columns: [{ type: "a", minWidth: 200, slot: "prv" }],
      // 可通过此参数配置列。其中内置有名称name、开始日期startDate、结束日期endDate、前置任务preTask，
      // 如果cloumns中有type等于这四个且slot为false时，将使用内置代码，当然除了内容使用内置代码，其他字段你还拥有配置权。
      // 另外如果不是为了配置内置列参数，slot中的prv和default仍可以用来自定义列
      days: "",
      week: "",
      viewData: [],
      // runderDatas: [],
      height: null,
      // Maxheight: null,
      // GStartDate: [""],
      // GEndDate: [""],
      vLoading: false,
      emptyEext: false,
      switchBtn: "折叠侧边栏",
      ganttOnly: false,
      exportDis: false,
    };
  },
  methods: {
    //
    /**
     * 前置任务发生更改
     * row: Object 当前行数据
     * oldval: [String, Array] 前置修改前的旧数据
     * handle: Boolean 是否用户编辑产生的改变
     */
    preChange(row, oldval, handle) {
      console.log("前置修改:", row, oldval, handle);
    },

    // // 懒加载
    lazyLoad(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: "1-1-1",
            pid: tree.id,
            name: "日落云巅",
            startDate: "2019-09-10",
            endDate: "2019-09-13",
          },
        ]);
      }, 1000);
    },
    goback() {
      this.$router.go(-1);
      // this.$router.push({
      //   name: "executionManagement",
      // });
    },
    getNowTime() {
      var date = new Date();
      var seperator1 = "/";

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var week = date.getDay();
      var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      week = weeks[week];

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;

      this.days = currentdate;
      this.week = week;
    },

    async getdata() {
      this.vLoading = true;
      let params = {
        projectId: this.$route.query.projectId,
        contractId: this.$route.query.contractId,
        sectionCount: this.$route.query.sectionCount,
        sectionSort: this.$route.query.sectionSort,
        isSection: this.$route.query.isSection,
        pageNum: 1,
        pageSize: 9999,
      };
      let res = await viewGantt(params);
      console.log(res, "11111");
      if (res.data.length != 0) {
        this.vLoading = false;
        this.data = res.data.records;
        this.exportDis = false;
      } else {
        this.vLoading = false;
        this.emptyEext = true;
        this.exportDis = true;
      }
    },
    btnSwitch() {
      this.ganttOnly = !this.ganttOnly;
      if (this.ganttOnly) {
        this.switchBtn = "展开侧边栏";
      } else {
        this.switchBtn = "折叠侧边栏";
      }
    },
    exportGantt() {
      exportGanttApi({
        projectId: Number(this.$route.query.projectId),
      }).then((res) => {
        console.log(res);
      });
    },
    // cellMouseEnter(row, column, cell, event) {
    //   let chi = cell.children.children;
    //   console.log(chi, "chi");
    // },
    initResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.widthB = entry.contentRect.width + "px";
        });
      });
      this.resizeObserver.observe(document.querySelector(".main-menu-box"));
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
  },
  components: {
    WlGantt,
  },
  created() {
    this.getdata();
    // 系统名称 项目名称 合同名称
    this.viewData.systemName = this.$route.query.systemName;
    this.viewData.projectName = this.$route.query.projectName;
    this.viewData.contractName = this.$route.query.contractName;
  },
  mounted() {
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
};
</script>

<style lang="scss" scoped>
#apps {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0px 25px;
  
  font-size: 12px;
}
.wl-scroll {
  // height: 100% !important;
}
.el-table--group::before,
.el-table--group::after,
.el-table__cell {
  border: none !important;
}
::v-deep.el-table--border .el-table__cell {
  border-left: none !important;
  border-right: none !important;
}
.el-table__body-wrapper {
  border: none !important;
}
.btnANDtext {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // height: 10%;
  padding: 5px;
  font-size: 1em;
  .btnez {
    display: flex;
    align-items: "center";
  }
}
.wl-gantt-demo {
  padding-bottom: 24px;
  .wlGanttIntable {
    height: 100%;
  }
}
.bottom-btns {
  position: fixed;
  bottom: 0;
  // width: calc(100% - 220px);
  border-left: 2px solid rgb(230, 230, 230);
  background: #fff;
  z-index: 10;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  .btns {
    height: auto;
    text-align: center;
    // padding-top: 16px;
    // border-top: 1px solid #e6e6e6;
    position: relative;
    .btnList {
      display: inline-block;
    }
    .back-btn {
      display: inline-block;
      margin-left: 16px;
    }
    button {
      padding: 0px 24px;
      line-height: 32px;
    }
  }
}
.btn {
  .el-button {
    width: 6em;
    height: 2.4em;
    padding: 0;
    border-radius: 0;
    font-size: 13px;
    span {
      font-size: 10px;
    }
  }
}
.tiptext {
  display: flex;
  color: black;
  font-family: "Avenir, Helvetica, Arial, sans-serif";
}
.box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 8px;
  // width: 70px;
  .boxColor {
    width: 25px;
    height: 7px;
    border-radius: 15px;
  }
  .box1 {
    background-color: rgb(66, 130, 255);
  }
  .box2 {
    background-color: rgb(255, 141, 26);
  }
  .box3 {
    background-color: rgb(142, 145, 151);
  }
  .box4 {
    background-color: rgb(103, 194, 58);
  }
  .box5 {
    background-color: rgb(255, 26, 26);
  }
}

.projectName {
  margin: 0 auto;
  display: flex;
  align-items: center;
  font-size: 14px;
  .everyName {
    font-weight: bolder;
    margin-right: 20px;
    .titleName {
      font-weight: bolder;
      font-size: 16px;
    }
    .bid_section {
      // border: 1px solid #409EFF;
      padding: 5px;
      background: linear-gradient(#00b4db, #0083b0);
      color: white;
    }
  }
}
</style>
