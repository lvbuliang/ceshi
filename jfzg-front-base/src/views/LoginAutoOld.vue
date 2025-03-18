<template>
  <div
    class="login-container"
    v-loading="loading"
    element-loading-text="拼命加载中..."
  ></div>
</template>
<script>
import SETTING from "@/setting";
import { api_oauthToken, getDefaultMenuByToken } from "@/api/user.js";
import { setStorageToken, setStorageTokenType } from "@/utils/user-vali";
import { routerGo } from "@/utils/utils.js";
export default {
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.loginAuto();
  },
  methods: {
    loginAuto() {
      // 获取userId、platform
      const YHDH = this.getParameterByName("YHDH");
      //   const platform = this.getParameterByName("platform");
      // console.log("YHDH", YHDH);
      // debugger;
      //   console.log("platform", platform);
      // this.loading = true;
      let params = {
        grant_type: "userId",
        // 测试暂用userId
        // YHDH: "CMJ93iyEyzvkcALkfinhWA==",
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
          let remark = response.data[0]
            ? response.data[0].remark
            : "/base/sandTable"; //沙盘
          sessionStorage.setItem("DEFAULT_MENU", remark);
          routerGo(remark);
          console.log("login_fullname.remark", remark);
          window?.location?.reload?.();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
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