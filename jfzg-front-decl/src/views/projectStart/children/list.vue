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
      :config="table.config"
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
              scope.row.projectStartVos &&
              scope.row.projectStartVos.length >= 1 &&
              scope.row.isDuobiaoduan === 0
            "
          >
            <!-- + - 按钮 -->
            <div class="addClick" @click="clickVos(scope.row)">
              <i
                style="font-weight: bolder"
                :class="
                  scope.row.moreVos == 1 || !rProject.includes(scope.row.id)
                    ? 'el-icon-plus'
                    : 'el-icon-minus'
                "
              >
              </i>
            </div>
            <div class="text-ellipsis">{{ scope.row.systemName }}</div>
          </div>

          <div v-else :class="scope.row.isDuobiaoduan ? 'section' : ''">
            <span
              v-if="scope.row.isDuobiaoduan === 0"
              style="display: flex; justify-content: center"
            >
              <div class="count">标段{{ scope.row.isSection }}</div>
            </span>
            <span>
              <span v-if="scope.row.isSection"></span>
              <span v-else>
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
      <!--  标段"slotName": "isSection" -->
      <template slot="isSection" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'isSection'">
          <div v-if="scope.row.isSection == null">-</div>
          <div v-else>
            标段
            {{ scope.row.isSection }}
          </div>
        </div>
      </template>

      <!-- 所属年度计划 -->
      <template slot="projectMaturity" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'projectMaturity'">
          <div
            v-if="
              scope.row.projectStartVos && scope.row.projectStartVos.length < 1
            "
          >
            <div :class="scope.row.sectionCount ? 'section' : ''">
              <span class="name">
                <!-- {{ - }} -->
                {{
                  scope.row.projectMaturity == null
                    ? "-"
                    : scope.row.projectMaturity
                }}
              </span>
            </div>
          </div>
          <div v-else>
            <div :class="scope.row.sectionCount ? 'section' : ''">
              <div
                v-if="
                  scope.row.projectStartVos &&
                  scope.row.projectStartVos.length > 1
                "
              >
                -
              </div>
              <div v-else>
                <span class="name">
                  {{
                    scope.row.projectMaturity == null
                      ? "-"
                      : scope.row.projectMaturity
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 状态 -->
      <template slot="statusName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'statusName'">
          <div
            v-if="
              scope.row.projectStartVos && scope.row.projectStartVos.length < 1
            "
          >
            {{ scope.row.statusName == null ? "未提交" : scope.row.statusName }}
          </div>
          <div v-else>
            {{ scope.row.statusName == null ? "-" : scope.row.statusName }}
          </div>
        </div>
      </template>
      <!-- 发起人 tjPerson -->
      <template slot="tjPerson" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'tjPerson'">
          <div
            v-if="
              scope.row.projectStartVos && scope.row.projectStartVos.length < 1
            "
          >
            {{ scope.row.tjPerson == null ? "-" : scope.row.tjPerson }}
          </div>

          <div v-else>
            <!-- {{ scope.row.tjPerson==null  }} -->
            {{ scope.row.tjPerson == null ? "-" : scope.row.tjPerson }}
          </div>

          <!-- {{ scope.row.tjPerson }} -->
        </div>
      </template>
    </SrTable>
  </div>
</template>

<script>
import store from "@/store";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
// api
import yearPlanManager from "@/utils/yearPlanUtils";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { api_queryProjectStart } from "@/api/projectStart/index.js";
import { getUserByRoleCode } from "@/api/planProject";

import {
  getStatusListByRoleCode,
  returnStatusNameByValue,
} from "../components/status";
export default {
  name: "project_start",
  data() {
    return {
      isLoading: false,
      noData: false,
      returnStatusNameByValue,
      userInfo: store.getters.userInfo,
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
            placeholder: "所属年度计划",
            bind: "yearPlanId",
            data: "yearPlanList", // 对应enum中的yearPlanList
            class: "",
            disabled: false,
            class: "selectStyle",
          },
          {
            type: "text",
            placeholder: "需求部门",
            bind: "applicationUnit",

            class: "inputStyle",
          },

          {
            type: "select",
            placeholder: "状态",
            bind: "status",
            data: "statusList", // 对应enum中
            class: "",
            disabled: false,
            class: "selectStyle",
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
          yearPlanId: "",
          needDepartmentPersonId: "",
          tjPerson: "",
          applicationUnit: "",
          status: null,
        },
        enum: {
          yearPlanList: [], //年度计划
          statusList: [],
          customerManager: [],
        },
      },
      table: {
        data: [], // 表格数据
        config: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          maxHeight: 0,
          load: this.load,
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
            hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              method: "previewFunc", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              code: "M007_010_005_002",
              validate: this.btnValidate3,
            },
            {
              name: "开工申请", // 按钮名称，优先显示icon
              method: "goExamine", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate,
            },
            {
              name: "开工令", // 按钮名称，优先显示icon
              method: "workView", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate2,
            },
            {
              // 子标段
              name: "监理工程师审核", // 按钮名称，优先显示icon
              method: "workView", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate4,
            },
            {
              // 子标段
              name: "项目负责人审核", // 按钮名称，优先显示icon
              method: "workView", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate4,
            },
            {
              // 子标段
              name: "同意开工", // 按钮名称，优先显示icon
              method: "workView", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate4,
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

      sectionCount: null,

      // 展开多标段projecID
      rProject: [],
    };
  },
  created() {
    this.search.enum.yearPlanList = yearPlanManager.yearPlanList;
    this.queryTableData();
    this.getHeaderOptions();
  },
  mounted() {
    this.query_List();

    this.getStatusList();
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
    clickVos(e) {
      if (e.moreVos) {
        this.rProject.push(e.id);

        this.table.data.forEach((item, index) => {
          if (this.rProject.includes(item.id) && item.id == e.id) {
            if (
              item.projectStartVos &&
              item.projectStartVos.length >= 1 &&
              item.isDuobiaoduan == 0
            ) {
              item.projectStartVos.forEach((ele, elIndex) => {
                this.table.data.splice(index + elIndex + 1, 0, {
                  btns: item.btns,
                  id: item.id, //项目唯一id
                  projectStartVos: [],
                  contractId: ele.contractId,

                  // contractName 合同名称
                  contractName: ele.contractName,

                  // 项目名称
                  projectName: item.projectName,
                  // 系统名称
                  systemName: item.systemName,

                  sectionCount: ele.sectionCount,

                  isSection: ele.isSection,

                  isDuobiaoduan: ele.isDuobiaoduan,

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

                  projectExecutionId: ele.projectExecutionId
                    ? ele.projectExecutionId
                    : "-",

                  projectStartId: ele.projectStartId,
                  description: ele.description,
                  todo: ele.todo,
                });
              });
            }

            index = index + 1;
            item.moreVos = 0;
          }
        });
      } else {
        this.table.data.forEach((item, index) => {
          if (item.id == e.id) {
            if (item.moreVos == 0) {
              this.table.data.splice(index + 1, item.projectStartVos.length);
              index = index + 1;
            }
            item.moreVos = 1;
            this.rProject.forEach((item, index) => {
              if (item == e.id) {
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
    getStatusList() {
      let list = getStatusListByRoleCode(this.userInfo.currentRole.roleCode);
      // this.search.enum.statusList = list;
      this.search.enum.statusList = [
        {
          value: 0,
          label: "未提交",
        },
        {
          value: 2,
          label: "审批中",
        },
        {
          value: 3,
          label: "不通过",
        },
        {
          value: 5,
          label: "已完成",
        },
      ];
    },
    btnValidate3(row, item) {
      if (
        this.userInfo.currentRole.roleCode == "FZGHC_JBRBF" ||
        this.userInfo.currentRole.roleCode == "BM_FZR" ||
        this.userInfo.currentRole.roleCode == "XMFZR" ||
        this.userInfo.currentRole.roleCode == "DSZ" ||
        this.userInfo.currentRole.roleCode == "ZJL" ||
        this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
        this.userInfo.currentRole.roleCode == "JLGCS" ||
        this.userInfo.currentRole.roleCode == "F_ZJL"
      ) {
        // return true;

        if (
          item.projectStartVos &&
          item.projectStartVos.length >= 1 &&
          item.isDuobiaoduan === 0
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    //开工申请按钮校验
    btnValidate(row, item) {
      // 1-- "未提交" 2=="待审核"
      // 202=="监理工程师-退回修改"
      // 203=="监理工程师-不通过"
      // 204=="监理工程师-通过"
      // 301=="项目负责人-待审核"
      // 302=="项目负责人-退回修改"
      // 303=="项目负责人-不通过"
      // 401=="同意开工-待审核"
      // 402=="同意开工-退回修改"
      // 403=="同意开工-不通过"
      // 1000=="通过"
      if (
        item.status !== 2 &&
        item.status !== 204 &&
        item.status !== 301 &&
        item.status !== 401 &&
        // item.status !== 403 &&
        item.status !== 1000 &&
        this.userInfo.currentRole.roleCode == "CJDW_XMJL" //承建单位——项目经理
        // this.userInfo.currentRole.roleCode !== "FZGHC_JBRBF"&&
      ) {
        // return true;
        if (
          item.projectStartVos &&
          item.projectStartVos.length >= 1 &&
          item.isDuobiaoduan === 0
        ) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    // 开工令按钮校验
    btnValidate2(row, item) {
      // 1-- "未提交" 2=="待审核"
      // 202=="监理工程师-退回修改"
      // 203=="监理工程师-不通过"
      // 204=="监理工程师-通过"
      // 301=="项目负责人-待审核"
      // 302=="项目负责人-退回修改"
      // 303=="项目负责人-不通过"
      // 401=="同意开工-待审核"
      // 402=="同意开工-退回修改"
      // 403=="同意开工-不通过"
      // 1000=="通过"
      if (
        row.taskName == "同意开工" &&
        item.status == 1000 &&
        this.userInfo.currentRole.roleCode == "JLGCS" // 监理工程师
        // this.userInfo.currentRole.roleCode !== "FZGHC_JBRBF"&&
      ) {
        // return true;
        if (
          item.projectStartVos &&
          item.projectStartVos.length >= 1 &&
          item.isDuobiaoduan === 0
        ) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    // 监理按钮校验
    btnValidate4(row, item) {
      // if (
      //   row.taskName == "同意开工" &&
      //   item.status == 1000 &&
      //   this.userInfo.currentRole.roleCode == "JLGCS" // 监理工程师
      //   // this.userInfo.currentRole.roleCode !== "FZGHC_JBRBF"&&
      // ) {
      // return true;
      if (row.name == "监理工程师审核") {
        if (
          item.isDuobiaoduan == 0 &&
          item.contractName != "" &&
          item.projectStartVos.length == 0 &&
          item.todo == true &&
          this.userInfo.currentRole.roleCode == "JLGCS" &&
          item.status == 2
        ) {
          return true;
        } else {
          return false;
        }
      }
      if (row.name == "同意开工") {
        if (
          item.isDuobiaoduan == 0 &&
          item.contractName != "" &&
          item.projectStartVos.length == 0 &&
          item.todo == true &&
          this.userInfo.currentRole.roleCode == "JLGCS" &&
          item.status == 401
        ) {
          return true;
        } else {
          return false;
        }
      }
      if (row.name == "项目负责人审核") {
        if (
          item.isDuobiaoduan == 0 &&
          item.contractName != "" &&
          item.projectStartVos.length == 0 &&
          item.todo == true &&
          this.userInfo.currentRole.roleCode == "XMFZR"
        ) {
          return true;
        } else {
          return false;
        }
      }

      // }
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
      api_userSetQuery({ permissionCode: "M005_021" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        // this.table.config.operateConfig.allTableHeader = headerData;
        this.table.config.header = headerData.filter((item) => {
          return item.isShow;
        });
      });

      getUserByRoleCode({ roleCode: "CJDW_XMJL" }).then((res) => {
        res.data.map((res) => {
          // this.search.enum.customerManager.push({
          //   label: String(res.fullname),
          //   value: String(res.fullname),
          // });
        });
      });
    },
    pageChanged(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = val;
      this.queryTableData();
    },
    sizeChanged(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.queryTableData();
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
      let param = {
        belongingStage: "",
        // contactId: '',
        // controlJfid: '',
        needDepartmentPersonId: this.search.formData.applicationUnit,
        selectType: 0,
        yearPlanId: this.search.formData.yearPlan,
        //yearPlanId: this.search.formData.yearPlan,
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        systemName: this.search.formData.systemName,
        projectCode: "",
        projectName: this.search.formData.projectName,
        status: this.search.formData.status,
        tjPerson: this.search.formData.tjPerson,
      };
      this.table.data = [];
      api_queryProjectStart(param)
        .then((res) => {
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          if (res.data.records.length > 0) {
            this.isLoading = false;
            this.table.page.pageNum = res.data.current;
            // this.table.page.pageSize = res.data.size;
            this.table.page.total = res.data.total;

            res.data.records.forEach((item) => {
              item.operationBtns = [];
              if (item.todo) {
                //按钮筛选  以assignee优先roleCode
                if (item.assignee == jfid) {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (item1.operationBtns[0].btnName == "发起开工申请") {
                        item.operationBtns = [];
                      } else {
                        item1.operationBtns &&
                          item.operationBtns.push(item1.operationBtns[0]);
                      }
                    });
                  item.path = this.workView;
                } else {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (roleCode == item1.role) {
                        if (item1.operationBtns[0].btnName == "发起开工申请") {
                          item.operationBtns = [];
                        } else {
                          item1.operationBtns &&
                            item.operationBtns.push(item1.operationBtns[0]);
                        }
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
              } else {
                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    if (roleCode == item1.role) {
                      if (item1.operationBtns[0].btnName == "发起开工申请") {
                        item.operationBtns = [];
                      } else {
                        item1.operationBtns &&
                          item.operationBtns.push(item1.operationBtns[0]);
                      }
                    }
                  });

                // 处理建设单位提交,经办人审核后经办人有撤回按钮
                item.operationBtns.map((item1) => {
                  if (item1.btnName == "撤回" && item.creator != jfid) {
                    item1.btnName = "";
                  }
                });
              }

              if (
                item.operationBtns &&
                (item.status == 202 || item.status == 302)
              ) {
                item.operationBtns = item.operationBtns.filter(
                  (item) => item.name == "提交"
                );
                item.btns = [
                  ...(item.btns ?? []),
                  ...(item.operationBtns ?? []),
                ];
              }

              return item;
            });
            this.table.data = res.data.records;

            this.table.data.forEach((item) => {
              if (item.projectStartVos && item.projectStartVos.length >= 1) {
                item.moreVos = 1;
                item.projectStartVos.sort((a, b) => {
                  return a.isSection - b.isSection;
                });
              }
            });
          } else {
            this.isLoading = false;
            this.noData = true;
            this.table.data = [];
            this.table.data.forEach((item) => {
              if (item.projectStartVos && projectStartVos.length > 1) {
                // tjPerson
                item.moreVos = 1;
              }
            });
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

        belongingStage: "",
        // contactId: '',
        // controlJfid: '',
        needDepartmentPersonId: this.search.formData.applicationUnit,
        selectType: 0,
        yearPlanId: this.search.formData.yearPlan,
        //yearPlanId: this.search.formData.yearPlan,
        // pageNum: this.table.page.pageNum,
        // pageSize: this.table.page.pageSize,
        systemName: this.search.formData.systemName,
        projectCode: "",
        projectName: this.search.formData.projectName,
        status: this.search.formData.status,
        tjPerson: this.search.formData.tjPerson,
      };

      api_queryProjectStart(param1).then((res1) => {
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
        permissionCode: "M005_021",
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
        name: "projectStartWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          projectStartId: row.projectStartId || "",
          status: row.status || "",
          contractId: row.contractId || null,
        },
      });
    },
    //去查看
    previewFunc(row) {
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
      sessionStorage.setItem("start_contractId", row.contractId);

      this.$router.push({
        name: "projectStartView",
        query: {
          id: row.id,
          projectStartId: row.projectStartId || "",
          processId: row.processId || "",
          status: row.status || "",
          contractId: row.contractId || "",
        },
      });
    },
    // 开工申请
    goExamine(row) {
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
      sessionStorage.setItem("start_contractId", row.contractId);

      this.$router.push({
        name: "projectStartAdd",
        query: {
          id: row.id,
          projectStartId: row.projectStartId || "",
          processId: row.processId || "",
          status: row.status || "",
          contractId: row.contractId || "",
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

:deep(.inputStyle) {
  width: 160px !important;
}

:deep(.selectStyle) {
  width: 160px !important;
}
::v-deep .sr_search .el-select {
  width: 160px !important;
}

.searchPage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.circle-btn {
  border-radius: 50% !important;
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
  // height: 60px;
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
  // .name {
  //   // color: rgb(153, 153, 153);
  // }
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
  // width: 200px; /* 定义容器宽度 */fff
  white-space: nowrap; /* 确保文本不换行 */
  overflow: hidden; /* 隐藏超出容器的内容 */
  text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
}
</style>
