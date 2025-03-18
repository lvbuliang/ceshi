import Layout from '@/layout'
const projectinfomanagement = {
    path: '/projectinfomanagement',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'projectinfomanagement',
    meta: {
        title: '项目信息管理',
        icon: 'projectInfo',
        code: 'M010_006'
    },
    children: [{
        path: 'projectlist',
    component: () => import('@/views/projectinfomanagement/projectlist'),
        name: 'projectlist',
        meta: {
            title: '项目列表',
            lv:2,
            code: 'M010_006_001'
        },
        children:[
            {
                path: 'peoplemanage',
                component: () => import('@/views/projectinfomanagement/children/peoplemanage'),
                hidden: true,
                name: 'peoplemanage',
                meta: {
                    title: '设置成员'
                }
            },
          ]
    },
    
 ]
}
export default projectinfomanagement