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
            @clear="clearSystemName"
            clearable
            v-model="search.formData.systemName"
            placeholder="系统名称"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            @clear="clearProjectName"
            clearable
            v-model="search.formData.projectName"
            placeholder="项目名称"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.contactId"
            clearable
            placeholder="项目负责人"
            @clear="clearContactJfId"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.contactNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.jfid"
            clearable
            placeholder="周报填报人"
            @clear="clearJfId"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.weeklyReport"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="search.formData.years"
            :clearable="false"
            type="year"
            placeholder="选择年度"
            @change="yearChange"
            :picker-options="expireTimeOPtionTwo"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.yearPlanId"
            clearable
            placeholder="所属年度计划"
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
      <div class="other-btns">
        <el-button size="small" @click="exprotByCondition">导出</el-button>
        <el-button size="small" @click="allExport">全部导出</el-button>
      </div>
    </div>
    <CustomLoading :visible="isLoading" />
    <SrTable
      :noData="noData"
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
      @select="selectable"
      @select-all="selectAll"
      @selection-change="selectionChange"
      :status="selectStatus"
      ref="selectTable"
      :extra-tooltip-labels="['项目负责人', '填报人']"
    >
      <template slot="systemName" slot-scope="{ scope }">
        <div
          v-if="scope.row.isDuobiaoduan == 1 && scope.row.contractName"
          style="text-align: center; line-height: 49px"
        >
          <span class="systemNameContract"
            >标段{{ scope.row.sectionSort }}</span
          >
        </div>

        <span v-else>
          <span class="sr_list">
            {{ scope.row.systemName }}
          </span>
        </span>
      </template>

      <template slot="projectName" slot-scope="{ scope }">
        <span v-if="scope.row.projectName">
          <span class="sr_list">
            {{ scope.row.projectName }}
          </span>
        </span>
        <span v-else>-</span>
      </template>

      <template slot="contractName" slot-scope="{ scope }">
        <span v-if="scope.row.contractName">
          <span class="sr_list">
            {{ scope.row.contractName }}
          </span>
        </span>
        <span v-else>-</span>
      </template>

      <!-- 周报状态 -->
      <template slot="isStartWeeklyReport" slot-scope="{ scope }">
        <div
          v-if="scope.row.contractName || scope.row.isDuobiaoduan == 0"
          style="display: flex; justify-content: center; align-items: center"
        >
          <img
            v-if="scope.row.isStartWeeklyReport == 1"
            width="25px"
            height="25px"
            :src="reportClose"
            alt=""
          />
          <img
            v-if="[null, 0].includes(scope.row.isStartWeeklyReport)"
            width="25px"
            height="25px"
            :src="reportOpen"
            alt=""
          />
        </div>
      </template>

      <template slot="reporter" slot-scope="{ scope }">
        <span v-if="scope.row.reporter">
          {{ scope.row.reporter }}
        </span>
        <span v-else-if="scope.row.weeklyPerson">
          {{ scope.row.weeklyPerson }}
        </span>
        <span v-else> - </span>
        <!-- <span v-if="scope.row.contractName">
          <div class="systemNameContract">标段{{ scope.row.num }}</div>
          {{ scope.row.systemName }}
        </span>
        <span v-else>{{ scope.row.systemName }}</span> -->
      </template>
    </SrTable>
    <!-- 周边记录弹框组件 -->
    <ReportRecord
      v-if="ContractIdNum || ProjectIdNum"
      :visiable="reportRecordVisiable"
      :ContractIdNum="ContractIdNum"
      :ProjectIdNum="ProjectIdNum"
      :projectId="projectId"
      :from="from"
      :title="title"
      :typeDelete="typeDelete"
      :isDuobiaoduan="isDuobiaoduan"
      :contractId="contractId"
      :isExamine="isExamine"
      :lotsNumber="lotsNumber"
      @close="reportRecordClose"
      ref="reportRecordRef"
    >
    </ReportRecord>
    <el-dialog
      title="导入"
      :visible.sync="centerDialogVisible"
      width="650px"
      center
    >
      <div style="display: flex; align-items: center">
        <div>文件导入：</div>
        <el-upload
          class="upload-demo"
          action="string"
          :http-request="uploadFile"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <div class="button">+</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-link
          href="/plan/xls/规划中导入重点任务模板.xlsx"
          download="重点任务清单模版"
          class="el-icon-download"
          type="primary"
        >
          模板下载
        </el-link>
        <div>
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveJfw">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年06月16日 15:34:49
  版本：v1.0
