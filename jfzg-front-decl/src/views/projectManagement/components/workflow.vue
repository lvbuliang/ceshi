<template>
  <div v-if="showWorkFlow" class="workflow flow">
    <div class="workflow_formAdd">
      <div v-if="taskName == '集团审议'">
        <div class="text group">集团审议决策</div>
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
      <div v-if="taskName == '内部立项'">
        <div class="text group">公司立项决策</div>
        <SrAdd
          class="sradd"
          :config="formInter.config"
          :enums="formInter.enums"
          :form="formInter.data"
          :otherConfig="formInter.otherConfig"
          ref="add2"
        >
          <template slot="kyxmName">
            <el-input class="kyxmName" v-model="formInter.data.kyxmName" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="500" show-word-limit></el-input>
          </template>
        </SrAdd>
      </div>
    </div>

    <!-- 审批按钮组 -->
    <div class="workflow_buttons">
      <div
        class="workflow_button btn"
        :key="index"
        v-for="(item, index) in buttonList[0].btns"
      >
        <el-button
          v-if="item.btnEventType == 'fp'"
          @click.stop="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >
        <slot :name="item.slotName" :btn="item" v-else-if="item.slotName">
        </slot>
        <!-- 通过不通过 -->
        <el-button
          :disabled="item.disabled"
          v-else
          @click.stop="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >
      </div>
      <div
       
        v-if="backFlag"
        class="gobackList btn"
      >
        <el-button  @click="gobackList(buttonList[0].backName)" plain size="medium" round>返回列表</el-button>
        <el-button  v-if=isFromWorkBench type='success' size="small" @click="backWorkBench">前往工作台</el-button>
      </div>
    </div>

    <!-- 审批留痕 -->
    <srStacetrack
      ref="track"
      class="track"
      :imgUrl="imgUrl"
      :trackData="trackData"
      :trackLoading="trackLoading"
    ></srStacetrack>
  </div>
</template>

