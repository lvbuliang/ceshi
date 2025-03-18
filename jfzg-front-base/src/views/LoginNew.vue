<template>
  <div>
    <div class="login-page">
      <div class="login-left-box">
        <img src="../assets/images/login//leftBanner.png" alt="" />
      </div>
      <div class="login-right-box">
        <div class="rightInfo">
          <div class="top-box">
            <img src="@/assets/images/login/newLogo-3.png" class="r-logo" />
            <!--         <p class="slogo">项目全生命周期管理&nbsp;&nbsp;护航智慧城市建设</p>-->
          </div>
          <span class="infoTitle">欢迎使用豫信河南项目管理系统</span>
          <div
            v-if="isShowIconLogin"
            class="icon-login-box"
            :class="{ close: isClose }"
          >
            <div class="role-box">
              <div class="role-list">
                <div
                  v-for="(item, index) in iconList"
                  :key="'user' + index"
                  class="role-item"
                  :class="{ active: selectIndex == index }"
                  @click="selectUser(index, item)"
                >
                  <template v-if="index < 6">
                    <div class="role-item-icon">
                      <img
                        :src="'/images/login/active_' + item.icon"
                        v-if="selectIndex == index"
                      />
                      <img :src="'/images/login/' + item.icon" v-else />
                    </div>
                    <div class="role-item-name" v-if="item.roleName.length < 7">
                      {{ item.roleName }}
                    </div>
                    <el-popover
                      popper-class="quickPopover"
                      placement="bottom"
                      :title="item.roleName"
                      trigger="hover"
                      v-else
                    >
                      <div class="role-item-name" slot="reference">
                        {{ item.roleName }}
                      </div>
                    </el-popover>
                  </template>
                </div>
              </div>
            </div>
            <div class="toggle-btn" @click="isClose = !isClose">
              <i
                class="icon base-iconfont"
                :class="isClose ? 'icon-xiala' : 'icon-shouqi1'"
              ></i>
            </div>
            <div class="form-box">
              <el-form
                ref="loginForm"
                :model="loginForm"
                :rules="loginRules"
                class="login-form"
                auto-complete="on"
                label-position="left"
                autocomplete="off"
              >
                <el-form-item prop="invitationCode">
                  <div style="position: relative" class="new_searchVal">
                    <el-input
                      ref="invitationCode"
                      v-model.trim="loginForm.invitationCode"
                      type="password"
                      placeholder="请输入邀请码"
                      name="invitationCode"
                      tabindex="2"
                      auto-complete="on"
                      clearable
                      @keydown.enter.native="handleLogin"
                    >
                      <i slot="prefix" class="base-iconfont icon-yaoqingma"></i>
                    </el-input>
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
          <template v-else>
            <div class="tab-list">
              <div
                class="tab-item"
                :class="!loginType ? 'changeColor' : ''"
                @click="goUserLogin('user')"
              >
                用户名登录
              </div>
              <div class="v-split-line"></div>
              <div
                class="tab-item note"
                :class="loginType ? 'changeColor' : ''"
                @click="goUserLogin('SMS')"
              >
                短信登录
              </div>
            </div>
            <div class="form-box">
              <div class="userLogin" v-if="!loginType">
                <el-form
                  ref="loginForm"
                  :model="loginForm"
                  :rules="loginRules"
                  class="login-form"
                  auto-complete="on"
                  label-position="left"
                  autocomplete="off"
                >
                  <el-form-item prop="account">
                    <div style="position: relative" class="new_searchVal">
                      <el-popover
                        id="tabPopover"
                        class="tabPopover"
                        placement="bottom"
                        width="400"
                        trigger="manual"
                        v-model="visible"
                        :append-to-body="false"
                      >
                        <div class="icon-searchVal">
                          <el-input
                            placeholder="输入部门/角色/姓名搜索"
                            v-model="searchVal"
                            slot="suffix"
                            @keyup.enter="onEnterSearch"
                          >
                            <i
                              slot="suffix"
                              class="el-input__icon el-icon-search"
                            ></i>
                          </el-input>
                          <div class="fullnameList_class">
                            <div
                              class="fullnameList_class_title"
                              v-for="(item, index) in catch_fullnameList"
                              :key="index + 'fullnameList'"
                              @click="login_fullname_in(item)"
                            >
                              {{ item.frontName }}
                            </div>
                          </div>
                        </div>
                        <div slot="reference" v-if="isquick_button">
                          <!-- 1.3 隐藏快捷登录-->
                          <!-- <i
                        slot="reference"
                        class="
                          base-iconfont
                          icon-office-supplies-fill
                          kuaijie_quick
                        "
                        @click="visible = !visible"
                      ></i> -->
                        </div>
                      </el-popover>
                      <el-input
                        ref="account"
                        v-model.trim="loginForm.account"
                        placeholder="请输入账号"
                        name="account"
                        type="text"
                        tabindex="1"
                        auto-complete="off"
                        @keydown.enter.native="nextFocus('password')"
                      >
                        <i
                          slot="prefix"
                          class="base-iconfont icon-zhongjianren"
                        ></i>
                      </el-input>
                    </div>
                  </el-form-item>
                  <el-form-item prop="password">
                    <div style="position: relative" class="new_searchVal">
                      <el-input
                        ref="password"
                        v-model.trim="loginForm.password"
                        type="password"
                        placeholder="请输入密码"
                        name="password"
                        tabindex="2"
                        auto-complete="off"
                        clearable
                        @keydown.enter.native="nextFocus('validCode')"
                      >
                        <i slot="prefix" class="base-iconfont icon-unlock"></i>
                      </el-input>
                    </div>
                  </el-form-item>
                  <el-form-item prop="validCode" v-if="!isYaoqing_button">
                    <div
                      style="position: relative"
                      class="valid-code new_searchVal"
                    >
                      <el-input
                        ref="validCode"
                        v-model.trim="loginForm.validCode"
                        placeholder="请输入验证码"
                        tabindex="3"
                        clearable
                        style="width: 220px"
                        @keydown.enter.native="handleLogin"
                      >
                        <i
                          slot="prefix"
                          class="base-iconfont icon-yanzhengma"
                        ></i>
                      </el-input>
                      <img :src="codeImg" @click="getCodeImg" class="code-img" />
                    </div>
                  </el-form-item>
                  <el-form-item prop="invitationCode" v-if="isYaoqing_button">
                    <div style="position: relative" class="new_searchVal">
                      <el-input
                        ref="invitationCode"
                        v-model.trim="loginForm.invitationCode"
                        type="password"
                        placeholder="请输入邀请码"
                        name="invitationCode"
                        tabindex="2"
                        auto-complete="on"
                        clearable
                        @keydown.enter.native="handleLogin"
                      >
                        <i slot="prefix" class="base-iconfont icon-yaoqingma"></i>
                      </el-input>
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
              <div class="userLogin" v-else>
                <el-form
                  ref="loginForm"
                  :model="loginForm"
                  :rules="loginRules"
                  class="login-form"
                  auto-complete="on"
                  label-position="left"
                  autocomplete="off"
                >
                  <el-form-item prop="mobile">
                    <div style="position: relative" class="new_searchVal">
                      <el-input
                        ref="mobile"
                        v-model.trim="loginForm.mobile"
                        placeholder="请输入手机号"
                        name="mobile"
                        auto-complete="off"
                        clearable
                        @keydown.enter.native="nextFocus('validCode')"
                      >
                        <i slot="prefix" class="el-icon-phone"></i>
                      </el-input>
                    </div>
                  </el-form-item>
                  <el-form-item prop="code">
                    <div
                      style="position: relative"
                      class="valid-code new_searchVal"
                    >
                      <el-input
                        ref="code"
                        v-model.trim="loginForm.code"
                        placeholder="请输入短信验证码"
                        clearable
                        style="width: 220px"
                        @keydown.enter.native="handleLogin"
                      >
                        <i slot="prefix" class="el-icon-chat-line-round"></i>
                      </el-input>
                      <el-button
                        type="primary"
                        round
                        :disabled="isDisabled"
                        @click="GetCaptcha"
                        >{{ buttonText }}</el-button
                      >
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setStorageToken, setStorageTokenType } from "@/utils/user-vali";
import { routerGo } from "@/utils/utils.js";
import SETTING from "@/setting";
import { Storage } from "wl-core";
import { api_getFullname, is_quick, is_yaoqing, send_clyz } from "@/api/index";
import {
  api_loginFullname,
  api_changeRole,
  getDefaultMenuByToken,
} from "@/api/user.js";
export default {
  name: "Login",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    const validatePassword2 = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("请输入邀请码"));
      } else {
        callback();
      }
    };
    return {
      account: "",
      kuaijie: false,
      visible: false,
      params: null,
      isquick_button: true,
      isYaoqing_button: false,
      deviceId: "",
      catch_fullnameList: [],
      fullnameList: [],
      searchVal: null,
      loginForm: {
        account: "",
        password: "",
        uuid: "",
        invitationCode: "",
        mobile: "",
        code: "",
      },
      value: false,
      loginRules: {
        account: [{ required: true, trigger: "blur", message: "请输入账号" }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        mobile: [
          { required: true, trigger: "blur", message: "请输入手机号" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, trigger: "blur", message: "请输入短信验证码" },
        ],
        validCode: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
        validCode2: [
          { required: true, trigger: "blur", message: validatePassword2 },
        ],
      },
      loading: false,
      redirect: undefined,
      codeImg: "",
      isShowIconLogin: false, // 演示环境通过图标登录
      iconList: [], // 放前6个用户
      isClose: true, // 控制图标的高度，默认展示3个图标
      selectIndex: 0, // 控制当前选中图标下标
      skin: "biaozhun",
      loginType: 0,
      countDown: 0,
      isDisabled: false,
    };
  },
  computed: {
    buttonText() {
      return this.countDown != 0 ? `${this.countDown}s` : "获取验证码";
    },
  },
  watch: {
    loginType: {
      handler: function (val) {
        Object.keys(this.loginForm).forEach((key) => {
          this.loginForm[key] = "";
        });
      },
      immediate: true,
    },
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
    searchVal: {
      handler: function (data) {
        if (data != null) {
          if (data) {
            var list = JSON.parse(JSON.stringify(this.fullnameList));
            var newlist = [];
            for (var i = 0; i < list.length; i++) {
              if (list[i].frontName.indexOf(data) != -1) {
                newlist.push(list[i]);
              }
            }
            this.catch_fullnameList = newlist;
          } else {
            this.catch_fullnameList = this.fullnameList;
          }
        }
        // str.indexOf("Hello")
      },
      immediate: true,
    },
    "loginForm.account": {
      handler: function (newValue, oldValue) {
        if (this.account && this.account != newValue) {
          this.kuaijie = false;
        }
      },
    },
  },
  mounted() {
    sessionStorage.clear();
    this.isYaoqing();
    this.getCodeImg();
    // this.getFullname();//1.3隐藏快捷登录
    // this.isQuick(); //1.3隐藏快捷登录
  },
  methods: {
    selectUser(index, item) {
      this.selectIndex = index;
      this.params = {
        username: item.userId,
        password: item.password,
        frontValue: item.frontValue,
        grant_type: "password",
      };
    },
    isQuick() {
      is_quick({ dictTopicEnum: "QUICK_LOGIN" }, SETTING.baseUrl)
        .then((res) => {
          if (res.data && res.data[0]) {
            if (
              res.data[0].itemCode == "true" &&
              res.data[0].topic == "JFZG_QUICK_TOPIC_LOGIN"
            ) {
              this.isquick_button = true;
            } else {
              this.isquick_button = false;
            }
          } else {
            this.isquick_button = false;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    goUserLogin(val) {
      this.$refs.loginForm.clearValidate();
      console.log("goUserLogin", val);
      if (val == "user") {
        this.loginType = 0;
      } else {
        this.loginType = 1;
      }
    },
    GetCaptcha() {
      if (this.loginForm.mobile) {
        let params = {
          captcha: "",
          mobile: this.loginForm.mobile,
          content: "短信验证码",
          smsType: "CAPTCHA",
          target: "PERSONAGE",
        };
        this.newParams = {
          mobile: this.loginForm.mobile,
        };

        // debugger
        send_clyz(params).then((res) => {
          console.log(res.data.message);
          this.$message.success(res.data.message);
          this.countDown = 60;
          this.isDisabled = true;
          const interval = setInterval(() => {
            this.countDown--;
            if (this.countDown == 0) {
              clearInterval(interval);
              this.isDisabled = false;
            }
          }, 1000);
        });
      }
    },
    isYaoqing() {
      is_yaoqing(SETTING.baseUrl).then((res) => {
        if (res.data) {
          this.isYaoqing_button = res.data.needInvitationCode;
          this.isShowIconLogin = res.data.needIconCode;
          this.skin = res.data.skin;
          sessionStorage.setItem("IP", res.data.ip);
          sessionStorage.setItem("skin", this.skin);
        }
      });
    },
    onEnterSearch: function (e, searchVal) {},
    login_fullname_in(data) {
      this.$set(this, "loginForm", {
        account: data.userId,
        password: data.userId,
      });
      this.account = data.userId;
      this.kuaijie = true;
      this.params = {
        username: data.userId,
        password: data.password,
        frontValue: data.frontValue,
        grant_type: this.isYaoqing_button ? "password" : "password_code",
      };
      this.visible = !this.visible;
    },
    login_fullname() {
      this.params.invitationCode = this.loginForm.invitationCode;
      this.params.validCode = this.loginForm.validCode;
      this.params.deviceId = this.deviceId;
      api_loginFullname(this.params, SETTING.baseUrl).then((res) => {
        setStorageToken(res.data.access_token);
        setStorageTokenType(res.data.token_type);
        api_changeRole({ fronVlaue: this.params.frontValue }).then(
          async (res) => {
            let response = await getDefaultMenuByToken();
            //放开沙盘
            // let remark = response.data[0]
            //   ? response.data[0].remark
            //   : "/base/sandTable";
            let remark = response.data[0]
              ? response.data[0].remark
              : "/base/home";
            sessionStorage.setItem("DEFAULT_MENU", remark);
            routerGo(remark);
            console.log("login_fullname.remark", remark);
            // window?.location?.reload?.();
            window.location.reload();
            this.loading = false;
          }
        );
        this.loading = false;
      });
    },
    getFullname() {
      api_getFullname({}, SETTING.baseUrl)
        .then((res) => {
          if (res && res.data && res.data.length > 0) {
            this.iconList = [];
            for (let i = 0, len = res.data.length; i < len; i++) {
              let item = res.data[i];
              let roleCode = item.roleCode.split("_")[0]; // 从字段里截取
              if (
                roleCode == "CJDW" ||
                roleCode == "FWJG" ||
                roleCode == "JLDW" ||
                roleCode == "JSDW" ||
                roleCode == "PSZJ" ||
                roleCode == "TCDW"
              ) {
                // CJDW 承建单位 || FWJG 服务机构 || JLDW 监理单位 || JSDW 建设单位 || PSZJ 专家 || TCDW 统筹单位
                // 这几个有固定的图标，未包含的用默认图标
                item.icon = roleCode + "@2x.png";
              } else {
                item.icon = "OTHERS@2x.png";
              }
              this.iconList.push(item);
              if (i == 0) {
                this.selectUser(0, item);
              }
              if (i == 5) {
                break;
              }
            }
            this.fullnameList = res.data;
          }
          this.searchVal = "";
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    nextFocus(refName) {
      this.$refs[refName].focus();
    },
    handleLogin() {
      var that = this;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // debugger;
          if (this.isShowIconLogin) {
            this.login_fullname();
          } else {
            this.loginForm.grant_type = that.isYaoqing_button
              ? "password"
              : "password_code";
            if (this.params && this.kuaijie) {
              this.login_fullname();
            } else {
              if (this.loginType == 1) {
                this.loginForm.grant_type = "mobile_password";
              }

              this.$store
                .dispatch("app/login", this.loginForm)
                .then(async (data) => {
                  setStorageToken(data.access_token);
                  setStorageTokenType(data.token_type);
                  let response = await getDefaultMenuByToken();
                  console.log(response);
                  // let remark = response.data[0] ? response.data[0].remark : '/base/sandTable'
                  /* let remark = response.data[0]
                    ? response.data[0].remark
                    : "/base/home"; */
                  // let remark = "/subdecl/#/planProject";
                  let remark = "/base/home";
                  let element = {
                    url: remark,
                    title: "项目信息",
                  };
                  this.$store.commit("tabs/UPDATE_TABS_LIST", element);
                  this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
                  sessionStorage.setItem("DEFAULT_MENU", remark);
                  routerGo(remark);
                  window?.location?.reload?.();
                  this.loading = false;
                })
                .catch((err) => {
                  //验证码不正确刷新验证码
                  if (err.code == 400) {
                    this.getCodeImg();
                  }
                  // debugger;
                  this.loading = false;
                });
            }
          }
        } else {
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    getCodeImg() {
      let deviceId =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.deviceId = deviceId;
      Storage.set("deviceId", deviceId, "session");
      this.codeImg = `${SETTING.baseUrl}/jfzg/uaa/validata/code/${deviceId}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.valid-code {
  display: flex;
  align-items: center;
  ::v-deep .el-button.is-round {
    margin-left: 20px !important;
  }
}
.new_searchVal {
  height: 42px;
  .tabPopover {
    .el-popover {
      top: 46px !important;
      left: -30px !important;
      padding-bottom: 0px;
      padding-left: 4px;
      padding-right: 4px;
    }
  }
  .el-popper .popper__arrow::after {
    margin-left: 170px;
  }
}
.icon-searchVal {
  width: 100%;
  .el-input__prefix {
    .el-input__icon {
      right: -268px;
    }
  }
  .el-input {
    height: 32px !important;
    margin-left: 20px;
    width: 90% !important;
    input {
      height: 32px !important;
      padding-left: 12px !important;
    }
  }
  .fullnameList_class {
    cursor: pointer;
    height: 240px;
    margin-top: 9px;
    margin-bottom: 16px;
    padding-left: 4px;
    overflow: auto;
    overflow-x: hidden;
    .fullnameList_class_title {
      display: inline-block;
      height: 30px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      padding-top: 5px;
      padding-left: 16px;
      padding-right: 16px;
      padding-bottom: 5px;
      box-sizing: border-box;
      width: 100%;
    }
    .fullnameList_class_title:hover {
      background: #f7f7f7;
      width: 100%;
    }
  }

  .fullnameList_class::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .fullnameList_class::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 8px;
    -webkit-box-shadow: inset 0 0 5px #e4e7ed;
    background: #e4e7ed;
  }
  .fullnameList_class::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px #fff;
    border-radius: 10px;
    background: #fff;
  }
}
</style>
<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  .login-left-box {
    img {
      width: 100%;
      height: 100%;
    }
  }

  .login-right-box {
    margin-left: 10%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .kuaijie_quick {
      display: inline-block;
      position: absolute;
      text-align: center;
      color: #ccc;
      left: 294px;
      top: 2px;
      z-index: 22;
      font-size: 16px;
      width: 40px;
      height: 39px;
      background: #fafafa;
      border-radius: 0px 7px 7px 0px;
    }
    .kuaijie_quick:hover {
      color: #1890ff;
    }
    .top-box {
      margin-top: 12%;
      font-size: 0px;
      text-align: left;
      .r-logo {
        width: 96px;
      }

      .slogo {
        height: 24px;
        font-size: 16px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: #7f91a7;
        line-height: 24px;
        text-align: center;
        margin-top: 21px;
      }
    }
    .infoTitle {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 20.27px;
      color: rgba(134, 144, 156, 1);
      margin-top: 20px;
    }
    .changeColor {
      color: #333333 !important;
      height: 30px !important;
      border-bottom: 2px solid #0176ff;
    }
    .tab-list {
      display: flex;
      align-items: center;
      margin: 40px 0px 30px 0px;
      // margin-bottom: 40px;
      .tab-item {
        cursor: pointer;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cccccc;
        line-height: 22px;
        &.actived {
          font-weight: 500;
          color: #333333;
        }
      }
      .v-split-line {
        width: 1px;
        height: 18px;
        background: #e5e5e5;
        margin: 0 24px;
      }
    }
    .form-box {
      .login-form {
        width: 336px;
        margin: 0 auto;
        // padding: 40px 0;
        // overflow: hidden;
        .code-img {
          width: 108px;
          margin-left: 8px;
        }
        ::v-deep .el-input {
          display: inline-block;
          // height: 42px;
          width: 100%;
          overflow: hidden;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          color: #454545;
          .el-input__prefix {
            left: 16px;
            .base-iconfont {
              font-size: 16px;
            }
          }

          input {
            background: #fff;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 0px 16px 0 36px;
            height: 41px;
            line-height: 41px;
            color: #333;
            font-size: 14px;
            &:-webkit-autofill {
              box-shadow: 0 0 0px 1000px #fafbfc inset !important;
              -webkit-text-fill-color: #464752 !important;
            }
            &::-webkit-input-placeholder {
              color: #ccc;
              font-size: 14px;
              font-weight: 400;
            }
          }
          input:active,
          input:focus {
            border: 1px solid #1890ff;
          }
        }

        .el-form-item {
          margin-bottom: 16px;
          // height: 50px;
          ::v-deep .el-form-item__error {
            font-size: 12px;
            height: 16px;
            line-height: 25px;
            position: static;
            padding-top: 2px;
          }
        }
        .login-btn {
          width: 100%;
          height: 42px;
          background: #1890ff;
          border-radius: 21px;
          font-size: 16px;
          font-weight: 400;
          color: #fff;
          margin-top: 16px;
        }
      }
    }
    .icon-login-box {
      margin-top: 72px;
      &.close {
        .role-box {
          height: 100px;
          overflow: hidden;
        }
      }
      .role-box {
        height: auto;
        overflow: auto;
      }
      .toggle-btn {
        text-align: center;
        width: 100%;
        height: 22px;
        line-height: 22px;
        i {
          font-size: 16px;
        }
        &:hover {
          cursor: pointer;
          color: #1890ff;
        }
      }
      .role-list {
        width: 336px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: flex-start;
        .role-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          &:hover {
            cursor: pointer;
            .role-item-name {
              font-weight: 500;
              color: #333;
            }
          }
          &.active {
            .role-item-icon {
              background: linear-gradient(180deg, #89c2ff 0%, #3577fe 100%);
              box-shadow: 0px 8px 10px 0px rgba(53, 119, 254, 0.2);
            }
            .role-item-name {
              font-weight: 500;
              color: #333;
            }
          }
          .role-item-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 48px;
            height: 48px;
            background-color: rgba(53, 119, 254, 0.1);
            border-radius: 50%;
            img {
              width: 24px;
              height: 24px;
            }
            margin-bottom: 8px;
          }
          .role-item-name {
            color: #999999;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            width: 100px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
            margin-bottom: 24px;
          }
        }
      }
    }
  }
}
.note {
  // pointer-events: none;
}
</style>
