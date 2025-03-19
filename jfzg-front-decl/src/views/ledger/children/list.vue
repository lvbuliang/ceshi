<template>
  <div class="common-card">
    <div ref="searchRef">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      >
      </SrSearch>
    </div>
    <CustomLoading :visible="isLoading" />

    <SrTable
      ref="tableRef"
      @pageChanged="pageChanged"
      :data="table.data"
      :noData="noData"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
      :extra-tooltip-labels="['承建单位', '项目负责人','监理单位','承建单位项目经理','监理工程师']"
    >

    <!-- systemName -->
    <template slot="systemName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'systemName'">
          <div v-if="scope.row.systemName">
              <div class="sr_list">
                {{ scope.row.systemName }}
              </div>
          </div>
          <div v-else>-</div>
        </div>
      </template>

      <!-- projectName -->
      <template slot="projectName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'projectName'">
          <div v-if="scope.row.projectName">
              <div class="sr_list">
                <span class="sr_count" v-if="shouldShowInfo(scope.row)">
                  多标段
                </span>
                {{ scope.row.projectName }}
              </div>
          </div>
          <div v-else>-</div>
        </div>
      </template>

      <template slot="planDeliveryTime" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'planDeliveryTime'">
          {{ scope.row.planDeliveryTime }}
        </div>
      </template>

      <template slot="CJDW_NAME" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'contractUnitFullName'">
          <div v-if="scope.row.contractUnitFullName">
              <div class="sr_list">
                {{ scope.row.contractUnitFullName }}
              </div>
          </div>
          <div v-else>-</div>
        </div>
      </template>

      <template slot="JLDW_NAME" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'controlUnitFullName'">
          <div v-if="scope.row.controlUnitFullName">

              <div class="sr_list">
                {{ scope.row.controlUnitFullName }}
              </div>
          </div>
          <div v-else>-</div>
        </div>
      </template>
      <template slot="leftBottomSlot">
        <div class="sr-Total">
          <div
            class="allTotal"
            v-if="showCount && Statistics.implementationPlanAmountCount"
          >
            <span style="margin-right: 10px"
              >编制金额: {{ Statistics.implementationPlanAmountCount
              }}<span v-if="Statistics.implementationPlanAmountCount !== 0"
                >万元</span
              ></span
            >
            <span style="margin-right: 10px">|</span>
            <span style="margin-right: 10px"
              >核定金额: {{ Statistics.budgetEstimateAmountCount }}万元
            </span>
            <span style="margin-right: 10px">|</span>
            <span
              >评审金额:
              {{ Statistics.financialEvaluationAmountCount }}万元</span
            >
          </div>
        </div>
      </template>

      <template slot="progressOfProject" slot-scope="{ scope }">
        <div class="progressOf" @click="viewDetail(scope.row)">查看详情</div>
      </template>
    </SrTable>

    <el-dialog
      width="90%"
      title="项目进展情况"
      :visible.sync="dialogTableVisible"
      :before-close="handleClose"
    >
      <p class="designation">
        <span> 系统名称：{{ systemList.systemName }} </span>
        <span style="margin-left: 50px">
          业务应用名称：{{ systemList.projectName }}
        </span>
      </p>
      <ProjectProgressTable :tableData="tableData" />
    </el-dialog>
  </div>
