<template>
	<router-view :key="keys"></router-view>
</template>

<script>
import { buriedPointSave } from "@/api/home";

export default {
	computed: {
		loading() {
			return this.$store.state.app.loading;
		},
		keys(){
			return sessionStorage.getItem('CURRENT_PAGE')
		}
	},
	data() {
		return {
			loadMask: null,
			isLoadApp: false,
		};
	},
	mounted() {
		const _this = this;
		window.onload = function() {
			document
				.querySelector("body")
				.addEventListener("click", function(event) {
					const ev = window.event || event; // 解决IE事件对象兼容
					const path =
						ev.path || (event.composedPath && event.composedPath()); // 解决Safari和firefox关于path的兼容
            if (path) {
              path.forEach((res) => {
                if (
                  res.tagName === "BUTTON" &&
                  _this.$route.meta.busiType
                ) {
                  let params = {
                    moduleCode: _this.$route.meta.busiType,
                    requestAddr: window.location.href,
                    operatorType: navigator.userAgent.match(
                      /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i
                    )
                      ? 2
                      : 1,
                    operateName: JSON.parse(
                      sessionStorage.getItem("userInfo")
                    ).fullname,
                    operateIp: sessionStorage.getItem("IP"),
                    status: 1,
                    buriedPointType: 2,
                    buttonClassification: res.className,
                    buttonOperate: res.name || res.innerText,
                    buttonEvent: "click",
                  };
                //   buriedPointSave(params);
                }
              });
            }
          });
		};
	},
	watch: {
		loading: function(n) {
			// console.log('App.loading.n', n)
			if (n === 0) {
				if (this.loadMask) {
					this.loadMask.close();
				}
			} else {
				this.loadMask = this.$loading({
					lock: true,
					target: "masterRoot",
				});
			}
		},
		isLoadApp(val) {
			// console.log('App.isLoadApp', val)
			this.$store.commit("app/SET_APP_LOAD", val);
		},
	},
};
</script>

<style>
@import url("./assets/lanting/lanting.css");
</style>
