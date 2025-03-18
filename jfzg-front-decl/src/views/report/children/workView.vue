<template>
  <!-- <section class="form-config sr-qiankun-add"> -->
  <div class="total-page">
    <div class="title">基本信息</div>
    <SrView :formData="form.config" :ruleForm="form.data[0]" :ref="`form`">
    </SrView>
    <div class="title">工作进展情况</div>
    <div class="content">
      <!-- form.data[index].progress -->
      <div class="content_detail" v-for="(item, index) in form.data">
        <div style="margin-bottom: 16px">
          <span style="margin-right: 20px" v-if="isDuobiaoduan">标段：{{ index + 1 }}</span>
          <span style="margin-right: 20px">周报填报人：{{ item.reporter }}</span>
          <span>填报时间：{{ item.createTime }}</span>
        </div>
        <div style="display: flex; align-item: start">
          <div>填报内容：</div>
          <div class="textClass">
            <quill-editor placeholder="请输入文本..." v-model="form.data[index].progress" ref="myQuillEditor"
              :options="editorOption"></quill-editor>
            <!-- <el-input type="textarea" v-model="form.data[index].progress"></el-input> -->
          </div>
          <!-- style="white-space: wrap; display: inline-block" -->
        </div>
      </div>
      <!-- <div>暂无内容</div> -->
    </div>
    <div class="title">下周工作情况</div>
    <div class="content">
      <div class="content_detail" v-for="(item, index) in form.data">
        <div style="margin-bottom: 16px">
          <span style="margin-right: 20px" v-if="isDuobiaoduan">标段：{{ index + 1 }}</span>
          <span style="margin-right: 20px">周报填报人：{{ item.reporter }}</span>
          <span>填报时间：{{ item.createTime }}</span>
        </div>
        <div style="display: flex; align-item: start">
          <div>填报内容：</div>
          <div class="textClass">
            <quill-editor placeholder="请输入文本..." v-model="form.data[index].nextWorkPlan" ref="myQuillEditor"
              :options="editorOption1">
            </quill-editor>
            <!-- <el-input type="textarea" v-model="form.data[index].nextWorkPlan"></el-input> -->
          </div>
          <!-- style="white-space: wrap; display: inline-block" -->
        </div>

        <!-- <div>暂无内容</div> -->
      </div>
    </div>
    <div class="title">存在问题</div>
    <Question ref="question"></Question>
    <!-- </el-tabs> -->
    <sr-work-flow :hideFrom="true" :clickMethods="clickmethods" :buttonList="buttonList" ref="work_flow"
      backName="report"></sr-work-flow>
  </div>
  <!-- </section> -->
