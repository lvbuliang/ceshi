import { getMenu } from '@/api/user'
import { getToken } from '@/utils/auth'
import { resetRouter } from '@/router' // router, 
import config from '@/settings.js'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  breadData: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_BREADDATA: (state, value) => {
    localStorage.setItem("breadData", JSON.stringify(value));
    state.breadData = value
  }
}

const actions = {
  // user login
  login({ commit }, userForm) {
    const { username, password } = userForm
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
      //resolve() 
    })
  },
  setMenu({ commit }) {
    return new Promise((resolve, reject) => {
      getMenu().then(response => {
        // 权限相关
        const data = response.data;
        // commit('SET_THEME', 'yuhua')
        if (data) {
          if (data.permissions) {
            localStorage.setItem('menu', JSON.stringify(data.permissions))
          }
        }
        resolve(data)
      }).catch(error => { })
    })
  },
  // get user info
  getInfo({ commit }) { // , state
    return new Promise((resolve) => { // , reject
      let name = JSON.parse(localStorage.getItem("menu")).user.realName || '--';
      let data = { "roles": name };
      commit('SET_ROLES', name)
      commit('SET_NAME', name)
      resolve(data);

    })
  },

  // user logout
  // logout({ commit }) { // , state
  //   return new Promise((resolve, reject) => {
  //     logout().then(() => {
  //       commit('SET_TOKEN', '')
  //       commit('SET_ROLES', [])
  //       //removeToken()
  //       localStorage.removeItem("menu");
  //       resetRouter()
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  logout({ commit }) { // , state
    localStorage.clear()
    let pageUrl = window.location.origin + '/opadmin/#/';
    let targetUrl = config.baseUrl + '/csportalsite/login?redirectUrl=' + encodeURIComponent(pageUrl)
    let targetUrl1 = config.baseUrl + '/csportalsite/logout?redirectUrl=' + encodeURIComponent(targetUrl)
    // debugger
    window.location.replace(targetUrl1)
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      //removeToken()
      localStorage.removeItem("menu");
      resetRouter()
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
