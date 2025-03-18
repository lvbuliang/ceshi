<template>
  <div v-if="showWorkFlow" class="workflow flow">
    <div class="workflow_formAdd">
      <div v-if="[201, 202, 203].includes(statuss)">
        <div class="text group">监理审核</div>
        <SrAdd
          class="sradd"
          :config="formGroup.config"
          :enums="formGroup.enums"
          :form="formGroup.data"
          :otherConfig="formGroup.otherConfig"
          ref="add1"
        >
        </SrAdd>
      </div>
      <div v-if="[301, 302, 303].includes(statuss)">
        <div class="text group">项目负责人审核</div>
        <SrAdd
          class="Xsradd"
          :config="formInter.config"
          :enums="formInter.enums"
          :form="formInter.data"
          :otherConfig="formInter.otherConfig"
          ref="add1"
        >
          <div slot="group" class="group">
            <el-tag
              v-for="(item, index) in formInter.data.reviewList"
              :key="index"
              >{{ item.fullName }}</el-tag
            >
          </div>
        </SrAdd>
      </div>
      <div v-if="[401, 402, 403].includes(statuss)">
        <div class="text group">评审小组审核</div>
        <SrAdd
          class="sradd"
          :config="formPSXZ.config"
          :enums="formPSXZ.enums"
          :form="formPSXZ.data"
          :otherConfig="formPSXZ.otherConfig"
          ref="add1"
        >
        </SrAdd>
      </div>
      <div v-if="[501, 502, 503].includes(statuss)">
        <div class="text group">通过终验</div>
        <SrAdd
          class="sradd"
          :config="formEnd.config"
          :enums="formEnd.enums"
          :form="formEnd.data"
          :otherConfig="formEnd.otherConfig"
          ref="add1"
        >
        </SrAdd>
      </div>
    </div>
    <!-- 审批按钮组 -->
    <div class="workflow_buttons">
      <div
        class="workflow_button btn"
        :key="index"
        v-for="(item, index) in buttonList"
      >
        <!-- v-if="item.btnEventType == 'fp'" -->
        <el-button @click.stop="goback(item)" :type="item.btnType">{{
          item.btnName
        }}</el-button>
        <!-- <slot :name="item.slotName" :btn="item" v-else-if="item.slotName"> -->
        <!-- </slot> -->
        <!-- 通过不通过 -->
        <!-- <el-button
          :disabled="item.disabled"
          v-else
          @click.stop="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button> -->
      </div>
      <div  v-if="backFlag" class="gobackList btn">
        <el-button @click="gobackList()" plain size="medium" round>返回列表</el-button>
        <el-button  v-if=isFromWorkBench type='success' size="small" @click="backWorkBench">前往工作台</el-button>
      </div>
    </div>

    <!-- 审批留痕 -->
    <srStacetrack
      ref="track"
      class="track"
      :imgUrl="imgUrl"
      :trackData="trackData"
      :srTraceArr="srTraceArr"
      :srTraceActive="srTraceActive"
      :trackLoading="trackLoading"
    ></srStacetrack>
  </div>
</template>

<script>
import srStacetrack from "../components/srStacetrack.vue";

