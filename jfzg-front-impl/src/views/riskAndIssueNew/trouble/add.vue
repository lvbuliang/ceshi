<template>
  <div class="total-page" :style="{ height: boxHeight + 'px' }">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :disabled="true"
        :key="item.code"
        :name="item.code"
      >
        <template slot="label">
          <img
            style="vertical-align: middle"
            src="@/assets/barrage_fill@2x.png"
            width="24px"
            height="auto"
            alt=""
          />
          <span style="color: #333; vertical-align: middle; padding-left: 4px">
            问题基本信息
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-form
      :inline="true"
      v-if="showDis"
      :model="formInline"
      ref="ruleForm"
      :rules="formRules"
      label-width="120px"
      label-position="right"
      class="demo-form-inline"
    >
      <!-- v-if="false" -->
      <el-row>
        <el-col :span="12">
          <div>
            <el-form-item label="系统名称:" style="width: 100%" class="sys">
              <el-input
                v-model="formInline.systemName"
                placeholder="系统名称"
                :disabled="true"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item label="项目名称:" style="width: 100%" class="sys">
              <el-input
                v-model="formInline.projectName"
                placeholder="项目名称"
                :disabled="true"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="标段" class="segment">
            <el-input
              v-model="formInline.sectionSort"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="elItem">
            <el-form-item label="问题描述" prop="wtms" style="width: 100%">
              <el-input
                v-model="formInline.wtms"
                placeholder="问题描述"
                style="width: 100%"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="1000"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="elItems">
            <el-form-item label="问题类型" prop="wtlx">
              <el-select v-model="formInline.wtlx" placeholder="问题类型">
                <el-option label="外部问题" value="2"></el-option>
                <el-option label="内部问题" value="1"></el-option>
                <el-option label="云网问题" value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="elItems">
            <el-form-item label="问题等级" prop="wtdj">
              <el-select v-model="formInline.wtdj" placeholder="问题等级">
                <el-option label="严重" value="2"></el-option>
                <el-option label="一般" value="1"></el-option>
                <el-option label="轻微" value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="elItems">
            <el-form-item label="提出人">
              <el-input
                v-model="formInline.tcr"
                placeholder="提出人"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="elItems">
            <el-form-item label="问题处理人" prop="wtclr">
              <div style="display: flex; align-items: center">
                <el-input
                  v-model="formInline.wtclr"
                  placeholder="问题处理人"
                  :disabled="true"
                  style="width: 100%"
                ></el-input>
                <el-button
                  circle
                  @click="selectclr()"
                  class="btns"
                  style="margin-bottom: 0"
                  ><i class="el-icon-plus icon"></i
                ></el-button>
              </div>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="elItems">
            <el-form-item label="责任处室/部门">
              <el-input
                v-model="formInline.zrcs"
                placeholder="责任处室/部门"
                autosize
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="elItems">
            <el-form-item label="责任人">
              <div style="display: flex; align-items: center">
                <el-input
                  v-model="formInline.zrr"
                  placeholder="责任人"
                  style="width: 100%"
                  autosize
                  maxlength="200"
                  show-word-limit
                ></el-input>
                <!-- <el-button circle @click="selectzrr()" class="btns"
                  ><i class="el-icon-plus icon"></i
                ></el-button> -->
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div
        style="
          display: flex;
          justify-content: flex-end;
          margin-right: 40vw;
          margin-top: 10vh;
        "
      ></div>
    </el-form>
    <!-- 新建 -->
    <Dialogone
      :dialogVisible="changeZRRlog"
      @close="handleZRRClose"
      @saveSelectZRR="saveSelectZRR"
    ></Dialogone>
    <!-- 编辑 -->
    <Dialogtwo
      :dialogVisible="changeWTCLRlog"
      @close="handleWTCLRClose"
      @saveSelectTCR="saveSelectTCR"
    ></Dialogtwo>

    <!--  -->
    <div v-if="!showDis">
      <SrView
        :formData="forms.config"
        :ruleForm="forms.data"
        :ref="`form`"
      ></SrView>
      <el-tabs v-if="false" v-model="activeName">
        <el-tab-pane
          v-for="item in tabList"
          :disabled="true"
          :key="item.code"
          :name="item.code"
        >
          <template slot="label">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
            >
              操作
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div v-if="false">
        <SrView
          v-if="followforms.data.resultId == '0'"
          :formData="followforms.config"
          :ruleForm="followforms.data"
          :ref="`form`"
        ></SrView>
        <SrView
          v-if="transferforms.data.resultId == '1'"
          :formData="transferforms.config"
          :ruleForm="transferforms.data"
          :ref="`form`"
        ></SrView>
        <SrView
          v-if="closeforms.data.resultId == '2'"
          :formData="closeforms.config"
          :ruleForm="closeforms.data"
          :ref="`form`"
        ></SrView>
      </div>
    </div>

    <!-- !showDis -->
    <div v-if="!showDis">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabList"
          :disabled="true"
          :key="item.code"
          :name="item.code"
        >
          <template slot="label">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
            >
              过程记录
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <RTSteps
        :srTraceArr="arr"
        :srTraceActive="arr.length"
        :show="false"
        :direction="'vertical'"
      ></RTSteps>
    </div>

    <!-- <BottomBtns
      :isShowBack="showDis"
      :saveBtn="saveBtn"
      @onBackClick="backToList"
      @onSubmit="onSubmit('ruleForm')"
    ></BottomBtns> -->
    
    <srworkFlow
      :style="{ width: `calc(100% - ${widthB}) !important` }"
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      :backName="
        $route.query.routeName ? $route.query.routeName : 'everydaytroubleNew'
      "
      :params="{
        projectId: this.$route.query.projectId,
        systemName: this.$route.query.systemName,
        projectName: this.$route.query.projectName,
        contractId: this.$route.query.contractId,
        sectionCount: this.$route.query.sectionCount,
        sectionSort: this.$route.query.sectionSort,
      }"
    ></srworkFlow>
  </div>
