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
      :backName="$route.name.includes('Audit') ? 'beianAuditList' : 'beianList'"
    ></WorkFlow>
  </div>
</template>

<script>
import TestFormView from "@/components/srFormView.vue";
import WorkFlow from "@/components/SrWorkFlow";
import { api_getCustomFormTemplate } from "@/api/index";
import { saveBeian, submitBeian, queryBeianDetail } from "@/api/beian/index";
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
      srNavPageObj: { name: "", code: "" },
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
    async init() {
      let res = await queryBeianDetail({ id: this.$route.query.id });
      if (res?.data) {
        let Data = res.data;
        if (Data.constructionPlanFile && Data.constructionPlanFile.length > 0) {
          Data.constructionPlanFile = JSON.parse(Data.constructionPlanFile);
        }
        if (Data.contractFile && Data.contractFile.length > 0) {
          Data.contractFile = JSON.parse(Data.contractFile);
        }
        if (Data.otherFile && Data.otherFile.length > 0) {
          Data.otherFile = JSON.parse(Data.otherFile);
        }
        // if (Data.constructionUnit) {
        //   Data.constructionUnit = Data.constructionUnitName
        //   this.$set(Data,"constructionUnit",Data.constructionUnitName)
        // }

        this.getTemplate(Data);
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
            this.$set(
              item1.selectData.formView.config[0],
              "value",
              "responsibilityUnitName"
            );
            item.formArr[index].selectData.formView.data = Data;
          });
        });
      });
    },
  },

  created() {
    this.init();
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
