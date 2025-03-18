import Layout from '@/layout'
const projectManage = {
    path: '/projectMgr',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'projectMgr',
    meta: {
        title: '项目标签管理',
        icon: 'rolePermissions',
        code:'M010_011'
    },  
    children: [{
        path: 'tagMgr',
        component: () => import('@/views/projectMgr/tag/tagMgr'),
        name: 'tagMgr',
        meta: {
            title: '标签体系管理',
            code:'M010_011_001'
        }
    }]
}
export default projectManage