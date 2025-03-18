<template>
  <div v-if="showWorkFlow" class="workflow flow">
    <div v-if="buttonList[0].showForm" class="workflow_formAdd">
      <!-- 第二步第四步 审批 -->
      <div
        class="workflow_formAdd_left"
        v-if="[2, 304, 305].includes(currentStatus)"
      >
        <SrAdd
          v-if="buttonList[0].showForm"
          :config="form.config"
          :otherConfig="{ labelNum: 160 }"
          :form="form.data"
          :enums="form.enums"
          ref="add"
          class="add"
        >
        </SrAdd>
      </div>
      <!-- 第三步 项目负责人审核 -->
      <div
        class="workflow_formAdd_left"
        v-if="[204, 301].includes(currentStatus)"
      >
        <SrAdd
          v-if="buttonList[0].showForm"
          :config="form2.config"
          :otherConfig="{ labelNum: 160 }"
          :form="form2.data"
          :enums="form2.enums"
          ref="add"
          class="add"
        >
          <div slot="group" class="group">
            <el-tag
              v-for="(item, index) in form2.data.fixedGroupMembers"
              :key="index"
              >{{ item.fullName }}</el-tag
            >
          </div>
        </SrAdd>
      </div>
      <!-- 通过初验 -->
      <div
        class="workflow_formAdd_left"
        v-if="[308, 309].includes(currentStatus)"
      >
        <SrAdd
          v-if="buttonList[0].showForm"
          :config="lastStepForm.config"
          :otherConfig="{ labelNum: 200 }"
          :form="lastStepForm.data"
          :enums="lastStepForm.enums"
          ref="add"
          class="add"
        >
          <template slot="cyrq">
            <div style="width: 33%">
              <el-date-picker
                v-model="lastStepForm.data.preliminaryDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择初验日期"
              />
            </div>
          </template>
        </SrAdd>
      </div>
      <el-popover
        placement="top"
        trigger="hover"
        width="320"
        v-model="visible"
        popper-class="workflow_popover"
        :offset="24"
      >
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item
            v-for="(item, index) in markData"
            :key="index"
            :name="index"
          >
            <template slot="title">
              <div class="el-collapse-item-list-box">
                <span class="markContentTime">{{ item.operatorTime }}</span>
                <sr-popover :content="item.operator">
                  <span class="markContentName">
                    <span>{{ item.operator }}</span>
                  </span>
                </sr-popover>

                <span
                  class="markContentOpinion"
                  :class="
                    item.color == 'FAIL'
                      ? 'fail'
                      : item.color == 'SUCCESS'
                      ? 'success'
                      : 'normal'
                  "
                  >{{ item.approvalResult }}</span
                >
              </div>
            </template>
          </el-collapse-item>
        </el-collapse>
        <div slot="reference" v-if="!hideTrackIcon" class="markBtton">
          <sr-trace-track :imgUrl="this.imgUrl" :trackData="trackData">
            <div class="markBttonIcon_box">
              <img
                src="./xuanting.png"
                width="40%"
                height="auto"
                class="markBttonIcon"
                alt
              />
            </div>
          </sr-trace-track>
        </div>
      </el-popover>
    </div>
    <div class="workflow_buttons">
      <div class="automaticSave" v-if="typeof loading === 'boolean'">
        <div v-if="loading">
          <i
            class="el-icon-circle-check"
            style="margin-left: 4px; margin-right: 4px; color: #000000"
          ></i>
          {{ getToTime }}自动保存成功
        </div>
        <div v-else><i class="el-icon-loading"></i>自动保存中</div>
      </div>

      <div
        class="workflow_button btn"
        :key="index"
        v-for="(item, index) in buttonList[0].btns"
      >
        <el-popover
          class="SrQiankunWorkFlowPopover"
          ref="popover5"
          placement="top"
          width="304"
          v-model="lastChildIndex"
          :append-to-body="false"
          v-if="item.btnEventType == 'fp'"
        >
          <el-input
            class="search"
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="searchIndex"
            @change="searchChange"
          ></el-input>
          <div class="contentBox">
            <div
              class="item"
              @click="setActiveItem(item)"
              v-for="item in itemList"
              :key="item.jfid"
            >
              {{ item.fullname }}
            </div>
          </div>
          <div
            class="maskLayerBox"
            @click="maskLayerClose"
            v-if="activeItemIndex"
          >
            <div class="content" @click.stop="maskLayerContent">
              <div class="top">
                <i class="base-iconfont icon-prompt-fill"></i>
                <span>
                  分配：
                  <span class="text">{{ activeItem.fullname }}</span>
                </span>
              </div>
              <div class="down">
                <div>姓名：{{ activeItem.fullname }}</div>
                <div>角色：{{ activeItem.roleName }}</div>
                <div>部门：{{ activeItem.buName }}</div>
              </div>
              <div class="buts">
                <el-button
                  v-debounce="[() => fpSumbit(), deTime || 1000]"
                  size="small"
                  round
                  type="primary"
                  >确定</el-button
                >
                <el-button @click.stop="maskLayerClose()" size="small" round
                  >取消</el-button
                >
              </div>
            </div>
          </div>
        </el-popover>
        <el-button
          v-if="item.btnEventType == 'fp'"
          v-popover:popover5
          @click.stop="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >
        <slot :name="item.slotName" :btn="item" v-else-if="item.slotName">
        </slot>
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
        <!-- //初验 -->
        <el-button  v-if=isFromWorkBench type='success' size="small" @click="backWorkBench">前往工作台</el-button>
      </div>
    </div>
    <!-- 不通过时重新发起不调取留痕 -->
    <srStacetrack
      :imgUrl="imgUrl"
      :trackLoading="trackLoading"
      :trackData="trackData"
      ref="track"
      v-if="trackData && $route.query.status != null"
    >
    </srStacetrack>
  </div>
