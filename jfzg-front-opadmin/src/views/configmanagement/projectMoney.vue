<template>
  <div class="projectMoney">
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

import {
  projectMoneyConfig,
  api_getAmount,
} from "@/api/autotemplatemanagement/autotemplatemanagement.js";
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
            name: "竣工验收金额（万元）",
            placeholder: "请输入竣工验收金额（万元）",
            bind: "amount",
            trigger: "blur", // 校验时机
            required: "请输入竣工验收金额（万元）", // 必填需要指定提示信息
          },
        ],
        data: {
          amount: "",
        },
        enums: {},

        rules: {},
      },
    };
  },
  watch: {},
  mounted() {
    this.getAmount();
  },
  methods: {
    getAmount() {
      api_getAmount().then((res) => {
        if (res.msg.code == "0000") {
          console.log("金额", res.data);
          if (res.data) {
            this.$set(this.form.data, "amount", res.data);
          }
        }
      });
    },
    cancel() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
    },
    submit() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
        if (valid) {
          this.submitData();
        }
      });
    },
    submitData() {
      let data = {
        amount: Number(this.form.data.amount),
      };
      projectMoneyConfig(data).then((res) => {
        //console.log(res);
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.projectMoney {
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
      .el-form-item__label {
        width: 200px !important;
      }
      .el-form-item__content {
        width: 500px !important;
        margin-left: 20px !important;
      }
    }
  }
}
</style>
