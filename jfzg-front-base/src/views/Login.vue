<template>
  <div class="login-container">
    <div class="content_box">
      <div class="img_box">
        <img src="@/assets/images/login/chatu.png" />
      </div>
      <div class="right-box">
        <div class="logo">
          <img src="@/assets/images/logo.png" />
          <span class="com-name">解放智管</span>
          <span class="v-line"></span>
          <span class="sys-name">项目全生命周期管理 护航智慧城市建设666</span>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="login-admin">
            <div class="title">账号登陆</div>
          </div>
          <el-form-item prop="account">
            <el-input
              ref="account"
              v-model.trim="loginForm.account"
              placeholder="请输入账号"
              name="account"
              type="text"
              tabindex="1"
              auto-complete="on"
              clearable
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="password"
              v-model.trim="loginForm.password"
              type="password"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              clearable
            />
          </el-form-item>
          <el-form-item prop="validCode">
            <div class="valid-code">
              <el-input
                v-model="loginForm.validCode"
                placeholder="请输入验证码"
                tabindex="3"
                clearable
              ></el-input>
              <img :src="codeImg" @click="getCodeImg" />
            </div>
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="login-btn"
            @click.native.prevent="handleLogin"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { setStorageToken, setStorageTokenType } from '@/utils/user-vali'
import { routerGo } from '@/utils/utils.js'
import SETTING from '@/setting'
import { Storage } from 'wl-core'
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: '',
        uuid: '',
      },
      value: false,
      loginRules: {
        account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
        validCode: [
          { required: true, trigger: 'blur', message: '请输入验证码' },
        ],
      },
      loading: false,
      redirect: undefined,
      codeImg: '',
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getCodeImg()
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch('app/login', this.loginForm)
            .then((data) => {
              setStorageToken(data.access_token)
              setStorageTokenType(data.token_type)
              routerGo('/base/home')
              window?.location?.reload?.()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    getCodeImg() {
      let deviceId =
        Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      Storage.set('deviceId', deviceId, 'session')
      this.codeImg = `${SETTING.baseUrl}/jfzg/uaa/validata/code/${deviceId}`
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  background: url('../assets/images/login/bg.png') no-repeat;
  position: relative;
  background-color: #1182fa;
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
  overflow: hidden;
  .valid-code {
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    img {
      margin-left: 10px;
    }
  }
  .content_box {
    width: 1164px;
    height: 532px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .img_box {
      width: 577px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 90%;
      }
    }
    .right-box {
      .logo {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        color: #fff;
        font-weight: bold;
        img {
          width: 36px;
          height: 36px;
        }
        .com-name {
          margin-left: 8px;
          font-size: 16px;
        }
        .v-line {
          margin-left: 8px;
          width: 1px;
          height: 26px;
          background: rgba(255, 255, 255, 0.2);
        }
        .sys-name {
          margin-left: 8px;
          font-size: 22px;
        }
      }

      .login-form {
        width: 450px;
        height: 434px;
        padding: 46px 45px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0px 0px 14px 0px rgba(45, 134, 240, 0.3);
        border-radius: 10px;
        color: #999999;
        ::v-deep .el-input {
          display: inline-block;
          height: 45px;
          width: 100%;
          overflow: hidden;
          border: 1px solid #e1e1e1;
          border-radius: 3px;
          color: #454545;

          input {
            background: #fafbfc;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 0px 20px;
            height: 43px;
            color: #464752;
            font-size: 16px;
            &:-webkit-autofill {
              box-shadow: 0 0 0px 1000px #fafbfc inset !important;
              -webkit-text-fill-color: #464752 !important;
            }
          }
        }

        .el-form-item {
          margin-bottom: 16px;
          ::v-deep .el-form-item__error {
            margin-top: -10px;
            font-size: 12px;
          }
        }
        .login-admin {
          margin-bottom: 47px;
          .title {
            font-family: PingFangSC, PingFang SC, Microsoft YaHei, Arial,
              sans-serif;
            color: #464752;
            font-size: 28px;
            font-weight: bold;
            text-align: center;
          }
        }
        .sub-box {
          margin-bottom: 50px;
          width: 100%;
          color: #999;
          font-size: 16px;
          ::v-deep .el-checkbox__inner {
            border: 1px solid #e4e4e4;
            border-radius: 2px;
            width: 16px;
            height: 16px;
            background-color: #fafbfc;
            &::after {
              height: 9px;
              left: 5px;
            }
          }
          ::v-deep .el-checkbox__input.is-checked {
            .el-checkbox__inner {
              background-color: #1182fa;
              border-color: #1182fa;
            }
            + .el-checkbox__label {
              color: #1182fa;
            }
          }
          ::v-deep .el-checkbox__label {
            font-size: 16px;
            color: #999;
          }
        }
        .login-btn {
          width: 100%;
          height: 45px;
          background: #1182fa;
          border-color: #1182fa;
          box-shadow: 0px 0px 6px 0px rgba(45, 134, 240, 0.68);
          border-radius: 3px;
          font-size: 18px;
        }
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}
</style>
