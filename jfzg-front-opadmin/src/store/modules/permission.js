import { asyncRoutes, constantRoutes } from '@/router'
import { getMenu } from '@/api/user'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
function isJurisdiction(obj){
  obj.meta.isJurisdiction = true;
  if(obj.children&&obj.children.length>0){
    obj.children.forEach(item=>isJurisdiction(item))
  }
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
function haveObj(arr, key, val, res_arr,constantRoutes) {
  
  arr.forEach(res => {
    if (res.meta && res.meta[key] == val && val) {
      res_arr.push(res)
    }
    if (res.children && res.children.length > 0) {
      haveObj(res.children, key, val, res_arr)
    }
  })
}
export function filterAsyncRoutes(routes, route_arr, ext_obj = {}) {
  routes.forEach(res => {
    if(res.remark == 'workBench'){
      // 
    }
    let res_arr = []
    haveObj(route_arr, 'code', res.permissionCode, res_arr)
    let flag = null
    if (res_arr.length > 0) {
      flag = res_arr[0]
    }
    if (flag) {
      res.children = res.children
      res.name = flag.name
      res.meta = JSON.parse(JSON.stringify(flag.meta))
      res.meta.title = res.title
      // flag.meta.title = res.meta.title 
      isJurisdiction(flag)
      res.path = flag.path
      if (flag.component) {
        res.component = flag.component
      }
      if (flag.redirect) {
        res.redirect = flag.redirect
      }
      if (flag.meta && flag.meta.leaf == 1) {
        let random = 'k_' + parseInt(Math.random() * 100000)
        ext_obj[random] = flag.children
        res.children = ext_obj[random]
        // res.meta.lv = 2
      }
    }
    if (res.children && res.children.length > 0 && flag && flag.meta && flag.meta.leaf != 1) {
      filterAsyncRoutes(res.children, route_arr, ext_obj)
    }
  })
}

const state = {
  routes: [],
  addRoutes: [],
  child: {},
  theme:''
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },

  SET_CHILD: (state, routes) => {
    state.child = routes
  },
  SET_THEME: (state, value) => {
    state.theme = value
  },
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
        accessedRoutes = asyncRoutes || []
      getMenu().then(response => {
        // 权限相关
        const data = response.data;
        if(data){
          // debugger
          if (data.scene == "zhakou") {
            if (data.platForm == "CHANGSHA_CLOUD") {
              commit('SET_THEME', 'changsha')
            } else if (data.platForm == "YUHUA_CLOUD") {
              commit('SET_THEME', 'yuhua')
            } else if (data.platForm == "MZCTY_CLOUD") {
              commit('SET_THEME', 'mzcty')
            }
          } else {
            commit('SET_THEME', 'jfzg')
          }
        }
        // commit('SET_THEME', 'yuhua')
        filterAsyncRoutes(data.menus[0].data[0].children, asyncRoutes)
          //本地路由
        // commit('SET_ROUTES', accessedRoutes)
        commit('SET_ROUTES', data.menus[0].data[0].children)
        resolve(accessedRoutes)
      })

    })
  },

  getExtraRoute({ commit }, child) {
    return new Promise(resolve => {
      commit('SET_CHILD', child)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
