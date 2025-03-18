<template>
  <div>
    <el-timeline class="sr_time_line">
      <el-timeline-item >
        <slot>
          <div class="sr_time_line_title"><img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />其他信息</div>
          <SrView :formData="form.config" :ruleForm="detailedParams"> </SrView>
        </slot>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<!--
  功能：form表单新增
  汪振涛
  时间：2020年11月18日 11:40:41
  版本：v1.0
-->
<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
export default {
  name: "FormAdd",
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  components: {},
  props: {
    detailedParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        config: [
          {
            value: "other",
            label: "其他",
            span: 8,
            type: "value",
          },
          {
            value: "file",
            label: "附件",
            span: 24,
            type: "uploader",
            colNum: 3, // 一行几个附件
            maxFeild: 15, // 单个附件显示几个字
            showIcon: true,
            showExpand: true, // 是否需要展开收起功能
            labelWidth: 249,
          },
        ],
        data: {
          textarea: "",
          file: [],
        },
        enums: {},
      },
    };
  },
  methods: {
    //校验
    verification() {
      let flag = this.$refs.step_tree.validate();
      if (flag) {
        return flag;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped >
</style>
