import Layout from '@/layout'
const reportmanagement = {
  path: '/reportmanagement',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: '专报管理',
  meta: {
    title: '专报管理',
    icon: 'dictionaries',
    code: 'M010_010'
  },
  children: [{
    path: 'reporttime',
    component: () => import('@/views/reportmanagement/reporttime'),
    name: 'reporttime',
    meta: {
      title: '专报时间设置',
      code: 'M010_010_001'
    },
  },
  {
    path: 'reportlist',
    component: () => import('@/views/reportmanagement/reportlist'),
    name: 'reportlist',
    meta: {
      title: '专报表格列表',
      code: 'M010_010_002'
    },
  },
  ]
}
export default reportmanagement