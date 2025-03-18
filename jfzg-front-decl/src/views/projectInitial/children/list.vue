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
      ref="selectTable"
      @pageChanged="handlePageChange"
      :data="table.data"
      :noData="noData"
      @sizeChanged="handleSizeChange"
      @sortChange="sortChange"
      :config="table.config"
      :page="table.page"
      :extra-tooltip-labels="['项目编码', '需求部门']"
    >
      <!-- 系统名称 systemName -->
      <template slot="systemName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'systemName'">
          <div
            class="systemNameContract"
            v-if="
              scope.row.projectFirstVoList &&
              scope.row.projectFirstVoList.length >= 1 &&
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

          <div v-else :class="scope.row.isDuobiaoduan === 0 ? 'section' : ''">
            <span
              v-if="scope.row.isDuobiaoduan === 0 && scope.row.isSection"
              style="display: flex; justify-content: center"
            >
              <span class="count"> 标段{{ scope.row.isSection }} </span>
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
      <!-- 项目名称 -->
      <template slot="projectName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'projectName'">
          <div :class="scope.row.sectionCount ? 'section' : ''">
            <span class="name">{{ scope.row.projectName }}</span>
          </div>
        </div>
      </template>
      <!-- 合同名称 contractName -->
      <template slot="contractName" slot-scope="scope">

          <div class="table_unitName"  v-if="
            scope.scope.row.contractName &&
            scope.scope.row.contractName != '' &&
            scope.scope.row.contractName != null
          ">
            {{ scope.scope.row.contractName }}
          </div>


        <div v-else>/</div>
      </template>
      <!-- 标段 -->
      <template slot="isSection" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'isSection'">
          <span
            v-if="scope.row.isSection !== 0 && scope.row.isSection !== null"
            >{{ "标段 " + scope.row.isSection }}</span
          >
          <span v-else>-</span>
        </div>
      </template>

      <!-- 需求部门 -->
      <!-- 需求部门 -->
      <template slot="applicationUnit" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'applicationUnit'">
          <div class="table_unitName">
            <span>{{ scope.row.applicationUnit }}</span>
          </div>
        </div>
      </template>
      <!-- 所属阶段 -->

      <template slot="planYear" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'planYear'">
          <div
            v-if="
              scope.row.projectFirstVoList &&
              scope.row.projectFirstVoList.length < 1
            "
          >
            <div :class="scope.row.sectionCount ? 'section' : ''">
              <span class="name">
                <!-- {{ - }} -->
                {{ scope.row.planYear == null ? "-" : scope.row.planYear }}
              </span>
            </div>
          </div>
          <div v-else>
            <div :class="scope.row.sectionCount ? 'section' : ''">
              <div
                v-if="
                  scope.row.projectFirstVoList &&
                  scope.row.projectFirstVoList.length > 1
                "
              >
                -
              </div>
              <div v-else>
                <span class="name">
                  {{ scope.row.planYear == null ? "-" : scope.row.planYear }}
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
              scope.row.projectFirstVoList &&
              scope.row.projectFirstVoList.length < 1
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
              scope.row.projectFirstVoList &&
              scope.row.projectFirstVoList.length < 1
            "
          >
            {{ scope.row.tjPerson == null ? "-" : scope.row.tjPerson }}
          </div>

          <div v-else>
            {{ scope.row.tjPerson == null ? "-" : scope.row.tjPerson }}
          </div>
        </div>
      </template>
    </SrTable>
  </div>
</template>

