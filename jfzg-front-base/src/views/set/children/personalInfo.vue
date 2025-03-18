<template>
  <div class="fromBox">
    <el-form
      class="form"
      :model="ruleForm_person"
      :rules="rules"
      ref="ruleForm_person"
      label-width="160px"
      label-suffix="："
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="ruleForm_person.name"
          placeholder="请输入姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="ruleForm_person.mobile"
          placeholder="请输入手机号"
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="mail">
        <el-input
          v-model="ruleForm_person.mail"
          placeholder="请输入邮箱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          round
          v-debounce="[() => save(), config.deTime]"
          >保存</el-button
        >
        <el-button round size="small" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { api_updateUserInfoByJifd } from "@/api/personalCenter.js";
import config from "@/settings.js";
export default {
  data() {
    return {
      config,
      rules: {
        code: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
        ],
        imgCode: [
          { required: true, message: "请输入图片验证码", trigger: "blur" },
        ],
        passWd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
            message: "只允许设置8-20位数字和字母的密码",
          },
        ],
        confirmPW: [
          { required: true, message: "请输入确认新密码", trigger: "blur" },
          { validator: this.isPWD, trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      ruleForm_person: {
        name: "",
        mobile: "",
        mail: "",
      },
      jfid: "",
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  watch: {
    userInfo: {
      handler: function (params) {
        if (params) {
          this.init();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 更新用户数据
    uploadUserInfo() {
      this.$store.dispatch("app/getUserInfo");
    },
    init() {
      if (this.userInfo) {
        this.ruleForm_person.name = this.userInfo.fullname;
        this.ruleForm_person.mobile = this.userInfo.mobile;
        this.ruleForm_person.mail = this.userInfo.mailBox;
        this.jfid = this.userInfo.jfid;
      }
    },
    save() {
      this.$refs.ruleForm_person.validate((value) => {
        if (value) {
          let params = {
            jfid: this.jfid,
            mailBox: this.ruleForm_person.mail,
            fullname: this.ruleForm_person.name,
          };
          api_updateUserInfoByJifd(params).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success(`保存成功`);
              this.uploadUserInfo();
              this.cancel();
            }
          });
        }
      });
    },
    cancel() {
      let tabsList = sessionStorage.getItem("tabsList");
      if (tabsList) {
        if (JSON.parse(tabsList).length == 1) {
          let element = {
            url: "/base/sandTable",
            title: "沙盘",
          };
          this.$store.commit("tabs/UPDATE_TABS_LIST", element);
          this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
          this.$router.push({
            path: element.url,
          });
        } else {
          let indexOf = "";
          JSON.parse(tabsList).forEach((item, index) => {
            if (item.title == "设置") {
              indexOf = index;
            }
          });
          if (JSON.parse(tabsList).length == 2) {
            this.$store.dispatch("tabs/REMOVE_LAST_TAB", {
              indexOf,
            });
          } else {
            this.$store.dispatch("tabs/REMOVE_ANY_TAB", {
              indexOf,
            });
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fromBox {
  ::v-deep .form {
    .el-input__inner {
      padding: 0 12px;
      color: #333;
    }
    .is-error {
      margin-bottom: 24px !important;
    }
    .el-button--small {
      font-size: 14px;
    }
    .el-form-item {
      &:nth-last-child(2) {
        margin-bottom: 24px !important;
      }
      .el-form-item__content {
        line-height: 32px;
      }
      .el-form-item__label {
        line-height: 32px;
        padding: 0;
      }
      .el-input.is-disabled {
        .el-input__inner {
          background-color: #f7f7f7;
          border-color: #e5e5e5;
          color: #ccc;
        }
      }
    }
  }
}
</style>
