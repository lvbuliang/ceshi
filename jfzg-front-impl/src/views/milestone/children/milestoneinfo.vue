<template>
  <div class="milestoneinfo">
    <div class="title">
      <img style="width: 22px; height: 22px; margin-right: 5px" :src="imgUrl" alt="" />
      <span class="left"> 当前提交里程碑</span>
    </div>
    <div class="box_list">
      <div class="line"></div>
      <Milestonelist :hideSearchBtn="true" :tableData="tableData" />
    </div>

    <!-- <div class="title">
      <span class="left"> 里程碑</span>
    </div>
    <div class="box_list">
      <div class="line"></div>
      <Milestonelist :hideSearchBtn="true" />
    </div> -->
    <div class="title">
      <img style="width: 22px; height: 22px; margin-right: 5px" :src="imgUrl" alt="" />
      <span class="left"> 自查说明</span>
    </div>
    <div class="box_list">
      <div class="line"></div>
      <SrAdd
        v-if="$route.name == 'milestoneEdit'"
        :config="formAdd.config"
        :enums="formAdd.enums"
        :form="formAdd.data"
        ref="add"
      ></SrAdd>
      <SrView
        v-if="$route.name == 'milestoneView' || $route.name == 'milestoneReport'"
        :formData="formView.config"
        :ruleForm="formView.data"
      ></SrView>
    </div>
  </div>
</template>

<script>
import { api_getCustomFormTemplate } from "@/api/index";
import store from "@/store";
import { api_userSetQuery, api_userSetSave, api_userSetExport } from "@/api/index.js";
import { permissionCode, milestonepermissionCode } from "../const.js";
import { api_milestoneList } from "@/api/milestone/index";
import config from "@/settings.js";
import Milestonelist from "./milestonelist";
export default {
  components: {
    Milestonelist,
  },
  data() {
    return {
      imgUrl: require("@/assets/title_lg.png"),
      loading: false,
      userInfo: store.getters.userInfo,
      formAdd: {
        config: [],
        enums: {},
        data: {},
      },
      formView: {
        config: [],
        data: {},
      },
    };
  },
  props: {
    AddFormData: {
      type: Object,
      default() {
        return {};
      },
    },
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    AddFormData: {
      handler(val) {
        if (val) {
          this.$set(this.formAdd, "data", this.AddFormData);
          this.$set(this.formView, "data", this.AddFormData);
        }
      },
      deep: true, //true 深度监听
    },
    // tableData: {
    //   handler(val) {
    //     if (val.length > 0) {
    //       this.$set(this.formAdd, "data", this.AddFormData);
    //       this.$set(this.formView, "data", this.AddFormData);
    //     }
    //   },
    //   deep: true, //true 深度监听
    // },
  },
  mounted() {
    this.getTemplateData();
    if (this.AddFormData) {
      this.$set(this.formAdd, "data", this.AddFormData);
      this.$set(this.formView, "data", this.AddFormData);
    }
  },
  methods: {
    // 获取模板数据
    getTemplateData() {
      api_getCustomFormTemplate({
        moduleCode: "14001",
        // templateId: this.templateId,
      }).then((res) => {
        console.log(
          "JSON.parse(res.data.templateDetail)",
          JSON.parse(JSON.parse(res.data.templateDetail)[0].formArr)[0].selectData
        );
        this.$set(
          this.formAdd,
          "config",
          JSON.parse(JSON.parse(res.data.templateDetail)[0].formArr)[0].selectData.formAdd
            .config
        );
        this.$set(
          this.formView,
          "config",
          JSON.parse(JSON.parse(res.data.templateDetail)[0].formArr)[0].selectData
            .formView.config
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.milestoneinfo {
  .title {
    margin: 16px 0 8px 0;
    display: flex;
    align-items: center;
    .left {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
  }
  .box_list {
    display: -webkit-box;
    .line {
      border-left: 1px dotted #cccccc;
      margin: 0 16px 0 10px;
    }
    .total-page {
      width: 98.5%;
    }
    .basicInfo {
      margin-top: 0 !important;
      width: 98.5%;
    }
  }
}
</style>
