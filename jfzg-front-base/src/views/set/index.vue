<template>
  <div class="setInfo" :style="{ height: boxHeight + 'px' }">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="个人设置">
        <span slot="label"
          ><img src="@/assets/set/personal_tabs.png" alt="" /> 个人设置</span
        >
        <personalInfo />
      </el-tab-pane>
      <!-- <el-tab-pane name="second">
        <span slot="label"><img src="@/assets/set/unit.png" alt="" />单位设置</span
        >单位设置</el-tab-pane
      > -->
      <el-tab-pane name="密码修改">
        <span slot="label"
          ><img src="@/assets/set/password_tabs.png" alt="" />密码修改</span
        >
        <changePassWord />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import personalInfo from "./children/personalInfo.vue";
import changePassWord from "./children/changePassWord.vue";
import { getWorkflowHeight } from "@/utils";
export default {
  components: {
    personalInfo,
    changePassWord,
  },
  data() {
    return {
      activeName: "个人设置",
      inputType: "text",
      confirmPWType: "text",
      none: "",
      form: {
        title: "密码修改",
      },
      isCodeimgIndex: true,

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
      },
      totalTime: 60,
      imgKey: 1,
      isCodeimg: "",
      bo_clock: "",
      boxHeight: getWorkflowHeight(),
    };
  },
  computed: {
    activeLabel() {
      return sessionStorage.getItem("label");
    },
  },
  mounted() {
    // 首次
    this.activeName = this.activeLabel;
    this.$bus.$on("label", (e) => {
      this.activeName = e;
    });
  },

  methods: {
    handleClick(tab, event) {
    },
  },
};
</script>

<style lang="scss" scoped>
.setInfo {
  background-color: #fff;
  padding-left: 20px;
  /deep/ .el-tabs {
    .el-tabs__header {
      margin-bottom: 24px;
    }
    .fromBox {
      .el-form {
        .el-form-item {
          margin-bottom: 16px;
          .el-form-item__content {
            display: flex;
            align-items: center;
            .el-input {
              width: 300px;
            }
            .codeRight {
              width: 95px;
              height: 32px;
              background: #ffffff;
              border-radius: 16px;
              border: 1px solid #cccccc;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 10px;
              margin-left: 5px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
          .el-button {
            width: 76px;
          }
        }
      }
    }
    .el-tabs__item {
      span {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        img {
          width: 24px;
          height: 24px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
