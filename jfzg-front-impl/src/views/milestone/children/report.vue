<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TabFormView
      :fromData="fromData"
      :activeNameT="`里程碑审查汇报`"
      :editableTabs="editableTabs"
      :hideTrackIcon="$route.name == 'milestoneReport'"
      :slotList="[
        '基本信息',
        '交付物完成情况',
        '任务完成情况',
        '风险和问题',
        '里程碑审查汇报',
      ]"
    >
      <ProjectBaseMessage
        slot="基本信息"
        ref="ProjectBaseMessage"
        :projectId="$route.query.projectId"
        @projectInit="projectInit"
        :needImplementationPlan="true"
      />
      <Deliverable slot="交付物完成情况" />
      <Task slot="任务完成情况" />
      <Riskandquestion slot="风险和问题" />
      <Milestoneinfo
        :AddFormData="AddFormData"
        :tableData="tableData"
        ref="Milestoneinfo"
        slot="里程碑审查汇报"
      />
    </TabFormView>
    <!-- 审查 -->
    <WorkFlow
      v-if="buttonList.length > 0 && $route.name != 'milestoneView'"
      ref="work_flow"
      :taskId="taskId"
      :hideFrom="true"
      :buttonList="buttonList"
      :params="{ projectId: $route.query.projectId }"
      backName="milestoneList"
    ></WorkFlow>
    <!-- 提交 -->
    <WorkFlow
      v-if="$route.name == 'milestoneEdit' || $route.name == 'milestoneView'"
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="$route.name == 'milestoneView' ? buttonListBack : buttonListEdit"
      :params="{ projectId: $route.query.projectId }"
      backName="milestoneList"
      ref="work_flow"
    ></WorkFlow>
  </div>
</template>

<script>
import TabFormView from "@/components/srFormView";
import ImplementationPlan from "./ImplementationPlan";
import WorkFlow from "@/components/SrWorkFlow";
// import { api_getCustomFormTemplate } from "@/api/index";
import {
  api_saveOrUpdate,
  api_draft,
  api_detail,
  getActiveMilestone,
} from "@/api/milestone/index";
import { moduleCode } from "../const.js";
import ProjectBaseMessage from "@/views/pilotMgr/components/essentialInformation";
import Deliverable from "./deliverable.vue";
import Task from "./task.vue";
import Riskandquestion from "./riskandquestion.vue";
import Milestoneinfo from "./milestoneinfo.vue";
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";
import {
  api_specialDetail,
  api_activititodo,
  api_getCustomFormTemplate,
  api_workFlowImage,
} from "@/api/index";
export default {
  components: {
    TabFormView,
    WorkFlow,
    ProjectBaseMessage,
    Deliverable,
    Task,
    Riskandquestion,
    Milestoneinfo,
    ImplementationPlan,
  },
  computed: {
    // templateId() {
    //   return this.$route.query.templateId;
    // },
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
      tableData: [],
      activeName: "里程碑审查汇报",
      srNavPageObj: { name: "", code: "" },
      fromData: {},
      AddFormData: {},
      userInfo: store.getters.userInfo,
      buttonList: [],
      buttonListEdit: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
              btnValue: "tg",
              btnType: "default",
              btnEventType: "tg",
            },
            {
              btnValue: "btg",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "btg",
            },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      buttonListBack: [
        {
          role: "",
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      taskId: null,
      clickmethods: { tg: this.tg, btg: this.btg },
      templateId: null,
    };
  },
  created() {
    if (this.$route.query.processId) {
      this.getWorkFlow();
    }

    this.getTemplate();
    if (this.$route.query.stageId) {
      this.getActiveMilestone();
    }
  },
  methods: {
    // 提交
    tg() {
      let data = this.$refs["Milestoneinfo"].formAdd.data;
      this.$refs["Milestoneinfo"].$refs["add"].validate((valid) => {
        if(valid){
          data.status = "2";
          data.reviewFile = JSON.stringify(data.reviewFile);
          data.projectId = this.$route.query.projectId;
          data.stageId = this.$route.query.stageId;

          data.templateId = this.templateId;
          if (this.$route.query.id) {
            data.id = this.$route.query.id;
          }
          api_saveOrUpdate(data).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("提交成功");
              // clearInterval(this.timer);
              // if (this.isNew == true) {
              //   this.get_success = true;
              // } else {
              this.$router.push({
                name: "milestoneList",
                query: {
                  projectId: this.$route.query.projectId,
                  // templateId: row.templateId,
                },
              });
              // }
            }
          });
          }
      });
    },
    // 保存
    btg() {
      let data = this.$refs["Milestoneinfo"].formAdd.data;
      console.log(data);
      data.status = "1";
      data.reviewFile = JSON.stringify(data.reviewFile);
      data.projectId = this.$route.query.projectId;
      data.stageId = this.$route.query.stageId;
      data.templateId = this.templateId;
      if (this.$route.query.id) {
        data.id = this.$route.query.id;
      }
      api_saveOrUpdate(data).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("提交成功");
          // clearInterval(this.timer);
          // if (this.isNew == true) {
          //   this.get_success = true;
          // } else {
          this.$router.push({
            name: "milestoneList",
            query: {
              projectId: this.$route.query.projectId,
              // templateId: row.templateId,
            },
          });
          // }
        }
      });
    },
    projectInit(res) {
      this.srNavPageObj = res;
      this.$refs["ProjectBaseMessage"].$refs["ImplementationPlan"].init("17001", res);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    async init() {
      let res = await api_detail({ id: this.$route.query.id });
      if (res?.data) {
        console.log("详情信息", res.data);
        if (res.data.reviewFile && res.data.reviewFile.length > 0) {
          res.data.reviewFile = JSON.parse(res.data.reviewFile);
        }
        this.$set(this, "AddFormData", res.data);
        // this.getTemplate(res.data);
      }
    },
    // 获取当前提交里程碑
    getActiveMilestone() {
      getActiveMilestone({
        id: this.$route.query.stageId,
      }).then((res) => {
        console.log("当前提交里程碑", res.data);
        res.data.num = 1;
        this.tableData = [res.data];
      });
    },
    //  获取模板
    getTemplate() {
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.templateId = res1.data.id;
        if (this.$route.query.id) {
          this.init();
        }
        // this.editableTabs.forEach((item) => {
        //   this.$set(item, "formArr", JSON.parse(item.formArr));
        //   item.formArr.forEach((item1, index) => {
        //     item.formArr[index].selectData.formView.data = Data;
        //   });
        // });
      });
    },
    // 获取工作流
    getWorkFlow() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;
      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.$route.query.processId,
      };
      api_activititodo(param).then((res) => {
        console.log("RES", res.data);
        if (res.data.length > 0) {
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
        }
      });
    },
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
.sr-view {
  padding: 8px 0;
}
::v-deep .el-tabs {
  .el-tabs__header {
    margin-bottom: 0 !important;
    .el-tabs__nav {
      .el-tabs__item {
        span {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
    }
  }
  .el-tabs__content {
    padding: 0 !important;
    .sr_table {
      .el-table__fixed-right {
        height: 100% !important;
      }
    }
    .tabsDataTitle {
      display: none !important;
    }
    .basicInfo {
      margin-top: 16px;
    }
  }
}
</style>
