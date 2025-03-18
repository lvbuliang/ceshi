<template>
  <div
    class="login-container"
    v-loading="loading"
    element-loading-text="拼命加载中..."
  ></div>
</template>
<script>
import SETTING from "@/setting";
import {
  api_oauthToken,
  getDefaultMenuByToken,
  getTokenByCode,
  codeLogin,
} from "@/api/user.js";
import { getIdDingWork } from "@/api/schedule/index.js";
import { setStorageToken, setStorageTokenType } from "@/utils/user-vali";
import { routerGo } from "@/utils/utils.js";
import srtracetrack from "../../../jfzg-front-h5/pages/approvalComponents/srtracetrack";
export default {
  data() {
    return {
      loading: true,
      str: "",
      code: "",
      businessId: "",
    };
  },
  created() {},
  mounted() {
    this.str = window.location.href;
    // this.str = "http://222.143.68.86:10081/loginAuto"; --> 获取code 工作台
    // this.str = "http://222.143.68.86:10081/loginAuto?businessId=25"; --》 带着id 重定向获取code 带回来 到待办
    // this.str = "http://222.143.68.86:10081/loginAuto?code=123"; --》 工作台
    // this.str = "http://222.143.68.86:10081/loginAuto?code=123&&businessId==12"; --》 

    if (this.str != "") {
      this.getCode(this.str);
    }
  },
  methods: {
    isNull(str) {
      let flag;
      ["", null, undefined, "null", "undefined"].includes(str)
        ? (flag = false)
        : (flag = true);
      return flag;
    },
    // 获取链接参数
    getCode(str) {
      let url = new URLSearchParams(str.split("?")[1]);
      this.code = url.get("code");
      this.businessId = url.get("businessId");
      // if(this.isNull(this.code)) {
      //   this.getToken()
      // } else {
      //   this.isHaveBusinessId()
        
      // }
      if (str.includes("code")) {
        // 有code字段并且不为空
        if (this.isNull(this.code)) {
          this.getToken()
        } else {
          window.open(
            `http://sso.eathink.com.cn/oauth2/authorize?response_type=code&client_id=7b3ea97a6758d02e2e966888ef013e38&redirect_uri=${SETTING.baseUrl}/loginAuto`,
            "_self"
          );
        }
      } else {
        window.open(
          `http://sso.eathink.com.cn/oauth2/authorize?response_type=code&client_id=7b3ea97a6758d02e2e966888ef013e38&redirect_uri=${SETTING.baseUrl}/loginAuto`,
          "_self"
        );
      }
    },
    // 是否有businessId或者code
    // isHaveBusinessId() {

    // },
    getToken() {
      getTokenByCode({ code: this.code }).then((res) => {
        if (res.data) {
          console.log(`1-code`, res.data);
          if (res.data.code == 200) {
            // 获取userId
            this.getUserId(res.data.data.access_token);
          } else {
            // 重定向到登录
            this.$message.error(res.data.msg);
            window.open(
              `http://sso.eathink.com.cn/oauth2/authorize?response_type=code&client_id=7b3ea97a6758d02e2e966888ef013e38&redirect_uri=${SETTING.baseUrl}/loginAuto`,
              "_self"
            );
          }
        }
      });
    },
    getUserId(token) {
      console.log("-----------", token);
      codeLogin(token)
        .then((response) => {
          if (response.data.data != "500") {
            // 自动登录
            this.loginAuto(response.data.data); // userId
          } else {
            // 重定向到登录
            this.$message.error(res.data.msg);
            window.open(
              `http://sso.eathink.com.cn/oauth2/authorize?response_type=code&client_id=7b3ea97a6758d02e2e966888ef013e38&redirect_uri=${SETTING.baseUrl}/loginAuto`,
              "_self"
            );
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    loginAuto(YHDH) {
      console.log("YHDH", YHDH);
      // 获取userId、platform
      // const YHDH = this.getParameterByName("YHDH");
      // const platform = this.getParameterByName("platform");
      // console.log("YHDH", YHDH);
      // debugger;
      //   console.log("platform", platform);
      // this.loading = true;
      let params = {
        grant_type: "userId",
        // 测试暂用userId
        // YHDH: "CMJ93iyEyzvkcALkfinhWA==",
        // YHDH: "a0RJWFk2V0dkL1c4VmxiYkYrRDZVdz09",
        // 正式用YHDH
        YHDH: YHDH,
        // platform: platform,
      };

      api_oauthToken(params, SETTING.baseUrl)
        .then(async (res) => {
          setStorageToken(res.data.access_token);
          setStorageTokenType(res.data.token_type);
          let response = await getDefaultMenuByToken();
          // console.log(response);

          // 有businessID 待办审核   没有 工作台
          let remark = response.data[0]
            ? response.data[0].remark
            : "/base/home"; //沙盘
          sessionStorage.setItem("DEFAULT_MENU", remark);

          //           // 有businessId并且不为空
          //           if (str.includes("businessId") && this.isNull(this.businessId)) {
          //   this.getToken()
          // }else {
          //   // 有businessId但是为空
          //   window.open(
          //     `http://sso.eathink.com.cn/oauth2/authorize?response_type=code&client_id=7b3ea97a6758d02e2e966888ef013e38&redirect_uri=${SETTING.baseUrl}/loginAuto?businessId=${this.businessId}`,
          //     "_self"
          //   );
          // }

          // id 
          if (this.isNull(this.businessId)) {
            // 待办
            this.gotoD(this.businessId);
          } else {
            routerGo(remark);
            window?.location?.reload?.();
            this.loading = false;
          }
        })
        .catch((err) => {
          if (err.code == "400") {
            this.$message.error("请先让管理员预制角色和单位");
            window.open(
              `http://sso.eathink.com.cn/oauth2/authorize?response_type=code&client_id=7b3ea97a6758d02e2e966888ef013e38&redirect_uri=${SETTING.baseUrl}/loginAuto?businessId=${this.businessId}`,
              "_self"
            );
          }
          this.loading = false;
        });
    },
    gotoD(businessId) {
      getIdDingWork({ id: businessId }).then((res) => {
        if (res.data) {
          console.log(res.data, "待办数据");
          // 获取待办数据

          sessionStorage.setItem("htmlData", res.data.moduleName || "");
          // 已处理待办
          if (res.data.status == 1) {
            this.$message.success("待办已处理");
            routerGo(this.remark);
            window?.location?.reload?.();
            this.loading = false;
          } else {
            if (res.data.schduleUrl) {
              // this.$router.push({
              //   path: res.data.schduleUrl,
              // });
              window.open(res.data.schduleUrl, "_self");
              let element = {
                url: res.data.schduleUrl,
                title: res.data.moduleName,
              };

              // 更新tabs页签
              this.$store.commit("tabs/UPDATE_TABS_LIST", element);
              this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
              // window?.location?.reload?.();
              this.loading = false;
            } else {
              window.open(
                `http://sso.eathink.com.cn/oauth2/authorize?response_type=code&client_id=7b3ea97a6758d02e2e966888ef013e38&redirect_uri=${SETTING.baseUrl}/loginAuto?businessId=${this.businessId}`,
                "_self"
              );
            }
          }
        } else {
          window.open(
            `http://sso.eathink.com.cn/oauth2/authorize?response_type=code&client_id=7b3ea97a6758d02e2e966888ef013e38&redirect_uri=${SETTING.baseUrl}/loginAuto?businessId=${this.businessId}`,
            "_self"
          );
        }
      });
    },
    // loginAuto() {
    //   // 获取userId、platform
    //   const YHDH = this.getParameterByName("YHDH");
    //     // const platform = this.getParameterByName("platform");
    //   // console.log("YHDH", YHDH);
    //   // debugger;
    //   //   console.log("platform", platform);
    //   // this.loading = true;
    //   let params = {
    //     grant_type: "userId",
    //     // 测试暂用userId
    //     // YHDH: "CMJ93iyEyzvkcALkfinhWA==",
    //     // YHDH: "a0RJWFk2V0dkL1c4VmxiYkYrRDZVdz09",
    //     // 正式用YHDH
    //     YHDH: YHDH,
    //     // platform: platform,
    //   };

    //   api_oauthToken(params, SETTING.baseUrl)
    //     .then(async (res) => {
    //       setStorageToken(res.data.access_token);
    //       setStorageTokenType(res.data.token_type);
    //       let response = await getDefaultMenuByToken();
    //       // console.log(response);
    //       let remark = response.data[0]
    //         ? response.data[0].remark
    //         : "/base/home"; //沙盘
    //       sessionStorage.setItem("DEFAULT_MENU", remark);
    //       routerGo(remark);
    //       console.log("login_fullname.remark", remark);
    //       window?.location?.reload?.();
    //       this.loading = false;
    //     })
    //     .catch(() => {
    //       this.loading = false;
    //     });
    // },
    // 获取地址栏指定参数
    getParameterByName(name) {
      name = name.replace(/[\[\]]/g, "\\$&");
      const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
      // console.log("regex", regex);
      const results = regex.exec(window.location.href);
      /* const results = regex.exec(
        "http://192.168.1.155:81/loginAuto?YHDH=CMJ93iyEyzvkcALkfinhWA=="
      ); */
      // console.log("resultes", results);
      // console.log("resultes[2]", results[2]);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
  },
};
</script>
<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
}
</style>
