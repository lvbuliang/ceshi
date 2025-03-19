<template>
  <div class="common-card">
    <!-- <SrSearch
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      @queryList="queryTableData()"
    ></SrSearch> -->
    <div class="searchPage" ref="searchRef">
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
          <el-select
            v-model="search.formData.tjPerson"
            clearable
            placeholder="发起人"
            @clear="clearFunc('tjPerson')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.customerManager"
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
      ref="selectTable"
      :noData="noData"
      @sortChange="sortChange"
      @pageChanged="handlePageChange"
      :data="table.data"
      @sizeChanged="handleSizeChange"
      :config="table.config"
      :page="table.page"
      :extra-tooltip-labels="['项目编码', '需求部门']"
    >
    </SrTable>
  </div>
</template>

<script>
import store from "@/store";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { getUserByRoleCode } from "@/api/planProject";
import {
  api_queryProjectDisclosure,
  api_before_thxg,
} from "@/api/projectDisclosure/index.js";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import yearPlanManager from "@/utils/yearPlanUtils";
export default {
  name: "project_disclosure",
  data() {
    return {
      isLoading: false,
      noData: false,
      isTableHeaderId: "",
      roleName: "", //当前登录人名称
      roleCode: "", // 当前角色权限code
      dict: {
        dicttypelist: [],
      },
      // 查询
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
            className: "plan_type",
            // multiple: true,
          },
          {
            type: "select",
            placeholder: "发起人",
            bind: "tjPerson",
            data: "customerManager",
            className: "inputStyle",
            isHave: true,
          },
        ],
        formData: {
          systemName: "",
          projectName: "",
          needDepartmentPersonId: "",
          yearPlanId: "",
          status: "",
          tjPerson: "",
        },
        enum: {
          yearPlanList: [], //年度计划
          statusList: [
            {
              value: 0,
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
              value: 5,
              label: "已完成",
            },
          ], //状态
          customerManager: [],
        },
      },
      table: {
        data: [], // 表格数据
        config: {
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          maxHeight: 0, // 最大高度
          // load: this.load,
          tooltipEffect: "light",
          header: [],
          indexConfig: {
            display: true,
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
          },
          innerBtn: [
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M006_010_001_09",
            },
            {
              name: "撤回", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "beforeExamineThxg", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate3,
            },
            {
              name: "发起交底",
              method: "projectDisclosure", // 点击执行该页面methods中对应的方法
              type: "text",
              size: "small",
              // field: 'status',
              // value: ['4'],
              icon: "el-icon-document",
              // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              validate: this.btnValidate,
              code: "M006_010_001_10",
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      userInfo: store.getters.userInfo,
    };
  },
  activated() {
    let to = sessionStorage.getItem("toPath");
    if (!to.includes("?")) {
      this.table.page.pageNum = 1;
      this.table.total = 0;
      this.table.data = [];
      this.table.page.pageSize = 10;
      Object.keys(this.search.formData).forEach((key) => {
        this.search.formData[key] = "";
      });
      this.queryTableData();
    }
  },
  created() {
    this.search.enum.yearPlanList = yearPlanManager.yearPlanList;
  },
  mounted() {
    this.queryList();

    this.getHeaderOptions();
    this.queryTableData();
    this.calculateTableHeight();
  },
  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      this.$set(
        this.table.config,
        "maxHeight",
        getCommonTableHeight(this.$refs.searchRef)
      );
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
        case "tjPerson":
          this.search.formData.tjPerson = "";
          break;
        case "status":
          this.search.formData.status = null;
          break;
        case "projectName":
          this.search.formData.projectName = "";
          break;
      }
    },
    resetForm() {
      this.search.formData.yearPlanId = "";
      this.search.formData.needDepartmentPersonId = "";
      this.search.formData.projectName = "";
      this.search.formData.systemName = "";
      this.search.formData.status = null;
      this.search.formData.tjPerson = "";
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      sessionStorage.removeItem("searchData");
      this.queryTableData();
    },
    searchFn() {
      this.table.page.pageNum = 1;
      this.queryTableData("seek");
    },
    workView(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          tjPerson == "" &&
          status == ""
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
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectDisclosureWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          discloseId: row.discloseId,
          status: row.status,
        },
      });
    },
    projectDisclosure(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          tjPerson == "" &&
          status == ""
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
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectDisclosureAdd",
        query: {
          id: row.id,
          discloseId: row.discloseId,
          processId: row.processId,
          statusFlag: row.status,
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
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          tjPerson == "" &&
          status == ""
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
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectDisclosureView",
        query: {
          id: row.id,
          discloseId: row.discloseId,
          processId: row.processId,
          templateId: row.templateId,
        },
      });
    },
    btnValidate(row, item) {
      // 1-- "未提交" 2=="待审核"
      // 202=="交底确认-退回修改"
      // 203=="交底确认-不通过"
      // 301=="交底审核-待审核"
      // 302=="交底审核-退回修改"
      // 303=="交底审核-不通过"
      // 1000=="通过"
      if (
        row.name == "发起交底" &&
        item.status !== 2 &&
        item.status !== 301 &&
        item.status !== 1000 &&
        item.status !== 203 &&
        item.status !== 303 &&
        this.userInfo.currentRole.roleCode == "KHJL"
        // this.userInfo.currentRole.roleCode !== "FZGHC_JBRBF"&&
      ) {
        return true;
      }
      return false;
    },
    btnValidate3(row, item) {
      // 客户经理并且状态是2的可以撤回
      if (
        item.status == 2 &&
        this.userInfo.currentRole.roleCode == "KHJL" &&
        this.userInfo.fullname == item.tjPerson
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 撤回方法
    beforeExamineThxg(row) {
      api_before_thxg({ processId: row.processId }).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("撤回成功");
          this.queryTableData();
        } else {
          this.$message.error(res.data);
        }
      });
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
      this.queryTableData();
    },
    // 获取表头设置
    getHeaderOptions() {
      api_userSetQuery({ permissionCode: "M005_018" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.config.operateConfig.allTableHeader = headerData;
        this.table.config.header = headerData.filter((item) => {
          return item.isShow;
        });
      });
      getUserByRoleCode({ roleCode: "KHJL" }).then((res) => {
        //console.log("客户经理", res.data);
        res.data.map((res) => {
          // //console.log(res,'res')
          // this.search.enum.customerManager.push({
          //   label: String(res.fullname),
          //   value: String(res.fullname),
          // });
        });
      });
    },
    // 分页获取表格数据
    async queryTableData(seek) {
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
        if (JSON.parse(sessionStorage.getItem("searchData")).tjPerson !== "") {
          this.search.formData.tjPerson = JSON.parse(
            sessionStorage.getItem("searchData")
          ).tjPerson;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).status !== "") {
          this.search.formData.status = JSON.parse(
            sessionStorage.getItem("searchData")
          ).status;
        }
        if (seek != "seek") {
          if (JSON.parse(sessionStorage.getItem("searchData")).pageNum !== "") {
            this.table.page.pageNum = JSON.parse(
              sessionStorage.getItem("searchData")
            ).pageNum;
          }
        }
      }
      let payLoad = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };

      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;

      const { data } = await api_queryProjectDisclosure(payLoad);

      if (data && data.records) {
        this.isLoading = false;
        this.noData = false;
        data.records.forEach((item) => {
          if (item.todo) {
            item.operationBtns = [];
            //按钮筛选  以assignee优先roleCode
            if (item.assignee == jfid) {
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  item1.operationBtns &&
                    item.operationBtns.push(item1.operationBtns[0]);
                });
              item.path = this.workView;
              //console.log("1.........");
            } else {
              //console.log("2...........");
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  if (roleCode == item1.role) {
                    item1.operationBtns &&
                      item.operationBtns.push(item1.operationBtns[0]);
                  }
                });
              // 处理建设单位提交,经办人审核后经办人有撤回按钮
              item.operationBtns.map((item1) => {
                if (item1.btnName == "撤回" && item.creator != jfid) {
                  item1.btnName = "";
                }
              });
            }
            item.path = this.workView;
          }
          if (
            item.operationBtns &&
            (item.status == 202 || item.status == 302)
          ) {
            item.operationBtns = item.operationBtns.filter(
              (item) => item.name == "提交"
            );
            item.btns = [...(item.btns ?? []), ...(item.operationBtns ?? [])];
          }
          return item;
        });
        this.table.data = data.records;
      } else {
        this.table.data = [];
        this.isLoading = false;
        this.noData = true;
      }
      this.table.page.pages = data.pages;
      this.table.page.total = data.total;
    },

    queryList() {
      let param1 = {
        pageNum: this.table.page.pageNum,
        pageSize: 9999,
      };
      api_queryProjectDisclosure(param1).then((res1) => {
        console.log(res1.data.records, "获取的数据");
        let initTjPerson = new Set(
          res1.data&&res1.data.records.map((item) => {
            return item.tjPerson;
          })
        );

        Array.from(initTjPerson).map((tjRes) => {
          if (tjRes !== null) {
            this.search.enum.customerManager.push({
              label: String(tjRes),
              value: String(tjRes),
            });
          }
        });
      });
    },

    settingHeader() {
      this.dialogVisible = true;
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_018",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.queryTableData();
          this.getHeaderOptions();
        }
      });
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    handlePageChange(pageNum) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = pageNum;
      this.queryTableData();
    },
    handleSizeChange(pageSize) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageSize = pageSize;
      this.queryTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .sr_table th {
  line-height: 48px;
  height: 48px;
  > .cell {
    line-height: 24px !important;
  }
}

.common-card {
  height: 100%;
}

.sr_table {
  height: 85% !important;
}

::v-deep .sr_table td {
  line-height: 60px;
  height: 60px;
  > .cell {
    line-height: 24px !important;
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
::v-deep .sr_search .plan_type {
  width: 150px !important;
  .el-select {
    width: 150px !important;
  }
}

.searchPage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.circle-btn {
  border-radius: 50% !important;
}
</style>
