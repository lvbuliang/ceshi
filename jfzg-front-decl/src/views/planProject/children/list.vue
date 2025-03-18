<template>
  <div class="total-page">
    <!-- 顶部 -->
    <div>
      <div class="top">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="全部项目" name="all">
            <div class="bottom">
              <div class="common-card">
                <div ref="searchRef">
                  <SearchPageComponent
                    :formData="search.formData"
                    :formItems="formItems"
                    :selectOptions="search.enum"
                    @clear="clearFunc"
                    @blur="inputAntSelectBlur"
                    @search="searchFn"
                    @reset="resetForm"
                    @height-changed="handleHeightChanged"
                  >
                    <template #buttons>
                      <el-button
                        v-if="
                          userInfo.currentRole.roleCode === 'FZGHC_JBRBF' ||
                          userInfo.currentRole.roleCode === 'XMFZR'
                        "
                        size="small"
                        type="primary"
                        @click="add"
                        >创建项目</el-button
                      >
                      <el-button
                        size="small"
                        v-if="userInfo.currentRole.roleCode === 'FZGHC_JBRBF'"
                        @click="memberCatch"
                        >成员管理</el-button
                      >
                      <el-button
                        size="small"
                        v-if="userInfo.currentRole.roleCode === 'FZGHC_JBRBF'"
                        @click="importA"
                        >导入</el-button
                      >
                      <el-button
                        size="small"
                        v-if="
                          userInfo.currentRole.roleCode !== 'CJDW_XMJL' &&
                          userInfo.currentRole.roleCode !== 'JLGCS'
                        "
                        @click="exprotByCondition"
                        >导出</el-button
                      >
                      <el-button size="small" @click="fhBase"
                        >返回工作台</el-button
                      >
                    </template>
                  </SearchPageComponent>
                </div>
                <CustomLoading :visible="isLoading" />
                <SrTable
                  @pageChanged="pageChanged"
                  :data="table.data"
                        :noData="noData"
                  @sizeChanged="sizeChanged"
                  @sortChange="sortChange"
                  :config="table.tableConfig"
                  :page="table.page"
                  @selected="selected"
                  :status="selectStatus"
                  ref="selectTable"
                >
                  <template slot="name3" slot-scope="scope">
       
                      <div>
                        {{ scope.scope.row.systemName }}
                      </div>
                  </template>

                  <template slot="projectCode" slot-scope="scope">
 
                      <div>
                        {{ scope.scope.row.projectCode }}
                      </div>

                  </template>

                  <div slot="cellSlot" slot-scope="scope">
    
                      <div v-if="userInfo.currentRole.roleCode === 'CJDW_XMJL'">
                        {{ scope.scope.row.projectName }}
                      </div>
                      <div
                        v-else
                        class="table_unitName"
                        @click="chakan(scope.scope.row)"
                      >
                        {{ scope.scope.row.projectName }}
                      </div>
                  </div>

                  <template slot="planYear" slot-scope="scope">
     
                      <div>
                        {{ scope.scope.row.planYear }}
                      </div>
                  </template>
                </SrTable>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="我关注的项目" name="follow">
            <div class="bottom">
              <div class="common-card">
                <div>
                  <SearchPageComponent
                    @height-changed="handleHeightChanged"
                    ref="searchRef"
                    :formData="search.formData"
                    :formItems="formItems"
                    :selectOptions="search.enum"
                    @clear="clearFunc"
                    @blur="inputAntSelectBlur"
                    @search="searchFn"
                    @reset="resetForm"
                  >
                    <template #buttons>
                      <el-button
                        v-if="
                          userInfo.currentRole.roleCode === 'FZGHC_JBRBF' ||
                          userInfo.currentRole.roleCode === 'XMFZR'
                        "
                        size="small"
                        type="primary"
                        @click="add"
                        >创建项目</el-button
                      >
                      <el-button
                        size="small"
                        v-if="userInfo.currentRole.roleCode === 'FZGHC_JBRBF'"
                        @click="memberCatch"
                        >成员管理</el-button
                      >
                      <el-button
                        size="small"
                        v-if="userInfo.currentRole.roleCode === 'FZGHC_JBRBF'"
                        @click="importA"
                        >导入</el-button
                      >
                      <el-button
                        size="small"
                        v-if="
                          userInfo.currentRole.roleCode !== 'CJDW_XMJL' &&
                          userInfo.currentRole.roleCode !== 'JLGCS'
                        "
                        @click="exprotByCondition"
                        >导出</el-button
                      >
                      <el-button size="small" @click="fhBase"
                        >返回工作台</el-button
                      >
                    </template>
                  </SearchPageComponent>
                </div>
                <CustomLoading :visible="isLoading" />
                <SrTable
                  @pageChanged="pageChanged"
                  :data="table.data"
                        :noData="noData"
                  @sizeChanged="sizeChanged"
                  @sortChange="sortChange"
                  :config="table.tableConfig"
                  :page="table.page"
                  @selected="selected"
                  :status="selectStatus"
                  ref="selectTable"
                >
                  <template slot="name3" slot-scope="scope">

                      <div>
                        {{ scope.scope.row.systemName }}
                      </div>
                  </template>

                  <template slot="projectCode" slot-scope="scope">
  
                      <div>
                        {{ scope.scope.row.projectCode }}
                      </div>
                  </template>

                  <div slot="cellSlot" slot-scope="scope">
 
                      <div v-if="userInfo.currentRole.roleCode === 'CJDW_XMJL'">
                        {{ scope.scope.row.projectName }}
                      </div>
                      <div
                        v-else
                        class="table_unitName"
                        @click="chakan(scope.scope.row)"
                      >
                        {{ scope.scope.row.projectName }}
                      </div>
                  </div>

                  <template slot="planYear" slot-scope="scope">
     
                      <div>
                        {{ scope.scope.row.planYear }}
                      </div>

                  </template>
                </SrTable>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <SrSupplementBox
      ref="supplementBox"
      type="operationLibrary"
      :apiObject="apiObject"
      :title="supplementBoxTitle"
      :codeObject="codeObject"
      :tableDataList="tableDataList"
      :stopUploadingFlag="stopUploadingFlag"
      :stopUploadingPassedName="'文件归档'"
      :stopUploadingStoppedName="'文件已归档'"
      :stopUploadingIcon="'sr-icon-a-guidang1'"
      :menuTypeObject="menuTypeObject"
      @stopUploading="stopUploading"
    />
    <SrSetting
      :dialogVisible="dialogVisible2"
      @close="close"
      @saveLabelList="saveLabelList"
      :data="labelList"
      v-if="labelList && dialogVisible2"
    ></SrSetting>

    <MemberManage
      :dialogVisible="memberManagedialogVisible"
      :babaData="babaData"
      :pilIds="pilIds"
      :memberManageText="memberManageText"
      @close="closeMemberManage"
      @saveLabelList="saveMemberManage"
      @saveLabelList2="saveMemberManage2"
      v-if="memberManagedialogVisible"
      ref="memberManageDialogRef"
    ></MemberManage>
    <el-dialog
      title="导入"
      :visible.sync="centerDialogVisible"
      width="650px"
      center
      class="elDialog"
    >
      <el-form
        ref="uploadFormref"
        :model="uploadForm"
        :rules="uploadRule"
        class="demo-form-inline"
      >
        <el-form-item prop="sourceValue">
          <el-upload
            class="upload-demo"
            action="string"
            :http-request="uploadFile"
            :show-file-list="true"
            :before-upload="beforeAvatarUpload"
            ref="upfile"
          >
            <div style="display: flex; align-items: center">
              <div style="font-size: 14px">文件导入:</div>
              <div class="button">点击上传</div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="项目来源:" prop="sourceValue">
          <el-select
            v-model="uploadForm.sourceValue"
            placeholder="请选择项目来源"
          >
            <el-option
              v-for="item in uploadForm.sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <div class="link-box">
          <el-link
            href="/decl/word/项目列表信息导入模板.xlsx"
            download="项目信息列表"
            class="el-icon-download"
            type="primary"
            >模板下载</el-link
          >
        </div>

        <div class="btn-box">
          <el-button
            @click="
              () => {
                centerDialogVisible = false;
                this.$refs.upfile.clearFiles();
              }
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="upRefalsh('uploadFormref')"
            >下一步</el-button
          >
        </div>
      </div>
    </el-dialog>

    <Dialogs :dialogVisible="dialogDis"></Dialogs>
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年06月16日 15:34:49
  版本：v1.0
