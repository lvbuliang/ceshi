<template>
  <div class="common-card">
    <div class="searchPage" ref="searchRef">
      <!-- <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      >
      </SrSearch> -->
      <el-form
        size="small"
        :inline="true"
        :model="search.formData"
        class="demo-form-inline"
        ref="searchForm"
      >
        <el-form-item>
          <el-input
            @clear="clearFunc('systemName')"
            clearable
            v-model="search.formData.systemName"
            placeholder="系统名称"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            @clear="clearFunc('projectName')"
            clearable
            v-model="search.formData.projectName"
            placeholder="项目名称"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            @clear="clearFunc('needDepartmentPersonId')"
            clearable
            v-model="search.formData.needDepartmentPersonId"
            placeholder="请输入需求部门"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.clientManagerId"
            clearable
            placeholder="请输入客户经理"
            @clear="clearFunc('clientManagerId')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.clientManagerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.yearPlanId"
            clearable
            placeholder="所属年度计划"
            @clear="clearFunc('yearPlanId')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.yearPlanList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.status"
            clearable
            placeholder="选择状态"
            @clear="clearFunc('status')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="circle-btn"
            icon="el-icon-search"
            type="primary"
            circle
            @click="searchFn"
          ></el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            class="circle-btn"
            icon="el-icon-refresh"
            circle
            @click="resetForm"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>
    <CustomLoading :visible="isLoading" />
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      :noData="noData"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
      @sortChange="sortChange"
      :extra-tooltip-labels="['项目编码', '需求部门']" 
    >
    </SrTable>
  </div>
</template>

