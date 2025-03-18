<template>
  <section class="keyanMessage">
    <TestFormView
      v-if="editableTabs.length"
      :hideTrackIcon="true"
      :editableTabs="editableTabs"
      :fromData="fromData"
    ></TestFormView>
    <Empty v-else height="400px" />
  </section>
</template>
<script>
import TestFormView from "@/components/srFormView.vue";
import Empty from "@/components/empty.vue";
import { moduleCode } from "@/views/keyan/const.js";
import { api_getCustomFormTemplate } from "@/api/index";
import { api_ky_getByProjectId } from "@/api/keyan";

export default {
  components: {
    TestFormView,
    Empty,
  },
  props: {
    projectId: [String, Number], // 项目id
    templateId: [String, Number], // 模板id
  },
  watch: {
    projectId(val) {
      if (val) {
        this.init(val);
      }
    },
  },
  mounted() {
    if (this.projectId) {
      this.init(this.projectId);
    }
  },
  data() {
    return {
      editableTabs: [],
      fromData: {},
    };
  },
  methods: {
    async init(projectId) {
      let res = await api_ky_getByProjectId({ projectId });
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
          if (item.title) {
            delete item.title;
          }
          this.$set(item, "formArr", JSON.parse(item.formArr));

          item.formArr.forEach((item1, index) => {
            item.formArr[index].selectData.formView.data = Data;
          });
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.keyanMessage {
  ::v-deep .el-tabs__header {
    display: none;
  }
  ::v-deep .el-tabs__content {
    padding: 0;
  }
  ::v-deep .empty {
    width: 100%;
    height: 236px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