</template>
<script>
import store from "@/store";
import Dialogone from "@/views/riskAndIssueNew/children/dialogone.vue";
import Dialogtwo from "@/views/riskAndIssueNew/children/dialogtwo.vue";
import RTSteps from "@/components/riskAndTroubleSteps.vue";
import srworkFlow from "../components/srworkflow.vue";
import {
  api_trouble_detail,
  api_save_query,
  api_trouble_edit,
  api_queryProblemHistory,
} from "@/api/riskAndIssueNew/index.js";
import config from "@/settings.js";
import upload from "@/utils/upload";
import BottomBtns from "@/views/riskAndIssueNew/components/buttomBtn.vue";

export default {
  name: "everydaytroubleEditNew",
  components: { Dialogone, Dialogtwo, BottomBtns, RTSteps ,srworkFlow},
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {},
  watch: {
    $route: {
      handler(val) {
        if (val) {
          this.getSuggestion(val);
        }
      },
      immediate: true,
      deep: true,
    },
    "formInline.wtms": {
      handler(newVal) {
        this.formInline.wtms = this.replaceCode(newVal);
      },
      immediate: true,
    },
  },
  updated() {},
  data() {
    return {
      boxHeight: "700",
      arr: [],
      canClick: true,
      saveBtn: false,
      activeName: "1",
      tabList: [{ title: "问题基本信息", code: "1" }],
      editId: null,
      code: null,
      formInline: {
        systemName: this.$route.query.systemName,
        projectName: this.$route.query.projectName,
        sectionSort: this.$route.query.sectionSort,
        wtms: null,
        wtlx: null,
        wtdj: null,
        tcr: null,
        tcrId: null,
        wtclr: null,
        wtclrId: null,
        zrcs: null,
        zrcsId: null,
        zrr: null,
        zrrId: null,
        processorRoleCode: null,
        processorBuid: null,
      },
      ruleForm: {
        wtms: null,
        wtlx: null,
        wtdj: null,
        tcr: null,
        wtclr: null,
        zrcs: null,
        zrr: null,
      },
      formRules: {
        wtms: [{ required: true, message: "请填写问题描述", trigger: "blur" }],
        wtlx: [
          { required: true, message: "请选择问题类型", trigger: "change" },
        ],
        wtdj: [
          { required: true, message: "请选择问题等级", trigger: "change" },
        ],
        tcr: [{ required: true, message: "请填写提出人", trigger: "change" }],
        wtclr: [
          { required: true, message: "请选择问题处理人", trigger: "change" },
        ],
        zrcs: [
          {
            required: false,
            message: "请填写责任处室/部门",
            trigger: "change",
          },
        ],
        zrr: [{ required: false, message: "请填写责任人", trigger: "blur" }],
      },
      dialog: {
        title: "",
        dialogDis: false,
      },
      changeZRRlog: false,
      changeWTCLRlog: false,
      templateId: this.$route.query.templateId,
      clickmethods: { btg: this.btg },
      tabList: [{ title: "问题基本信息", code: "1" }],
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
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "input",
            name: "问题描述",
            placeholder: "请输入",
            bind: "systemName",
            dataList: "systemNameList",
            trigger: "change",
            col: 24,
            required: "问题描述不能为空",
          },
          {
            type: "select",
            name: "问题类型",
            placeholder: "请选择",
            bind: "systemName",
            dataList: "systemNameList",
            trigger: "change",
            col: 12,
            required: "问题类型不能为空",
          },
          {
            type: "select",
            name: "问题等级",
            placeholder: "请选择",
            bind: "projectName",
            dataList: "projectNameList",
            trigger: "change",
            col: 12,
            required: "问题等级不能为空",
          },
          {
            type: "input",
            name: "提出人",
            placeholder: "请输入",
            bind: "contactName",
            trigger: "change",
            col: 12,
            // required: "项目负责人不能为空",
          },
          {
            type: "select",
            name: "问题处理人",
            placeholder: "请选择",
            bind: "programManagerName",
            dataList: "contactNameList",
            // trigger: "change",
            col: 12,
            // required: "所属阶段不能为空",
          },
          {
            type: "input",
            name: "责任处室/部门",
            placeholder: "请输入",
            bind: "clientManagerName",
            col: 12,
            // required: "周报期别不能为空",
            // trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
          },
          {
            type: "select",
            name: "责任人",
            placeholder: "请输入",
            bind: "clientManagerName",
            col: 12,
            // required: "周报期别不能为空",
            // trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
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
          contactNameList: [], //项目负责人
          systemNameList: [], //系统名称
          projectNameList: [], //项目名称
        },
      },
      forms: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "问题描述",
            value: "description",
            col: 24,
            type: "value",
          },
          {
            value: "type",
            label: "问题类型",
            span: 8,
            type: "value",
          },
          {
            value: "level",
            label: "问题等级",
            span: 8,
            type: "value",
          },
          {
            value: "proposerName",
            label: "提出人",
            span: 8,
            type: "value",
          },
          {
            value: "processorName",
            label: "问题处理人",
            span: 8,
            type: "value",
          },
          {
            value: "departName",
            label: "责任处室/部门",
            span: 8,
            type: "value",
          },
          {
            value: "liablerName",
            label: "责任人",
            span: 8,
            type: "value",
          },
        ],

        data: {
          description: "",
          type: "",
          level: "",
          proposerName: "",
          processorName: "",
          departName: "",
          liablerName: "",
        },
        enums: {
          processorNameList: [], //风险处理人
          liablerNameList: {}, //责任人
          typeList: [], //风险类型
          levelList: [], //风险等级
        },
      },
      followforms: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "处理结果",
            value: "result",
            col: 24,
            type: "value",
          },
          {
            value: "handleIdea",
            label: "跟进处理意见",
            span: 24,
            type: "value",
          },
          {
            value: "handleTime",
            label: "跟进处理时间",
            span: 24,
            type: "value",
          },
        ],

        data: {
          result: "",
          resultId: "",
          handleIdea: "",
          handleTime: "",
        },
        enums: {
          processorNameList: [], //风险处理人
          liablerNameList: {}, //责任人
          typeList: [], //风险类型
          levelList: [], //风险等级
        },
      },
      transferforms: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "处理结果",
            value: "result",
            col: 24,
            type: "value",
          },
          {
            value: "subContractor",
            label: "转办人",
            span: 24,
            type: "value",
          },
          {
            value: "handleIdea",
            label: "转办处理意见",
            span: 24,
            type: "value",
          },
          {
            value: "handleTime",
            label: "转办处理时间",
            span: 24,
            type: "value",
          },
        ],

        data: {
          result: "",
          resultId: "",
          subContractor: "",
          handleIdea: "",
          handleTime: "",
        },
        enums: {
          processorNameList: [], //风险处理人
          liablerNameList: {}, //责任人
          typeList: [], //风险类型
          levelList: [], //风险等级
        },
      },
      closeforms: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "处理结果",
            value: "result",
            col: 24,
            type: "value",
          },
          {
            value: "handleIdea",
            label: "关闭处理意见",
            span: 24,
            type: "value",
          },
          {
            value: "handleTime",
            label: "关闭处理时间",
            span: 24,
            type: "value",
          },
        ],

        data: {
          result: "",
          resultId: "",
          handleIdea: "",
          handleTime: "",
        },
        enums: {
          processorNameList: [], //风险处理人
          liablerNameList: {}, //责任人
          typeList: [], //风险类型
          levelList: [], //风险等级
        },
      },
      userInfo: store.getters.userInfo,
      showDis: true,
      systemName: "",
      projectName: "",
    };
  },
  beforeRouteEnter: (to, from, next) => {
    // debugger
    if (to.query.code == "new") {
      to.meta.title = "新建问题";
    } else if (to.query.code == "edit") {
      to.meta.title = "编辑问题";
    } else if (to.query.code == "see") {
      to.meta.title = "查看问题";
    }
    next();
  },
  created() {
    this.code = this.$route.query.code;
    if (this.$route.query.code == "edit") {
      this.editId = this.$route.query.id;
      if (this.editId) {
        this.getTroubleDetail();
      }
    }
    if (this.$route.query.edit == true) {
      this.showDis = false;
    }
    if (this.$route.query.code == "see") {
      this.showDis = false;
      this.getTroublesee();
    }
  },
  mounted() {
    this.getWorkflowHeight();
    if (this.$route.query.code == "new") {
      this.formInline.tcr = this.userInfo.fullname;
      this.formInline.tcrId = this.userInfo.jfid;
    }
  },
  methods: {
    replaceCode(inputString) {
      return inputString.replace(/"/g, "“"); // 使用中文双引号“”
    },
    getWorkflowHeight() {
      this.$nextTick(() => {
        setTimeout(() => {
          let workflowHeight = 0;
          let container = document.querySelector(".workflow");
          let btns = document.querySelector(".btns");
          if (container) {
            workflowHeight = container.offsetHeight;
          }
          workflowHeight += 66;
          this.boxHeight =
            window.innerHeight -
            document.querySelector(".tabs_box").offsetHeight -
            workflowHeight;
        }, 50);
      });
    },
    selectclr() {
      this.changeWTCLRlog = true;
    },
    selectzrr() {
      this.changeZRRlog = true;
    },
    backToList() {
      this.$router.push({
        name: "everydaytroubleNew",
        query: {
          projectId: this.$route.query.projectId,
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
        },
      });
    },
    async getTroubleDetail() {
      const res = await api_trouble_detail(this.editId);
      console.log(res, "seee");
      if (res.msg.code == "0000") {
        this.formInline.wtms = res.data.description;
        this.formInline.wtlx = res.data.type;
        this.formInline.wtdj = res.data.level;
        this.formInline.tcr = res.data.proposerName;
        this.formInline.tcrId = res.data.proposer;
        this.formInline.wtclrId = res.data.processor;
        this.formInline.wtclr = res.data.processorName;
        this.formInline.zrcs = res.data.departName;
        this.formInline.zrrId = res.data.liabler;
        this.formInline.zrr = res.data.liablerName;
        this.systemName = res.data.systemName;
        this.projectName = res.data.projectName;
      }
    },
    async getTroublesee() {
      const res = await api_trouble_detail(this.$route.query.id);
      if (res.msg.code == "0000") {
        this.forms.data.description = res.data.description;
        this.forms.data.type =
          res.data.type == "1"
            ? "内部问题"
            : res.data.type == "2"
            ? "外部问题"
            : res.data.type == "3"
            ? "云网问题"
            : "";
        this.forms.data.level =
          res.data.level == "0"
            ? "轻微"
            : res.data.level == "1"
            ? "一般"
            : res.data.level == "2"
            ? "严重"
            : "";
        this.forms.data.proposerName = res.data.proposerName;
        this.forms.data.processorName = res.data.processorName;
        this.forms.data.departName = res.data.departName;
        this.forms.data.liablerName = res.data.liablerName;
        this.systemName = res.data.systemName;
        this.projectName = res.data.projectName;
        if (res.data.result == "0") {
          this.followforms.data.result = "跟进";
          this.followforms.data.resultId = res.data.result;
          this.followforms.data.handleIdea = res.data.handleIdea;
          this.followforms.data.handleTime = res.data.handleTime;
        } else if (res.data.result == "1") {
          this.transferforms.data.result = "转办";
          this.transferforms.data.resultId = res.data.result;
          this.transferforms.data.handleIdea = res.data.handleIdea;
          this.transferforms.data.handleTime = res.data.handleTime;
          this.transferforms.data.subContractor = res.data.subContractor;
        } else if (res.data.result == "2") {
          this.closeforms.data.result = "关闭";
          this.closeforms.data.resultId = res.data.result;
          this.closeforms.data.handleIdea = res.data.handleIdea;
          this.closeforms.data.handleTime = res.data.handleTime;
        }
      }
    },
    handleZRRClose() {
      this.changeZRRlog = false;
    },
    handleWTCLRClose() {
      this.changeWTCLRlog = false;
    },

    // onSubmit
    btg(formName) {
      if (!this.canClick) return;
      this.$refs["ruleForm"].validate(async (valid) => {
        console.log(valid, "-------");
        if (valid) {
          if (this.code == "new") {
            let params = {
              isDraft: 1,
              description: this.formInline.wtms,
              type: this.formInline.wtlx,
              level: this.formInline.wtdj,
              proposer: this.formInline.tcrId,
              proposerName: this.formInline.tcr,
              processor: this.formInline.wtclrId,
              processorName: this.formInline.wtclr,
              processorRoleCode: this.formInline.processorRoleCode,
              processorBuid: this.formInline.processorBuid,
              departName: this.formInline.zrcs,
              liabler: this.formInline.zrrId,
              liablerName: this.formInline.zrr,
              projectId: this.$route.query.projectId,
              contractId: this.$route.query.contractId,
              sectionCount: this.$route.query.sectionCount,
              sectionSort: this.$route.query.sectionSort,
              projectName: this.$route.query.projectName,
              systemName: this.$route.query.systemName,
              contactId: this.$route.query.contactId,
              contactName: this.$route.query.contactName,
            };
            const res = await api_save_query(params);
            if (res.msg.code == "0000") {
              this.$message.success("保存成功");
              this.$router.push({
                name: "everydaytroubleNew",
                query: {
                  projectId: this.$route.query.projectId,
                  contractId: this.$route.query.contractId,
                  sectionCount: this.$route.query.sectionCount,
                  sectionSort: this.$route.query.sectionSort,
                  systemName: this.$route.query.systemName,
                  projectName: this.$route.query.projectName,
                },
              });
            } else {
            }
          } else if (this.code == "edit") {
            let id = [];
            id.push(this.$route.query.id);
            let params1 = {
              ids: id,
              description: this.formInline.wtms,
              type: this.formInline.wtlx,
              level: this.formInline.wtdj,
              proposer: this.formInline.tcrId,
              processorName: this.formInline.tcr,
              processor: this.formInline.wtclrId,
              processorName: this.formInline.wtclr,
              departName: this.formInline.zrcs,
              liabler: this.formInline.zrrId,
              liablerName: this.formInline.zrr,
              projectId: this.$route.query.projectId,
              contractId: this.$route.query.contractId,
              sectionCount: this.$route.query.sectionCount,
              sectionSort: this.$route.query.sectionSort,
              contactId: this.$route.query.contactId,
              contactName: this.$route.query.contactName,
              processorRoleCode: this.formInline.processorRoleCode,
              processorBuid: this.formInline.processorBuid,
            };
            const res = await api_trouble_edit(params1);
            if (res.msg.code == "0000") {
              this.$message.success("编辑成功");
              this.$router.push({
                name: "everydaytroubleNew",
                query: {
                  projectId: this.$route.query.projectId,
                  contractId: this.$route.query.contractId,
                  sectionCount: this.$route.query.sectionCount,
                  sectionSort: this.$route.query.sectionSort,
                  systemName: this.$route.query.systemName,
                  projectName: this.$route.query.projectName,
                },
              });
            } else {
            }
          }
        } else {
          // this.$message.error("输入数据");
          this.$message.warning("有问题未填写请填写后再试");
          return false;
        }
      });
      this.canClick = false;
      setTimeout(() => {
        this.canClick = true;
      }, 5000);
    },
    saveSelectZRR(val2) {
      console.log(val2, "111111111111111");
      this.formInline.zrr = val2[0].data[0].fullname;
      this.formInline.zrrId = val2[0].data[0].jfid;
      this.formInline.processorBuid = val2[0].data[0].buid;
      this.formInline.processorRoleCode = val2[0].data[0].roleCode;
      this.changeZRRlog = false;
    },
    // 编辑
    saveSelectTCR(val2) {
      console.log(val2, "222222222222222");
      this.formInline.wtclr = val2[0].data[0].fullname;
      this.formInline.wtclrId = val2[0].data[0].jfid;
      this.formInline.processorBuid = val2[0].data[0].buid;
      this.formInline.processorRoleCode = val2[0].data[0].roleCode;
      this.changeWTCLRlog = false;
    },
    getWTLX(val) {
      if (val == "1") {
        return "内部问题";
      } else if (val == "2") {
        return "外部问题";
      } else if (val == "3") {
        return "云网问题";
      }
    },
    getWTDJ(val) {
      if (val == "0") {
        return "轻微";
      } else if (val == "1") {
        return "一般";
      } else if (val == "2") {
        return "严重";
      }
    },
    getSuggestion(route) {
      let data = {
        problemId: "",
        riskId: "",
      };
      if (route.fullPath.includes("trouble")) {
        data.problemId = route.query.id;
      }
      api_queryProblemHistory(data).then((res) => {
        console.log(res, "123");
        if (res.data != []) {
          this.arr = res.data.map((item) => {
            let description = "";
            let title1 =
              item.typeName == "转办"
                ? item.subSuggestion
                  ? item.subSuggestion
                  : ""
                : item.typeName == "关闭"
                ? item.closeSuggestion
                  ? item.closeSuggestion
                  : ""
                : item.typeName == "跟进"
                ? item.followUpSuggestion
                  ? item.followUpSuggestion
                  : ""
                : "";
            let x =
              item.typeName == "转办"
                ? "转办处理意见:"
                : item.typeName == "关闭"
                ? "关闭处理意见:"
                : item.typeName == "跟进"
                ? "跟进处理意见:"
                : "";
            description =
              "操作人:" +
              item.operatorName +
              "<span>&emsp;&emsp;&emsp;&emsp;</span>" +
              "操作时间:" +
              item.operatorTime +
              "<span>&emsp;&emsp;&emsp;&emsp;</span>" +
              (item.subContractor
                ? "被转办人:" + item.subContractor + "&emsp;&emsp;&emsp;"
                : "") +
              "<br/><br/>" +
              x +
              "&emsp;" +
              title1;
            return {
              description,
              title: item.typeName,
              per: item.operatorName,
              time: item.operatorTime,
            };
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// 文本域
::v-deep .el-textarea .el-input__count {
  line-height: 20px;
  bottom: 2px;
}
.all {
  background-color: #fff;
  padding: 40px 40px;
}
.total-page {
  background: #fff;
  overflow-y: scroll;
  overflow-x: hidden;
}
.el-form {
  padding-left: 1vw;
  padding-bottom: 5vw;
}
.el-form--inline .el-form-item {
  margin-bottom: 20px;
}
.sradd {
  margin-top: 40px;
  padding: 80px;
  padding-top: 0;
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
::v-deep.el-dialog__header {
  text-align: center !important;
}
.sr-view {
  margin: 0 40px;
}

::v-deep .el-form--inline .el-form-item__content {
  width: 70% !important;
  // display: flex;
  // align-items: center;
}
::v-deep.el-form--inline .el-form-item {
  width: 100%;
}
::v-deep.el-select {
  width: 100%;
}
.elItem ::v-deep.el-form-item__content {
  width: 90% !important;
  padding-bottom: 5px;
}
.elItems ::v-deep.el-form-item__content {
  padding-bottom: 5px;
}
.sys ::v-deep .el-form-item__content {
  width: 80% !important;
}
.segment ::v-deep .el-form-item__content {
  width: 90% !important;
}
.btns {
  border: 1px dashed rgba(66, 130, 255, 1);
  border-radius: 50% !important;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  .icon {
    color: rgba(66, 130, 255, 1);
  }
}
::v-deep .step {
  // height: 340px !important;
  display: flex !important;
  justify-content: flex-start !important;
  margin-left: 40px !important;
  margin-bottom: 20px;
}
::v-deep .el-tabs__header {
  padding: 0 20px;
  padding-top: 10px;
}
::v-deep .sr-view {
  padding-bottom: 10px;
}
::v-deep .el-step__line {
  width: 1px !important;
}
::v-deep .el-step.is-vertical {
  flex-basis: 35% !important;
}
::v-deep .el-step__description {
  margin-bottom: 20px !important;
}
</style>
