<template>
  <!-- 项目信息列表 -->
  <div class="projectList">
    <div class="tjbox2_text">
      <div class="top">
        <div class="middle_left_left_border"></div>
        项目列表
      </div>
      <div class="right" @click="changeplan">查看更多</div>
    </div>

    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
      @selected="selected"
      :status="selectStatus"
      class="srTable"
      ref="selectTable"
    >

      <div slot="cellSlot" slot-scope="scope">
        <div v-if="userInfo.currentRole.roleCode == 'CJDW_XMJL'">
          {{ scope.scope.row.projectName }}
        </div>
        <div v-else class="table_unitName" @click="chakan(scope.scope.row)">
          {{ scope.scope.row.projectName }}
        </div>
      </div>
      <!-- <template slot="name" slot-scope="scope">
          <div class="templateDownloadBox">关注</div>
        </template> -->
    </SrTable>
    <MemberManage
      :dialogVisible="memberManagedialogVisible"
      :personData="personData"
      :pilIds="pilIds"
      :memberManageText="memberManageText"
      @close="closeMemberManage"
      @saveLabelList="saveMemberManage"
      @saveLabelList2="saveMemberManage2"
      v-if="memberManagedialogVisible"
      ref="memberManageDialogRef"
    ></MemberManage>
  </div>
</template>

<script>
import {
  getQueryProjectList,
  api_userSetQuery,
  updateMemberManagement,
} from "@/api/planProject";
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转
import MemberManage from "@/views/home/components/MemberManage.vue";

