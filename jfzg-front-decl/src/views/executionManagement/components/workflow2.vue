<template>
  <div v-if="showWorkFlow" class="workflow flow">
    <div v-if="buttonList[0].showForm" class="workflow_formAdd">
      <!-- 第二三步审批 -->
      <div class="workflow_formAdd_left">
        <!-- <div v-if="[201, 202, 203].includes(currentStatus)"> -->
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
        <!-- </div> -->
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

      <div  v-if="backFlag" class="gobackList btn">
        <el-button @click="gobackList()" plain size="medium" round>返回列表</el-button>
        <el-button  v-if=isFromWorkBench type='success' size="small" @click="backWorkBench">前往工作台</el-button>
      </div>
    </div>
    <!-- 不通过时重新发起不调取留痕 -->
    <srStacetrack
      :imgUrl="imgUrl"
      :trackData="trackData"
      ref="track"
      v-if="trackData && $route.query.status != null"
      :trackIsLoading="trackIsLoading"
    >
    </srStacetrack>
  </div>
</template>

<script>
import srStacetrack from "./srStacetrack.vue";
import { api_queryOpinion } from "@/api/projectStart/index.js";
import {
  executionManagementDetail,
  getListleaveTrace,
} from "@/api/executionManagement/index";
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
      return this.$route ? this.$route.query.id : "";
    },
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    id() {
      return this.$route ? this.$route.query.id : "";
    },
    projectId() {
      return this.$route ? this.$route.query.projectId : "";
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
  },
  data() {
    return {
      isFromWorkBench: false,//是否从工作台进入
      trackIsLoading: true,
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
      // pickerOptions: {
      //     disabledDate(time) {
      //         return time.getTime() < Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
      //     },
      // },
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
            bind: "auditOpinion",
            append: true,
            maxlength: 2000,
            col: 24,
            className: "appointStyle customClass2",
            required: true,
          },
        ],
        enums: {},
        data: {
          auditUserName: "",
          auditOpinion: "",
          auditTime: "",
        },
      },
      //最后一步同意开工
      lastStepForm: {
        config: [
          {
            type: "upload",
            name: "开工令",
            bind: "workDecideList",
            fileList: [],
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 0,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
            className: "appointStyle",
            required: "开工令必填！",
          },
          {
            type: "slot",
            name: "开工日期",
            slotName: "kkrq",
            placeholder: "请选择开工日期",
            bind: "workDate",
            col: 24,
            class: "customClass",
            className: "appointStyle",
            timeType: "date",
            format: "yyyy-MM-dd",
            required: "开工日期必填！",
          },
        ],
        enums: {},
        data: {
          workDate: "",
          workDecideList: [],
          workDecide: "",
          workDecideName: "",
          workDecideSize: "",
        },
      },
      loading: "",
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
      // this.form.config.splice(-2, 2);
      this.getAuditOpinion(); //获取审核保存意见
    } else if (this.$route.query.status == 301) {
      // this.form.config.splice(2, 1);
      this.getAuditOpinion(); //获取审核保存意见
    }
    // 交底审批label
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
  },
  created() {
    this.getDetail();
    // this.getLeaveTrace();

    // this.getTraceTrack();
    this.getLeaveTrace();
    this.form.data.auditUserName = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).fullname;

    console.log(this.form.data.auditUserName, "this.form.data.auditUserName");

    if (this.workFlowConfig && Object.keys(this.workFlowConfig).length) {
      this.setFromConfig(this.workFlowConfig);
    }
    this.form.data.auditTime = this.getNowTime();
    if (this.buttonList[0].showForm) {
      // this.getTraceTrackImage();
      // this.getTraceTrack();
      this.getLeaveTrace();
      // this.getHoverTraceTrack();
      // this.getBeAssignerList()
    } else if (this.hideFrom) {
      console.log(this.hideFrom, "hideForm");
      // 查看页面调取留痕
      // this.getTraceTrack();

      this.getLeaveTrace();
    }
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
    getDetail() {
      console.log(![1000, "1000"].includes(this.$route.query.status), "");
      // if (![1000, '1000'].includes(this.$route.query.status)) return false;
      executionManagementDetail({
        projectId: this.$route.query.projectId,
        sectionCount: this.$route.query.sectionCount,
        contractId: this.$route.query.contractId,
      }).then((res) => {
        // alert('1')
        console.log(res, "回显数据");
        if (res.data) {
          //回显数据
          console.log("回显数据111", res.data);
          // const { workDecide, workDecideName, workDecideSize } = res.data;
          // this.lastStepForm.data.workDate = res.data.workDate;
          // if (
          //   workDecideName === null ||
          //   workDecideName == "" ||
          //   !workDecideName
          // ) {
          //   this.lastStepForm.data.workDecideList = [];
          // } else {
          //   this.lastStepForm.data.workDecideList.push({
          //     id: workDecide,
          //     name: workDecideName,
          //     size: workDecideSize,
          //   });
          // }
        }
      });
    },

    getSize(size) {
      if (typeof size == "string") return size;
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },
    // 获取审核保存意见
    getAuditOpinion() {
      let params = {
        projectId: this.$route.query.projectId,
        // processInstanceId: this.processId,
        // taskId: this.processId,

        // sectionCount:this.$route.query.sectionCount,

        sectionCount:
          this.$route.query.contractId == null
            ? ""
            : this.$route.query.sectionCount,
        contractId: this.$route.query.contractId,
      };
      console.log(params, "获取审核保存意见");
      executionManagementDetail(params).then((res) => {
        console.log(res, "获取审核保存意见");
        if (res.data) {
          this.form.data.auditOpinion = res.data.auditorIdea;
          // this.form.data.accessoryList = res.data.accessoryList
          //   ? res.data.accessoryList
          //   : [];
        }
      });
      // api_queryOpinion(params).then((res) => {
      // if (res.data) {
      //   this.form.data.auditOpinion = res.data.auditOpinion;
      //   this.form.data.accessoryList = res.data.accessoryList
      //     ? res.data.accessoryList
      //     : [];
      // }
      // });
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
    // getBeAssignerList() {
    //     if (this.workflowRequest.queryUsersByBuUniqueCode) {
    //         if (!this.userInfo) {
    //             return;
    //         }
    //         let userInfo = JSON.parse(this.userInfo);
    //         this.workflowRequest.queryUsersByBuUniqueCode(
    //             {
    //                 buUniqueCode: userInfo.currentBizunit.buUniqueCode,
    //             },
    //             (res) => {
    //                 if (res) {
    //                     this.itemList = this.arrFilter(res.data, userInfo.jfid, "jfid");
    //                     this.beAssignerList = this.arrFilter(
    //                         res.data,
    //                         userInfo.jfid,
    //                         "jfid"
    //                     );
    //                 }
    //             }
    //         );
    //     }
    // },
    arrFilter(arr, val, key) {
      return arr.filter((item) => item[key] != val);
    },
    gobackList() {
      this.$router.push({
        name: "executionManagement",
      });
      // if (this.tabs && this.tabs.closeCurrentAndSwitch) {
      //   const _location = this.$router.matcher.match({
      //     name: this.backName,
      //     query: { ...this.params },
      //   });
      //   const url = `${this.routerBase}/#${_location.fullPath}`;
      //   this.tabs.closeCurrentAndSwitch(url);
      // } else if (this.isXiAn) {
      //   // 兼容西安单体改造
      //   this.$store.dispatch({
      //     type: "tabs/REMOVE_CURRENT_AND_SWITCH",
      //     target: { name: this.backName, query: { ...this.params } },
      //   });
      // } else {
      //   this.routeClose();
      //   if (
      //     this.routerQuery ||
      //     (Object.keys(this.params) && Object.keys(this.params).length > 0)
      //   ) {
      //     this.$router.push({ name: this.backName, query: { ...this.params } });
      //   } else {
      //     this.$router.push({ name: this.backName });
      //   }
      // }
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

      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

      console.log(userInfo, "userinof");
      console.log(this.form.data.auditTime, "this.form.data.auditTime");
      let param = {
        // processInstanceId: this.processId,
        // taskId: this.taskId,
        // status: this.currentStatus,
        auditorDate: this.form.data.auditTime,
        auditorId: userInfo.jfid,
        projectId: this.$route.query.projectId,
        auditorName: userInfo.fullname,
        auditOpinion: this.form.data.auditOpinion,

        sectionCount: this.$route.query.sectionCount,
        // processInstanceId: this.processId,
        // taskId: this.taskId,
        // // status: this.currentStatus,
        // // btnName: item.btnName, //按钮名字
        // // auditorName:item.
        // auditorld: this.$route.query.id, //审核人id
        // auditOpinion: this.form.data.auditOpinion, //审核意见
      };
      console.log(param, "审核意见审核意见审核意见审核意见");
      return param;
    },
    goback(item) {
      let now = !this.timer;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.deTime || 1000);
      if (now) {
        // flag暂无用
        let flag = true;
        if (flag) {
          this.gobackClick(item);
        }
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
          if (![401, 402, 403, 1000].includes(this.currentStatus)) {
            this.form.data.accessory = this.form.data.accessoryList
              ? this.form.data.accessoryList.map((item) => {
                  return item.id;
                })
              : [];
            param = { ...this.form.data };
          } else {
            this.lastStepForm.data.workDecide = this.lastStepForm.data
              .workDecideList[0]
              ? this.lastStepForm.data.workDecideList[0].id
              : "";
            this.lastStepForm.data.workDecideSize = this.lastStepForm.data
              .workDecideList[0]
              ? this.getSize(this.lastStepForm.data.workDecideList[0].size)
              : "";
            this.lastStepForm.data.workDecideName = this.lastStepForm.data
              .workDecideList[0]
              ? this.lastStepForm.data.workDecideList[0].name
              : "";
            this.form.data.accessory = this.form.data.accessoryList
              ? this.form.data.accessoryList.map((item) => {
                  return item.id;
                })
              : [];
            param = {
              ...this.lastStepForm.data,
              accessoryList: this.form.data.accessoryList,
            };
          }
        }

        let obj = this.getParam();
        param = { ...param, ...obj, ...this.extraParams };
        // if (this.form.data.accessoryList.length > 0) {
        //     this.form.data.accessoryList.forEach((item) => {
        //         item.deliveryName = "开工令";
        //     });
        // }
        // console.log("param", param);
        // debugger;
        // if (this.validate && item.btnEventType != "bh") {
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
    },
    // item按钮里面的信息
    gobackClick(item) {
      console.log(item, "item按钮里面的信息");
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
          if (![401, 402, 403, 1000].includes(this.currentStatus)) {
            this.form.data.accessory = this.form.data.accessoryList
              ? this.form.data.accessoryList.map((item) => {
                  return item.id;
                })
              : [];

            param = { ...this.form.data };
          } else {
            this.lastStepForm.data.workDecide = this.lastStepForm.data
              .workDecideList[0]
              ? this.lastStepForm.data.workDecideList[0].id
              : "";
            this.lastStepForm.data.workDecideSize = this.lastStepForm.data
              .workDecideList[0]
              ? this.getSize(this.lastStepForm.data.workDecideList[0].size)
              : "";
            this.lastStepForm.data.workDecideName = this.lastStepForm.data
              .workDecideList[0]
              ? this.lastStepForm.data.workDecideList[0].name
              : "";
            this.form.data.accessory = this.form.data.accessoryList
              ? this.form.data.accessoryList.map((item) => {
                  return item.id;
                })
              : [];
            param = {
              ...this.lastStepForm.data,
              accessoryList: this.form.data.accessoryList,
            };
          }
        }

        let obj = this.getParam();
        param = { ...param, ...obj, ...this.extraParams };
        param = {
          auditorDate: param.auditTime,
          auditorId: this.$route.query.id,
          auditorIdea: param.auditOpinion,
          auditorName: param.auditUserName,
          projectId: this.$route.query.projectId,
          sectionCount: this.$route.query.sectionCount,
        };
        console.log(param, "00000000");
        // 退回修改、不通过、保存不校验
        if (item.btnEventType != "bh" && item.btnEventType != "xmbc") {
          // alert('1')
          this.$refs["add"].validate((val) => {
            if (val) {
              console.log(val, "valvalval");
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
          console.log("项目保存", param);
          // debugger;
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            param,
            (res) => {
              console.log(res);
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
    },
    getLeaveTrace() {
      this.trackIsLoading = true;

      if (
        this.$route.query.projectExecutionId == null ||
        this.$route.query.projectExecutionId == "-" ||
        this.$route.query.projectExecutionId == "#{projectExecutionId}" ||
        this.$route.query.projectExecutionId == "{projectExecutionId}" ||
        this.$route.query.projectExecutionId == "projectExecutionId"
      ) {
        let params = {
          busId: this.$route.query.id,
          contractId: this.$route.query.contractId,
        };
        getListleaveTrace(params).then((res) => {
          console.log(res, "留痕轨迹留痕轨迹留痕轨迹留痕轨迹");
          this.trackData = res.data;
          this.trackIsLoading = false;
        });
      } else {
        let params = {
          busId: this.$route.query.projectExecutionId,
          contractId: this.$route.query.contractId,
        };
        getListleaveTrace(params).then((res) => {
          console.log(res, "留痕轨迹留痕轨迹留痕轨迹留痕轨迹");
          this.trackData = res.data;
          this.trackIsLoading = false;
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .customClass .el-input__inner {
  width: 250px !important;
}

::v-deep .customClass2 .sr-textarea {
  width: 500px !important;

  .el-textarea {
    width: 500px !important;
  }

  .el-textarea__inner {
    min-height: 80px !important;
    max-height: 100px;
    width: 500px !important;
  }
}

.workflow {
  position: static;
  width: 100%;

  .workflow_formAdd {
    box-shadow: none;
  }

  .workflow_buttons {
    border: none;
    position: static;
    bottom: 0;
    width: calc(100% - 220px);
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

// ::v-deep .el-icon-search {
//   top: -7px;
// }
// ::v-deep .search .el-input__suffix-inner .el-input__icon .el-icon-search {
//   top: -1px !important;
//   color: black;
// }
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
