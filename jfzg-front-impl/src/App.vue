<template>
	<div id="app">
    
		<router-view />
	</div>
</template>

<script>
import { buriedPointSave } from "@/api";

export default {
	computed: {
		loading() {
			return this.$store.state.appstore.loading;
		},
	},
	data() {
		return {
			loadMask: null,
		};
	},

	created() {
		const _this = this;
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
								// buriedPointSave(params);
							}
						});
					}
				});
		// this.loadMask = this.$loading({
		//     lock: true,
		//     target: "masterRoot",
		// });
		this.$store.dispatch("userinfo/getUserInfo");
	},
	watch: {
		loading: function(n) {
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
	},
};
</script>

<style lang="scss">
</style>