export default {
  components: { MemberManage },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  data() {
    return {
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          // load: this.load,
          // maxHeight: 220,
          tooltipEffect: "light",
          header: [],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: false,
            width: "40",
          },
          /* slotOperateConfig: {
            display: true,
            label: "关注",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
          }, */
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            // fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
            hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "成员管理", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "memberCatchA", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
          ],
        },
        page: {
          // 分页配置
          total: 100, //总条数
          pages: 10, //总页数
          pageSize: 5, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      memberManageText: "",
      memberManagedialogVisible: false, //成员管理弹框
      pilId: [], //批量分配项目id
      personData: "",
      testData: [],
      yearPlanId: "",
      source: "",
    };
  },
  methods: {
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M021_001" }).then((res) => {
        // this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        //console.log(headerData);
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "beginDate") {
            item.sortable = "custom";
            // 上下翻转箭头
            item.width = "110px";
          }
          // if (item.prop == "totalInvestmentAmount") {
          //   item.sortable = "custom";
          //   item.width = "280px";
          // }

          // if (item.prop == "systemName") {
          //   // item.cellSlot = true;
          //   // item.width = "240px"; //加宽系统名称
          // }
          if (item.prop == "projectName") {
            item.cellSlot = true;
            item.width = "300px"; //加宽项目名称
          }
          // if (item.prop == "projectCode") {
          //   //项目编码
          //   item.width = "170px";
          // }
          // if (item.prop == "applicationUnit") {
          //   //需求部门
          //   // item.width = "120px";
          // }
          // if (item.prop == "planYear") {
          //   //所属年度计划
          //   item.width = "160px";
          // }
          // if (item.prop == "projectMaturity") {
          //   //所属阶段
          //   item.width = "110px";
          // }

          return item.isShow;
        });
      });
    },
    changeYear(data) {
      this.source = data.source;
      this.yearPlanId = data.time;
      this.getTbData();
    },

    getTbData() {
      console.log(this.yearPlanId, "shangqu");
      console.log(this.yearPlanId == "");
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        isSubproject: 0,
        selectType: 0,
        source: this.source == "" ? "0" : String(this.source),
        yearPlanId: this.yearPlanId == "" ? "2024" : this.yearPlanId,
      };

      getQueryProjectList(param).then((res) => {
        if (res.data) {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          this.table.data = res.data.records;
        }
      });
    },
    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    btnValidate(row, item) {
      if (
        row.name == "编辑" &&
        this.userInfo.currentRole.roleCode != "CJDW_XMJL"
      ) {
        return true;
      }
      if (
        row.name == "成员管理" &&
        (this.userInfo.currentRole.roleCode == "FZGHC_JBRBF" ||
          this.userInfo.currentRole.roleCode == "XMFZR")
      ) {
        return true;
      }
      return false;
    },
    chakan(row) {
      // 更新tabs页签
      let element = {
        url: `/subdecl/#/planProject/planProjectView?id=${row.id}&processId=${row.processId}&templateId=${row.templateId}&testId2=1`,
        title: "查看项目信息",
      };
      let tabsList = JSON.parse(sessionStorage.getItem("tabsList")) || [];
      let obj = tabsList.findIndex((item) =>
        item.url.includes("/subdecl/#/planProject")
      );
      if (obj > -1) {
        // routerGo(obj.url);
        tabsList.splice(obj, 1, element);
      } else {
        tabsList.push({
          ...element,
        });
      }
      sessionStorage.setItem("tabsList", JSON.stringify(tabsList));
      routerGo(element.url);
    },
    see(row) {
      const styleGuard = document.createElement("style");
      styleGuard.textContent = `
    @keyframes style-protect { 
      from { opacity:0; } 
      to { opacity:1; }
    }
    * {
      animation: style-protect 1ms !important;
    }
  `;
      document.head.appendChild(styleGuard);

      // 更新tabs页签
      let element = {
        url: `/subdecl/#/planProject/planProjectEdit?id=${row.id}&processId=${row.processId}&templateId=${row.templateId}&testId2=-1`,
        title: "查看项目信息",
      };

      // 使用专用通信通道
      window.qiankunStyleClean = true;

      let tabsList = JSON.parse(sessionStorage.getItem("tabsList")) || [];
      let obj = tabsList.findIndex((item) =>
        item.url.includes("/subdecl/#/planProject")
      );
      if (obj > -1) {
        // routerGo(obj.url);
        tabsList.splice(obj, 1, element);
      } else {
        tabsList.push({
          ...element,
        });
      }
      sessionStorage.setItem("htmlData", element.title);
      sessionStorage.setItem("tabsList", JSON.stringify(tabsList));

      routerGo(element.url);
      // .finally(() => {
      //   // 使用安全清理函数
      //   const safeCleanup = () => {
      //     try {
      //       // 检查样式保护层是否存在
      //       if (styleGuard?.parentNode) {
      //         styleGuard.remove();
      //       } else {
      //         console.warn("样式保护层已被提前移除");
      //       }

      //       // 安全删除全局变量
      //       if (
      //         Object.prototype.hasOwnProperty.call(
      //           window,
      //           "qiankunStyleClean"
      //         )
      //       ) {
      //         delete window.qiankunStyleClean;
      //       }
      //     } catch (error) {
      //       console.error("清理过程中发生异常:", error);
      //       // 上报错误到监控系统
      //       Sentry.captureException(error);
      //     }
      //   };

      //   // 添加延迟清理保护
      //   const cleanupTimer = setTimeout(safeCleanup, 300);

      //   // 添加取消机制（可选）
      //   window.__CLEANUP_HANDLER__ = () => {
      //     clearTimeout(cleanupTimer);
      //     safeCleanup();
      //   };
      // })
      // .catch((error) => {
      //   console.error("路由跳转发生错误:", error);
      //   // 特殊错误处理逻辑
      //   if (error.message.includes("Navigation cancelled")) {
      //     showErrorMessage("导航被取消");
      //   }
      // });
    },
    memberCatchA(row) {
      this.memberManageText = "成员管理内";
      this.memberManagedialogVisible = true;
      this.pilId = [row.id];
      this.personData = row.id;

      this.$nextTick(() => {
        this.$refs.memberManageDialogRef.searchSection(row);
      });
    },
    // 查看更多
    changeplan() {
      // 更新tabs页签
      let element = {
        url: `/subdecl/#/planProject`,
        title: "项目信息",
      };
      let tabsList = JSON.parse(sessionStorage.getItem("tabsList")) || [];
      let obj = tabsList.findIndex((item) =>
        item.url.includes("/subdecl/#/planProject")
      );
      if (obj > -1) {
        // routerGo(obj.url);
        tabsList.splice(obj, 1, element);
        console.log(
          tabsList.splice(obj, 1, element),
          "tabsList.splice(obj, 1, element)"
        );
      } else {
        tabsList.push({
          ...element,
        });
        console.log(
          tabsList.splice(obj, 1, element),
          "tabsList.splice(obj, 1, element)"
        );
      }
      sessionStorage.setItem("tabsList", JSON.stringify(tabsList));
      routerGo("/subdecl/#/planProject");
      let htmlbr = "项目信息";
      sessionStorage.setItem("htmlData", htmlbr);
    },
    // 成员管理保存
    saveMemberManage(val) {
      //console.log("子组件传来的数据", val);
      this.testData = val;
      if (this.memberManageText == "成员管理内") {
        this.testData.projectIds = this.pilId;
      } else if (this.memberManageText == "成员管理外") {
        this.testData.projectIds = this.pilIds;
      }
      updateMemberManagement(this.testData)
        .then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("添加成功");
          }
        })
        .catch((err) => {
          //console.log(err);
          this.$message.fail("添加失败请勾选");
        });
      this.memberManagedialogVisible = false;
    },
    // 多标段成员管理保存
    saveMemberManage2(val) {
      console.log(
        "数据",
        val,
        this.memberManageText,
        this.personData,
        this.pid,
        this.pilIds
      );
      this.testData = val;
      if (this.memberManageText == "成员管理内") {
        this.testData.projectIds = [];
        this.testData.projectIds.push(this.personData);
      } else if (this.memberManageText == "成员管理外") {
        this.testData.projectIds = this.pilIds;
      }
      console.log("最终提交数据", this.testData);

      updateMemberManagement(this.testData)
        .then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("添加成功");
          }
        })
        .catch((err) => {
          //console.log(err);
          this.$message.fail("添加失败请勾选");
        });
      this.memberManagedialogVisible = false;
    },
    // 成员管理取消
    closeMemberManage() {
      this.memberManagedialogVisible = false;
    },
  },
  mounted() {
    this.getTbData();
    this.getTbHeader();
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-height: 850px) {
  .projectList .tjbox2_text {
    font-size: 14px !important;
  }
}