-->
<script>
import store from "@/store";
import yearPlanManager from "@/utils/yearPlanUtils";
import {
  queryRemove,
  api_fileAway,
  getBuPropertyWithNodeInfo,
  exprotByCondition,
  importProject,
} from "@/api/planProject";
import { queryBizunitsByProperty } from "@/api/index.js";
import {
  api_userSetQuery,
  api_userSetSave,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";
import config from "@/settings.js";
import {
  api_getProjectList,
  getUserByRoleCode,
  filterData,
  exportByIds,
  getContractListByProjectId,
  useReport,
} from "@/api/report";
// import Table from "@/components/table";
import upload from "@/utils/upload";
// 标签弹框
import ReportRecord from "../component/reportRecord.vue";
import reportOpen from "@/assets/reportOpen.png";
import reportClose from "@/assets/reportClose.png";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
export default {
  name: "reportList",
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
  computed: {
    id() {
      return this.$route ? this.$route.query.id : "";
    },
    systemName() {
      return this.$route ? this.$route.query.systemName : "";
    },
    projectName() {
      return this.$route ? this.$route.query.projectName : "";
    },
    isDuobiaoduan() {
      return this.$route ? this.$route.query.isDuobiaoduan : "";
    },
    pid() {
      return this.$route ? this.$route.query.projectId : "";
    },
    cid() {
      return this.$route ? this.$route.query.contractId : "";
    },
    pageNum() {
      return this.$route ? this.$route.query.pageNum : "";
    },
    expireTimeOPtionTwo() {
      return {
        disabledDate(time) {
          let isDis = time.getFullYear();
          if (isDis < 2024) {
            return true;
          }
        },
      };
    },
  },
  props: {
    isSpanActive: String,
  },
  components: {
    // Table,
    ReportRecord,
  },
  watch: {
    // $route
    "search.formData.status": {
      handler(v) {
        this.getTbData();
      },
    },
  },
  data() {
    return {
      tableHeight: 0,
      ContractIdNum: "",
      ProjectIdNum: "",
      isLoading: false, //加载中
      noData: false, //无数据
      reportOpen,
      reportClose,
      from: "list",
      typeDelete: "",
      boxHeight: "",
      centerDialogVisible: false,
      babaData: "",
      taskName: "",
      selectStatus: [201, 4], //部分多选框需要禁用的状态 已分配
      pilId: [], //批量分配项目id
      testData: [],
      value: "",
      danger: require("@/assets/danger.png"),
      supplementRow: {},
      activeRow: {},
      menuTypeObject: {
        menuType: "4001001",
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
        updateFileCode: "M002_003_007",
        //删除code
        deleteCode: "M002_003_008",
        //停止上传code
        stopUploadingCode: "M002_003_009",
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
      userInfo: store.getters.userInfo,
      search: {
        // nosearch: true,
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "系统名称",
            bind: "systemName", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            placeholder: "项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "项目负责人",
            bind: "contactId", //contactName;
            data: "contactNameList",
            class: "project_manager",
            isHave: true,
          },
          {
            type: "select",
            placeholder: "周报填报人",
            bind: "jfid", //contactName;
            data: "weeklyReport",
            class: "project_manager",
          },
        ],
        enum: {
          // 搜索项下拉数据
          contactNameList: [],
          weeklyReport: [],
          yearPlanList: [],
        },
        btns: [
          // {
          //   name: "导入",
          //   click: this.import,
          //   type: "default",
          //   // permissionCode: 'M0722_001_001',
          // },
          {
            name: "导出",
            click: this.exprotByCondition,
            type: "default",
            permissionCode: "M0722_001_002",
          },
          {
            name: "全部导出",
            click: this.allExport,
            permissionCode: "M004_020_98",
          },
          // { name: "批量导入", click: this.bulkImport, permissionCode: "M002_003_003" },
        ],
        formData: {
          systemName: "", //系统名称
          projectName: "", //项目名称
          contactId: "", //项目负责人
          jfid: "", //周报填报人
          year: this.getNowTime(),
          years: new Date(),
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
          yearPlanId: "", //年度计划
        },
        autoCompleteList: [],
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          maxHeight: 0,
          height:0,
          load: this.load,
          tooltipEffect: "light",
          header: [],
          cellClassName: this.cellClassNameFn,
          indexConfig: {
            display: false, //不展示序号
          },
          selectionConfig: {
            display: true,
            width: "40",
            // selectable: this.selectable,
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
              name: "周报记录", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "reportRecord", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate2,
            },
            {
              name: "填报", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "add", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "启动", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "startUse", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "停止", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "stopUse", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "删除草稿", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "deletedraft", // 点击执行该页面methods中对应的方法
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
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      xmDetail: [],
      projectId: "",
      reportRecordVisiable: false,
      // 标题
      title: {
        systemName: "",
        projectName: "",
      },
      isDuobiaoduan: this.$route.query.isDuobiaoduan
        ? this.$route.query.isDuobiaoduan
        : false, //用于判断周报记录里是否能编辑与审核
      contractId: "", //用于查询接口区分以及审核按钮
      // sectionSort: "",
      isExamine: null,
      lotsNumber: null,

      contactSPId: "",
      selectArr: [],
      // 周报
      useProjectParams: {
        flag: "",
        projectId: "",
      },
      // 标段周报
      useContractParams: {
        contractId: "",
        flag: "",
        projectId: "",
      },
      treeNodeMap: new Map(),
      pid: "", // 父节点id
      oldProjectId: "",
    };
  },
  created() {
    this.search.enum.yearPlanList = yearPlanManager.yearPlanList;
    // 获取项目负责人枚举
    this.getUserCount("XMFZR");
    this.getWeekPerson();
  },
  mounted() {
    let fromRouter = sessionStorage.getItem("FROMROUTER");

    this.getTbData();
    this.getTbHeader();
    if (this.$route.fullPath !== "/reportList" && fromRouter != "/") {
      this.title.systemName = this.systemName;
      this.title.projectName = this.projectName;
      this.reportRecordVisiable = true;

      this.title.systemName = sessionStorage.getItem("systemName");
      this.title.projectName = sessionStorage.getItem("projectName");
      if (this.$route.query.ContractIdNum) {
        //多标段
        this.projectId = "";
        this.contractId = this.$route.query.contractId;
        this.ContractIdNum = "合同";
      } else {
        //单标段
        this.contractId = "";
        this.projectId = this.$route.query.projectId;
        this.ProjectIdNum = "项目";
      }
    }
    sessionStorage.setItem("year", this.getNowTime());
    // contractId
  },
  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      this.$set(
        this.table.tableConfig,
        "height",
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
    clearSystemName() {
      sessionStorage.removeItem("searchData");
    },
    clearProjectName() {
      sessionStorage.removeItem("searchData");
    },
    clearContactJfId() {
      sessionStorage.removeItem("searchData");
    },
    clearJfId() {
      sessionStorage.removeItem("searchData");
    },

    resetForm() {
      this.search.formData.jfid = "";
      this.search.formData.yearPlanId = "";
      this.search.formData.contactId = "";
      this.search.formData.projectName = "";
      this.search.formData.systemName = "";
      this.search.formData.year = this.getNowTime();
      this.search.formData.years = new Date();
      if (sessionStorage.getItem("year")) {
        sessionStorage.setItem("year", this.getNowTime());
      }
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      sessionStorage.removeItem("searchData");
      this.getTbData();
    },
    searchFn() {
      this.table.page.pageNum = 1;
      this.getTbData("seek");
    },
    cellClassNameFn(row) {
      if (row.row.isDuobiaoduan == 1) {
        if (row.columnIndex == 0 && row.row.hasChildren) {
          //通过自定义样式隐藏复选框
          return "table-column-hidden";
        }
      }
    },
    btnValidate2(row, item) {
      // let { jfid } = this.userInfo;
      if (
        // XMGLB DSZ ZJL BM_FZR
        this.userInfo.currentRole.roleCode == "BM_FZR" ||
        this.userInfo.currentRole.roleCode == "XMGLB" ||
        this.userInfo.currentRole.roleCode == "FZGHC_JBRBF" ||
        this.userInfo.currentRole.roleCode == "XMFZR" ||
        this.userInfo.currentRole.roleCode == "DSZ" ||
        this.userInfo.currentRole.roleCode == "F_ZJL" ||
        this.userInfo.currentRole.roleCode == "ZJL" ||
        this.userInfo.currentRole.roleCode == "KHJL" ||
        this.userInfo.currentRole.roleCode == "FAJL" ||
        this.userInfo.currentRole.roleCode == "JLGCS" ||
        this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
        this.userInfo.currentRole.roleCode == "PSXZ_CY" ||
        this.userInfo.currentRole.roleCode == "CGJL"
      ) {
        // if (item.weeklyPersonId == jfid && !item.hasChildren) {
        return true;
        // } else {
        //   return false;
        // }
      }
      if (
        row.name == "启动" &&
        (item.isStartWeeklyReport == null || item.isStartWeeklyReport == 0)
      ) {
        //
        if (
          this.userInfo.currentRole.roleCode == "XMFZR" ||
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
        ) {
          return true;
        }
      }
      //
      if (row.name == "停止" && item.isStartWeeklyReport == 1) {
        if (
          this.userInfo.currentRole.roleCode == "XMFZR" ||
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
        ) {
          return true;
        }
      }
    },
    // 获取项目负责人枚举
    getUserCount(roleCode) {
      getUserByRoleCode({ roleCode }).then((res) => {
        res.data.map((item) => {
          if (item.fullname) {
            this.search.enum.contactNameList.push({
              label: String(item.fullname),
              value: String(item.jfid),
            });
          }
        });
      });
    },
    // 获取周报填报人
    getWeekPerson() {
      filterData().then((res) => {
        res.data.map((item) => {
          if (item.name) {
            this.search.enum.weeklyReport.push({
              label: String(item.name),
              value: String(item.jfId),
            });
          }
        });
      });
    },
    //没有周报记录的复选框禁用掉
    // selectable(row, index) {
    //   if (row.reportId) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    /*    getStatementA() {
      getStatement({ isConcern: this.isConcern }).then((res) => {
        this.systemNum = res.data.systemNum;
        this.projectNum = res.data.projectNum;
        this.activateNum = res.data.activateNum;
        this.optionPhaseNum = res.data.optionPhaseNum;
        this.projectApprovalNum = res.data.projectApprovalNum;
        this.implIngNum = res.data.implIngNum;
        this.trialRunNum = res.data.trialRunNum;
        this.onlineNum = res.data.onlineNum;
      });
    }, */
    // tab切换
    tabChange(val) {
      if (val > 0) {
        this.isConcern = 1;
        this.selectType = 1;
        this.btnname = "取消关注";

        this.titleVal = 1;
      } else {
        this.isConcern = 0;
        this.selectType = 0;
        this.btnname = "关注";

        this.titleVal = 0;
      }
      this.tab_active = val;
      this.getTbData();
      this.getStatementA();
    },
    stopUploading(obj) {
      let { id, fileInstanceId } = this.supplementRow;
      let str = JSON.parse(fileInstanceId);
      str[0].is_stop = 1;
      let params = {
        id,
        fileInstanceId: JSON.stringify(str),
      };
      if (obj) {
        params.instanceId = obj[0]?.instanceId;
        params.id = this.activeRow.id;
      }
      api_fileAway(params).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "停止成功",
          });
          this.stopUploadingFlag = false;
          this.getTbData();
        }
      });
    },
    allExport() {
      this.isLoading = true;
      let allFileList = [];
      let param = {
        pageNo: this.table.page.pageNum,
        pageSize: 100,
        projectName: "",
        systemName: "",
        orderByColumn: "",
        orderBy: "",
        contactId: "",
        jfid: "",
        yearPlanId: "",
        // 年份 year
        year: this.search.formData.year,
      };
      api_getProjectList(param)
        .then((res) => {
          if (res.data.records.length > 0) {
            res.data.records.map((item) => {
              allFileList.push({
                reportId: "",
                id: item.id || "",
                contractId: item.htId || "",
                isDuobiaoduan: item.isDuobiaoduan ?? "",
                type: 1,
              });
            });
            exportByIds(allFileList).then((res) => {
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
              link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
              fileName = "项目周报";
              link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
              document.body.appendChild(link);
              link.click(); // 释放URL对象
              window.URL.revokeObjectURL(link.href);
              document.body.removeChild(link);
              this.$message({
                type: "success",
                message: "导出成功",
              });
              this.isLoading = false;
            });
          } else {
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$message({
            type: "error",
            message: "导出失败",
          });
        });
    },
    // 上传报告
    supplement(row) {
      if (!row.fileInstanceId && !JSON.parse(row.fileInstanceId).length) {
        return;
      }
      this.supplementRow = row;
      let fileInstance = JSON.parse(row.fileInstanceId)[0];
      this.stopUploadingFlag = true;
      this.activeRow = row;
      if (fileInstance.is_stop) {
        this.stopUploadingFlag = false;
      }
      this.menuTypeObject.projectId = row.projectId;
      this.menuTypeObject.objectId = row.id;
      this.tableDataList = [
        {
          //列表名称
          fileName: "上传附件",
          //按钮名称
          uploadReportName: "上传附件",
          //列表数据
          dataList: [],
          uploadReportName: "上传附件",
          //实例id
          instanceId: fileInstance.file_currency,
        },
      ];
      this.$refs.supplementBox.init();
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此项目, 是否继续?",
        okFun: () => {
          queryRemove({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNum = this.table.page.pageNum - 1;
              }
              this.getTbData();
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
    export() {
      // api_userSetExport({permissionCode:'M002_001',access_token:sessionStorage.getItem('token')}).then((res) => {
      // });
      window.open(
        `${
          config.baseUrl
        }/jfzg/planProject/project/export?permissionCode=M002_003&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    // 导入
    beforeAvatarUpload(file) {
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isXLS = testmsg.toUpperCase() == "XLS";
      const isXLSX = testmsg.toUpperCase() == "XLSX";
      const isSize = file.size / 1024 / 1024 < 20;
      if (!isXLS && !isXLSX) {
        this.$message.warning("上传文件只能是xls、xlsx格式!");
        return false;
      }
      if (!isSize) {
        this.$message.warning("上传文件大小不能超过20MB!");
        return false;
      }
    },
    uploadFile(params) {
      let fd = new FormData();
      fd.append("file", params.file);
      importProject(fd).then((res) => {
        if (res.msg.code == "0000") {
          if (res.msg.message == "SUCCESS") {
            // this.getProjectList();
            this.getData();
            this.$message({
              type: "success",
              message: "导入成功",
            });
          } else {
            this.$message({
              type: "warning",
              message: res.msg.message,
            });
          }
        }
      });
    },
    // 导出
    exprotByCondition() {
      if (this.pilId.length < 1) {
        return this.$message("请至少勾选一条作为导出的表");
      }

      exportByIds(this.pilId).then((res) => {
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
        link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
        fileName = "项目周报";
        link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
        document.body.appendChild(link);
        link.click(); // 释放URL对象
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
    btnValidate(row, item) {
      let { jfid } = this.userInfo;
      if (
        row.name == "填报" &&
        (item.isStartWeeklyReport == null || item.isStartWeeklyReport == 0) &&
        item.weeklyPersonId == jfid &&
        item.isDuobiaoduan != 1
      ) {
        // XMGLB DSZ ZJL BM_FZR 同时项目管理部 董事长 总经理 副总经理不可填报
        if (
          this.userInfo.currentRole.roleCode == "BM_FZR" ||
          this.userInfo.currentRole.roleCode == "XMGLB" ||
          this.userInfo.currentRole.roleCode == "DSZ" ||
          this.userInfo.currentRole.roleCode == "ZJL"
        ) {
          return false;
        } else {
          return true;
        }
      }
      if (
        row.name == "启动" &&
        item.isDuobiaoduan != 1 &&
        item.isStartWeeklyReport == 1
      ) {
        //
        if (
          this.userInfo.currentRole.roleCode == "XMFZR" ||
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
        ) {
          return true;
        }
      }
      //
      if (
        row.name == "停止" &&
        item.isDuobiaoduan != 1 &&
        (item.isStartWeeklyReport == null || item.isStartWeeklyReport == 0)
      ) {
        if (
          this.userInfo.currentRole.roleCode == "XMFZR" ||
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
        ) {
          return true;
        }
      }
    },
    // 周报 启动停止
    startUse(row) {
      this.useProjectParams.flag = 0;
      this.useProjectParams.projectId = row.id;
      useReport(this.useProjectParams).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "启动周报成功",
          });
        }
        this.getTbData();
      });
    },
    stopUse(row) {
      this.useProjectParams.flag = 1;
      this.useProjectParams.projectId = row.id;
      useReport(this.useProjectParams).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "停止周报成功",
          });
        }
        this.getTbData();
      });
    },
    // 多标段周报 启动停止
    startContractUse(row) {
      this.useContractParams.flag = 0;
      this.useContractParams.projectId = row.projectId;
      this.useContractParams.contractId = row.id;
      useReport(this.useContractParams).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "启动周报成功",
          });
        }
        const node = this.treeNodeMap.get(this.pid);
        // 获取需要刷新节点
        const { tree, treeNode, resolve } = node;
        this.load(tree, treeNode, resolve);
        this.$nextTick(() => {
          this.$refs.reportRecordRef.getReportByContractId(row.id);
        });
      });
    },
    stopContractUse(row) {
      this.useContractParams.flag = 1;
      this.useContractParams.projectId = row.projectId;
      this.useContractParams.contractId = row.id;
      useReport(this.useContractParams).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "停止周报成功",
          });
        }
        const node = this.treeNodeMap.get(this.pid);
        // 获取需要刷新节点
        const { tree, treeNode, resolve } = node;
        this.load(tree, treeNode, resolve);
        // 周报记录隐藏按钮
        this.$nextTick(() => {
          this.$refs.reportRecordRef.getReportByContractId(row.id);
        });
      });
    },
    getBizunitsByProperty() {
      queryBizunitsByProperty({ buPropertyEnum: "JSDW" }).then((res) => {
        let list = [];
        if (res.success) {
          if (res.data && res.data.length > 0) {
            res.data.map((item) => {
              list.push({
                value: item.buName,
              });
            });
          }
          this.$set(this.search, "autoCompleteList", list);
        }
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
    // 懒加载 获取子节点
    load(tree, treeNode, resolve) {
      this.pid = tree.id;
      this.treeNodeMap.set(tree.id, { tree, treeNode, resolve });
      let param = {
        pageNo: 1,
        pageSize: 9999,
        id: tree.id,
        projectName: tree.projectName,
        systemName: tree.systemName,
        // 年份 year
        year: this.search.formData.year,
      };
      getContractListByProjectId(param).then((res) => {
        if (res.msg.code == "0000") {
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;

          let arr = res.data.sort(function (a, b) {
            return a.id - b.id;
          });
          let list = res.data.map((item, index) => {
            // delete children
            // debugger;
            if (
              item.weeklyPersonId == jfid &&
              (item.isStartWeeklyReport == null ||
                item.isStartWeeklyReport == 0)
            ) {
              item.btns = [
                {
                  name: "周报记录", // 按钮名称，优先显示icon
                  type: "text",
                  size: "small",
                  method: "contractReportRecord", // 点击执行该页面methods中对应的方法
                  // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
                  // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
                  icon: "iconbianji", // 按钮显示的图标,不传显示中文
                  // code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
                  // validate: this.btnValidate2,
                },
                {
                  name: "填报", // 按钮名称，优先显示icon
                  type: "text",
                  size: "small",
                  method: "addContractReport", // 点击执行该页面methods中对应的方法
                  // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
                  // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
                  icon: "iconbianji", // 按钮显示的图标,不传显示中文
                  // code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
                  // validate: this.btnValidate
                },
              ];
            } else {
              item.btns = [
                {
                  name: "周报记录", // 按钮名称，优先显示icon
                  type: "text",
                  size: "small",
                  method: "contractReportRecord", // 点击执行该页面methods中对应的方法
                  // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
                  // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
                  icon: "iconbianji", // 按钮显示的图标,不传显示中文
                  // code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
                  // validate: this.btnValidate2,
                },
              ];
            }
            if (
              this.userInfo.currentRole.roleCode == "XMFZR" ||
              this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
            ) {
              if (
                item.isStartWeeklyReport == null ||
                item.isStartWeeklyReport == 0
              ) {
                item.btns.push({
                  name: "停止", // 按钮名称，优先显示icon
                  type: "text",
                  size: "small",
                  method: "stopContractUse", // 点击执行该页面methods中对应的方法
                  icon: "iconbianji", // 按钮显示的图标,不传显示中文
                });
              } else {
                item.btns.push({
                  name: "启动", // 按钮名称，优先显示icon
                  type: "text",
                  size: "small",
                  method: "startContractUse", // 点击执行该页面methods中对应的方法
                  icon: "iconbianji", // 按钮显示的图标,不传显示中文
                });
              }
            }
            item.num = index + 1;
            return item;
          });

          this.table.data.forEach((item) => {
            if (item.isDuobiaoduan) {
              item.childrens = [];
              item.childrens.push(...list);
            }
          });
          resolve(list);
        }
      });
    },
    getNowTime() {
      var date = new Date();

      var year = date.getFullYear();
      var currentdate = year;

      return currentdate;
    },
    getTbData(seek) {
      console.log(seek, "seekseek");
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
        if (JSON.parse(sessionStorage.getItem("searchData")).contactId !== "") {
          this.search.formData.contactId = JSON.parse(
            sessionStorage.getItem("searchData")
          ).contactId;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).jfid !== "") {
          this.search.formData.jfid = JSON.parse(
            sessionStorage.getItem("searchData")
          ).jfid;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).year !== "") {
          this.search.formData.year = JSON.parse(
            sessionStorage.getItem("searchData")
          ).year;
        }
        if (seek != "seek")
          if (
            JSON.parse(sessionStorage.getItem("searchData")).pageNum !== null
          ) {
            this.table.page.pageNum = JSON.parse(
              sessionStorage.getItem("searchData")
            ).pageNum;
          }
      }
      let param = {
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      api_getProjectList(param)
        .then((res) => {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          this.calculateTableHeight();
          if (res.data.records.length > 0) {
            this.isLoading = false;
            res.data.records.forEach((item) => {
              // 暂时注释多标段相关代码
              item.hasChildren = item.isDuobiaoduan == 1 ? true : false;
              // item.hasChildren= true

              if (item.todo) {
                item.operationBtns = [];
                if (item.assignee == jfid) {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      item1.operationBtns &&
                        item.operationBtns.push(item1.operationBtns[0]);
                    });
                  item.path = this.workView;
                } else {
                  // 处理初审撤回
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (roleCode == item1.role) {
                        if (item1.operationBtns) {
                          if (
                            item1.operationBtns[0].btnName == "撤回" &&
                            jfid == item.creator
                          ) {
                            item.operationBtns.push(item1.operationBtns[0]);
                          } else if (item1.operationBtns[0].btnName != "撤回") {
                            item.operationBtns.push(item1.operationBtns[0]);
                          }
                        }
                      }
                    });
                }
              }
            });
            this.table.data = res.data.records;
          } else {
            this.table.data = [];
            this.isLoading = false;
            this.noData = true;
          }
          // let { buProperty } = this.userInfo.currentBizunit;
          // let { roleCode } = this.userInfo.currentRole;
          // let { jfid } = this.userInfo;
        })
        .catch(() => {
          this.isLoading = false;
          this.noData = true;
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
      this.getTbData();
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M005_007" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (["systemName"].includes(item.prop)) {
            // item.width = "114px";
            item.slotName = "systemName";
          }
          if (["contractName"].includes(item.prop)) {
            // item.width = "114px";
            item.slotName = "contractName";
          }
          if (["reporter"].includes(item.prop)) {
            // item.width = "114px";
            item.slotName = "reporter";
          }
          return item.isShow;
        });
      });
    },
    // 周报记录
    reportRecord(row) {
      console.log(row, "项目层/无标段周报记录");

      console.log(row.hasChildren, "hasChildrenhasChildren");

      // isDuobiaoduan 1是多标段
      // isExamine 如果是多标段那么就取里面的值

      this.ContractIdNum = "";
      this.ProjectIdNum = "项目";
      console.log(row.isExamine, "row.isExamine;row.isExamine;");

      this.projectId = row.id;
      this.oldProjectId = row.id;
      this.contactSPId = row.contactId ? row.contactId : row.contactJfid;
      sessionStorage.setItem("contactSPId", this.contactSPId);
      sessionStorage.setItem("isDuobiaoduan", row.isDuobiaoduan);
      this.reportRecordVisiable = true;
      this.typeDelete = "0";
      sessionStorage.setItem("typeDelete", this.typeDelete);

      sessionStorage.setItem("systemName", row.systemName);
      sessionStorage.setItem("projectName", row.projectName);

      this.title.systemName = sessionStorage.getItem("systemName");
      this.title.projectName = sessionStorage.getItem("projectName");

      this.isDuobiaoduan = row.hasChildren;

      this.isExamine = row.isExamine;

      // 判断是否多标段
      this.lotsNumber = row.isDuobiaoduan;

      // this
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, contactId } = this.search.formData;
        if (systemName == "" && projectName == "" && contactId == "") {
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
        const { systemName, projectName, contactId } = this.search.formData;
        if (systemName !== "" || projectName !== "" || contactId !== "") {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      sessionStorage.setItem("tab2_project", JSON.stringify(this.projectId));
      //  this.projectId=row.id
    },
    // 合同周报记录
    contractReportRecord(row) {
      console.log("标段/合同层row", row);
      this.ProjectIdNum = "";
      this.ContractIdNum = "合同";
      this.contractId = row.id;
      sessionStorage.setItem("contractId", row.id);
      this.contactSPId = row.contactId ? row.contactId : row.contactJfid;
      this.reportRecordVisiable = true;
      this.title.systemName = row.systemName;
      this.title.projectName = row.projectName;
      this.isDuobiaoduan = row.hasChildren;
      this.typeDelete = "1";
      sessionStorage.setItem("typeDelete", this.typeDelete);
      // this.contractNames = row.contractName
      sessionStorage.setItem("contractName", row.contractName);
      sessionStorage.setItem("sectionSort", row.sectionSort);
      sessionStorage.setItem("contactSPId", this.contactSPId);
      // this.sectionSort = row.sectionSort;

      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, contactId } = this.search.formData;
        if (systemName == "" && projectName == "" && contactId == "") {
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
        const { systemName, projectName, contactId } = this.search.formData;
        if (systemName !== "" || projectName !== "" || contactId !== "") {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
    },
    reportRecordClose() {
      this.ProjectIdNum = "";
      this.ContractIdNum = "";
      this.projectId = "";
      this.contractId = "";
      this.reportRecordVisiable = false;
    },
    // 填报
    add(row) {
      // this.reportRecordVisiable = false;
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, contactId } = this.search.formData;
        if (systemName == "" && projectName == "" && contactId == "") {
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
        const { systemName, projectName, contactId } = this.search.formData;
        if (systemName !== "" || projectName !== "" || contactId !== "") {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "reportAdd",
        query: {
          projectId: row.id,
          // processId: row.processId,
          // templateId: row.templateId,
          isReadonly: true,
        },
      });
    },
    addContractReport(row) {
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, contactId } = this.search.formData;
        if (systemName == "" && projectName == "" && contactId == "") {
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
        const { systemName, projectName, contactId } = this.search.formData;
        if (systemName !== "" || projectName !== "" || contactId !== "") {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "reportAdd",
        query: {
          projectId: row.projectId,
          contractId: row.id,
          contractName: row.contractName,
          sectionSort: row.sectionSort,
          // processId: row.processId,
          // templateId: row.templateId,
          isReadonly: true,
        },
      });
    },
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
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_007",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },

    yearChange(val) {
      if (val) {
        this.search.formData.year = new Date(val).getFullYear();
        if (this.table.page.pageNum !== 1) {
          const { systemName, projectName, contactId } = this.search.formData;
          if (systemName == "" && projectName == "" && contactId == "") {
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
          const { systemName, projectName, contactId } = this.search.formData;
          if (systemName !== "" || projectName !== "" || contactId !== "") {
            sessionStorage.setItem(
              "searchData",
              JSON.stringify({ ...this.search.formData, pageNum: 1 })
            );
          }
        }
        sessionStorage.setItem("year", new Date(val).getFullYear());
      } else {
        this.search.formData.year = this.getNowTime();
        this.search.formData.years = new Date();
        if (this.table.page.pageNum !== 1) {
          const { systemName, projectName, contactId } = this.search.formData;
          if (systemName == "" && projectName == "" && contactId == "") {
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
          const { systemName, projectName, contactId } = this.search.formData;
          if (systemName !== "" || projectName !== "" || contactId !== "") {
            sessionStorage.setItem(
              "searchData",
              JSON.stringify({ ...this.search.formData, pageNum: 1 })
            );
          }
        }
        sessionStorage.setItem("year", this.getNowTime());
      }
    },
    // 查询节点下的申报单位信息
    getBuPropertyList(node) {
      getBuPropertyWithNodeInfo(node).then((res) => {
        this.search.enum.buPropertyList = [];
        res.data.map((item) => {
          this.search.enum.buPropertyList.push({
            label: item.buName,
            value: item.buid,
          });
        });
      });
    },
    selectable(selection, row) {
      if (
        selection.some((el) => {
          return row.id === el.id;
        })
      ) {
        if (row.childrens) {
          row.childrens.map((j) => {
            this.toggleSelection(j, true);
          });
        }
      } else {
        if (row.childrens) {
          row.childrens.map((j) => {
            this.toggleSelection(j, false);
          });
        }
      }
    },
    selectAll(selection) {
      // this.table.data第一层只要有在selection里面就是全选
      const isSelect = selection.some((el) => {
        const tableDataIds = this.table.data.map((j) => j.id);
        return tableDataIds.includes(el.id);
      });
      // this.table.data第一层只要有不在selection里面就是全不选
      const isCancel = !this.table.data.every((el) => {
        const selectIds = selection.map((j) => j.id);
        return selectIds.includes(el.id);
      });
      if (isSelect) {
        selection.map((el) => {
          if (el.childrens) {
            el.childrens.map((j) => {
              this.toggleSelection(j, true);
            });
          }
        });
      }
      if (isCancel) {
        this.table.data.map((el) => {
          if (el.childrens) {
            el.childrens.map((j) => {
              this.toggleSelection(j, false);
            });
          }
        });
      }
    },
    selectionChange(selection) {
      this.selectArr = [];
      this.selectArr = selection;

      this.projectList = [];

      // 插入子标段
      this.selectArr.forEach((ele) => {
        if (!ele.hasChildren) {
          this.projectList.push(ele);
        }
      });
      this.pilId = [];
      this.xmDetail = [];
      this.projectList.map((item) => {
        this.pilId.push({
          reportId: "",
          id: item.projectId ? item.projectId : item.id,
          contractId: item.htId || "",
          isDuobiaoduan: item.isDuobiaoduan ?? "",
          type: 0,
        });
        this.xmDetail.push({
          processInstanceId: item.processId,
          taskId: item.processId,
        });
      });
    },
    toggleSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs["selectTable"] &&
            this.$refs["selectTable"].$refs["SrTable"].toggleRowSelection(
              row,
              select
            );
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.searchPage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.common-card {
  height: 100%;
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

::v-deep .el-col-19 {
  width: 70% !important;
}

::v-deep .el-col-5 {
  width: 27% !important;
}

::v-deep .sr_search .project_manager {
  width: 170px !important;
}

::v-deep .search-btn {
  .el-button {
    margin-bottom: 5px;
  }
}

.button {
  width: 32px;
  height: 32px;
  margin-left: 5px;
  font-size: 20px;
  border-radius: 50%;
  border: 1px dashed #1890ff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #1890ff;
  outline: 0;
}

::v-deep .el-dialog__footer {
  height: 66px;

  .el-link {
    position: absolute;
    bottom: 10px;
    left: 20px;
  }

  .el-button {
    padding: 9px 27px;
  }
}

::v-deep .el-table__indent {
  padding-left: 0 !important;
}

::v-deep .el-table__placeholder {
  width: 0px !important;
}

.systemNameContract {
  display: inline-block;
  width: 53px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  border-radius: 2px;
  color: rgba(1, 118, 255, 1);
  background: rgba(66, 130, 255, 0.1);

  border: 1px solid rgba(1, 118, 255, 1);
}

::v-deep .el-table__expand-icon {
  -webkit-transition: none !important;
  transition: none !important;
}

::v-deep .el-table__expand-icon--expanded {
  transform: none !important;
}

::v-deep .el-table__expand-icon {
  .el-icon-arrow-right::before {
    // 加号的横线
    content: "";
    width: 9px;
    height: 1px;
    background-color: #000;
    position: absolute;
    // left: 4px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .el-icon-arrow-right::after {
    // 加号的竖线
    content: "";
    width: 0.5px;
    height: 9px;
    background-color: #000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

::v-deep .el-table__expand-icon.el-table__expand-icon--expanded {
  .el-icon-arrow-right::after {
    // 加号的竖线
    display: none;
  }
}

::v-deep .el-table__expand-icon {
  display: inline-block;
  width: 15px !important;
  line-height: 15px !important;
  height: 15px !important;
  text-align: center;
  border: 1px solid rgb(201, 205, 212);
}

::v-deep .table-column-hidden .el-checkbox__input {
  display: none !important;
}

.circle-btn {
  border-radius: 50% !important;
}

.other-btns {
  display: flex;
}
</style>
