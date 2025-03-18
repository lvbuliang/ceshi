<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView
      v-if="editableTabs.length"
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
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      :backName="$route.name.includes('Audit') ? 'projectChangeAudit' : 'projectChange'"
    ></WorkFlow>
  </div>
</template>

<script>
import ProjectBaseMessage from "@/components/projectBaseMessage";
// import srNavPage from "./../../../components/srNavPage.vue";
import TestFormView from "../../../components/srFormView.vue";
import WorkFlow from "../../../components/workflow";
import { api_getCustomFormTemplate } from "@/api/index";
import { api_getlist_in_view } from "@/api/shenbao/index";
import { moduleCode } from "../const.js";
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";
import {api_getbiangengDetailById} from "@/api/biangeng/index";
import {api_getDetailById} from "@/api/projectLibrary/index";
export default {
  components: {
    TestFormView,
    WorkFlow,
    // srNavPage,
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
      srNavPageObj: {},
      fromData: {},
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
    };
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    projectInit(res) {
      this.srNavPageObj = res;
    },
    async init() {
      let res = await api_getbiangengDetailById({ id: this.$route.query.id })
      let oteherRes = await api_getDetailById({id:this.$route.query.projectId})
      res.data.SupplyerName = res.data.cjdwName
      res.data.supervisorName_1 = res.data.cldwName
      res.data.supervisorName = res.data.changeJldwName //变更后监理单位
      res.data.supervisorLeader = res.data.changeJldwLeaderName //变更后监理单位负责人
      res.data.changeSupplyerName = res.data.changeCjdwName //变更后建设单位
      res.data.supplyerLeader = res.data.changeCjdwLeaderName //变更后建设单位负责人
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
    }
  },

  created() {
    this.init()
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