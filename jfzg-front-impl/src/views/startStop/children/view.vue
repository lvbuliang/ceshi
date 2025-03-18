<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView :slotList="['暂停信息','启动申请']" :activeNameT="'暂停信息'" :hideTrackIcon="false">
      <SrView ref="viewMessage1" slot="暂停信息" :formData="stopConfig" :ruleForm="data"></SrView>
      <SrView ref="viewMessage1" slot="启动申请" :formData="startConfig" :ruleForm="data"></SrView>
    </TestFormView>
    <sr-work-flow ref="work_flow" :hideFrom="true" :buttonList="buttonList" :backName="'startStop'"></sr-work-flow>
  </div>
</template>
<script>
import TestFormView from "@/components/srFormView.vue";

import { api_getDetailById } from "@/api/projectLibrary";
import {
  api_getProjectStopDelitail,
  api_getStopInfoById,
} from "@/api/startStop";

import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";

export default {
  components: { TestFormView },
  provide() {
    return {
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows,
    };
  },
  data() {
    return {
      srNavPageObj: { name: "", code: "" },
      data: {},
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
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
    if (this.$route.query.isProject) {
      this.init();
    } else {
      this.businessInit();
    }
  },
  methods: {
    async businessInit() {
      let params = {
        id: this.$route.query.id,
      };
      api_getStopInfoById(params).then((res) => {
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
          this.data = obj;
        }
      });
    },
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
          this.data = obj;
        }
      });
    },
    async projectInit() {
      let res = await api_getDetailById({ id: this.$route.query.projectId });
      if (res?.data) {
        this.srNavPageObj = res.data;
      }
    },
  },
};
</script>

<style>
</style>