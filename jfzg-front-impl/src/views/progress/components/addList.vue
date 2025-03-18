<template>
  <div class="pageBox addListBox">
    <div class="mgb30">
      <CTitle :title="title"></CTitle>
    </div>
    <TestFormAdd
      ref="modelAuInfo"
      :config="form.config"
      :form="form.data"
      :rules="form.rules"
      :enums="form.enums"
      refForm="modelAuInfoForm"
      :column="1"
    />
    <div class="qeBox">
      <span class="qeTitle">内容：</span>
      <demoQuillEditor
        :placeholder="'请输入'"
        ref="demoQuillEditor"
        style="width:94%;border:1px solid #DFEAF2"
      />
    </div>

    <div class="common-btns ls">
      <el-button type="primary" @click="submitInfo" size="small">提交</el-button>
      <el-button @click="resetForm" size="small">返回</el-button>
    </div>
  </div>
</template>
<script>
import demoQuillEditor from "./quill-editor";
import CTitle from "./FHeader/CTitle.vue";
import TestFormAdd from "@/components/srFormAdd.vue";

import { saveConstructionexperience } from "@/api/progress";
export default {
  components: { TestFormAdd, demoQuillEditor, CTitle },
  data() {
    return {
      id: "",
      form: {
        config: [
          {
            type: "text",
            name: "标题",
            placeholder: "标题",
            bind: "title",
            required: "必填",
            trigger: "blur", // 校验时机
            col: 24,
          },
        ],
        data: {
          title: "", //标题
          content: "", //内容
          projectId: "",
          trainType: 1, //类型  1-建设经验推广 2-服务能力
        },
        enums: {},
        rules: {},
      },
    };
  },
  methods: {
    /**
     * 设置富文本值
     */
    setData() {
      this.$refs.demoQuillEditor.content = this.table.data.content;
    },
    /**
     * 获取富文本值
     */
    getData() {
      let content = this.$refs.demoQuillEditor.content;
      return content;
    },

    /**
     * 提交
     */
    submitInfo() {
      this.$refs["modelAuInfo"].validate((valid) => {
        if (valid) {
          var data = this.form.data;
          data.content = this.getData();
          if (this.$route.query.type == "fwnl") {
            data.trainType = 2;
          } else {
            data.trainType = 1;
          }
          saveConstructionexperience(data).then((res) => {
            this.$showSuccTips("新增成功！");
            this.$emit("refres");
            this.$router.push({
              name: "tcDetail",
              query: {
                id: this.$route.query.id,
              },
            });
          });
        }
      });
    },

    /**
     * 取消
     */
    resetForm() {
      this.$router.push({
        name: "tcDetail",
        query: {
          id: this.$route.query.id,
        },
      });
    },
  },
  created() {
    this.$set(this.form.data, "projectId", this.$route.query.id);
    if (this.$route.query.type == "fwnl") {
      this.title = "添加服务能力";
    } else if (this.$route.query.type == "jsjy") {
      this.title = "添加建设经验推广";
    }
  },
};
</script>
<style lang="scss" scoped>
.qeBox {
  display: flex;
  box-sizing: border-box;
  .qeTitle {
    width: 60px;
    color: #007aff !important;
    text-align: right;
  }
  .quill-upload {
    right: 30px;
  }
}
</style>
<style lang="scss">
.addListBox {
  .el-form-item {
    padding-left: 60px !important;
  }
  .el-form-item__label {
    width: 60px !important;
  }
  .common-btns {
    margin-top: 20px;
  }
}
</style>