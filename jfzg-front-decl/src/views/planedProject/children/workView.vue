<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>

    <TestFormView
      v-if="editableTabs.length"
      :hideTrackIcon="true"
      :editableTabs="editableTabs"
      :fromData="fromData"
      :slotList="['基本信息']"
    >
      <ProjectBaseMessage
        slot="基本信息"
        :projectId="$route.query.projectId"
        @projectInit="projectInit"
      />
    </TestFormView>

    <WorkFlow
      v-if="buttonList.length"
      ref="work_flow"
      :taskId="taskId"
      :buttonList="buttonList"
      :backName="$route.name.includes('Audit') ? 'planedProjectAudit' : 'planedProject'"
    ></WorkFlow>
  </div>
</template>

<script>
import ProjectBaseMessage from "@/components/projectBaseMessage";
import TestFormView from "../../../components/srFormView.vue";
import WorkFlow from "../../../components/SrWorkFlow";
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
import { api_getlist_in_view } from "@/api/shenbao/index";
import { moduleCode } from "../const.js";

export default {
  components: {
    TestFormView,
    WorkFlow,
    ProjectBaseMessage
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
      srNavPageObj: {},
      fromData: {},
      buttonList: [],
      userInfo: store.getters.userInfo,
    };
  },

  methods: {
    handleClick(tab, event) {
    },
    projectInit(res) {
      this.srNavPageObj = res;
    },
    getinfo() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;

      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.$route.query.processId,
      };

      api_activititodo(param).then((res) => {
        let assignee = res.data[0].assignee;
          this.buttonList = [res.data[0].curDesc].filter((item) => {
            //按钮筛选  以assignee优先roleCode
            item.assignee = assignee;
            if (assignee == jfid) {
              return true;
            } else if (roleCode == item.role) {
              return true;
            }
          });
        this.taskId = res.data[0].taskId;
        console.log(this.buttonList, "buttonList");
      });
    },
  },

  created() {
    api_getlist_in_view({ id: this.$route.query.id }).then((res) => {
      if (res.data.file) {
        res.data.file = JSON.parse(res.data.file);
      }
      if (res.data.projectNature) {
        res.data.projectNature = res.data.projectNatureName;
      }
      if (res.data.capitalSource) {
        res.data.capitalSource = res.data.capitalSourceName;
      }
      if (res.data.planName) {
        res.data.yearPlanId = res.data.planName;
      }

      let data = res.data.data;
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
        templateId: this.templateId,
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          item.formArr = JSON.parse(item.formArr);
          item.formArr[0].selectData.formView.data = res.data;
          if (data) {
            JSON.parse(data).forEach((item1, index) => {
              item.formArr[index + 1].selectData.formView.data = item1;
            });
          }
        });
      });
    });
    this.getinfo();
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
.total-page {
  background-color: #fff;
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
</style>