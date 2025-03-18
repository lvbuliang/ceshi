<template>
  <div class="fromBox">
    <el-form
      :model="ruleForm_changeWord"
      :rules="rules"
      ref="ruleForm_changeWord"
      label-width="160px"
      class="form"
      label-suffix="："
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="ruleForm_changeWord.name"
          placeholder="请输入姓名"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="已验证手机号" prop="mobile">
        <el-input
          v-model="ruleForm_changeWord.mobile"
          placeholder="请输入已验证手机号"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="短信验证码" prop="code">
        <el-input
          v-model="ruleForm_changeWord.code"
          class="code"
          placeholder="请输入短信验证码"
          style="width: 200px"
          clearable
        ></el-input>
        <span class="codeRight" readonly @click="getCode">{{
          ruleForm_changeWord.getCode
        }}</span>
      </el-form-item>

      <el-form-item label="图片验证码" prop="imgCode">
        <el-input
          type="text"
          v-model="ruleForm_changeWord.imgCode"
          autocomplete="off"
          name="n_imgCode"
          class="code"
          style="width: 200px"
          placeholder="请输入图片验证码"
          clearable
        ></el-input>
        <span class="codeRight" readonly>
          <img :src="isCodeimg" alt :key="imgKey" @click="getImg" />
        </span>
      </el-form-item>
      <el-form-item label="隐藏" style="position: fixed; bottom: -999999px">
        <el-input
          type="text"
          v-model="none"
          class="code"
          placeholder=""
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="passWd">
        <el-input
          ref="changType"
          :type="inputType"
          @focus="changeType(0)"
          v-model="ruleForm_changeWord.passWd"
          maxlength="20"
          autoComplete="new-password"
          name="n_password"
          placeholder="请输入新密码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPW">
        <el-input
          :type="confirmPWType"
          @focus="changeType(1)"
          autoComplete="new-password"
          v-model="ruleForm_changeWord.confirmPW"
          name="n_confirmPW"
          placeholder="请确认密码"
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
import SETTING from "@/setting";
import { Storage } from "wl-core";
import config from "@/settings.js";
import { getStorageToken, clearStorageToken } from "@/utils/user-vali.js";
import { api_updatePwdMsg, api_updateUserPass } from "@/api/personalCenter.js";
import md5 from "js-md5";
export default {
  data() {
    return {
      config,
      inputType: "text",
      confirmPWType: "text",
      none: "",
      form: {
        title: "密码修改",
      },
      ruleForm_changeWord: {
        name: "",
        mobile: "",
        code: "",
        getCode: "获取验证码",
        imgCode: "",
        getImgCode: "1234",
        passWd: "",
        confirmPW: "",
      },
      rules: {
        code: [
          { required: false, message: "请输入短信验证码", trigger: "blur" },
        ],
        imgCode: [
          { required: false, message: "请输入图片验证码", trigger: "blur" },
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
      },
      totalTime: 60,
      imgKey: 1,
      isCodeimg: "",
      bo_clock: "",
      deviceId: "",
      jfid: "",
    };
  },
  mounted() {
    this.getImg();
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
      immediate: true,
    },
  },
  methods: {
    changeType(type) {
      if (type == 0) {
        this.inputType = "password";
      } else if (type == 1) {
        this.confirmPWType = "password";
      }
    },
    init() {
      this.ruleForm_changeWord.name = this.userInfo.fullname;
      this.ruleForm_changeWord.mobile = this.userInfo.mobile;
      this.ruleForm_changeWord.mail = this.userInfo.mailBox;
      this.jfid = this.userInfo.jfid;
    },
    save() {
      console.log(this.deviceId);
      this.$refs["ruleForm_changeWord"].validate((valid) => {
        if (valid) {
          let obj = {
            deviceId: this.deviceId,
            mobile: this.ruleForm_changeWord.mobile,
            smsCode: this.ruleForm_changeWord.code,
            imgCode: this.ruleForm_changeWord.imgCode,
            password: md5(this.ruleForm_changeWord.passWd).toUpperCase(),
          };
          api_updateUserPass(obj)
            .then((res) => {
              if (res.msg.code == "0000") {
                this.logOut();
              } else {
                this.$message.error(`${res.msg.message}`);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    // 退出登录
    logOut() {
      let pageUrl = window.location.href;
      let access_token = getStorageToken();
      let redirect_uri = encodeURIComponent(pageUrl);
      let targetUrl = `${SETTING.baseUrl}/jfzg/uaa/oauth/remove/token?token=${access_token}&redirect_uri=${redirect_uri}`;
      clearStorageToken();
      sessionStorage.clear();
      window.location.replace(targetUrl);
    },
    cancel() {
      let element = {
        url: "/base/home",
        title: "工作台",
      };
      this.$store.commit("tabs/UPDATE_TABS_LIST", element);
      this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
      this.$router.push({
        path: element.url,
      });
    },
    // 点击图片切换图片
    getImg() {
      this.$nextTick(() => {
        let deviceId =
          Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
        // Storage.set("deviceId", deviceId, "session");
        this.$set(this, "deviceId", deviceId);
        this.isCodeimg = `${SETTING.baseUrl}/jfzg/uaa/validata/code/${deviceId}`;
      });
    },
    isPWD(rule, value, callback) {
      if (
        this.ruleForm_changeWord.passWd != this.ruleForm_changeWord.confirmPW
      ) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },
    // 获取验证码
    getCode() {
      let that = this;
      if (that.ruleForm_changeWord.getCode == "获取验证码") {
        if (that.bo_clock) {
          return false;
        }
        if (that.totalTime == 60) {
          //this.userInfo.mobile
          let data = {
            mobile: this.userInfo.mobile,
          };
          api_updatePwdMsg(data)
            .then((res) => {
              if (res.msg && res.msg.code == "0000") {
              }
            })
            .catch((err) => {
              console.log(err);
            });
          that.bo_clock = window.setInterval(() => {
            that.totalTime--;
            that.ruleForm_changeWord.getCode = that.totalTime + "s";
            if (that.totalTime < 0) {
              window.clearInterval(that.bo_clock);
              that.bo_clock = "";
              that.ruleForm_changeWord.getCode = "获取验证码";
              that.totalTime = 60;
            }
          }, 1000);
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
    .codeRight {
      cursor: pointer;
      &:hover {
        border-color: #1890ff !important;
        color: #1890ff !important;
      }
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
