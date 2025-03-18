<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :fromData="fromData"
    ></TestFormView>
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      backName="submit"
    ></sr-work-flow>
  </div>
</template>

<script>
import TestFormView from "@/components/srFormView.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import { api_getProjectRPById, api_getMilestoneList } from "@/api/submit";
import { api_getDetailById } from "@/api/projectLibrary";

import { moduleCode } from "./const.js";

export default {
  components: {
    TestFormView,
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
      projectStageList: [], //项目所处阶段
    };
  },

  methods: {
    getProjectStageList() {
      api_getMilestoneList(this.$route.query.projectId).then((res) => {
        console.log("res", res);
        this.projectStageList = res.data.map(({ stageName, stageId }) => {
          return {
            dataName: String(stageName),
            dataValue: String(stageId),
          };
        });
        console.log("this.projectStageList", this.projectStageList);
      });
    },
    async projectInit() {
      let res = await api_getDetailById({ id: this.$route.query.projectId });
      if (res?.data) {
        this.srNavPageObj = res.data;
      }
    },
    async init() {
      let res = await api_getProjectRPById({ id: this.$route.query.id });
      if (res?.data) {
        res.data.projectStatus = res.data.statusName;
        res.data.constructionCycle =
          (res.data.reportingPeriodStart || "-") +
          "至" +
          (res.data.reportingPeriodEnd || "-");
        let result = this.projectStageList.find(
          (item) => item.dataValue == res.data.projectStage
        );
        console.log(result);
        if (result) {
          res.data.projectStage = result.dataName;
        }
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
        console.log(this.editableTabs);
      });
    },
  },

  created() {
    this.getProjectStageList();
    this.init();
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
  // ::v-deep .el-tabs__header {
  //   display: none;
  // }
  ::v-deep .sr-view {
    padding-bottom: 8px;
  }
}
</style>
