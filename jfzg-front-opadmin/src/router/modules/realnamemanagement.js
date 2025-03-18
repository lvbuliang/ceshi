import Layout from '@/layout'
const realnamemanage = {
    path: '/realnamemanage',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'realnamemanage',
    meta: {
        title: '实名认证管理',
        icon: 'realNameManage',
        code: 'M010_007'
    },
    children: [{
        path: 'supplierlist',
        component: () => import('@/views/realnamemanagement/supplier/supplierlist'),
        name: 'supplierlist',
        meta: {
            title: '供应商列表',
            lv:2,
            code: 'M010_007_001'
        },
        children:[
            {
                path: 'supdetailcheck',
                component: () => import('@/views/realnamemanagement/supplier/children/supdetailcheck'),
                hidden: true,
                name: 'supdetailcheck',
                meta: {
                    title: '供应商资料'
                }
            },
            {
                path: 'supdetailview',
                component: () => import('@/views/realnamemanagement/supplier/children/supdetailview'),
                hidden: true,
                name: 'supdetailview',
                meta: {
                    title: '供应商资料'
                }
            },
          ]
    }, {
        path: 'personlist',
        component: () => import('@/views/realnamemanagement/person/personlist'),
        name: 'personlist',
        meta: {
            title: '个人列表',
            lv:2,
            code: 'M010_007_002'
        },
        children:[
            {
                path: 'persondetailcheck',
                component: () => import('@/views/realnamemanagement/person/children/persondetailcheck'),
                hidden: true,
                name: 'persondetailcheck',
                meta: {
                    title: '个人资料'
                }
            },
            {
                path: 'persondetailview',
                component: () => import('@/views/realnamemanagement/person/children/persondetailview'),
                hidden: true,
                name: 'persondetailview',
                meta: {
                    title: '个人资料'
                }
            },
          ]
    }]
}
export default realnamemanage