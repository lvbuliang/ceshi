<template>
<div>
  <sr-qiankun-work-flow
    :style="{ width: `calc(100% - ${widthB}) !important` }"
    :hideFrom="hideFrom"
    ref="work_flow"
    :taskId="taskId"
    :buttonList="buttonList"
    :backName="backName"
    :routerQuery="routerQuery"
    :clickMethods="clickMethods"
    :hideTrackIcon="hideTrackIcon"
    :workFlowLoading="workFlowLoading"
    :params="params"
    :WorkOrderDisposeFlag="WorkOrderDisposeFlag"
  ></sr-qiankun-work-flow>
</div>
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
    //返回是否携带路由参数
    routerQuery: {
      type: Boolean,
      default() {
        return false;
      },
    },
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
    hideTrackIcon: Boolean,
    workFlowLoading: Boolean,
    params: Object, // 调用按钮传的其他参数
    hideTrackIcon: Boolean,
    WorkOrderDisposeFlag: Boolean, //工单设置处理参数
  },
  data() {
    return {
      widthB: "",
    };
  },
  methods: {
    initResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.widthB = entry.contentRect.width + "px";
        });
      });
      this.resizeObserver.observe(document.querySelector(".main-menu-box"));
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
  },
  mounted() {
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
};
</script>
<style lang="scss" scoped>
.workflow {
  .lastChild {
    width: 300px;
    height: 200px;
    background-color: #ffffff;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    z-index: 15;
    .fpForm {
      height: 140px;
    }
    .buts {
      width: 100%;
      height: 50px;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">

.workflow {
  position: fixed;
  bottom: 0;
  width: calc(100% - 220px);
  // border-left: 2px solid rgb(230, 230, 230);
  background: #fff;
  z-index: 10;
  right: 0;
  .el-input-group {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
      border-radius: 8px !important;
    }
    .el-input__inner {
      border-radius: 8px !important;
    }
  }

  .workflow_formAdd {
    display: flex;
    box-shadow: 0px -10px 20px 0px rgba(0, 0, 0, 0.1);
  }
  .workflow_formAdd_left {
    width: calc(100% - 64px);
  }
  .markBtton {
    width: 64px;
    border-left: 1px solid #e3e3e3;
    position: relative;
    cursor: pointer;
    &:hover {
      background: #e6f7ff;
      .markHover {
        display: block;
      }
    }
    .markBttonIcon_box {
      position: relative;
      display: flex;
      justify-content: center;
      img {
        position: absolute;
        top: 24px;
        cursor: pointer;
      }
    }

    .markHover {
      position: absolute;
      width: 422px;
      height: 138px;
      display: none;
      background: #ffffff;
      box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
      border: 1px solid #efefef;
      top: -108px;
      left: -402px;
      box-sizing: border-box;
      padding: 8px;
      .markContentOpinion {
        color: #1890ff;
      }
      .agree {
        color: #f5222d;
      }
      .markHoverTitle {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
        margin-bottom: 8px;
      }
      .markContentBox {
        height: 90px;
        overflow-y: auto;
      }
      .markContentName {
        margin: 0 23px;
      }
      .markContent {
        margin: 4px 0;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        margin-top: 8px;
        line-height: 22px;
      }
    }
  }
  .workflow_buttons {
    height: 64px;
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #e6e6e6;
    position: relative;
    .gobackList {
      margin-left: 32px;
      display: inline-block;
      .el-button.is-round {
        border-radius: 4px !important;
      }
    }
    .workflow_button {
      box-sizing: border-box;
      display: inline-block;
      margin: 0 4px;

      button {
        padding: 0px 24px;
        line-height: 32px;
        border-radius: 4px;
        // border-radius: 16px;
      }
    }
  }
  .sr-add {
    .el-form-item__label {
      padding-right: 0;
    }
    .el-input-group__append {
      display: none;
    }
    .el-form-item__content {
      width: calc(100% - 168px);
    }
  }
}
</style>
