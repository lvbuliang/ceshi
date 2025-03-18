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
            @clear="clearFunc('applicationUnit')"
            clearable
            v-model="search.formData.applicationUnit"
            placeholder="请输入需求部门"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="search.formData.yearPlanName"
            clearable
            placeholder="所属年度计划"
            @clear="clearFunc('yearPlanName')"
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
      :extra-tooltip-labels="['项目编码', '需求部门']"
    >
      <!-- 系统名称 systemName -->
      <template slot="systemName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'systemName'">
          <div
            class="systemNameContract"
            v-if="
              scope.row.projectFinalInspectionEntities &&
              scope.row.projectFinalInspectionEntities.length >= 1
            "
          >
            <!-- + - 按钮 -->
            <div class="addClick" @click="clickVos(scope.row)">
              <i
                style="font-weight: bolder"
                :class="
                  scope.row.moreVos == 1 ||
                  !rProject.includes(scope.row.projectId)
                    ? 'el-icon-plus'
                    : 'el-icon-minus'
                "
              >
              </i>
            </div>
            <div class="text-ellipsis">{{ scope.row.systemName }}</div>
          </div>

          <div v-else :class="scope.row.isDuoBiaoDuan === 0 ? 'section' : ''">
            <span
              v-if="scope.row.isDuoBiaoDuan === 0 && scope.row.isSection"
              style="display: flex; justify-content: center"
            >
              <span class="count"> 标段{{ scope.row.isSection }} </span>
            </span>

            <span>
              <span v-if="scope.row.isSection"></span>
              <!-- <span v-if="scope.row.isDuoBiaoDuan == null">{{
                scope.row.systemName
              }}</span> -->

              <span v-if="scope.row.isDuoBiaoDuan == null">
                <div class="text-ellipsis">
                  {{ scope.row.systemName }}
                </div>
              </span>
            </span>
          </div>
        </div>
      </template>
      <!-- 合同名称 contractName -->
      <template slot="contractName" slot-scope="scope">
        <div
          class="table_unitName"
          v-if="
            scope.scope.row.contractName &&
            scope.scope.row.contractName != '' &&
            scope.scope.row.contractName != null
          "
        >
          {{ scope.scope.row.contractName }}
        </div>
        <div v-else>/</div>
      </template>
      <template slot="isSection" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'isSection'">
          <span
            v-if="
              scope.row.isSection &&
              scope.row.isSection > 0 &&
              scope.row.isDuoBiaoDuan !== null
            "
            >{{ "标段 " + scope.row.isSection }}</span
          >

          <span v-else>-</span>
        </div>
      </template>
      <!-- planYear -->

      <template slot="planYear" slot-scope="scope">
        <div
          v-if="
            scope.scope.row.planYear &&
            scope.scope.row.planYear != '' &&
            scope.scope.row.planYear != null
          "
        >
          <div>
            {{ scope.scope.row.planYear }}
          </div>
        </div>

        <div v-else>-</div>
      </template>
    </SrTable>
  </div>
</template>

