<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView
      v-if="editableTabs.length"
      :showLineTitle="true"
      :editableTabs="editableTabs"
      :fromData="fromData"
    ></TestFormView>
    <riskAndIssueDispose :dataList="measureList" @reply="reply" @submit="submit" />
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      :params="{ projectId: this.$route.query.projectId }"
      :clickMethods="clickmethods"
      backName="everydayrisk"
    ></sr-work-flow>
  </div>
</template>

<script>
import TestFormView from "@/components/srFormView.vue";
import { api_getCustomFormTemplate, listByTopicAndItem } from "@/api/index";
import { api_getDetailById } from "@/api/projectLibrary";

import {
  api_detail,
  api_close,
  api_reply_saveOrUpdate,
  api_measure_complete,
} from "@/api/riskAndIssue";
import riskAndIssueDispose from "@/components/riskAndIssueDispose.vue";
import { moduleCode, SOURCELIST, TYPELIST } from "./const.js";
import {
  api_queryStageList,
  api_queryAllMembers,
} from "@/api/shishi/taskList.js";

import config from "@/settings.js";
import upload from "@/utils/upload";
import workflows from "@/utils/workflow";
import srtracetrack from "@/utils/srtracetrack";

export default {
  components: {
    TestFormView,
    riskAndIssueDispose,
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
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
      editableTabs: [],
      activeName: "0",
      srNavPageObj: { name: "", code: "" },
      fromData: {},
      clickmethods: { tg: this.tg },
      input: "",
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "关闭风险",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
          ],
          nodes: [],
        },
      ],
      milestoneList: [],
      riskList: [],
      projectMemberList: [],
      measureList: [],
    };
  },
  mounted() {},
  methods: {
    //回复
    reply(item) {
      if (item.content?.trim()) {
        let params = {
          measureId: item.id,
          content: item.content,
        };
        api_reply_saveOrUpdate(params).then((res) => {
          if (res.msg.code == "0000") {
            api_detail({ id: this.$route.query.id }).then((res1) => {
              if (res1.msg.code == "0000") {
                this.$message.success("回复成功！");
                this.measureList = res1.data.measureList;
              }
            });
          }
        });
      } else {
        this.$message.warning("回复内容不能为空！");
      }
    },
    //关闭措施
    submit(item) {
      if (item.id) {
        let params = {
          id: item.id,
        };
        console.log(item);
        api_measure_complete(params).then((res) => {
          if (res.msg.code == "0000") {
            api_detail({ id: this.$route.query.id }).then((res1) => {
              if (res1.msg.code == "0000") {
                this.$message.success("提交成功！");
                this.measureList = res1.data.measureList;
              }
            });
          }
        });
      }
    },
    async tg() {
      let params = {
        id: this.$route.query.id,
      };
      let res = await api_close(params);
      if (res.msg.code == "0000") {
        this.$message.success("处理成功");
        this.routeClose();

        this.$router.push({
          name: "everydayrisk",
          query: { projectId: this.$route.query.projectId },
        });
      }
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subimpl", this.$setState);
    },
    async getListByTopicAndItem() {
      // 获取风险等级
      let res = await listByTopicAndItem({ topic: "JFZG_PROJECTRISK_LEVEL" });
      let res2 = await api_queryStageList(this.$route.query.projectId);
      let res3 = await api_queryAllMembers({
        projectId: this.$route.query.projectId,
      });
      if (res?.data && res2?.data) {
        res.tracker = res.trackerName
        this.$set(this, "riskList", res.data);
        this.$set(this, "milestoneList", res2.data);
        this.$set(this, "projectMemberList", res3.data);

        this.init();
      }
    },
    async init() {
      let res = await api_detail({ id: this.$route.query.id });
      if (res?.data) {
        this.measureList = res.data.measureList;
        console.log("measureList", this.measureList);
        this.changeSelectData(res.data);
        this.getTemplate(res.data);
      }
    },
    async projectInit() {
      let res = await api_getDetailById({ id: this.$route.query.projectId });
      if (res?.data) {
        this.srNavPageObj = res.data;
      }
    },
    //  获取模板
    getTemplate(Data) {
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
        // templateId: this.templateId,
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          this.$set(item, "formArr", JSON.parse(item.formArr));

          item.formArr.forEach((item1, index) => {
            item.formArr[index].selectData.formView.data = Data;
          });
        });
      });
    },
    changeSelectData(data) {
      if (!data && typeof data !== "object") return data;
      for (const key in data) {
        if (key == "riskType") {
          data[key] = this.$utils.arrFind(TYPELIST, data[key], "value")?.label;
        } else if (key == "riskLevel") {
          data[key] = this.$utils.arrFind(
            this.riskList,
            data[key],
            "itemCode"
          )?.chName;
        } else if (key == "riskSource") {
          data[key] = this.$utils.arrFind(
            SOURCELIST,
            data[key],
            "value"
          )?.label;
        } else if (key == "milestone") {
          data[key] = this.$utils.arrFind(
            this.milestoneList,
            data[key],
            "stageId"
          )?.stageName;
        } else if (key == "liabler" || key == "tracker") {
         data[key] = data[`${key}Name`]
        }
      }
    },
  },

  created() {
    this.getListByTopicAndItem();
    this.projectInit();
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
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
  margin-bottom: 8px;
}
.tabsDataTitle {
  margin-top: 8px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
.total-page {
  ::v-deep .el-tabs__header {
    display: none;
  }
  ::v-deep .sr-view {
    padding-bottom: 8px;
  }
}
</style>