</template>
<script>
import ProjectProgressTable from "../components/ProjectProgressDialog.vue";
import store from "@/store";
import { queryProjectLists, exportByIds } from "@/api/ledger";
import {
  api_userSetQuery,
  api_userSetSave,
  api_getStatement,
} from "@/api/index.js";
import { getUserByRoleCode } from "@/api/planProject/index.js";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
export default {
  components: {
    ProjectProgressTable,
  },
  data() {
    return {
      isLoading: false,
      noData: false,
      tableData: [],
      systemList: {
        systemName: "",
        projectName: "",
      },
      dialogTableVisible: false,
      pageHeight: window.innerHeight,
      showCount: false,
      Statistics: {},
      StatisticsText: "",
      theNew: "",
      userInfo: store.getters.userInfo,
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
            placeholder: "请输入系统名称关键字",
            bind: "systemName", // 对应this.search.data对象的field1
            class: "ledgerclass",
          },
          {
            type: "text",
            placeholder: "请输入项目关键字",
            bind: "projectName", // 对应this.search.data对象的field1
            class: "ledgerclass",
          },
          {
            type: "text",
            placeholder: "请输入需求部门关键字",
            bind: "applicationUnit", // 对应this.search.data对象的
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "实施方案进展",
            bind: "implementationProgress",
            data: "progressList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "预授权协议",
            bind: "authorizationAgreement",
            data: "getLedgerList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "投资概算核定",
            bind: "approvalInvestmentBudget",
            data: "touList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "预算评审",
            bind: "budgetReview",
            data: "reviewList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "是否启动建设",
            bind: "isStart",
            data: "statuslist",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "试运行",
            bind: "testRun",
            data: "runList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "请选择项目负责人",
            bind: "contactId",
            data: "xmfzrList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "请选择方案经理",
            bind: "programManagerId",
            data: "fajlList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "请选择客户经理",
            bind: "clientManagerId",
            data: "khjlList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "立项进展",
            bind: "lxStatus",
            data: "lxStatusList",
            display: false,
            class: "ledgerclass",
          },
          {
            type: "select",
            placeholder: "采购进展",
            bind: "procurementStatus",
            data: "procurementStatusList",
            display: false,
            class: "ledgerclass",
          },
        ],
        enum: {
          // 搜索项下拉数据
          projectList: [],
          jsdwList: [],
          getLedgerList: [
            {
              value: "未授权",
              label: "未授权",
            },
            {
              value: "已授权",
              label: "已授权",
            },
          ],
          statuslist: [
            {
              value: "已启动",
            },
            {
              value: "未启动",
            },
          ],
          progressList: [
            {
              value: "编制中",
            },
            {
              value: "评审中",
            },
            {
              value: "已完成",
            },
          ],
          reviewList: [
            {
              value: "已完成",
            },
            {
              value: "未启动",
            },
          ],
          runList: [
            {
              value: "部分功能试运行",
            },
            {
              value: "正在试运行",
            },
            {
              value: "其他",
            },
          ],
          touList: [
            {
              value: "未启动",
            },
            {
              value: "核定中",
            },
            {
              value: "已完成",
            },
          ],
          lxStatusList: [
            {
              value: "未提交",
            },
            {
              value: "审批中",
            },
            {
              value: "不通过",
            },
            {
              value: "已完成",
            },
          ],
          procurementStatusList: [
            {
              value: "已提交",
            },
            {
              value: "未提交",
            },
          ],
          xmfzrList: [], // 项目负责人
          fajlList: [], // 方案经理
          khjlList: [], // 客户经理
        },
        btns: [
          {
            name: "导出",
            click: this.exprotByCondition,
            type: "default",
            permissionCode: "M0809_M001_001",
          },
        ],
        formData: {
          projectName: "",
          systemName: "",
          applicationUnit: "",
          authorizationAgreement: "",
          isStart: "",
          implementationProgress: "",
          approvalInvestmentBudget: "", //投资概算核定
          budgetReview: "",
          testRun: "",
          contactId: "", // 项目负责人id
          programManagerId: "", // 方案经理id
          clientManagerId: "", // 客户经理id
          lxStatus: "", // 立项进展
          procurementStatus: "", // 采购进展
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          maxHeight: 0,
          height: 0,
          tooltipEffect: "light",
          header: [],
          indexConfig: {
            fixed: "left",
          },
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: true,
            label: "",
            width: "56",
            // fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },
          innerBtn: [],
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
      isTableHeaderId: null,
    };
  },
  computed: {
    shouldShowInfo() {
      return (row) => {
        if (row.projectLedgerVos && row.projectLedgerVos.length > 1) {
          return true;
        }
      };
    },
  },
  created() {
    if (
      this.userInfo.currentRole.roleCode == "FZGHC_JBRBF" ||
      this.userInfo.currentRole.roleCode == "DSZ" ||
      this.userInfo.currentRole.roleCode == "ZJL" ||
      this.userInfo.currentRole.roleCode == "F_ZJL"
    ) {
      this.showCount = true;
    }
  },
  mounted() {
    this.init();

  },
  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      let height = getCommonTableHeight(this.$refs.searchRef);
      this.$set(this.table.tableConfig, "height", height);
    },
    // 单元格样式处理
    handleCellStyle({ row, column }) {
      // 定义需要处理的时间字段映射关系
      const timeFieldMap = {
        // 完成时间字段: 对应计划时间字段
        discloseEndTime: "disclosePlanTime",
        startEndTime: "startPlanTime",
        testEndTime: "testPlanTime",
        complianceEvaluationCompleteTime:
          "complianceEvaluationPlanCompleteTime",
      };

      // 只处理定义的时间字段
      if (timeFieldMap.hasOwnProperty(column.property)) {
        const planTimeField = timeFieldMap[column.property];
        return this.getTimeCellStyle(row[planTimeField], row[column.property]);
      }
      return {};
    },

    // 获取时间单元格样式
    getTimeCellStyle(planTimeStr, compareTimeStr) {
      const planTime = this.parseDate(planTimeStr);
      const compareTime = this.parseDate(compareTimeStr);
      const now = new Date();

      // 有效性检查
      if (!planTime) return {};

      // 判断条件
      const isOverdue =
        (compareTime && compareTime > planTime) || // 比较时间超期
        (!compareTime && now > planTime); // 无比较时间但当前时间已超期

      return isOverdue ? { backgroundColor: "#ff0000", color: "#ffeded" } : {};
    },

    // 安全的日期解析方法
    parseDate(dateStr) {
      if (!dateStr) return null;
      try {
        // 统一处理日期格式（支持YYYY-MM-DD和YYYY/MM/DD）
        const normalized = dateStr.replace(/-/g, "/");
        const timestamp = Date.parse(normalized);
        return isNaN(timestamp) ? null : new Date(timestamp);
      } catch {
        return null;
      }
    },
    getCellClassName({ row, column, rowIndex, columnIndex }) {
      // 判断是否是“完成时间”列
      if (column.property === "startEndTime") {
        const planTime = new Date(row.startPlanTime);
        const endTime = row.startEndTime ? new Date(row.startEndTime) : null;
        const now = new Date();

        // 如果完成时间大于计划时间，或者当前时间大于计划时间
        if ((endTime && endTime > planTime) || now > planTime) {
          return "red-background"; // 返回自定义样式类名
        }

        return "red-background"; // 返回自定义样式类名
      }
      return "red-background"; // 返回自定义样式类名
    },
    // 格式化进度值的工具函数
    formatProgress(progress) {
      if (typeof progress === "number") return String(progress);
      if (typeof progress !== "string") return "";
      return progress.replace(/%/g, "");
    },
    formatDevelopmentProgress(progress) {
      // 判断 progress 是否为字符串且包含百分号
      if (typeof progress === "string" && progress.includes("%")) {
        // 删除百分号并返回剩余部分
        return progress.replace("%", "");
      }
      // 如果是数字、null 或 undefined，直接返回
      return progress;
    },
    handleClose(done) {
      this.dialogTableVisible = false;
      this.tableData = [];
    },
    viewDetail(row) {
      console.log(row.projectLedgerVos, "ow.projectLedgerVos");
      this.systemList.systemName = row.systemName;
      this.systemList.projectName = row.projectName;

      // 提取字段合并逻辑
      function mergeRowWithLedger(row, item) {
        console.log(row, "哈哈哈哈");

        return {
          ...row,
          lXStatus: row.lxstatus,
          lXEndTime: row.lxendTime,
          contractName: item.contractName,
          procurementStatus: item.procurementStatus,
          procurementEndTime: item.procurementEndTime,
          disclosePlanTime: item.disclosePlanTime,
          discloseStatus: item.discloseStatus,
          discloseEndTime: item.discloseEndTime,
          startPlanTime: item.startPlanTime,
          startStatus: item.startStatus,
          startEndTime: item.startEndTime,
          developmentConstructionProgress: item.developmentConstructionProgress,

          testPlanTime: item.testPlanTime, // 上线试运行走项目的
          testCompleteStatus: row.testCompleteStatus, //走项目的
          testEndTime: row.testEndTime, //走项目的
          // 符合性评价进展 走项目的
          complianceEvaluationPlanCompleteTime:
            item.complianceEvaluationPlanCompleteTime,
          complianceEvaluationStatus: row.complianceEvaluationStatus,

          complianceEvaluationCompleteTime:
            row.complianceEvaluationCompleteTime,

          initialTestStatus: item.initialTestStatus,
          initialTestTime: item.initialTestTime,
          testRunStartTime: row.testRunStartTime, //试运行周期开始时间 取外层
          testRunEndTime: row.testRunEndTime, //试运行周期结束时间

          finalInspectionStatus: item.finalInspectionStatus,
          finalInspectionCompleteTime: item.finalInspectionCompleteTime,
          sectionCount: item.sectionCount,
        };
      }
      if (
        row.projectLedgerVos &&
        Array.isArray(row.projectLedgerVos) &&
        row.projectLedgerVos.length > 1
      ) {
        this.tableData = []; // 清空tableData
        row.projectLedgerVos.forEach((item) => {
          const newRow = mergeRowWithLedger(row, item);

          this.tableData.push(newRow);
        });
      } else {
        console.log(row.projectLedgerVos, "row.projectLedgerVos");
        // console.log(row.projectLedgerVos.length == 1,'row.projectLedgerVos.length == 1')
        // 如果只有一个标段，直接将其添加到tableData中
        if (
          row.projectLedgerVos &&
          Array.isArray(row.projectLedgerVos) &&
          row.projectLedgerVos.length == 1
        ) {
          // 如果只有一个标段那么
          row.projectLedgerVos.forEach((item) => {
            // 采购完成时间和采购状态取子类的
            let newRow = {
              contractName: item.contractName,
              lXStatus: row.lxstatus,
              lXEndTime: row.lxendTime,

              procurementStatus: item.procurementStatus,
              procurementEndTime: item.procurementEndTime,
              disclosePlanTime: item.disclosePlanTime, //交底计划时间
              discloseStatus: item.discloseStatus, //交底状态
              discloseEndTime: item.discloseEndTime, //交底完成时间
              // disclosePlanTime: row.disclosePlanTime,
              // discloseStatus: row.discloseStatus,
              // discloseEndTime: row.discloseEndTime,
              startPlanTime: row.startPlanTime,
              startStatus: row.startStatus,
              startEndTime: row.startEndTime,
              // developmentConstructionProgress: row.developmentConstructionProgress, // 开发建设进度
              developmentConstructionProgress: this.formatDevelopmentProgress(
                row.developmentConstructionProgress
              ),

              testPlanTime: row.testPlanTime,
              testCompleteStatus: row.testCompleteStatus,
              testEndTime: row.testEndTime,
              initialTestStatus: row.initialTestStatus,
              initialTestTime: row.initialTestTime,
              testRunStartTime: row.testRunStartTime,
              testRunEndTime: row.testRunEndTime,
              complianceEvaluationPlanCompleteTime:
                row.complianceEvaluationPlanCompleteTime,
              complianceEvaluationStatus: row.complianceEvaluationStatus,
              complianceEvaluationCompleteTime:
                row.complianceEvaluationCompleteTime,
              finalInspectionStatus: row.finalInspectionStatus,
              finalInspectionCompleteTime: row.finalInspectionCompleteTime,
            };

            this.tableData.push(newRow);
          });
        } else {
          // 无标段
          let newRow = {
            contractName: row.section,
            lXStatus: row.lxstatus,
            lXEndTime: row.lxendTime,
            procurementStatus: row.procurementStatus,
            procurementEndTime: row.procurementEndTime,
            disclosePlanTime: row.disclosePlanTime,
            discloseStatus: row.discloseStatus,
            discloseEndTime: row.discloseEndTime,
            startPlanTime: row.startPlanTime,
            startStatus: row.startStatus,
            startEndTime: row.startEndTime,
            // developmentConstructionProgress: row.developmentConstructionProgress, // 开发建设进度
            developmentConstructionProgress: this.formatDevelopmentProgress(
              row.developmentConstructionProgress
            ),

            testPlanTime: row.testPlanTime,
            testCompleteStatus: row.testCompleteStatus,
            testEndTime: row.testEndTime,
            initialTestStatus: row.initialTestStatus,
            initialTestTime: row.initialTestTime,
            testRunStartTime: row.testRunStartTime,
            testRunEndTime: row.testRunEndTime,
            complianceEvaluationPlanCompleteTime:
              row.complianceEvaluationPlanCompleteTime,
            complianceEvaluationStatus: row.complianceEvaluationStatus,
            complianceEvaluationCompleteTime:
              row.complianceEvaluationCompleteTime,
            finalInspectionStatus: row.finalInspectionStatus,
            finalInspectionCompleteTime: row.finalInspectionCompleteTime,
          };

          this.tableData.push(newRow);
        }

        // this.tableData.push(newRow);
      }
      // if (row.projectLedgerVos && row.projectLedgerVos.length > 1) {
      //   if (
      //     Array.isArray(row.projectLedgerVos) &&
      //     row.projectLedgerVos.length > 1
      //   ) {
      //     // 清空tableData
      //     this.tableData = [];
      //     row.projectLedgerVos.forEach((item) => {
      //       const newRow = { ...row };

      //       (newRow.lXStatus = row.lxstatus), // 立项进展 完成状态
      //         (newRow.lXEndTime = row.lxendTime), // 立项进展 完成时间
      //         (newRow.contractName = item.contractName);

      //       // procurementStatus
      //       newRow.procurementStatus = item.procurementStatus; // 多标段采购进展 完成状态
      //       newRow.procurementEndTime = item.procurementEndTime; // 多标段采购进展 完成时间
      //       // 交底进展
      //       newRow.disclosePlanTime = item.disclosePlanTime; //多标段里交底进展 计划完成时间
      //       newRow.discloseStatus = item.discloseStatus; //多标段里交底进展 完成状态
      //       newRow.discloseEndTime = item.discloseEndTime; //多标段里交底进展 完成时间
      //       // 启动进展
      //       newRow.startPlanTime = item.startPlanTime; //多标段里启动时间
      //       newRow.startStatus = item.startStatus; //多标段里启动状态
      //       newRow.startEndTime = item.startEndTime; //多标段里启动时间
      //       newRow.developmentConstructionProgress =
      //         item.developmentConstructionProgress; //多标段里开发建设进度

      //       newRow.testPlanTime = item.testPlanTime; //多标段里上线试运行申请确认进展 计划完成时间
      //       newRow.testCompleteStatus = item.testCompleteStatus; //多标段里上线试运行申请确认进展 完成状态
      //       newRow.testEndTime = item.testEndTime; //多标段里上线试运行申请确认进展 完成时间
      //       newRow.initialTestStatus = item.initialTestStatus; //多标段里初验状态
      //       newRow.initialTestTime = item.initialTestTime; //多标段里初验时间
      //       newRow.testRunStartTime = item.testRunStartTime; //多标段里试运行开始时间

      //       newRow.testRunEndTime = item.testRunEndTime; //多标段里试运行结束时间
      //       // complianceEvaluationPlanCompleteTime
      //       newRow.complianceEvaluationPlanCompleteTime =
      //         item.complianceEvaluationPlanCompleteTime; //多标段里符合性评价进展 计划完成时间
      //       newRow.complianceEvaluationStatus = item.complianceEvaluationStatus; //多标段里符合性评价进展 完成状态
      //       newRow.complianceEvaluationCompleteTime =
      //         item.complianceEvaluationCompleteTime; //多标段里符合性评价进展 完成时间
      //       newRow.finalInspectionStatus = item.finalInspectionStatus; //多标段里终验状态
      //       newRow.finalInspectionCompleteTime =
      //         item.finalInspectionCompleteTime; //多标段里终验时间
      //       newRow.sectionCount = item.sectionCount; //多标段里标段数
      //       this.tableData.push(newRow);
      //     });
      //   }
      // } else {
      //   // 处理只有一个标段的情况
      //   this.tableData.push({
      //     contractName: row.section, //单标段合同名称
      //     lXStatus: row.lxstatus, // 立项进展 完成状态
      //     lXEndTime: row.lxendTime, // 立项进展 完成时间
      //     procurementStatus: row.procurementStatus, // 采购进展 完成状态
      //     procurementEndTime: row.procurementEndTime, // 采购进展 完成时间
      //     disclosePlanTime: row.disclosePlanTime, // 交底进展 计划完成时间
      //     discloseStatus: row.discloseStatus, // 交底进展 完成状态
      //     discloseEndTime: row.discloseEndTime, // 交底进展 完成时间
      //     startPlanTime: row.startPlanTime, // 启动进展 计划完成时间
      //     startStatus: row.startStatus, // 启动进展 启动状态
      //     startEndTime: row.startEndTime, // 启动进展 完成时间
      //     // developmentConstructionProgress: row.developmentConstructionProgress, // 开发建设进度
      //     developmentConstructionProgress: this.formatDevelopmentProgress(
      //       row.developmentConstructionProgress
      //     ),
      //     testPlanTime: row.testPlanTime, // 上线试运行申请确认进展 计划完成时间
      //     testCompleteStatus: row.testCompleteStatus, // 上线试运行申请确认进展 完成状态
      //     testEndTime: row.testEndTime, // 上线试运行申请确认进展 完成时间
      //     initialTestStatus: row.initialTestStatus, // 初验进展 完成状态
      //     initialTestTime: row.initialTestTime, // 初验进展 完成时间
      //     testRunStartTime: row.testRunStartTime, // 试运行进展 开始时间
      //     testRunEndTime: row.testRunEndTime, // 试运行进展 结束时间
      //     complianceEvaluationPlanCompleteTime:
      //       row.complianceEvaluationPlanCompleteTime, // 符合性评价进展 计划完成时间
      //     complianceEvaluationStatus: row.complianceEvaluationStatus, // 符合性评价进展 完成状态
      //     complianceEvaluationCompleteTime:
      //       row.complianceEvaluationCompleteTime, // 符合性评价进展 完成时间
      //     finalInspectionStatus: row.finalInspectionStatus, // 终验进展 完成状态
      //     finalInspectionCompleteTime: row.finalInspectionCompleteTime, // 终验标段进展 完成时间
      //   });
      // }
      this.dialogTableVisible = true;
    },
    // 时间日期格式化去除时分秒
    timeValueFormatter(time) {
      return time == null ? "-" : time.length == 10 ? time : time.substr(0, 10);
    },
    init() {
      this.getTbHeader();
      this.getTbData();
      this.getUserByRoleCodes();
      // 查询项目负责人 方案经理 客户经理
    },
    // 查询项目负责人 方案经理 客户经理
    getUserByRoleCodes() {
      getUserByRoleCode({ roleCode: "XMFZR" }).then((res) => {
        console.log("当前拿到的角色---", res.data);
        res.data.forEach((item) => {
          this.search.enum.xmfzrList.push({
            label: String(item.fullname),
            value: item.jfid,
          });
        });
      });
      getUserByRoleCode({ roleCode: "FAJL" }).then((res) => {
        console.log("方案经理", res.data);
        res.data.forEach((item) => {
          this.search.enum.fajlList.push({
            label: String(item.fullname),
            value: item.jfid,
          });
        });
      });
      getUserByRoleCode({ roleCode: "KHJL" }).then((res) => {
        console.log("客户经理", res.data);
        res.data.forEach((item) => {
          this.search.enum.khjlList.push({
            label: String(item.fullname),
            value: item.jfid,
          });
        });
      });
    },

    getTbData() {
      this.isLoading = true;
      this.noData = false;
      this.table.data = [];
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
      };
      const searchForms = this.search.formData;
      Object.keys(searchForms).map((item) => {
        if (this.$utils.isEmpty(searchForms[item])) {
          param[item] = searchForms[item];
        }
      });
      queryProjectLists(param)
        .then((res) => {
          if (res.data?.total>0) {
            this.isLoading = false;
            // this.table.page.pages = res.data.pages;
            this.table.page.total = res.data.total;
            this.table.data = res.data.records;
            this.calculateTableHeight();
          } else {
            this.isLoading = false;
            this.noData = true;
            this.table.data = [];
          }
          api_getStatement(param).then((res) => {
            if (res.data !== null) {
              this.Statistics = res.data;
            } else {
              this.Statistics = {};
            }
          });
        })
        .catch(() => {
          this.isLoading = false;
          this.noData = true;
        });
    },
    sortChange(column) {
      this.search.formData["orderByColumn"] = column.prop;
      column.order === "descending"
        ? (this.search.formData["orderBy"] = "ASC")
        : (this.search.formData["orderBy"] = "DESC");
      // if (column.order === "ascending") {
      //   this.search.formData["orderByColumn"] = column.prop;
      //   this.search.formData["orderBy"] = "ASC";
      // } else if (column.order === "descending") {
      //   this.search.formData["orderByColumn"] = column.prop;
      //   this.search.formData["orderBy"] = "DESC";
      // } else {
      //   this.search.formData["orderByColumn"] = "";
      //   this.search.formData["orderBy"] = "";
      // }
      this.getTbData();
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_006",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M005_006" }).then((res) => {
        console.log(res, "getTbHeader里面的res");
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        // this.table.tableConfig.header = headerData.filter((item) => {
        //   return item.isShow;
        // });
        this.table.tableConfig.header = headerData.filter((item) => {
          // console.log(item.prop, item.label, "aaaaaaaaaaaaaaa");
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "beginDate") {
            item.sortable = "custom";
            // 上下翻转箭头
            item.width = "110px";
          }
          if (item.prop == "totalInvestmentAmount") {
            item.sortable = "custom";
            item.width = "160px";
          }
          if (item.prop == "systemName") {
            // item.width = "160px";
          }
          //  是否成立专班
          if (item.prop == "isSpecializedClass") {
            item.width = "75px";
          }
          //  委托编制框架方案
          if (item.prop == "entrustingScheme") {
            item.width = "85px";
          }
          //  框架技术方案进展
          if (item.prop == "frameworkTechnologyProgress") {
            item.width = "85px";
          }
          //  试运行
          if (item.prop == "testRun") {
            // item.width = "85px";
          }
          return item.isShow;
        });
      });
    },
    workView(val) {
      this.$router.push({
        name: "issueView",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },

    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    handleSelect(val) {
      if (val.id) {
        this.$router.push({
          name: `${
            this.theNew == "风险" ? "everydayriskAdd" : "everydaytroubleAdd"
          }`,
          query: { projectId: val.id, routeName: this.$route.name },
        });
      }
    },
    // 导出
    exprotByCondition() {
      console.log("导出");
      console.log(
        "this.formData, this.page.pageNum, this.page.pageSize",
        this.table.page.pageNum
      );
      (this.search.formData.pageNum = this.table.page.pageNum),
        (this.search.formData.pageSize = this.table.page.pageSize);

      exportByIds(this.search.formData).then((res) => {
        console.log(res);
        // 创建a标签，并处理二进制数据
        const link = document.createElement("a");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        const pat = new RegExp("filename=([^;]+\\.[^\\.;]+)"); // 设置下载文件名称
        let contentDisposition;
        if (res.headers["content-disposition"])
          contentDisposition = res.headers["content-disposition"];
        if (res.headers["Content-Disposition"])
          contentDisposition = res.headers["Content-Disposition"];
        const result = pat.exec(contentDisposition);
        let fileName = result && result[1]; // 生成下载链接
        const URL = window.URL || window.webkitURL;
        console.log(blob, URL);
        link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
        fileName = "项目台账";
        link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
        document.body.appendChild(link);
        link.click(); // 释放URL对象
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.allTotal {
  // margin-top: -23px;
  color: #0176ff;
  max-width: 100%;
  overflow: hidden;
  /*内容超出后隐藏*/
  text-overflow: ellipsis;
  /*超出内容显示为省略号*/
  white-space: nowrap;
  /*文本不进行换行*/
}

.sr_list {
  width: 95%;
  overflow: hidden;
  /*内容超出后隐藏*/
  text-overflow: ellipsis;
  /*超出内容显示为省略号*/
  white-space: nowrap;
  /*文本不进行换行*/
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

::v-deep .el-table__fixed {
  height: 97% !important;
}

.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}

.common-card {
  height: 100%;
}

::v-deep .el-table__empty-block {
  width: auto !important;
}

.total-page {
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }

  ::v-deep .rowImgDiv {
    display: flex;
    justify-content: center;

    .colSpan {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .iconImg {
        width: 14px;
        height: 14px;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
  }
}

::v-deep .sr_table_bottom {
  line-height: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between !important;
  // justify-content: space-between;
}

::v-deep .pagination {
  // padding-right: 2100px;
}

:deep(.ledgerclass) {
  min-width: 180px !important;
}

@media screen and (max-width: 1280px) {
  :deep(.ledgerclass) {
    width: 120px !important;
  }

  :deep(.search-config) {
    width: 120% !important;
  }
}

@media screen and (min-width: 1280px) and (max-width: 1680px) {
  :deep(.ledgerclass) {
    width: 180px !important;
  }

  :deep(.search-config) {
    width: 120% !important;
  }
}

:deep(.search-config) {
  width: 120% !important;
}

.sr_count {
  position: absolute;
  top: 0;
  right: 0;
  // display: flex;
  text-align: center;
  width: 53px;
  height: 24px;
  color: rgb(211, 59, 59);
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  border-radius: 50px !important;
  border: 1px solid rgb(219, 81, 81);
}

.designation {
  color: #0176ff;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
}

.progressOf {
  color: #0176ff;
  font-size: 14px;
  cursor: pointer;
  float: right;
}

.red-background {
  background-color: red !important;
  /* 设置背景颜色为红色 */
  color: red !important;
  /* 设置文字颜色为白色 */
}

.scroll-container {
  overflow-y: auto;
  /* 启用垂直滚动条 */
}

.scroll-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  /* 滚动条轨道背景色 */
  border-radius: 4px;
  /* 滚动条轨道圆角 */
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  /* 滚动条滑块颜色 */
  border-radius: 4px;
  /* 滚动条滑块圆角 */
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* 滚动条滑块悬停时的颜色 */
}

/* 针对 Firefox 浏览器 */
.scroll-container {
  // scrollbar-width: thin; /* 设置滚动条宽度为细 */
  // scrollbar-color: #888 #f5f5f5; /* 设置滚动条滑块颜色和轨道颜色 */
  scrollbar-color: #888 #f5f5f5;
  /* 设置滚动条滑块颜色和轨道颜色 */
}
</style>
