import router from "@/router/index";
import { setSession } from "@/core/session.js";
const tabs = {
	namespaced: true,
	state: () => ({
		tabsList: [],
		currentPage: null,
		toPath:''
	}),
	mutations: {
		// 新增tabs
		UPDATE_TABS_LIST(state, payload) {
			let tabsList = JSON.parse(sessionStorage.getItem('tabsList')) || []
			const hasTabsItem = tabsList.filter((item) => {
				return item.url == payload.url;
			});
			if (!hasTabsItem.length) {
				tabsList.push(payload);
				state.tabsList = tabsList
				sessionStorage.setItem("tabsList", JSON.stringify(tabsList));
			}
		},
		UPDATE_CURRENT_PAGE(state, payload) {
			state.currentPage = payload;
			setSession("CURRENT_PAGE", payload);
		},
		CHANGE_TABS_LIST(state, val) {
			state.tabsList = val;
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
		},
		TO_PATH(state, val) {
			state.toPath = val;
			sessionStorage.setItem("toPath", state.toPath);
		},
		
	},
	actions: {
		REMOVE_NOT_CURRENT_TAB({ state }, payload) {
			if (state.tabsList.length > 1) {
				// 非当前tab直接删除即可
				const { indexOf } = payload;
				state.tabsList.splice(indexOf, 1);
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			}
		},
		// 删除最后一个tabs标签
		REMOVE_LAST_TAB({ state, commit }, payload) {
			// 第一步、删除
			const { indexOf } = payload;
			state.tabsList.splice(indexOf, 1);
			// 第二步、获取最后一个tabs的name跳转路由
			let index = state.tabsList.length - 1;
			let lastTabsItem = state.tabsList[index];
			commit("UPDATE_CURRENT_PAGE", lastTabsItem.url);
      sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
      router.push({ path: lastTabsItem.url });
		},
		// 删除除最后一个以外得任何一个tab标签
		REMOVE_ANY_TAB({ state, commit }, payload) {
			const { indexOf } = payload;
			let tabsListLength = state.tabsList.length;
			if (state.tabsList.length > 1 && indexOf < tabsListLength) {
				// 第一步：执行删除操作
				state.tabsList.splice(indexOf, 1);
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
				// 第二步：获取删除后面的tabs的name并跳转路由
				let index = indexOf;
				let nextTabsItem = state.tabsList[index];
				commit("UPDATE_CURRENT_PAGE", nextTabsItem.url);
				router.push({ path: nextTabsItem.url });
			}
		},
	},
};
export default tabs;
