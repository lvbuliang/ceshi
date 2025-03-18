
import Layout from '@/layout'
const configmanage = {
  path: '/reportmanagement',
  component: Layout,
  redirect: { name: 'lichengbeiList' },
  alwaysShow: true, // will always show the root menu
  name: '模板管理',
  meta: {
    title: '模板管理',
    icon: 'dictionaries',
    code: 'M010_010'
  },
  children: [
    {
        path: 'lichengbeiList',
        component: () => import('@/views/tempmanagement/milest/milestlist'),
        name: 'lichengbeiList',
        meta: {
            title: '里程碑模板',
            lv:2,
            code: 'M010_010_001'
        },
        children: [
            {
                path: 'milestlistDetail',
                component: () => import('@/views/tempmanagement/milest/children/milestlistdetail.vue'),
                name: 'milestlistDetail',
                hidden: true,
                meta: {
                    title: '设置里程碑阶段',
                    // code: 'M010_008_003'
                }
            },
        ]
    }, 
    {
        path: 'JfwList',
        component: () => import('@/views/tempmanagement/deliver/deliverlist'),
        name: 'JfwList',
        meta: {
            title: '交付物模板',
            lv:2,
            code: 'M010_010_002'
        },
    }, 
    {
        path: 'fengxianList',
        component: () => import('@/views/tempmanagement/risk/risklist'),
        name: 'fengxianList',
        meta: {
            title: '风险问题模板',
            lv:2,
            code: 'M010_010_003'
        },
    }, 
    {
        path: 'todotemplateList',
        component: () => import('@/views/autotemplatemanagement/todo/list'),
        name: 'todotemplateList',
        meta: {
            title: '待办模板',
            lv:2,
            code: 'M010_010_004'
        },
        children: [
            {
                path: 'todotemplateadd',
                component: () => import('@/views/autotemplatemanagement/todo/add'),
                name: 'todotemplateadd',
                hidden: true,
                meta: {
                    title: '新增待办模板',
                    // code: 'M010_008_003'
                }
            }, 
            {
                path: 'todotemplatedit',
                component: () => import('@/views/autotemplatemanagement/todo/add'),
                name: 'todotemplatedit',
                hidden: true,
                meta: {
                    title: '编辑待办模板',
                    // code: 'M010_008_003'
                }
            }, 
        ],
    },
    {
        path: 'todolabelList',
        component: () => import('@/views/labelmanagement/list'),
        name: 'todolabelList',
        meta: {
            title: '待办标签模板',
            lv:2,
            code: 'M010_010_005'
        },
    }, 
    {
        path: 'messagetemplateList',
        component: () => import('@/views/autotemplatemanagement/message/list'),
        name: 'messagetemplateList',
        meta: {
            title: '待办消息模板',
            lv:2,
            code: 'M010_010_006'
        },
    }, {
        path: 'newsTemplateManage',
        component: () => import('@/views/newsTemplate/processList'),
        name: 'newsTemplateManage',
        meta: {
            title: '业务文件模板',
            lv:2,
            code: 'M010_010_007'
        },
    }, 
]
}
export default configmanage