<script>
import { getJSONStr, setFile } from "@/utils/workflowList.js";
import srStacetrack from "../components/srStacetrack.vue";
import { getUserByRoleCode } from "@/api/planProject";
import { getSeePorManagment } from "@/api/projectManagement/index.js";
import { setTack } from "../const.js";
export default {
  name: "subTaskWorkFlowView",
  components: { srStacetrack },
  // "rowDatas"
  inject: ["srtracetrackRequest", "workflowRequest"],
  props: {
    taskNames: String,
    // 回显
    viewForm: Object,
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
    buttonList: {
      handler(val) {
        if (val.length) {
          if (val[0].showForm) {
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
    // taskName() {
    //   return this.taskNames ? this.taskNames : "";
    // },
    // projectId() {
    //   return this.$route ? this.$route.query.projectId : "";
    // },
    // processId() {
    //   return this.$route ? this.$route.query.processId : "";
    // },
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
      isFromWorkBench: false,//是否从工作台进入
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
          //   maxlength: 2000,
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
          //   maxlength: 2000,
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
            maxlength: 500,
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
      status: 1,
      // 集团审议
      formGroup: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "select",
            name: "指派方案经理",
            placeholder: "请选择方案经理",
            bind: "programManagername",
            dataList: "programManagerList",
            required: "请选择方案经理",
            maxLength: 20,
            col: 24,
          },
          {
            type: "select",
            name: "指派采购经理",
            placeholder: "请选择采购经理",
            bind: "projectProcurementName",
            dataList: "projectProcurementList",
            required: "请选择方案经理",
            maxLength: 20,
            col: 24,
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "集团决策时间",
            placeholder: "请选择集团决策时间",
            bind: "groupTime",
            required: "请选择集团决策时间",
            format: "yyyy-MM-dd",
            maxLength: 20,
            col: 24,
          },
          {
            type: "upload",
            name: "集团决策纪要",
            bind: "minutesList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          // 立项附件
          {
            type: "upload",
            name: "其他附件",
            bind: "otherFileTwo",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          programManager: "",
          programManagername: "",
          projectProcurementJfid: "",
          projectProcurementName: "",
          groupTime: "",
          minutesList: [],
          // 立项附件
          otherFileTwo: [],
        },
        enums: {
          programManagerList: [],
          projectProcurementList: [],
        },
      },
      // 内部立项
      formInter: {
        otherConfig: {
          labelNum: 210,
        },
        config: [
          {
            type: "slot",
            slotName: "kyxmName",
            name: "科研项目名称",
            placeholder: "请填写科研项目名称",
            bind: "kyxmName",
            data: "yearList",
            required: "请填写科研项目名称",
            // maxLength: 20,
            col: 24,
            className: "formInterLabel",
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "公司决策召开日期",
            placeholder: "请选择公司决策召开日期",
            bind: "groupTime",
            required: "请选择公司决策召开日期",
            format: "yyyy-MM-dd",
            maxLength: 20,
            col: 24,
            className: "formInterLabel",
          },
          {
            type: "upload",
            name: "立项上会材料",
            bind: "approvalList4",
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
            name: "公司决策会议纪要",
            bind: "approvalList3",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType: "doc,docx,pdf,jpg,jpeg,jpe,png,",
            fileTip: "仅支持上传pdf,word,图片格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "科研项目立项申请书",
            bind: "approvalList1",
            // required: "请上传附件",
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
            name: "科研项目可行性研究报告",
            bind: "approvalList2",
            // required: "请上传附件",
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
          // 立项附件
          {
            type: "upload",
            name: "其他附件",
            bind: "otherFileThree",
            // required: "请上传附件",
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
        ],
        data: {
          // 科研项目名称
          kyxmName: "",
          // 公司决策召开日期
          groupTime: "",
          // 科研项目立项申请书
          approvalList1: [],
          // 科研项目可行性研究报告
          approvalList2: [],
          // 公司决策会议纪要
          approvalList3: [],
          // 立项上会材料
          approvalList4: [],
          // 立项附件
          otherFileThree: [],
        },
        enums: {},
      },
      grouparam: {},
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
    };
  },
  created() {
    // 基础数据回显
    this.getSee();
    // 获取方案经理数据
    this.getUserByRoleCode();
  },
  mounted() {
    if(this.$route.query.activeName=='待办'||this.$route.query.activeName=='已办'){
      this.isFromWorkBench = true
    }
    this.taskName = this.taskNames;
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
        if (this.taskName == "集团审议") {
          if (res.data.length != 0) {
            // 回显数据
            this.formGroup.data.programManagername = res.data.projectFajlName;
            this.formGroup.data.programManager = res.data.projectFajlJfid;
            this.formGroup.data.projectProcurementName =
              res.data.projectProcurementName;
            this.formGroup.data.projectProcurementJfid =
              res.data.projectProcurementJfid;
            this.formGroup.data.groupTime = res.data.jtjcDate;
            if (res.data.jtjcJy) {
              this.formGroup.data.minutesList = setFile(res.data.jtjcJy);
            }
            if (res.data.otherFileTwo) {
              this.formGroup.data.otherFileTwo = setFile(res.data.otherFileTwo);
            }
            // 立项附件
          }
        } else if (this.taskName == "内部立项") {
          if (res.data.length != 0) {
            this.formInter.data.kyxmName = res.data.kyxmName;
            this.formInter.data.groupTime = res.data.companyDecideTime;
            if (res.data.kyxmApplication) {
              this.formInter.data.approvalList1 = setFile(
                res.data.kyxmApplication
              );
            }
            if (res.data.kyxmReport) {
              this.formInter.data.approvalList2 = setFile(res.data.kyxmReport);
            }
            if (res.data.comPanyDecide) {
              this.formInter.data.approvalList3 = setFile(
                res.data.comPanyDecide
              );
            }
            if (res.data.projectApprove) {
              this.formInter.data.approvalList4 = setFile(
                res.data.projectApprove
              );
            }
            // 立项附件
            if (res.data.otherFileThree) {
              this.formInter.data.otherFileThree = setFile(
                res.data.otherFileThree
              );
            }
          }
        }
        // 留痕
        if (res.data.projectIntiaonId) {
          this.getTraceTrack(res.data.projectIntiaonId);
        }
      }
    },
    async getUserByRoleCode() {
      await getUserByRoleCode({ roleCode: "FAJL" }).then((res) => {
        res.data.map((element) => {
          this.formGroup.enums.programManagerList.push({
            dataName: String(element.fullname),
            dataValue: String(element.jfid),
          });
        });
      });
      await getUserByRoleCode({ roleCode: "CGJL" }).then((res) => {
        res.data.map((element) => {
          this.formGroup.enums.projectProcurementList.push({
            dataName: String(element.fullname),
            dataValue: String(element.jfid),
          });
        });
      });
    },
    arrFilter(arr, val, key) {
      return arr.filter((item) => item[key] != val);
    },
    gobackList() {
      this.$router.push({
        name: "projectManagement",
      });
    },

    routeClose(timeout, routepath) {
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
      var currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds;

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
    goback(item) {
      let now = !this.timer;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.deTime || 1000);

      if (now) {
        let flag = true;
        // 需要校验的按钮功能保存在数组中
        let validateList = ["bh", "gjzjyjzg"];
        if (validateList.includes(item.btnEventType)) {
          // 意见和附件得提交一个
          let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

          // 判断意见和附件
          if (
            !this.form.data.auditOpinion &&
            this.form.data.accessoryList.length == 0
          ) {
            if (
              this.currentStatus == 6 ||
              this.currentStatus == 13 ||
              this.currentStatus == 8 ||
              this.currentStatus == 10 ||
              this.currentStatus == 12
              // ||
              // this.currentStatus == 1001
            ) {
              this.$message.warning(
                `${this.form.config[3].name}和${this.form.config[4].name}需选填一个!`
              );
              flag = false;
            } else {
              if (
                this.currentStatus == 11 &&
                !this.form.data.overallOpinion &&
                this.form.data.reexamineConclusion.length == 0
              ) {
                this.$message.warning(
                  `${this.form.config[0].name}和${this.form.config[1].name}需选填一个!`
                );
                flag = false;
              } else if (item.btnName == "退回修改") {
                // flag = true;
              }
            }
          } else if (
            item.btnEventType == "bh" &&
            item.btnName == "根据专家意见整改"
          ) {
            if (
              (this.currentStatus == 8 ||
                this.currentStatus == 10 ||
                this.currentStatus == 12) &&
              userInfo.currentBizunit.buProperty == 1 &&
              this.noSubmitFlag
            ) {
              this.$message.warning("专家出具意见中，请稍后审批!");
              flag = false;
            }
          }
        } else if (
          item.btnEventType == "zjtj" &&
          item.btnName != "批复通过" &&
          item.btnName != "提交"
        ) {
          // 意见和附件得提交一个
          if (
            !this.form.data.auditOpinion &&
            this.form.data.accessoryList.length == 0
          ) {
            this.$message.warning(
              `${this.form.config[0].name}和${this.form.config[1].name}需选填一个!`
            );
            flag = false;
          }
        } else if (this.currentStatus == 5 || this.currentStatus == 3) {
          // 处理分组初审时的退回修改与结束
          if (item.btnName == "结束" || item.btnName == "退回修改") {
            if (
              !this.form.data.auditOpinion &&
              this.form.data.accessoryList.length == 0
            ) {
              this.$message.warning(
                `请填写${this.form.config[0].name}和${this.form.config[1].name}!`
              );
              flag = false;
            }
          }
        }
        if (flag) {
          if (
            this.$route.query.flag != 0 &&
            item.btnName != "发起专家函评" &&
            item.btnName != "已专家函评" &&
            item.btnName != "出具初审意见" &&
            item.btnName != "出具意见" &&
            item.btnName != "组织专家评审" &&
            item.btnName != "已组织评审" &&
            item.btnName != "分配" &&
            item.btnName != "征求意见" &&
            item.btnName != "查看初审意见及结论"
          ) {
            this.$confirm(
              // 原代码
              `${
                item.btnName == "退回修改"
                  ? "退回修改后重新编辑后提交。"
                  : item.btnName == "批复通过" || item.btnName == "项目入库"
                  ? "确认操作后，所申报项目审批流流转至项目入库，不可撤回。"
                  : item.btnName == "结束" || item.btnName == "项目不予入库"
                  ? "确认结束后该项目流程结束，不入库，不可撤回。"
                  : item.btnName == "不通过"
                  ? "不通过后项目驳回,重新编辑后提交。"
                  : item.btnName == "根据专家意见整改"
                  ? "要求根据专家有意见整改后，申报单位可重新编辑后提交。"
                  : item.btnName == "提交"
                  ? "提交后，不可修改文件。"
                  : item.btnName == "批复不通过"
                  ? "确认批复不通过后该项目申报流程结束"
                  : item.btnName == "撤回"
                  ? "撤回后可支持修改后重新提交。"
                  : item.btnName == "重新整改"
                  ? "确认后申报单位会收到评审意见。"
                  : item.btnName == "纳入联合会审" ||
                    item.btnName == "进入专家评审"
                  ? `确认${item.btnName}，会进入下一节点。`
                  : item.btnName == "保存"
                  ? "确认保存？"
                  : ""
              }`,
              `确认${this.taskName}${item.btnName}`,
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                // center: true,
              }
            )
              .then(() => {
                this.gobackClick(item);
                // this.$message({
                //   type: "success",
                //   message: "操作成功!",
                // });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          } else if (
            item.btnName == "发起专家函评" ||
            item.btnName == "已专家函评" ||
            item.btnName == "分配" ||
            item.btnName == "征求意见"
          ) {
            //console.log("这里2");
            this.gobackClick(item);
          } else if (
            item.btnName == "出具初审意见" ||
            item.btnName == "出具意见" ||
            item.btnName == "查看初审意见及结论"
          ) {
            this.gobackClick(item);
          } else if (
            item.btnName == "组织专家评审" ||
            item.btnName == "已组织评审"
          ) {
            this.gobackClick(item);
          } else {
            //console.log("这里3");
            this.gobackClick(item);
            this.$message.success("操作成功");
          }
        }
      }
    },
    gobackClick(item) {
      this.lastChildItem = item;
      if (this.clickMethods && this.clickMethods[item.btnEventType]) {
        //console.log("执行这");
        this.clickMethods[item.btnEventType]();
      } else {
        //console.log("还是这", item);
        let param = {};
        let obj = this.getParam();
        param = { ...param, ...obj };

        param.appendix = JSON.stringify(param.accessoryList); //附件
        //console.log("111");
        // debugger;
        param.buName = JSON.parse(this.userInfo).currentBizunit.buName; //部门名称
        param.buUniqueCode = JSON.parse(
          this.userInfo
        ).currentBizunit.buUniqueCode; //部门唯一编码

        param.buid = JSON.parse(this.userInfo).currentBizunit.buid; //部门id
        param.flag = 0; //通过
        param.fullname = JSON.parse(this.userInfo).fullname; //账号名称
        param.jfid = JSON.parse(this.userInfo).jfid; //账号id

        param.roleCode = JSON.parse(this.userInfo).currentRole.roleCode; //角色信息
        param.roleName = JSON.parse(this.userInfo).currentRole.roleName; //角色roleName
        let description = JSON.parse(this.todoData.description)[0];

        param.agencyNextrole = description.agencyNextrole
          ? description.agencyNextrole
          : "";

        param.assignee = description.assignee ? description.assignee : "";
        param.nextBuCode = description.nextBuCode ? description.nextBuCode : "";
        param.beAssigner = "";
        param.beAssignerName = "";
        param.beAssignerRole = "";
        param.messageId = "";
        param.processInstanceId = this.processId;
        param.processId = this.processId;
        param.projectId = this.projeciId;
        param.updateTime = this.getNowTime();
        param.uploadPerson = JSON.parse(this.userInfo).jfid;
        param.auditTime = "";
        param.auditUserName = "";

        //console.log("1232323qwewewe");
        // 集团审议，退回修改，不通过参数相同，重复定义了
        if (this.taskName == "集团审议") {
          if (item.btnName == "退回修改") {
            this.formGroup.enums.programManagerList.forEach((item) => {
              if (this.formGroup.data.programManagername == item.dataValue) {
                this.formGroup.data.programManager = item.dataValue;
                this.formGroup.data.programManagername = item.dataName;
              }
              this.formGroup.enums.projectProcurementList.forEach((item) => {
                if (
                  this.formGroup.data.projectProcurementName == item.dataValue
                ) {
                  this.formGroup.data.projectProcurementJfid = item.dataValue;
                  this.formGroup.data.projectProcurementName = item.dataName;
                }
              });
            });
            let minutesLists = getJSONStr(
              this.formGroup.data.minutesList,
              this.formGroup.config[3].name
            );
            let otherFileTwoList = getJSONStr(
              this.formGroup.data.otherFileTwo,
              this.formGroup.config[4].name
            );
            let outParam = {
              // 集团决策时间
              jtjcDate: this.formGroup.data.groupTime
                ? this.formGroup.data.groupTime
                : "",
              // 集团决策纪要
              jtjcJy: minutesLists,
              // 指派方案经理
              projectFajlJfid: this.formGroup.data.programManager
                ? this.formGroup.data.programManager
                : "",
              projectFajlName: this.formGroup.data.programManagername
                ? this.formGroup.data.programManagername
                : "",
              projectProcurementJfid: this.formGroup.data.projectProcurementJfid
                ? this.formGroup.data.projectProcurementJfid
                : "",
              projectProcurementName: this.formGroup.data.projectProcurementName
                ? this.formGroup.data.projectProcurementName
                : "",
              // 立项附件
              otherFileTwo: otherFileTwoList,
            };
            this.outparam = { ...param, ...outParam };
            //console.log("this.outparam", this.outparam);
            this.workflowRequest.setApiAfferentUrlOfPost(
              item.btnUrl,
              this.outparam,
              (res) => {
                // 不通过按钮
                //console.log(res);
                if (res) {
                  if (this.callbackFn) {
                    // 缓存方案中，走回调方法
                    this.callbackFn();
                    //console.log("11111", "4");
                    return;
                  }
                  if (
                    this.routerQuery ||
                    (Object.keys(this.outparam) &&
                      Object.keys(this.outparam).length > 0)
                  ) {
                    this.routeClose();
                    this.$message.success("操作成功");
                    //console.log("11111", "5");

                    this.$router.push({
                      name: "projectManagement",
                      // 查看相关逻辑
                    });
                  } else {
                    this.routeClose();
                    //console.log("11111", "6");
                    this.$router.push({
                      name: "projectManagement",
                      // 查看相关逻辑
                    });
                  }
                }
              }
            );
          } else if (item.btnName == "不通过") {
            this.formGroup.enums.programManagerList.forEach((item) => {
              if (this.formGroup.data.programManagername == item.dataValue) {
                this.formGroup.data.programManager = item.dataValue;
                this.formGroup.data.programManagername = item.dataName;
              }
              this.formGroup.enums.projectProcurementList.forEach((item) => {
                if (
                  this.formGroup.data.projectProcurementName == item.dataValue
                ) {
                  this.formGroup.data.projectProcurementJfid = item.dataValue;
                  this.formGroup.data.projectProcurementName = item.dataName;
                }
              });
            });

            let minutesLists = getJSONStr(
              this.formGroup.data.minutesList,
              this.formGroup.config[3].name
            );

            let otherFileTwoList = getJSONStr(
              this.formGroup.data.otherFileTwo,
              this.formGroup.config[4].name
            );

            let outParam = {
              // 集团决策时间
              jtjcDate: this.formGroup.data.groupTime
                ? this.formGroup.data.groupTime
                : "",
              // // 集团决策纪要
              jtjcJy: minutesLists,
              // // 指派方案经理
              projectFajlJfid: this.formGroup.data.programManager
                ? this.formGroup.data.programManager
                : "",
              projectFajlName: this.formGroup.data.programManagername
                ? this.formGroup.data.programManagername
                : "",
              projectProcurementJfid: this.formGroup.data.projectProcurementJfid
                ? this.formGroup.data.projectProcurementJfid
                : "",
              projectProcurementName: this.formGroup.data.projectProcurementName
                ? this.formGroup.data.projectProcurementName
                : "",
              // // 立项附件
              otherFileTwo: otherFileTwoList,
            };
            this.outgroupparam = { ...param, ...outParam };
            console.log(
              this.outgroupparam,
              "this.outgroupparam222222222222222222"
            );
            this.workflowRequest.setApiAfferentUrlOfPost(
              item.btnUrl,
              this.outgroupparam,
              (res) => {
                // 不通过按钮
                //console.log(res);
                if (res) {
                  if (this.callbackFn) {
                    // 缓存方案中，走回调方法
                    this.callbackFn();
                    //console.log("11111", "4");
                    return;
                  }
                  if (
                    this.routerQuery ||
                    (Object.keys(this.outgroupparam) &&
                      Object.keys(this.outgroupparam).length > 0)
                  ) {
                    this.routeClose();
                    this.$message.success("操作成功");
                    //console.log("11111", "5");

                    this.$router.push({
                      name: "projectManagement",
                      // 查看相关逻辑
                    });
                  } else {
                    this.routeClose();
                    //console.log("11111", "6");
                    this.$router.push({
                      name: "projectManagement",
                      // 查看相关逻辑
                    });
                  }
                }
              }
            );
          } else if (item.btnName == "保存") {
            this.$refs["add1"].validate((val) => {
              if (val) {
                this.formGroup.enums.programManagerList.forEach((item) => {
                  if (
                    this.formGroup.data.programManagername == item.dataValue
                  ) {
                    this.formGroup.data.programManager = item.dataValue;
                    this.formGroup.data.programManagername = item.dataName;
                  }
                });
                this.formGroup.enums.projectProcurementList.forEach((item) => {
                  if (
                    this.formGroup.data.projectProcurementName == item.dataValue
                  ) {
                    this.formGroup.data.projectProcurementJfid = item.dataValue;
                    this.formGroup.data.projectProcurementName = item.dataName;
                  }
                });
                let minutesLists = getJSONStr(
                  this.formGroup.data.minutesList,
                  this.formGroup.config[3].name
                );
                let otherFileTwoList = getJSONStr(
                  this.formGroup.data.otherFileTwo,
                  this.formGroup.config[4].name
                );
                let groupParam = {
                  jtjcDate: this.formGroup.data.groupTime,
                  jtjcJy: minutesLists,
                  projectFajlJfid: this.formGroup.data.programManager,
                  projectFajlName: this.formGroup.data.programManagername,
                  projectProcurementJfid:
                    this.formGroup.data.projectProcurementJfid,
                  projectProcurementName:
                    this.formGroup.data.projectProcurementName,
                  auditOa: "",
                  auditOaName: "",
                  createRole: JSON.parse(this.userInfo).jfid,
                  createBuid: "",
                  // createBuid: this.rowDatas.createBuid
                  //   ? this.rowDatas.createBuid
                  //   : "",
                  fileContextPeroject: "",
                  fileName: "",
                  fileReport: "",
                  fileReportName: "",
                  firstAuditTime: "",
                  needDeliveryTime: "",
                  processId: this.processId,
                  projectAudit: "",
                  projectId: this.projeciId,
                  updateTime: this.getNowTime(),
                  uploadPerson: JSON.parse(this.userInfo).jfid,
                  // 立项附件
                  otherFileTwo: otherFileTwoList,
                };
                this.saveparam = { ...groupParam };
                //console.log(this.saveparam, "this.saveparamthis.saveparam");
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
                        (Object.keys(this.saveparam) &&
                          Object.keys(this.saveparam).length > 0)
                      ) {
                        this.routeClose();
                        this.$router.push({ name: "projectManagement" });
                      } else {
                        this.routeClose();
                        this.$router.push({ name: "projectManagement" });
                      }
                    }
                  }
                );
              }
            });
          } else {
            this.$refs["add1"].validate((val) => {
              if (val) {
                this.formGroup.enums.programManagerList.forEach((item) => {
                  if (
                    this.formGroup.data.programManagername == item.dataValue
                  ) {
                    this.formGroup.data.programManager = item.dataValue;
                    this.formGroup.data.programManagername = item.dataName;
                  }
                });
                this.formGroup.enums.projectProcurementList.forEach((item) => {
                  if (
                    this.formGroup.data.projectProcurementName == item.dataValue
                  ) {
                    this.formGroup.data.projectProcurementJfid = item.dataValue;
                    this.formGroup.data.projectProcurementName = item.dataName;
                  }
                });
                let minutesLists = getJSONStr(
                  this.formGroup.data.minutesList,
                  this.formGroup.config[3].name
                );
                let otherFileTwoList = getJSONStr(
                  this.formGroup.data.otherFileTwo,
                  this.formGroup.config[4].name
                );
                let groupParam = {
                  jtjcDate: this.formGroup.data.groupTime,
                  jtjcJy: minutesLists,
                  projectFajlJfid: this.formGroup.data.programManager,
                  projectFajlName: this.formGroup.data.programManagername,
                  projectProcurementJfid:
                    this.formGroup.data.projectProcurementJfid,
                  projectProcurementName:
                    this.formGroup.data.projectProcurementName,
                  // 立项附件
                  otherFileTwo: otherFileTwoList,
                };
                let accessoryList = [];
                this.grouparam = { ...param, ...groupParam };
                this.grouparam.accessoryList = accessoryList;
                if (item.btnEventType == "tjps") {
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
                          this.$router.push({ name: "projectManagement" });
                        } else {
                          this.routeClose();
                          this.$router.push({ name: "projectManagement" });
                        }
                      }
                    }
                  );
                }
              }
            });
          }
        }

        // 内部立项
        if (this.taskName == "内部立项") {
          if (item.btnName == "退回修改") {
            let projectApproveList = getJSONStr(
              this.formInter.data.approvalList4,
              this.formInter.config[2].name
            );
            let comPanyDecideList = getJSONStr(
              this.formInter.data.approvalList3,
              this.formInter.config[3].name
            );
            let kyxmApplicationList = getJSONStr(
              this.formInter.data.approvalList1,
              this.formInter.config[4].name
            );
            let kyxmReportList = getJSONStr(
              this.formInter.data.approvalList2,
              this.formInter.config[5].name
            );
            let otherFileThreeList = getJSONStr(
              this.formInter.data.otherFileThree,
              this.formInter.config[6].name
            );
            let outParam = {
              createRole: JSON.parse(this.userInfo).jfid,
              // 公司决策会议纪要
              comPanyDecide: comPanyDecideList,

              // 公司决策召开日期
              companyDecideTime: this.formInter.data.groupTime
                ? this.formInter.data.groupTime
                : "",

              // 科研项目名称
              kyxmName: this.formInter.data.kyxmName
                ? this.formInter.data.kyxmName
                : "",

              // 立项上会材料
              projectApprove: projectApproveList,

              // 科研项目立项申请书
              kyxmApplication: kyxmApplicationList,
              // 科研项目可行性研究报告
              kyxmReport: kyxmReportList,
              // 立项附件
              otherFileThree: otherFileThreeList,
            };
            this.interoutparam = { ...param, ...outParam };
            console.log(this.interoutparam, "this.interoutparam");
            this.workflowRequest.setApiAfferentUrlOfPost(
              item.btnUrl,
              this.interoutparam,
              (res) => {
                // 不通过按钮
                //console.log(res);
                if (res) {
                  if (this.callbackFn) {
                    // 缓存方案中，走回调方法
                    this.callbackFn();
                    //console.log("11111", "4");
                    return;
                  }
                  if (
                    this.routerQuery ||
                    (Object.keys(this.interoutparam) &&
                      Object.keys(this.interoutparam).length > 0)
                  ) {
                    this.routeClose();
                    this.$message.success("操作成功");
                    //console.log("11111", "5");

                    this.$router.push({
                      name: "projectManagement",
                      // 查看相关逻辑
                    });
                  } else {
                    this.routeClose();
                    //console.log("11111", "6");
                    this.$router.push({
                      name: "projectManagement",
                      // 查看相关逻辑
                    });
                  }
                }
              }
            );
          } else if (item.btnName == "不通过") {
            let projectApproveList = getJSONStr(
              this.formInter.data.approvalList4,
              this.formInter.config[2].name
            );
            let comPanyDecideList = getJSONStr(
              this.formInter.data.approvalList3,
              this.formInter.config[3].name
            );
            let kyxmApplicationList = getJSONStr(
              this.formInter.data.approvalList1,
              this.formInter.config[4].name
            );
            let kyxmReportList = getJSONStr(
              this.formInter.data.approvalList2,
              this.formInter.config[5].name
            );
            let otherFileThreeList = getJSONStr(
              this.formInter.data.otherFileThree,
              this.formInter.config[6].name
            );
            let outParam = {
              createRole: JSON.parse(this.userInfo).jfid,
              comPanyDecide: comPanyDecideList,
              companyDecideTime: this.formInter.data.groupTime
                ? this.formInter.data.groupTime
                : "",

              kyxmName: this.formInter.data.kyxmName
                ? this.formInter.data.kyxmName
                : "",

              projectApprove: projectApproveList,

              kyxmApplication: kyxmApplicationList,

              kyxmReport: kyxmReportList,
              // 立项附件
              otherFileThree: otherFileThreeList,
            };
            this.interoutgroupparam = { ...param, ...outParam };
            this.workflowRequest.setApiAfferentUrlOfPost(
              item.btnUrl,
              this.interoutgroupparam,
              (res) => {
                // 不通过按钮
                //console.log(res);
                if (res) {
                  if (this.callbackFn) {
                    // 缓存方案中，走回调方法
                    this.callbackFn();
                    //console.log("11111", "4");
                    return;
                  }
                  if (
                    this.routerQuery ||
                    (Object.keys(this.interoutgroupparam) &&
                      Object.keys(this.interoutgroupparam).length > 0)
                  ) {
                    this.routeClose();
                    this.$message.success("操作成功");
                    //console.log("11111", "5");

                    this.$router.push({
                      name: "projectManagement",
                      // 查看相关逻辑
                    });
                  } else {
                    this.routeClose();
                    //console.log("11111", "6");
                    this.$router.push({
                      name: "projectManagement",
                      // 查看相关逻辑
                    });
                  }
                }
              }
            );
          } else if (item.btnName == "保存") {
            this.$refs["add2"].validate((val) => {
              if (val) {
                let projectApproveList = getJSONStr(
                  this.formInter.data.approvalList4,
                  this.formInter.config[2].name
                );
                let comPanyDecideList = getJSONStr(
                  this.formInter.data.approvalList3,
                  this.formInter.config[3].name
                );
                let kyxmApplicationList = getJSONStr(
                  this.formInter.data.approvalList1,
                  this.formInter.config[4].name
                );
                let kyxmReportList = getJSONStr(
                  this.formInter.data.approvalList2,
                  this.formInter.config[5].name
                );
                let otherFileThreeList = getJSONStr(
                  this.formInter.data.otherFileThree,
                  this.formInter.config[6].name
                );

                let groupParam = {
                  createRole: JSON.parse(this.userInfo).jfid,
                  comPanyDecide: comPanyDecideList,
                  companyDecideTime: this.formInter.data.groupTime
                    ? this.formInter.data.groupTime
                    : "",
                  fileName: "",

                  projectApprove: projectApproveList,
                  kyxmName: this.formInter.data.kyxmName,

                  kyxmApplication: kyxmApplicationList,
                  kyxmReport: kyxmReportList,
                  // 立项附件
                  otherFileThree: otherFileThreeList,
                };
                this.intersaveparam = { ...param, ...groupParam };
                this.workflowRequest.setApiAfferentUrlOfPost(
                  item.btnUrl,
                  this.intersaveparam,
                  (res) => {
                    if (res) {
                      if (this.callbackFn) {
                        // 缓存方案中，走回调方法
                        this.callbackFn();
                        return;
                      }
                      if (
                        this.routerQuery ||
                        (Object.keys(this.intersaveparam) &&
                          Object.keys(this.intersaveparam).length > 0)
                      ) {
                        this.routeClose();
                        this.$router.push({ name: "projectManagement" });
                      } else {
                        this.routeClose();
                        this.$router.push({ name: "projectManagement" });
                      }
                    }
                  }
                );
              }
            });
          } else {
            this.$refs["add2"].validate((val) => {
              if (val) {
                let projectApproveList = getJSONStr(
                  this.formInter.data.approvalList4,
                  this.formInter.config[2].name
                );
                let comPanyDecideList = getJSONStr(
                  this.formInter.data.approvalList3,
                  this.formInter.config[3].name
                );
                let kyxmApplicationList = getJSONStr(
                  this.formInter.data.approvalList1,
                  this.formInter.config[4].name
                );
                let kyxmReportList = getJSONStr(
                  this.formInter.data.approvalList2,
                  this.formInter.config[5].name
                );
                let otherFileThreeList = getJSONStr(
                  this.formInter.data.otherFileThree,
                  this.formInter.config[6].name
                );

                let groupParam = {
                  createRole: JSON.parse(this.userInfo).jfid,
                  comPanyDecide: comPanyDecideList,

                  companyDecideTime: this.formInter.data.groupTime,

                  kyxmName: this.formInter.data.kyxmName,

                  projectApprove: projectApproveList,

                  kyxmApplication: kyxmApplicationList,

                  kyxmReport: kyxmReportList,
                  // 立项附件
                  otherFileThree: otherFileThreeList,
                };
                this.interparam = { ...param, ...groupParam };
                if (item.btnEventType == "tjps") {
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
                          this.$router.push({ name: "projectManagement" });
                        } else {
                          this.routeClose();
                          this.$router.push({ name: "projectManagement" });
                        }
                      }
                    }
                  );
                }
              }
            });
          }
        }
      }
    },

    //留痕轨迹
    getTraceTrack(val) {
      if (!this.busiType || !val) {
        this.trackLoading = false;
      } else {
        this.trackLoading = true;
        this.srtracetrackRequest.getTraceTrackList(
          { busiId: val, busiType: this.busiType },
          (res) => {
            this.trackData = res.data;
            this.trackLoading = false;
            setTack(this.trackData);
          }
        );
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
          //console.log(res);
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
      if (typeof size == "string") {
        return size;
      } else {
        let size1 = (size / 1024 / 1024).toFixed(2) + "mb";
        return size1;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .kyxmName.el-textarea {
  width: 90% !important;
}
::v-deep .formInterLabel .el-input {
  width: 90% !important;
}
::v-deep .formInterLabel .el-input__inner {
  width: 100% !important;
}
.track {
  padding: 0 24px;
}
.text {
  padding: 20px 40px;
  padding-top: 0;
}
.workflow {
  position: relative;
  width: 100%;
  margin-top: 10px;
  padding: 20px;
  padding-top: 0;
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

// ::v-deep .el-icon-search {
//   top: -7px;
// }
// ::v-deep .search .el-input__suffix-inner .el-input__icon .el-icon-search {
//   top: -1px !important;
//   color: black;
// }

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
.workflow .workflow_buttons {
  border-top: none !important;
}
</style>
<style>
/* 解决征求意见窗口抖动问题 */
html {
  overflow: hidden;
}
.text {
  padding: 0 10px 0 40px;
  font-size: 16px;
  font-weight: 700;
}
.start {
  padding-top: 10px;
}
.group {
  padding-top: 0;
}
</style>
