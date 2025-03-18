import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
let hasMenus = false
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // debugger
  if (hasMenus) {
    next()
  } else {
    const accessRoutes = await store.dispatch('permission/generateRoutes', 'opadmin')
    
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)
    hasMenus = true
    // hack method to ensure that addRoutes is complete
    // set the replace: true, so the navigation will not leave a history record
    next({...to, replace: true })
  }
})

router.afterEach((to, from, next) => {
    // finish progress bar
    // 判断有无权限访问
    if(!to.meta.isJurisdiction){
      router.push({name:'noJurisdiction'})
    }
    NProgress.done()
})