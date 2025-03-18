<template>
  <div v-if="showWorkFlow" class="workflow flow">
    <div class="workflow_formAdd">
      <div v-if="taskName == '评审小组审核'">
        <div class="text group">结项评审</div>
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
      <div v-if="taskName == '完成结项'">
        <div class="text group">结项确认</div>
        <SrAdd
          class="sradd"
          :config="formInter.config"
          :enums="formInter.enums"
          :form="formInter.data"
          :otherConfig="formInter.otherConfig"
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
        v-for="(item, index) in buttonList[0].btns"
      >
        <el-button
          v-if="item.btnEventType == 'fp'"
          v-popover:popover5
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
import srStacetrack from "../components/srStacetrack.vue";
import { api_projectCloseView } from "@/api/projectClose/index.js";
import {getJSONStr, setFile} from "@/utils/workflowList.js"

export default {
  components: { srStacetrack },
  // "rowDatas"
  inject: ["srtracetrackRequest", "workflowRequest"],
  props: {
    todoData: {
      type: Object,
    },
    statusNames: String,
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
    taskName: String,
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
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    id() {
      return this.$route ? this.$route.query.id : "";
    },
    statuss() {
      return this.$route ? this.$route.query.status : "";
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
    processId() {
      return this.$route ? this.$route.query.processId : "";
    },
    projectCloseId() {
      return this.$route ? this.$route.query.projectCloseId : "";
    },
  },
  data() {
    return {
      isFromWorkBench: false,//是否从工作台进入
      trackLoading: true,
      status: "",
      statusName: "",
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
          {
            type: "slot",
            slotName: "inputBox",
            name: "审批意见",
            placeholder: "请输入意见",
            bind: "auditOpinion",
            append: true,
            maxlength: 2000,
            col: 24,
            className: "appointStyle customClass2",
          },
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
      // 集团审议
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
            append: true,
            maxlength: 500,
            col: 24,
            className: "appointStyle customClass2",
            required: "请输入审核意见",
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
        enums: {
          programManagerList: [],
        },
      },
      // 内部立项
      formInter: {
        otherConfig: {
          labelNum: 210,
        },
        config: [
          {
            type: "upload",
            name: "结项申请确认单",
            bind: "approvalList1",
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
            name: "OA审批记录",
            bind: "approvalList2",
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
            name: "项目移交单签字件",
            bind: "approvalList3",
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
            name: "其他附件",
            bind: "otherFileLast",
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
          // 结项申请确认单
          approvalList1: [],
          // OA审批记录
          approvalList2: [],
          // 项目移交单签字件
          approvalList3: [],
          accessoryList: [],
          accessory: [],
          otherFileLast: [],
        },
        enums: {},
      },
      // 评审小组审核
      grouparam: {},

      outparam: {},

      outgroupparam: {},

      saveparam: {},

      // 项目负责人审核参数
      interparam: {},

      interoutparam: {},

      interoutgroupparam: {},

      intersaveparam: {},
    };
  },
  async created() {
    // 基础数据回显

    this.formGroup.data.reviewName = JSON.parse(this.userInfo).fullname;
    this.formInter.data.reviewName = JSON.parse(this.userInfo).fullname;
  },
  mounted() {
    if(this.$route.query.activeName=='待办'||this.$route.query.activeName=='已办'){
      this.isFromWorkBench = true
    }
    this.getSee();
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
        id: this.id,
        newFlag: false,
      };
      const res = await api_projectCloseView(datas);
      if (res.msg.code == "0000") {
        if (this.taskName == "评审小组审核") {
          this.formGroup.data.reviewText = res.data.opinionEntityList
            ? res.data.opinionEntityList[0].opinionInfo
            : "";
        }
        if (this.taskName == "完成结项") {
          console.log(res.data.initialSpectFilesEntityList,'res.data.initialSpectFilesEntityList')
          if (
            res.data.initialSpectFilesEntityList ||
            res.data.initialSpectFilesEntityList.length != 0
          ) {
            if(res.data.initialSpectFilesEntityList[0].confirmAppli) {
              this.formInter.data.approvalList1 = setFile(
                res.data.initialSpectFilesEntityList[0].confirmAppli
              );
            }
            if(res.data.initialSpectFilesEntityList[0].oaRecords) {
              this.formInter.data.approvalList2 = setFile(
                res.data.initialSpectFilesEntityList[0].oaRecords
              );
            }
            if(res.data.initialSpectFilesEntityList[0].signatureForm) {
              this.formInter.data.approvalList3 = setFile(
                res.data.initialSpectFilesEntityList[0].signatureForm
              );
            }
            if (res.data.initialSpectFilesEntityList[0].otherFileLast) {
              this.formInter.data.otherFileLast = setFile(
                res.data.initialSpectFilesEntityList[0].otherFileLast
              );
            }
          }
        }
      }

      if (this.projectCloseId) {
        this.getTraceTrack(this.projectCloseId);
      }
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

    // 征求意见
    // 取消
    handleClose() {
      //   this.selectdata = this.nowSelectData;
      // this.$emit("close");
      this.dialogVisible = false;
    },
    inputclick2(el) {
      this.$nextTick(() => {
        this.inputWidth = +el.target.offsetWidth;
      });
    },
    // inputclick3(el) {
    //   // 去掉光标
    //   document.activeElement.blur();
    //   this.$EventBus.$emit("drawerisshow", true, true);
    // },
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
        name: "projectClose",
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
        processInstanceId: this.processId,
        taskId: this.taskId,
        // status: this.currentStatus,
        btnName: item.btnName,
      };
      if (item.nextBuCode) {
        param.nextBuCode = item.nextBuCode;
      }
      if (item.agencyId) {
        param.agencyId = item.agencyId;
      }
      if (item.agencyNextrole) {
        param.agencyNextrole = item.agencyNextrole;
      }
      if (item.buId) {
        param.buId = item.buId;
      }
      if (item.nextBuCode) {
        param.nextBuCode = item.nextBuCode;
      }
      //消息模板id
      if (item.messageId) {
        param.messageId = item.messageId;
      }
      //代理人
      if (this.buttonList[0].assignee) {
        param.assignee = this.buttonList[0].assignee;
      }
      console.log(param, "paramparamparam");
      return param;
    },

    goback(item) {
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
            `${this.taskName + item.btnName}`,
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
                `${this.taskName + item.btnName}`,
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
    gobackClick(item) {
      this.lastChildItem = item;
      let obj = this.getParam();
      // 集团审议，退回修改，不通过参数相同，重复定义了
      if (this.taskName == "评审小组审核") {
        if (item.btnName == "退回修改") {
          let outParam = {
            auditOpinion: this.formGroup.data.reviewText,
            auditTime: this.formGroup.data.reviewTime,
            auditUserName: this.formGroup.data.reviewName,
          };
          this.outparam = { ...obj, ...outParam };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.outparam,
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
                  (Object.keys(this.outparam) &&
                    Object.keys(this.outparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectClose",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$router.push({
                    name: "projectClose",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "不通过") {
          let outParam = {
            auditOpinion: this.formGroup.data.reviewText,
            auditTime: this.formGroup.data.reviewTime,
            auditUserName: this.formGroup.data.reviewName,
          };
          this.outgroupparam = { ...obj, ...outParam };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.outgroupparam,
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
                  (Object.keys(this.outgroupparam) &&
                    Object.keys(this.outgroupparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectClose",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$router.push({
                    name: "projectClose",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "保存") {
          console.log(1123);
          let groupParam = {
            auditOpinion: this.formGroup.data.reviewText,
            auditTime: this.formGroup.data.reviewTime,
            auditUserName: this.formGroup.data.reviewName,
          };
          this.saveparam = { ...groupParam, ...obj };
          console.log(this.saveparam, "this.saveparamthis.saveparam");
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
                  this.$router.push({ name: "projectClose" });
                  this.$message.success("操作成功");
                } else {
                  this.routeClose();
                  this.$router.push({ name: "projectClose" });
                }
              }
            }
          );
        } else {
          let groupParam = {
            auditOpinion: this.formGroup.data.reviewText,
            auditTime: this.formGroup.data.reviewTime,
            auditUserName: this.formGroup.data.reviewName,
          };
          this.grouparam = { ...obj, ...groupParam };
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
                  this.$router.push({ name: "projectClose" });
                  this.$message.success("操作成功");
                } else {
                  this.routeClose();
                  this.$router.push({ name: "projectClose" });
                }
              }
            }
          );
        }
      }
      // 内部立项
      if (this.taskName == "完成结项") {
        // 结项确认申请单0 approvalList1
        let confirmAppliList = [];
        // /项目移交单签字件2 approvalList3
        let signatureFormList = [];
        // oa审批记录1 approvalList2
        let oaRecordsList = [];
        // 其他附件3 otherFileLast
        let otherFilesList = [];
        if (this.formInter.data.approvalList1) {
          this.formInter.data.approvalList1.forEach((i) => {
            confirmAppliList.push({
              name: i.name,
              id: i.id,
              size: this.getSize(i.size),
              createTime: i.createTime,
              deliveryName: this.formInter.config[0].name,
            });
          });
        }
        if (this.formInter.data.approvalList2) {
          this.formInter.data.approvalList2.forEach((i) => {
            oaRecordsList.push({
              name: i.name,
              id: i.id,
              size: this.getSize(i.size),
              createTime: i.createTime,
              deliveryName: this.formInter.config[1].name,
            });
          });
        }
        if (this.formInter.data.approvalList3) {
          this.formInter.data.approvalList1.forEach((i) => {
            signatureFormList.push({
              name: i.name,
              id: i.id,
              size: this.getSize(i.size),
              createTime: i.createTime,
              deliveryName: this.formInter.config[2].name,
            });
          });
        }
        if (this.formInter.data.otherFileLast && this.formInter.data.otherFileLast.length > 0) {
          this.formInter.data.otherFileLast.forEach((i) => {
            otherFilesList.push({
              name: i.name,
              id: i.id,
              size: this.getSize(i.size),
              createTime: i.createTime,
              deliveryName: this.formInter.config[3].name,
            });
          });
        }
        this.formInter.data.accessory =
          this.formInter.data.accessoryList.length != 0
            ? this.formInter.data.accessoryList.map((item) => {
                return item.id;
              })
            : [];
        // }
        let allParam = {
          signatureForm: JSON.stringify(signatureFormList),
          confirmAppli: JSON.stringify(confirmAppliList),
          oaRecords: JSON.stringify(oaRecordsList),
          otherFileLast: JSON.stringify(otherFilesList),
          accessoryList: this.formInter.data.accessoryList,
          accessory: this.formInter.data.accessory,
        };
        console.log(allParam, "allParamallParamallParam");
        if (item.btnName == "退回修改") {
          this.interoutparam = { ...obj, ...allParam };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.interoutparam,
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
                  (Object.keys(this.interoutparam) &&
                    Object.keys(this.interoutparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectClose",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$router.push({
                    name: "projectClose",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "不通过") {
          this.interoutgroupparam = { ...obj, ...allParam };
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            this.interoutgroupparam,
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
                  (Object.keys(this.interoutgroupparam) &&
                    Object.keys(this.interoutgroupparam).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: "projectClose",
                    // 查看相关逻辑
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$router.push({
                    name: "projectClose",
                    // 查看相关逻辑
                  });
                }
              }
            }
          );
        } else if (item.btnName == "保存") {
          this.intersaveparam = { ...obj, ...allParam };
          console.log(this.intersaveparam, "this.intersaveparam");
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
                  this.$router.push({ name: "projectClose" });
                  this.$message.success("操作成功");
                } else {
                  this.routeClose();
                  this.$router.push({ name: "projectClose" });
                }
              }
            }
          );
        } else {
          this.interparam = { ...obj, ...allParam };
          console.log(this.interparam, "this.interparam");
          // if (item.btnEventType == "tjps") {
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
                  this.$router.push({ name: "projectClose" });
                  this.$message.success("操作成功");
                } else {
                  this.routeClose();
                  this.$router.push({ name: "projectClose" });
                }
              }
            }
          );
          // }
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
::v-deep .forminter .el-input__inner {
  width: 90% !important;
}
::v-deep .el-form {
  margin-top: 20px;
}
.group {
  padding-top: 0;
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
  padding: 0 20px;
  // height: auto;
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
  margin-top: 10px;
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
</style>
