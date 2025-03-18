<template>
  <el-dialog :visible.sync="visiable" width="80%" :append-to-body="true" show-close @close="handleClose">
    <!--     title="周报记录" -->
    <template slot="title"> 周报记录 </template>
    <div class="conTitle">
      <div class="sys">
        <span class="sysText">系统名称:</span>
        <span class="ml-10">{{ title.systemName }}</span>
      </div>
      <div class="pro">
        <span class="sysText">项目名称:</span>
        <span class="ml-10">{{ title.projectName }}</span>
      </div>
    </div>

    <div class="content_box">
      <SrTable @pageChanged="pageChanged" :noData="noData" :data="table.data" @sizeChanged="sizeChanged"
        :config="table.tableConfig" :page="table.page" ref="selectTable1">
      </SrTable>
    </div>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveVisiable">保 存</el-button>
      <el-button @click="closevisiable">取 消</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import {
  api_getReportByProjectId,
  api_delReportById,
  getReportByContractId,
  deleteWeeklyDraft,
} from "@/api/report/index";
import store from "@/store";
export default {
  props: {
    visiable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    projectId: {
      type: String,
    },
    ProjectIdNum: {
      type: String,
    },
    ContractIdNum: {
      type: String,
    },
    contractId: {
      type: String,
    },
    isExamine: {
      type: String || null,
    },
    lotsNumber: {
      type: Number || null,
    },
    hasFather: {
      type: Boolean,
    },
    contactSPId: {
      type: String || Number,
    },
    title: {
      type: Object,
    },
    from: {
      type: String,
    },
    // sectionSort: {
    //   type: String || Number,
    // },
    // 是否展示编辑

    typeDelete: {
      type: String,
      // default() {
      //   return false;
      // },
    },
    isDuobiaoduan: {
      type: Boolean,
      // default() {
      //   return false;
      // },
    },
  },
  data() {
    return {
      noData: false,
      isLoading: false,
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          // load: this.load,
          maxHeight: 0,
          tooltipEffect: "light",
          header: [
            {
              label: "周报名称",
              prop: "weeklyName",
              isShow: true,
              index: 1,
              // width: "150px",
            },
            {
              label: "项目填报人",
              prop: "reporter",
              isShow: true,
              index: 2,
              width: "100px",
            },
            {
              label: "报送时间",
              prop: "createTime",
              isShow: true,
              index: 3,
              width: "160px",
            },
          ],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
            hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "edit", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "审核", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "audit", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "删除草稿", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "delisDraft", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
          ],
        },
        page: {
          // 分页配置
          total: 10, //总条数
          pages: 10, //总页数
          pageSize: 10, //每页展示多少个
          minSize: 10,
          pageSizes: [10, 25, 50, 100],
          pageNum: 1, //当前页
          background: true,
          layout: "total, prev, pager, next, sizes,jumper",
        },
      },
      userInfo: store.getters.userInfo,
    };
  },
  watch: {
    ProjectIdNum: {
      handler(v) {
        console.log("projectId", v);
        if (v) {
          this.getReportByProjectId(this.projectId);
        }
      },
      immediate: true,
    },
    ContractIdNum: {
      handler(v) {
        if (v) {
          this.getReportByContractId(this.contractId);
        }
      },
      immediate: true, // 立即执行一次
    },
  },
  created() { },
  mounted() {
    console.log('弹窗页', this.ProjectIdNum, this.ContractIdNum);

    // this.getReportByContractId();
    // alert("1")
    this.calculateTableHeight();
  },

  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      this.$set(
        this.table.tableConfig,
        "maxHeight",
        getCommonTableHeight(this.$refs.searchRef) - 160
      );
    },

    //删除草稿
    delisDraft(row, item) {
      console.log("deleteWeeklyDraft", this.isDuobiaoduan);
      console.log("deleteWeeklyDraft", row);

      let obj = {
        id: row.id,
        type: this.typeDelete
          ? this.typeDelete
          : sessionStorage.getItem("typeDelete"),
      };

      deleteWeeklyDraft(obj).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "删除草稿成功",
          });
          if (this.table.data.length == 1) {
            this.table.page.pageNum = this.table.page.pageNum - 1;
          }
          if (this.contractId) {
            this.getReportByContractId(this.contractId);
          } else {
            this.getReportByProjectId(this.projectId);
          }
        }
      });
    },
    getNowTime() {
      var date = new Date();

      var year = date.getFullYear();
      var currentdate = year;

      return currentdate;
    },
    getReportByContractId(contractId) {
      this.isLoading = true;
      this.noData = false;
      getReportByContractId({
        contractId,
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        year: sessionStorage.getItem("year")
          ? sessionStorage.getItem("year")
          : this.getNowTime(),
      }).then((res) => {
        this.isLoading = false;
        if (res.data.total > 0) {
          this.table.page.total = res.data.total;
          this.table.data = res.data.records;
        } else {
          this.isLoading = false;
          this.noData = true
        }

      }).catch((err) => {
        this.isLoading = false;
        this.noData = true
      });
    },
    // 周报记录列表
    getReportByProjectId(projectId) {
      this.isLoading = true;
      this.noData = false;
      api_getReportByProjectId({
        projectId: projectId,
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        year: sessionStorage.getItem("year")
          ? sessionStorage.getItem("year")
          : this.getNowTime(),
      }).then((res) => {
        this.isLoading = false;
        if (res.data.total > 0) {
          this.table.page.pageNum = res.data.pageNo;
          this.table.page.total = res.data.total;
          this.table.data = res.data.records;
        } else {
          this.noData = true;
        }
      }).catch((err) => {
        this.isLoading = false;
        this.noData = true;
      });
    },
    btnValidate(row, item, ii) {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;
      // 若有合同则父不能编辑,父this.isDuobiaoduan 为true
      if (
        row.name == "编辑" &&
        item.reporterJfid == jfid &&
        (item.isStartWeeklyReport == null || item.isStartWeeklyReport == 0) &&
        !this.isDuobiaoduan
      ) {
        if (
          roleCode == "DSZ" ||
          roleCode == "ZJL" ||
          roleCode == "F_ZJL" ||
          roleCode == "XMGLB"
        ) {
          return false;
        } else {
          return true;
        }
      }
      if (
        row.name == "删除草稿" &&
        item.reporterJfid == jfid &&
        item.isDraft == 0
      ) {
        return true;
      }
      if (row.name == "查看") {
        if (roleCode == "FZGHC_JBRBF") {
          return true;
        } else {
          if (
            roleCode == "DSZ" ||
            roleCode == "ZJL" ||
            roleCode == "F_ZJL" ||
            roleCode == "XMGLB" ||
            roleCode == "BM_FZR" ||
            roleCode == "XMFZR" ||
            roleCode == "KHJL" ||
            roleCode == "FAJL" ||
            roleCode == "CGJL" ||
            roleCode == "CJDW_XMJL" ||
            roleCode == "JLGCS" ||
            roleCode == "PSXZ_CY"
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
      if (row.name == "审核" && roleCode == "XMFZR") {
        // if (
        //   sessionStorage.getItem("isDuobiaoduan") == 1 &&
        //   item.sectionSort == null
        // ) {
        //   return false;
        // } else {
        // isDuobiaoduan
        if (this.lotsNumber == 1) {
          // if (
          //   this.isExamine == 1 &&
          //   item.reporterRole == "CJDW_XMJL" &&
          //   item.contactJfid &&
          //   item.contactJfid == jfid
          // ) {
          //   return true;
          // }
          if (item.contractId == null) {
            if (
              item.isExamine == 1 &&
              item.contactJfid &&
              item.contactJfid == jfid
            ) {
              return true;
            }
          } else {
            if (
              this.isExamine == 1 &&
              item.reporterRole == "CJDW_XMJL" &&
              item.contactJfid &&
              item.contactJfid == jfid
            ) {
              return true;
            }
          }
        } else {
          console.log(item.isExamine, "item.isExamine");
          if (item.isExamine == 1) {
            if (item.contactJfid && item.contactJfid == jfid) {
              return true;
            } else {
              if (sessionStorage.getItem("contactSPId") == jfid) {
                return true;
              }
            }
          }
        }
        // }
      }
      /* if (row.name == "删除" && item.editable) {
        return true;
      } */
      return false;
    },
    saveVisiable() {
      this.$emit("save");
    },
    handleClose() {
      this.table.page.pageNum = 1;
      this.$emit("close");
    },
    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      let projectId = sessionStorage.getItem("tab2_project");
      this.getReportByProjectId(this.projectId);
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      let projectId = sessionStorage.getItem("tab2_project");

      this.getReportByProjectId(this.projectId);
    },

    see(row) {
      this.visiable = false;
      this.$router
        .push({
          name: "reportView",
          query: {
            id: row.id,
            projectId: row.projectId,
            contractId: row.contractId,
            isDuobiaoduan: this.isDuobiaoduan, //用于判断标段字段是否展示
            systemName: row.systemName,
            projectName: row.projectName,
            pageNum: this.table.page.pageNum,
            contactSPId: sessionStorage.getItem("contactSPId"),
            pageNo: this.table.page.pageNum,
            ProjectIdNum: this.ProjectIdNum ? this.ProjectIdNum : '',
            ContractIdNum: this.ContractIdNum ? this.ContractIdNum : '',
            // contractNames: this.contractNames && (this.contractNames != '' || this.contractNames != null)
            //   ? this.contractNames
            //   : this.$route.query.contractNames,
            contractName: sessionStorage.getItem("contractName"),
            sectionSort: sessionStorage.getItem("sectionSort"),
            // sectionSort: this.sectionSort && (this.sectionSort != '' || this.sectionSort != null) ? this.sectionSort : this.$route.query.sectionSort,
          },
        })
    },
    edit(row) {
      this.visiable = false;
      this.$router
        .push({
          name: "reportEdit",
          query: {
            id: row.id,
            projectId: row.projectId,
            contractId: row.contractId,
            isReadonly: true,
            systemName: row.systemName,
            projectName: row.projectName,
            pageNum: this.table.page.pageNum,
            contactSPId: sessionStorage.getItem("contactSPId"),
            pageNo: this.table.page.pageNum,
            ProjectIdNum: this.ProjectIdNum ? this.ProjectIdNum : '',
            ContractIdNum: this.ContractIdNum ? this.ContractIdNum : '',
            // contractNames: this.contractNames && (this.contractNames != '' || this.contractNames != null)
            //   ? this.contractNames
            //   : this.$route.query.contractNames,
            // sectionSort: this.sectionSort && (this.sectionSort != '' || this.sectionSort != null) ? this.sectionSort : this.$route.query.sectionSort,
            contractName: sessionStorage.getItem("contractName"),
            sectionSort: sessionStorage.getItem("sectionSort"),
          },
        })
    },
    audit(row) {
      console.log("rowrow");

      this.visiable = false;
      this.$router
        .push({
          name: "reportWorkView",
          query: {
            id: row.id,
            projectId: row.projectId,
            isDuobiaoduan: this.isDuobiaoduan, //用于判断标段字段是否展示
            ProjectIdNum: this.ProjectIdNum ? this.ProjectIdNum : '',
            ContractIdNum: this.ContractIdNum ? this.ContractIdNum : '',
            isReadonly: true,
            systemName: row.systemName,
            projectName: row.projectName,
            pageNum: this.table.page.pageNum,
            contractId: row.contractId,
            contactSPId: sessionStorage.getItem("contactSPId"),
            pageNo: this.table.page.pageNum,
            // contractNames: this.contractNames && (this.contractNames != '' || this.contractNames != null)
            //   ? this.contractNames
            //   : this.$route.query.contractNames,
            contractName: sessionStorage.getItem("contractName"),
            sectionSort: sessionStorage.getItem("sectionSort"),
            // sectionSort: this.sectionSort && (this.sectionSort != '' || this.sectionSort != null) ? this.sectionSort : this.$route.query.sectionSort,
          },
        })
    },
    del(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此项目, 是否继续?",
        okFun: () => {
          api_delReportById({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNum = this.table.page.pageNum - 1;
              }
              this.getReportByProjectId(this.projectId);
            }
          });
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog .el-dialog__header {
  height: 56px;
  margin: 0 24px;
  padding: 16px 0;
  text-align: left;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  border-bottom: 1px solid #e8e8e8;

  .el-dialog__title {
    font-size: 14px;
  }
}

::v-deep .el-dialog__footer {
  height: 66px;

  .el-button {
    padding: 9px 27px;
  }
}

::v-deep .el-dialog .el-dialog__body {
  padding-top: 0 !important;
}

::v-deep .el-dialog .el-dialog__body {
  max-height: none !important;
  height: 90% !important;
}

.conTitle {
  font-size: 16px;
  // height: 100px;
  width: 100%;
  background-color: rgb(241, 243, 246);
  display: flex;
  // align-items:
  // flex-direction: column;
  margin-bottom: 10px;
  padding: 14px;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 500;
  color: rgba(29, 33, 41, 1);

  .white {
    color: #fff;
  }

  .sys {
    letter-spacing: 0.05em;
    margin-right: 120px;
    margin-bottom: 3px;

    .sysText {
      font-weight: 600;
    }

    .ml-10 {
      margin-left: 10px;
    }
  }

  .pro {
    letter-spacing: 0.05em;
    margin-right: 10px;

    .sysText {
      font-weight: 600;
    }

    .ml-10 {
      margin-left: 10px;
    }
  }
}

::v-deep .el-dialog {
  margin-top: 8vh !important;
  height: 85% !important;
}
</style>
