<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView :slotList="['暂停信息','启动申请']" :hideTrackIcon="true" :activeNameT="'暂停信息'">
      <SrView ref="viewMessage1" slot="暂停信息" :formData="stopConfig" :ruleForm="data"></SrView>
      <SrView ref="viewMessage1" slot="启动申请" :formData="startConfig" :ruleForm="data"></SrView>
    </TestFormView>
    <sr-work-flow
      v-if="buttonList.length"
      ref="work_flow"
      :taskId="taskId"
      :buttonList="buttonList"
      backName="startStop"
    ></sr-work-flow>
  </div>
</template>
<script>
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import workflows from "@/utils/workflow";
import srtracetrack from "@/utils/srtracetrack";

import TestFormView from "@/components/srFormView.vue";
import { api_activititodo } from "@/api/index";
import { api_getDetailById } from "@/api/projectLibrary";
import { api_getProjectStopDelitail } from "@/api/startStop";
export default {
  components: { TestFormView },
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
  data() {
    return {
      userInfo: store.getters.userInfo,
      srNavPageObj: { name: "", code: "" },
      data: {},
      taskId: "",
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
          showForm: true,
        },
      ],
      stopConfig: [
        {
          label: "整改内容",
          type: "value",
          span: 24,
          value: "descContext",
        },
        {
          label: "项目暂停通知单",
          type: "uploader",
          span: 24,
          value: "stopFile",
        },
        {
          label: "整改通知单",
          type: "uploader",
          span: 24,
          value: "rectFile",
        },
      ],
      startConfig: [
        {
          label: "申请理由",
          type: "value",
          span: 24,
          value: "improveContext",
        },
        {
          label: "申请附件",
          type: "uploader",
          span: 24,
          value: "improveFile",
        },
      ],
    };
  },
  created() {
    this.projectInit();
    this.buttonInit();
    this.init();
  },
  methods: {
    async init() {
      let params = {
        projectId: this.$route.query.projectId,
      };
      api_getProjectStopDelitail(params).then((res) => {
        if (res.msg.code === "0000") {
          let { stopFile, rectFile, improveFile } = res.data;
          let obj = {
            ...res.data,
            stopFile:
              stopFile && typeof stopFile === "string"
                ? JSON.parse(stopFile)
                : stopFile,
            rectFile:
              rectFile && typeof rectFile === "string"
                ? JSON.parse(rectFile)
                : rectFile,
            improveFile:
              improveFile && typeof improveFile === "string"
                ? JSON.parse(improveFile)
                : improveFile,
          };
          this.$set(this, "data", obj);
        }
      });
    },
    async projectInit() {
      let res = await api_getDetailById({ id: this.$route.query.projectId });
      if (res?.data) {
        this.srNavPageObj = res.data;
      }
    },
    buttonInit() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;
      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.$route.query.processId,
      };
      api_activititodo(param).then((res) => {
        let assignee = res.data[0].assignee;
        this.buttonList = JSON.parse(res.data[0].description).filter((item) => {
          //按钮筛选  以assignee优先roleCode
          item.assignee = assignee;
          if (assignee == jfid) {
            return true;
          } else if (roleCode == item.role) {
            return true;
          }
        });
        this.taskId = res.data[0].taskId;
      });
    },
  },
};
</script>

<style>
</style>