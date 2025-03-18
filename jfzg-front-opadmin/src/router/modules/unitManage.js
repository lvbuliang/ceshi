import Layout from '@/layout'
const unitManage = {
  path: '/unitManage',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'unitManage',
  meta: {
    title: '单位管理',
    icon: 'company',
    code: 'M010_001'
  },
  
  children: [{
    path: 'unitList',
    component: () => import('@/views/unitManage/unitList'),
    name: 'unitList',
    meta: {
      title: '单位信息',
      lv:2,
      code: 'M010_001_001'
    },
    children:[
      {
        path: 'detail',
        name: 'unitDetail',
        hidden: true,
        meta: {
          title: '单位详情'
        },
        component: () => import('@/views/unitManage/children/detail')
      }
    ]
  }]
}
export default unitManage