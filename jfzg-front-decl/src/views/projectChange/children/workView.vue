<template>
  <div class="total-page">
    <srNavPage :project="srNavPageObj" :tags="[]"></srNavPage>
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
      :backName="
        $route.name.includes('Audit') ? 'projectChangeAudit' : 'projectChange'
      "
    ></WorkFlow>
  </div>
</template>

<script>
import ProjectBaseMessage from "@/components/projectBaseMessage";
import srNavPage from "./../../../components/srNavPage.vue";
import TestFormView from "../../../components/srFormView.vue";
// import WorkFlow from "../../../components/SrWorkFlow";
import WorkFlow from "../components/workflow";
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
import { api_getDetailById } from "@/api/projectLibrary/index";
import { api_getlist_in_view } from "@/api/shenbao/index";
import { moduleCode } from "../const.js";
import { api_getbiangengDetailById } from "@/api/biangeng/index";
export default {
  components: {
    TestFormView,
    WorkFlow,
    srNavPage,
    ProjectBaseMessage,
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
      srNavPageObj: {
        projectNo: "",
        matterName: "",
      },
      fromData: {},
      buttonList: [],
      userInfo: store.getters.userInfo,
    };
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    projectInit(res) {
      this.$set(this.srNavPageObj, "projectNo", res.projectCode);
      this.$set(this.srNavPageObj, "matterName", res.projectName);
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
        if (res.data[0]) {
          let assignee = res.data[0]?.assignee;
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
        }
      });
    },
    // 获取项目基本信息
    async init(resData) {
      let oteherRes = await api_getDetailById({
        id: this.$route.query.projectId,
      });
      this.$set(resData, "SupplyerName", oteherRes.data.contractUnitFullName);
      this.$set(
        resData,
        "supervisorName_1",
        oteherRes.data.controlUnitFullName
      );
    },
  },

  created() {
    api_getbiangengDetailById({ id: this.$route.query.id }).then((res) => {
      this.init(res.data);
      res.data.supervisorName = res.data.changeJldwName; //变更后监理单位
      res.data.supervisorLeader = res.data.changeJldwLeaderName; //变更后监理单位负责人
      res.data.changeSupplyerName = res.data.changeCjdwName; //变更后建设单位
      res.data.supplyerLeader = res.data.changeCjdwLeaderName; //变更后建设单位负责人
      if (res.data.file) {
        res.data.file = JSON.parse(res.data.file);
      }
      if (res.data.projectNature) {
        res.data.projectNature = res.data.projectNatureName;
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
          this.$set(item.formArr[0].selectData.formView, "data", res.data);
          this.srNavPageObj.name = res.data.name;
          this.srNavPageObj.code = res.data.code;
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
