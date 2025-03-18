<template>
  <div class="pilotMgrView">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <div class="total-page">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in newEditableTabs"
          :key="String(index)"
          :label="item.title"
          :name="item.title"
        >
          <template slot="label" class="tabsLabel">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
              >{{ item.title }}</span
            >
          </template>
          <component
            :is="item.componentName"
            :moduleCode="item.moduleCode"
            :formDatas="item.formData"
            :details="details"
            @projectInit="projectInit"
            @getTemplateId="getTemplateId"
            :projectId="projectId"
            :typeName="item.typeName ? item.typeName : typeName"
            :backName="backName"
            ref="componentBox"
          />
        </el-tab-pane>
      </el-tabs>
      <div class="bz-traceTrackView">
        <sr-trace-track
          :imgUrl="imgUrl"
          :trackData="trackData"
          v-if="$route.query.processId && !hideTrackIcon && $route.query.bianji"
        >
          <img src="@/assets/xuanting.png" alt />
        </sr-trace-track>
      </div>
    </div>
    <WorkFlow
      v-if="WorkFlowIndex"
      :hideFrom="true"
      :routerQuery="false"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      :backName="backName"
      ref="work_flow"
    ></WorkFlow>
  </div>
</template>

<script>
import applicationInformation from "../components/applicationInformation.vue";
import pilotMgr from "../components/pilotMgr.vue";
import deliverable from "../components/deliverable.vue";
import essentialInformation from "../components/essentialInformation.vue";
import milestone from "../components/milestone.vue";
import riskIssue from "../components/riskIssue.vue";
import taskCompletion from "../components/taskCompletion.vue";
import finalAcceptance from "../components/finalAcceptance.vue";
import contractInfo from "../components/contractInfo.vue";

