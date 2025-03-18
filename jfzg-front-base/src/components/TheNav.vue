<template>
  <div :class="{ 'the-nav': true, complex: isComplex }">
    <div class="logo-image-box">
      <!-- class="logo-image-complex"		
        :src="'/images/logo/' + skin + '-complex1@2x.png'"		
        alt		 -->

      <!-- :src="'/images/logo/' + skin + '-simple@2x.png'" -->
      <!-- <img		
        v-else		
        class="logo-image-simple"		
        :src="'/images/logo/' + skin + '-complex1@2x.png'"		
        alt		
      /> -->

      <div class="logo-box">
        <!-- <img class="logo-image-1" src="@/assets/images/header/logo-4.png" /> -->
        <img class="logo-image-2" src="@/assets/images/header/logo-22.png" />
      </div>
    </div>
    <div class="click-area"></div>
    <!-- 右侧操作区 -->
    <div class="nav-handle-box">
      <!-- 消息按钮 -->
      <div class="allLeft">
        <div class="icon-control" @click="messageInit">
          <!-- 角标 -->
          <span v-if="unreadNumber" class="iconNum">{{ unreadNumber }}</span>
          <sr-popover content="个人消息">
            <img src="@/assets/images/header/tips.png" alt />
          </sr-popover>
        </div>
        <!-- 设置-->
        <div class="icon-control-setting">
          <el-dropdown
            placement="bottom-start"
            trigger="click"
            @command="toSetting"
          >
            <sr-popover content="个人设置">
              <img src="@/assets/images/header/setting.png" alt />
            </sr-popover>
            <el-dropdown-menu
              class="setting-dropdown role-dropdown theNavDropdown"
              slot="dropdown"
            >
              <!-- <el-dropdown-item command="个人设置">
              <i class="base-iconfont icon-geren"></i>
              <span>个人设置</span>
            </el-dropdown-item> -->
              <!-- <el-dropdown-item command="单位设置">
              <img src="@/assets/set/password.png" alt="" />
              <span>
                密码修改
              </span></el-dropdown-item
            >-->
              <el-dropdown-item command="密码修改">
                <i class="base-iconfont icon-mima"></i>
                <span>密码修改</span>
              </el-dropdown-item>
              <el-dropdown-item
                command="管理后台"
                v-if="checkCodeInArr('M009_003_006_001')"
              >
                <i class="base-iconfont icon-houtaiguanli"></i>
                <span>管理后台</span>
              </el-dropdown-item>
              <el-dropdown-item command="退出登录">
                <i class="el-icon-switch-button"></i>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="block">
        <el-avatar :size="30" :src="circleUrl"></el-avatar>
      </div>
      <!--用户-->
      <div class="use-info-box" v-if="roleList && roleList.length > 0">
        <div class="nav-role" v-if="roleList.length == 1">
          <div class="nav-user-name">
            <div class="role-name">
              <span>{{ currentRoleName }}</span>
              {{ userInfo && userInfo.fullname }}
            </div>
            <div class="company-name">{{ bizParentNames }}</div>
          </div>
        </div>
        <el-dropdown
          @command="handleCommand"
          placement="bottom-end"
          trigger="click"
          v-else
        >
          <div class="nav-role">
            <div class="nav-user-name">
              <div class="role-name">
                <span>{{ currentRoleName }}</span>
                {{ userInfo && userInfo.fullname }}
              </div>
              <div class="company-name">{{ bizParentNames }}</div>
            </div>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu class="role-dropdown" slot="dropdown">
            <el-dropdown-item
              :command="item.roleId"
              v-for="item in roleList"
              :key="item.roleId"
            >
              <span :class="{ selected: item.isSelected, 'role-item': true }">{{
                item.roleName
              }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <messageDialog
      ref="messageDialog"
      @handleClose="messageDialogClose"
      :informData="informData"
    ></messageDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStorageToken, clearStorageToken } from "@/utils/user-vali.js";
