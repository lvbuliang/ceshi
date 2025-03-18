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
  addTodoLabel,
  getTagCode,
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
          // {
          //   col: 12,
          //   type: "select",
          //   name: "权限类型",
          //   placeholder: "请选择权限类型",
          //   bind: "permissionType",
          //   dataList: "typeList", // 定义在this.form.enums中的typeList
          //   trigger: "blur", // 校验时机
          //   required: "请选择权限类型", // 必填需要指定提示信息
          //   change: this.permissionTypeChange,
          // },
          // {
          //   col: 12,
          //   type: "select",
          //   name: "权限分类",
          //   placeholder: "请选择权限分类",
          //   bind: "permissionHidden",
          //   dataList: "permissionHiddenList", // 定义在this.form.enums中的typeList
          //   trigger: "blur", // 校验时机
          //   required: "请选择权限分类", // 必填需要指定提示信息
          // },

          {
            col: 12, // 独占一行
            type: "text",
            name: "待办标签名称",
            placeholder: "请输入待办标签名称",
            bind: "tagTypeName",
            trigger: "blur", // 校验时机
            required: "请输入待办标签名称", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "select",
            name: "来源",
            placeholder: "请选择来源",
            bind: "platform",
            dataList: "platformList",
            trigger: "blur", // 校验时机
            required: "请选择来源", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "备注",
            placeholder: "请输入备注",
            bind: "remark",
          },
        ],
        data: {
          tagTypeName: "",
          platform: "",
          remark: "",
          tageList: [],
        },
        enums: {
          platformList: [
            {
              dataName: "解放智管",
              dataValue: "JFZG_CLOUD",
            },
          ],
        },

        rules: {},
      },
    };
  },
  watch: {},
  mounted() {
    this.gettagCode();
  },
  methods: {
    gettagCode() {
      getTagCode().then((res) => {
        if (res.msg.code === "0000") {
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.dataValue = item.tagTypeCode;
              obj.dataName = item.tagTypeName;
              arr.push(obj);
            }
          });
          this.form.enums.tageList = arr;
        }
      });
    },
    cancel() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
    },
    submit() {
      // this.submitData();
      console.log(this.form.data);
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
        if (valid) {
          this.submitData();
        }
      });
    },
    // /subplan/#/projectLibrary/projectLibraryWorkView?id=3&&temp=123123&projectCode=QWER
    submitData() {
      let obj = {
        limitDay: 0,
        platform: this.form.data.platform, // 标签来源
        remark: this.form.data.remark, // 备注
        tagTypeName: this.form.data.tagTypeName, // 待办标签名称
      };

      addTodoLabel(obj).then((res) => {
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
.authList {
  /deep/ .form {
    .dialog-footer {
      margin-left: 300px;
    }
    .el-form {
      .el-form-item__content {
        margin-left: 20px !important;
      }
    }
  }
}
</style>
