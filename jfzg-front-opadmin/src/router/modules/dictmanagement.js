import Layout from "@/layout";
const dictmanagement = {
	path: "/dictmanagement",
	component: Layout,
	redirect: "noRedirect",
	alwaysShow: true, // will always show the root menu
	name: "字典管理",
	meta: {
		title: "字典管理",
		icon: "dictionaries",
		code: "M010_005",
	},
	children: [
		{
			path: "formList",
			component: () => import("@/views/dictmanagement/formList"),
			name: "formList",
			meta: {
				title: "关联表单",
				code: "M010_005_001",
			},
		},
		{
			path: "dictlist",
			component: () => import("@/views/dictmanagement/dictlist"),
			name: "dictlist",
			meta: {
				title: "字典列表",
				code: "M010_005_002",
			},
		},
		// {
		// 	path: "servelist",
		// 	component: () =>
		// 		import("@/views/dictmanagement/children/servelist"),
		// 	name: "servelist",
		// 	meta: {
		// 		title: "服务能力",
		// 		code: "M010_005_002",
		// 	},
		// },
		// {
		// 	path: "careerDirection",
		// 	component: () =>
		// 		import("@/views/careerDirection/children/servelist"),
		// 	name: "careerDirection",
		// 	meta: {
		// 		title: "行业方向",
		// 		code: "M010_005_003",
		// 	},
		// },
	],
};
export default dictmanagement;