// import { getUserByRoleCode } from "@/api/planProject";
import { getSeePorManagment } from "@/api/projectManagement/index.js";
import {
  api_getFixedGroupMembers,
  getAddedGroupMembers,
} from "@/api/preResearchDelivery/index.js";
import { api_getViewList } from "@/api/projectEnd/index.js";
export default {
  name: "subTaskWorkFlowView",
  components: { srStacetrack },
  // "rowDatas"
  inject: ["srtracetrackRequest", "workflowRequest"],
  props: {
    // 回显
    viewForm: Object,
    statuss: Number,
    followforms: Object,
    currentStatus: Number,
    currentKind: Number,
    validate: {
      type: Boolean,
      default() {
        return false;
      },
    },
    workFlowConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    buttonList: {
      type: Array,
      default() {
        return [];
      },
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    todoData: {
      type: Object,
    },
    extraParams: {
      type: Object,
      default() {
        return {};
      },
    },
    hideFrom: Boolean,
    clickMethods: Object,
    customEventMethods: Object,
    taskId: String || Number,
    backName: String,
    hideTrackIcon: Boolean,

    backFlag: {
      type: Boolean,
      default() {
        return true;
      },
    },
    //自动保存时根据这个判断
    workFlowLoading: {
      type: String | Boolean,
      default() {
        return "";
      },
    },
    //返回是否携带路由参数
    routerQuery: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //工单设置处理参数
    WorkOrderDisposeFlag: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //防抖延迟时间
    deTime: {
      type: [String, Number],
      default() {
        return 1000;
      },
    },
    // 缓存方案中，点击按钮后的回调方法
    callbackFn: {
      type: Function,
      default: null,
    },
    // 工作流审批
    auditJson: {
      type: Object,
      default() {
        return {};
      },
    },
    // build
    createBuid: {
      type: String,
      default() {
        return "";
      },
    },
    expertViewList: {
      type: Array,
      default() {
        return [];
      },
    },
    // formData
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
    projectId: {
      type: String || Number,
    },
    projeciId: {
      type: String || Number,
    },
    processId: {
      type: String || Number,
    },
  },
  watch: {
    "$route.path": {
      handler(newVal) {},
    },
    workFlowLoading: {
      handler(val) {
        this.loading = val;
      },
    },
    workFlowConfig: {
      handler(val) {
        if (val && Object.keys(val).length) {
          // this.setFromConfig(val);
        }
      },
      deep: true,
    },
    buttonList: {
      handler(val) {
        console.log(val);
        if (val.length) {
          if (val.showForm) {
            // this.getFormConfig();
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    version() {
      return this.$route ? this.$route.query.version : "";
    },
    statusNames() {
      this.statusName = this.$route ? this.$route.query.statusName : "";
      return this.statusName;
    },
    id() {
      return this.$route ? this.$route.query.id : "";
    },
    userInfo() {
      return sessionStorage.getItem("userInfo");
    },
    getToTime() {
      let myDate = new Date();
      let str = myDate.toTimeString();
      let timeStr = str.substring(0, 8);
      return timeStr;
    },
  },
  data() {
    return {
      isFromWorkBench: false,//是否来自工作台
      trackLoading: true,
      defaultProps: {
        name: "name",
        value: "value",
        fileList: "fileList",
        list: "list",
      },
      transformData: null,
      commonDisabled: false,
      isShowTooltip: false,
      dialogVisible: false,
      data: [],
      search: "",
      selectdata: [],
      allData: [], //搜索所有专家数据
      nowSelectData: [],
      inputWidth: 0,
      textarea: "",
      timer: "",
      searchIndex: "",
      activeName: 1,
      activeItem: {},
      activeItemIndex: false,
      beAssignerList: [],
      itemList: [], //可选专家
      solicitedData: [], //已征求专家
      expertSkillList: [], //专家技能列表
      lastChildIndex: false,
      trackData: [],
      markData: [],
      visible: false,
      showWorkFlow: true,
      imgUrl: "",
      total: "",
      currentPage: 1,
      checkedCities: [],
      // 处理
      checkedCities1: [],
      cities: ["上海", "北京", "广州", "深圳"],
      isIndeterminate: true,
      fpForm: {
        config: [
          {
            type: "select",
            name: "分配人",
            bind: "beAssigner",
            placeholder: "请选择分配人",
            trigger: "change",
            dataList: "beAssignerList",
            required: "请选择分配人",
            col: 24,
          },
        ],
        data: {
          beAssigner: "",
        },
        enums: {
          beAssignerList: [],
        },
      },
      lastChildItem: {},
      form: {
        config: [
          // {
          //   type: "slot",
          //   slotName: "inputBox2",
          //   name: "初审意见",
          //   placeholder: "请输入意见",
          //   bind: "overallOpinion",
          //   append: true,
          //   maxlength: 500,
          //   col: 8,
          //   trigger: "change",
          //   disabled: true,
          // },
          // {
          //   type: "select",
          //   className: "xuanze",
          //   slotName: "inputBox",
          //   name: "初审结论",
          //   placeholder: "请选择结论",
          //   bind: "overallConclusion",
          //   dataList: "conclusionList",
          //   append: true,
          //   disabled: false,
          //   maxlength: 500,
          //   col: 8,
          // },
          // {
          //   type: "upload",
          //   name: "附件",
          //   className: "fujian",
          //   bind: "preliminaryExaminationAnnex",
          //   fileList: [],
          //   fileTip: "仅支持pdf,word,ofd格式文件",
          //   fileType: "pdf,doc,docx,ofd",
          //   limit: 10,
          //   disabled: true,
          //   tipPopover: true, // hover显示提示  默认外面显示
          //   col: 8,
          // },
          // // 前置审查意见
          // {
          //   type: "slot",
          //   slotName: "inputBox3",
          //   name: "前置审查意见",
          //   placeholder: "请输入前置审查意见",
          //   bind: "auditOpinion",
          //   append: true,
          //   maxlength: 500,
          //   col: 24,
          // },
          // 征求意见
          {
            type: "slot",
            slotName: "inputBox",
            name: "审批意见",
            placeholder: "请输入意见",
            bind: "auditOpinion",
            append: true,
            // maxlength: 500,
            col: 24,
            className: "primary-label",
          },
          // {
          //   type: "upload",
          //   name: "附件",
          //   bind: "accessoryList",
          //   fileList: [],
          //   fileTip: "仅支持pdf,word,ofd格式文件",
          //   fileType: "pdf,doc,docx,ofd",
          //   limit: 10,
          //   tipPopover: true, // hover显示提示  默认外面显示
          //   col: 16,
          // },
        ],
        enums: {
          conclusionList: [],
        },
        data: {
          overallOpinion: "", //初审意见
          overallConclusion: "", //初审结论
          preliminaryExaminationAnnex: [], //初审附件
          jointReviewOpinion: "", //联合会审意见
          jointReviewConclusion: "", //联合会审结论
          jointReviewAnnex: [], //联合会审附件
          onSiteReviewOpinion: "", //现场评审意见
          onSiteReviewConclusion: "", //现场评审结论
          onSiteReviewAnnex: [], //现场评审附件
          reexamineOpinion: "", //复审意见
          reexamineConclusion: "", //复审结论
          reexamineAnnex: [], //复审附件
          opinion: "", //函评意见
          conclusion: "", //函评结论
          fileList: [], //函评附件
          auditUserName: "",
          auditOpinion: "", //审核意见
          auditTime: "",
          accessoryList: [], //附件
        },
      },
      loading: "",
      isAdd1Show: false,
      noSubmitFlag: false,
      isDisabled: false,
      //
      // status: 1,
      status: "",
      statusName: "",
      // 监理审核
      formGroup: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "input",
            name: "审核人",
            bind: "reviewName",
            disabled: true,
            class: "forminter",
            maxLength: 20,
            col: 24,
          },
          {
            type: "input",
            // timeType: "date",
            name: "审核时间",
            disabled: true,
            bind: "reviewTime",
            maxLength: 20,
            class: "forminter",
            col: 24,
          },
          {
            type: "textarea",
            name: "审核意见",
            bind: "reviewText",
            required: "请输入审核意见",
            className: "appointStyle customClass2",
            col: 24,
            row:3,
            append: true,
            maxlength: 500,
          },
        ],
        data: {
          // 审核人
          reviewName: "",
          // 审核时间
          reviewTime: this.getNowTime(),
          // 审核意见
          reviewText: "",
        },
        enums: {},
      },
      // 项目负责人审核
      formInter: {
        otherConfig: {
          labelNum: 210,
        },
        config: [
          {
            type: "input",
            name: "审核人",
            bind: "reviewName",
            disabled: true,
            maxLength: 20,
            class: "forminter",
            col: 24,
          },
          {
            type: "input",
            name: "审核时间",
            disabled: true,
            bind: "reviewTime",
            // maxLength: 20,
            class: "forminter",
            col: 24,
          },
          {
            type: "textarea",
            name: "审核意见",
            bind: "reviewText",
            col: 24,
            row: 3,
            append: true,
            maxlength: 500,
            required: "请输入审核意见",
            className: "appointStyle customClass2",
          },
          {
            type: "slot",
            slotName: "group",
            name: "评审小组",
            placeholder: "请选择评审小组",
            bind: "reviewList",
            maxLength: 16,
            class: "gg",
            col: 16,
            // required: "评审小组必填",
          },
          {
            type: "select",
            name: "添加评审人员",
            placeholder: "请选择评审人员",
            bind: "reviewPerson",
            dataList: "reviewPersonList",
            maxLength: 20,
            class: "forminter",
            // required: "请选择评审人员",
            col: 24,
            multiple: true,
          },
        ],
        data: {
          // 审核人
          reviewName: "",
          // 审核时间
          reviewTime: this.getNowTime(),
          // 审核意见
          reviewText: "",
          // 评审小组
          reviewList: [],
          // 添加评审人员
          reviewPerson: [],
        },
        enums: {
          // 添加评审人员
          reviewPersonList: [],
        },
      },
      // 评审小组选人
      PSXZList: [],
      // 评审小组送审
      formPSXZ: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "input",
            name: "审核人",
            bind: "reviewName",
            disabled: true,
            class: "forminter",
            maxLength: 20,
            col: 24,
          },
          {
            type: "input",
            name: "审核时间",
            disabled: true,
            bind: "reviewTime",
            class: "forminter",
            maxLength: 20,
            col: 24,
          },
          {
            type: "textarea",
            name: "审核意见",
            bind: "reviewText",
            className: "appointStyle customClass2",
            col: 24,
            row: 3,
            append: true,
            maxlength: 500,
            required: "请输入审核意见",
          },
        ],
        data: {
          // 审核人
          reviewName: "",
          // 审核时间
          reviewTime: this.getNowTime(),
          // 评审意见
          reviewText: "",
        },
        enums: {},
      },
      // 通过终验
      formEnd: {
        otherConfig: {
          labelNum: 210,
        },
        config: [
          {
            type: "dateSelect",
            timeType: "date",
            name: "终验评审会日期",
            placeholder: "请选择终验评审会日期",
            bind: "endReviewDate",
            required: "请选择终验评审会日期",
            format: "yyyy-MM-dd",
            maxLength: 20,
            class: "forminter",
            col: 24,
          },
          {
            type: "upload",
            name: "评审意见",
            bind: "reviewTextList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "终验报审表盖章件",
            bind: "reviewStampList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "报告盖章文件",
            bind: "reportStampList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType: "doc,docx,pdf,jpg,jpeg,jpe,png,",
            fileTip: "仅支持上传pdf,word,图片格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          // 终验附件
          {
            type: "upload",
            name: "通过终验其他附件",
            bind: "otherListTwo",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "textarea",
            name: "审批意见",
            placeholder: "请输入审批意见",
            bind: "xmfzrRemark",
            append: true,
            maxlength: 500,
            col: 24,
            row: 3,
            className: "appointStyle customClass2",
          },
        ],
        data: {
          // 终验评审会日期
          endReviewDate: "",
          // 评审意见
          reviewTextList: [],
          // 终验报审表盖章件
          reviewStampList: [],
          // 报告盖章件
          reportStampList: [],
          // 终验附件
          // // 通过终验其他附件
          otherListTwo: [],
          xmfzrRemark: "",
        },
        enums: {},
      },

      grouparam: {},
      grousaveparam: {},
      // 集团审议退回参数
      outparam: {},
      // 集团审议不通过参数
      outgroupparam: {},
      // 集团审议保存参数
      saveparam: {},
      // 内部立项参数
      interparam: {},
      // 内部立项退回参数
      interoutparam: {},
      // 内部立项不通过参数
      interoutgroupparam: {},
      // 内部立项保存参数
      intersaveparam: {},
      // 终验参数
      endparam: {},
      // 监理不通过
      JLparam: {},
      // 监理退回
      JLTHparam: {},
      PSXZparam: {},
      PSXZTHparam: {},
      PSXZSaveparam: {},
      XMFZRTHparam: {},
      XMFZRparam: {},
      XMFZRsaveparam: {},
      ZYSaveparam: {},
      ZYTHparam: {},
      ZYparam: {},
      //重复id
      idAndName: [],
      idAndNameList: [],
      srTraceActive: 1,
      srTraceArr: [
        {
          description: "承建单位项目经理-发起终验",
        },
        {
          description: "监理工程师审批",
        },
        {
          description: "项目负责人通过",
        },
        {
          description: "评审小组通过",
        },
        {
          description: "项目负责人终验通过",
        },
      ],
    };
  },
  async created() {
    // 评审小组
    this.getBaseMembers();
    this.getUserByCode();
    // 基础数据回显
    // this.getSee();
  },
  mounted() {
    if(this.$route.query.activeName=='待办'||this.$route.query.activeName=='已办'){
      this.isFromWorkBench = true
    }
    this.formGroup.data.reviewName = JSON.parse(this.userInfo).fullname;
    this.formInter.data.reviewName = JSON.parse(this.userInfo).fullname;
    this.formPSXZ.data.reviewName = JSON.parse(this.userInfo).fullname;
    this.flowData();
  },
  beforeDestroy() {
    this.showWorkFlow = false;
  },
  destroyed() {
    this.$destroy();
    this.showWorkFlow = false;
  },

  methods: {
    backWorkBench(){
    this.$router.go(-1)
    },
    async getSee() {
      let datas = {
        processId: this.processId,
        projectId: this.projeciId,
      };
      const res = await getSeePorManagment(datas);
      if (res.msg.code == "0000") {
        // 留痕
        if (res.data.projectIntiaonId) {
          // this.getHoverTraceTrack(res.data.projectIntiaonId);
          this.getTraceTrack(this.id);
          // this.getTraceTrackImage();
        }
      }
    },

    async flowData() {
      let dataPar = {
        id: this.id,
      };
      const res = await api_getViewList(dataPar);
      if (res.data) {
        if ([201, 202, 203].includes(this.statuss)) {
          if (res.data.jlAuditorName) {
            // this.formGroup.data.reviewName = res.data.jlAuditorName;
            this.formGroup.data.reviewTime =
              res.data.jlAuditorDate == "" || res.data.jlAuditorDate == null
                ? this.getNowTime()
                : res.data.jlAuditorDate;
            // console.log(res.data.jlAuditorDate,'res.data.jlAuditorDate')
            this.formGroup.data.reviewText = res.data.jlAuditorIdea;
          }
        }
        if ([301, 302, 303].includes(this.statuss)) {
          if (res.data.xmfzrAuditorName) {
            this.PSXZList = [];
            // this.formInter.data.reviewName = res.data.xmfzrAuditorName;
            // this.formInter.data.reviewTime = res.data.xmfzrAuditorDate;
            this.formInter.data.reviewTime =
              res.data.xmfzrAuditorDate == "" ||
              res.data.xmfzrAuditorDate == null
                ? this.getNowTime()
                : res.data.xmfzrAuditorDate;

            this.formInter.data.reviewText = res.data.xmfzrAuditorIdea;
            let addInfo = [];
            let result = [];
            res.data.reviewIds.forEach((item) => {
              if (item.fixed == 1) {
                addInfo.push(item);
              }
            });
            result = addInfo.map((item) => {
              return item.jfid;
            });
            this.$set(this.formInter.data, "reviewPerson", result);
          }
        }
        if ([401, 402, 403].includes(this.statuss)) {
          if (res.data.psxzAuditorName) {
            // this.formPSXZ.data.reviewName = res.data.psxzAuditorName;
            // this.formPSXZ.data.reviewTime = res.data.psxzAuditorDate;
            this.formPSXZ.data.reviewTime =
              res.data.psxzAuditorDate == "" || res.data.psxzAuditorDate == null
                ? this.getNowTime()
                : res.data.psxzAuditorDate;

            this.formPSXZ.data.reviewText = res.data.psxzAuditorIdea;
          }
        }
        if ([501, 502, 503].includes(this.statuss)) {
          if (res.data.deliverys.length != 0) {
            let filesreviewTextList = [];
            let filereviewStampList = [];
            let filereportStampList = [];
            let fileotherListTwo = [];

            this.idAndNameList = [];

            this.formEnd.data.endReviewDate = res.data.zhongyanOne;
            this.formEnd.data.xmfzrRemark = res.data.xmfzrRemark
              ? res.data.xmfzrRemark
              : "";
            res.data.deliverys.forEach((item) => {
              this.idAndNameList.push(item.deliveryName);

              this.idAndName.push({
                id: item.id,
                deliveryName: item.deliveryName,
              });

              if (item.deliveryName == "评审意见") {
                filesreviewTextList.push(item);
                this.formEnd.data.reviewTextList =
                  this.getdeliverys(filesreviewTextList);
              }
              if (item.deliveryName == "终验报审表盖章件") {
                filereviewStampList.push(item);
                this.formEnd.data.reviewStampList =
                  this.getdeliverys(filereviewStampList);
              }
              if (item.deliveryName == "报告盖章文件") {
                filereportStampList.push(item);
                this.formEnd.data.reportStampList =
                  this.getdeliverys(filereportStampList);
              }
              // 终验附件
              if (item.deliveryName == "通过终验其他附件") {
                fileotherListTwo.push(item);
                this.formEnd.data.otherListTwo =
                  this.getdeliverys(fileotherListTwo);
              }
            });
          }
        }
        this.getTraceTrack(this.id);
      }
    },
    // 评审小组
    getBaseMembers() {
      api_getFixedGroupMembers({ type: 1 }).then((res) => {
        this.formInter.data.reviewList = res.data;
      });
    },
    getUserByCode() {
      api_getFixedGroupMembers({ type: 2 }).then((res) => {
        // this.formInter.enums.reviewPersonList = res.data
        res.data.map((element) => {
          // this.baseMembersList = res.data;
          this.formInter.enums.reviewPersonList.push({
            // dataName: String(element.fullName),
            // dataValue: element.jfid,
            // buid: element.userInfoVos[0].buid,
            // roleCode: String(element.userInfoVos[0].roleCode),
            buName: element.userInfoVos[0].buName,
            fullName: String(element.userInfoVos[0].fullName),
            jfid: element.userInfoVos[0].jfid,
            buid: element.userInfoVos[0].buid,
            roleCode: String(element.userInfoVos[0].roleCode),
            roleName: element.userInfoVos[0].roleName,
            dataName: String(element.fullName),
            dataValue: element.jfid,
          });
        });
      });
    },
    // 是否显示提示
    visibilityChange(event, item) {
      console.log(event, item);
      const ev = event.target;
      const ev_weight = ev.scrollWidth; // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
      const content_weight = ev.clientWidth; // 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
      // const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
      /* if (ev_weight > content_weight) {
        // 实际宽度 > 可视宽度  文字溢出
        this.isShowTooltip = true;
      } else {
        // 否则为不溢出
        this.isShowTooltip = false;

      } */
      // this.getExpertSkill(item.id); //专家技能接口
      this.isShowTooltip = true;
    },

    popover(item) {
      // this.form.data.auditOpinion = this.textarea;
    },

    //设置工作流表单配置
    setFromConfig(list) {
      let list1 = [
        {
          type: "slot",
          slotName: "inputBox",
          name: "审核意见",
          placeholder: "请输入审核意见",
          bind: "auditOpinion",
          append: true,
          maxlength: 500,
          col: 8,
        },
        // {
        //   type: "upload",
        //   name: "附件",
        //   bind: "accessoryList",
        //   fileList: [],
        //   limit: 10,
        //   tipPopover: true, // hover显示提示  默认外面显示
        //   col: 18,
        // },
      ];
      if (list && Object.keys(list.enums).length) {
        let obj = { ...list.enums, ...this.form.enums };
        this.$set(this.form, "enums", obj);
      }
      if (list && Array.isArray(list.config)) {
        let list1 = [...list.config, ...list1];
        this.$set(this.form, "config", list1);
      }
    },
    //阻止冒泡
    maskLayerContent() {},
    //分配二次确定取消
    maskLayerClose() {
      this.activeItemIndex = false;
      this.activeItem = {};
    },
    arrFilter(arr, val, key) {
      return arr.filter((item) => item[key] != val);
    },
    gobackList() {
      this.$router.push({
        name: "projectEnd",
      });
    },

    routeClose(timeout, routepath) {
      console.log(timeout, routepath);
      let newroutepath = "";
      if (routepath) {
        newroutepath = routepath;
      } else {
        newroutepath = window.location.pathname.replace(/\//g, "");
      }
      this.$SrUtils.routeClose.call(
        this,
        newroutepath,
        this.$setState,
        timeout
      );
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
      // " " +
      // hour +
      // ":" +
      // minutes +
      // ":" +
      // seconds;

      return currentdate;
    },
    getParam() {
      let item = this.lastChildItem;
      let param = {
        vars: item.btnValue,
        agencyId: item.agencyId ? item.agencyId : "",
        taskId: this.taskId,
        status: item.examineState,
        btnName: item.btnName,
        auditOpinion: this.form.data.auditOpinion,
        accessoryList: this.form.data.accessoryList,
      };
      return param;
    },
    getVal(refs) {
      console.log(refs, "refs");
      return refs;
    },
    goback(item) {
      console.log(item, "sssss");
      // this.gobackClick(item);
      let now = !this.timer;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.deTime || 1000);
      if (now) {
        if (item.btnName == "不通过" || item.btnName == "退回修改") {
          this.$confirm(
            // 原代码
            `${
              item.btnName == "通过"
                ? `确认通过？`
                : item.btnName == "保存"
                ? "确认保存？"
                : ""
            }`,
            `${this.statusNames + item.btnName}`,
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              console.log("11111111");
              this.gobackClick(item);
            })
            .catch(() => {
              console.log("33333333333");
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        } else {
          this.$refs["add1"].validate((val) => {
            if (val) {
              this.$confirm(
                // 原代码
                `${
                  item.btnName == "通过"
                    ? `确认通过？`
                    : item.btnName == "保存"
                    ? "确认保存？"
                    : ""
                }`,
                `${this.statusNames + item.btnName}`,
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  console.log("11111111");
                  this.gobackClick(item);
                })
                .catch(() => {
                  console.log("33333333333");
                  this.$message({
                    type: "info",
                    message: "已取消",
                  });
                });
            }
          });
        }
      }
    },
    getdeliverys(files) {
      let data = [];
      files.forEach((ele) => {
        data.push({
          id: ele.fileContext,
          name: ele.fileName,
          size: ele.fileSize,
          ids: ele.id,
        });
      });
      return data;
    },
    setdeliverys(file, name) {
      let deliverys = [];
      file.forEach((ele) => {
        if (ele.ids) {
          deliverys.push({
            deliveryName: name,
            fileContext: ele.id,
            fileName: ele.name,
            fileSize: this.getSize(ele.size),
            uploadPerson: this.userInfo.fullname,
            id: ele.ids,
          });
        } else {
          deliverys.push({
            deliveryName: name,
            fileContext: ele.id,
            fileName: ele.name,
            fileSize: this.getSize(ele.size),
            uploadPerson: this.userInfo.fullname,
          });
        }
      });
      return deliverys;
    },
    gobackClick(item) {
      // 集团审议，退回修改，不通过参数相同，重复定义了
      if ([201, 202, 203].includes(this.statuss)) {
        if (item.btnName == "退回修改") {
          this.JLTHparam = {
            id: this.id,
            version: this.version,
            taskId: this.taskId,
            auditorDate: this.formGroup.data.reviewTime,
            auditorId: JSON.parse(this.userInfo).jfid,
            auditorName: this.formGroup.data.reviewName,
            auditorIdea: this.formGroup.data.reviewText,
          };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.JLTHparam,
            (res) => {
              // 不通过按钮
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  console.log("11111", "4");
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.JLTHparam) &&
                    Object.keys(this.JLTHparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$message.success("操作成功");
                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "不通过") {
          this.JLparam = {
            id: this.id,
            version: this.version,
            taskId: this.taskId,
          };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.JLparam,
            (res) => {
              // 不通过按钮
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  console.log("11111", "4");
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.JLparam) &&
                    Object.keys(this.JLparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$message.success("操作成功");
                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "保存") {
          this.$refs["add1"].validate((val) => {
            if (val) {
              this.grousaveparam = {
                id: this.id,
                auditorDate: this.formGroup.data.reviewTime,
                auditorId: JSON.parse(this.userInfo).jfid,
                auditorName: this.formGroup.data.reviewName,
                auditorIdea: this.formGroup.data.reviewText,
                taskId: this.taskId,
              };
              this.workflowRequest.setApiAfferentUrlOfPost(
                item.btnUrl,
                this.grousaveparam,
                (res) => {
                  if (res) {
                    if (this.callbackFn) {
                      // 缓存方案中，走回调方法
                      this.callbackFn();
                      return;
                    }
                    if (
                      this.routerQuery ||
                      (Object.keys(this.grousaveparam) &&
                        Object.keys(this.grousaveparam).length > 0)
                    ) {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    } else {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    }
                  }
                }
              );
            }
          });
        } else if (item.btnName == "通过") {
          this.$refs["add1"].validate((val) => {
            if (val) {
              this.grouparam = {
                id: this.id,
                auditorDate: this.formGroup.data.reviewTime,
                auditorId: JSON.parse(this.userInfo).jfid,
                auditorName: this.formGroup.data.reviewName,
                auditorIdea: this.formGroup.data.reviewText,
                taskId: this.taskId,
              };
              this.workflowRequest.setApiAfferentUrlOfPost(
                item.btnUrl,
                this.grouparam,
                (res) => {
                  if (res) {
                    if (this.callbackFn) {
                      // 缓存方案中，走回调方法
                      this.callbackFn();
                      return;
                    }
                    if (
                      this.routerQuery ||
                      (Object.keys(this.grouparam) &&
                        Object.keys(this.grouparam).length > 0)
                    ) {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    } else {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    }
                  }
                }
              );
            }
          });
        }
      }
      if ([301, 302, 303].includes(this.statuss)) {
        if (item.btnName == "退回修改") {
          this.XMFZRTHparam = {
            id: this.id,
            version: this.version,
            taskId: this.taskId,
            auditorDate: this.formInter.data.reviewTime,
            auditorId: JSON.parse(this.userInfo).jfid,
            auditorName: this.formInter.data.reviewName,
            auditorIdea: this.formInter.data.reviewText,
          };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.XMFZRTHparam,
            (res) => {
              // 不通过按钮
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  console.log("11111", "4");
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.XMFZRTHparam) &&
                    Object.keys(this.XMFZRTHparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$message.success("操作成功");
                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "不通过") {
          this.XMFZRparam = {
            id: this.id,
            version: this.version,
            taskId: this.taskId,
          };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.XMFZRparam,
            (res) => {
              // 不通过按钮
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  console.log("11111", "4");
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.XMFZRparam) &&
                    Object.keys(this.XMFZRparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$message.success("操作成功");
                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "保存") {
          this.$refs["add1"].validate((val) => {
            if (val) {
              let reviewIds = [];
              this.formInter.data.reviewList.forEach((item) => {
                reviewIds.push({
                  fixed: 0,
                  jfid: item.jfid,
                  name: item.userInfoVos[0].fullName,
                  zhongyanId: Number(this.id),
                  buName: item.userInfoVos[0].buName,
                  buid: item.userInfoVos[0].buid,
                  first: 0,
                  fullname: item.userInfoVos[0].fullName,
                  roleCode: item.userInfoVos[0].roleCode,
                  userName: item.userInfoVos[0].roleName,
                });
              });
              if (this.formInter.data.reviewPerson.length != 0) {
                this.formInter.data.reviewPerson.forEach((ele) => {
                  this.formInter.enums.reviewPersonList.forEach((item) => {
                    if (ele == item.jfid) {
                      reviewIds.push({
                        buid: Number(item.buid),
                        fixed: 1,
                        name: item.fullName,
                        zhongyanId: Number(this.id),
                        buName: item.buName,
                        first: 1,
                        jfid: item.jfid,
                        fullname: item.fullName,
                        roleCode: item.roleCode,
                        userName: item.roleName,
                      });
                    }
                  });
                });
              }

              this.XMFZRsaveparam = {
                id: this.id,
                auditorDate: this.formInter.data.reviewTime,
                auditorId: JSON.parse(this.userInfo).jfid,
                auditorName: this.formInter.data.reviewName,
                auditorIdea: this.formInter.data.reviewText,
                reviewIds,
                taskId: this.taskId,
              };
              console.log(this.XMFZRsaveparam, "this.XMFZRsaveparam");
              this.workflowRequest.setApiAfferentUrlOfPost(
                item.btnUrl,
                this.XMFZRsaveparam,
                (res) => {
                  if (res) {
                    if (this.callbackFn) {
                      // 缓存方案中，走回调方法
                      this.callbackFn();
                      return;
                    }
                    if (
                      this.routerQuery ||
                      (Object.keys(this.XMFZRsaveparam) &&
                        Object.keys(this.XMFZRsaveparam).length > 0)
                    ) {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    } else {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    }
                  }
                }
              );
            }
          });
        } else if (item.btnName == "通过") {
          this.$refs["add1"].validate((val) => {
            if (val) {
              let reviewIds = [];
              this.formInter.data.reviewList.forEach((item) => {
                reviewIds.push({
                  fixed: 0,
                  jfid: item.jfid,
                  name: item.userInfoVos[0].fullName,
                  zhongyanId: Number(this.id),
                  buName: item.userInfoVos[0].buName,
                  buid: item.userInfoVos[0].buid,
                  first: 0,
                  fullname: item.userInfoVos[0].fullName,
                  roleCode: item.userInfoVos[0].roleCode,
                  userName: item.userInfoVos[0].roleName,
                });
              });
              if (this.formInter.data.reviewPerson.length != 0) {
                this.formInter.data.reviewPerson.forEach((ele) => {
                  this.formInter.enums.reviewPersonList.forEach((item) => {
                    if (ele == item.jfid) {
                      reviewIds.push({
                        buid: Number(item.buid),
                        fixed: 1,
                        name: item.fullName,
                        zhongyanId: Number(this.id),
                        buName: item.buName,
                        first: 1,
                        jfid: item.jfid,
                        fullname: item.fullName,
                        roleCode: item.roleCode,
                        userName: item.roleName,
                      });
                    }
                  });
                });
              }
              this.saveparam = {
                id: this.id,
                auditorDate: this.formInter.data.reviewTime,
                auditorId: JSON.parse(this.userInfo).jfid,
                auditorName: this.formInter.data.reviewName,
                auditorIdea: this.formInter.data.reviewText,
                reviewIds,
                taskId: this.taskId,
              };
            }
          });
          console.log(this.saveparam, " this.saveparam");
          // return;
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.saveparam,
            (res) => {
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.grouparam) &&
                    Object.keys(this.grouparam).length > 0)
                ) {
                  this.routeClose();
                  this.$router.push({ name: "projectEnd" });
                  this.$message.success("操作成功");
                } else {
                  this.routeClose();
                  this.$router.push({ name: "projectEnd" });
                  this.$message.success("操作成功");
                }
              }
            }
          );
        }
      }
      if ([401, 402, 403].includes(this.statuss)) {
        if (item.btnName == "退回修改") {
          this.$refs["add1"].validate((val) => {
            if (val) {
              this.PSXZTHparam = {
                id: this.id,
                version: this.version,
                taskId: this.taskId,
                auditorDate: this.formPSXZ.data.reviewTime,
                auditorId: JSON.parse(this.userInfo).jfid,
                auditorName: this.formPSXZ.data.reviewName,
                auditorIdea: this.formPSXZ.data.reviewText,
              };
              this.workflowRequest.setApiAfferentUrlOfPost(
                item.btnUrl,
                this.PSXZTHparam,
                (res) => {
                  // 不通过按钮
                  console.log(res);
                  if (res) {
                    if (this.callbackFn) {
                      // 缓存方案中，走回调方法
                      this.callbackFn();
                      console.log("11111", "4");
                      return;
                    }
                    if (
                      this.routerQuery ||
                      (Object.keys(this.PSXZTHparam) &&
                        Object.keys(this.PSXZTHparam).length > 0)
                    ) {
                      this.routeClose();
                      this.$message.success("操作成功");
                      console.log("11111", "5");

                      this.$router.push({
                        name: "projectEnd",
                        // 查看相关逻辑
                      });
                    } else {
                      this.routeClose();
                      console.log("11111", "6");
                      this.$message.success("操作成功");
                      this.$router.push({
                        name: "projectEnd",
                        // 查看相关逻辑
                      });
                    }
                  }
                }
              );
            }
          });
        } else if (item.btnName == "不通过") {
          this.PSXZparam = {
            id: this.id,
            version: this.version,
            taskId: this.taskId,
          };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.PSXZparam,
            (res) => {
              // 不通过按钮
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  console.log("11111", "4");
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.PSXZparam) &&
                    Object.keys(this.PSXZparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$message.success("操作成功");
                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "保存") {
          this.$refs["add1"].validate((val) => {
            if (val) {
              this.PSXZSaveparam = {
                id: this.id,
                auditorDate: this.formPSXZ.data.reviewTime,
                auditorId: JSON.parse(this.userInfo).jfid,
                auditorName: this.formPSXZ.data.reviewName,
                auditorIdea: this.formPSXZ.data.reviewText,
                taskId: this.taskId,
              };
              console.log(this.PSXZSaveparam, "this.PSXZSaveparam");
              this.workflowRequest.setApiAfferentUrlOfPost(
                item.btnUrl,
                this.PSXZSaveparam,
                (res) => {
                  if (res) {
                    if (this.callbackFn) {
                      // 缓存方案中，走回调方法
                      this.callbackFn();
                      return;
                    }
                    if (
                      this.routerQuery ||
                      (Object.keys(this.PSXZSaveparam) &&
                        Object.keys(this.PSXZSaveparam).length > 0)
                    ) {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    } else {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    }
                  }
                }
              );
            }
          });
        } else if (item.btnName == "通过") {
          this.$refs["add1"].validate((val) => {
            if (val) {
              this.interparam = {
                id: this.id,
                auditorDate: this.formPSXZ.data.reviewTime,
                auditorId: JSON.parse(this.userInfo).jfid,
                auditorName: this.formPSXZ.data.reviewName,
                auditorIdea: this.formPSXZ.data.reviewText,
                taskId: this.taskId,
              };
            }
          });
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.interparam,
            (res) => {
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.interparam) &&
                    Object.keys(this.interparam).length > 0)
                ) {
                  this.routeClose();
                  this.$router.push({ name: "projectEnd" });
                  this.$message.success("操作成功");
                } else {
                  this.routeClose();
                  this.$router.push({ name: "projectEnd" });
                  this.$message.success("操作成功");
                }
              }
            }
          );
        }
      }
      if ([501, 502, 503].includes(this.statuss)) {
        let deliverys = [];
        if (this.formEnd.data.reviewTextList.length != 0) {
          deliverys.push(
            ...this.setdeliverys(this.formEnd.data.reviewTextList, "评审意见")
          );
        }
        if (this.formEnd.data.reviewStampList.length != 0) {
          deliverys.push(
            ...this.setdeliverys(
              this.formEnd.data.reviewStampList,
              "终验报审表盖章件"
            )
          );
        }

        if (this.formEnd.data.reportStampList.length != 0) {
          deliverys.push(
            ...this.setdeliverys(
              this.formEnd.data.reportStampList,
              "报告盖章文件"
            )
          );
        }
        // 终验附件
        if (this.formEnd.data.otherListTwo.length != 0) {
          deliverys.push(
            ...this.setdeliverys(
              this.formEnd.data.otherListTwo,
              "通过终验其他附件"
            )
          );
        }
        if (item.btnName == "退回修改") {
          this.ZYTHparam = {
            id: this.id,
            version: this.version,
            taskId: this.taskId,
            deliverys: deliverys,
            zhongyanOne: this.formEnd.data.endReviewDate,
            xmfzrRemark: this.formEnd.data.xmfzrRemark,
          };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.ZYTHparam,
            (res) => {
              // 不通过按钮
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  console.log("11111", "4");
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.ZYTHparam) &&
                    Object.keys(this.ZYTHparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$message.success("操作成功");
                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "不通过") {
          this.ZYparam = {
            id: this.id,
            version: this.version,
            taskId: this.taskId,
            xmfzrRemark: this.formEnd.data.xmfzrRemark,
          };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.ZYparam,
            (res) => {
              // 不通过按钮
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  console.log("11111", "4");
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.ZYparam) &&
                    Object.keys(this.ZYparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$message.success("操作成功");
                  this.$router.push({
                    name: "projectEnd",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "保存") {
          // this.$refs["add1"].validate((val) => {
          //   if (val) {
          this.ZYSaveparam = {
            id: this.id,
            zhongyanOne: this.formEnd.data.endReviewDate,
            deliverys: deliverys,
            taskId: this.taskId,
            xmfzrRemark: this.formEnd.data.xmfzrRemark,
          };
          console.log(this.ZYSaveparam, "this.ZYSaveparam");
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.ZYSaveparam,
            (res) => {
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.ZYSaveparam) &&
                    Object.keys(this.ZYSaveparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  this.$router.push({ name: "projectEnd" });
                } else {
                  this.routeClose();
                  this.$router.push({ name: "projectEnd" });
                  this.$message.success("操作成功");
                }
              }
            }
          );
          // }
          // });
        } else if (item.btnName == "通过") {
          this.$refs["add1"].validate((val) => {
            if (val) {
              this.endparam = {
                id: this.id,
                zhongyanOne: this.formEnd.data.endReviewDate,
                deliverys: deliverys,
                taskId: this.taskId,
                xmfzrRemark: this.formEnd.data.xmfzrRemark,
              };
              console.log(this.endparam, "this.endparamthis.endparam");
              this.workflowRequest.setApiAfferentUrlOfPost(
                item.btnUrl,
                this.endparam,
                (res) => {
                  if (res) {
                    if (this.callbackFn) {
                      // 缓存方案中，走回调方法
                      this.callbackFn();
                      return;
                    }
                    if (
                      this.routerQuery ||
                      (Object.keys(this.endparam) &&
                        Object.keys(this.endparam).length > 0)
                    ) {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    } else {
                      this.routeClose();
                      this.$router.push({ name: "projectEnd" });
                      this.$message.success("操作成功");
                    }
                  }
                }
              );
            }
          });
        }
      }
      // }
    },
    getTraceTrack(val) {
      if (!this.busiType || !val) {
        this.trackLoading = false;
      } else {
        this.trackLoading = true;
        this.srtracetrackRequest.getTraceTrackList({ busId: val }, (res) => {
          this.trackData = res.data;
          this.trackLoading = false;
          this.srTraceActive = this.trackData.length + 1;
        });
      }
    },
    //留痕轨迹图片
    getTraceTrackImage() {
      if (!this.processId) return;
      this.srtracetrackRequest.getTraceTrackImage(
        { processId: this.processId },
        (res) => {
          this.imgUrl = res.data;
        }
      );
    },
    //触摸留痕轨迹
    getHoverTraceTrack(val) {
      if (!this.busiType || !val) return;
      this.srtracetrackRequest.hoverTraceTrackList(
        {
          busiId: val,
          busiType: this.busiType,
          // projectId: this.projectId,
        },
        (res) => {
          console.log(res);
          this.markData = res.data;
          this.markData = res.data.map((item) => {
            if (item.operatorTime) {
              let str = item.operatorTime.split("-").splice(1, 2).join("-");
              item.operatorTime = str;
            }
            return item;
          });
        }
      );
    },
    getAllId(list, id) {
      let label = "";
      const element = list.find((element) => element.dataValue == id);
      if (element) {
        label = element.dataName;
      }
      return label;
    },
    getSize(size) {
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-input__inner {
  width: 90% !important;
}
::v-deep .customClass2 .sr-textarea {
  width: 90% !important;
  .el-textarea {
    width: 100%  !important;
  }
  .el-textarea__inner {
    min-height: 80px !important;
    max-height: 100px;
    width: 100% !important;
  }
}
.track {
  padding: 0 24px;
}
.text {
  padding: 0 40px;
}
.workflow {
  position: relative;
  width: 100%;
  margin-top: 10px;
  padding: 20px;
}

.workflow_formAdd {
  box-shadow: none;
}

::v-deep .el-form-item__label {
  color: rgba(68, 143, 253, 1);
}

.contentBox {
  position: relative;
}

.workflow .SrQiankunWorkFlowPopover {
  height: 400px !important;
  background-color: #ccc;
}

.items {
  width: 100%;
  max-height: 278px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.items::-webkit-scrollbar {
  display: none;
}

.buts {
  padding-top: 10px;
  text-align: center;
}

.workflow .SrQiankunWorkFlowPopover .contentBox .item {
  width: 100%;
}

.el-pagination {
  position: absolute;
  bottom: 0;
  left: 10%;
}

.bzhTableHeader
  .el-dialog__body
  .content_box
  .content_left
  .content_left_lists
  .content_left_list {
  display: flex;
  width: 100%;
  // justify-content: space-between;
  padding-left: 20px;

  .content_left_name {
    width: 100%;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep .el-checkbox {
    width: 100%;
  }
}

.content_right_list {
  .content_right_name {
    display: inline-block;
    width: 200px;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

::v-deep .el-message-box__btns {
  text-align: right;
}

// 为了避免内容太高,设置滚动
.workflow_formAdd_left {
  width: 100%;
  max-height: 200px;
  overflow: auto;
}

// 为了去除原本el-form的最高值184px
::v-deep .workflow_formAdd_left .sradd .el-form {
  max-height: 1000px;
}

// 留痕hover事件滚动条样式
.scroll {
  max-height: 540px;
  overflow-y: scroll;
}

.scroll::-webkit-scrollbar {
  width: 0px;
  height: 9px;
  background-color: #969696;
}

.scroll::-webkit-scrollbar-track {
  background: #e2e2e2;
  border-radius: 2px;
}

.scroll::-webkit-scrollbar-thumb {
  background: #969696;
  border-radius: 8px;
}

.scroll::-webkit-scrollbar-thumb:hover {
  background: #a5a5a5;
}

.scroll::-webkit-scrollbar-corner {
  background: #969696;
}

// 已选择专家样式
.wrapper {
  height: 175px !important;
}

.allowTitle {
  margin-top: 13px;

  span {
    float: right;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999;
    line-height: 20px;
    margin-right: 16px;
  }
}

.content_right_title1 {
  margin-bottom: 5px !important;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  padding: 0 16px 16px;
  line-height: 22px;
}

.tixing {
  text-align: center;
}
</style>
<style>
/* 解决征求意见窗口抖动问题 */
html {
  overflow: hidden;
}
.text {
  padding: 40px 10px 0 40px;
  font-size: 16px;
  font-weight: 700;
}
.start {
  padding-top: 10px;
}
.group {
  padding-top: 0;
}
.el-tag {
  border-radius: 16px;
  margin-right: 10px;
}
.workflow .workflow_buttons {
  border-top: none !important;
}
</style>
