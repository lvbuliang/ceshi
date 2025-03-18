<template>
  <div class="login">
    <div class="login-area">
      <h3 class="logo"></h3>
      <div class="login-sect">
        <div class="login-container">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
            <div class="title-container">
              <h3 class="title">数据资产管理系统</h3>
            </div>
            <el-form-item prop="username" style="margin-top:30px;">
              <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" prefix-icon="el-icon-user" type="text" tabindex="1" autocomplete="on"></el-input>
            </el-form-item>
            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item prop="password">
                <el-input :key="passwordType" placeholder="请输入密码" v-model="loginForm.password" name="password" prefix-icon="el-icon-lock" show-password tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin"></el-input>
              </el-form-item>
            </el-tooltip>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login {
  height: 100%;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: 0 50%;
  position: relative;

  .login-area {
    min-width: 1200px;
    height: 100%;
    position: relative;
    margin: 0 auto;

    .logo {
      position: absolute;
      right: 0;
      top: 50px;
      width: 233px;
      height: 46px;
    }

    .login-sect {
      // position: absolute;
      // top: 35%;
      // right: 15px;
      width: 400px;
      margin: 10% auto 0;
    }
  }
}


.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .el-input {
    display: inline-block;
    height: 47px;

  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0 35px;
    margin: 0 auto;
    overflow: hidden;
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
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      // width: 286px;
      height: 40px;
      background-size: 80% auto;
      background-repeat: no-repeat;
      text-align: center;
      color: #1890ff;
      font-size: 20px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

}

</style>
<script>
// import { validUsername } from '@/utils/validate'
// import { getToken, setToken, removeToken } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' },
          { min: 6, max: 20, message: '密码长度最少6位', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log(this.loginForm)
          this.$store.dispatch('user/login', this.loginForm)
            .then((res) => {
              this.$store.dispatch('user/setMenu', this.loginForm)
              console.log(this.redirect, '===>', this.otherQuery);
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })

          /*instSearch({}).then(response => {
            console.log(response);
          })*/

        } else {
          console.log('error submit!!')
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
    }
  }
}

</script>