import messageDialog from "./GetInformation";
import config from "@/setting.js";
import { routerGo, checkCodeInArr } from "@/utils/utils.js"; // 引入跨应用路由跳转
import {
  api_changeRole,
  api_queryMessageNumber,
  api_loginOut,
} from "@/api/user.js";
import { api_queryCount } from "@/api/GetInformation.js";
export default {
  name: "theNav",
  components: { messageDialog },
  data() {
    return {
      full_screen: false, // 是否全屏
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      isComplex: false,
      roleList: [],
      currentRoleName: "",
      informData: {},
      unreadNumber: 0,
      bizParentNames: "",
      // 传值flag阀门
      flag: false,
    };
  },
  computed: {
    skin() {
      if (sessionStorage.getItem("skin")) {
        return sessionStorage.getItem("skin");
      } else {
        return "biaozhun";
      }
    },
    ...mapGetters(["userInfo"]),
  },
  watch: {
    userInfo: {
      handler(newVal) {
        this.updateUserInfo(newVal);
        this.queryMessage();
      },
    },
  },
  mounted() {
    this.init();
    // console.log(123);
  },
  methods: {
    // clickCollapse() {
    //   console.log(' this.flag ', this.flag );
    //   this.flag = !this.flag;
    //   this.$store.commit("menu/FOLDING", this.flag);
    // },
    checkCodeInArr(code) {
      // 权限
      return checkCodeInArr(code);
    },
    // 消息框关闭
    messageDialogClose() {
      this.queryMessage();
    },
    //判断有没有未读的信息
    queryMessage() {
      let buid = sessionStorage.getItem("buid");
      let jfid = this.userInfo.jfid;
      let data = {
        receivedId: jfid,
        buid: buid,
      };
      console.log("data", data);

      api_queryCount(data).then((res) => {
        if (res.msg && res.msg.code == "0000") {
          if (res.data.unreadNumber > 99) {
            this.unreadNumber = "99+";
          } else {
            this.unreadNumber = res.data.unreadNumber;
          }
          this.$set(this, "informData", res.data);
        }
      });
    },
    // 弹出消息框
    messageInit() {
      this.$refs.messageDialog.init();
    },
    updateUserInfo() {
      let roleList = [];
      if (this.userInfo && this.userInfo.currentBizunit) {
        this.bizParentNames = this.userInfo.currentBizunit.parentNames;
      }
      if (
        this.userInfo &&
        this.userInfo.roles &&
        this.userInfo.roles.length > 0
      ) {
        this.userInfo.userRoleFrontShowInfos.map((item) => {
          let roleObj = {
            roleId: item.frontValue,
            roleName: item.frontName,
            isSelected: item.current,
            buid: item.buid,
          };
          if (item.current) {
            this.currentRoleName = item.frontName;
          }
          roleList.push(roleObj);
        });
      }
      this.roleList = roleList;
      console.log(
        "  this.roleList  this.roleList",
        this.currentRoleName,
        this.roleList
      );

      this.roleList.forEach((ele) => {
        if (ele.roleName == this.currentRoleName) {
          console.log("1121", ele.buid);
          window.sessionStorage.setItem("buid", ele.buid);
        }
      });
    },
    init() {
      this.$store.dispatch("app/getUserInfo");
    },
    loginTestEnv() {
      sessionStorage.removeItem("menus");
      let pageUrl = window.location.href;
      let access_token = getStorageToken();
      let redirect_uri = encodeURIComponent(pageUrl);
      // let targetUrl = `${config.baseUrl}/jfzg/uaa/oauth/remove/token?token=${access_token}&redirect_uri=${redirect_uri}`;
      let targetUrl = `${config.baseUrl}/jfzg/uaa/oauth/remove/token?token=${access_token}`;
      clearStorageToken();
      sessionStorage.clear();
      // debugger
      window.location.replace(targetUrl);
    },
    // 退出登录
    logOut() {
      // 原代码
      /* sessionStorage.removeItem("menus");
      let pageUrl = window.location.href;
      console.log(pageUrl);
      let access_token = getStorageToken();
      let redirect_uri = encodeURIComponent(pageUrl);
      // let targetUrl = `${config.baseUrl}/jfzg/uaa/oauth/remove/token?token=${access_token}&redirect_uri=${redirect_uri}`;
      let targetUrl = `${config.baseUrl}/jfzg/uaa/oauth/remove/token?token=${access_token}`;
      clearStorageToken();
      sessionStorage.clear();
      // debugger
      window.location.replace(targetUrl); */
      // this.$router.push("/loginOutBefore");
      // 测试环境
      // let targetUrl = `https://smartgate-test.sz.gov.cn/szzg/loginOut`;
      // 生产环境
      let targetUrl = `https://smartgate.sz.gov.cn/szzg/loginOut`;
      // window.location.href = targetUrl;
      this.createSuperLabel(targetUrl);
    },
    createSuperLabel(url) {
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_self");
      a.setAttribute("id", "ftm-link");
      a.setAttribute("rel", "noreferrer");
      // 防止反复添加
      document.body.appendChild(a);
      a.click();

      // let a = document.createElement("a");
      //   a.setAttribute("href", targetUrl);
      //   a.setAttribute("target", "_self");
      //   a.setAttribute("id", "ftm-link");
      //   a.setAttribute("rel", "noreferrer");
      //   document.body.appendChild(a);
      //   a.click();
      const aNode = document.getElementById("ftm-link");
      if (aNode) {
        document.body.removeChild(aNode);
      }
      /*  window.location.href = targetUrl;
        console.log(targetUrl); */
    },
    // 切换身份事件
    handleCommand(command) {

      console.log("command", command);
      sessionStorage.removeItem("searchData");
      api_changeRole({ fronVlaue: command }).then((res) => {
        if (res.success) {
          routerGo("/base/home");
          location.reload(false)
          // window?.location?.reload?.();

       
        }
      });
    },
    //进入个人设置
    toSetting(label) {
      console.log("label", label);

      if (label == "管理后台") {
        window.open("/opadmin/");
      } else if (label == "密码修改") {
        this.$router.push({
          path: "/set/setinformation",
        });
      } else {
        this.loginTestEnv();
      }
      sessionStorage.setItem("label", label);
      this.$bus.$emit("label", label);
    },
  },
};
</script>