::v-deep .el-tooltip {
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}

.projectList {
  box-sizing: border-box;
  width: 100%;
  padding: 5px 20px;
  padding-bottom: 0;
  background: rgba(255, 255, 255, 1);
  margin-top: 8px;
  border-radius: 4px;
  ::v-deep .sr_table_bottom {
    display: none !important;
  }
  .tjbox2_text {
    display: flex;
    align-items: center;
    width: 100%;
    font-weight: 700;
    font-size: 16px;
    // margin-bottom: 10px;
    justify-content: space-between;
    margin-bottom: 5px;
    padding-right: 5px;
    .top {
      width: 40%;
      display: flex;
      align-items: center;
      .middle_left_left_border {
        width: 4px;
        height: 14px;
        border-radius: 5px;
        background: rgb(1, 118, 255);
        margin: 0 5px;
      }
    }
    .right {
      cursor: pointer;
    }
  }
}
.table_unitName {
  color: rgba(66, 130, 255, 1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:hover .table_unitName {
  cursor: pointer;
}
::v-deep .sr_table .el-table {
  border: none;
  border-radius: 0%;
}
::v-deep .el-table__fixed-right-patch {
  width: auto !important;
}

// ::v-deep .sr_table td {
//   padding: 14px 0!important;
// }
</style>