<script>
import store from "@/store";
import { api_getList } from "@/api/projectEnd/index.js";
import { getUserByRoleCode } from "@/api/planProject";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import {
  api_userSetQuery,
  api_userSetSave,
  api_userSetExport,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";
import { getChengjianUnit } from "@/api/shangyun/index";
import { permissionCode } from "../const.js";
import config from "@/settings.js";
import yearPlanManager from "@/utils/yearPlanUtils";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { api_getLibraryNumber } from "@/api/projectLibrary";
import upload from "@/utils/upload";
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
      rProject: [],
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
            width: "180",
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
              code: "M_1002_1_001",
              validate: this.btnValidate,
            },
            {
              name: "发起终验申请",
              method: "goToProject",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "监理工程师审核",
              method: "workView",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate1, //自定义判断是否展示按钮权限
            },
            {
              name: "项目负责人审核",
              method: "workView",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate2, //自定义判断是否展示按钮权限
            },
            {
              name: "评审小组审核",
              method: "workView",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate3, //自定义判断是否展示按钮权限
            },
            {
              name: "通过终验",
              method: "workView",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate4, //自定义判断是否展示按钮权限
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
            type: "select",
            placeholder: "所属年度计划",
            bind: "yearPlanName",
            data: "yearPlanList", // 对应enum中的yearPlanList
            className: "selectStyle",
            disabled: false,
          },
          {
            type: "text",
            placeholder: "请输入需求部门",
            bind: "applicationUnit", // 对应this.search.data对象的field1
            disabled: false,
            className: "inputStyle",
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
          applicationUnit: "",
          yearPlanName: "",
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
    inputAntSelectBlur() {
      sessionStorage.setItem(
        "searchData",
        JSON.stringify({
          ...this.search.formData,
          pageNum: this.table.page.pageNum,
        })
      );
    },
    clickVos(e) {
      console.log(e, "eeeeee");
      if (e.moreVos) {
        console.log(e.moreVos, "moreVos");
        this.rProject.push(e.projectId);
        this.table.data.forEach((item, index) => {
          console.log(item.systemName, "systemName");
          if (
            this.rProject.includes(item.projectId) &&
            item.projectId == e.projectId
          ) {
            if (
              item.projectFinalInspectionEntities &&
              item.projectFinalInspectionEntities.length >= 1
            ) {
              item.projectFinalInspectionEntities.forEach((ele, elIndex) => {
                this.table.data.splice(index + elIndex + 1, 0, {
                  btns: item.btns,
                  id: ele.id, //项目唯一id
                  projectId: item.projectId,
                  projectFinalInspectionEntities: [],
                  contractId: ele.contractId,
                  contactId: ele.contactId,
                  // contractName 合同名称
                  contractName: ele.contractName,

                  // 项目名称
                  projectName: item.projectName,
                  // 系统名称
                  systemName: item.systemName,

                  sectionCount: ele.sectionCount,

                  isSection: ele.isSection,

                  isDuoBiaoDuan: ele.isDuoBiaoDuan,

                  // 需求部门
                  applicationUnit: ele.applicationUnit
                    ? ele.applicationUnit
                    : "-",
                  // 所属阶段 projectMaturity
                  projectMaturity: ele.projectMaturity
                    ? ele.projectMaturity
                    : "-",
                  // 审批状态
                  statusName:
                    ele.status == null ? ele.statusName : ele.statusName,

                  // 发起人
                  tjPerson: ele.tjPerson ? ele.tjPerson : "-",
                  processId: ele.processId ? ele.processId : "-",
                  status: ele.status ? ele.status : "-",

                  description: ele.description,
                  reviewInfo: ele.reviewInfo,
                });
              });
            }

            index = index + 1;
            item.moreVos = 0;
          }
        });
        console.log(this.table.data, "this.table.data");
      } else {
        this.table.data.forEach((item, index) => {
          if (item.projectId == e.projectId) {
            if (item.moreVos == 0) {
              this.table.data.splice(
                index + 1,
                item.projectFinalInspectionEntities.length
              );
              index = index + 1;
            }
            item.moreVos = 1;
            this.rProject.forEach((item, index) => {
              if (item == e.projectId) {
                this.rProject.splice(index, 1);
              }
            });
          }
        });
      }
    },
    clearFunc(type) {
      sessionStorage.removeItem("searchData");
      switch (type) {
        case "systemName":
          this.search.formData.systemName = "";
          break;
        case "applicationUnit":
          this.search.formData.applicationUnit = "";
          break;
        case "yearPlanName":
          this.search.formData.yearPlanName = "";
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
      this.search.formData.yearPlanName = "";
      this.search.formData.applicationUnit = "";
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
      // "DSZ", "ZJL", "F_ZJL", "BM_FZR", "XMFZR", "PSXZ_CY", "CJDW_XMJL","JLGCS"
      if (
        row.name == "查看" &&
        [
          "DSZ",
          "ZJL",
          "F_ZJL",
          "BM_FZR",
          "XMFZR",
          "XMGLB",

          "PSXZ_CY",
          "CJDW_XMJL",
          "JLGCS",
          "FZGHC_JBRBF",
        ].includes(this.userInfo.currentRole.roleCode)
      ) {
        if (
          item.projectFinalInspectionEntities &&
          item.projectFinalInspectionEntities.length >= 1
        ) {
          return false;
        } else {
          return true;
        }
      }
      if (row.name == "发起终验申请") {
        if (
          [1, 202, 302, 402, 502].includes(item.status) &&
          this.userInfo.currentRole.roleCode == "CJDW_XMJL"
        ) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    // 监理审核
    btnValidate1(row, item) {
      if (row.name == "监理工程师审核") {
        if (item.isDuoBiaoDuan == 0 && item.contractName != "") {
          console.log();
          if (this.userInfo.currentRole.roleCode == "JLGCS") {
            if (
              item.description &&
              JSON.parse(item.description)[0].operationBtns[0].btnName ==
                "监理工程师审核"
            ) {
              return true;
            }
          }
        }
      }
    },
    // 项目负责人审核
    btnValidate2(row, item) {
      if (row.name == "项目负责人审核") {
        if (item.isDuoBiaoDuan == 0 && item.contractName != "") {
          if (this.userInfo.currentRole.roleCode == "XMFZR") {
            if (
              item.description &&
              JSON.parse(item.description)[0].operationBtns[0].btnName ==
                "项目负责人审核"
            ) {
              return true;
            }
          }
        }
      }
    },
    // 评审小组审核
    btnValidate3(row, item) {
      if (row.name == "评审小组审核") {
        if (item.isDuoBiaoDuan == 0 && item.contractName != "") {
          if (
            item.description &&
            JSON.parse(item.description)[0].operationBtns[0].btnName ==
              "评审小组审核"
          ) {
            item.reviewInfo.forEach((ele) => {
              if (ele.jfid == this.userInfo.jfid) {
                if (item.reviewIdList) {
                  if (!item.reviewIdList.includes(this.userInfo.jfid)) {
                    item.btns.push({
                      name: "评审小组审核",
                      method: "workView",
                      type: "text",
                      size: "medium",
                      icon: "el-icon-document",
                      className: "font-size-20",
                    });
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  item.btns.push({
                    name: "评审小组审核",
                    method: "workView",
                    type: "text",
                    size: "medium",
                    icon: "el-icon-document",
                    className: "font-size-20",
                  });
                  return true;
                }
              }
            });
          }
        }
      }
    },
    // 通过终验审核
    btnValidate4(row, item) {
      if (row.name == "通过终验") {
        if (item.isDuoBiaoDuan == 0 && item.contractName != "") {
          if (this.userInfo.currentRole.roleCode == "XMFZR") {
            if (
              item.description &&
              JSON.parse(item.description)[0].operationBtns[0].btnName ==
                "通过终验"
            ) {
              return true;
            }
          }
        }
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

      getUserByRoleCode({ roleCode: "CJDW_XMJL" }).then((res) => {
        res.data.map((res) => {
          // console.log(res, "res客户经理");
          // this.search.enum.customerManager.push({
          //   label: String(res.fullname),
          //   value: String(res.jfid),
          // });
        });
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
          JSON.parse(sessionStorage.getItem("searchData")).applicationUnit !==
          ""
        ) {
          this.search.formData.applicationUnit = JSON.parse(
            sessionStorage.getItem("searchData")
          ).applicationUnit;
        }
        if (
          JSON.parse(sessionStorage.getItem("searchData")).yearPlanName !== ""
        ) {
          this.search.formData.yearPlanName = JSON.parse(
            sessionStorage.getItem("searchData")
          ).yearPlanName;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).tjPerson !== "") {
          this.search.formData.tjPerson = JSON.parse(
            sessionStorage.getItem("searchData")
          ).tjPerson;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).status !== null) {
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
      this.table.data = [];
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        systemtName: this.search.formData.systemName,
        projectName: this.search.formData.projectName,
        applicationUnit: this.search.formData.applicationUnit,
        yearPlanName: this.search.formData.yearPlanName,
        tjPerson: this.search.formData.tjPerson,
        status: this.search.formData.status
          ? Number(this.search.formData.status)
          : null,
      };
      api_getList(param)
        .then((res) => {
          this.table.page.pageNum = res.data.current;
          this.table.page.total = res.data.total;
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          if (res.data.records.length > 0) {
            this.isLoading = false;
            // debugger;
            res.data.records.forEach((item) => {
              if (item.description) {
                item.operationBtns = [];

                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    if (item1.operationBtns[0].btnName == "发起终验申请") {
                      item.operationBtns.push({});
                    } else {
                      if (roleCode == item1.role) {
                        if (item1.operationBtns) {
                          item.operationBtns.push(item1.operationBtns[0]);
                        }
                      } else if (item1.role == "assignee") {
                        // console.log(item1.operationBtns, "item1.operationBtns");
                        if (item1.operationBtns) {
                          if (item.status == 401) {
                            if (item.reviewInfo) {
                              item.reviewInfo.forEach((ele) => {
                                if (ele.jfid == this.userInfo.jfid) {
                                  if (item.reviewIdList) {
                                    if (
                                      !item.reviewIdList.includes(
                                        this.userInfo.jfid
                                      )
                                    ) {
                                      item.operationBtns.push(
                                        item1.operationBtns[0]
                                      );
                                    } else {
                                      item.operationBtns.push({});
                                    }
                                  } else {
                                    item.operationBtns.push(
                                      item1.operationBtns[0]
                                    );
                                  }
                                }
                              });
                            }
                          } else {
                            item.operationBtns.push(item1.operationBtns[0]);
                          }
                        }
                      }
                    }
                  });
                item.path = this.workView;
                // }
              }
            });
            this.table.data = res.data.records;
            console.log(" this.table.data", this.table.data);

            this.table.data.forEach((item, index) => {
              if (
                item.projectFinalInspectionEntities &&
                item.projectFinalInspectionEntities.length >= 1
              ) {
                item.moreVos = 1;
                item.projectFinalInspectionEntities.sort((a, b) => {
                  return a.isSection - b.isSection;
                });
              }
              // if (
              //   item.projectFinalInspectionEntities &&
              //   item.projectFinalInspectionEntities.length == 1
              // ) {
              //   item.contractName =
              //     item.projectFinalInspectionEntities[0].contractName;
              //   item.description =
              //     item.projectFinalInspectionEntities[0].description;
              //   item.id = item.projectFinalInspectionEntities[0].id;
              //   item.projectId =
              //     item.projectFinalInspectionEntities[0].projectId;
              //   item.processId =
              //     item.projectFinalInspectionEntities[0].processId;
              //   item.contractId =
              //     item.projectFinalInspectionEntities[0].contractId;
              // }
            });
            console.log(this.table.data, "this.tdescriptionable.data");
          } else {
            console.log("111111111111122222222222");

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
    query_List() {
      let param1 = {
        pageNum: this.table.page.pageNum,
        pageSize: 9999,
      };

      api_getList(param1).then((res1) => {
        let arr = [];
        let arr1 = [];

        let initTjPerson1 = new Set(
          res1.data.records.map((item) => {
            return item.creatorJfid;
          })
        );

        let aaaa = Array.from(initTjPerson1);

        res1.data.records.forEach((item2) => {
          if (item2.creatorJfid != null) {
            if (arr1.length == 0) {
              arr1.push(item2.creatorJfid);
              arr.push({
                name1: item2.creatorName,
                initId: item2.creatorJfid,
              });
            } else {
              if (
                aaaa.includes(item2.creatorJfid) &&
                !arr1.includes(item2.creatorJfid) &&
                item2.creatorJfid != null
              ) {
                arr1.push(item2.creatorJfid);
                arr.push({
                  name1: item2.creatorName,
                  initId: item2.creatorJfid,
                });
              }
            }
          }
        });
        arr.forEach((item) => {
          this.search.enum.customerManager.push({
            label: String(item.name1),
            value: String(item.initId),
          });
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
          applicationUnit,
          yearPlanName,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          applicationUnit == "" &&
          yearPlanName == "" &&
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
          applicationUnit,
          yearPlanName,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          applicationUnit !== "" ||
          yearPlanName !== "" ||
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
        name: "projectEndWorkView",
        query: {
          id: row.id,
          projectId: row.projectId,
          processId: row.processId,
          statusName: row.statusName,
          version: row.version,
          contractId: row.contractId,
        },
      });
    },
    see(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          applicationUnit,
          yearPlanName,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          applicationUnit == "" &&
          yearPlanName == "" &&
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
          applicationUnit,
          yearPlanName,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          applicationUnit !== "" ||
          yearPlanName !== "" ||
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
        name: "projectEndView",
        query: {
          id: row.id,
          projectId: row.projectId,
          processId: row.processId,
          contractId: row.contractId,
        },
      });
    },
    goToProject(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          applicationUnit,
          yearPlanName,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          applicationUnit == "" &&
          yearPlanName == "" &&
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
          applicationUnit,
          yearPlanName,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          applicationUnit !== "" ||
          yearPlanName !== "" ||
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
        // 终验申请
        name: "projectEndAdd",
        query: {
          id: row.id,
          projectId: row.projectId,
          processId: row.processId,
          contractId: row.contractId,
        },
      });
    },
    rowClick(row) {
      console.log(row, "row");
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
    button {
      top: -5px !important;
    }
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
.searchPage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.systemNameContract {
  display: flex;
  align-items: center;
  .addClick {
    width: 16px;
    height: 15px;
    /* background: #000; */
    color: #000;
    text-align: center;
    line-height: 15px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: bolder;
    margin-right: 14px;
    border: 1px solid rgb(201, 205, 212);
    cursor: pointer;
  }
}
.section {
  display: flex;
  flex-direction: column;
  .count {
    display: inline-block;
    width: 53px;
    height: 24px;
    background: rgb(1, 118, 255);
    color: rgba(1, 118, 255, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    border-radius: 2px;
    background: rgba(66, 130, 255, 0.1);
    border: 1px solid rgba(1, 118, 255, 1);
  }
}
.circle-btn {
  border-radius: 50% !important;
}
.table_unitName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
:hover .table_unitName {
  cursor: pointer;
}
::v-deep .table-column-hidden .el-checkbox__input {
  display: none !important;
}

.text-ellipsis {
  // width: 200px; /* 定义容器宽度 */
  white-space: nowrap; /* 确保文本不换行 */
  overflow: hidden; /* 隐藏超出容器的内容 */
  text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
}
</style>
