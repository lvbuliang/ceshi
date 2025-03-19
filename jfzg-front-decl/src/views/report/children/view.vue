<template>
  <!-- <section class="form-config sr-qiankun-add"> -->
  <div class="total-page">
    <SrNavPage :project="project"></SrNavPage>
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
        <SrView :formData="form.config" :ruleForm="form.data[0]" :ref="`form`">
          <template slot="progress">
            <div
              class="content_detail"
              v-for="(item, index) in form.data"
              :key="index"
            >
              <div style="margin: 16px 0" v-if="isDuobiaoduan">
                <!-- <span style="margin-right: 20px"
                  >标段{{ item.sectionSort}}</span
                > -->
                <!-- <span style="margin-right: 20px"
                  >标段{{ item.sectionSort || index + 1 }}</span
                >
                <span
                  v-if="item.reporter && item.reporter != ''"
                  style="margin-right: 20px"
                  >周报填报人：{{ item.reporter }}</span
                >
                <span v-if="item.createTime && item.createTime != ''"
                  >填报时间：{{ item.createTime }}</span
                > -->
              </div>
              <div>
                <div v-html="item.progress" class="textClass"></div>
                <!-- style="white-space: wrap; display: inline-block" -->
              </div>
            </div>
          </template>
          <template slot="nextWorkPlan">
            <div
              class="content_detail"
              v-for="(item, index) in form.data"
              :key="index"
            >
              <div style="margin: 16px 0" v-if="isDuobiaoduan">
                <!-- <span style="margin-right: 20px"
                  >标段{{ (index + 1) }}</span
                > -->
                <!-- <span style="margin-right: 20px"
                  >标段{{ item.sectionSort || index + 1 }}</span
                >
                <span
                  v-if="item.reporter && item.reporter != ''"
                  style="margin-right: 20px"
                  >周报填报人：{{ item.reporter }}</span
                >
                <span v-if="item.createTime && item.createTime != ''"
                  >填报时间：{{ item.createTime }}</span
                > -->
              </div>
              <div>
                <div v-html="item.nextWorkPlan" class="textClass"></div>
              </div>

              <!-- <div>暂无内容</div> -->
            </div>
          </template>
          <template slot="problemId">
            <template v-for="(item, index) in table">
              <div
                style="margin: 16px 0"
                v-if="isDuobiaoduan && table[index].data.length > 0"
                :key="index"
              >
                <!-- <span style="margin-right: 20px"
                  >标段{{ (index + 1) }}</span
                > -->
                <!-- <span style="margin-right: 20px"
                  >标段{{ item.data[0].sectionSort || index + 1 }}</span
                >
                <span
                  v-if="item.reporter && item.reporter != ''"
                  style="margin-right: 20px"
                  >周报填报人：{{ item.reporter }}</span
                >
                <span v-if="item.createTime && item.createTime != ''"
                  >填报时间：{{ item.createTime }}</span
                > -->
              </div>
              <SrTable
                :key="index"
                v-if="table[index].data.length > 0"
                @pageChanged="pageChanged"
                :data="table[index].data"
                @sizeChanged="sizeChanged"
                :config="table[index].tableConfig"
                :page="table[index].page"
                ref="selectTable"
              >
              </SrTable>
              <!-- <div v-else>暂无问题</div> -->
            </template>
          </template>
          <template slot="problemDto">
            <template v-for="(item, index) in table2">
              <div
                style="margin: 16px 0"
                v-if="isDuobiaoduan && table2[index].data.length > 0"
              >
                <!-- <span style="margin-right: 20px"
                  >标段{{ (index + 1) }}</span
                > -->
                <!-- <span style="margin-right: 20px"
                  >标段{{ item.data[0].sectionSort || index + 1 }}</span
                >
                <span
                  v-if="item.reporter && item.reporter != ''"
                  style="margin-right: 20px"
                  >周报填报人：{{ item.reporter }}</span
                >
                <span v-if="item.createTime && item.createTime != ''"
                  >填报时间：{{ item.createTime }}</span
                > -->
              </div>
              <SrTable
                v-if="table2[index].data.length > 0"
                @pageChanged="pageChanged"
                :data="table2[index].data"
                @sizeChanged="sizeChanged"
                :config="table2[index].tableConfig"
                :page="table2[index].page"
                ref="selectTable"
              >
              </SrTable>
              <!-- <div v-else>暂无问题</div> -->
            </template>
          </template>
          <template slot="weeklyFile">
            <!-- v-if="table2[index].data.length > 0" -->
            <template v-for="(item, index) in form.data">
              <div style="display: flex; flex-direction: column">
                <div

                  v-if="isDuobiaoduan && item.weeklyFile.length > 0"
                >
                  <!-- <span style="margin-right: 20px"
                    >标段{{ (index + 1) }}</span
                  > -->
                  <!-- <span style="margin-right: 20px"
                    >标段{{ item.sectionSort || index + 1 }}</span
                  >
                  <span
                    v-if="item.reporter && item.reporter != ''"
                    style="margin-right: 20px"
                    >周报填报人：{{ item.reporter }}</span
                  >
                  <span v-if="item.createTime && item.createTime != ''"
                    >填报时间：{{ item.createTime }}</span
                  > -->
                </div>
                <UploaderView
                  :data-up="item"
                  :view-data="item.weeklyFile || []"
                  :emptyPlacehoder="item.emptyPlacehoder"
                ></UploaderView>
              </div>
            </template>
          </template>
        </SrView>
      </el-tab-pane>

      <WorkFlow1
        :hideFrom="true"
        :clickMethods="clickmethods"
        :buttonList="buttonList"
        :taskId="taskId"
        ref="work_flow"
        backName="report"
      ></WorkFlow1>
    </el-tabs>
  </div>
  <!-- </section> -->
