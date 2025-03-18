import Layout from '@/layout'
const accountManage = {
  path: '/accountManage',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: '账号管理',
  meta: {
    title: '账号管理',
    icon: 'account',
    code: 'M010_003'
  },
  children: [{
    path: 'accountList',
    component: () => import('@/views/accountManage/accountList'),
    name: 'accountList',
    meta: {
      title: '账户列表',
      code: 'M010_003_001'
    }
  }]
}
export default accountManage