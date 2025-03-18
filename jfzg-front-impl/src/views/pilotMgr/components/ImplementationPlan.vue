<template>
  <div class="ImplementationPlan">
    <SrView :formData="config" :ruleForm="formViewData"></SrView>
  </div>
</template>

<script>
import { api_getCustomFormTemplate } from "@/api/index";
import config from "@/settings.js";
import upload from "@/utils/upload";
export default {
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
      config: [],
      formViewData: {},
    };
  },
  mounted() {},
  methods: {
    async init(moduleCode, data) {
      let res1 = await api_getCustomFormTemplate({
        moduleCode,
      });
      if (!res1.data || !res1.msg.code != "0000") return;
      let editableTabs = JSON.parse(res1.data.templateDetail);
      let formArr = [];
      if (editableTabs && editableTabs.length) {
        formArr = JSON.parse(editableTabs[0].formArr);
      }
      if (formArr.length) {
        this.config = formArr[0].selectData.formView.config.map(item=>{
          item.span = 8
          return item
        });
      }
      if (data) {
        data.constructionUnit = data.constructUnitFullName; //建设单位
        data.constructor1 = data.constructFullName; //建设单位负责人
        data.contractUnit = data.contractUnitFullName; //承建单位
        data.contractor = data.contractFullName; //承建单位负责人
        data.controlUnit = data.controlUnitFullName; //监理单位
        data.controlJfid = data.controlFullName; //监理单位负责人
        this.$set(this,'formViewData',data)
      }
    },
  },
};
</script>

<style></style>
