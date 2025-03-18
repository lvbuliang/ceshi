import Layout from '@/layout'
const unitManage = {
    path: '/roleManage',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'roleManage',
    meta: {
        title: '角色权限管理',
        icon: 'rolePermissions',
        code:'M010_002'
    },
    children: [{
        path: 'roleList',
        component: () => import('@/views/roleManage/role/roleList'),
        name: 'roleList',
        meta: {
            title: '角色管理',
            code:'M010_002_001'
        }
    }, {
        path: 'authList',
        component: () => import('@/views/roleManage/auth/authList'),
        name: 'authList',
        meta: {
            title: '权限管理',
            code:'M010_002_002'
        }
    }]
}
export default unitManage