-->
<script>
import Dialogs from "@/views/planProject/children/dialog.vue";
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转
import store from "@/store";
import {
  queryRemove,
  api_fileAway,
  getYearPlanListWithProjectInfo,
  getBuPropertyWithNodeInfo,
  exprotByCondition,
  getQueryProjectList,
  getStatement,
  updateIsConcern,
  updateMemberManagement,
  removeList,
  exportByIds,
  importProject,
  getDangerInfo,
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
import utils from "@/utils/index.js";
import { setSession, getSession, removeSession } from "@/core/session.js";
import upload from "@/utils/upload";
// 标签弹框
import SrSetting from "@/components/SrSetting.vue";
import AllocationDialog from "@/components/AllocationDialog.vue";
import ExpertSelectDialog from "@/components/ExpertSelectDialog.vue";
import MemberManage from "../components/MemberManage.vue";
import yearPlanManager from "@/utils/yearPlanUtils";

import SearchPageComponent from "../components/SearchPageComponent.vue";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
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
    isSpanActive: String,
  },
  components: {
    SrSetting,
    AllocationDialog,
    ExpertSelectDialog,
    MemberManage,
    Dialogs,
    SearchPageComponent,
  },
  watch: {},
  data() {
    return {
      isLoading:false,
      noData: false,
      activeTab: "all",
      sectionList: [],
      formData: null,
      dialogDis: false,
      centerDialogVisible: false,
      babaData: "",
      babaDatas: [],
      taskName: "",
      selectStatus: [201, 4], //部分多选框需要禁用的状态 已分配
      pilId: [], //批量分配项目id
      pilIds: [], //行间项目id
      tab_active: 0,
      yearList: [
        {
          value: "选项1",
          label: "2024年",
        },
        {
          value: "选项2",
          label: "2023年",
        },
        {
          value: "选项3",
          label: "2022年",
        },
        {
          value: "选项4",
          label: "2021年",
        },
        {
          value: "选项5",
          label: "2020年",
        },
      ],
      boxHeight: "",
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

      search: {
        nosearch: false,
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
            disabled: false,
            class: "inputStyle",
          },
          {
            type: "text",
            placeholder: "项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
            disabled: false,
            class: "inputStyle",
          },
          {
            type: "text",
            placeholder: "项目编码",
            bind: "projectCode", // 对应this.search.data对象的field1
            disabled: false,
            class: "inputStyle",
          },
          {
            type: "text",
            placeholder: "需求部门",
            bind: "needDepartmentPersonId", // 对应this.search.data对象的field1
            disabled: false,
            class: "inputStyle",
          },
          {
            type: "select",
            placeholder: "所属年度计划",
            bind: "yearPlanId",
            data: "yearPlanList", // 对应enum中的yearPlanList
            class: "getyearclass",
            disabled: false,
          },
          {
            type: "select",
            placeholder: "所属阶段",
            bind: "belongingStage",
            data: "stageList", // 对应enum中的stageList
            class: "getyearclass",
            disabled: false,
          },
        ],
        enum: {
          // 搜索项下拉数据
          plan_typeList: [], //项目状态
          yearPlanList: [], //年度计划
          labelList: [], //项目标签
          buPropertyList: [], //申报单位
          stageList: [
            {
              value: "建设实施阶段",
              label: "建设实施阶段",
              // label: '黄金糕',
            },
            {
              value: "方案编制阶段",
              label: "方案编制阶段",
            },
            {
              value: "初步上线",
              label: "初步上线",
            },
            {
              value: "未启动",
              label: "未启动",
            },
          ], // 所属阶段
        },
        btns: [
          // {
          //   name: "新增",
          //   click: this.add,
          //   type: "primary",
          //   // validate: this.btnValidate2,
          // },
          {
            name: "创建项目",
            click: this.add,
            type: "primary",
            permissionCode: "M015_M003_002",
          },
          {
            name: "成员管理",
            click: this.memberCatch,
            type: "default",
            permissionCode: "M015_M003_001",
          },
          {
            name: "导入",
            click: this.import,
            type: "default",
            permissionCode: "M015_M003_003",
          },
          {
            name: "导出",
            click: this.exprotByCondition,
            type: "default",
            permissionCode: "M1510_M1509_001",
          },
        ],
        formData: {
          systemName: "",
          projectName: "",
          projectCode: "",
          needDepartmentPersonId: "",
          belongingStage: "",
          status: "", //状态
          tags: [], //标签
          buid: "", //部门
          yearPlanId: "", //年度计划
          condition: "",
          beginYear: "",
          keyword: "", //关键字
          planType: "",
          createBuName: "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
        autoCompleteList: [],
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          maxHeight: 0,
          // load: this.load,
          tooltipEffect: "light",
          header: [],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: true,
            width: "40",
          },
          /* slotOperateConfig: {
            display: true,
            label: "关注",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
          }, */
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
              name: "成员管理", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "memberCatchA", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "del", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "chakan", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
            {
              name: "关注", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "concern", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "取消关注",
              method: "noconcern",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
          ],
        },
        page: {
          // 分页配置
          total: 100, //总条数
          pages: 10, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      formItems: [
        { label: "系统名称", prop: "systemName", type: "input" },
        { label: "项目名称", prop: "projectName", type: "input" },
        { label: "项目编码", prop: "projectCode", type: "input" },
        { label: "需求部门", prop: "needDepartmentPersonId", type: "input" },
        {
          label: "所属年度计划",
          prop: "yearPlanId",
          type: "select",
          options: yearPlanManager.yearPlanList,
        },
        {
          label: "所属阶段",
          prop: "belongingStage",
          type: "select",
          options: [
            {
              value: "建设实施阶段",
              label: "建设实施阶段",
              // label: '黄金糕',
            },
            {
              value: "方案编制阶段",
              label: "方案编制阶段",
            },
            {
              value: "初步上线",
              label: "初步上线",
            },
            {
              value: "未启动",
              label: "未启动",
            },
          ], // 所属阶段
        },
      ],
      userInfo: store.getters.userInfo,
      // pilId: [], //已选项目id
      xmDetail: [],
      memberManagedialogVisible: false, //成员管理弹框
      // 项目信息报表
      systemNum: "",
      projectNum: "",
      researchApplicationNUm: "",
      optionPhaseNum: "",
      projectApprovalNum: "",
      implIngNum: "",
      trialRunNum: "",
      onlineNum: "",
      isConcern: 0,
      selectType: 0,
      year: "",
      btnname: "关注",

      // 全部项目  跟关注的项目
      titleVal: 0,
      // 重大问题
      MajorProblem: {
        resolved: null, // 已解决
        unsolved: null, // 未解决
      },
      // 重大风险
      MajorDanger: {
        resolved: null, // 已解决
        unsolved: null, // 未解决
      },
      // 判断成员管理单项/批量
      memberManageText: "",
      uploadForm: {
        sourceValue: "",
        sourceOptions: [
          {
            value: "0",
            label: "统建类项目",
          },
        ],
      },
      uploadRule: {
        sourceValue: [
          { required: true, message: "请选择项目来源", trigger: "blur" },
        ],
      },
      searchHeight: [
        {
          offsetHeight: 0,
        },
      ],
    };
  },
  created() {
    this.search.enum.yearPlanList = yearPlanManager.yearPlanList;
    // 获取重大风险信息
    this.getDangerData(0);
  },
  mounted() {
    this.calculateTableHeight();
    this.getTbData();
    this.getTbHeader();
    this.getStatementA();
    this.getWorkflowHeight();
  },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  methods: {
    handleHeightChanged(height) {
      this.searchHeight[0].offsetHeight = height;
    },
    calculateTableHeight() {
      // 等待子组件渲染完成后获取高度
      this.$nextTick(() => {
        // 把searchHeight改为数组的形式给offsetHeight这个值传递给
        let height = getCommonTableHeight(this.searchHeight[0]) - 80;
        this.$set(this.table.tableConfig, "maxHeight", height);
      });
    },
    handleTabClick(tab) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      // 如果为tab.name为all那么给tabChange传值为0，如果为follow那么给tabChange传值为1
      this.tabChange(tab.name === "all" ? 0 : 1);
      this.getDangerData(tab.name === "all" ? 0 : 1);
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
    },
    resetForm() {
      this.search.formData.needDepartmentPersonId = "";
      this.search.formData.projectCode = "";
      this.search.formData.projectName = "";
      this.search.formData.systemName = "";
      this.search.formData.yearPlanId = "";
      this.search.formData.belongingStage = "";
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      sessionStorage.removeItem("searchData");
      this.getTbData();
    },
    searchFn() {
      this.table.page.pageNum = 1;
      this.getTbData('seek');
    },
    getWorkflowHeight() {
      let workflowHeight = 0;
      let container = document.querySelector(".workflow");
      if (container) {
        workflowHeight = "";
      }
      workflowHeight += 0;
      this.boxHeight =
        window.innerHeight -
        document.querySelector(".the-nav").offsetHeight -
        workflowHeight;
      console.log("workflowHeight", this.boxHeight);
    },
    // 获取重大风险和问题数据
    getDangerData(type) {
      let param = {
        contactId: 0,
        isDraft: 0,
        level: "",
        pageNo: 0,
        pageSize: 0,
        problemIds: [],
        projectId: 0,
        projectName: "",
        proposeTime: "",
        status: "",
        systemName: "",
        type: "",
        isConcern: type,
      };
      getDangerInfo(param).then((res) => {
        if (res.msg.code === "0000") {
          const { completeProblem, problemHandle, completeRisk, riskHandler } =
            res.data;
          this.MajorProblem.resolved = completeProblem;
          this.MajorProblem.unsolved = problemHandle;
          this.MajorDanger.resolved = completeRisk;
          this.MajorDanger.unsolved = riskHandler;
        }
      });
    },
    getStatementA() {
      getStatement({ isConcern: this.isConcern }).then((res) => {
        this.systemNum = res.data.systemNum;
        this.projectNum = res.data.projectNum;
        this.researchApplicationNUm = res.data.researchApplicationNUm; //res.data.researchApplicationNUm;
        this.optionPhaseNum = res.data.optionPhaseNum; //res.data.optionPhaseNum;
        this.projectApprovalNum = res.data.projectApprovalNum; //res.data.projectApprovalNum;
        this.implIngNum = res.data.implIngNum; //res.data.implIngNum;
        this.trialRunNum = res.data.trialRunNum; //res.data.trialRunNum;
        this.onlineNum = res.data.onlineNum; //res.data.onlineNum;
      });
    },
    // tab切换
    tabChange(val) {
      //console.log(val);
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
      this.getDangerData(val);
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
      window.open(
        `${
          config.baseUrl
        }/jfzg/planProject/project/export?permissionCode=M002_003&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    // 导入
    importA() {
      this.centerDialogVisible = true;
    },
    beforeAvatarUpload(file) {
      //console.log(file);
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
      this.formData = new FormData();
      this.formData.append("file", params.file);
      this.formData.append("isConcern", this.isConcern);
    },
    upRefalsh(uploadFormref) {
      this.$refs[uploadFormref].validate((valid) => {
        if (valid) {
          if (this.formData) {
            this.formData.append("source", this.uploadForm.sourceValue);
            // console.log(this.formData);
            importProject(this.formData).then((res) => {
              if (res.msg.code == "0000") {
                if (res.msg.message == "SUCCESS") {
                  // this.getProjectList();
                  this.$refs["upfile"].clearFiles();
                  this.getTbData();
                  if (res.data[0].code === "1") {
                    this.$message({
                      type: "success",
                      message: res.data[0].result,
                    });
                  } else {
                    this.$message({
                      type: "warning",
                      message: res.data[0].result,
                    });
                  }
                } else {
                  this.$message({
                    type: "warning",
                    message: res.data[0].result,
                  });
                }
              }
            });
            this.centerDialogVisible = false;
            this.getTbData();
          } else {
            this.$message.warning("请上传文件");
          }
        }
      });
    },
    // 导出
    exprotByCondition(row) {
      if (this.pilIds.length < 1) {
        this.$message("请至少勾选一条作为导出的表");
      } else {
        exportByIds({ ids: this.pilIds }).then((res) => {
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
          //console.log(blob, URL);
          link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
          fileName = "项目信息列表导出数据.xlsx";
          link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
          document.body.appendChild(link);
          link.click(); // 释放URL对象
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        });
      }
    },
    btnValidate(row, item) {
      if (
        row.name == "编辑" &&
        this.userInfo.currentRole.roleCode != "CJDW_XMJL" &&
        this.userInfo.currentRole.roleCode != "F_ZJL" &&
        this.userInfo.currentRole.roleCode != "ZJL" &&
        this.userInfo.currentRole.roleCode != "DSZ"
      ) {
        return true;
      }
      if (
        row.name == "删除" &&
        this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
      ) {
        return true;
      }

      if (row.name == "关注" && item.isConcern == 0) {
        return true;
      }
      if (row.name == "取消关注" && item.isConcern == 1) {
        return true;
      }

      if (
        (row.name == "成员管理" &&
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF") ||
        this.userInfo.currentRole.roleCode == "XMFZR"
      ) {
        return true;
      }
      if (row.name == "子项目" && utils.checkCodeInArr("M002_003_001")) {
        return true;
      }
      if (
        row.name == "上传附件" &&
        (utils.checkCodeInArr("M002_003_006") ||
          utils.checkCodeInArr("M002_003_007"))
      ) {
        return true;
      }
      return false;
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
      this.noData=false;
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
          JSON.parse(sessionStorage.getItem("searchData")).projectCode !== ""
        ) {
          this.search.formData.projectCode = JSON.parse(
            sessionStorage.getItem("searchData")
          ).projectCode;
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
          JSON.parse(sessionStorage.getItem("searchData")).belongingStage !== ""
        ) {
          this.search.formData.belongingStage = JSON.parse(
            sessionStorage.getItem("searchData")
          ).belongingStage;
        }

        if (seek == undefined) {
        if (JSON.parse(sessionStorage.getItem("searchData")).pageNum !== null) {
          this.table.page.pageNum = JSON.parse(
            sessionStorage.getItem("searchData")
          ).pageNum;
        }
      }
      }
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        isSubproject: 0,
        selectType: this.selectType,
        year: "",
        ...this.search.formData,
      };
      getQueryProjectList(param).then((res) => {
        if (res.data) {
          this.isLoading = false;
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          this.table.data = res.data.records; // this.table.data = [{}, {}];
        } else {
          this.isLoading = false;
          this.noData=true;
        }
      }).catch(() => {
        this.isLoading = false;
        this.noData=true;
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
      api_userSetQuery({ permissionCode: "M021_001" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        //console.log(headerData);
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "beginDate") {
            item.sortable = "custom";
            // 上下翻转箭头
            item.width = "110px";
          }
          if (item.prop == "systemName") {
            // item.cellSlot = true;
            // item.width = "240px"; //加宽系统名称
          }
          if (item.prop == "projectName") {
            item.cellSlot = true;
            // item.width = "240px"; //加宽项目名称
          }
          if (item.prop == "projectCode") {
            //项目编码
            item.width = "170px";
          }
          if (item.prop == "applicationUnit") {
            //需求部门
            // item.width = "120px";
          }
          if (item.prop == "planYear") {
            //所属年度计划
            item.width = "160px";
          }
          if (item.prop == "projectMaturity") {
            //所属阶段
            item.width = "110px";
          }

          return item.isShow;
        });
      });
    },
    add() {
      this.$router.push({
        name: "createProject",
        query: {
          // projectCode: res.data,
          timestamp: new Date().getTime(),
          isConcern: this.isConcern,
        },
      });
    },
    fhBase() {
      // 更新tabs页签
      let element = {
        url: `/base/home`,
        title: "工作台",
      };
      let tabsList = JSON.parse(sessionStorage.getItem("tabsList")) || [];
      let obj = tabsList.findIndex((item) => item.url.includes("/base/home"));
      if (obj > -1) {
        // routerGo(obj.url);
        tabsList.splice(obj, 1, element);
      } else {
        tabsList.push({
          ...element,
        });
      }
      sessionStorage.setItem("tabsList", JSON.stringify(tabsList));
      routerGo("/base/home");
      let htmlbr = "工作台";
      sessionStorage.setItem("htmlData", htmlbr);
    },
    edit(row) {
      removeSession("infoId_planProjectAdd");
      this.$router.push({
        name: "planProjectEdit",
        query: {
          id: row.id,
          templateId: row.templateId,
          processId: row.processId,
          spanaActive: this.spanaActive,
        },
      });
    },
    see(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          projectCode,
          needDepartmentPersonId,
          yearPlanId,
          belongingStage,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          projectCode == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          belongingStage == ""
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
          projectCode,
          needDepartmentPersonId,
          yearPlanId,
          belongingStage,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          projectCode !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          belongingStage !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "planProjectEdit",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          spanaActive: this.spanaActive,
          testId2: -1,
        },
      });
    },
    // 查看
    chakan(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          projectCode,
          needDepartmentPersonId,
          yearPlanId,
          belongingStage,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          projectCode == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          belongingStage == ""
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
          projectCode,
          needDepartmentPersonId,
          yearPlanId,
          belongingStage,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          projectCode !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          belongingStage !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }

      this.$router.push({
        name: "planProjectView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          spanaActive: this.spanaActive,
          testId2: 1,
        },
        // 查看相关逻辑
      });
    },
    // 加入关注
    concern(row) {
      const ids = row.id;
      updateIsConcern({ id: ids, isConcern: this.isConcern }).then((res) => {
        if (res.msg.code == "0000") {
          // //console.log('加入关注成功')
          this.$message.success("关注成功");
          this.getTbData();
          this.getStatementA();
        }
      });
    },
    // 取消关注
    noconcern(row) {
      const ids = row.id;
      updateIsConcern({ id: ids, isConcern: row.isConcern }).then((res) => {
        if (res.msg.code == "0000") {
          // //console.log('加入关注成功')
          this.$message.success("取消关注成功");
          this.getTbData();
          this.getStatementA();
        }
      });
    },
    // 项目列表删除
    del(row) {
      let params = { projectId: row.id, selectType: this.isConcern };
      this.$confirm("是否确认该操作", "提示", {
        iconClass: "el-icon-question", //自定义图标样式
        confirmButtonText: "确认", //确认按钮文字更换
        cancelButtonText: "取消", //取消按钮文字更换
        showClose: true, //是否显示右上角关闭按钮
        type: "warning", //提示类型  success/info/warning/error
      })
        .then(() => {
          //确认操作
          removeList(params).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("删除成功");
              this.getTbData();
              this.getStatementA();
              this.getDangerData(0);
            }
          });
        })
        .catch(() => {
          //取消操作
        });
    },
    //成员管理 外面
    memberCatch(row) {
      //console.log("成员管理外");
      this.memberManageText = "成员管理外";
      // this.babaData = row.id;
      if (this.pilIds.length < 1) {
        // if (this.pilId.length < 1) {
        this.$message("请至少勾选一条项目信息");
      } else {
        if (this.sectionList.length > 1 && this.sectionList.includes(0)) {
          this.$message("当前选择的项目中存在多标段项目, 请重新选择");
        } else {
          this.memberManagedialogVisible = true;
        }
      }
      // const datas = this.testData.push({ projectIds: [row.id] })
    },
    // 成员管理操作列
    memberCatchA(row) {
      //console.log("成员管理内");
      this.memberManageText = "成员管理内";
      this.memberManagedialogVisible = true;

      this.$nextTick(() => {
        this.$refs.memberManageDialogRef.searchSection(row);
      });
      this.pilId = [row.id];
      this.babaData = row.id;
    },
    // 成员管理取消
    closeMemberManage() {
      this.memberManagedialogVisible = false;
    },
    // 成员管理保存
    saveMemberManage(val) {
      this.testData = val;
      if (this.memberManageText == "成员管理内") {
        this.testData.projectIds = this.pilId;
      } else if (this.memberManageText == "成员管理外") {
        this.testData.projectIds = this.pilIds;
      }
      updateMemberManagement(this.testData)
        .then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("添加成功");
          }
        })
        .catch((err) => {
          //console.log(err);
          this.$message.fail("添加失败请勾选");
        });
      this.memberManagedialogVisible = false;
    },
    // 多标段成员管理保存
    saveMemberManage2(val) {
      this.testData = val;
      if (this.memberManageText == "成员管理内") {
        this.testData.projectIds = [];
        this.testData.projectIds.push(this.babaData);
      } else if (this.memberManageText == "成员管理外") {
        this.testData.projectIds = this.pilIds;
      }
      updateMemberManagement(this.testData)
        .then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("添加成功");
          }
        })
        .catch((err) => {
          //console.log(err);
          this.$message.fail("添加失败请勾选");
        });
      this.memberManagedialogVisible = false;
    },
    workView(row) {
      this.$router.push({
        name: "planProjectWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          spanaActive: this.spanaActive,
          type: row.type,
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
    settingHeader() {
      this.dialogVisible = true;
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M021_001",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    // 查询节点下的年度计划
    getYearPlanList(node) {
      getYearPlanListWithProjectInfo(node).then((res) => {
        this.search.enum.yearPlanList = [];
        res.data.map((item) => {
          this.search.enum.yearPlanList.push({
            label: item.yearPlanName,
            value: item.yearPlanId,
          });
        });
      });
    },
    // 查询节点下的申报单位信息
    getBuPropertyList(node) {
      getBuPropertyWithNodeInfo(node).then((res) => {
        //console.log("节点下的申报单位", res);
        this.search.enum.buPropertyList = [];
        res.data.map((item) => {
          this.search.enum.buPropertyList.push({
            label: item.buName,
            value: item.buid,
          });
        });
      });
    },
    // 多选操作
    selected(projectList) {
      this.projectList = projectList;
      this.pilIds = [];
      this.xmDetail = [];
      this.sectionList = [];
      projectList.map((item) => {
        this.pilIds.push(item.id);
        this.sectionList.push(item.isSection);
        this.xmDetail.push({
          processInstanceId: item.processId,
          taskId: item.processId,
        });
      });
      console.log(
        "批量已选项目",
        this.sectionList,
        this.projectList,
        this.pilIds,
        this.xmDetail
      );
    },
    goRisk(type1, type2) {
      // 更新tabs页签
      let element = {
        url:
          "/subimpl/#/riskAndIssueNew" +
          `?type=0&statusSolve=${type1}&typePr=${type2}&isNew=true`,
        title: "风险问题管理",
      };
      let tabsList = JSON.parse(sessionStorage.getItem("tabsList")) || [];
      let obj = tabsList.findIndex((item) =>
        item.url.includes("/subimpl/#/riskAndIssueNew")
      );
      if (obj > -1) {
        // routerGo(obj.url);
        tabsList.splice(obj, 1, element);
      } else {
        tabsList.push({
          ...element,
        });
      }
      sessionStorage.setItem("htmlData", element.title);
      sessionStorage.setItem("tabsList", JSON.stringify(tabsList));
      console.log("ziziziziiz", element.url);

      routerGo(element.url);
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  padding: 0 20px
}

.total-page {
  // height: 100%;
  display: flex;
  flex-direction: column;
  font-family: PingFangSC-Regular, PingFang SC;
  background: #fff !important;
}
::v-deep .sr_search {
  .el-col-5 {
    // width: 100%;
  }
}
::v-deep .buttons.el-button {
  padding-bottom: 5px !important;
  border-radius: 0 !important;
  color: rgba(78, 89, 105, 1);
  font-size: 15px !important;
}
// .top {
//   background-color: #fff;
//   //border-radius: 0px 10px 10px 10px;
//   padding: 0 15px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   height: 48px;

//   .top_left {
//     font-size: 14px;
//     font-weight: bold;
//     line-height: 48px;
//     .active {
//       color: rgba(66, 130, 255, 1);
//       display: inline-block;
//       border-bottom: 2px solid #4282ff;
//     }

//     span:last-child {
//       margin-left: 36px;
//     }
//   }

//   .top_right {
//     font-size: 12px;
//     color: rgba(78, 89, 105, 1);

//     .el-select {
//       width: 100px;
//       margin-right: 24px;
//     }

//     span {
//       cursor: pointer;
//     }
//   }
// }

.middle {
  margin: 16px 0;
  // height: 160px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  color: rgba(78, 89, 105, 1);

  .middle_left {
    width: 60%;
    display: flex;
    background: #fff;
    padding: 20px 0;
    border-radius: 10px;

    .middle_left_left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 26%;
      margin-right: 4%;
      border-right: 1px solid rgba(242, 243, 245, 1);

      .text {
        font-size: 16px !important;
        font-weight: 700;
      }

      .num {
        font-size: 36px;
        font-weight: 700;
        color: rgba(66, 130, 255, 1);
      }
    }

    .middle_left_right {
      padding-left: 6.5%;
      display: flex;
      flex-wrap: wrap;
      width: 70%;
      column-count: 2;
      column-gap: 3px;
      padding: 0px;

      .box {
        width: 24%;
      }

      .box:last-child {
        margin-right: 0px;
      }

      .num {
        font-size: 24px;
        font-weight: 700;
        color: rgba(29, 33, 41, 1);
      }

      .text {
        font-size: 14px !important;
        padding: 0 !important;
        font-weight: 400 !important;
      }
    }
  }

  @media (min-width: 1400px) {
    .num1,
    .num2 {
      width: 30% !important;
    }
  }

  .middle_que {
    width: 20%;
    margin: 0 16px;
    background: #fff;
    border-radius: 10px;
    padding-top: 21px;
    padding-left: 24px;

    .middle_que_top {
      span {
        display: inline-block;
        margin-left: 12px;
      }
    }

    .middle_que_bottom {
      display: flex;
      justify-content: space-around;
      padding: 26px 0;
      padding-top: 15px;
      color: rgba(29, 33, 41, 1);

      .box {
        width: 50%;
      }

      .num1 {
        margin-top: 2px;
        font-weight: 700;
        font-size: 36px;
        line-height: 36px;
        width: 40%;
        text-align: center;
        cursor: pointer;

        &:hover {
          font-size: 42px;
          line-height: 42px;
          font-weight: 900;
          transition: width 2s linear 0s;
        }
      }

      .num2 {
        margin-top: 2px;
        font-weight: 700;
        font-size: 36px;
        line-height: 36px;
        color: rgba(212, 48, 48, 1);
        width: 40%;
        text-align: center;
        cursor: pointer;

        &:hover {
          font-size: 42px;
          line-height: 42px;
          font-weight: 900;
          transition: width 2s linear 0s;
        }
      }
    }
  }

  .middle_risk {
    width: 20%;
    background: #fff;
    border-radius: 10px;
    padding-top: 21px;
    padding-left: 24px;

    .middle_que_top {
      span {
        display: inline-block;
        margin-left: 12px;
      }
    }

    .middle_que_bottom {
      display: flex;
      justify-content: space-event;
      padding: 26px 0;
      padding-top: 15px;
      color: rgba(29, 33, 41, 1);

      .box {
        width: 50%;
      }

      .num1 {
        margin-top: 2px;
        font-weight: 700;
        font-size: 36px;
        line-height: 36px;
        width: 40%;
        text-align: center;
        cursor: pointer;

        &:hover {
          font-size: 42px;
          line-height: 42px;
          font-weight: 900;
          transition: width 2s linear 0s;
        }
      }

      .num2 {
        margin-top: 2px;
        font-weight: 700;
        font-size: 36px;
        line-height: 36px;
        color: rgba(212, 48, 48, 1);
        width: 40%;
        text-align: center;
        cursor: pointer;

        &:hover {
          font-size: 42px;
          line-height: 42px;
          font-weight: 900;
          transition: width 2s linear 0s;
        }
      }
    }
  }
}

.bottom {
  background: #fff;
  padding: 20px;
  flex: 1;
  overflow: auto;
  // 表格中插槽样式
  .table_unitName {
    color: rgba(66, 130, 255, 1);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :hover .table_unitName {
    cursor: pointer;
  }

  .common-card {
    height: 100%;
  }
}

@media (min-width: 1600px) and (max-width: 1699px) {
  .middle_left_right {
    margin-left: 2% !important;
  }

  .middle_left_right .box {
    margin-right: 6% !important;
  }
}

@media screen {
  @media (min-width: 1700px) {
    .middle_left_right .box:nth-child(5) {
      margin-right: 0% !important;
    }
  }
}

.upload-demo {
  padding-left: 10px;
}

.button {
  height: 28px;
  line-height: 18px;
  text-align: center;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #1890ff;
  font-size: 14px;
  color: #1890ff;
}

:deep(.getyearclass) {
  width: 180px !important;
}

:deep(.inputStyle) {
  width: 140px !important;
}

::v-deep .sr_search .el-col-5 {
  // width: 24.83333% !important;
  width: 27%;
  margin-top: -10px;

  div {
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    justify-content: flex-end;

    .el-button {
      margin-top: 10px;
    }
  }
}

::v-deep .sr_search .el-col-19 {
  width: 69.83333% !important;
}
::v-deep .el-dialog .el-dialog__header {
  text-align: left !important;
}

.elDialog .dialog-footer {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .link-box {
    width: 100px;
    height: 50px;
    /* background-color: red; */
    display: block;
    font-size: 12px;
    line-height: 50px;
  }

  .el-button {
    height: 32px;
    border-radius: 4px;
    padding: 0 20px !important;
  }
}

.upload-box {
  display: flex;
  justify-content: space-between;

  .upload-box-right {
    .el-select {
      margin-left: 5px;
    }
  }
}

::v-deep .el-dialog .el-dialog__footer {
  padding: 0 !important;
}

::v-deep .el-dialog__footer {
  padding: 0 !important;
}

.searchPage {
  // display: flex;
  // justify-content: space-between;
  margin-bottom: 20px;

  .demo-form-inline {
    width: 100%;
  }

  .other-btns {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
}

.circle-btn {
  border-radius: 50% !important;
}
::v-deep .el-tabs__header {
  padding: 0;
  position: relative;
  margin: 0 0 15px;
  background: #fff;
}

::v-deep.el-tabs__content {
  background: #000 !important;
}

::v-deep .sr_table td {
  line-height: 60px;
  height: 60px;

  > .cell {
    line-height: 24px !important;
  }
}
</style>
