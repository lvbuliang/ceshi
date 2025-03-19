<template>
  <!-- <section class="form-config sr-qiankun-add"> -->
  <div class="page-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :disabled="true"
        :key="item.code"
        :name="item.code"
      >
        <template slot="label" class="tabsLabel">
          <img
            style="vertical-align: middle"
            src="@/assets/barrage_fill@2x.png"
            width="24px"
            height="auto"
            alt=""
          />
          <span style="color: #333; vertical-align: middle; padding-left: 4px">
            {{ item.title }}
          </span>
        </template>
        <SrAdd
          class="sradd"
          :config="form.config"
          :enums="form.enums"
          :form="form.data"
          :otherConfig="form.otherConfig"
          ref="add"
        >
          <!-- 报告期别 -->
          <template slot="season">
            <div>
              <el-input
                v-model="form.data.season"
                maxlength="15"
                show-word-limit
              ></el-input>
            </div>
          </template>
          <!-- 报告周期 -->
          <template slot="reportPeriod">
            <div style="position: relative">
              <p class="reportPeriodClass" @click="reportPeriodStratHandel">
                {{ reportPeriodStrat }} - {{ reportPeriodEnd }}
              </p>
              <el-date-picker
                style="position: absolute; top: 0; left: 0"
                class="date"
                v-model="form.data.reportPeriod"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                @change="reportPeriodChange"
                :picker-options="expireTimeOPtion"
              >
              </el-date-picker>
            </div>
          </template>

          <!-- 工作推进情况 -->
          <template slot="progress">
            <quill-editor
              placeholder="请输入文本..."
              v-model="form.data.progress"
              ref="myQuillEditor"
              :options="editorOption"
            >
            </quill-editor>
          </template>
          <!-- 下周工作计划 -->
          <template slot="nextWorkPlan">
            <quill-editor
              placeholder="请输入文本..."
              v-model="form.data.nextWorkPlan"
              ref="myQuillEditor"
              :options="editorOption1"
            ></quill-editor>
          </template>
          <template slot="existProblem">
            <SrTable
              v-if="table.data.length > 0"
              @pageChanged="pageChanged"
              :data="table.data2"
              @sizeChanged="sizeChanged"
              :config="table.tableConfig"
              :page="table.page"
              @selected="selected"
              ref="selectTable"
            >
            </SrTable>
            <div class="btns" @click="selectQue">选择问题</div>
          </template>
          <template slot="addProblem">
            <SrTable
              @pageChanged="pageChanged2"
              :data="table2.data2"
              @sizeChanged="sizeChanged2"
              :config="table2.tableConfig"
              :page="table2.page"
              ref="selectTable"
            >
            </SrTable>
            <div class="btns" @click="addQue">
              <i class="el-icon-plus"></i>
              新增
            </div>
          </template>
        </SrAdd>
      </el-tab-pane>

      <!-- <sr-work-flow
        :hideFrom="true"
        :clickMethods="clickmethods"
        :buttonList="buttonList"
        ref="work_flow"
        backName="report"
      >
      </sr-work-flow> -->
    </el-tabs>
    <!-- <el-divider></el-divider> -->
    <div class="container_bottom_btns">
      <el-button type="primary" size="small" @click="tg">提交</el-button>
      <el-button v-if="isShowBtn == 0" type="primary" size="small" @click="btg"
        >保存草稿</el-button
      >
      <el-button size="small" @click="fh">返回列表</el-button>
      <el-button
        v-if="isFromWorkBench"
        type="success"
        size="small"
        @click="backWorkBench"
        >前往工作台</el-button
      >
    </div>
    <!-- 存在问题弹框 -->
    <el-dialog
      :visible.sync="exitQueDialog"
      width="700px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :show-close="true"
      title="存在的问题"
    >
      <div class="content_box">
        <!-- <div class="content_title">存在的问题</div> -->
        <SrTable
          @pageChanged="pageChanged3"
          :data="table3.data"
          @sizeChanged="sizeChanged3"
          :config="table3.tableConfig"
          :page="table3.page"
          @selected="exitQueSelected"
          ref="selectTable1"
        >
        </SrTable>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveExitQueDialog">保 存</el-button>
        <el-button @click="exitQueDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新增问题弹框组件 -->
    <el-dialog
      :visible.sync="addQueDialog"
      width="700px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :show-close="true"
      @close="addQueDialogClose"
      title="新增问题"
    >
      <div class="content_box">
        <!-- <div class="content_title">存在的问题</div> -->
        <SrAdd
          class="sradd"
          :config="form2.config"
          :enums="form2.enums"
          :form="form2.data"
          :otherConfig="form2.otherConfig"
          ref="add1"
        >
          <template slot="liablerName">
            <div class="reportWriter">
              <el-input
                v-model="form2.data.liablerName"
                placeholder="请输入内容"
                style="width: 100%"
              ></el-input>
              <!-- <div class="btn" @click="addLiablerName">
                <i class="el-icon-plus"></i>
              </div> -->
            </div>
          </template>
          <template slot="processorName">
            <div class="reportWriter">
              <el-input
                style="width: 80%"
                v-model="form2.data.processorName"
                placeholder="请选择问题处理人"
                :disabled="true"
              ></el-input>
              <div class="btn" @click="addprocessorName">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </template>
        </SrAdd>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddQueDialog">保 存</el-button>
        <el-button @click="addQueDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <DialogT
      :data="dataCopy"
      :title="title"
      :dialogVisible="commonDialog"
      @close="commonDialogClose"
      @saveSelectData="commonDialogSave"
      ref="commonDialog"
    />
  </div>
  <!-- </section> -->
</template>
<script>
import { api_getCustomFormTemplate } from "@/api/index";
import config from "@/settings.js";
import upload from "@/utils/upload";
import store from "@/store";
import {
  getUserByRoleCode,
  api_getServiceTypeList,
  api_queryProblemPage,
  querySave,
  api_getReportById,
  api_saveProblem,
  api_updateInfo,
  api_deleteProblem,
  api_queryProblemDetailById,
  api_delReportById,
  api_queryAllProblemPage,
  saveOrUpdateReportByContract,
  getSonReportById,
  searckWeeklyDraft,
} from "@/api/report/index";
import {
  getProjectDetail,
  queryUsersByBuProperty,
} from "@/api/planProject/index";
import {
  api_getReportByProjectId,
  getReportByContractId,
} from "@/api/report/index";
import DialogT from "../component/DialogT.vue";
import { quillEditor } from "vue-quill-editor";

