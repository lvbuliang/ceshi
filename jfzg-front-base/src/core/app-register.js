import {
	registerMicroApps,
	runAfterFirstMounted,
	initGlobalState,
	start
} from "qiankun"; //setDefaultMountApp, start,
import store from "../store";
/**
 * @name 导入想传递给子应用的方法，其他类型的数据皆可按此方式传递
 * @description emit建议主要为提供子应用调用主应用方法的途径
 */
import emits from "../utils/emit";
/**
 * @name 导入qiankun应用间通信机制appStore
 */
import appStore from "../utils/app-store";
/**
 * @name 导入全局常量给子应用
 */
import GLOBAL from "../global";
/**
 * @name 声明子应用挂载dom，如果不需要做keep-alive，则只需要一个dom即可；
 */
const appContainer = "#subapp-viewport";

import instance from "./render";
import config from '@/setting.js'

/**
 * @name 声明要传递给子应用的信息
 * @param data 主应要传递给子应用的数据类信息
 * @param emits 主应要传递给子应用的方法类信息
 * @param GLOBAL 主应要传递给子应用的全局常量
 * @param utils 主应要传递给子应用的工具类信息（只是一种方案）
 * @param components 主应要传递给子应用的组件类信息（只是一种方案）
 */
let props = {
	data: store.getters,
	emits,
	GLOBAL,
};

// 定义loader方法，loading改变时，将变量赋值给App.vue的data中的isLoading
function loader(loading) {
	if (instance && instance.$children) {
		// instance.$children[0] 是App.vue，此时直接改动App.vue的isLoading
		instance.$children[0].isLoadApp = loading;
	}
}

/**
 * @name 启用qiankun微前端应用
 * @param {Array} list 应用注册表信息
 */
const qianKunStart = (list) => {
	/**
	 * @name 处理子应用注册表数据
	 */
	const isDev = process.env.NODE_ENV === 'development'
	const apps = []; // 子应用数组盒子
	const appMaps = new Map() // 用来判断相同的routerBase不重复放到apps里
	// let defaultApp = null; // 默认注册应用路由前缀
	list.forEach((i) => {
		if (!isDev && i.entry) {
			if (i.entry.startsWith('http://') || i.entry.startsWith('https://')) {
				// 绝对地址，不用改
			} else {
				i.entry = config.baseUrl + i.entry
			}
		}
		if (!appMaps.has(i.routerBase)) {
			apps.push({
				name: i.module,
				entry: i.entry,
				container: appContainer,
				activeRule: i.routerBase,
				loader,
				props: {
					...props,
					routes: i.data,
					routerBase: i.routerBase,
					store: store,
					// 将experimentalStyleIsolation配置设为false
					experimentalStyleIsolation: false
				},
			});;
			appMaps.set(i.routerBase, i.entry)
		}
		// if (i.defaultRegister) defaultApp = i.routerBase;
	});

	/**
	 * @name 注册子应用
	 * @param {Array} list subApps
	 */
	registerMicroApps(apps, {
		beforeLoad: [(app) => { }],
		beforeMount: [(app) => { }],
		afterMount: [(app) => { }],

	});
	start({
		prefetch: false, //关闭预加载
		// 关键修改：调整样式隔离策略
		sandbox: {
			// 修改为false或调整为较宽松的隔离模式
			experimentalStyleIsolation: false,
			// 使用严格模式下的样式前缀策略而非Shadow DOM
			strictStyleIsolation: false
		}
	})

	/**
	 * @name 设置默认进入的子应用
	 * @param {String} 需要进入的子应用路由前缀
	 */
	// setDefaultMountApp(defaultApp + '/');

	/**
	 * @name 启动微前端
	 */
	// start();

	/**
	 * @name 微前端启动进入第一个子应用后回调函数
	 */
	runAfterFirstMounted(() => { });

	/**
	 * @name 启动qiankun应用间通信机制
	 */
	appStore(initGlobalState);
};

export default qianKunStart;
