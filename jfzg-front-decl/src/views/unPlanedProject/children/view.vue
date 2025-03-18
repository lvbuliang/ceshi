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
      :backName="$route.name.includes('Audit') ? 'unPlanedProjectAudit' : 'unPlanedProject'"
    ></WorkFlow>
  </div>
</template>

<script>
import TestFormView from "../../../components/srFormView.vue";
import WorkFlow from "@/components/SrWorkFlow";
import { api_getCustomFormTemplate } from "@/api/index";
import { api_getlist_view } from "@/api/shenbao/index";
import { moduleCode } from "../const.js";
import ProjectBaseMessage from "@/components/projectBaseMessage";

export default {
  components: {
    TestFormView,
    WorkFlow,
    ProjectBaseMessage,
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
  provide() {
    return {
      baseUrl: "",
      imgBaseUrl: "",
      uploadRequest: "",
      uploadBaseUrl: "",
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
    projectInit(res) {
      this.srNavPageObj = res;
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },

  created() {
    api_getlist_view({ id: this.$route.query.id }).then((res) => {
      if (res.data.file) {
        res.data.file = JSON.parse(res.data.file);
      }
      if (res.data.projectNature) {
        res.data.projectNature = res.data.projectNatureName;
      }
      if (res.data.capitalSource) {
        res.data.capitalSource = res.data.capitalSourceName;
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