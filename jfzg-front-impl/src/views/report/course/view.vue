<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView v-if="editableTabs.length" :editableTabs="editableTabs" :fromData="fromData"></TestFormView>
    <sr-work-flow ref="work_flow" :hideFrom="true" :buttonList="buttonList" backName="course"></sr-work-flow>
  </div>
</template>

<script>
import TestFormView from "@/components/srFormView.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import { api_detail } from "@/api/course";
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
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
      editableTabs: [],
      activeName: "0",
      srNavPageObj: { name: "", code: "" },
      fromData: {},
    };
  },

  methods: {
    async init() {
      let res = await api_detail({ id: this.$route.query.id });

      if (res?.data) {
        this.srNavPageObj = res.data;
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
</style>
