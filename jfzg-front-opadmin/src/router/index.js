import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
import Layout from "@/layout";
//数据管理
import accountManage from "./modules/accountManage.js";
import unitManage from "./modules/unitManage.js";
import roleManage from "./modules/roleManage.js";
import projectinfomanagement from "./modules/projectinfomanagement.js";
import configmanage from "./modules/configmanage.js";
import dictmanagement from "./modules/dictmanagement.js";
import realnamemanagement from "./modules/realnamemanagement.js";
// import reportmanagement from "./modules/reportmanagement.js";
import tempmanagement from "./modules/tempmanagement.js";
import work from "./modules/work.js";
import autotemplatemanagement from "./modules/autotemplatemanagement.js";
import labelmanagement from "./modules/labelmanagement.js";
import projectManage from "./modules/projectManage.js";
import zichan from "./modules/zichan.js";
const a = 1;//
export const constantRoutes = [
	{
		path: "/",
		redirect: "/tempmanagement/temList",
		hidden: true,
	},
	{
		path: "/notJurIsdiction",
		component: Layout,
		hidden: true,
		name: "noJurisdiction",
		meta: {
			title: "",
			type: "noJurisdiction",
			hideSide: true,
			hideBread: true,
		},
	},
	// tempmanagement,
	// roleManage,
	// accountManage,
	// unitManage,
	// work,
	// projectinfomanagement,
	// dictmanagement,
	// configmanage,
	// autotemplatemanagement,
	// labelmanagement,
	// projectManage
];
export const asyncRoutes = [
	accountManage,
	unitManage,
	tempmanagement,
	realnamemanagement,
	projectinfomanagement,
	dictmanagement,
	configmanage,
	// reportmanagement,
	roleManage,
	work,
	autotemplatemanagement,
	labelmanagement,
	projectManage,
	zichan
];
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};
const router = new VueRouter({
	mode: "hash",
	scrollBehavior: () => ({
		y: 0
	}),
	base: process.env.BASE_URL,
	routes: constantRoutes,
});

export default router;
