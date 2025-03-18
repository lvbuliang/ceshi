import Layout from "@/layout";
const unitManage = {
  path: "/work",
  component: Layout,
  redirect: "noRedirect",
  alwaysShow: true, // will always show the root menu
  name: "work",
  meta: {
    title: "工作流",
    icon: "work",
    code: "M010_009",
  },

  children: [
    {
      path: "process",
      component: () => import("@/views/workflow/process"),
      name: "process",
      meta: {
        title: "流程定义列表",
        lv: 2,
        code: "M010_009_001",
      },
      children: [
        {
          path: 'milestlistdetail',
          component: () => import('@/views/tempmanagement/milest/children/milestlistdetail.vue'),
          name: 'milestlistdetail',
          hidden: true,
          meta: {
            title: '设置里程碑阶段',
            // code: 'M010_008_003'
          }
        },
      ]
    },
    {
      path: "processList",
      component: () => import("@/views/workflow/processList"),
      name: "processList",
      meta: {
        title: "流程模型列表",
        lv: 2,
        code: "M010_009_002",
      },
      children: [
        {
          path: "config",
          component: () => import("@/views/workflow/config"),
          name: "config",
          hidden: true,
          meta: {
            title: "工作流配置",
            // code: "M010_009_003",
          },
        },
      ]
    },
    {
      path: "workEdit",
      name: "workEdit",
      hidden: true,
      meta: {
        title: "流程编辑",
      },
      component: () => import("@/views/workflow/iframe"),
    },
    {
      path: "tool",
      component: () => import("@/views/tool/index"),
      name: "tool",
      meta: {
        title: "工作流参数配置",
        code: "M010_009_003",
      },
    },

  ],
};
export default unitManage;
