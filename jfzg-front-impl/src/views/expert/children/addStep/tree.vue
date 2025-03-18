<template>
  <div>
    <SrAdd
      :config="form.config"
      :form="form.data"
      :otherConfig="otherConfig"
      :enums="form.enums"
      ref="step_tree"
      class="expert_add_step"
    >
      <template slot="qita"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        其他信息</template
      >
    </SrAdd>
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
      uploadFileUrl: config.uploadFileUrl,
      previewUrl: config.previewUrl,
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
  watch: {
    detailedParams: {
      handler(val) {
        if (this.$route.query.id) {
          this.$set(this.form, "data", val);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      otherConfig: {
        labelNum: 190,
      },
      form: {
        config: [
          {
            type: "airBox", //占位空格
            col: 24,
            id: "qita",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "textarea",
            name: "其他",
            placeholder: "请输入其他信息",
            bind: "other",
            col: 24,
            maxLength: 30,
            rules: {
              maxLength_30: "请输入30个字符以内的内容",
            },
          },
          {
            type: "upload",
            name: "附件",
            bind: "file",
            fileList: [],
            col: 24,
            limit: 10,
          },
        ],
        data: {
          other: "",
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
