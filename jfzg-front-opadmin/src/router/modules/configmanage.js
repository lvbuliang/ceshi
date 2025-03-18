import Layout from "@/layout";
const configmanage = {
  path: "/configmanage",
  component: Layout,
  redirect: "noRedirect",
  alwaysShow: true, // will always show the root menu
  name: "configmanage",
  meta: {
    title: "配置管理",
    icon: "configure",
    code: "M010_008",
  },
  children: [
    {
      path: "messagem",
      component: () => import("@/views/configmanagement/messagem"),
      name: "messagem",
      meta: {
        title: "消息设置",
        code: "M010_008_001",
      },
    },
    {
      path: "emailset",
      component: () => import("@/views/configmanagement/emailset"),
      name: "emailset",
      meta: {
        title: "邮箱模板设置",
        code: "M010_008_002",
      },
    },
    {
      path: "projectmoney",
      component: () => import("@/views/configmanagement/projectMoney"),
      name: "projectmoney",
      meta: {
        title: "项目金额配置",
        code: "M010_008_004",
      },
    },
    {
      path: "projectKeyList",
      component: () => import("@/views/configmanagement/projectKeyList"),
      name: "projectKeyList",
      meta: {
        title: "项目密钥配置",
        code: "M010_008_005",
      },
    },
    {
      path: "earlyWarning",
      component: () => import("@/views/configmanagement/earlyWarning"),
      name: "earlyWarning",
      meta: {
        title: "预警规则配置",
        code: "M010_008_006",
      },
    },
    {
      path: "reviewMembers",
      component: () => import("@/views/configmanagement/reviewMembers/list"),
      name: "reviewMembers",
      meta: {
        title: "评审小组成员配置",
        code: "M010_008_007",
      },
    },
    //  {
    //     path: 'timem',
    //     component: () => import('@/views/configmanagement/timem'),
    //     name: 'timem',
    //     meta: {
    //         title: '时间提醒设置',
    //         code: 'M010_008_002'
    //     }
    // },
    // {
    //     path: 'commwarnset',
    //     component: () => import('@/views/configmanagement/commwarnset'),
    //     name: 'commwarnset',
    //     meta: {
    //         title: '待办预警提醒设置',
    //         code: 'M010_008_001'
    //     }
    // },
    // {
    //     path: 'others',
    //     component: () => import('@/views/configmanagement/others'),
    //     name: 'others',
    //     meta: {
    //         title: '其他配置',
    //         // code: 'M010_008_001'
    //     }
    // }
  ],
};
export default configmanage;
