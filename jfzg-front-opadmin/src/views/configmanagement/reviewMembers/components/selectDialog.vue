<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      :append-to-body="true"
      class="common-dialog"
      :before-close="bClose"
    >
      <FForm
        v-if="flag"
        ref="modelMgrRef"
        class="modelMgrRef"
        :config="form.config"
        :form="form.data"
        :rules="form.rules"
        :enums="form.enums"
        :other-config="otherConfig"
        refForm="modelMgrRefForm"
        @eventNotify="eventNotify"
        :column="2"
      >
      </FForm>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="colseDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FForm from "@/components/FForm/form-add";
import {
  api_getUserByRoleCode,
  api_addUsers,
} from "@/api/reviewMembers/reviewMembers";
import Check from "@/assets/Check.png";
import Circle from "@/assets/Circle.png";
export default {
  components: {
    FForm,
  },

  data() {
    return {
      Check: Check,
      Circle: Circle,
      flag: true,
      dialogVisible: false,
      title: "",
      otherConfig: {
        // 其他配置
        labelNum: 100, // label宽度，可选120和150，默认120
        column: 2, // 列数，默认2
        validateOnRuleChange: false,
      },
      form: {
        config: [
          {
            col: 24,
            type: "select",
            name: "姓名",
            placeholder: "请选择姓名",
            bind: "jfid",
            dataList: "usersList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择姓名", // 必填需要指定提示信息
            change: this.changeVal,
            disabled: false,
          },
          {
            col: 24, // 独占一行
            type: "number",
            name: "联系方式",
            placeholder: "请输入联系方式",
            bind: "enName",
            trigger: "blur", // 校验时机
            rules: {
              isphone: "请输入正确的联系方式",
            },
          },
          {
            col: 24,
            type: "select",
            name: "成员类型",
            placeholder: "请选择成员类型",
            bind: "type",
            dataList: "typeList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择成员类型", // 必填需要指定提示信息
            change: this.changeVal2,
            disabled: false,
          },
        ],
        data: {
          jfid: "",
          enName: "",
          chName: "",
          fullEnname: "",
          type: null
        },
        enums: {
          usersList: [],
          typeList: [
            { dataName: '固定评审组员', dataValue: 1 },
            { dataName: '非固定评审组员', dataValue: 2 }
          ]
        },
        rules: {},
      },
      usable: true,
      allUsersList: [], //所有下拉人员
    };
  },

  mounted() {
    this.getAllUserList();
  },
  methods: {
    changeVal(row, item) {
      let data = this.filietInfo(row);
      
      if (data?.length > 0) {
        this.$set(this.form.data, "enName", data[0].mobile);
        this.$set(this.form.data, "fullEnname", data[0].jfid);
      }
    },
    changeVal2(value) {
      this.$set(this.form.data, "type", value);
    },
    init(data) {
      this.form.data = {
        chName: "",
        enName: "",
        fullEnname: "",
        jfid: "",
        type: null
      };

      // this.form.enums.usersList = [];
      this.flag = false;
      this.$nextTick(() => {
        this.flag = true;
      });
      this.title = data.title;
      /*      if (data.title == "编辑") {
        console.log("da", data);
        let obj = {
          chName: data.chName,
          jfid: String(data.fullEnname),
          enName: data.enName,
          fullEnname: data.fullEnname,
        };
        console.log("obj", obj);
        this.$set(this.form, "data", obj);
      } */
      this.dialogVisible = true;
    },
    //获取所有账号下拉
    getAllUserList() {
      api_getUserByRoleCode().then((res) => {
        if (res.msg.code == "0000") {
          this.allUsersList = res.data;
          let list = res.data.map((item) => {
            return {
              dataName: item.fullname,
              dataValue: item.jfid,
            };
          });
          this.$set(this.form.enums, "usersList", list);
        }
      });
    },
    // 过滤联系方式
    filietInfo(row) {
      console.log(this.allUsersList, row);
      let result = [];
      this.allUsersList.forEach((item) => {
        if (item.jfid == row) {
          result.push(item);
        }
      });
      return result;
    },
    // 提交
    submit() {
      var parameter = new Promise((resolve, reject) => {
        // console.log(resolve, this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate())
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          // console.log(valid)
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        let chName = "";
        let result = this.allUsersList.find(
          (item) => item.jfid == this.form.data.jfid
        );
        if (result) {
          chName = result.fullname;
        }
        console.log("eee", this.form.data);
        let data = {
          jfid: this.form.data.fullEnname,
          type: this.form.data.type
          // enName: this.form.data.enName || "",
          // chName: chName || "",
          // fullEnname: this.form.data.fullEnname || "",
          // topic: "FIXED_PSXZ_CY",
        };
        api_addUsers(data).then((res) => {
          console.log(res);
          if (res.msg && res.msg.code == "0000") {
            this.$message.success("新增成功");
            this.dialogVisible = false;
            this.$emit("refresh");
          }
        });
      });
    },
    // 弹框取消
    colseDialog() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      this.dialogVisible = false;
    },
    // 弹框关闭前回调
    bClose(done) {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      done();
    },
    /**
     * 点击事件类型的选项在点击后执行
     */
    eventNotify(ref) {
      this.$refs[ref].init();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .quicLoginUserClass {
  .el-form-item__label {
    line-height: 24px;
  }
}

.accountListDialog {
  /deep/.dialog-footer {
    text-align: center;
  }
  .fr {
    float: right;
  }
  .cascader {
    width: 100%;
  }
  .loginSlot {
    width: 37%;
    display: inline-block;
    height: 100%;
    margin-left: 8px;
    img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
    .usable {
      color: #52c41a;
    }
    .notAvailable {
      color: #ff4d4f;
    }
    .el-icon-check {
      background-color: #52c41a;
      color: #fff;
      border-radius: 100%;
    }
    .el-icon-close {
      background-color: #ff4d4f;
      color: #fff;
      border-radius: 100%;
    }
  }
  .modelMgrRef {
    /deep/.el-form {
      .el-form-item:nth-child(1) {
        width: 52% !important;
        padding-right: 0;
      }
      .el-form-item:nth-child(2) {
        width: 48% !important;
        padding-left: 63px !important;
        .el-form-item__label {
          width: 63px !important;
        }
      }
      .loginName {
        // width: 224px;
        .button {
          color: #007aff;
        }
      }
    }
  }
}
</style>