<style lang="scss">
.block {
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0 10px;
}
.role-dropdown {
  .role-item {
    color: #333;
    &.selected {
      color: #1890ff;
    }
  }
  .el-dropdown-menu {
    padding: 0 !important;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #333;
    background-color: #ffffff;
  }
}
.setting-dropdown {
  margin-top: 0px !important;
  margin-left: -46px !important;
  width: 116px;

  .popper__arrow {
    left: 52px !important;
  }
}
.the-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  height: 64px;
  line-height: 64px;
  padding: $header-padding;
  background: $header-background;
  color: $header-color;
  box-sizing: border-box;

  .logo-image-box {
    display: flex;
    align-items: center;
    .logo-image-0 {
      width: 32px;
    }
    .logo-image-1 {
      width: 168px;
      height: 40px;
    }
    .logo-image-2 {
      width: 250px;
    }
    .logo-box {
      display: flex;
      align-items: center;
      .logo-image-1 {
        margin: 0 20px 0 5px;
      }
    }
  }

  &.complex {
    height: 112px;
    flex-shrink: 0;
    .logo-image-box {
      .logo-image-0 {
        width: 42px;
      }
      .logo-box {
        // margin-left: 10px;
        // align-items: flex-start;
        // flex-direction: column;
        // .logo-image-1 {
        //   width: 144px;
        //   margin: 0 0px 8px 0px;
        // }
        left: 20px;
        top: 15px;
        width: 111px;
        height: 26px;
        opacity: 1;
        /** 文本1 */
        font-size: 20px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 26px;
        color: rgba(255, 255, 255, 1);
        text-align: left;
        vertical-align: top;
      }
    }
  }

  .click-area {
    flex-grow: 1;
    height: 100%;
    // cursor: pointer;
  }
  .nav-handle-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30%;
    .allLeft {
      height: 100%;
      display: flex;
      align-items: center;
      border-right: 1px solid white;
      margin-right: 0 20px;
    }
    .icon-control,
    .icon-control-setting {
      padding: 0 10px;

      img {
        width: 24px;
        height: 24px;
        cursor: pointer;
        vertical-align: middle;
      }
    }

    .icon-control {
      position: relative;
      .iconNum {
        min-width: 20px;
        height: 14px;
        line-height: 14px;
        top: 17px;
        left: 25px;
        padding: 0 4px;
        text-align: center;
        border-radius: 8px;
        background-color: #f5222d;
        font-size: 10px;
        color: #fff;
        position: absolute;
      }
    }
    .use-info-box {
      line-height: 1;
      margin-right: 32px;
      .nav-role {
        cursor: pointer;
        display: flex;
        align-items: center;
        color: #fff;
        .nav-user-name {
          text-align: right;
          .role-name {
            font-size: 14px;
            line-height: 20px;
            font-weight: 500;
            span {
              margin-right: 5px;
            }
          }
          .company-name {
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
          }
        }
        .el-icon-arrow-down {
          font-size: 14px;
          margin-left: 7px;
        }
      }
      .el-dropdown {
        color: #fff;
        font-size: 12px;
        font-weight: 400;
      }
    }
    .icon-control-setting {
      .el-dropdown {
        color: #fff;
        font-size: 12px;
        font-weight: 400;
        .el-dropdown-link {
          cursor: pointer;
          display: flex;
          align-items: center;
          line-height: 20px;
        }
      }
    }
  }
  .nav-handle-item + .nav-handle-item {
    margin-left: 12px;
  }

  .logo-image-box {
    display: flex;
    align-items: center;
    .logo-image-0 {
      width: 32px;
    }
    .logo-image-1 {
      width: 168px;
      height: 40px;
    }
    .logo-image-2 {
      width: 250px;
    }
    .logo-box {
      display: flex;
      align-items: center;
      .logo-image-1 {
        margin: 0 20px 0 5px;
      }
    }
  }
}
.theNavDropdown {
  width: 115px;
  // height: 130px;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #efefef !important;
  padding: 4px 0px !important;
  box-sizing: border-box;
  border-radius: 8px !important;
  .el-dropdown-menu__item {
    padding: 0;
    line-height: 34px;
    text-align: center;
    height: 39px;
    border-bottom: 1px dashed #efefef;
    margin: 0 17px;
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-right: 4px;
      display: inline-block;
    }
    i {
      font-size: 16px;
      vertical-align: middle;
      margin-right: 4px;
      display: inline-block;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
      text-indent: 0;
      display: inline-block;
      white-space: nowrap;
    }
    &:hover span {
      color: #1890ff;
    }
    &:hover i {
      color: #1890ff;
    }
  }
  .el-dropdown-menu__item:nth-last-child(2) {
    border-bottom: none !important;
  }
  .el-dropdown-menu__item--divided:before {
    display: none;
  }
  .el-dropdown-menu__item--divided {
    // height: 28px;
    border-color: #e8e8e8;
    i {
      font-size: 17px;
    }
  }
}
</style>
