<template>
  <div class="total-page workview">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>

    <TestFormView
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :hideTrackIcon="true"
      :slotList="['基本信息','可研信息']"
    >
      <ProjectBaseMessage
        slot="基本信息"
        :projectId="$route.query.projectId"
        @projectInit="projectInit"
      />
      <KeyanMessage slot="可研信息" :projectId="$route.query.projectId" />
    </TestFormView>
    <sr-work-flow
      v-if="buttonList.length"
      ref="work_flow"
      :taskId="taskId"
      :buttonList="buttonList"
      :backName="$route.name.includes('Audit')? 'chusheAudit' : 'chushe'"
    ></sr-work-flow>
  </div>
</template>

<script>
import TestFormView from "../../../components/srFormView";
import ProjectBaseMessage from "@/components/projectBaseMessage";
import KeyanMessage from "../components/keyanMessage";

import config from "@/settings.js";
import upload from "@/utils/upload";
import store from "@/store";
import workflows from "@/utils/workflow";
import { api_cs_getDetailById } from "@/api/chushe";

import { api_activititodo, api_getCustomFormTemplate } from "@/api/index";
import srtracetrack from "@/utils/srtracetrack";
import { moduleCode } from "../const.js";

export default {
  components: {
    TestFormView,
    ProjectBaseMessage,
    KeyanMessage,
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
      srNavPageObj: { name: "", code: "" },
      editableTabs: [],
      activeName: "0",
      userInfo: store.getters.userInfo,
      fromData: {},
      taskId: "",
      buttonList: [],
    };
  },

  methods: {
    projectInit(res) {
      this.srNavPageObj = res;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    async init() {
      let res = await api_cs_getDetailById({ id: this.$route.query.id });
      if (res?.data) {
        res.data.applyFile = JSON.parse(res.data.applyFile);
        res.data.researchFile = JSON.parse(res.data.researchFile);
        res.data.otherFile = JSON.parse(res.data.otherFile);
        res.data.designer = res.data.designerName;
        res.data.designUnits = res.data.designUnitsName;

        this.getTemplate(res.data);
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
      });
    },
  },
  created() {
    this.init();
    this.buttonInit();
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