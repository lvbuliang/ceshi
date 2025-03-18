<template>
  <div class="applicationInformation">
    <SrAdd
      v-if="typeName == 'edit'"
      :config="form.config"
      :otherConfig="otherConfig"
      :enums="form.enums"
      :form="form.data"
      :ref="`form`"
    ></SrAdd>
    <SrView
      v-else-if="typeName == 'view'"
      :formData="formView.config"
      :ruleForm="formDatas"
    >
    </SrView>
  </div>
</template>

<script>
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { api_getCustomFormTemplate } from "@/api/index.js";
export default {
  name: "applicationInformation",
  props: {
    typeName: {
      type: String,
      default() {
        return "edit";
      },
    },
    moduleCode: [Number, String],
    formDatas: {
      type: Object,
      default() {
        return {};
      },
    },
    details: {
      type: Object,
      default() {
        return {};
      },
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  watch: {
    formDatas: {
      handler: function (params) {
        if (params != "") {
          let obj = JSON.parse(JSON.stringify(params));
          if (obj) {
            this.$set(this.form, "data", obj);
            this.$set(this.formView, "data", obj);
          }
        }
      },
      deep: true,
      immediate: true,
    },
    moduleCode: {
      handler: function (params) {
        if (params) {
          this.getCustomFormTemplate(this.moduleCode);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      templateId: "",
      otherConfig: {
        labelNum: 160,
      },
      formDataShow: false,
      form: {
        config: [],
        data: {},
        enums: {},
      },
      formView: {
        config: [],
        data: {},
      },
    };
  },
  mounted() {
    this.getCustomFormTemplate(this.moduleCode);
  },
  methods: {
    getCustom() {
      this.getCustomFormTemplate(this.moduleCode);
    },
    //自定义表单获取
    getCustomFormTemplate(moduleCode) {
      let params = {
        moduleCode,
      };
      api_getCustomFormTemplate(params).then((res) => {
        if (res.msg.code == "0000") {
          let list = res.data.templateDetail
            ? JSON.parse(res.data.templateDetail)
            : [];
          if (list.length > 0) {
            this.form = JSON.parse(list[0].formArr)[0].selectData.formAdd;
            this.formView = JSON.parse(list[0].formArr)[0].selectData.formView;
          }
          this.form.data=this.formDatas
          this.templateId = res.data.id;
          this.$emit("getTemplateId", this.templateId);
          this.chuli()
        }
      });
    },
    getForm() {
      return this.$refs["form"] && this.$refs["form"].validate();
    },
    chuli() {
      for (let k = 0; k < this.form.config.length; k++) {
        if (this.form.config[k].bind === "endTime") {
          this.form.config[k]["picker-options"] = {
            disabledDate: (time) => {
              if (this.form.data.startTime) {
                return (
                  time.getTime() <
                  new Date(this.form.data.startTime).getTime()
                ); //如果没有后面的-8.64e7就是不可以选择今天的
              }
            },
          };
        }
        if (this.form.config[k].bind === "startTime") {
          this.form.config[k]["picker-options"] = {
            disabledDate: (time) => {
              if (this.form.data.endTime) {
                return (
                  time.getTime() >
                  new Date(this.form.data.endTime).getTime()
                ); //如果没有后面的-8.64e7就是不可以选择今天的
              }
            },
          };
        }
      }
    },
  },
};
</script>

<style></style>
