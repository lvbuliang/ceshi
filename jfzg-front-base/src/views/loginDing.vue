<template>
  <div
    class="login-container"
    v-loading="loading"
    element-loading-text="ding拼命加载中..."
  ></div>
</template>
<script>
import SETTING from "@/setting";
import { api_oauthToken, getDefaultMenuByToken } from "@/api/user.js";
import { getIdDingWork, getIdWork } from "@/api/schedule/index.js";
import { setStorageToken, setStorageTokenType } from "@/utils/user-vali";
import { routerGo } from "@/utils/utils.js";
export default {
  data() {
    return {
      loading: true,
      str: "",
      userId: "",
      businessId: "",
      scheduleId: "",
      resDatas: [],
      remark: null,
    };
  },
  created() {},
  mounted() {
    this.str = window.location.href;
    this.getCode(this.str);
  },
  methods: {
    getCode(str) {
      let url = new URLSearchParams(str.split("?")[1]);
      this.userId = url.get("jobId") || url.get("userId");
      this.businessId = url.get("businessId");
      this.scheduleId = url.get("scheduleId");
      if (this.userId) {
        this.loginAuto(this.userId);
      } else {
        this.$message.error("请携带用户ID");
        window.open(`${SETTING.baseUrl}/login`, "_self");
      }
    },
    loginAuto(YHDH) {
      let params = {
        grant_type: "userId",
        // 正式用YHDH
        YHDH: YHDH,
      };

      api_oauthToken(params, SETTING.baseUrl)
        .then(async (res) => {
          setStorageToken(res.data.access_token);
          setStorageTokenType(res.data.token_type);
          let response = await getDefaultMenuByToken();
          // console.log(response);

          // 有businessID 待办审核   没有 工作台
          this.remark = response.data[0]
            ? response.data[0].remark
            : "/base/home"; //沙盘
          sessionStorage.setItem("DEFAULT_MENU", this.remark);
          if (!this.scheduleId && !this.businessId) {
            routerGo(this.remark);
            window?.location?.reload?.();
            this.loading = false;
          } else {
            this.goToDing(this.businessId, this.scheduleId);
          }
        })
        .catch((err) => {
          if (err.code == "400") {
            this.$message.error("请先让管理员预制角色和单位");
            window.open(`${SETTING.baseUrl}/login`, "_self");
          }
          this.loading = false;
        });
    },
    goToDing(businessId, scheduleId) {
      if (scheduleId == null) {
        getIdDingWork({ id: businessId }).then((res) => {
          if (res.data) {
            this.resDatas = res.data;
            // debugger
            // 已处理 工作台 status 1
            if(this.resDatas.status == 1) {
              this.$message.success("待办已处理");
              routerGo(this.remark);
              window?.location?.reload?.();
              this.loading = false;
            }else {
              this.gotoPc(this.resDatas);
            }
          } else {
            routerGo(this.remark);
            window?.location?.reload?.();
            this.loading = false;
          }
        });
      }
      if (businessId == null) {
        getIdWork({ id: scheduleId }).then((res) => {
          if (res.data) {
            this.resDatas = res.data;
            if(this.resDatas.status == 1) {
              this.$message.success("待办已处理");
              routerGo(this.remark);
              window?.location?.reload?.();
              this.loading = false;
            }else {
              this.gotoPc(this.resDatas);
            }
          } else {
            routerGo(this.remark);
            window?.location?.reload?.();
            this.loading = false;
          }
        });
      }
    },
    gotoPc(resDatas) {
      if (resDatas.length != 0) {
        sessionStorage.setItem("htmlData", resDatas.moduleName || "");

        if (resDatas.schduleUrl) {
          // this.$router.push({
          //   path: resDatas.schduleUrl,
          // });
          window.open(resDatas.schduleUrl, "_self");
          let element = {
            url: resDatas.schduleUrl,
            title: resDatas.moduleName,
          };

          // 更新tabs页签
          this.$store.commit("tabs/UPDATE_TABS_LIST", element);
          this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
          this.loading = false;
          // window?.location?.reload?.();
        } else {
          routerGo(this.remark);
          window?.location?.reload?.();
          this.loading = false;
        }
      }
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
