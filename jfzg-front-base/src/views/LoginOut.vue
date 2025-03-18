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
    this.loginOut();
  },
  methods: {
    loginOut() {
      /* console.log("退出");
      //   测试用
      /*      setStorageToken("2482e402-85ef-4590-8930-3aabde47dd7a");
      debugger; */
      // sessionStorage.removeItem("menus");
      //   可能不需要
      //   let access_token = getStorageToken();
      //   可能不需要
      //   let targetUrl = `${config.baseUrl}/jfzg/uaa/oauth/remove/token?token=${access_token}`;
      // clearStorageToken();
      // sessionStorage.clear();
      //   可能不需要
      //   window.location.replace(targetUrl); */
      /* sessionStorage.removeItem("menus");
      clearStorageToken();
      sessionStorage.clear();
      setTimeout(() => {
        let timestamp = parseInt(new Date().getTime() / 1000);
        let targetUrl = `https://smartgate-test.sz.gov.cn/idp/oidc/endsession?id_token_hint=JFZGjfh&post_logout_redirect_uri=https://smartgate-test.sz.gov.cn/_tif_logout_/?url=/szzg/?timestamp=${timestamp}`;
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
        console.log("2222");
      }, 1000);

      console.log("1111"); */
      /*   let access_token = getStorageToken();
      api_removeToken(access_token).then((res) => {
        console.log("res", res);
        // if (res.msg.code == "0000") {
        sessionStorage.removeItem("menus");
        clearStorageToken();
        sessionStorage.clear();
        let timestamp = parseInt(new Date().getTime() / 1000);
        let targetUrl = `https://smartgate-test.sz.gov.cn/idp/oidc/endsession?id_token_hint=JFZGjfh&post_logout_redirect_uri=https://smartgate-test.sz.gov.cn/_tif_logout_/?url=/szzg/?timestamp=${timestamp}`;
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
        console.log("1111");
        // }
      }); */
      /*      sessionStorage.removeItem("menus");
      clearStorageToken();
      sessionStorage.clear(); */
      /*       let timestamp = parseInt(new Date().getTime() / 1000);
      let urlobj = "?url=/szzg/?timestamp=";
      let urlobj2 = encodeURIComponent(urlobj);
      let targetUrl = `https://smartgate-test.sz.gov.cn/idp/oidc/endsession?id_token_hint=JFZGjfh&post_logout_redirect_uri=https://smartgate-test.sz.gov.cn/_tif_logout_/${urlobj2}${timestamp}`;
      // let targetUrl = `https://smartgate-test.sz.gov.cn/idp/authcenter/ActionAuthChain?entityId=JFZGjfh`;
      window.location.href = targetUrl; */
      // console.log(targetUrl);
      let timestamp = parseInt(new Date().getTime() / 1000);
      // let urlobj = `?url=/szzg/?timestamp=${timestamp}`;
      /*  let targetUrl =
        "https://smartgate-test.sz.gov.cn/idp/oidc/endsession?id_token_hint=JFZGjfh&post_logout_redirect_uri=https://smartgate-test.sz.gov.cn/_tif_logout_/" +
        urlobj; */
      // 测试环境
      // let targetUrl = `https://smartgate-test.sz.gov.cn/idp/oidc/endsession?id_token_hint=JFZGjfh&post_logout_redirect_uri=https://smartgate-test.sz.gov.cn/tif_logout/?url=/szzg/apiLogin?timestamp=${timestamp}`;
      // 生产环境
      let targetUrl = `https://smartgate.sz.gov.cn/idp/oidc/endsession?id_token_hint=JFZGjfh&post_logout_redirect_uri=https://smartgate.sz.gov.cn/tif_logout/?url=/szzg/apiLogin?timestamp=${timestamp}`;
      // let targetUrl = `https://smartgate-test.sz.gov.cn/idp/authcenter/ActionAuthChain?entityId=JFZGjfh`;
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
  },
};
</script>