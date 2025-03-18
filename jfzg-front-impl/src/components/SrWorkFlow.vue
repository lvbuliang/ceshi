<template>
  <sr-qiankun-work-flow
    :hideFrom="hideFrom"
    ref="work_flow"
    :taskId="taskId"
    :buttonList="buttonList"
    :backName="backName"
    :backFlag="backFlag"
    :clickMethods="clickMethods"
    :workFlowLoading="workFlowLoading"
    :params="params"
    :hideTrackIcon="hideTrackIcon"
    :routerQuery="routerQuery"
    :WorkOrderDisposeFlag="WorkOrderDisposeFlag"
  ></sr-qiankun-work-flow>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年06月24日 14:59:21
  版本：v1.0
-->
<script>
import srtracetrack from "@/utils/srtracetrack";
import workflow from "@/utils/workflow";
import config from "@/settings.js";
import upload from "@/utils/upload";
export default {
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadBaseUrl: config.uploadBaseUrl,
      uploadRequest: upload,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflow,
    };
  },
  props: {
    hideFrom: {
      type: Boolean,
      default() {
        return true;
      },
    },
    buttonList: {
      type: Array,
      default() {
        return [];
      },
    },
    clickMethods: {
      type: Object | Boolean,
      default() {
        return {};
      },
    },
    taskId: {
      type: String | Number,
      default() {
        return "";
      },
    },
    backName: {
      type: String,
      default() {
        return "";
      },
    },
    backFlag: {
      type: Boolean,
      default() {
        return true;
      },
    },
    workFlowLoading: Boolean,
    params: Object, // 调用按钮传的其他参数
    hideTrackIcon: Boolean,
    routerQuery: Boolean, //返回是否携带路由参数 兼容以前可以不传只传params
    WorkOrderDisposeFlag: Boolean, //工单设置处理参数
  },
  data() {
    return {};
  },
  created() {

  },
};
</script>