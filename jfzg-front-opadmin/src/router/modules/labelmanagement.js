import Layout from '@/layout'
const configmanage = {
    path: '/labelmanage',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'labelmanage',
    meta: {
        title: '待办标签管理',
        icon: 'configure',
        code: 'M010_008'
    },
    children: [
        {
            path: 'todolabelList',
            component: () => import('@/views/labelmanagement/list'),
            name: 'todolabelList',
            meta: {
                title: '待办标签列表',
                lv: 2,
                // code: 'M010_008_003'
            },
        }
    ]
}
export default configmanage