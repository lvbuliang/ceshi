import store from "@/store";
import { getArrayIndex } from '@/utils/utils'
/**
 * @name 导入注册并启动微应用函数
 */

/**
 * @name 启动qiankun应用间通信机制
 * @param {Function} initGlobalState 官方通信函数
 * @description 注意：主应用是从qiankun中导出的initGlobalState方法，
 * @description 注意：子应用是附加在props上的onGlobalStateChange, setGlobalState方法（只用主应用注册了通信才会有）
 */
const appStore = (initGlobalState) => {
	/**
	 * @name 初始化数据内容
	 */
	const {
		onGlobalStateChange,
		setGlobalState
	} = initGlobalState({
		msg: '',
		token: '',
		appsRefresh: false,
	});

	/**
	 * @name 监听数据变动
	 * @param {Function} 监听到数据发生改变后的回调函数
	 * @des 将监听到的数据存入vuex
	 */
	onGlobalStateChange((value, prev) => {
		if (value.ignore === 'changeRoute') {
			// 接收子应用发送过来的数据，获取缓存中的页签列表和当前路径，以便后面更新
			let tabsList = JSON.parse(sessionStorage.getItem('tabsList'))
			let currentPage = sessionStorage.getItem('CURRENT_PAGE')
			// 已经打开的所有标签页的数组
			let urlArr = tabsList.map(res => {
				return res.url
			})
			let newTabsList = JSON.parse(sessionStorage.getItem('tabsList')) // 新的tab页签数据
			if (urlArr.includes(value.msg.url)) {
				// 如果要打开的url是之前打开过的就重新赋值currentpage
				currentPage = value.msg.url
			} else if (value.msg.from === "workBench" || (value.msg.meta && value.msg.meta.type == 'add')) {
				// 如果是从工作台点待办或者点击的模块新增就全部打开新页签
				newTabsList.push(value.msg)
				currentPage = value.msg.url
			} else {
				// 循环页签列表，根据currentpage数据更新页签url和title，再更新store里面的数据和缓存里面的数据
				newTabsList = tabsList.map(res => {
					if (res.url === sessionStorage.getItem('CURRENT_PAGE')) {
						res = value.msg
						currentPage = value.msg.url
					}
					return res
				})
			}
			store.commit("tabs/UPDATE_CURRENT_PAGE", currentPage);
			sessionStorage.setItem('CURRENT_PAGE', currentPage)
			store.commit("tabs/CHANGE_TABS_LIST", newTabsList);
			sessionStorage.setItem('tabsList', JSON.stringify(newTabsList))
		} else if (value.ignore === 'upDataAddTab') {
			// 子应用提交表单之后请求更新对应的tabList
			let tabsList = JSON.parse(sessionStorage.getItem('tabsList'))
			let newTabsList = []
			// 循环页签列表，找到和子应用传过来的url完全相等的页签，更新这个页签
			newTabsList = tabsList.map(res => {
				if (res.url === value.msg.url) {
					res = value.msg
				}
				return res
			})
			store.commit("tabs/CHANGE_TABS_LIST", newTabsList);
			sessionStorage.setItem('tabsList', JSON.stringify(newTabsList))
		} else if (value.ignore === 'closeAddTab') {
			// 子应用提交表单三秒之后请求删除对应tab页签
			let tabsList = JSON.parse(sessionStorage.getItem('tabsList'))
			let indexOf = getArrayIndex(tabsList, value.msg.url)
			let timeout = 3000
			if (value.msg.timeout !== undefined) {
				timeout = value.msg.timeout
			}
			setTimeout(() => {
				let currentPage = sessionStorage.getItem('CURRENT_PAGE')
				if (currentPage === value.msg.url) {
					// 如果删的是当前页
					if (indexOf == tabsList.length - 1) {
						// 要删除的是最后一项
						store.dispatch("tabs/REMOVE_LAST_TAB", {
							indexOf,
						});
					} else {
						store.dispatch("tabs/REMOVE_ANY_TAB", {
							indexOf,
						});
					}
				} else {
					if (indexOf !== -1 && indexOf) {
						store.dispatch("tabs/REMOVE_NOT_CURRENT_TAB", {
							indexOf,
						});
					}
				}
				
			}, timeout)
			
		}
		'msg' in value && store.dispatch('appstore/setMsg', value.msg);
		value.token && store.dispatch('app/setToken', value.token);
		value.appsRefresh && window?.location?.reload?.();
	});

	/**
	 * @name 改变数据并向所有应用广播
	 */
	setGlobalState({
		ignore: 'master',
		msg: '来自master动态设定的消息',
	});

	window.setGlobalState = setGlobalState
}

export default appStore;
