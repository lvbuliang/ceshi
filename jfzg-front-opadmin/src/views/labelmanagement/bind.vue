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
        <el-button type="primary" @click="submit">绑 定</el-button>
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
  getTagCode,
  bindTodoLabel,
  getRoleList,
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
            type: "select",
            name: "角色code",
            placeholder: "请选择角色code",
            bind: "roleCode",
            trigger: "change", // 校验时机
            dataList: "roleList",
            required: "请选择角色code", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "arrSelect",
            name: "标签名称",
            placeholder: "请选择标签名称",
            bind: "tagList",
            dataList: "tageList",
            trigger: "blur", // 校验时机
            multiple: true,
            required: "请选择标签名称", // 必填需要指定提示信息
          },
        ],
        data: {
          roleCode: "",
          tageList: [],
        },
        enums: {
          tageList: [],
          roleList: [],
        },

        rules: {},
      },
    };
  },
  watch: {},
  mounted() {
    this.gettagCode();
    this.getRoleList();
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
    getRoleList() {
      let data = {};
      getRoleList(data).then((res) => {
        if (res.msg.code === "0000") {
          console.log(res.data);
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};

            obj.dataValue = item.roleCode;
            obj.dataName = item.roleName;
            arr.push(obj);
          });
          this.form.enums.roleList = arr;
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
    // /subplan/#/projectLibrary/projectLibraryWorkView?id=3&&temp=123123&projectCode=QWER
    submitData() {
      let data = {
        roleCode: this.form.data.roleCode,
        tagList: this.form.data.tagList,
      };
      bindTodoLabel(data).then((res) => {
        //console.log(res);
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "绑定成功!",
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
