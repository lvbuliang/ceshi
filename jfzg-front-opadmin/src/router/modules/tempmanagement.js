import Layout from "@/layout";
const tempmanagement = {
	path: "/tempmanagement",
	component: Layout,
	redirect: "noRedirect",
	alwaysShow: true, // will always show the root menu
	name: "tempmanagement",
	meta: {
		title: "表单生成器",
		icon: "template",
		code: "M010_004",
	},
	children: [
		{
			path: "temList",
			component: () => import("@/views/tempmanagement/form/list"),
			name: "temList",
			meta: {
				title: "模板列表",
				code: "M010_004_001",
				lv: 2,
			},
			children: [

			],
		},
		{
			path: "headerList",
			component: () => import("@/views/tempmanagement/header/list"),
			name: "headerList",
			meta: {
				title: "表头管理",
				code: "M010_004_002",
				lv: 2,
			},
			children: [
				{
					path: 'edit',
					component: () => import('@/views/tempmanagement/header/children/edit.vue'),
					name: 'headerEdit',
					hidden: true,
					meta: {
						title: '修改',
					}
				},
			],
		},
		{
			path: "temAdd",
			name: "temAdd",
			alwaysShow: false,
			hidden: true,
			component: () =>
				import(
					"@/views/tempmanagement/form/child/formadd/index"
				),
			meta: {
				title: "新增模版",
			},
		},
	],
};
export default tempmanagement;