<script>
import store from "@/store";
import { permissionCode } from "../const.js";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
// api
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { api_queryProjectInitial } from "@/api/projectInitial/index.js";
import yearPlanManager from "@/utils/yearPlanUtils";
import { getUserByRoleCode } from "@/api/planProject";
import {
  getStatusListByRoleCode,
  returnStatusNameByValue,
} from "../components/status";
export default {
  name: "project_Initial",
  data() {
    return {
      isLoading: false,
      noData: false,
      hasData: true,
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
            placeholder: "请输入系统名称",
            bind: "systemName",
            disabled: false,
            class: "inputStyle",
          },
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName",
            class: "inputStyle",
          },
          {
            type: "select",
            placeholder: "所属年度计划",
            bind: "yearPlan",
            data: "yearPlanList", // 对应enum中的yearPlanList
            disabled: false,
            class: "selectStyle",
          },
          {
            type: "text",
            placeholder: "需求部门",
            bind: "applicationUnit",

            class: "inputStyle",
          },
          // {
          //   type: "text",
          //   placeholder: "提交人",
          //   bind: "tjPerson",
          //   class: "inputStyle",
          // },
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
          tjPerson: "",
          systemName: "",
          projectName: "",
          yearPlanId: "",
          needDepartmentPersonId: "",
          applicationUnit: "",
          status: null,
        },
        enum: {
          //年度计划
          yearPlanList: [],
          statusList: [],
          customerManager: [],
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
            // hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              method: "previewFunc", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              code: "M008_010_009_004",
              validate: this.btnValidate2,
            },
            {
              name: "初验申请", // 按钮名称，优先显示icon
              method: "goExamine", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate,
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
              validate: this.btnValidate3, //自定义判断是否展示按钮权限
            },
            {
              name: "评审小组审核",
              method: "workView",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate4, //自定义判断是否展示按钮权限
            },
            {
              name: "通过初验",
              method: "workView",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate5, //自定义判断是否展示按钮权限
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
  },
  mounted() {
    this.query_List();
    this.getHeaderOptions();
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
              item.projectFirstVoList &&
              item.projectFirstVoList.length >= 1 &&
              item.isDuobiaoduan == 0
            ) {
              // projectFirstVoList
              item.projectFirstVoList.forEach((ele, elIndex) => {
                this.table.data.splice(index + elIndex + 1, 0, {
                  btns: item.btns,
                  id: item.id, //项目唯一id
                  projectFirstVoList: [],
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
                  // 所属阶段 planYear
                  planYear: ele.planYear ? ele.planYear : "-",
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
                  projectInitalId: ele.projectInitalId,
                  description: ele.description,
                  todo: ele.todo,
                  isShow: ele.isShow,
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
              this.table.data.splice(index + 1, item.projectFirstVoList.length);
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
      // let list = getStatusListByRoleCode(this.userInfo.currentRole.roleCode);
      // console.log(list,'只想')
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
    btnValidate2(row, item) {
      if (
        this.userInfo.currentRole.roleCode == "FZGHC_JBRBF" ||
        this.userInfo.currentRole.roleCode == "BM_FZR" ||
        this.userInfo.currentRole.roleCode == "XMFZR" ||
        this.userInfo.currentRole.roleCode == "DSZ" ||
        this.userInfo.currentRole.roleCode == "F_ZJL" ||
        this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
        this.userInfo.currentRole.roleCode == "JLGCS" ||
        this.userInfo.currentRole.roleCode == "PSXZ_CY" ||
        this.userInfo.currentRole.roleCode == "ZJL"
      ) {
        // return true;
        if (
          item.projectFirstVoList &&
          item.projectFirstVoList.length >= 1 &&
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
    btnValidate(row, item) {
      // 未提交-1
      // 已提交-11
      // 监理工程师 【 待审核-2 退回修改-202 不通过-203 通过-204 】
      // 项目负责人 【 待审核-301 退回修改-302 不通过-303 通过-304 】
      // 评审小组   【 待审核-305 不通过-306 退回修改-307 通过-308 】
      // 通过初验   【 待审核-309 不通过-410 退回修改-411 】
      // 通过-1000
      if (
        [1, 202, 302, 307, 411].includes(item.status) &&
        this.userInfo.currentRole.roleCode == "CJDW_XMJL" //承建单位——项目经理
      ) {
        if (
          item.projectFirstVoList &&
          item.projectFirstVoList.length >= 1 &&
          item.isDuobiaoduan === 0
        ) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    btnValidate1(row, item) {
      if (row.name == "监理工程师审核") {
        if (item.isDuobiaoduan == 0 && item.contractName != "") {
          if (
            item.description &&
            JSON.parse(item.description)[0].operationBtns[0].btnName ==
              "监理工程师审核"
          ) {
            return true;
          }
        }
      }
    },
    btnValidate3(row, item) {
      if (row.name == "项目负责人审核") {
        if (item.isDuobiaoduan == 0 && item.contractName != "") {
          if (
            item.description &&
            JSON.parse(item.description)[0].operationBtns[0].btnName ==
              "项目负责人审核"
          ) {
            return true;
          }
        }
      }
    },
    btnValidate4(row, item) {
      console.log(item);
      console.log(item.isShow, "isShow");
      if (row.name == "评审小组审核") {
        if (item.isDuobiaoduan == 0 && item.contractName != "") {
          if (item.isDuobiaoduan != null) {
            if (
              item.description &&
              JSON.parse(item.description)[0].operationBtns[0].btnName ==
                "评审小组审核"
            ) {
              if (item.isShow) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
    },
    // 通过审核
    btnValidate5(row, item) {
      if (row.name == "通过初验") {
        if (item.isDuobiaoduan == 0 && item.contractName != "") {
          if (
            item.description &&
            JSON.parse(item.description)[0].operationBtns[0].btnName ==
              "通过初验" &&
            item.status == "308" &&
            this.userInfo.currentRole.roleCode == "XMFZR"
          ) {
            return true;
          }
        }
        // }
      }
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
      this.table.data = [];
      let payLoad = {
        belongingStage: "",
        needDepartmentPersonId: this.search.formData.applicationUnit,
        selectType: 0,
        tjPerson: this.search.formData.tjPerson,
        year: this.search.formData.yearPlan,
        yearPlanId: this.search.formData.yearPlan,
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        systemName: this.search.formData.systemName,
        projectCode: "",
        projectName: this.search.formData.projectName,
        status: this.search.formData.status,
      };
      api_queryProjectInitial(payLoad)
        .then((res) => {
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          if (res.data.records.length>0) {
            this.isLoading = false;
            this.table.page.pageNum = res.data.current;
            this.table.page.total = res.data.total;

            res.data.records.forEach((item) => {
              if (item.todo) {
                item.operationBtns = [];
                //按钮筛选  以assignee优先roleCode
                if (item.assignee == jfid) {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (item1.operationBtns[0].btnName == "评审小组审核") {
                        if (item.isShow) {
                          item.operationBtns = [];
                          item1.operationBtns &&
                            item.operationBtns.push(item1.operationBtns[0]);
                        }
                      } else if (item1.operationBtns[0].btnName == "初验申请") {
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
                        if (item1.operationBtns[0].btnName == "评审小组审核") {
                          if (item.isShow || item.isShow == null) {
                            item.operationBtns = [];
                            item1.operationBtns &&
                              item.operationBtns.push(item1.operationBtns[0]);
                          } else {
                            item.operationBtns = [];
                          }
                        } else if (
                          item1.operationBtns[0].btnName == "初验申请"
                        ) {
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
              }
              if (
                item.operationBtns &&
                [202, 302, 307, 411].includes(item.status)
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
              if (
                item.projectFirstVoList &&
                item.projectFirstVoList.length >= 1
              ) {
                item.moreVos = 1;
                item.projectFirstVoList.sort((a, b) => {
                  return a.isSection - b.isSection;
                });
              }
            });
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
    query_List() {
      let param1 = {
        pageNum: this.table.page.pageNum,
        pageSize: 9999,
      };
      api_queryProjectInitial(param1).then((res1) => {
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
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    handlePageChange(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = val;
      this.queryTableData();
    },
    handleSizeChange(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.queryTableData();
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
        name: "projectInitialWorkView",
        query: {
          id: row.id,
          contractId: row.contractId,
          processId: row.processId,
          templateId: row.templateId,
          projectInitalId: row.projectInitalId || "",
          status: row.status || "",
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
      this.$router.push({
        name: "projectInitialView",
        query: {
          id: row.id,
          contractId: row.contractId,
          projectInitalId: row.projectInitalId || "",
          processId: row.processId || "",
          status: row.status || "",
        },
      });
    },
    // 初验申请
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
      this.$router.push({
        name: "projectInitialAdd",
        query: {
          id: row.id,
          contractId: row.contractId,
          projectInitalId: row.projectInitalId || "",
          processId: row.processId || "",
          status: row.status || "",
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

::v-deep .sr_search .inputStyle {
  width: 160px !important;
}

::v-deep .sr_search .selectStyle {
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
  // width: 200px; /* 定义容器宽度 */
  white-space: nowrap;
  /* 确保文本不换行 */
  overflow: hidden;
  /* 隐藏超出容器的内容 */
  text-overflow: ellipsis;
  /* 使用省略号表示被截断的文本 */
}
</style>
