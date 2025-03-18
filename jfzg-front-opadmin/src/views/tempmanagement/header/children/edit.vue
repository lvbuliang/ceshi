<template>
  <div>
    <div class="tool-page">
      <div class="tool-page-left">
        <el-form label-width="130px" ref="add">
          <el-form-item label="权限码">
            <el-input v-model.trim="form.permissionCode" clearable style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input v-model.trim="form.remark" clearable style="width: 200px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="tool-page-right">
        <div class="mgb10">表头配置</div>
        <MonacoEditor
          editorStyleName="tool-editor"
          ref="jsonEditor"
          :readOnly="false"
          :content-body.sync="jsonEg"
          @update:contentBody="getValue"
        ></MonacoEditor>
      </div>
    </div>
    <div class="flex flex-center">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="resetForm">返回</el-button>
    </div>
  </div>
</template>

<script>
import { beautifierConf } from "@/utils/index";
import beautifier from "js-beautify";
import Draggable from "vuedraggable";
import MonacoEditor from "@/components/MonacoEditor.vue";
import { api_getTabelHeadById, api_updateTableHead } from "@/api/header";
export default {
  components: {
    Draggable,
    MonacoEditor,
  },
  data() {
    return {
      id: this.$route.query.id,
      jsonStr: "",
      jsonEg: "",
      form: {
        permissionCode: "",
        remark: "",
        data: "",
      },
    };
  },
  methods: {
    setEditorValue(codeStr) {
      this.$refs.jsonEditor.setValue(codeStr);
    },
    getValue(val) {
      this.jsonStr = val;
    },
    async onSubmit() {
      let params = { ...this.form };
      if (this.jsonStr) {
        params.data = this.jsonStr;
      }

      let res = await api_updateTableHead(params);
      if (res.msg.code == "0000") {
        this.$router.push({
          name: "headerList",
        });
      }
    },
    resetForm() {
      this.$router.push({
        name: "headerList",
      });
    },
    async init() {
      let res = await api_getTabelHeadById({ id: this.id });
      if (!res.data || res.msg.code != "0000") return;
      this.$set(this, "form", { ...this.form, ...res.data });
      this.beautifierJson = beautifier.js(res.data.data, beautifierConf.js);
      this.setEditorValue(this.beautifierJson);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.tool-page {
  margin: 20px auto;
  width: 80%;
  display: flex;
  .mgb10 {
    margin-bottom: 10px;
  }
  .tool-page-right {
    margin-left: 20px;
    width: 50%;
    ::v-deep .tool-editor {
      width: 100%;
      height: 82vh;
    }
  }
  .btn-list {
    display: flex;

    .btn-attr {
      width: 200px;
      margin-bottom: 10px;
    }
  }
}
</style>