<script>
import store from "@/store";
import { getProjectManagementList } from "@/api/projectManagement/index.js";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { getUserByRoleCode } from "@/api/planProject";
import { permissionCode } from "../const.js";
import config from "@/settings.js";
import { api_ZZR_list } from "@/api/index.js";
import upload from "@/utils/upload";
import yearPlanManager from "@/utils/yearPlanUtils";
export default {
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      uploadFileUrl: config.uploadFileUrl,
      previewUrl: config.previewUrl,
    };
  },
  props: {
    yearPlanId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoading: false,
      noData: false,
      isTableHeaderId: "",
      userInfo: store.getters.userInfo,
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          maxHeight: 0,
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
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M010_010_011",
              validate: this.btnValidate,
            },
            {
              name: "发起立项",
              method: "goToProject",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 50],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "请输入系统名称",
            bind: "systemName",
            disabled: false,
            className: "inputStyle",
          },
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName",
            className: "inputStyle",
          },
          {
            type: "text",
            placeholder: "请输入需求部门",
            bind: "needDepartmentPersonId", // 对应this.search.data对象的field1
            disabled: false,
            className: "inputStyle",
          },
          {
            type: "select",
            placeholder: "请输入客户经理",
            bind: "clientManagerName", // 对应this.search.data对象的field1
            data: "clientManagerList", // 对应this.search.data对象的field1
            disabled: false,
            className: "inputStyle",
          },
          {
            type: "select",
            placeholder: "所属年度计划",
            bind: "yearPlanId",
            data: "yearPlanList", // 对应enum中的yearPlanList
            className: "selectStyle",
            disabled: false,
          },
          {
            type: "select",
            placeholder: "选择状态",
            bind: "status",
            data: "statusList", // 对应enum中的stateList
            className: "selectStyle",
            // multiple: true,
          },
          // {
          //   type: "select",
          //   placeholder: "发起人",
          //   bind: "tjPerson",
          //   data: "customerManager",
          //   className: "inputStyle",
          //   isHave: true,
          // },
        ],
        enum: {
          yearPlanList: [], //年度计划
          statusList: [
            {
              value: 1,
              label: "未提交",
            },
            {
              value: 2,
              label: "审批中",
            },
            {
              value: 4,
              label: "不通过",
            },
            {
              value: 3,
              label: "已完成",
            },
            // {
            //   value: 202,
            //   label: "集团审议-退回修改",
            // },
            // {
            //   value: 203,
            //   label: "集团审议-不通过",
            // },
            // {
            //   value: 204,
            //   label: "集团审议-通过",
            // },
            // {
            //   value: 301,
            //   label: "内部立项-待审核",
            // },
            // {
            //   value: 302,
            //   label: "内部立项-退回修改",
            // },
            // {
            //   value: 303,
            //   label: "内部立项-不通过",
            // },
            // {
            //   value: 1000,
            //   label: "通过",
            // },
            //  未提交1 审批中3,2,202,204,301,302, 不通过203,303  已完成1000
          ], //状态
          customerManager: [],
          clientManagerList: [],
        },
        formData: {
          systemName: "",
          projectName: "",
          needDepartmentPersonId: "",
          yearPlanId: "",
          status: null,
          tjPerson: null,
          tjPersonId: "",
          clientManagerName: "",
          clientManagerId: "",
        },
      },
      tjPersonList: [],
    };
  },
  mounted() {
    this.calculateTableHeight();
  },
  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      this.$set(
        this.table.tableConfig,
        "maxHeight",
        getCommonTableHeight(this.$refs.searchRef)
      );
    },
    clearFunc(type) {
      sessionStorage.removeItem("searchData");
      switch (type) {
        case "systemName":
          this.search.formData.systemName = "";
          break;
        case "needDepartmentPersonId":
          this.search.formData.needDepartmentPersonId = "";
          break;
        case "yearPlanId":
          this.search.formData.yearPlanId = "";
          break;
        case "clientManagerId":
          this.search.formData.clientManagerId = "";
          break;
        case "status":
          this.search.formData.status = null;
          break;
        case "projectName":
          this.search.formData.projectName = "";
          break;
      }
    },
    inputAntSelectBlur() {
      sessionStorage.setItem(
        "searchData",
        JSON.stringify({
          ...this.search.formData,
          pageNum: this.table.page.pageNum,
        })
      );
    },
    resetForm() {
      Object.keys(this.search.formData).forEach((item) => {
        if (this.search.formData[item]) {
          this.search.formData[item] = "";
          if (item == "status") {
            this.search.formData[item] = null;
          }
        }
      });
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      sessionStorage.removeItem("searchData");
      this.getTbData();
    },
    searchFn() {
      console.log(this.search.formData, "````");
      this.table.page.pageNum = 1;
      this.getTbData("seek");
    },
    sortChange(column) {
      if (column.order === "ascending") {
        this.search.formData["orderByColumn"] = column.prop;
        this.search.formData["orderBy"] = "ASC";
      } else if (column.order === "descending") {
        this.search.formData["orderByColumn"] = column.prop;
        this.search.formData["orderBy"] = "DESC";
      } else {
        this.search.formData["orderByColumn"] = "";
        this.search.formData["orderBy"] = "";
      }
      this.getTbData();
    },
    btnValidate(row, item) {
      if (
        row.name == "编辑" &&
        this.$route.name == "projectChange" &&
        item.status !== 1000
      ) {
        return true;
      }
      // "DSZ","ZJL","F_ZJL","BM_FZR","XMFZR","KHJL","FAJL","CGJL","FZGHC_JBRBF"
      if (
        row.name == "查看" &&
        [
          "DSZ",
          "ZJL",
          "F_ZJL",
          "BM_FZR",
          "XMFZR",
          "KHJL",
          "FAJL",
          "CGJL",
          "FZGHC_JBRBF",
          "PSXZ_CY",
          "XMGLB"
        ].includes(this.userInfo.currentRole.roleCode)
      ) {
        return true;
      }
      if (row.name == "发起立项") {
        if (
          this.userInfo.currentRole.roleCode == "KHJL" ||
          this.userInfo.currentRole.roleCode == "FAJL"
        ) {
          if (this.userInfo.currentRole.roleCode == "KHJL") {
            if (
              item.statusName == "未提交" ||
              item.taskName == "发起立项准备" ||
              item.status == 303 ||
              item.status == 203
            ) {
              return true;
            } else if (
              item.taskName == "集团审议" ||
              item.statusName == "集团审议-通过"
            ) {
              return false;
            }
          } else if (this.userInfo.currentRole.roleCode == "FAJL") {
            if (item.taskName == "内部立项" || item.statusName == "通过") {
              return false;
            }
          } else {
            return false;
          }
        }
      }
      return false;
    },
    unique(arr) {
      const res = new Map();
      return arr.filter(
        (arr) =>
          !res.has(arr.projectIntiaonId) && res.set(arr.projectIntiaonId, 1)
      );
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          return item.isShow;
        });
      });

      getUserByRoleCode({ roleCode: "KHJL" }).then((res) => {
        res.data.map((res) => {
          // //console.log(res,'res')
          // this.search.enum.customerManager.push({
          //   label: String(res.fullname),
          //   value: String(res.fullname),
          // });
          this.search.enum.clientManagerList.push({
            jfid: String(res.jfid),
            label: String(res.fullname),
            value: String(res.jfid),
          });
        });
      });
    },
    //页数发生改变
    pageChanged(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    getTbData(seek) {
      this.isLoading = true;
      this.noData = false;
      if (sessionStorage.getItem("searchData") !== null) {
        if (
          JSON.parse(sessionStorage.getItem("searchData")).systemName !== ""
        ) {
          this.search.formData.systemName = JSON.parse(
            sessionStorage.getItem("searchData")
          ).systemName;
        }
        if (
          JSON.parse(sessionStorage.getItem("searchData")).projectName !== ""
        ) {
          this.search.formData.projectName = JSON.parse(
            sessionStorage.getItem("searchData")
          ).projectName;
        }
        if (
          JSON.parse(sessionStorage.getItem("searchData"))
            .needDepartmentPersonId !== ""
        ) {
          this.search.formData.needDepartmentPersonId = JSON.parse(
            sessionStorage.getItem("searchData")
          ).needDepartmentPersonId;
        }
        if (
          JSON.parse(sessionStorage.getItem("searchData")).yearPlanId !== ""
        ) {
          this.search.formData.yearPlanId = JSON.parse(
            sessionStorage.getItem("searchData")
          ).yearPlanId;
        }
        if (
          JSON.parse(sessionStorage.getItem("searchData")).clientManagerId !==
          ""
        ) {
          this.search.formData.clientManagerId = JSON.parse(
            sessionStorage.getItem("searchData")
          ).clientManagerId;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).status !== null) {
          this.search.formData.status = JSON.parse(
            sessionStorage.getItem("searchData")
          ).status;
        }
        if (seek != "seek") {
          if (
            JSON.parse(sessionStorage.getItem("searchData")).pageNum !== null
          ) {
            this.table.page.pageNum = JSON.parse(
              sessionStorage.getItem("searchData")
            ).pageNum;
          }
        }
      }
      if (this.search.formData.clientManagerName != "") {
        this.search.enum.clientManagerList.forEach((item) => {
          if (this.search.formData.clientManagerName == item.value) {
            this.search.formData.clientManagerId = item.jfid;
          }
        });
      }
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,

        systemName: this.search.formData.systemName,
        projectName: this.search.formData.projectName,
        needDepartmentPersonId: this.search.formData.needDepartmentPersonId,
        yearPlanId: this.search.formData.yearPlanId,
        tjPerson: null,
        clientManagerId: this.search.formData.clientManagerId,
        // clientManagerName: this.search.formData.clientManagerName,
        status: this.search.formData.status
          ? this.search.formData.status
          : null,
        // tjPerson: this.search.formData.tjPersonId,
      };
      getProjectManagementList(param)
        .then((res) => {
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;

          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          if (res.data.records.length>0) {
            this.isLoading = false;
            res.data.records.forEach((item) => {
              if (item.todo) {
                item.operationBtns = [];
                //按钮筛选  以assignee优先roleCode
                // item.assignee
                if (jfid) {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      // item1.operationBtns &&
                      if (this.userInfo.currentRole.roleCode != "FZGHC_JBRBF") {
                        if (
                          item1.operationBtns[0].btnName != "发起立项" &&
                          item1.operationBtns[0].btnName != "项目负责人审核"
                        ) {
                          item.operationBtns.push(item1.operationBtns[0]);
                        }
                      }
                    });
                  item.path = this.workView;
                } else {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (roleCode == item1.role) {
                        if (item1.operationBtns) {
                          item.operationBtns.push(item1.operationBtns[0]);
                        }
                      }
                    });
                  item.path = this.workView;
                }
              }
            });
            this.table.data = res.data.records;
          } else {
            this.isLoading = false;
            this.noData = true;
            this.table.data = [];
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.noData = true;
        });
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: permissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    workView(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          clientManagerId,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          clientManagerId == "" &&
          status == null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({
              ...this.search.formData,
              pageNum: this.table.page.pageNum,
            })
          );
        } else {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      } else {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          clientManagerId,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          clientManagerId !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectWorkView",
        query: {
          projectId: row.id,
          processId: row.processId,
        },
        params: {
          name: row.taskName,
        },
      });
    },
    see(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          clientManagerId,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          clientManagerId == "" &&
          status == null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({
              ...this.search.formData,
              pageNum: this.table.page.pageNum,
            })
          );
        } else {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      } else {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          clientManagerId,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          clientManagerId !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectSeeView",
        query: {
          projectId: row.id,
          processId: row.processId,
        },
      });
    },
    goToProject(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          clientManagerId,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          clientManagerId == "" &&
          status == null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({
              ...this.search.formData,
              pageNum: this.table.page.pageNum,
            })
          );
        } else {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      } else {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          clientManagerId,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          clientManagerId !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        // 立项
        name: "projectAdd",
        query: {
          projectId: row.id,
          processId: row.processId,
        },
      });
    },
    async getListPer() {
      let resone = await api_ZZR_list(3);
      let restwo = await api_ZZR_list(40);
      let resthree = await api_ZZR_list(4);
      this.tjPersonList.push(...resone.data);
      this.tjPersonList.push(...restwo.data);
      this.tjPersonList.push(...resthree.data);
      this.tjPersonList = this.tjPersonList.map((item, index) => {
        const jfid = item.jfid;
        const fullname = item.fullname;
        return {
          jfid,
          fullname,
        };
      });
    },
  },
  created() {
    this.search.enum.yearPlanList = yearPlanManager.yearPlanList;
    this.getTbData();
    this.getTbHeader();
    this.getListPer();
  },
};
</script>
<style lang="scss" scoped>
.common-card {
  height: 100%;
}

.sr_table {
  height: 95%;
}

::v-deep .sr_table th {
  line-height: 48px;
  height: 48px;

  > .cell {
    line-height: 24px !important;
  }
}

::v-deep .sr_table td {
  line-height: 60px;
  height: 60px;

  > .cell {
    line-height: 24px !important;
  }
}

.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}

.searchPage {
  background: #fff;
  padding: 0 20px 0 0;
  height: 100%;
  overflow: auto;

  ::v-deep .getyearclass {
    width: 240px !important;
  }

  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }

  ::v-deep .el-col-19 {
    width: 100% !important;
  }

  ::v-deep .sr_search .el-select {
    width: 160px !important;
  }

  ::v-deep .el-col-5 {
    display: none !important;
  }
}

.searchRightBtn {
  display: inline-block;

  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}

::v-deep .sr_search .inputStyle {
  width: 170px !important;

  .el-input {
    width: 170px !important;
  }
}

::v-deep .sr_search .selectStyle {
  width: 170px !important;

  .el-select {
    width: 170px !important;
  }
}

.circle-btn {
  border-radius: 50% !important;
}
</style>
