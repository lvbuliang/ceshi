<template>
  <el-dialog title="终验备案" :visible.sync="dialogVisible" width="800px">
    <div class="content">
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
        :ruleForm="formView.data"
      >
      </SrView>
    </div>
    <span slot="footer" v-if="typeName == 'edit'" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" v-debounce="[() => submit(), config.deTime]"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { api_getCustomFormTemplate } from "@/api/index.js";
import {
  api_setSaveRecord,
  api_getDetailById,
} from "@/api/finalAcceptance/index.js";
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
      config,
      dialogVisible: false,
      typeName: "edit",
      otherConfig: {
        labelNum: 160,
      },
      form: {
        config: [],
        data: {},
        enums: {},
      },
      formView: {
        config: [],
        data: {},
      },
      moduleCode: "31002",
      id: "",
    };
  },
  methods: {
    init(item) {
      this.id = item.id;
      if (item.status == 1000) {
        this.typeName = "edit";
        this.getCustomFormTemplate(this.moduleCode);
      } else if (item.status == 1001) {
        this.typeName = "view";
        this.getData();
      }

      this.dialogVisible = true;
    },
    //自定义表单获取
    getCustomFormTemplate(moduleCode, data) {
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
          if (data && Object.keys(data).length) {
            this.$set(this.form, "data", data);
            this.$set(this.formView, "data", data);
          }
          this.templateId = res.data.id;
        }
      });
    },
    getData() {
      let params = {
        id: this.id,
      };
      api_getDetailById(params).then((res) => {
        if (res.msg.code == "0000") {
          this.getCustomFormTemplate(this.moduleCode, res.data);
        }
      });
    },
    close() {
      this.form.data = {};
      this.dialogVisible = false;
    },
    submit() {
      this.$refs["form"].validate((val) => {
        if (val) {
          let params = {
            id: this.id,
            ...this.form.data,
          };
          if (params.recordFile) {
            params.recordFile = JSON.stringify(params.recordFile);
          }
          if (params.recordOtherFile) {
            params.recordOtherFile = JSON.stringify(params.recordOtherFile);
          }
          api_setSaveRecord(params).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("终验备案成功");
              this.close();
              this.$emit("submitSuccess");
            }
          });
        }
      });
    },
  },
};
</script>

<style></style>