</template>
<script>
import SrNavPage from "../../../components/srNavPage.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import { api_getReportById, examineReport, getSonReportById, } from "@/api/report/index";
import config from "@/settings.js";
import upload from "@/utils/upload";
import Question from "../component/question.vue";
import { quillEditor } from "vue-quill-editor";
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
  name: "reportView",
  components: { SrNavPage, Question, quillEditor },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
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
      project: {
        matterName: "你好",
        projectNo: "123456",
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
              btnName: "推送台账",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
            {
              btnValue: "btg",
              btnName: "暂存",
              btnType: "primary",
              btnEventType: "btg",
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
      // 新增周报
      form: {
        config: [
          {
            value: "systemName",
            label: "系统名称",
            span: 12,
            type: "value",
          },
          {
            value: "projectName",
            label: "项目名称",
            span: 12,
            type: "value",
          },
          {
            value: "contactName",
            label: "项目负责人",
            span: 24,
            type: "value",
          },
          /*{
            value: "projectMaturity",
            label: "所属阶段",
            span: 8,
            type: "value",
          },
          {
            value: "reportPeriod",
            label: "报告周期",
            span: 8,
            type: "value",
          },
          {
            value: "season",
            label: "周报期别",
            span: 8,
            type: "value",
          },
           {
            value: "progress",
            label: "工作推进情况",
            span: 24,
            type: "textarea",
            textarea: true,
          },
          {
            value: "nextWorkPlan",
            label: "下周工作计划",
            span: 24,
            type: "textarea",
            textarea: true,
          },
          {
            value: "progress",
            label: "工作推进情况",
            span: 24,
            valueSlot: true,
            type: "value",
          },
          {
            value: "nextWorkPlan",
            label: "下周工作计划",
            span: 24,
            valueSlot: true,
            type: "value",
          },
          {
            value: "problemId",
            label: "存在的问题",
            valueSlot: true,
            span: 24,
            type: "value",
          },
          {
            value: "problemDto",
            label: "新增问题",
            span: 24,
            type: "value",
            valueSlot: true,
          },
          {
            value: "weeklyFile",
            label: "附件",
            span: 24,
            type: "uploader",
          },*/
        ],
        data: [
          {
            systemName: "", //系统名称
            projectName: "", //项目名称
            contactJfid: "", //项目负责人jfid
            contactName: "", //项目负责人
            // projectMaturity: "", //所属阶段
            // reportPeriod: [], //报告周期
            // season: "", //周期类别
            progress: "", //工作推进情况
            nextWorkPlan: "", //下周工作计划
            reporter: "", //工作推进情况
            createTime: "", //下周工作计划
            // problemId: [], //存在问题
            // problemDto: [], //新增问题
            // weeklyFile: "", //附件
            startTime: "",
            endTime: "",
            systemName: "",
            projectName: "",
            projectId: "",
            id: "",
            reportPeriod: "",
          },
        ],
        enums: {},
      },
      form2: {
        config: [
          {
            type: "input",
            name: "问题描述",
            placeholder: "请输入问题描述",
            bind: "contactName1",
            col: 24,
            required: "问题描述不能为空",
          },
          {
            type: "select",
            name: "问题类型",
            placeholder: "请选择问题类型",
            bind: "contactName",
            dataList: "contactNameList",
            trigger: "change",
            col: 12,
            required: "问题类型不能为空",
          },
          {
            type: "select",
            name: "问题等级",
            placeholder: "请选择问题等级",
            bind: "programManagerId",
            dataList: "programManagerList",
            trigger: "change",
            col: 12,
            required: "问题等级不能为空",
          },
          {
            type: "input",
            name: "提出人",
            placeholder: "请输入提出人",
            bind: "programManagerName",
            col: 24,
          },
        ],
        data: {
          contactName: "",
          programManagerId: "",
          contactName1: "",
          programManagerName: "",
          jhxmExpert: [],
          clientManagerName: "",
          clientManagerName1: "",
          clientManagerName2: "",
          preliminaryExaminationAnnex: "",
        },
        enums: {
          contactNameList: [],
          programManagerList: [],
          // clientManagerList: [],

          // contractUnitFullName: [],
          // controlUnitFullName: [],
        },
      },
      //
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // height: "260",
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
          innerBtn: [],
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
      table2: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // height: "260",
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
          innerBtn: [],
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
    };
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    },
    id() {
      return this.$route.query.id;
    },
    isDuobiaoduan() {
      return this.parseBoolean(this.$route.query.isDuobiaoduan);
    },
    contactSPId() {
      return this.$route ? this.$route.query.contactSPId : "";
    },
    contractId() {
      return this.$route ? this.$route.query.contractId : "";
    },
    contractName() {
      return this.$route ? this.$route.query.contractName : "";
    },
    sectionSort() {
      return this.$route.query && this.$route.query.sectionSort
        ? this.$route.query.sectionSort
        : "";
    },
  },
  mounted() {
    console.log('isDuobiaoduan', this.contractId);

    if (this.contractId) {
      this.getSon(this.id)
    } else {
      // 详情
      this.getReportById(this.id);
    }
  },
  methods: {
    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subdecl", this.$setState, timeout);
    },
    parseBoolean(value) {
      return value === "true" || value === true;
    },
    // 获取详情
    getReportById(id) {
      api_getReportById({ id }).then((res) => {
        console.log("详情id", res);
        if (res.data) {
          res.data.map((item, index) => {
            let { weeklyFile, startTime, endTime } = item;
            item.reportPeriod = startTime + "~" + endTime;
            item.weeklyFile = weeklyFile ? JSON.parse(weeklyFile) : [];
            this.form.data[index] = JSON.parse(JSON.stringify(item));
          });
          console.log("this.form", this.form);
          this.form.data.splice();
          this.table2.data = res.data.problemDto || [];
          this.table.data = res.data.alreadyExistProblemDto || [];
        }
      });
    },
    // 获取详情
    getSon(id) {
      getSonReportById({ id }).then((res) => {
        console.log("详情id", res);
        if (res.data) {
          res.data.map((item, index) => {
            let { weeklyFile, startTime, endTime } = item;
            item.reportPeriod = startTime + "~" + endTime;
            item.weeklyFile = weeklyFile ? JSON.parse(weeklyFile) : [];
            this.form.data[index] = JSON.parse(JSON.stringify(item));
          });
          console.log("this.form", this.form);
          this.form.data.splice();
          this.table2.data = res.data.problemDto || [];
          this.table.data = res.data.alreadyExistProblemDto || [];
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
    // 推送台账
    tg() {
      console.log("this.$refs.question", this.$refs.question);
      let params = [];
      let length = this.$refs.question.table.length;
      let question = this.$refs.question;
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          params.push({
            // 新增问题
            problemDto: question.table2[i].data,
            // 存在问题
            problemId: question.table[i].data.map((item) => item.id),
            weeklyFile:
              Array.isArray(question.form.data[i].weeklyFile) &&
              JSON.stringify(question.form.data[i].weeklyFile),
            startTime: this.form.data[i].startTime,
            endTime: this.form.data[i].endTime,
            systemName: this.form.data[i].systemName,
            projectName: this.form.data[i].projectName,
            projectId: this.form.data[i].projectId,
            nextWorkPlan: this.form.data[i].nextWorkPlan,
            progress: this.form.data[i].progress,
            reportPeriod: this.form.data[i].reportPeriod,
            isDraft: 1,
            id: this.form.data[i].id,
          });
        }
      } else {
        this.form.data.forEach((ele, i) => {
          params.push({
            // 新增问题
            problemDto: question.table2[i] ? question.table2[i].data : null,
            // 存在问题
            problemId: question.table[i]
              ? question.table[i].data.map((item) => item.id)
              : null,
            weeklyFile:
              Array.isArray(question.form.data[i].weeklyFile) &&
              JSON.stringify(question.form.data[i].weeklyFile),
            startTime: ele.startTime,
            endTime: ele.endTime,
            systemName: ele.systemName,
            projectName: ele.projectName,
            projectId: ele.projectId,
            nextWorkPlan: ele.nextWorkPlan,
            progress: ele.progress,
            id: ele.id,
            reportPeriod: ele.reportPeriod,
            isDraft: 1,
          });
        });
      }
      console.log(params, this.$refs.question);
      // return;
      examineReport(params).then((res) => {
        console.log(params);
        clearInterval(this.timer);
        if (res.msg.code == "0000") {
          this.$message.success("台账推送成功");
          if (this.isNew == true) {
            this.get_success = true;
          } else {
            this.routeClose();
            // this.$router.push({ name: "report" });
            this.$router.push({
              name: "reportList",
              query: {
                projectId: this.projectId,
                id: this.id,
                ProjectIdNum:this.$route.query.ProjectIdNum?this.$route.query.ProjectIdNum:'',
                ContractIdNum:this.$route.query.ContractIdNum?this.$route.query.ContractIdNum:'',
                systemName: this.systemName,
                projectName: this.projectName,
                pageNum: this.$route.query.pageNum,
                contractId: this.contractId,
                contactSPId: this.$route.query.contactSPId,
                contractName: this.$route.query.contractName,
                sectionSort: this.$route.query.sectionSort,
              },
            });
          }
        }
      });
    },
    fh() {
      let path = this.$route.path;
      console.log(path, "路由路径");

      if (path == "/report/reportAdd") {
        this.$router.push({
          name: "reportList",
          query: {
            projectId: this.projectId,
            id: this.id,
            ProjectIdNum:this.$route.query.ProjectIdNum?this.$route.query.ProjectIdNum:'',
            ContractIdNum:this.$route.query.ContractIdNum?this.$route.query.ContractIdNum:'',
            systemName: this.systemName,
            projectName: this.projectName,
            pageNum: this.$route.query.pageNum,
            contactSPId: this.$route.query.contactSPId,
            contractName: this.$route.query.contractName,
            sectionSort: this.$route.query.sectionSort,
          },
        });
      } else if (path == "/report/reportWorkView") {
        this.$router.push({
          name: "reportList",
          query: {
            projectId: this.projectId,
            id: this.id,
            systemName: this.systemName,
            projectName: this.projectName,
            ProjectIdNum:this.$route.query.ProjectIdNum?this.$route.query.ProjectIdNum:'',
            ContractIdNum:this.$route.query.ContractIdNum?this.$route.query.ContractIdNum:'',
            pageNum: this.$route.query.pageNum,
            contractId: this.contractId,
            contactSPId: this.$route.query.contactSPId,
            contractName: this.$route.query.contractName,
            sectionSort: this.$route.query.sectionSort,
          },
        });
      }
    },
    btg() {
      // 暂时没接口跳转到首页
      this.$router.push({
        name: "reportList",
      });
      let params = [];
      let length = this.$refs.question.table.length;
      let question = this.$refs.question;
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          params.push({
            // 新增问题
            problemDto: question.table2[i].data,
            // 存在问题
            problemId: question.table[i].data.map((item) => item.id),
            weeklyFile:
              Array.isArray(question.form.data[i].weeklyFile) &&
              JSON.stringify(question.form.data[i].weeklyFile),
            startTime: this.form.data[i].startTime,
            endTime: this.form.data[i].endTime,
            systemName: this.form.data[i].systemName,
            projectName: this.form.data[i].projectName,
            projectId: this.form.data[i].projectId,
            id: this.form.data[i].id,
            nextWorkPlan: this.form.data[i].nextWorkPlan,
            progress: this.form.data[i].progress,
            reportPeriod: this.form.data[i].reportPeriod,
            isDraft: 0,
          });
        }
      } else {
        this.form.data.forEach((ele, i) => {
          params.push({
            // 新增问题
            problemDto: question.table2[i] ? question.table2[i].data : null,
            // 存在问题
            problemId: question.table[i]
              ? question.table[i].data.map((item) => item.id)
              : null,
            weeklyFile:
              Array.isArray(question.form.data[i].weeklyFile) &&
              JSON.stringify(question.form.data[i].weeklyFile),
            startTime: ele.startTime,
            endTime: ele.endTime,
            systemName: ele.systemName,
            projectName: ele.projectName,
            projectId: ele.projectId,
            nextWorkPlan: ele.nextWorkPlan,
            progress: ele.progress,
            id: ele.id,
            reportPeriod: ele.reportPeriod,
            isDraft: 0,
          });
        });
      }
      console.log(params);
      // return;
      examineReport(params).then((res) => {
        console.log(params);
        clearInterval(this.timer);
        if (res.msg.code == "0000") {
          this.$message.success("暂存成功");
          if (this.isNew == true) {
            this.get_success = true;
          } else {
            this.routeClose();
            // this.$router.push({ name: "report" });
            this.$router.push({
              name: "reportList",
              query: {
                projectId: this.projectId,
                id: this.id,
                systemName: this.systemName,
                projectName: this.projectName,
                ProjectIdNum:this.$route.query.ProjectIdNum?this.$route.query.ProjectIdNum:'',
                ContractIdNum:this.$route.query.ContractIdNum?this.$route.query.ContractIdNum:'',
                pageNum: this.$route.query.pageNum,
                contractId: this.contractId,
                contactSPId: this.$route.query.contactSPId,
                contractName: this.$route.query.contractName,
                sectionSort: this.$route.query.sectionSort,
              },
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.total-page {
  background: #fff;
  padding: 20px 40px 40px 40px;

  .srNavPage {
    padding: 20px;
    padding-bottom: 0;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0px;
    line-height: 22px;
    color: rgba(29, 33, 41, 1);
    font-family: PingFangSC-Medium, PingFang SC;
    margin: 20px 0;
  }

  .content {
    padding: 0 16px;
    border: 1px solid rgba(229, 230, 235, 1);
    border-radius: 8px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(29, 33, 41, 1);

    .content_detail {
      padding: 16px 0;
    }
  }
}

.sr-view {
  // padding: 20px;
  padding-top: 0;
}

::v-deep .el-tabs__header {
  padding: 0 20px !important;
  // padding-bottom: 0 !important;
}

::v-deep .sr_table {
  // margin-bottom: 16px;
}

.textClass {
  -webkit-white-space: normal;
  white-space: normal;
  display: inline-block;
  width: 60% !important;
}

::v-deep .workflow_buttons {
  .gobackList {
    .el-button--default {
      display: none !important;
    }
  }
}

::v-deep .ql-toolbar.ql-snow {
  display: none !important;
}

::v-deep .ql-toolbar.ql-snow+.ql-container.ql-snow {
  border-top: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

::v-deep .sr-view .label-item {
  width: 120px;
}
</style>
