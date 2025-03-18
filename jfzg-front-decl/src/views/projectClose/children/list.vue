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
      @pageChanged="pageChanged"
      :data="table.data"
      :noData="noData"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
      @sortChange="sortChange"
      
      :extra-tooltip-labels="['发起人', '需求部门']" 
    >
    </SrTable>
  </div>
</template>

<script>
import store from "@/store";
import { getUserByRoleCode } from "@/api/planProject";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import { api_projectCloseLise } from "@/api/projectClose/index.js";
import {
  api_userSetQuery,
  api_userSetSave,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";
import { permissionCode } from "../const.js";
import config from "@/settings.js";
import { getProjectlist } from "@/api/biangeng/index";
import { api_getLibraryNumber } from "@/api/projectLibrary";
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
    // 是否是项目变更审批
    ifHideAddBtn: {
      type: Boolean,
      default: false,
    },
    yearPlanId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isLoading: false,
      noData: false,
      getNumber: api_getLibraryNumber, //弹框新增接口
      activeRow: {},
      supplementRow: {},
      menuTypeObject: {
        menuType: "7001",
        objectId: "",
        projectId: "",
      },
      //补充文件数据组
      tableDataList: [
        {
          //列表名称
          fileName: "上传附件",
          //文件提示
          popover: "",
          //按钮名称
          uploadReportName: "上传附件",
          //列表数据
          dataList: [],
          //实例id
          instanceId: 503,
        },
      ],
      // 上传意见
      codeObject: {
        //上传文件权限code
        updateFileCode: "M003_M008_005",
        //删除code
        deleteCode: "M003_M008_006",
        //停止上传code
        stopUploadingCode: "M003_M008_007",
      },
      //停止上传状态
      stopUploadingFlag: true,
      //接口集合
      apiObject: {
        api_addFile,
        api_updateFile,
        api_listByInstanceId,
        api_deleteItem,
      },
      //弹框名称
      supplementBoxTitle: "上传附件",
      sortDtos: [],
      getList: getProjectlist,
      params: {
        ids: "",
        keyWords: "",
        // isSubproject: 0,
        status: 1000,
        activationStatus: 1,
        isArchive: 0,
      },
      dialogVisible: false,
      isTableHeaderId: "",
      editableTabs: [],

      userInfo: store.getters.userInfo,
      tableList: {
        header: [],
      },
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
              validate: this.btnValidate,
            },
            {
              name: "发起结项",
              method: "projectClose",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M9432_001_002",
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
          {
            type: "select",
            placeholder: "发起人",
            bind: "tjPerson",
            data: "customerManager",
            className: "inputStyle",
            isHave: true,
          },
        ],
        enum: {
          yearPlanList: [], //年度计划
          statusList: [
            {
              value: "0",
              label: "未提交",
            },
            {
              value: "2",
              label: "审批中",
            },
            {
              value: "3",
              label: "不通过",
            },
            {
              value: "5",
              label: "已完成",
            },
          ], //状态
          customerManager: [],
        },
        formData: {
          systemName: "",
          projectName: "",
          needDepartmentPersonId: "",
          yearPlanId: "",
          status: null,
          tjPerson: "",
        },
      },
    };
  },
  mounted() {
    this.query_List();
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
      this.search.formData.yearPlanId = "";
      this.search.formData.needDepartmentPersonId = "";
      this.search.formData.projectName = "";
      this.search.formData.systemName = "";
      this.search.formData.status = null;
      this.search.formData.tjPerson = "";
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      sessionStorage.removeItem("searchData");
      this.getTbData();
    },
    searchFn() {
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
        row.name == "查看" &&
        [
          "DSZ",
          "ZJL",
          "F_ZJL",
          "BM_FZR",
          "XMFZR",
          "PSXZ_CY",
          "FZGHC_JBRBF",
        ].includes(this.userInfo.currentRole.roleCode)
      ) {
        return true;
      }
      return false;
    },
    btnValidate2(row, item) {
      if (
        this.userInfo.currentRole.roleCode == "XMFZR" &&
        [1, 202, 302, null].includes(item.status)
      ) {
        return true;
      } else {
        return false;
      }
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
      getUserByRoleCode({ roleCode: "XMFZR" }).then((res) => {
        console.log("客户经理", res.data);
        res.data.map((res) => {
          // console.log(res,'res')
          // this.search.enum.customerManager.push({
          //   label: String(res.fullname),
          //   value: String(res.fullname),
          // });
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
      let param = {
        belongingStage: "",
        tjPerson: "",
        contactId:
          this.userInfo.currentRole.roleCode == "XMFZR"
            ? this.userInfo.jfid
            : "",
        reviewId:
          this.userInfo.currentRole.roleCode == "PSXZ_CY"
            ? this.userInfo.jfid
            : "",
        selectType: 0,
        projectCode: "",
        pageNum: this.table.page.pageNum,
        year: this.search.formData.yearPlan,
        pageSize: this.table.page.pageSize,
        systemName: this.search.formData.systemName,
        projectName: this.search.formData.projectName,
        needDepartmentPersonId: this.search.formData.needDepartmentPersonId,
        yearPlanId: this.search.formData.yearPlanId,
        tjPerson: this.search.formData.tjPerson,
        year: "",
        status: this.search.formData.status
          ? Number(this.search.formData.status)
          : null,
      };
      api_projectCloseLise(param)
        .then((res) => {
          if (res.data) {
            this.isLoading = false;
            this.table.page.pages = res.data.pages;
            this.table.page.total = res.data.total;
            let { roleCode } = this.userInfo.currentRole;
            let { jfid } = this.userInfo;
            if (res.data.records.length>0) {
              res.data.records.forEach((item) => {
                if (item.todo) {
                  item.operationBtns = [];
                  //按钮筛选  以assignee优先roleCode
                  // item.assignee
                  if (jfid) {
                    item.description &&
                      JSON.parse(item.description).map((item1) => {
                        if (
                          this.userInfo.currentRole.roleCode != "FZGHC_JBRBF"
                        ) {
                          if (
                            item1.operationBtns[0].btnName != "发起结项申请"
                          ) {
                            if (
                              item1.operationBtns[0].btnName == "评审小组审核"
                            ) {
                              console.log(
                                item1.operationBtns[0].btnName,
                                "item1.operationBtns[0].btnNameitem1.operationBtns[0].btnName"
                              );
                              if (item.isShow) {
                                item1.operationBtns &&
                                  item.operationBtns.push(
                                    item1.operationBtns[0]
                                  );
                              } else {
                                item1.operationBtns &&
                                  item.operationBtns.push([]);
                              }
                            } else {
                              item.operationBtns.push(item1.operationBtns[0]);
                            }
                          }
                        }
                      });
                    item.path = this.workView;
                  } else {
                    item.description &&
                      JSON.parse(item.description).map((item1) => {
                        if (roleCode == item1.role) {
                          if (
                            this.userInfo.currentRole.roleCode != "FZGHC_JBRBF"
                          ) {
                            if (
                              item1.operationBtns[0].btnName != "发起结项申请"
                            ) {
                              item.operationBtns.push(item1.operationBtns[0]);
                              if (item.isShow) {
                                item1.operationBtns &&
                                  item.operationBtns.push(
                                    item1.operationBtns[0]
                                  );
                              } else {
                                item1.operationBtns &&
                                  item.operationBtns.push([]);
                              }
                            }
                          }
                        }
                      });
                    item.path = this.workView;
                  }
                }
              });
              this.table.data = res.data.records;
            }
          } else {
            this.table.data = [];
            this.isLoading = false;
            this.noData = true;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.noData = true;
        });
    },
    query_List() {
      let param1 = {
        pageNum: this.table.page.pageNum,
        pageSize: 9999,
      };
      api_projectCloseLise(param1).then((res1) => {
        console.log(res1.data.records, "获取的数据");
        let initTjPerson = new Set(
          res1.data.records.map((item) => {
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
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          tjPerson == "" &&
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
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectCloseWork",
        query: {
          id: row.id,
          processId: row.processId,
          projectCloseId: row.projectCloseId,
          projectInitalId: row.projectInitalId,
          status: row.status,
        },
      });
    },
    see(row) {
      console.log(
        "zzzzzzzzzzzzzzzzzzzzzzzzz",
        this.table.page.pageNum,
        this.search.formData
      );

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
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectCloseView",
        query: {
          id: row.id,
          processId: row.processId,
          projectCloseId: row.projectCloseId,
          projectInitalId: row.projectInitalId,
          status: row.status,
        },
      });
    },
    projectClose(row) {
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
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectCloseAdd",
        query: {
          id: row.id,
          processId: row.processId,
          projectCloseId: row.projectCloseId,
          projectInitalId: row.projectInitalId,
          status: row.status,
        },
      });
    },
    rowClick(row) {
      // console.log(row.data., "row");
    },
  },
  created() {
    this.search.enum.yearPlanList = yearPlanManager.yearPlanList;
    this.getTbData();
    this.getTbHeader();
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

.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
// .searchPage {
//   ::v-deep .getyearclass {
//     width: 240px !important;
//   }
//   ::v-deep .selectWidthCustom {
//     width: 153px !important;
//   }
// }
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

.searchPage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.circle-btn {
  border-radius: 50% !important;
}
</style>