import { debounce } from "@/utils/debounce";
const toolbarOptions = [
  [
    {
      header: 1,
    },
  ],
  [
    {
      direction: "rtl",
    },
  ],
  [
    {
      color: [],
    },
    {
      background: [],
    },
  ],
  ["bold", "italic", "underline"],
  [
    {
      list: "ordered",
    },
    {
      list: "bullet",
    },
  ],
  [
    {
      indent: "-1",
    },
    {
      indent: "+1",
    },
  ],
  [
    {
      align: [],
    },
  ],
  ["clean"],
];
export default {
  name: "reportAdd",
  components: { DialogT, quillEditor },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {},
  updated() {},
  data() {
    return {
      isFromWorkBench: false, //是否从工作台进入
      editorOption: {
        placeholder: "请输入工作推进情况...",
        modules: {
          toolbar: {
            container: toolbarOptions,
          },
        },
      },
      editorOption1: {
        placeholder: "请输入下周工作计划...",
        modules: {
          toolbar: {
            container: toolbarOptions,
          },
        },
      },
      activeName: "1",
      tabList: [{ title: "基本信息", code: "1" }],
      templateId: this.$route.query.templateId,
      clickmethods: { tg: this.tg, btg: this.btg, fh: this.fh },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
            {
              btnValue: "btg",
              btnName: "保存草稿",
              btnType: "primary",
              btnEventType: "btg",
              slotName: "btg",
            },
            {
              btnValue: "fh",
              btnName: "返回列表",
              btnType: "",
              btnEventType: "fh",
            },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      showDatePicker: true,
      // 新增周报
      form: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "select",
            name: "系统名称",
            placeholder: "请选择系统名称",
            bind: "systemName",
            dataList: "systemNameList",
            trigger: "change",
            col: 8,
            filterable: true,
            required: "系统名称不能为空",
          },
          {
            type: "select",
            name: "项目名称",
            placeholder: "请选择项目名称",
            bind: "projectName",
            dataList: "projectNameList",
            trigger: "change",
            col: 8,
            filterable: true,
            required: "项目名称不能为空",
          },
          {
            type: "select",
            name: "项目负责人",
            placeholder: "请选择项目负责人",
            // bind: "contactJfid",
            bind: "contactName",
            dataList: "contactNameList",
            trigger: "change",
            col: 8,
            filterable: true,
            disabled:
              JSON.parse(sessionStorage.getItem("userInfo")).currentRole
                .roleCode == "FZGHC_JBRBF"
                ? false
                : true,
            // required: "项目负责人不能为空",
          },
          {
            type: "select",
            name: "所属阶段",
            placeholder: "请选择所属阶段",
            bind: "projectMaturity",
            dataList: "projectMaturityList",
            trigger: "change",
            col: 8,
            filterable: true,
            // required: "所属阶段不能为空",
          },
          {
            slotName: "reportPeriod",
            type: "slot",
            // type: "dateSelect",
            timeType: "daterange",
            name: "报告周期",
            bind: "reportPeriod",
            // disabled: true,禁用
            // readonly: true,只读
            // unlinkPanels: true,
            col: 8,
            startname: "startTime;",
            endname: "endTime;",
            required: "报告周期不能为空",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            format: "yyyy-MM-dd",
          },
          {
            slotName: "season",
            type: "slot",
            name: "周报期别",
            placeholder: "请输入周报期别",
            bind: "season",
            col: 8,
            // required: "周报期别不能为空",
            trigger: "blur",
            rules: {
              regular_Number3: "只能输入数字",
            },
          },
          {
            slotName: "progress",
            type: "slot",
            name: "工作推进情况",
            placeholder: "请输入工作推进情况",
            bind: "progress",
            col: 24,
            maxlength: 1000,
            trigger: "blur",
            minHeight: 150,
            resize: "none",
            required: "工作推进情况不能为空",
            items: [
              "formatblock",
              // "fontname",
              "fontsize",
              "|",
              "forecolor", // 文字颜色
              "hilitecolor", // 背景颜色
              "bold", // 加粗
              "italic", // 斜体
              "underline", // 下划线
              // "strikethrough", // 删除线
              "lineheight", // 行距
              "|",
              "justifyleft",
              "justifycenter",
              "justifyright",
              "justifyfull",
              "insertorderedlist",
              "insertunorderedlist",
              "indent",
              "outdent",
            ],
          },
          {
            slotName: "nextWorkPlan",
            type: "slot",
            name: "下周工作计划",
            placeholder: "请输入下周工作计划",
            bind: "nextWorkPlan",
            col: 24,
            maxlength: 1000,
            trigger: "blur",
            minHeight: 150,
            required: "下周工作计划不能为空",
            items: [
              "formatblock",
              // "fontname",
              "fontsize",
              "|",
              "forecolor", // 文字颜色
              "hilitecolor", // 背景颜色
              "bold", // 加粗
              "italic", // 斜体
              "underline", // 下划线
              // "strikethrough", // 删除线
              "lineheight", // 行距
              "|",
              "justifyleft",
              "justifycenter",
              "justifyright",
              "justifyfull",
              "insertorderedlist",
              "insertunorderedlist",
              "indent",
              "outdent",
            ],
          },
          /* {
            type: "textarea",
            name: "工作推进情况",
            placeholder: "请输入工作推进情况",
            bind: "progress",
            col: 24,
            maxlength: 1000,
            row: 5,
            resize: "none",
            required: "工作推进情况不能为空",
          }, 
          {
            type: "textarea",
            name: "下周工作计划",
            placeholder: "请输入下周工作计划",
            bind: "nextWorkPlan",
            col: 24,
            maxlength: 1000,
            row: 3,
            resize: "horizontal",
            required: "下周工作计划不能为空",
          },*/
          {
            type: "slot",
            slotName: "existProblem",
            name: "存在的问题",
            // placeholder: "请输入下周工作计划",
            // bind: "problemId",
            col: 24,
            // required: "下周工作计划不能为空",
          },
          {
            type: "slot",
            slotName: "addProblem",
            name: "新增问题",
            // placeholder: "请输入下周工作计划",
            // bind: "problemDto",
            col: 24,
            // required: "下周工作计划不能为空",
          },
          {
            type: "upload",
            name: "附件",
            className: "fujian",
            bind: "weeklyFile",
            fileList: [],
            fileTip:
              "支持扩展名:.doc.docx.pdf.xls.xlsx.ppt.jpg.png，最多上传5个文件，每个文件大小不超过20MB",
            fileType: "doc,docx,pdf,xls,xlsx,ppt,jpg,png",
            limit: 5,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          systemName: "", //系统名称
          projectName: "", //项目名称
          contactJfid: "", //项目负责人jfid
          contactName: "", //项目负责人
          projectMaturity: "", //所属阶段
          reportPeriod: "", //报告周期
          season: "", //周期类别
          progress: "", //工作推进情况
          nextWorkPlan: "", //下周工作计划
          problemId: [], //存在问题
          problemDto: [], //新增问题
          weeklyFile: [], //附件
        },
        enums: {
          contactNameList: [], //项目负责人
          systemNameList: [], //系统名称
          projectNameList: [], //项目名称
          projectMaturityList: [
            {
              dataValue: "建设实施阶段",
              dataName: "建设实施阶段",
            },
            {
              dataValue: "方案编制阶段",
              dataName: "方案编制阶段",
            },
            {
              dataValue: "初步上线",
              dataName: "初步上线",
            },
            {
              dataValue: "未启动",
              dataName: "未启动",
            },
          ], //所属阶段
        },
      },
      reportPeriodStrat: "", //报告周期
      reportPeriodEnd: "", //报告周期
      /**报告周期参考 
      reportPeriodStratView: "", //报告周期参考
      reportPeriodEndView: "", //报告周期参考
      */
      // 新增问题
      addQueDialog: false,
      form2: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "input",
            name: "问题描述",
            placeholder: "请输入问题描述",
            bind: "description",
            col: 24,
            required: "问题描述不能为空",
          },
          {
            type: "select",
            name: "问题类型",
            placeholder: "请选择问题类型",
            // bind: "problemType",
            bind: "type",
            dataList: "problemTypeList",
            trigger: "change",
            col: 12,
            required: "问题类型不能为空",
          },
          {
            type: "select",
            name: "问题等级",
            placeholder: "请选择问题等级",
            // bind: "problemLevel",
            bind: "level",
            dataList: "problemLevelList",
            trigger: "change",
            col: 12,
            required: "问题等级不能为空",
          },
          {
            type: "input",
            name: "提出人",
            placeholder: "请输入提出人",
            bind: "proposerName",
            disabled: true,
            col: 24,
            required: "提出人不能为空",
          },
          {
            type: "slot",
            slotName: "processorName",
            name: "问题处理人",
            placeholder: "请选择问题处理人",
            bind: "processorName",
            dataList: "processorList",
            col: 24,
            required: "提出人不能为空",
          },
          {
            type: "input",
            name: "责任处室/部门",
            placeholder: "请输入责任处室/部门",
            bind: "departName",
            col: 12,
            // required: "责任处室/部门不能为空",
          },
          {
            type: "slot",
            slotName: "liablerName",
            name: "责任人",
            placeholder: "请选择责任人",
            bind: "liablerName",
            dataList: "liablerNameList",
            trigger: "change",
            col: 12,
            // required: "责任人不能为空",
          },
        ],
        data: {
          description: "", //问题描述
          // problemType: "", //问题类型
          // problemLevel: "", //问题等级
          type: "",
          level: "",
          proposer: "", //提出人jfid
          proposerName: "", //提出人fullname
          departName: "", //部门
          liablerName: "", //责任人
          liabler: "", //责任人id
          processorName: "", //问题处理人
          processor: "", //问题处理人Id
          processorBuid: "", //问题处理人buid
          processorRoleCode: "", //问题处理人角色
          contractId: this.$route.query.contractId || "",
        },
        enums: {
          problemTypeList: [
            {
              dataValue: "2",
              dataName: "外部问题",
            },
            {
              dataValue: "1",
              dataName: "内部问题",
            },
            {
              dataValue: "3",
              dataName: "云网问题",
            },
          ],
          problemLevelList: [
            {
              dataValue: "2",
              dataName: "严重",
            },
            {
              dataValue: "1",
              dataName: "一般",
            },
            {
              dataValue: "0",
              dataName: "轻微",
            },
          ],
          // clientManagerList: [],

          // contractUnitFullName: [],
          // controlUnitFullName: [],
        },
      },
      //
      table: {
        data: [], // 表格数据
        data2: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          // load: this.load,
          tooltipEffect: "light",
          header: [
            {
              label: "问题描述",
              prop: "description",
              isShow: true,
              index: 1,
              // width: "150px",
            },
            { label: "提出人", prop: "proposerName", isShow: true, index: 2 },
            {
              label: "提出时间",
              prop: "proposeTime",
              isShow: true,
              index: 3,
              width: "150px",
            },
            {
              label: "更新时间",
              prop: "updateTime",
              isShow: true,
              index: 4,
              width: "150px",
            },
          ],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "120",
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
              name: "删除", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "delQue", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          minSize: 5,
          pages: 10, //总页数
          pageSize: 5, //每页展示多少个
          pageSizes: [5, 10, 15],
          pageNum: 1, //当前页
          background: true,
          layout: "total, prev, pager, next, sizes,jumper",
        },
      },
      table2: {
        data: [], // 表格数据
        data2: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          // load: this.load,
          tooltipEffect: "light",
          header: [
            {
              label: "问题描述",
              prop: "description",
              isShow: true,
              index: 1,
              // width: "150px",
            },
            { label: "提出人", prop: "proposerName", isShow: true, index: 2 },
            {
              label: "提出时间",
              prop: "proposeTime",
              isShow: true,
              index: 3,
              width: "150px",
            },
            {
              label: "更新时间",
              prop: "updateTime",
              isShow: true,
              index: 4,
              width: "150px",
            },
          ],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "120",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
            hideHeaderSetting: true,
          },
          innerBtn: [
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "editQue", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "delQue2", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          minSize: 5,
          pages: 10, //总页数
          pageSize: 5, //每页展示多少个
          pageSizes: [5, 10, 15],
          pageNum: 1, //当前页
          background: true,
          layout: "total, prev, pager, next, sizes,jumper",
        },
      },
      exitQueDialog: false,
      exitQueProjectList: [],
      table3: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          // load: this.load,
          tooltipEffect: "light",
          header: [
            {
              label: "问题描述",
              prop: "description",
              isShow: true,
              index: 1,
              // width: "150px",
            },
            { label: "提出人", prop: "proposerName", isShow: true, index: 2 },
            {
              label: "提出时间",
              prop: "proposeTime",
              isShow: true,
              index: 3,
              width: "150px",
            },
            {
              label: "更新时间",
              prop: "updateTime",
              isShow: true,
              index: 4,
              width: "150px",
            },
          ],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: true,
            width: "40",
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "120",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
            hideHeaderSetting: true,
          },
          innerBtn: [
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "editQue", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "delQue2", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          minSize: 5,
          pages: 10, //总页数
          pageSize: 5, //每页展示多少个
          pageSizes: [5, 10, 15],
          pageNum: 1, //当前页
          background: true,
          layout: "total, prev, pager, next, sizes,jumper",
        },
      },
      userInfo: store.getters.userInfo,
      problemIds: [], //获取新增问题的id
      commonDialog: false,
      datazb1: [],
      datazb2: [],
      datazb3: [],
      datazbAll: [],
      dataCopy: [],
      title: {},
      userInfo: store.getters.userInfo,
      isShowBtn: 0,
      // 填报周期数据
      addReportTimes: [],
      weekStartTime: "",
    };
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    },
    id() {
      return this.$route.query.id;
    },
    pageNum() {
      return this.$route ? this.$route.query.pageNum : "";
    },
    systemName() {
      return this.$route ? this.$route.query.systemName : "";
    },
    projectName() {
      return this.$route ? this.$route.query.projectName : "";
    },
    contractId() {
      return this.$route ? this.$route.query.contractId : "";
    },
    contactSPId() {
      return this.$route ? this.$route.query.contactSPId : "";
    },
    contractName() {
      return this.$route ? this.$route.query.contractName : "";
    },
    sectionSort() {
      return this.$route.query && this.$route.query.sectionSort
        ? this.$route.query.sectionSort
        : "";
    },

    expireTimeOPtion() {
      let that = this;
      return {
        disabledDate(time) {
          // 禁用周六和周日
          return time.getDay() === 6 || time.getDay() === 0;
        },
        // disabledDate(time) {
        //   let now = new Date(
        //     that.weekStartTime ? that.weekStartTime : new Date()
        //   );
        //   let nowTime = now.getTime();
        //   let day = now.getDay();
        //   let oneTime = 24 * 60 * 60 * 1000;
        //   let sun = new Date(nowTime + (7 - day - 7) * oneTime);
        //   // 周六，周日
        //   let isDis = time.getDay() == 6 || time.getDay() == 0;
        //   let afterDis = time.getTime() <= sun.getTime();
        //   return isDis || afterDis;
        // },
      };
    },
  },
  created() {
    if (this.$route.query.isReadonly) {
      this.$set(this.form.config[0], "disabled", true);
      this.$set(this.form.config[1], "disabled", true);
      // this.$set(this.form.config[2], "disabled", true);
      this.$set(this.form.config[3], "disabled", true);
    }
    // 周报默认周一到周五
    // const { monday, friday } = this.getCurrentWeekDates();
    // this.$set(this.form.data, "reportPeriod", [monday, friday]);
    // 获取责任人
    this.queryUsersByBuProperty();
    // 获取系统名称
    this.getSystemInfo();

    // 获取项目负责人枚举
    this.getUserCount("XMFZR");
    // this.getEnums("JFZG_PROJECTRISK_TYPE", this.form2.enums.problemTypeList);
    // 获取存在问题列表
    this.getExitQueList();
  },
  mounted() {
    console.log(
      "88887777777777777777777777777777777777777777777",
      this.$route.query
    );
    if (
      this.$route.query.activeName == "待办" ||
      this.$route.query.activeName == "周报填写" ||
      this.$route.query.activeName == "已办"
    ) {
      this.isFromWorkBench = true;
    }
    if (this.id) {
      // 详情
      this.getReportById(this.id);
    } else {
      let now = new Date();
      let nowTime = now.getTime();
      let day = now.getDay();
      let oneTime = 24 * 60 * 60 * 1000;
      let mon = new Date(nowTime - (day - 1) * oneTime)
        .toISOString()
        .split("T")[0];
      let sun = new Date(nowTime + (7 - day) * oneTime)
        .toISOString()
        .split("T")[0];
      this.reportPeriodStrat = mon;
      this.reportPeriodEnd = sun;
      this.form.data.reportPeriod = this.getNowTime();
    }
  },
  methods: {
    backWorkBench() {
      this.$router.go(-1);
    },
    getCurrentWeekDates() {
      const today = new Date();
      const monday = new Date(today);
      const day = today.getDay(); // 0 是周日，1 是周一，以此类推
      console.log(monday, monday.getDay(), monday.getDate());
      monday.setDate(monday.getDate() - day + (day === 0 ? -6 : 1));
      const friday = new Date(monday);
      friday.setDate(friday.getDate() + 4);
      return {
        monday: monday.toISOString().split("T")[0],
        friday: friday.toISOString().split("T")[0],
      };
    },
    reportPeriodChange(e) {
      if (e == null) {
        this.showDatePicker = true;
      } else {
        let now = new Date(e);
        let nowTime = now.getTime();
        let day = now.getDay();
        let oneTime = 24 * 60 * 60 * 1000;
        let mon = new Date(nowTime - (day - 1) * oneTime)
          .toISOString()
          .split("T")[0];
        let sun = new Date(nowTime + (7 - day) * oneTime)
          .toISOString()
          .split("T")[0];
        this.reportPeriodStrat = mon;
        this.reportPeriodEnd = sun;
        this.showDatePicker = false;
      }
    },
    reportPeriodStratHandel() {
      this.showDatePicker = true;
    },
    getNowTime() {
      var date = new Date();
      var seperator1 = "-";

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var strDate = date.getDate();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },

    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subdecl", this.$setState, timeout);
    },
    // 获取项目负责人枚举
    getUserCount(roleCode) {
      getUserByRoleCode({ roleCode }).then((res) => {
        res.data.map((item) => {
          this.form.enums.contactNameList.push({
            dataName: String(item.fullname),
            dataValue: String(item.jfid),
          });
        });
      });
    },
    getEnums(topic, list) {
      api_getServiceTypeList({ topic }).then((res) => {
        res.data.map((item) => {
          list.push({
            dataName: String(item.chName),
            dataValue: String(item.itemCode),
          });
        });
      });
    },

    // getNowTime

    // 获取系统信息
    getSystemInfo() {
      // this.projectId
      getProjectDetail({ id: this.projectId }).then((res) => {
        let {
          systemName,
          projectName,
          contactId,
          projectMaturity,
          contactName,
        } = res.data;
        this.$set(this.form.data, "systemName", systemName);
        this.$set(this.form.data, "projectName", projectName);
        this.$set(this.form.data, "contactName", contactName);
        this.$set(this.form.data, "projectMaturity", projectMaturity);
        this.$set(this.form.data, "contactJfid", contactId);

        if (this.$route.query.contractId) {
          res.data.menberFieldInfoList.forEach((item) => {
            if (this.$route.query.contractId == item.contractId) {
              this.weekStartTime = item.weeklyStartTime;
            }
          });
        } else {
          this.weekStartTime = res.data.weeklyStartTime;
        }
      });
    },
    // 获取存在问题列表
    getExitQueList(isDraft = 1, problemIds = []) {
      api_queryProblemPage({
        pageNu: isDraft ? this.table3.page.pageNum : 1,
        pageSize: isDraft ? this.table3.page.pageSize : 5,
        projectId: this.projectId,
        problemIds: problemIds,
        isDraft: isDraft,
      }).then((res) => {
        if (res.data) {
          /* // 新增问题表格
          this.table2.data.push(...res.data.records);
          this.table2.page.total = this.table2.data.length;
          this.problemIds = this.table2.data.map((item) => item.id);
          console.log(this.problemIds);
        } else { */
          // 存在问题表格弹框
          this.table3.data = res.data.records;
          console.log(
            this.table3.data,
            "this.table3.datathis.table3.datathis.table3.data"
          );
          this.table3.page.total = res.data.total;
        }
      });
    },
    // 获取新增问题列表
    queryAllProblemPage(problemIds = []) {
      api_queryAllProblemPage({
        pageNu: this.table2.page.pageNum,
        pageSize: this.table3.page.pageSize,
        projectId: this.projectId,
        problemIds: problemIds,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.table2.data = res.data;
          this.table2.page.total = this.table2.data.length;
          this.problemIds = this.table2.data.map((item) => item.id);
          this.table2.data2 = this.table2.data.slice(0, 5);
          console.log(
            this.problemIds,
            this.table2.data,
            this.table2.page.total
          );
        }
      });
    },
    // 获取详情
    getReportById(id) {
      if (this.$route.query.contractId) {
        getSonReportById({ id }).then((res) => {
          let { weeklyFile, startTime, endTime, contactName, contactJfid } =
            res.data[0];

          console.log(weeklyFile, "weeklyFile");
          let startTimeView = res.data[0].startTime;
          let endTimeView = res.data[0].endTime;
          this.isShowBtn = res.data[0].isDraft;

          // res.data[0].reportPeriod = [startTime, endTime];
          this.showDatePicker = false;
          this.reportPeriodStrat = startTime.includes("00")
            ? startTime.split(" ")[0]
            : startTime;
          this.reportPeriodEnd = endTime;

          this.reportPeriodStratView = startTimeView.includes("00")
            ? startTimeView.split(" ")[0]
            : startTimeView;
          this.reportPeriodEndView = endTimeView;

          res.data[0].weeklyFile = weeklyFile ? JSON.parse(weeklyFile) : [];


          this.table2.data = res.data[0].problemDto
            ? res.data[0].problemDto
            : [];
          this.table2.page.total = this.table2.data.length;
          this.problemIds = this.table2.data.map((item) => item.id);
          this.table2.data2 = this.table2.data.slice(0, 5);
          // console.log("this.problemIds", this.problemIds, this.table2.page.total);
          this.table.data = res.data[0].alreadyExistProblemDto
            ? res.data[0].alreadyExistProblemDto
            : [];
          this.table.page.total = this.table.data.length;
          this.table.data2 = this.table.data.slice(0, 5);
          this.contactName = contactName;
          this.contactJfid = contactJfid;
          this.form.data = res.data[0];
          this.$set(this.form.data, "reportPeriod", this.getNowTime());
        });
      } else {
        
        api_getReportById({ id }).then((res) => {
          let { weeklyFile, startTime, endTime, contactName, contactJfid } =
            res.data[0];

          let startTimeView = res.data[0].startTime;
          let endTimeView = res.data[0].endTime;
          this.isShowBtn = res.data[0].isDraft;

          // res.data[0].reportPeriod = [startTime, endTime];
          this.showDatePicker = false;
          this.reportPeriodStrat = startTime.includes("00")
            ? startTime.split(" ")[0]
            : startTime;
          this.reportPeriodEnd = endTime;
          // weeklyFile

          this.reportPeriodStratView = startTimeView.includes("00")
            ? startTimeView.split(" ")[0]
            : startTimeView;
          this.reportPeriodEndView = endTimeView;

          res.data[0].weeklyFile = weeklyFile ? JSON.parse(weeklyFile) : [];

          this.table2.data = res.data[0].problemDto
            ? res.data[0].problemDto
            : [];

          console.log(res.data[0].weeklyFile, "res.data[0].weeklyFile");
          this.table2.page.total = this.table2.data.length;
          this.problemIds = this.table2.data.map((item) => item.id);
          this.table2.data2 = this.table2.data.slice(0, 5);
          // console.log("this.problemIds", this.problemIds, this.table2.page.total);
          this.table.data = res.data[0].alreadyExistProblemDto
            ? res.data[0].alreadyExistProblemDto
            : [];
          this.table.page.total = this.table.data.length;
          this.table.data2 = this.table.data.slice(0, 5);
          this.contactName = contactName;
          this.contactJfid = contactJfid;
          this.form.data = res.data[0];
          this.$set(this.form.data, "reportPeriod", this.getNowTime());
        });
      }
    },

    // 报告周期重复提交

    tg: debounce(function () {
      let data = this.$refs["add"][0].validate();

      this.$refs["add"][0].validate((valid) => {
        if (valid) {
          searckWeeklyDraft({
            beginTime: this.reportPeriodStrat,
            endTime: this.reportPeriodEnd,
            projectId: this.$route.query.projectId,
            contractId: this.$route.query.contractId
              ? this.$route.query.contractId
              : 0,
          }).then((res) => {
            if (!res.data.nonDraft) {
              let params = {
                ...data,
                // ...obj,
                // 其他附件
                weeklyFile:
                  Array.isArray(data.weeklyFile) &&
                  JSON.stringify(data.weeklyFile),
              };
              // params.templateId = this.templateId;
              // params.startTime = params.reportPeriod[0];
              // params.endTime = params.reportPeriod[1];
              params.startTime = this.reportPeriodStrat;
              params.endTime = this.reportPeriodEnd;
              params.projectId = this.projectId;
              params.progress = this.form.data.progress;
              params.nextWorkPlan = this.form.data.nextWorkPlan;
              params.isDraft = 1;
              params.problemDto = this.table2.data;
              params.problemId = this.table.data.map((item) => item.id);
              params.sectionSort = this.sectionSort;
              if (this.$route.query.id) {
                params.id = this.$route.query.id;
              } else {
                params.id = "";
              }
              if (this.$route.query.contractName) {
                params.contractName = this.$route.query.contractName;
              }
              // if (this.$route.query.contractName) {
              //   params.contractName = this.$route.query.contractName;
              // }
              if (this.$route.query.contractId) {
                params.contractId = this.$route.query.contractId;
              }
              // else if (
              //         getSession("infoId_projectRecordAdd") &&
              //         getSession("infoId_projectRecordAdd") != "null"
              //       ) {
              //         params.id = getSession("infoId_projectRecordAdd");
              //         this.isNew = true;
              //       } else {
              //         this.isNew = false;
              //       }
              console.log(params, data);
              // return;
              if (this.$route.query.contractId) {
                // 合同填报
                saveOrUpdateReportByContract(params).then((res) => {
                  console.log(params);
                  clearInterval(this.timer);
                  if (res.msg.code == "0000") {
                    this.$message.success("提交成功");
                    if (this.isNew == true) {
                      this.get_success = true;
                    } else {
                      this.routeClose();

                      let path = this.$route.path;
                      console.log(path, "路由路径");
                      if (path == "/report/reportAdd") {
                        this.$router.push({
                          name: "reportList",
                        });
                      } else if (path == "/report/reportEdit") {
                        this.$router.push({
                          name: "reportList",
                          query: {
                            projectId: this.projectId,
                            id: this.id,
                            systemName: this.systemName,
                            projectName: this.projectName,
                            pageNum: this.pageNum,
                            contractId: this.contractId,
                            contactSPId: this.contactSPId,
                            contractName: this.$route.query.contractName,
                            sectionSort: this.$route.query.sectionSort,
                          },
                        });
                      }
                    }
                  }
                });
              } else {
                querySave(params).then((res) => {
                  console.log(params);
                  clearInterval(this.timer);
                  if (res.msg.code == "0000") {
                    this.$message.success("提交成功");
                    if (this.isNew == true) {
                      this.get_success = true;
                    } else {
                      this.routeClose();

                      let path = this.$route.path;
                      console.log(path, "路由路径");
                      if (path == "/report/reportAdd") {
                        this.$router.push({
                          name: "reportList",
                        });
                      } else if (path == "/report/reportEdit") {
                        this.$router.push({
                          name: "reportList",
                          query: {
                            projectId: this.projectId,
                            id: this.id,
                            systemName: this.systemName,
                            projectName: this.projectName,
                            pageNum: this.pageNum,
                            contractId: this.contractId,
                            contactSPId: this.contactSPId,
                            contractName: this.$route.query.contractName,
                            sectionSort: this.$route.query.sectionSort,
                          },
                        });
                      }
                    }
                  }
                });
              }
            } else {
              this.$confirm(
                "当前报告周期的周报会把之前相同报告周期的周报覆盖, 是否继续?",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  let params = {
                    ...data,
                    // ...obj,
                    // 其他附件
                    weeklyFile:
                      Array.isArray(data.weeklyFile) &&
                      JSON.stringify(data.weeklyFile),
                  };
                  // params.templateId = this.templateId;
                  // params.startTime = params.reportPeriod[0];
                  // params.endTime = params.reportPeriod[1];
                  params.startTime = this.reportPeriodStrat;
                  params.endTime = this.reportPeriodEnd;
                  params.projectId = this.projectId;
                  params.progress = this.form.data.progress;
                  params.nextWorkPlan = this.form.data.nextWorkPlan;
                  params.isDraft = 1;
                  params.problemDto = this.table2.data;
                  params.problemId = this.table.data.map((item) => item.id);
                  params.sectionSort = this.sectionSort;
                  if (this.$route.query.id) {
                    params.id = this.$route.query.id;
                  } else {
                    params.id = "";
                  }
                  if (this.$route.query.contractName) {
                    params.contractName = this.$route.query.contractName;
                  }
                  // if (this.$route.query.contractName) {
                  //   params.contractName = this.$route.query.contractName;
                  // }
                  if (this.$route.query.contractId) {
                    params.contractId = this.$route.query.contractId;
                  }
                  // else if (
                  //     getSession("infoId_projectRecordAdd") &&
                  //     getSession("infoId_projectRecordAdd") != "null"
                  //   ) {
                  //     params.id = getSession("infoId_projectRecordAdd");
                  //     this.isNew = true;
                  //   } else {
                  //     this.isNew = false;
                  //   }
                  console.log(params, data);
                  // return;
                  if (this.$route.query.contractId) {
                    // 合同填报
                    saveOrUpdateReportByContract(params).then((res) => {
                      console.log(params);
                      clearInterval(this.timer);
                      if (res.msg.code == "0000") {
                        this.$message.success("提交成功");
                        if (this.isNew == true) {
                          this.get_success = true;
                        } else {
                          this.routeClose();

                          let path = this.$route.path;
                          console.log(path, "路由路径");
                          if (path == "/report/reportAdd") {
                            this.$router.push({
                              name: "reportList",
                            });
                          } else if (path == "/report/reportEdit") {
                            this.$router.push({
                              name: "reportList",
                              query: {
                                projectId: this.projectId,
                                id: this.id,
                                systemName: this.systemName,
                                projectName: this.projectName,
                                pageNum: this.pageNum,
                                contractId: this.contractId,
                                contactSPId: this.contactSPId,
                                contractName: this.$route.query.contractName,
                                sectionSort: this.$route.query.sectionSort,
                              },
                            });
                          }
                        }
                      }
                    });
                  } else {
                    querySave(params).then((res) => {
                      console.log(params);
                      clearInterval(this.timer);
                      if (res.msg.code == "0000") {
                        this.$message.success("提交成功");
                        if (this.isNew == true) {
                          this.get_success = true;
                        } else {
                          this.routeClose();

                          let path = this.$route.path;
                          console.log(path, "路由路径");
                          if (path == "/report/reportAdd") {
                            this.$router.push({
                              name: "reportList",
                            });
                          } else if (path == "/report/reportEdit") {
                            this.$router.push({
                              name: "reportList",
                              query: {
                                projectId: this.projectId,
                                id: this.id,
                                systemName: this.systemName,
                                projectName: this.projectName,
                                pageNum: this.pageNum,
                                contractId: this.contractId,
                                contactSPId: this.contactSPId,
                                contractName: this.$route.query.contractName,
                                sectionSort: this.$route.query.sectionSort,
                              },
                            });
                          }
                        }
                      }
                    });
                  }
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消",
                  });
                });
            }
          });
        }
      });
    }, 2000),
    btg: debounce(function () {
      this.$refs["add"][0].validate((valid) => {
        if (valid) {
          if (valid) {
            searckWeeklyDraft({
              beginTime: this.reportPeriodStrat,
              endTime: this.reportPeriodEnd,
              projectId: this.$route.query.projectId,
              contractId: this.$route.query.contractId
                ? this.$route.query.contractId
                : 0,
            }).then((res) => {
              if (!res.data.draft) {
                let params = {
                  ...this.form.data,
                };
                // 其他附件
                (params.weeklyFile =
                  Array.isArray(params.weeklyFile) &&
                  JSON.stringify(params.weeklyFile)),
                  // params.templateId = this.templateId;
                  (params.startTime = params.reportPeriodStrat || "");
                // (params.startTime = params.reportPeriod[0] || "");
                // params.endTime = params.reportPeriod[1] || "";
                params.progress = this.form.data.progress;
                params.nextWorkPlan = this.form.data.nextWorkPlan;
                params.startTime = this.reportPeriodStrat;
                params.endTime = this.reportPeriodEnd;
                params.projectId = this.projectId;
                params.isDraft = 0;
                params.problemDto = this.table2.data;
                params.problemId = this.table.data.map((item) => item.id);
                params.sectionSort = this.sectionSort;
                if (this.$route.query.id) {
                  params.id = this.$route.query.id;
                } else {
                  params.id = "";
                }
                if (this.$route.query.contractName) {
                  params.contractName = this.$route.query.contractName;
                }
                // if (this.$route.query.contractName) {
                //   params.contractName = this.$route.query.contractName;
                // }
                if (this.$route.query.contractId) {
                  params.contractId = this.$route.query.contractId;
                }
                console.log(params);
                // return;
                if (this.$route.query.contractId) {
                  // 合同填报
                  saveOrUpdateReportByContract(params).then((res) => {
                    console.log(params);
                    clearInterval(this.timer);
                    if (res.msg.code == "0000") {
                      this.$message.success("保存成功");
                      if (this.isNew == true) {
                        this.get_success = true;
                      } else {
                        this.routeClose();

                        let path = this.$route.path;
                        console.log(path, "路由路径");
                        if (path == "/report/reportAdd") {
                          this.$router.push({
                            name: "reportList",
                            query: {
                              contractName: this.$route.query.contractName,
                              sectionSort: this.$route.query.sectionSort,
                              projectId: this.projectId,
                              id: this.id,
                              ProjectIdNum: this.$route.query.ProjectIdNum
                                ? this.$route.query.ProjectIdNum
                                : "",
                              ContractIdNum: this.$route.query.ContractIdNum
                                ? this.$route.query.ContractIdNum
                                : "",
                              systemName: this.systemName,
                              projectName: this.projectName,
                              pageNum: this.pageNum,
                            },
                          });
                        } else if (path == "/report/reportEdit") {
                          this.$router.push({
                            name: "reportList",
                            query: {
                              projectId: this.projectId,
                              id: this.id,
                              ProjectIdNum: this.$route.query.ProjectIdNum
                                ? this.$route.query.ProjectIdNum
                                : "",
                              ContractIdNum: this.$route.query.ContractIdNum
                                ? this.$route.query.ContractIdNum
                                : "",
                              systemName: this.systemName,
                              projectName: this.projectName,
                              pageNum: this.pageNum,
                              contractId: this.contractId,
                              contactSPId: this.contactSPId,
                              contractName: this.$route.query.contractName,
                              sectionSort: this.$route.query.sectionSort,
                            },
                          });
                        }
                      }
                    }
                  });
                } else {
                  querySave(params).then((res) => {
                    console.log(params);
                    clearInterval(this.timer);
                    if (res.msg.code == "0000") {
                      this.$message.success("保存成功");
                      if (this.isNew == true) {
                        this.get_success = true;
                      } else {
                        this.routeClose();

                        let path = this.$route.path;
                        console.log(path, "路由路径");
                        if (path == "/report/reportAdd") {
                          this.$router.push({
                            name: "reportList",
                            // query: {
                            //   contractName: this.$route.query.contractName,
                            //   sectionSort: this.$route.query.sectionSort,
                            //   projectId: this.projectId,
                            //   id: this.id,
                            //   systemName: this.systemName,
                            //   projectName: this.projectName,
                            //   pageNum: this.pageNum,
                            // },
                          });
                        } else if (path == "/report/reportEdit") {
                          this.$router.push({
                            name: "reportList",
                            query: {
                              projectId: this.projectId,
                              id: this.id,
                              systemName: this.systemName,
                              projectName: this.projectName,
                              pageNum: this.pageNum,
                              contractId: this.contractId,
                              contactSPId: this.contactSPId,
                              contractName: this.$route.query.contractName,
                              sectionSort: this.$route.query.sectionSort,
                            },
                          });
                        }
                      }
                    }
                  });
                }
              } else {
                this.$confirm(
                  "当前报告周期的周报会把之前相同报告周期的周报覆盖, 是否继续?",
                  "提示",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                  }
                )
                  .then(() => {
                    let params = {
                      ...this.form.data,
                    };
                    // 其他附件
                    (params.weeklyFile =
                      Array.isArray(params.weeklyFile) &&
                      JSON.stringify(params.weeklyFile)),
                      // params.templateId = this.templateId;
                      (params.startTime = params.reportPeriodStrat || "");
                    // (params.startTime = params.reportPeriod[0] || "");
                    // params.endTime = params.reportPeriod[1] || "";
                    params.progress = this.form.data.progress;
                    params.nextWorkPlan = this.form.data.nextWorkPlan;
                    params.startTime = this.reportPeriodStrat;
                    params.endTime = this.reportPeriodEnd;
                    params.projectId = this.projectId;
                    params.isDraft = 0;
                    params.problemDto = this.table2.data;
                    params.problemId = this.table.data.map((item) => item.id);
                    params.sectionSort = this.sectionSort;
                    if (this.$route.query.id) {
                      params.id = this.$route.query.id;
                    } else {
                      params.id = "";
                    }
                    if (this.$route.query.contractName) {
                      params.contractName = this.$route.query.contractName;
                    }
                    // if (this.$route.query.contractName) {
                    //   params.contractName = this.$route.query.contractName;
                    // }
                    if (this.$route.query.contractId) {
                      params.contractId = this.$route.query.contractId;
                    }
                    console.log(params);
                    // return;
                    if (this.$route.query.contractId) {
                      // 合同填报
                      saveOrUpdateReportByContract(params).then((res) => {
                        console.log(params);
                        clearInterval(this.timer);
                        if (res.msg.code == "0000") {
                          this.$message.success("保存成功");
                          if (this.isNew == true) {
                            this.get_success = true;
                          } else {
                            this.routeClose();

                            let path = this.$route.path;
                            console.log(path, "路由路径");
                            if (path == "/report/reportAdd") {
                              this.$router.push({
                                name: "reportList",
                                // query: {
                                //   contractName: this.$route.query.contractName,
                                //   sectionSort: this.$route.query.sectionSort,
                                //   projectId: this.projectId,
                                //   id: this.id,
                                //   systemName: this.systemName,
                                //   projectName: this.projectName,
                                //   pageNum: this.pageNum,
                                // },
                              });
                            } else if (path == "/report/reportEdit") {
                              this.$router.push({
                                name: "reportList",
                                query: {
                                  projectId: this.projectId,
                                  id: this.id,
                                  systemName: this.systemName,
                                  projectName: this.projectName,
                                  pageNum: this.pageNum,
                                  contractId: this.contractId,
                                  contactSPId: this.contactSPId,
                                  contractName: this.$route.query.contractName,
                                  sectionSort: this.$route.query.sectionSort,
                                },
                              });
                            }
                          }
                        }
                      });
                    } else {
                      querySave(params).then((res) => {
                        console.log(params);
                        clearInterval(this.timer);
                        if (res.msg.code == "0000") {
                          this.$message.success("保存成功");
                          if (this.isNew == true) {
                            this.get_success = true;
                          } else {
                            this.routeClose();

                            let path = this.$route.path;
                            console.log(path, "路由路径");
                            if (path == "/report/reportAdd") {
                              this.$router.push({
                                name: "reportList",
                                // query: {
                                //   contractName: this.$route.query.contractName,
                                //   sectionSort: this.$route.query.sectionSort,
                                //   projectId: this.projectId,
                                //   id: this.id,
                                //   systemName: this.systemName,
                                //   projectName: this.projectName,
                                //   pageNum: this.pageNum,
                                // },
                              });
                            } else if (path == "/report/reportEdit") {
                              this.$router.push({
                                name: "reportList",
                                query: {
                                  projectId: this.projectId,
                                  id: this.id,
                                  systemName: this.systemName,
                                  projectName: this.projectName,
                                  pageNum: this.pageNum,
                                  contractId: this.contractId,
                                  contactSPId: this.contactSPId,
                                  contractName: this.$route.query.contractName,
                                  sectionSort: this.$route.query.sectionSort,
                                },
                              });
                            }
                          }
                        }
                      });
                    }
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消",
                    });
                  });
              }
            });
          }
        }
      });
    }, 2000),
    fh() {
      let path = this.$route.path;
      console.log(path, "路由路径");

      if (path == "/report/reportAdd") {
        this.$router.push({
          name: "reportList",
          // query: {
          //   contractName: this.$route.query.contractName,
          //   sectionSort: this.$route.query.sectionSort,
          //   projectId: this.projectId,
          //   id: this.id,
          //   systemName: this.systemName,
          //   projectName: this.projectName,
          //   pageNum: this.pageNum,
          // },
        });
      } else if (path == "/report/reportEdit") {
        this.$router.push({
          name: "reportList",
          query: {
            projectId: this.projectId,
            id: this.id,
            systemName: this.systemName,
            projectName: this.projectName,
            pageNum: this.pageNum,
            contractId: this.contractId,
            contactSPId: this.contactSPId,
            contractName: this.$route.query.contractName,
            sectionSort: this.$route.query.sectionSort,
          },
        });
      }
    },
    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      let start = (val - 1) * this.table.page.pageSize;
      let end = val * this.table.page.pageSize;
      this.table.data2 = this.table.data.slice(start, end);
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.table.data2 = this.table.data.slice(0, val);
    },
    pageChanged2(val) {
      this.table2.page.pageNum = val;
      // this.queryAllProblemPage();
      let start = (val - 1) * this.table2.page.pageSize;
      let end = val * this.table2.page.pageSize;
      this.table2.data2 = this.table2.data.slice(start, end);
      // console.log(start, end, this.table2.data2, this.table2.data);
    },
    sizeChanged2(val) {
      this.table2.page.pageNum = 1;
      this.table2.page.pageSize = val;
      this.table2.data2 = this.table2.data.slice(0, val);
      // this.queryAllProblemPage();
    },
    pageChanged3(val) {
      this.table3.page.pageNum = val;
      this.getExitQueList();
    },
    sizeChanged3(val) {
      this.table3.page.pageNum = 1;
      this.table3.page.pageSize = val;
      this.getExitQueList();
    },
    handleClose() {
      this.$emit("close");
    },

    getQueryBizunitsByPropertyA(d) {
      getQueryBizunitsByProperty({ buPropertyEnum: d }).then((res) => {
        if (d == "CJDW") {
          console.log("sdadadad", res.data);
          res.data.map((element) => {
            console.log("elemenememe", element.buName);
            this.form.enums.contractUnitFullName.push({
              dataName: String(element.buName),
              dataValue: String(element.buid),
            });
          });
          console.log("ioioioi", this.form.enums.contractUnitFullName);
        } else {
          // this.controlUnitFullName = res.data
          res.data.map((element) => {
            console.log("elemenememe", element.buName);
            this.form.enums.controlUnitFullName.push({
              dataName: String(element.buName),
              dataValue: String(element.buid),
            });
          });
        }
      });
    },
    //存在问题--- 选择问题
    selectQue() {
      this.exitQueDialog = true;
      console.log("点击选择问题", this.exitQueDialog);
    },
    // 存在问题选择监听
    exitQueSelected(projectList) {
      console.log("选择的存在问题", projectList);
      this.exitQueProjectList = projectList;
    },
    //存在问题--- 删除
    delQue(row) {
      console.log(row);
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          let index = this.table.data.findIndex((item) => item.id === row.id);
          console.log(index);
          let start = (this.table.page.pageNum - 1) * this.table.page.pageSize;
          let end = this.table.page.pageNum * this.table.page.pageSize;
          this.table.data.splice(index, 1);
          this.table.page.total = this.table.data.length;
          if (this.table.data2.length == 1) {
            this.table.data2 = this.table.data.slice(
              start - this.table.page.pageSize,
              end - this.table.page.pageSize
            );
          } else {
            this.table.data2 = this.table.data.slice(start, end);
          }
          console.log(this.table.data2, this.table.data, start, end);
          // this.table.data2.splice(index, 1);
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        },
      });
    },

    // 存在问题--确定
    saveExitQueDialog() {
      if (this.exitQueProjectList.length == 0) {
        this.$message.warning("请选择数据");
      }
      this.exitQueProjectList = this.exitQueProjectList.filter(
        (item2) => !this.table.data.some((item) => item.id === item2.id)
      );
      this.table.data.push(...this.exitQueProjectList);
      this.table.data2 = this.table.data.slice(0, 5);
      this.table.page.total = this.table.data.length;
      this.exitQueDialog = false;
      this.$refs.selectTable1.$children[0].clearSelection();
    },
    //新增问题-- 新增
    addQue() {
      this.$set(this.form2.data, "proposer", this.userInfo.jfid);
      this.$set(this.form2.data, "proposerName", this.userInfo.fullname);
      this.addQueDialog = true;
    },
    //新增问题-- 编辑
    editQue(row) {
      console.log(row);
      this.addQueDialog = true;
      this.queryProblemDetailById(row.id);
    },
    // 查询问题详情
    queryProblemDetailById(id) {
      api_queryProblemDetailById({ id }).then((res) => {
        if (res.data) {
          this.form2.data = res.data;
        }
      });
    },
    //新增问题-- 删除
    delQue2(row) {
      console.log(row);
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          api_deleteProblem({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              const filteredArray = this.problemIds.filter(
                (item) => item !== row.id
              );
              this.queryAllProblemPage(filteredArray);
              if (this.table2.data.length == 1) {
                this.table2.page.pageNum = this.table2.page.pageNum - 1;
              }
              this.$message({
                type: "info",
                message: "已取消删除",
              });
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
    saveAddQueDialog: debounce(function () {
      let data = this.$refs["add1"].validate();
      this.$refs["add1"].validate((valid) => {
        if (valid) {
          let params = {
            ...data,
          };
          if (!params.id) {
            params.isDraft = 0;
          }
          params.projectId = this.projectId;
          params.contactName = this.form.data.contactName;
          params.contactJfid = this.form.data.contactJfid;
          params.systemName = this.form.data.systemName;
          params.projectName = this.form.data.projectName;
          params.contractId = this.$route.query.contractId;
          // params.console.log(params);
          // return;
          if (params.id) {
            api_updateInfo(params).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("保存成功");
                // this.problemIds.push(params.id);
                this.queryAllProblemPage(this.problemIds);
                this.addQueDialog = false;
              }
            });
          } else {
            api_saveProblem(params).then((res) => {
              if (res.data) {
                this.$message.success("保存成功");
                this.problemIds.push(res.data);
                this.queryAllProblemPage(this.problemIds);
                this.addQueDialog = false;
              }
            });
          }
        }
      });
    }, 5000),
    addQueDialogClose() {
      console.log("关闭前的回调");
      this.form2.data = Object.assign(
        {},
        {
          description: "", //问题描述
          // problemType: "", //问题类型
          // problemLevel: "", //问题等级
          type: "",
          level: "",
          proposer: "", //提出人jfid
          proposerName: "", //提出人fullname
        }
      );
      console.log(this.$refs["add1"]);
      this.$nextTick(() => {
        this.$refs["add1"].$children[0].clearValidate();
      });
      // console.log(this.$refs["add1"].$children[0].clearValidate())
      // this.$refs["add1"].clearValidateItem({ bind: "level" });
    },
    selected() {
      console.log("选择");
    },
    async queryUsersByBuProperty() {
      const res1 = await queryUsersByBuProperty(3);
      const res2 = await queryUsersByBuProperty(40);
      const res3 = await queryUsersByBuProperty(4);
      this.datazbAll.push(...res1.data);
      this.datazbAll.push(...res2.data);
      this.datazbAll.push(...res3.data);
      this.datazbAll = this.datazbAll.map((item, index) => {
        const buid = item.buid;
        const buName = item.buName;
        const buUniqueCode = item.buUniqueCode;
        const userBaseInfoVos = [];
        userBaseInfoVos.push({
          jfid: item.jfid,
          roleCode: item.roleCode,
          buid: item.buid,
          buName: item.buName,
          roleName: item.roleName,
          fullname: item.fullname,
          buUniqueCode: item.buUniqueCode,
        });
        return {
          buid,
          buName,
          buUniqueCode,
          userBaseInfoVos,
        };
      });
      this.dataCopy = this.datazbAll;
      let len = this.dataCopy.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (this.dataCopy[i].buid == this.dataCopy[j].buid) {
            this.dataCopy[i].userBaseInfoVos.push(
              ...this.dataCopy[j].userBaseInfoVos
            );
            this.dataCopy.splice(j, 1);
            len--;
            j--;
          }
        }
      }
      console.log(this.dataCopy, "this.dataCopy");
    },
    addLiablerName() {
      this.title = { label: "责任人", value: "2" };
      this.commonDialog = true;
    },
    addprocessorName() {
      this.title = { label: "问题处理人", value: "2" };
      this.commonDialog = true;
    },
    // 责任人弹框关闭
    commonDialogClose() {
      this.commonDialog = false;
    },
    // 责任人弹框确定
    commonDialogSave(select, val) {
      console.log(select, val);
      if (val == 2) {
        // 责任人
        this.form2.data.processor = select[0].data[0].jfid;
        this.form2.data.processorName = select[0].data[0].fullname;
        this.form2.data.processorBuid = select[0].data[0].buid;
        this.form2.data.processorRoleCode = select[0].data[0].roleCode;
      }
      console.log(this.form2.data, this.$refs.commonDialog);
      this.$refs.commonDialog.selectdata = [];
      // this.$refs.commonDialog.data = [];
      this.$refs.commonDialog.radio = "";
      this.commonDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.page-container {
  background: #fff;
  height: 100%;
}

.sradd {
  padding: 20px;
  padding-top: 0;
}

.reportPeriodClass {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding-left: 10px;
  cursor: pointer;
}

::v-deep .el-tabs__header {
  padding: 20px !important;
  padding-bottom: 0 !important;
}

::v-deep .ql-container {
  min-height: 120px !important;
}

::v-deep .ql-toolbar {
  line-height: 1.1 !important;
}

::v-deep .ql-editor {
  min-height: 80px !important;
}

.Allbtns {
  background: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btns {
  width: 80px;
  text-align: center;
  height: 34px;
  font-size: 12px;
  line-height: 34px;
  border-radius: 4px;
  color: rgba(66, 130, 255, 1);
  background: rgba(66, 130, 255, 0.1);
  cursor: pointer;
  border: 1px dashed rgba(66, 130, 255, 1);
}

::v-deep .sr_table {
  margin-bottom: 16px;
}

::v-deep .el-dialog .el-dialog__header {
  height: 56px;
  margin: 0 24px;
  padding: 16px 0;
  text-align: left;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  border-bottom: 1px solid #e8e8e8;

  .el-dialog__title {
    font-size: 14px;
  }
}

::v-deep .el-dialog__footer {
  height: 66px;

  .el-button {
    padding: 9px 27px;
  }
}

.reportWriter {
  display: flex;

  ::v-deep .el-input {
    width: 80%;
  }

  .btn {
    margin-left: 5px;
    width: 30px;
    height: 30px;
    opacity: 1;
    color: rgba(66, 130, 255, 1);
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border: 1px dashed rgba(66, 130, 255, 1);
  }
}

::v-deep .gobackList {
  .el-button {
    border-radius: 4px;
  }
}

.container_bottom_btns {
  // position: fixed;
  bottom: 0;
  // width: calc(100% - 230px);
  background: #fff;
  z-index: 10;
  right: 0;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #e6e6e6;

  .goBackCss {
    display: inline-block;
    margin-left: 20px;
  }

  .workflow_button {
    box-sizing: border-box;
    display: inline-block;
    margin: 0 4px;

    button {
      padding: 0px 24px;
      line-height: 32px;
      border-radius: 16px;
    }
  }
}

::v-deep .workflow_buttons {
  .gobackList {
    .el-button--default {
      display: none !important;
    }
  }
}

::v-deep .el-date-editor .el-range-separator {
  display: inline-block;
  height: 100%;
  padding: 0 1px 0 0;
  margin: 0 3px;
  /* text-align: center; */
  line-height: 32px;
  font-size: 14px;
  width: 5%;
  color: #333;
}

::v-deep .el-date-editor .el-range__close-icon {
  width: 10px !important;
}

.date {
  opacity: 0;
}

v-deep .date .el-input__prefix {
  display: none !important;
}

/* 固定定位 + 底部对齐 */
.all-btns {
  position: fixed; /* 关键：固定定位 */
  bottom: 0; /* 紧贴底部 */
  left: 0; /* 左对齐 */
  right: 0; /* 右对齐（铺满宽度） */
  background: #fff; /* 背景色防止透明遮挡 */
  padding: 16px; /* 内边距 */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 顶部阴影分隔线 */
  z-index: 1000; /* 确保按钮在最上层 */
  display: flex; /* Flex 布局 */
  gap: 12px; /* 按钮间距 */
  justify-content: flex-end; /* 按钮右对齐（可选值：flex-start/center/flex-end） */
}
</style>