</template>

<script>
import srStacetrack from "./srStacetrack.vue";
import {
  api_queryOpinion,
  api_getDetail,
  api_getFixedGroupMembers,
  getAddedGroupMembers,
} from "@/api/projectInitial/index.js";
import { getJSONStr, setFile } from "@/utils/workflowList.js";
export default {
  name: "SrQiankunWorkFlow",
  components: {
    srStacetrack,
  },
  inject: ["srtracetrackRequest", "workflowRequest"],
  props: {
    currentStatus: Number,
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
          this.setFromConfig(val);
        }
      },
      deep: true,
    },
    buttonList: {
      handler(val) {
        if (val.length) {
          if (val[0].showForm) {
            this.getFormConfig();
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    busiId() {
      return this.$route ? this.$route.query.projectInitalId : "";
    },
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    projectId() {
      return this.$route ? this.$route.query.id : "";
    },
    processId() {
      return this.$route ? this.$route.query.processId : "";
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
    isXiAn() {
      return this.$systemConfig && this.$systemConfig.platform == "XIAN_CLOUD";
    },
  },
  data() {
    return {
      isFromWorkBench: false,//是否从工作台进入
      trackLoading: true,
      inputWidth: 0,
      textarea: "",
      timer: "",
      searchIndex: "",
      activeName: 1,
      activeItem: {},
      activeItemIndex: false,
      beAssignerList: [],
      itemList: [],
      lastChildIndex: false,
      trackData: [],
      markData: [],
      visible: false,
      showWorkFlow: true,
      imgUrl: "",
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
      otherMembers: [],
      form: {
        config: [
          {
            type: "input",
            name: "审核人",
            placeholder: "请输入审核人",
            bind: "auditUserName",
            disabled: true,
            maxlength: 500,
            col: 24,
            class: "customClass",
            className: "appointStyle",
          },
          {
            type: "dateSelect",
            name: "审核时间",
            placeholder: "请选择审核时间",
            bind: "auditTime",
            col: 24,
            disabled: true,
            class: "customClass",
            className: "appointStyle",
          },
          {
            type: "textarea",
            name: "审批意见",
            placeholder: "请输入审批意见",
            required: "请填写审批意见",
            bind: "auditOpinion",
            append: true,
            maxlength: 2000,
            col: 24,
            className: "appointStyle customClass2",
          },
        ],
        enums: {},
        data: {
          auditUserName: "",
          auditOpinion: "",
          auditTime: "",
          accessoryList: [],
          accessory: [],
        },
      },
      form2: {
        config: [
          {
            type: "input",
            name: "审核人",
            placeholder: "请输入审核人",
            bind: "auditUserName",
            disabled: true,
            maxlength: 500,
            col: 24,
            class: "customClass",
            className: "appointStyle",
          },
          {
            type: "dateSelect",
            name: "审核时间",
            placeholder: "请选择审核时间",
            bind: "auditTime",
            col: 24,
            disabled: true,
            class: "customClass",
            className: "appointStyle",
          },
          {
            type: "textarea",
            name: "审批意见",
            required: "请填写审批意见",
            placeholder: "请输入审批意见",
            bind: "auditOpinion",
            append: true,
            maxlength: 2000,
            col: 24,
            className: "appointStyle customClass2",
          },
          {
            type: "slot",
            slotName: "group",
            name: "评审小组",
            placeholder: "请选择",
            bind: "fixedGroupMembers",
            maxLength: 16,
            class: "gg",
            col: 16,
            required: "评审小组必填",
          },
          {
            type: "select",
            name: "添加评审人员",
            placeholder: "请选择",
            bind: "additionalGroupMembers",
            dataList: "additionalGroupMembersList",
            col: 16,
            class: "customClass",
            multiple: true,
            collapseTags: true,
          },
        ],
        enums: {
          additionalGroupMembersList: [], // 额外小组成员
        },
        data: {
          auditUserName: "",
          auditOpinion: "",
          auditTime: "",
          accessoryList: [],
          accessory: [],
          additionalGroupMembers: [], // 添加评审人员
          fixedGroupMembers: [], // 评审小组
        },
      },
      //最后一步初验通过
      lastStepForm: {
        config: [
          {
            type: "slot",
            name: "初验日期",
            slotName: "cyrq",
            placeholder: "请选择初验日期",
            bind: "preliminaryDate",
            col: 24,
            class: "customClass",
            className: "appointStyle",
            timeType: "date",
            format: "yyyy-MM-dd",
            required: "初验日期必填！",
          },
          {
            type: "upload",
            name: "试运行申请单盖章件",
            bind: "operationSchemeList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "评审意见",
            bind: "initialSummaryReportList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "初验报审表盖章件",
            bind: "initialSoftwareReportList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "报告盖章文件",
            bind: "initialServiceReportList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "其他附件",
            bind: "commonCapabilityReportList",
            // required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "textarea",
            name: "说明",
            placeholder: "请输入申请说明",
            bind: "auditOpinion",
            append: true,
            maxlength: 2000,
            col: 24,
            className: "appointStyle customClass2",
          },
        ],
        data: {
          auditOpinion: '',
          accessory: [],
          accessoryList: [],
          preliminaryDate: "", // 初验日期
          operationSchemeList: [], // 试运行申请单盖章件
          initialSummaryReportList: [], // 评审意见
          initialSoftwareReportList: [], // 初验报审表盖章件
          initialServiceReportList: [], // 报告盖章件
          commonCapabilityReportList: [], // 其他附件
        },
        enums: {},
      },
      loading: "",
      selectMembersDialogVisible: false, //评审小组弹框
      // 评审小组弹框相关传递参数
      title: {
        label: "",
        value: null,
      },
      baseMembersList: [], //额外小组成员
      filterMembersList: [], //对应额外小组完整参数
    };
  },
  mounted() {
    if(this.$route.query.activeName=='待办'||this.$route.query.activeName=='已办'){
      this.isFromWorkBench = true
    }
    if (this.WorkOrderDisposeFlag) {
      this.$set(this.form.config[0], "name", "审批意见");
      this.$set(this.form.config[0], "placeholder", "请输入审批意见");
    }
    if (this.buttonList[0].showForm) {
      this.getFormConfig();
    }
    if (this.$route.query.status == 2) {
      this.$set(this.form.config[0], "name", "审核人");
      this.$set(this.form.config[1], "name", "审核时间");
      this.$set(this.form.config[2], "name", "审核意见");
      // this.$set(this.form.config[2], "required", "确定意见必填！");
      this.$set(this.form.config[2], "placeholder", "请输入审核意见");
      if (this.$route.query.db) {
        this.getBaseMembers();
        this.getUserByCode();
      }
      // this.form.config.splice(-2, 2);
      // this.getAuditOpinion(); //获取审核保存意见
      this.getDetailById();
    } else if (
      this.$route.query.status == 304 ||
      this.$route.query.status == 308
    ) {
      this.getDetailById();
      // this.form.config.splice(2, 1);
      // this.getAuditOpinion(); //获取审核保存意见
    } else if (this.$route.query.status == 204) {
      this.getBaseMembers();
      this.getUserByCode();
      this.getDetailById();
      // this.form.config.splice(2, 1);

      if (this.$route.query.db) {
        this.getBaseMembers();
        this.getUserByCode();
      }
    }
    // 审批label
    this.$nextTick(() => {
      let advicefujian = document.querySelectorAll(
        ".appointStyle .el-form-item__label"
      );
      let advicefujian2 = document.querySelectorAll(
        ".appointStyle .el-form-item__content"
      );
      if (this.$route.query.status == 2) return;
      for (let i = 0; i < advicefujian.length; i++) {
        advicefujian[i].style.width = "170px";
        advicefujian2[i].style.marginLeft = "170px";
        advicefujian2[i].style.width = "calc(100% - 194px)";
      }
    });
    // this.getAuditOpinion(); //获取审核保存意见
  },
  created() {
    this.form.data.auditUserName = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).fullname;
    this.form2.data.auditUserName = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).fullname;
    if (this.workFlowConfig && Object.keys(this.workFlowConfig).length) {
      this.setFromConfig(this.workFlowConfig);
    }
    this.form.data.auditTime = this.getNowTime();
    this.form2.data.auditTime = this.getNowTime();
    if ([2, 304].includes(this.currentStatus)) {
      this.getDetailById();
    }
    if ([204, 305, 306, 307, 308].includes(Number(this.currentStatus))) {
      this.getBaseMembers();
      this.getUserByCode();
    }
    if (this.buttonList[0].showForm) {
      // this.getTraceTrackImage();
      this.getTraceTrack();
      this.getHoverTraceTrack();

      // this.getBeAssignerList()
    } else if (this.hideFrom) {
      // 查看页面调取留痕
      // this.getTraceTrackImage();
      this.getTraceTrack();
    }

    // this.getTraceTrack();
    // this.getBeAssignerList();
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
    getDetailById() {
      api_getDetail({
        id: this.$route.query.id,
        newFlag: false,
        contractId: this.$route.query.contractId == "null"|| !this.$route.query.contractId
            ? null
            : Number(this.$route.query.contractId),
      }).then((res) => {
        if (res.data) {
          //回显数据
          console.log("回显数据", res.data);
          if (res.data.opinionEntityList && res.data.opinionEntityList[0]) {
            const { opinionInfo } = res.data.opinionEntityList[0];
            this.currentStatus == 204
              ? this.$set(this.form2.data, "auditOpinion", opinionInfo)
              : this.currentStatus == 308 ? this.$set(this.lastStepForm.data, "auditOpinion", opinionInfo) : this.$set(this.form.data, "auditOpinion", opinionInfo);
          }
          // this.form2.data.fixedGroupMembers = res.data.fixedGroupMembers
          // this.form2.data.additionalGroupMembers = res.data.additionalGroupMembers
          if (res.data?.additionalGroupMembers?.length > 0) {
            let addInfo = res.data.additionalGroupMembers.map((item) => {
              return String(item.jfid);
            });
            this.$set(this.form2.data, "additionalGroupMembers", addInfo);
            // res.data.additionalGroupMembers.map(element => {
            //     this.form2.enums.additionalGroupMembersList.push({
            //         dataName: String(element.fullname),
            //         dataValue: String(element.jfid),
            //     })
            // })

            // this.otherMembers = res.data.additionalGroupMembers
          }
          if (
            res.data.initialSpectFilesEntityList &&
            res.data.initialSpectFilesEntityList[0]
          ) {
            console.log("走到这里了");

            const {
              preliminaryDate,
              stoaf,
              reviemFeedBack,
              spiaf,
              stamPedReport,
              otherFile,
            } = res.data.initialSpectFilesEntityList[0];
            this.lastStepForm.data.preliminaryDate = preliminaryDate;
            if (stoaf == null) {
              this.lastStepForm.data.operationSchemeList = [];
            } else {
              this.lastStepForm.data.operationSchemeList = setFile(stoaf);
            }
            if (reviemFeedBack == null) {
              this.lastStepForm.data.initialSummaryReportList = [];
            } else {
              this.lastStepForm.data.initialSummaryReportList =
                setFile(reviemFeedBack);
            }
            if (spiaf == null) {
              this.lastStepForm.data.initialSoftwareReportList = [];
            } else {
              this.lastStepForm.data.initialSoftwareReportList = setFile(spiaf);
            }
            if (stamPedReport == null) {
              this.lastStepForm.data.initialServiceReportList = [];
            } else {
              this.lastStepForm.data.initialServiceReportList =
                setFile(stamPedReport);
            }
            if (otherFile == null) {
              this.lastStepForm.data.commonCapabilityReportList = [];
            } else {
              this.lastStepForm.data.commonCapabilityReportList =
                setFile(otherFile);
            }
          }
        }
      });
    },
    otherChange(list) {
      // 选了多个
      this.form2.enums.additionalGroupMembersList.forEach((i) => {
        list.forEach((item) => {
          if (i.jfid === item) {
            this.otherMembers.push({
              jfid: i.jfid,
              roleCode: i.roleCode,
              fullname: i.fullname,
              buid: i.buid,
            });
          }
        });
      });
      this.otherMembers = this.unRepeatObject(this.otherMembers);
    },
    // 去重
    unRepeatObject(arr) {
      var tmepArr = [];
      // 将数组对象转成数组字符串
      var newStr = this.changeArrStr(arr);
      newStr.sort();
      // 数组去重
      for (var i = 0; i < newStr.length; i++) {
        if (newStr[i] !== tmepArr[tmepArr.length - 1]) {
          tmepArr.push(newStr[i]);
        }
      }
      var newArr = [];
      // 新数组字符串转成数组对象
      for (var i = 0; i < tmepArr.length; i++) {
        newArr.push(JSON.parse(tmepArr[i]));
      }
      return newArr;
    },
    changeArrStr(arr) {
      var newArr = [];
      if (arr.length !== 0) {
        for (var i = 0; i < arr.length; i++) {
          var thisObj = this.sortObjectFun(arr[i]);
          var thisStr = JSON.stringify(thisObj);
          thisStr = thisStr.replace(/(\s|[\\t])/g, ""); // 去除空格及\t空白字符
          newArr.push(thisStr);
        }
      }
      return newArr;
    },
    sortObjectFun(obj) {
      var keyArr = []; // 对象的key
      for (var item in obj) {
        keyArr.push(item);
      }
      keyArr.sort(); // 降序
      var newObj = {};
      for (var i = 0; i < keyArr.length; i++) {
        newObj[keyArr[i]] = obj[keyArr[i]];
      }
      return newObj;
    },
    // 根据code  拿到角色信息
    getUserByCode() {
      api_getFixedGroupMembers({ type: 2 }).then((res) => {
        this.baseMembersList = res.data;
        res.data.map((element) => {
          this.form2.enums.additionalGroupMembersList.push({
            dataName: String(element.fullName),
            dataValue: element.jfid,
          });
        });
        this.$forceUpdate();
        if (this.$route.query.db !== true) {
          this.getDetailById();
        }
      });
    },
    // 获取固定小组成员
    getBaseMembers() {
      api_getFixedGroupMembers({ type: 1 }).then((res) => {
        this.form2.data.fixedGroupMembers = res.data;
      });
    },
    // 关闭选择评审小组
    closeSelectMembersDialog() {
      this.selectMembersDialogVisible = false;
    },
    // 添加评审小组人员
    addGroupMembers() {
      this.selectMembersDialogVisible = true;
      this.title = {
        label: "选择评审小组",
        value: "Group",
      };
    },
    getSize(size) {
      if (typeof size == "string") return size;
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },
    // 获取审核保存意见
    getAuditOpinion() {
      let params = {
        processInstanceId: this.processId,
        taskId: this.processId,
        projectId: this.projectId,
      };
      api_queryOpinion(params).then((res) => {
        if (res.data) {
          this.form.data.auditOpinion = res.data.auditOpinion;
          this.form2.data.auditOpinion = res.data.auditOpinion;
          this.form.data.accessoryList = res.data.accessoryList
            ? res.data.accessoryList
            : [];
          this.form2.data.accessoryList = res.data.accessoryList
            ? res.data.accessoryList
            : [];
        }
      });
    },
    inputclick(el) {
      this.$nextTick(() => {
        this.inputWidth = +el.target.offsetWidth;
      });
    },
    popover(item) {
      // this.form.data.auditOpinion = this.textarea;
    },
    getFormConfig() {
      let list = [
        {
          type: "slot",
          slotName: "inputBox",
          name: "审批意见",
          placeholder: "请输入审批意见",
          bind: "auditOpinion",
          append: true,
          maxlength: 50,
          col: 8,
        },
        {
          type: "upload",
          name: "附件",
          bind: "accessoryList",
          fileList: [],
          limit: 10,
          tipPopover: true, // hover显示提示  默认外面显示
          col: 18,
        },
      ];

      let form =
        this.buttonList[0] && this.buttonList[0].showFormdata
          ? this.buttonList[0].showFormdata.formAdd
          : "";
      if (this.buttonList.length > 1) {
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        this.buttonList.forEach((item) => {
          if (item.role == userInfo.currentRole.roleCode) {
            form = this.buttonList[0].showFormdata.formAdd;
          }
        });
      }
      if (form) {
        this.$nextTick(() => {
          if (form && Object.keys(form.enums).length) {
            this.$set(this.form, "enums", form.enums);
          }
          if (form && Array.isArray(form.config)) {
            let list1 = [...form.config, ...list];
            this.$set(this.form, "config", list1);
          }
          this.$set(this.form, "data", form.data ? form.data : {});
        });
      }
    },
    //设置工作流表单配置
    setFromConfig(list) {
      let list1 = [
        {
          type: "slot",
          slotName: "inputBox",
          name: "审批意见",
          placeholder: "请输入审批意见",
          bind: "auditOpinion",
          append: true,
          maxlength: 50,
          col: 8,
        },
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
    //选中分配人
    setActiveItem(item) {
      if (item) {
        this.activeItemIndex = true;
        this.activeItem = item;
      }
    },
    //搜索筛选
    searchChange(val) {
      let list = this.beAssignerList.filter((item) => {
        return item.fullname.includes(val);
      });
      this.$set(this, "itemList", list);
    },
    getBeAssignerList() {
      if (this.workflowRequest.queryUsersByBuUniqueCode) {
        if (!this.userInfo) {
          return;
        }
        let userInfo = JSON.parse(this.userInfo);
        this.workflowRequest.queryUsersByBuUniqueCode(
          {
            buUniqueCode: userInfo.currentBizunit.buUniqueCode,
          },
          (res) => {
            if (res) {
              this.itemList = this.arrFilter(res.data, userInfo.jfid, "jfid");
              this.beAssignerList = this.arrFilter(
                res.data,
                userInfo.jfid,
                "jfid"
              );
            }
          }
        );
      }
    },
    arrFilter(arr, val, key) {
      return arr.filter((item) => item[key] != val);
    },
    gobackList() {
      if (this.tabs && this.tabs.closeCurrentAndSwitch) {
        const _location = this.$router.matcher.match({
          name: this.backName,
          query: { ...this.params },
        });
        const url = `${this.routerBase}/#${_location.fullPath}`;
        this.tabs.closeCurrentAndSwitch(url);
      } else if (this.isXiAn) {
        // 兼容西安单体改造
        this.$store.dispatch({
          type: "tabs/REMOVE_CURRENT_AND_SWITCH",
          target: { name: this.backName, query: { ...this.params } },
        });
      } else {
        this.routeClose();
        if (
          this.routerQuery ||
          (Object.keys(this.params) && Object.keys(this.params).length > 0)
        ) {
          this.$router.push({ name: this.backName, query: { ...this.params } });
        } else {
          this.$router.push({ name: this.backName });
        }
      }
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
    //分配取消
    fpClose() {
      this.lastChildIndex = false;
    },
    getParam() {
      let item = this.lastChildItem;
      let param = {
        vars: item.btnValue,
        processInstanceId: this.processId,
        taskId: this.taskId,
        // status: this.currentStatus,
        btnName: item.btnName,
        auditOpinion:
          this.currentStatus == 204
            ? this.form2.data.auditOpinion
            : this.currentStatus == 308 ?
            this.lastStepForm.data.auditOpinion
            : this.form.data.auditOpinion,
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
      return param;
    },
    //分配确定
    fpSumbit() {
      let item = this.lastChildItem;
      let param = {};
      if (this.buttonList[0].showForm) {
        this.form2.data.accessory = this.form2.data.accessoryList
          ? this.form2.data.accessoryList.map((item) => {
              return item.id;
            })
          : [];
        let fixMembers = [];
        this.form2.data.fixedGroupMembers.forEach((item) => {
          fixMembers.push({
            buid: item.buid,
            jfid: item.jfid,
            roleCode: item.roleCode,
            fullname: item.fullname,
          });
        });

        param = {
          fixedGroupMembers: fixMembers,
          additionalGroupMembers: this.otherMembers,
          auditUserName: this.form2.data.auditUserName,
          auditTime: this.form2.data.auditTime,
          auditOpinion: this.form2.data.auditOpinion,
          accessoryList: this.form2.data.accessoryList,
          accessory: this.form2.data.accessory,
        };
      }
      let obj = this.getParam();

      param = { ...param, ...obj };

      param.beAssigner = this.activeItem.jfid;
      param.beAssignerRole = this.activeItem.roleCode;
      param.buId = this.activeItem.buid;
      if (this.activeItem.jfid) {
        this.workflowRequest.setApiAfferentUrlOfPost(
          item.btnUrl,
          param,
          (res) => {
            if (res) {
              if (this.callbackFn) {
                // 缓存方案中，走回调方法
                this.callbackFn();
                return;
              }
              if (
                this.routerQuery ||
                (Object.keys(this.params) &&
                  Object.keys(this.params).length > 0)
              ) {
                this.routeClose();
                this.$router.push({
                  name: this.backName,
                  query: { ...this.params },
                });
              } else {
                this.routeClose();
                this.$router.push({ name: this.backName });
              }
            }
          }
        );
      }
    },
    goback(item) {
      let now = !this.timer;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.deTime || 1000);
      if (now) {
        this.$confirm(
          // 原代码
          `${
            item.btnName == "通过"
              ? `确认通过？`
              : item.btnName == "退回修改"
              ? "退回修改后重新编辑后提交。"
              : item.btnName == "不通过"
              ? "不通过后项目将无法进行后续操作。"
              : item.btnName == "保存"
              ? "确认保存？"
              : "确认提交"
          }`,
          `提示`,
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.gobackClick(item);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    gobackClick(item) {
      this.lastChildItem = item;
      if (this.clickMethods && this.clickMethods[item.btnEventType]) {
        this.clickMethods[item.btnEventType]();
      } else {
        if (item.btnEventType == "fp") {
          return;
        } else if (
          this.customEventMethods &&
          this.customEventMethods[item.btnEventType]
        ) {
          this.customEventMethods[item.btnEventType]();
          return;
        }
        let param = {};
        if (this.buttonList[0].showForm) {
          if (![204, 308, 309, 410, 411, 1000].includes(this.currentStatus)) {
            this.form.data.accessory = this.form.data.accessoryList
              ? this.form.data.accessoryList.map((item) => {
                  return item.id;
                })
              : [];
            param = { ...this.form.data };
          } else if (this.currentStatus == 204) {
            if (this.form2.data.additionalGroupMembers?.length > 0) {
              this.filterMembersList = [];
              this.form2.data.additionalGroupMembers
                .map((item2) => {
                  let result = this.baseMembersList.find(
                    (item) => item.jfid == item2
                  );
                  this.filterMembersList.push({
                    first: 0,
                    buid: result.userInfoVos[0].buid,
                    buName: result.userInfoVos[0].buName,
                    roleCode: result.userInfoVos[0].roleCode,
                    userName: result.userInfoVos[0].roleName,
                    fullname: result.userInfoVos[0].fullName,
                    ...result,
                  });
                })
                .filter(Boolean);
            }
            this.form2.data.fixedGroupMembers.forEach((item) => {
              item.first = 1;
              item.buid = item.userInfoVos[0].buid;
              item.buName = item.userInfoVos[0].buName;
              item.roleCode = item.userInfoVos[0].roleCode;
              item.userName = item.userInfoVos[0].roleName;
              item.fullname = item.userInfoVos[0].fullName;
            });
            param = {
              fixedGroupMembers: this.form2.data.fixedGroupMembers,
              additionalGroupMembers: this.filterMembersList,
              auditUserName: this.form2.data.auditUserName,
              auditTime: this.form2.data.auditTime,
              auditOpinion: this.form2.data.auditOpinion,
              accessoryList: this.form2.data.accessoryList,
            };
          } else {
            console.log("xxxxxxx", this.lastStepForm.data);

            let stoaf = getJSONStr(
              this.lastStepForm.data.operationSchemeList,
              "试运行申请单盖章件"
            );
            console.log("stoaf1", stoaf);
            let reviemFeedBack = getJSONStr(
              this.lastStepForm.data.initialSummaryReportList,
              "评审意见"
            );
            console.log("stoa2f", stoaf);
            let spiaf = getJSONStr(
              this.lastStepForm.data.initialSoftwareReportList,
              "初验报审表盖章件"
            );
            console.log("stoa3f", stoaf);
            let stamPedReport = getJSONStr(
              this.lastStepForm.data.initialServiceReportList,
              "报告盖章件"
            );
            console.log("sto4af", stoaf);
            let otherFileThree = getJSONStr(
              this.lastStepForm.data.commonCapabilityReportList,
              "其他附件"
            );
            console.log("sto5af", stoaf);
            let newArr = [];
            this.lastStepForm.data.accessoryList = newArr
              .concat(this.lastStepForm.data.operationSchemeList)
              .concat(this.lastStepForm.data.initialSummaryReportList)
              .concat(this.lastStepForm.data.initialSoftwareReportList)
              .concat(this.lastStepForm.data.initialServiceReportList)
              .concat(this.lastStepForm.data.commonCapabilityReportList);
            this.lastStepForm.data.accessory = this.lastStepForm.data
              .accessoryList
              ? this.lastStepForm.data.accessoryList.map((item) => {
                  return item.id;
                })
              : [];
            console.log("xxxxxxxxxxx2", this.lastStepForm.data);

            param = {
              preliminaryDate: this.lastStepForm.data.preliminaryDate,
              accessory: this.lastStepForm.data.accessory,
              accessoryList: this.lastStepForm.data.accessoryList,
              auditOpinion: this.lastStepForm.data.auditOpinion,
              stoaf: stoaf,
              reviemFeedBack: reviemFeedBack,
              spiaf: spiaf,
              stamPedReport: stamPedReport,
              otherFileThree: otherFileThree,
            };
          }
          let obj = this.getParam();
          param = { ...param, ...obj, ...this.extraParams };
          console.log("xxxxxx", param);

          // 退回修改、不通过、保存不校验
          if (item.btnEventType != "bh" && item.btnEventType != "xmbc") {
            this.$refs["add"].validate((val) => {
              if (val) {
                // debugger;
                this.workflowRequest.setApiAfferentUrlOfPost(
                  item.btnUrl,
                  param,
                  (res) => {
                    if (res) {
                      if (this.callbackFn) {
                        // 缓存方案中，走回调方法
                        this.callbackFn();
                        return;
                      }
                      if (
                        this.routerQuery ||
                        (Object.keys(this.params) &&
                          Object.keys(this.params).length > 0)
                      ) {
                        this.routeClose();
                        this.$message.success("操作成功");
                        this.$router.push({
                          name: this.backName,
                          query: { ...this.params },
                        });
                      } else {
                        this.routeClose();
                        this.$message.success("操作成功");
                        this.$router.push({ name: this.backName });
                      }
                    }
                  }
                );
              }
            });
          } else {
            // debugger;
            this.workflowRequest.setApiAfferentUrlOfPost(
              item.btnUrl,
              param,
              (res) => {
                if (res) {
                  if (this.callbackFn) {
                    // 缓存方案中，走回调方法
                    this.callbackFn();
                    return;
                  }
                  if (
                    this.routerQuery ||
                    (Object.keys(this.params) &&
                      Object.keys(this.params).length > 0)
                  ) {
                    this.routeClose();
                    this.$message.success("操作成功");
                    this.$router.push({
                      name: this.backName,
                      query: { ...this.params },
                    });
                  } else {
                    this.routeClose();
                    this.$message.success("操作成功");
                    this.$router.push({ name: this.backName });
                  }
                }
              }
            );
          }
        }
      }
    },
    //留痕轨迹
    getTraceTrack() {
      if (!this.processId) {
        this.trackLoading = false;
      }
      if (!this.busiType || !this.busiId) {
        this.trackLoading = false;
      } else {
        this.trackLoading = true;
        this.srtracetrackRequest.getTraceTrackList(
          { busiId: this.busiId, busiType: this.busiType },
          (res) => {
            this.trackData = res.data;
            console.log(this.trackData, "this.trackData");
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
    getHoverTraceTrack() {
      if (!this.busiType || !this.busiId) return;
      this.srtracetrackRequest.hoverTraceTrackList(
        {
          busiId: this.busiId,
          busiType: this.busiType,
          // projectId: this.projectId,
        },
        (res) => {
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
  },
};
</script>
<style lang="scss" scoped>
::v-deep .sr-add .el-form-item {
  width: 90% !important;
}
::v-deep .customClass .el-input__inner {
  width: 80% !important;
}
::v-deep .customClass2 .sr-textarea {
  width: 80% !important;
  .el-textarea {
    width: 100%  !important;
  }
  .el-textarea__inner {
    min-height: 80px !important;
    max-height: 100px;
    width: 100% !important;
  }
}

.workflow {
  position: static;
  width: 100%;
  padding: 20px;

  .workflow_formAdd {
    box-shadow: none;
  }

  .workflow_buttons {
    border: none;
    position: static;
    bottom: 0;
    width: calc(100% - 220px);
    // border-left:2px solid rgb(230,230,230) ;
    background: #fff;
    z-index: 10;
    right: 0;
  }

  .markBtton {
    border: none;
    display: none;
  }

  .workflow_formAdd_left {
    width: 100%;
    height: 100%;
    padding-right: 0;
  }
}

.contentBox {
  position: relative;
}

::v-deep .custom-select {
  .el-form-item__content {
    .el-input {
      width: 99%;
    }
  }
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
  padding-left: 20px;

  .content_left_name {
    width: 100%;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep .el-checkbox {
    width: 50px;
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

.sradd {
  ::v-deep .el-form {
    padding-top: 0px !important;
  }
}

::v-deep .el-message-box__btns {
  text-align: right;
}

// 为了避免内容太高,设置滚动
.workflow_formAdd_left {
  // padding-top: 20px;
  overflow: auto;
}

// 为了去除原本el-form的最高值184px
.workflow .workflow_formAdd_left .sr-add {
  ::v-deep .el-form {
    max-height: 100% !important;
  }
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

.wrapper {
  height: 175px !important;
}

.allowTitle {
  margin-top: 13px;
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

// 插入的表单左侧距离
::v-deep .advice {
  > .el-form-item__content {
    margin-left: 0 !important;
  }
}

// 信创总体意见label特殊处理
::v-deep .xc_label {
  label {
    width: 140px !important;
  }

  > .el-form-item__content {
    margin-left: 140px !important;
  }
}
</style>
<style>
/* 解决征求意见窗口抖动问题 */
html {
  overflow: hidden;
}
</style>
