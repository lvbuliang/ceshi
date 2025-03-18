import { api_getUserByToken, api_login } from "@/api/user.js";
import md5 from 'js-md5';
import { Storage } from "wl-core"
export default {
  namespaced: true,
  state: {
    size: 10,  // 分页 页大小
    token: '',
    userInfo: null,
    appViewBoxHeight: '',
    loading: 0,
    isLoadApp: false,
    knowledgeBaseKeyword: "", // 知识库检索关键字
    permission_views: null// 页面权限code
  },
  mutations: {
    store_loading(state, value) {
      state.loading = value;
    },
    // 设置app静态资源加载标示
    SET_APP_LOAD(state, value) {
      state.isLoadApp = value;
    },
    // 设置分页大小
    SET_PAGE_SIZE(state, data) {
      state.size = data;
    },
    // 设置token
    SET_TOKEN(state, data) {
      state.token = data;
    },
    SET_USER_INFO(state, data) {
      state.userInfo = data;
    },
    SET_APP_VIEW_BOX_HEIGHT(state, data) {
      state.appViewBoxHeight = data;
    },
    SET_KEYWORD(state, data) {
      state.knowledgeBaseKeyword = data
    },
    SET_PERMISSION_VIEWS(state, data) {
      state.permission_views = data
    }
  },
  actions: {
    // 页面权限code
    permission_views({ commit }, data) {
      commit('SET_PERMISSION_VIEWS', data)
    },
    // 设置分页大小
    setPageSize({ commit }, data) {
      commit('SET_PAGE_SIZE', data)
    },
    // 设置token
    setToken({ commit }, data) {
      commit('SET_TOKEN', data)
    },
    // 设置子应用容器的高度
    setAppViewBoxHeight({ commit }, data) {
      commit('SET_APP_VIEW_BOX_HEIGHT', data)
    },
    //获取用户信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        api_getUserByToken()
          .then((response) => {
            let data = response.data;
            commit('SET_USER_INFO', data);
            Storage.set("userInfo", data, "session")
            resolve(data);
          }).catch((error) => {
            reject(error);
          });
      });
    },
    login({ state }, userForm) {
      console.log('userFormuserFormuserFormuserFormuserFormuserForm',userForm);
      
      const { account, password, validCode,invitationCode,grant_type,mobile,code} = userForm
      return new Promise((resolve, reject) => {
        let _params;
        if(account){
          _params={
            username: account,
            invitationCode:invitationCode,
            password: md5(password).toUpperCase(),
            validCode: validCode,
            grant_type: grant_type,
            deviceId: Storage.get("deviceId", "session"),
          }
        }else{
          _params={
            grant_type: grant_type,
            mobile:mobile,
            code:code
          }
        }
  console.log('_params',_params);
  
        api_login(_params).then(response => {
          const { data } = response;
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}