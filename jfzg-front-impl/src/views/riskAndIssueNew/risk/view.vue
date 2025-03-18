<template>
  <div class="total-page">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :disabled="true"
        :key="item.code"
        :name="item.code"
      >
        <template slot="label" class="tabsLabel">
          <img
            style="vertical-align: middle"
            src="@/assets/barrage_fill@2x.png"
            width="24px"
            height="auto"
            alt=""
          />
          <span style="color: #333; vertical-align: middle; padding-left: 4px">
            {{ item.title }}
          </span>
        </template>
        <SrView
          :formData="form.config"
          :ruleForm="form.data"
          :ref="`form`"
        ></SrView>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :disabled="true"
        :key="item.code"
        :name="item.code"
      >
        <template slot="label">
          <img
            style="vertical-align: middle"
            src="@/assets/barrage_fill@2x.png"
            width="24px"
            height="auto"
            alt=""
          />
          <span style="color: #333; vertical-align: middle; padding-left: 4px">
            操作
          </span>
        </template>
        <div v-if="transferforms.data.result">
          <SrView
            v-if="transferforms.data.resultId == '0'"
            :formData="transferforms.config1"
            :ruleForm="transferforms.data"
            :ref="`form`"
          ></SrView>
          <SrView
            v-if="transferforms.data.resultId == '1'"
            :formData="transferforms.config2"
            :ruleForm="transferforms.data"
            :ref="`form`"
          ></SrView>
          <SrView
            v-if="transferforms.data.resultId == '2'"
            :formData="transferforms.config3"
            :ruleForm="transferforms.data"
            :ref="`form`"
          ></SrView>
        </div>
        <div v-else>暂无处理结果</div>
      </el-tab-pane>
    </el-tabs> -->
    <sr-work-flow
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      ref="work_flow"
      :backName="
        $route.query.routeName ? $route.query.routeName : 'everydayriskNew'
      "
      :params="{
        projectId: $route.query.projectId,
        contractId: $route.query.contractId,
        sectionCount: $route.query.sectionCount,
        sectionSort: $route.query.sectionSort,
        systemName: $route.query.systemName,
        projectName: $route.query.projectName,
      }"
    ></sr-work-flow>

    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabList"
          :disabled="true"
          :key="item.code"
          :name="item.code"
        >
          <template slot="label">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
            >
              过程记录
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <RTSteps
        :srTraceArr="arr"
        :srTraceActive="arr.length"
        :show="false"
        :direction="'vertical'"
      ></RTSteps>
    </div>
  </div>
</template>
<script>
import RTSteps from "@/components/riskAndTroubleSteps.vue";

