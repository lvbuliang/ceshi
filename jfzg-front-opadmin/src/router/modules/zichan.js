import Layout from '@/layout'
const projectManage = {
    path: '/zichan',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'zichan',
    meta: {
        title: '资产目录维护',
        icon: 'rolePermissions',
        code:'M010_012'
    },  
    children: [{
        path: 'tagMgr',
        component: () => import('@/views/zichan/tag/tagMgr'),
        name: 'tagMgr',
        meta: {
            title: '资产目录维护',
            code:'M010_012_001'
        }
    }]
}
export default projectManage