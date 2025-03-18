<template>
  <div></div>
</template>
<script>
import { getStorageToken, clearStorageToken } from "@/utils/user-vali.js";
import { setStorageToken, setStorageTokenType } from "@/utils/user-vali";
import config from "@/setting.js";
import { api_loginOut, api_removeToken } from "@/api/user.js";
export default {
  data() {
    return {};
  },
  created() {
    this.loginOutBefore();
  },
  methods: {
    loginOutBefore() {
      sessionStorage.removeItem("menus");
      clearStorageToken();
      sessionStorage.clear();
      let targetUrl = `https://smartgate-test.sz.gov.cn/szzg/loginOut`;
      let a = document.createElement("a");
      a.setAttribute("href", targetUrl);
      a.setAttribute("target", "_self");
      a.setAttribute("id", "ftm-link");
      a.setAttribute("rel", "noreferrer");
      document.body.appendChild(a);
      a.click();
      const aNode = document.getElementById("ftm-link");
      if (aNode) {
        document.body.removeChild(aNode);
      }
      /*  window.location.href = targetUrl;
      console.log(targetUrl); */
    },
  },
};
</script>