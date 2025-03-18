<template>
  <div class="common-card">
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
            @clear="cleaFunc('systemName')"
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
          <el-select
            v-model="search.formData.procurementStatus"
            clearable
            placeholder="状态"
            @clear="clearFunc('procurementStatus')"
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
      ref="selectTable"
      @sortChange="sortChange"
      @pageChanged="handlePageChange"
      :data="table.data"
      :noData="noData"
      @sizeChanged="handleSizeChange"
      :config="table.config"
      :page="table.page"
    >
    </SrTable>
  </div>
</template>

<script>
import store from "@/store";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import { permissionCode } from "../const.js";
// api
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { api_queryProjectPurch } from "@/api/purchasingManagement/index.js";

export default {
  name: "purchasing_management",
  data() {
    return {
      isLoading: false,
      noData: false,
      userInfo: store.getters.userInfo,
      isTableHeaderId: "",
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
            name: "",
            placeholder: "请输入系统名称",
            bind: "systemName",
            class: "inputStyle",
          },
          {
            type: "text",
            name: "",
            placeholder: "请输入项目名称",
            bind: "projectName",
            class: "inputStyle",
          },
          {
            type: "select",
            placeholder: "状态",
            bind: "procurementStatus",
            data: "statusList", // 对应enum中的yearPlanList
            class: "",
            disabled: false,
            class: "selectStyle",
          },
        ],
        formData: {
          systemName: "",
          projectName: "",
          procurementStatus: "",
        },
        enum: {
          statusList: [
            {
              value: "已提交",
              label: "已提交",
            },
            {
              value: "未提交",
              label: "未提交",
            },
          ],
        },
      },
      table: {
        data: [], // 表格数据
        config: {
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          tooltipEffect: "light",
          maxHeight: 0,
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
            hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              method: "previewFunc", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              code: "",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "editFunc", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              code: "",
              validate: this.btnValidate2, //自定义判断是否展示按钮权限
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
    };
  },
  mounted() {
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
        case "projectName":
          this.search.formData.projectName = "";
          break;
        case "procurementStatus":
          this.search.formData.procurementStatus = "";
          break;
      }
    },
    resetForm() {
      this.search.formData.projectName = "";
      this.search.formData.systemName = "";
      this.search.formData.procurementStatus = "";
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      sessionStorage.removeItem("searchData");
      this.queryTableData();
    },
    searchFn() {
      this.table.page.pageNum = 1;
      this.queryTableData("seek");
    },
    btnValidate(row, item) {
      if (item.isProcurementEdit == 1 || item.isProcurementEdit == 2) {
        return true;
      }

      return false;
    },
    btnValidate2(row, item) {
      let { roleCode } = this.userInfo.currentRole;
      if (
        (item.isProcurementEdit == 0 || item.isProcurementEdit == 1) &&
        (roleCode == "CGJL" || roleCode == "FZGHC_JBRBF")
      ) {
        return true;
      }

      return false;
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
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.table.config.operateConfig.allTableHeader = headerData;
        this.table.config.header = headerData.filter((item) => {
          return item.isShow;
        });
      });
    },
    // 分页获取表格数据
    queryTableData(seek) {
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
          JSON.parse(sessionStorage.getItem("searchData")).procurementStatus !==
          ""
        ) {
          this.search.formData.procurementStatus = JSON.parse(
            sessionStorage.getItem("searchData")
          ).procurementStatus;
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
      let payLoad = {
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        systemName: this.search.formData.systemName,
        projectName: this.search.formData.projectName,
        procurementStatus: this.search.formData.procurementStatus,
      };
      api_queryProjectPurch(payLoad)
        .then((res) => {
          if (res.data?.records) {
            this.isLoading = false;
            // this.table.page.pageNum = res.data.current;
            // this.table.page.pageSize = res.data.size;
            this.table.page.total = res.data.total;
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
    //去查看
    previewFunc(row) {
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, procurementStatus } =
          this.search.formData;
        if (systemName == "" && projectName == "" && procurementStatus == "") {
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
        const { systemName, projectName, procurementStatus } =
          this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          procurementStatus !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "purchasingManagementView",
        query: {
          projectId: row.projectId,
        },
      });
    },
    // 编辑
    editFunc(row) {
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, procurementStatus } =
          this.search.formData;
        if (systemName == "" && projectName == "" && procurementStatus == "") {
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
        const { systemName, projectName, procurementStatus } =
          this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          procurementStatus !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "purchasingManagementAdd",
        query: {
          projectId: row.projectId,
          isProcurementEdit: row.isProcurementEdit, // 0 第一次进 | 1 保存之后进
          isSection: row.isSection, // 是否为多标段 0 是 | 1 否
          procurementStatus: row.procurementStatus,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.common-card {
  height: 100%;
}

.sr_table {
  height: 85%;
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

:deep(.inputStyle) {
  width: 160px !important;
}

:deep(.selectStyle) {
  width: 160px !important;
}

.circle-btn {
  border-radius: 50% !important;
}
</style>
