export default {
  namespaced: true,
  state: {
    is_collapse: false, // 折叠状态
    menu: [], // 菜单数据
    subMenu: [],
    bread: [],// 面包屑数据
    speed: [],// 快捷入口
    currentModule: null,
    htmlData:'',
    valId:'',
    routerVal:'',
    currentModuleName: ''
  },
  mutations: {
    // 更新面包屑数据
    SET_BREAD(state, data) {
      state.bread = data;
    },
    // 推入用户菜单
    SET_MENU(state, data) {
      state.menu = data;
    },
    // 快捷入口
    SET_SPEED(state, data) {
      state.speed = data;
    },
    // 设置折叠状态
    SET_COLLAPSE_STATUS(state, data) {
      state.is_collapse = data;
    },
    UPDATE_MENU_STATE(state, payload) {
      state[payload.key] = payload.value;
    },
    VALID(state, data){
      state.valId = data;
    },
    ROUTERURL(state, data){
      state.routerVal = data;  
    },
    HTMLData(state, data){
      state.htmlData = data;
    },
  },
  actions: {
    // 更新面包屑数据
    setBread({ commit }, data) {
      commit('SET_BREAD', data)
    },
    // 推入用户菜单
    setMenu({ commit }, data) {
      commit('SET_MENU', data)
    },
    getValId({ commit }, data) {
      commit('VALID', data)
    },
    getRouter({ commit }, data) {
      commit('ROUTERURL', data)
    },
    getHtml({ commit }, data) {
      commit('HTMLData', data)
    },
    // 设置折叠状态
    setCollapseStatus({ commit }, data) {
      commit('SET_COLLAPSE_STATUS', data)
    },
    // 快捷入口
    setSpeed({ commit }, data) {
      commit('SET_SPEED', data)
    },
  }
}