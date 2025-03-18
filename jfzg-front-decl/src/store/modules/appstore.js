export default {
  namespaced: true,
  state: {
    msg: "",
    loading: 0
  },
  mutations: {
    // 设置父应用信息
    SET_MSG_VALUE(state, data) {
      state.msg = data;
    },
    store_loading(state, value) {
      state.loading = value;
    }
  },
  
  actions: {
    // 设置父应用信息
    setMsg({ commit }, data) {
      commit("SET_MSG_VALUE", data);
    }
  }
};