import {
  api_pilotRunDetail,
  api_getIdByProjectId,
} from "@/api/pilotMgr/index.js";
import {
  api_getDetailById,
  api_getPilotRunIdByProjectId,
} from "@/api/finalAcceptance/index.js";
import { api_preliminaryMgrDetail } from "@/api/preliminaryMgr/index.js";
import { api_getContractAmountByProjectId } from "@/api/contract/index.js";
import WorkFlow from "@/components/SrWorkFlow";
import { api_workFlowimage } from "@/api/index";
import { getList } from "@/api/srtracetrack";
import config from "@/settings.js";
import upload from "@/utils/upload";
import workflows from "@/utils/workflow";
import srtracetrack from "@/utils/srtracetrack";
export default {
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows,
    };
  },
  props: {
    typeName: {
      type: String,
      default() {
        return "view";
      },
    },
    routeName: {
      type: String,
      default() {
        return "pilotMgr";
      },
    },
    backName: {
      type: String,
      default() {
        return "pilotMgr";
      },
    },
    WorkFlowIndex: {
      type: Boolean,
      default() {
        return true;
      },
    },
    hideTrackIcon: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    applicationInformation,
    deliverable,
    essentialInformation,
    milestone,
    riskIssue,
    taskCompletion,
    WorkFlow,
    pilotMgr,
    finalAcceptance,
    contractInfo,
  },
  data() {
    return {
      imgUrl: "",
      clickmethods: { tg: this.tg },
      buttonList: [{}],
      trackData: [],
      permissionCode: "",
      activeName: "初验申请信息",
      projectId: "",
      srNavPageObj: { name: "", code: "" },
      details: {},
      newEditableTabs: [
        {
          title: "初验申请信息",
          componentName: "applicationInformation",
          moduleCode: "15001",
          formData: {},
        },
        {
          title: "合同信息",
          componentName: "contractInfo",
          moduleCode: "13001",
          formData: {},
        },
        {
          title: "里程碑完成情况",
          componentName: "milestone",
          moduleCode: "",
          formData: {},
        },
        {
          title: "交付物完成情况",
          componentName: "deliverable",
          moduleCode: "",
          formData: {},
        },
        {
          title: "任务完成情况",
          componentName: "taskCompletion",
          moduleCode: "",
          formData: {},
        },
        {
          title: "风险和问题",
          componentName: "riskIssue",
          moduleCode: "",
          formData: {},
        },
        {
          title: "基本信息",
          componentName: "essentialInformation",
          moduleCode: "",
          formData: {},
        },
      ],
    };
  },
  created() {
    this.setNewEditableTabs();
    if (this.$route.query.processId) {
      api_workFlowimage({ processId: this.$route.query.processId }).then(
        (res) => {
          this.imgUrl = res.data;
        }
      );
    }
  },
  mounted() {
    this.projectId = this.$route.query.projectId;
    this.getTraceTrack();
  },
  // 处理验收管理查看基本信息不完整出现更多按钮
  updated() {
    setTimeout(() => {
      const btnMore = document.querySelectorAll(".btn-more");
      const textMore = document.querySelectorAll(".text-more");
      for (var i = 0; i < btnMore.length; i++) {
        // console.log(btnMore[i], textMore[i]);
        // console.log("视口", textMore[i].scrollWidth, textMore[i].offsetWidth);
        btnMore[i].style.display =
          textMore[i].scrollWidth > textMore[i].offsetWidth ? "block" : "none";
        textMore[i].style.marginRight =
          textMore[i].scrollWidth > textMore[i].offsetWidth ? "32px" : 0;
      }
    }, 100);
  },
  computed: {
    busiId() {
      return this.$route.query.id;
    },
    busiType() {
      return this.$route.meta.busiType;
    },
  },
  methods: {
    getTemplateId(id) {
      this.$emit("getTemplateId", id);
    },

    async setNewEditableTabs() {
      let preliminaryMgrId = "";
      let pilotRunId = "";
      // 试运行、终验时回显的初验数据
      if (this.routeName != "preliminaryMgr") {
        //初验
        preliminaryMgrId = await api_getIdByProjectId({
          projectId: this.$route.query.projectId,
        });
      }
      // 终验时回显的试运行数据
      if (this.routeName != "preliminaryMgr" && this.routeName != "pilotMgr") {
        //初验、试运行
        pilotRunId = await api_getPilotRunIdByProjectId({
          projectId: this.$route.query.projectId,
        });
      }
      //判断初验
      if (preliminaryMgrId && preliminaryMgrId.data) {
        console.log("初验------");
        let params = {
          id: preliminaryMgrId.data,
        };
        let res = await api_preliminaryMgrDetail(params);
        res.data.firstCheckFile = res.data.firstCheckFile
          ? JSON.parse(res.data.firstCheckFile)
          : [];
        res.data.otherFile = res.data.otherFile
          ? JSON.parse(res.data.otherFile)
          : [];
        // this.newEditableTabs[5] = {
        this.newEditableTabs[0] = {
          title: "初验申请信息",
          componentName: "applicationInformation",
          moduleCode: "15001",
          formData: res.data,
          typeName: "view",
        };
      }
      //判断试运行
      if (pilotRunId && pilotRunId.data) {
        console.log("试运行+++++++++");
        let params = {
          id: pilotRunId.data,
        };
        let res = await api_pilotRunDetail(params);
        res.data.pilotRunFile = res.data.pilotRunFile
          ? JSON.parse(res.data.pilotRunFile)
          : [];
        // if (this.newEditableTabs[5].title == "初验申请信息") {
        if (this.newEditableTabs[0].title == "初验申请信息") {
          // this.newEditableTabs.push({
          this.newEditableTabs.unshift({
            title: "试运行申请信息",
            componentName: "pilotMgr",
            moduleCode: "15002",
            formData: res.data,
            typeName: "view",
          });
        } else {
          // this.newEditableTabs[5] = {
          this.newEditableTabs[0] = {
            title: "试运行申请信息",
            componentName: "pilotMgr",
            moduleCode: "15002",
            formData: res.data,
            typeName: "view",
          };
        }
      }
      //判断tabs最后一项
      // setTimeout(() => {
      if (this.routeName == "finalAcceptance") {
        this.activeName = "终验申请信息";
        //判断当前项目是否有初验  是否有是运行
        if (this.newEditableTabs.length > 7) {
          // this.newEditableTabs.push({
          this.newEditableTabs.unshift({
            title: "终验申请信息",
            componentName: "finalAcceptance",
            moduleCode: "15003",
            formData: {},
          });
        } else {
          console.log("终验");
          // this.newEditableTabs[5] = {
          this.newEditableTabs[0] = {
            title: "终验申请信息",
            componentName: "finalAcceptance",
            moduleCode: "15003",
            formData: {},
          };
        }
      } else if (this.routeName == "pilotMgr") {
        console.log(preliminaryMgrId, preliminaryMgrId.data);
        // debugger;
        this.activeName = "试运行申请信息";
        //判断当前项目是否有初验
        if (preliminaryMgrId && preliminaryMgrId.data) {
          console.log("试运行");
          // this.newEditableTabs.push({
          this.newEditableTabs.unshift({
            title: "试运行申请信息",
            componentName: "pilotMgr",
            moduleCode: "15002",
            formData: {},
          });
        } else {
          // this.newEditableTabs[5] = {
          this.newEditableTabs[0] = {
            title: "试运行申请信息",
            componentName: "pilotMgr",
            moduleCode: "15002",
            formData: {},
          };
        }
      } else if (this.routeName == "preliminaryMgr") {
        console.log("初验");
        // debugger;
        this.activeName = "初验申请信息";
        // this.newEditableTabs[5] = {
        this.newEditableTabs[0] = {
          title: "初验申请信息",
          componentName: "applicationInformation",
          moduleCode: "15001",
          formData: {},
        };
      } else if (this.routeName == "beCompleted") {
        this.activeName = "竣工验收申请信息";
        //判断当前项目是否有初验  是否有是运行
        if (this.newEditableTabs.length > 7) {
          console.log("竣工验收");
          // this.newEditableTabs.push({
          this.newEditableTabs.unshift({
            title: "竣工验收申请信息",
            componentName: "finalAcceptance",
            moduleCode: "31001",
            formData: {},
          });
        } else {
          // this.newEditableTabs[5] = {
          this.newEditableTabs[0] = {
            title: "竣工验收申请信息",
            componentName: "finalAcceptance",
            moduleCode: "31001",
            formData: {},
          };
        }
      }
      // }, 500);
      console.log("394newEditableTabs", this.newEditableTabs);
      if (this.$route.query.id) {
        this.getDetail();
      }
    },
    //留痕轨迹
    getTraceTrack() {
      getList({ busiId: this.busiId, busiType: this.busiType }).then((data) => {
        this.trackData = data.data;
      });
    },
    handleClick(index) {
      let refsBox = this.$refs["componentBox"][index.index];
      if (refsBox && refsBox.getCustom) {
        refsBox.getCustom();
      }
    },
    //获取详情
    getDetail() {
      let params = {
        id: this.$route.query.id,
      };
      if (this.routeName == "pilotMgr") {
        api_pilotRunDetail(params).then((res) => {
          if (res.msg.code == "0000") {
            res.data.pilotRunFile = res.data.pilotRunFile
              ? JSON.parse(res.data.pilotRunFile)
              : [];
            console.log("试运行", this.newEditableTabs.length);
            this.$set(
              // this.newEditableTabs[this.newEditableTabs.length - 1],
              this.newEditableTabs[0],
              "formData",
              res.data
            );
            this.$set(this, "details", res.data);
            this.$emit("getDetail", res.data);
          }
        });
      } else if (this.routeName == "preliminaryMgr") {
        api_preliminaryMgrDetail(params).then((res) => {
          if (res.msg.code == "0000") {
            res.data.firstCheckFile = res.data.firstCheckFile
              ? JSON.parse(res.data.firstCheckFile)
              : [];
            res.data.otherFile = res.data.otherFile
              ? JSON.parse(res.data.otherFile)
              : [];
            console.log("res.data", res.data);

            this.$set(
              // this.newEditableTabs[this.newEditableTabs.length - 1],
              this.newEditableTabs[0],
              "formData",
              res.data
            );
            this.$set(this, "details", res.data);
            this.$emit("getDetail", res.data);
          }
        });
      } else if (this.routeName == "finalAcceptance") {
        params.type = 1;
        api_getDetailById(params).then((res) => {
          res.data.applyFile = res.data.applyFile
            ? JSON.parse(res.data.applyFile)
            : [];
          res.data.otherFile = res.data.otherFile
            ? JSON.parse(res.data.otherFile)
            : [];
          this.$set(
            // this.newEditableTabs[this.newEditableTabs.length - 1],
            this.newEditableTabs[0],
            "formData",
            res.data
          );
          this.$set(this, "details", res.data);
          this.$emit("getDetail", res.data);
        });
      } else if (this.routeName == "beCompleted") {
        params.type = 2;
        api_getDetailById(params).then((res) => {
          res.data.applyFile = res.data.applyFile
            ? JSON.parse(res.data.applyFile)
            : [];
          res.data.otherFile = res.data.otherFile
            ? JSON.parse(res.data.otherFile)
            : [];
          // this.newEditableTabs[this.newEditableTabs.length - 1].formData =
          this.newEditableTabs[0].formData = res.data;
          this.$set(this, "details", res.data);
          this.$emit("getDetail", res.data);
        });
      }
      // 合同
      api_getContractAmountByProjectId({
        projectId: this.$route.query.projectId,
      }).then((res2) => {
        console.log("res2", res2);
        // debugger;
        res2.data.applyFile = res2.data.contractFile
          ? JSON.parse(res2.data.contractFile)
          : [];
        res2.data.otherFile = res2.data.otherFile
          ? JSON.parse(res2.data.otherFile)
          : [];
        // 处理承建单位回显
        if (res2.data.contractUnitName) {
          res2.data.contractUnit = res2.data.contractUnitName;
        }
        // 处理监理单位回显
        if (res2.data.controlUnitName) {
          res2.data.controlUnit = res2.data.controlUnitName;
        }
        // 合同周期显示
        if (res2.data.contractDuration) {
          let contractDuration = JSON.parse(res2.data.contractDuration);
          console.log(contractDuration);
          if (contractDuration && contractDuration.length > 0) {
            res2.data.contractDuration =
              contractDuration[0] + " ~ " + contractDuration[1];
          }
        }
        console.log("合同", this.newEditableTabs.length);
        this.newEditableTabs[this.newEditableTabs.length - 5 - 1].formData =
          res2.data;
        this.$set(this, "details", res2.data);
        this.$emit("getDetail", res2.data);
      });
    },
    //头部项目信息
    projectInit(obj) {
      if (obj) {
        this.srNavPageObj = obj;
      }
    },
    //申请表单验证
    getForm() {
      let formData = {};
      let found = false;
      this.$refs["componentBox"].forEach((item) => {
        if (found == true) {
          return;
        }
        /*      console.log(
          "item",
          item,
          typeof item.getForm,
          item.getForm && typeof item.getForm == "function"
        ); */
        if (item.getForm && typeof item.getForm == "function") {
          formData = item.getForm();
          found = true;
        }
      });
      if (formData) {
        return formData;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pilotMgrView {
  position: relative;
  .btns {
    text-align: center;
  }
  .searchPage {
    display: flex;
    justify-content: space-between;
  }
  .searchRightBtn {
    display: inline-block;
    button {
      width: 76px;
      height: 32px;
      border-radius: 16px;
      padding: 5px 24px;
    }
  }
  .tabsLabel {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    i {
      margin-right: 4px;
    }
  }
  ::v-deep .el-tabs__header {
    margin-bottom: 16px;
  }
  .tabsDataTitle {
    margin-top: 8px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
  }
  .sr-view {
    padding: 8px 0;
  }
  ::v-deep .total-page {
    position: relative;
    .el-tabs__content {
      padding: 0;
    }
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
  }
}
</style>
