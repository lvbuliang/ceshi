<template>
  <div class="authList">
    <div class="form">
      <FForm
        ref="modelMgrRef"
        :config="form.config"
        :form="form.data"
        :rules="form.rules"
        :enums="form.enums"
        :other-config="otherConfig"
        refForm="modelMgrRefForm"
        :column="2"
      ></FForm>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import FForm from "@/components/FForm/form-add";
import config from "@/settings.js";
import { listModule } from "@/api/index.js";
import {
  view_youjian_biaozhunhua, //查询
  set_youjian_biaozhunhua, //保存
} from "@/api/configManage/biaozhunhua_configManage";
export default {
  components: {
    FForm,
  },
  data() {
    return {
      otherConfig: {
        labelNum: 150,
      },
      form: {
        config: [
          {
            col: 12, // 独占一行
            type: "text",
            name: "邮箱服务器",
            placeholder: "请输入邮箱服务器",
            bind: "emailAccount",
            trigger: "blur", // 校验时机
            required: "请输入邮箱服务器", // 必填需要指定提示信息
          },

          {
            col: 12, // 独占一行
            type: "text",
            name: "邮箱端口",
            placeholder: "请输入邮箱端口",
            bind: "port",
            trigger: "blur", // 校验时机
            required: "请输入邮箱端口", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "邮箱地址",
            placeholder: "请输入邮箱地址",
            bind: "emailSmtpHost",
            trigger: "blur", // 校验时机
            required: "请输入邮箱地址", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "邮箱密码",
            placeholder: "请输入邮箱密码",
            bind: "emailPassword",
            trigger: "blur", // 校验时机
            required: "请输入邮箱密码", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "发送邮箱名称",
            placeholder: "请输入发送邮箱名称",
            bind: "sendMailName",
            trigger: "blur", // 校验时机
            required: "请输入发送邮箱名称", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "协议",
            placeholder: "请输入协议",
            bind: "protocol",
            trigger: "blur", // 校验时机
            required: "请输入协议", // 必填需要指定提示信息
          },
        ],
        data: {
          emailAccount: "",
          port: "",
          emailPassword: "",
          sendMailName: "",
          protocol: "SMTP",
        },
        enums: {},

        rules: {},
      },
    };
  },
  computed: {
    rowData() {
      if (this.$route.query.rowData) {
        return JSON.parse(this.$route.query.rowData);
      }
    },
  },
  watch: {},
  mounted() {
    this.queryMessageConfigList();
  },
  methods: {
    // 消息配置查询
    queryMessageConfigList() {
      view_youjian_biaozhunhua().then((res) => {
        if (res.msg.message == "SUCCESS") {
          this.$set(this.form, "data", res.data);
        }
      });
    },

    cancel() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
    },
    submit() {
      // this.submitData();
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
        if (valid) {
          this.submitData();
        }
      });
    },
    back() {
      this.$router.push({
        name: "todotemplateList",
      });
    },

    submitData(data) {
      set_youjian_biaozhunhua(this.form.data).then((res) => {
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
        } else {
          this.$message.error("操作失败");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.authList {
  /deep/ .form {
    .dialog-footer {
      margin-left: 270px;
    }
    .el-form {
      .el-form-item {
        display: flex;
        align-items: center;
        width: 100% !important;
      }
      .el-form-item__content {
        width: 500px !important;
        margin-left: 20px !important;
      }
    }
  }
}
</style>
