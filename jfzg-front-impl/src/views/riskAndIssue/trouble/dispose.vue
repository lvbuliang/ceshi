<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView
      v-if="editableTabs.length"
      :showLineTitle="true"
      :editableTabs="editableTabs"
      :fromData="fromData"
    ></TestFormView>
    <riskAndIssueDispose
      :projectProblemOperationVo="projectProblemOperationVo"
      :dataList="measureList"
      @reply="reply"
      @submit="submit"
    />
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      :params="{ projectId: this.$route.query.projectId }"
      :clickMethods="clickmethods"
      backName="everydaytrouble"
    ></sr-work-flow>
  </div>
</template>

<script>
import riskAndIssueDispose from "@/components/riskAndIssueDispose.vue";
import TestFormView from "@/components/srFormView.vue";
import { api_getCustomFormTemplate, listByTopicAndItem } from "@/api/index";
import { api_getDetailById } from "@/api/projectLibrary";
import {
  api_getMeasureListById,
  api_closeProblmeurl,
  api_insertReply,
  api_submitReply,
  api_getSee,
} from "@/api/riskAndIssue";
import {
  api_queryStageList,
  api_queryAllMembers,
} from "@/api/shishi/taskList.js";
import { moduleCode, SOURCELIST, TYPELIST } from "./const.js";
import config from "@/settings.js";
import upload from "@/utils/upload";
import workflows from "@/utils/workflow";
import srtracetrack from "@/utils/srtracetrack";
export default {
  components: {
    TestFormView,
    riskAndIssueDispose,
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
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
  data() {
    return {
      editableTabs: [],
      measureList: [],
      activeName: "0",
      clickmethods: { tg: this.tg },
      srNavPageObj: { name: "", code: "" },
      fromData: {},
      projectProblemOperationVo: {},
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
          showForm: false,
        },
      ],
      milestoneList: [],
      riskList: [],
      projectMemberList: [],
      measureList: [],
    };
  },

  methods: {
    async getListByTopicAndItem() {
      // 获取风险等级
      let res = await listByTopicAndItem({ topic: "JFZG_PROJECTRISK_LEVEL" });
      let res2 = await api_queryStageList(this.$route.query.projectId);
      let res3 = await api_queryAllMembers({
        projectId: this.$route.query.projectId,
      });
      if (res?.data && res2?.data) {
        this.$set(this, "riskList", res.data);
        this.$set(this, "milestoneList", res2.data);
        this.$set(this, "projectMemberList", res3.data);

        this.init();
      }
    },
    //回复
    reply(item) {
      if (item.content?.trim()) {
        let params = {
          isDraft: false,
          measureId: item.id,
          content: item.content,
        };
        api_insertReply(params).then((res) => {
          if (res.msg.code == "0000") {
            api_getMeasureListById({ id: this.$route.query.id }).then(
              (res1) => {
                if (res1.msg.code == "0000") {
                  this.$message.success("回复成功！");
                  this.measureList = res1.data.map((item) => {
                    if (!item.replyList) {
                      if (item.replys) {
                        item.replyList = [...item.replys];
                      }
                    }
                    if (item.status == 1) {
                      item.statusName = "未完成";
                    } else if (item.status == 2) {
                      item.statusName = "已处理";
                    }
                    return item;
                  });
                }
              }
            );
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
        api_submitReply(params).then((res) => {
          if (res.msg.code == "0000") {
            api_getMeasureListById({ id: this.$route.query.id }).then(
              (res1) => {
                if (res1.msg.code == "0000") {
                  this.$message.success("提交成功！");
                  this.measureList = res1.data.map((item) => {
                    if (!item.replyList) {
                      if (item.replys) {
                        item.replyList = [...item.replys];
                      }
                    }
                    if (item.status == 1) {
                      item.statusName = "未完成";
                    } else if (item.status == 2) {
                      item.statusName = "已处理";
                    }
                    return item;
                  });
                }
              }
            );
          }
        });
      }
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subimpl", this.$setState);
    },
    async tg() {
      let res = await api_closeProblmeurl({ id: this.$route.query.id });
      if (res.msg.code == "0000") {
        this.routeClose();

        this.$router.push({
          name: "everydaytrouble",
          query: { projectId: this.$route.query.projectId },
        });
      }
    },
    async init() {
      let res = await api_getMeasureListById({ id: this.$route.query.id });
      let res2 = await api_getSee({ id: this.$route.query.id });

      if (res?.data) {
        res.tracker = res.trackerName
        this.measureList = res.data.map((item) => {
          if (!item.replyList) {
            if (item.replys) {
              item.replyList = [...item.replys];
            }
          }
          if (item.status == 1) {
            item.statusName = "未完成";
          } else if (item.status == 2) {
            item.statusName = "已处理";
          }
          return item;
        });
      }
      if (res2?.data) {
        this.projectProblemOperationVo = res2.data.projectProblemOperationVo;
        console.log(this.projectProblemOperationVo);
        if (this.projectProblemOperationVo.canClose) {
          this.buttonList = [
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
              showForm: false,
            },
          ];
        } else {
          this.buttonList = [
            {
              showForm: false,
            },
          ];
        }
        this.changeSelectData(res2.data);
        this.getTemplate(res2.data);
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
        if (key == "problemType") {
          data[key] = this.$utils.arrFind(TYPELIST, data[key], "value")?.label;
        } else if (key == "problemLevel") {
          data[key] = this.$utils.arrFind(
            this.riskList,
            data[key],
            "itemCode"
          )?.chName;
        } else if (key == "problemSource") {
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