import { api_getCustomFormTemplate } from "@/api/index";
import config from "@/settings.js";
import upload from "@/utils/upload";
import {
  queryRiskDetailById,
  api_queryProblemHistory,
} from "@/api/riskAndIssueNew/index";
export default {
  name: "viewNew",
  components: { RTSteps },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {},
  watch: {
    $route: {
      handler(val) {
        if (val) {
          this.getSuggestion(val);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  updated() {},
  data() {
    return {
      arr: [],
      activeName: "1",
      active: "跟进",
      XZdDialogDis: false,
      tabList: [{ title: "风险基本信息", code: "1" }],
      templateId: this.$route.query.templateId,
      clickmethods: { tg: this.tg, btg: this.btg },
      textarea2: "",
      value1: "",
      text1: "",
      buttonList: [
        {
          role: "",
          // btns: [
          //   {
          //     btnValue: "btg",
          //     btnName: "保存",
          //     btnType: "primary",
          //     btnEventType: "btg",
          //   },
          // ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      // 新增周报
      form: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "风险问题描述",
            value: "description",
            col: 24,
            type: "value",
          },
          {
            value: "type",
            label: "风险类型",
            span: 8,
            type: "value",
          },
          {
            value: "level",
            label: "风险等级",
            span: 8,
            type: "value",
          },
          {
            value: "proposerName",
            label: "提出人",
            span: 8,
            type: "value",
          },
          {
            value: "processorName",
            label: "风险处理人",
            span: 8,
            type: "value",
          },
          {
            value: "departName",
            label: "责任处室/部门",
            span: 8,
            type: "value",
          },
          {
            value: "liablerName",
            label: "责任人",
            span: 8,
            type: "value",
          },
        ],
        data: {
          contactName: "",
          programManagerId: "",
          contactName1: "",
          programManagerName: "",
          preliminaryExaminationAnnex: "",
        },

        enums: {
          processorNameList: [], //风险处理人
          liablerNameList: {}, //责任人
          typeList: [], //风险类型
          levelList: [], //风险等级
        },
      },
      transferforms: {
        config1: [
          {
            label: "处理结果",
            value: "result",
            col: 24,
            type: "value",
          },
          {
            value: "handleIdea",
            label: "跟进处理意见",
            span: 24,
            type: "value",
          },
          {
            value: "handleTime",
            label: "跟进处理时间",
            span: 24,
            type: "value",
          },
        ],
        config2: [
          {
            label: "处理结果",
            value: "result",
            col: 24,
            type: "value",
          },
          {
            value: "subContractor",
            label: "转办人",
            span: 24,
            type: "value",
          },
          {
            value: "handleIdea",
            label: "转办处理意见",
            span: 24,
            type: "value",
          },
          {
            value: "handleTime",
            label: "转办处理时间",
            span: 24,
            type: "value",
          },
        ],
        config3: [
          {
            label: "处理结果",
            value: "result",
            col: 24,
            type: "value",
          },
          {
            value: "handleIdea",
            label: "关闭处理意见",
            span: 24,
            type: "value",
          },
          {
            value: "handleTime",
            label: "关闭处理时间",
            span: 24,
            type: "value",
          },
        ],
        data: {
          result: "",
          resultId: "",
          subContractor: "",
          handleIdea: "",
          handleTime: "",
        },
      },
    };
  },
  created() {},
  mounted() {
    this.getDeatailDate();
  },
  methods: {
    getDeatailDate() {
      queryRiskDetailById(this.$route.query.id).then((res) => {
        res.data.level =
          res.data.level == 0
            ? "轻度"
            : res.data.level == 1
            ? "中度"
            : res.data.level == 2
            ? "高度"
            : "-";
        res.data.type =
          res.data.type == 1
            ? "内部风险"
            : res.data.type == 2
            ? "外部风险"
            : res.data.type == 3
            ? "云网风险"
            : "-";
        this.form.data = res.data;
        this.transferforms.data = res.data;
        this.transferforms.data.resultId = res.data.result;
        this.transferforms.data.result =
          res.data.result == 0
            ? "跟进"
            : res.data.result == 1
            ? "转办"
            : res.data.result == 2
            ? "关闭"
            : "";
      });
    },
    getSuggestion(route) {
      let data = {
        problemId: "",
        riskId: "",
      };
      if (route.fullPath.includes("risk")) {
        data.riskId = route.query.id;
      }
      api_queryProblemHistory(data).then((res) => {
        console.log(res, "123");
        if (res.data != []) {
          this.arr = res.data.map((item) => {
            let description = "";
            let title1 =
              item.typeName == "转办"
                ? item.subSuggestion
                  ? item.subSuggestion
                  : ""
                : item.typeName == "关闭"
                ? item.closeSuggestion
                  ? item.closeSuggestion
                  : ""
                : item.typeName == "跟进"
                ? item.followUpSuggestion
                  ? item.followUpSuggestion
                  : ""
                : "";
            let x =
              item.typeName == "转办"
                ? "转办处理意见:"
                : item.typeName == "关闭"
                ? "关闭处理意见:"
                : item.typeName == "跟进"
                ? "跟进处理意见:"
                : "";
            description =
              "操作人:" +
              item.operatorName +
              "<span>&emsp;&emsp;&emsp;&emsp;</span>" +
              "操作时间:" +
              item.operatorTime +
              "<span>&emsp;&emsp;&emsp;&emsp;</span>" +
              (item.subContractor
                ? "被转办人:" + item.subContractor + "&emsp;&emsp;&emsp;"
                : "") +
              "<br/><br/>" +
              x +
              "&emsp;" +
              title1;
            return {
              description,
              title: item.typeName,
              per: item.operatorName,
              time: item.operatorTime,
            };
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.tableDown {
  .el-row {
    display: flex;
    margin: 0 0 15px 0;
    span {
      margin-right: 15px;
      // line-height: 60px;
      // display: inline-block;
    }

    ::v-deep .el-radio-button {
      margin-right: 32px;
      height: 34px;
      // width: 88px;
      span {
        padding: 9px 32px;
        background: rgba(242, 243, 245, 1);

        border: 1px solid rgba(201, 205, 212, 1);
      }
    }
    ::v-deep .is-active {
      span {
        background: rgba(66, 130, 255, 1) !important;
        border: 1px solid rgba(66, 130, 255, 1) !important;
      }
    }
    .el-textarea {
      width: 513px;
      // height: 120px;
    }
    .spanOther {
      margin-left: -16px;
    }
    .el-input {
      width: 250px;
      height: 32px;
    }
  }
}

.total-page {
  background-color: #fff;
  padding: 20px;
}
.sradd {
  padding: 20px;
  padding-bottom: 40px;
}
::v-deep .el-tabs__header {
  // padding: 20px !important;
  padding-bottom: 0 !important;
}
.btns {
  width: 80px;
  text-align: center;
  height: 34px;
  font-size: 12px;
  line-height: 34px;
  border-radius: 4px;
  color: rgba(66, 130, 255, 1);
  background: rgba(66, 130, 255, 0.1);
  cursor: pointer;
  border: 1px dashed rgba(66, 130, 255, 1);
}
::v-deep .sr_table {
  margin-bottom: 16px;
}
::v-deep .el-dialog .el-dialog__header {
  height: 56px;
  margin: 0 24px;
  padding: 16px 0;
  text-align: left;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  border-bottom: 1px solid #e8e8e8;
  .el-dialog__title {
    font-size: 14px;
  }
}
::v-deep .el-dialog__footer {
  height: 66px;
  .el-button {
    padding: 9px 27px;
  }
}

.dialog {
  display: flexbox;
  .el-dialog {
    .el-dialog__body {
      padding: none;
      .cen {
        display: flex;
        border-bottom: 1px solid rgba(229, 230, 235, 1);
        .left {
          width: 44%;
          display: block;
          padding: 10px 20px 34px;
          border-right: 1px solid rgba(229, 230, 235, 1);
        }
        .right {
          width: calc(100% - 55%);
          flex: 1;
          display: block;
          padding: 0 20px;
        }
      }
      .btn {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        .el-button {
          width: 88px;
          height: 34px;
          line-height: 34px;
          padding: 0;
          font-size: 15px;
          font-weight: 400;
        }
      }
    }
  }
}
::v-deep .step {
  // height: 340px !important;
  display: flex !important;
  justify-content: flex-start !important;
  margin-left: 40px !important;
  margin-bottom: 70px;
}
::v-deep .el-step__line {
  width: 1px !important;
}
::v-deep .el-step.is-vertical {
  flex-basis: 35% !important;
}
::v-deep .el-step__description {
  margin-bottom: 20px !important;
}
</style>