</template>
<script>
import SrNavPage from "../../../components/srNavPage.vue";
import {
  api_getReportById,
  getSonReportById,
  reportComment,
} from "@/api/report/index";
import config from "@/settings.js";
import upload from "@/utils/upload";
import UploaderView from "../component/uploaderView.vue";
import srtracetrack from "@/utils/strackReport.js";
import workflow from "@/utils/workflow";
import WorkFlow1 from "../component/workflow.vue";

import store from "@/store";
export default {
  name: "reportView",
  components: { SrNavPage, UploaderView, WorkFlow1 },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflow,
    };
  },
  props: {},
  updated() {},
  data() {
    return {
      userInfo: store.getters.userInfo,
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
              btnValue: "btg",
              btnName: "保存",
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
          showForm: true,
        },
      ],
      // 新增周报
      form: {
        config: [
          {
            value: "systemName",
            label: "系统名称",
            span: 8,
            type: "value",
          },
          {
            value: "projectName",
            label: "项目名称",
            span: 8,
            type: "value",
          },
          {
            value: "contactName",
            label: "项目负责人",
            span: 8,
            type: "value",
          },
          {
            value: "projectMaturity",
            label: "所属阶段",
            span: 8,
            type: "value",
          },
          {
            value: "reportPeriod",
            label: "报告周期",
            span: 12,
            type: "value",
          },
          /*{
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
          },*/
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
            type: "value",
            valueSlot: true,
          },
        ],
        data: [
          {
            systemName: "", //系统名称
            projectName: "", //项目名称
            contactJfid: "", //项目负责人jfid
            contactName: "", //项目负责人
            projectMaturity: "", //所属阶段
            reportPeriod: [], //报告周期
            season: "", //周期类别
            progress: "", //工作推进情况
            nextWorkPlan: "",
            problemId: [], //存在问题
            problemDto: [], //新增问题
            weeklyFile: "", //附件,
            sectionSort: "", //标段
          },
        ],
        enums: {
          contactNameList: [], //项目负责人
          systemNameList: [], //系统名称
          projectNameList: [], //项目名称
          // clientManagerList: [],

          // contractUnitFullName: [],
          // controlUnitFullName: [],
        },
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
          sectionSort: "",
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
      table: [
        {
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
              {
                label: "提出人",
                prop: "proposerName",
                isShow: true,
                index: 2,
                width: "150px",
              },
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
      ],
      table2: [
        {
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
              {
                label: "提出人",
                prop: "proposerName",
                isShow: true,
                width: "150px",
                index: 2,
              },
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
      ],
      tableCopy: {},
      tableCopy2: {},
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
    sectionSort() {
      return this.$route ? this.$route.query.sectionSort : "";
    },
    contractName() {
      return this.$route ? this.$route.query.contractName : "";
    },
  },
  created() {
    this.tableCopy = JSON.parse(JSON.stringify(this.table[0]));
    this.tableCopy2 = JSON.parse(JSON.stringify(this.table2[0]));
    // 详情
    this.getReportById(this.id);
  },
  mounted() {
    console.log('详情页',this.$route.query);
    
  },
  methods: {
    parseBoolean(value) {
      return value === "true" || value === true;
    },
    // 获取详情
    getReportById(id) {
      if (this.$route.query.contractId) {
        getSonReportById({ id }).then((res) => {
          console.log("详情id1111111", res);
          if (res.data) {
            //  this.table = [];
            //   this.table2 = [];
            for (let i = 1; i < res.data.length; i++) {
              this.table.push(JSON.parse(JSON.stringify(this.tableCopy)));
              this.table2.push(JSON.parse(JSON.stringify(this.tableCopy2)));
              this.form.data.push({
                weeklyFile: "",
              });
            }
            res.data.map((item, index) => {
              let { weeklyFile, startTime, endTime } = item;
              item.reportPeriod =
                (item.startTime.includes("00")
                  ? item.startTime.split(" ")[0]
                  : item.startTime) +
                "~" +
                item.endTime;
              console.log(item.weeklyFile);
              item.weeklyFile = item.weeklyFile
                ? JSON.parse(item.weeklyFile)
                : [];
              this.table2[index] != null
                ? (this.table2[index].data = JSON.parse(
                    JSON.stringify(item.problemDto ? item.problemDto : [])
                  ))
                : [];

              this.table[index] != null
                ? (this.table[index].data = JSON.parse(
                    JSON.stringify(
                      item.alreadyExistProblemDto
                        ? item.alreadyExistProblemDto
                        : []
                    )
                  ))
                : [];
              this.project.matterName = item.projectName;
              this.project.projectNo = item.projectCode;
              this.form.data[index] = JSON.parse(JSON.stringify(item));
            });
            console.log("this.form", this.form);
            let { weeklyFile, startTime, endTime } = res.data;
            res.data.reportPeriod =
              (res.data[0].startTime.includes("00")
                ? res.data[0].startTime.split(" ")[0]
                : res.data[0].startTime) +
              "~" +
              endTime;
            res.data.weeklyFile = weeklyFile ? JSON.parse(weeklyFile) : [];
            this.table2.data = res.data.problemDto || [];
            this.table.data = res.data.alreadyExistProblemDto || [];
            this.project.matterName = res.data.projectName;
            this.project.projectNo = res.data.projectCode;
            this.form.data = res.data;
          }
        });
      } else {
        api_getReportById({ id }).then((res) => {
          if (res.data) {
            //  this.table = [];
            // this.table2 = [];
            for (let i = 1; i < res.data.length; i++) {
              this.table.push(JSON.parse(JSON.stringify(this.tableCopy)));
              this.table2.push(JSON.parse(JSON.stringify(this.tableCopy2)));
              this.form.data.push({
                weeklyFile: "",
              });
            }
            res.data.sort((a, b) => {
              return a.sectionSort - b.sectionSort;
            });
            res.data.forEach((item, index) => {
              if (item.problemDto) {
                for (let i = 0; i < item.problemDto.length; i++) {
                  item.problemDto[i].sectionSort = item.sectionSort;
                }
              }
              if (item.alreadyExistProblemDto) {
                for (let i = 0; i < item.alreadyExistProblemDto.length; i++) {
                  item.alreadyExistProblemDto[i].sectionSort = item.sectionSort;
                }
              }

              let { weeklyFile, startTime, endTime } = item;
              item.reportPeriod =
                (item.startTime.includes("00")
                  ? item.startTime.split(" ")[0]
                  : item.startTime) +
                "~" +
                item.endTime;
              // console.log(item.weeklyFile);
              item.weeklyFile = item.weeklyFile
                ? JSON.parse(item.weeklyFile)
                : [];
              this.table2[index]
                ? (this.table2[index].data = JSON.parse(
                    JSON.stringify(item.problemDto ? item.problemDto : [])
                  ))
                : [];

              this.table[index]
                ? (this.table[index].data = JSON.parse(
                    JSON.stringify(
                      item.alreadyExistProblemDto
                        ? item.alreadyExistProblemDto
                        : []
                    )
                  ))
                : [];

              this.project.matterName = item.projectName;
              this.project.projectNo = item.projectCode;
              this.form.data[index] = JSON.parse(JSON.stringify(item));
            });

            // console.log("详情id2222222", res.data);
            // console.log(this.table2, "this.table222.data");

            let { weeklyFile, startTime, endTime } = res.data;
            res.data.reportPeriod =
              (res.data[0].startTime.includes("00")
                ? res.data[0].startTime.split(" ")[0]
                : res.data[0].startTime) +
              "~" +
              endTime;
            res.data.weeklyFile = weeklyFile ? JSON.parse(weeklyFile) : [];
            this.table2.data = res.data.problemDto || [];
            this.table.data = res.data.alreadyExistProblemDto || [];
            this.project.matterName = res.data.projectName;
            this.project.projectNo = res.data.projectCode;
            this.form.data = res.data;
          }
        });
      }
    },
    // 保存
    btg() {
      let params = {
        reportId: this.id,
        flag: this.$route.query.contractId ? 1 : 0,
        comment: this.$refs.work_flow.form.data.comment,
      };
      reportComment(params).then((res) => {
        if ((res.msg.code = "0000")) {
          this.$router.push({
            name: "reportList",
            query: {
              contactSPId: this.$route.query.contactSPId,
              projectId: this.$route.query.projectId,
              id: this.id,
              systemName: this.systemName,
              projectName: this.projectName,
              ProjectIdNum:this.$route.query.ProjectIdNum?this.$route.query.ProjectIdNum:'',
              ContractIdNum:this.$route.query.ContractIdNum?this.$route.query.ContractIdNum:'',
              pageNum: this.$route.query.pageNum,
              contractId: this.$route.query.contractId,
              isDuobiaoduan: this.isDuobiaoduan,
              pageNo: this.$route.query.pageNo,
              contractName: this.$route.query.contractName,
              sectionSort: this.$route.query.sectionSort,
            },
          });
          this.$message.success("保存成功");
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
            isDuobiaoduan: this.isDuobiaoduan,
            contactSPId: this.contactSPId,
            contractName: this.$route.query.contractName,
            sectionSort: this.$route.query.sectionSort,
            ProjectIdNum:this.$route.query.ProjectIdNum?this.$route.query.ProjectIdNum:'',
            ContractIdNum:this.$route.query.ContractIdNum?this.$route.query.ContractIdNum:'',
            //   projectId: this.projectId,
            //   id: this.id,
            //   systemName: this.systemName,
            //   projectName: this.projectName,
            //   pageNum: this.pageNum,
          },
        });
      } else if (path == "/report/reportView") {
        console.log("this.$route.query.pageNum", this.$route.query);

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
            contractId: this.$route.query.contractId,
            isDuobiaoduan: this.isDuobiaoduan,
            contactSPId: this.contactSPId,
            pageNo: this.$route.query.pageNo,
            contractName: this.$route.query.contractName,
            ProjectIdNum:this.$route.query.ProjectIdNum?this.$route.query.ProjectIdNum:'',
            ContractIdNum:this.$route.query.ContractIdNum?this.$route.query.ContractIdNum:'',
            sectionSort: this.$route.query.sectionSort,
          },
        });
      }
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
          this.controlUnitFullName = res.data;
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
  },
};
</script>
<style lang="scss" scoped>
.total-page {
  background: #fff;
  .srNavPage {
    padding: 20px;
    padding-bottom: 0;
  }
  .content_detail {
    // padding: 16px 0;
  }
}
.sr-view {
  padding: 20px;
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
}
::v-deep .workflow_buttons {
  .gobackList {
    .el-button--default {
      display: none !important;
    }
  }
}
::v-deep .sr-view .label-item {
  width: 120px;
}
</style>
