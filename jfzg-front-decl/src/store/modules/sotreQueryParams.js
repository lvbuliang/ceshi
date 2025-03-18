// 用来存储各页面的查询参数，达到用户跳转详情页返回列表查询参数不变

const state = {
  auditQuery: {}, //业务配置页面查询参数
  auditTypeQuery: {}, //流程配置页面查询参数
  showDialog: false,

};

const mutations = {
  AUDIT_QUERY: (state, data) => {
    console.log(state,'仓库里面的state')
    console.log(data,'仓库里面的data')
    state.auditQuery = data;
  },
  AUDIT_TYPE_QUERY: (state, data) => {
    state.auditTypeQuery = data;
  },
  closeDialog(state) {
    state.showDialog = false;
  },
  
};

const actions = {
  addAudtQuery({ commit }, data) {
    commit("AUDIT_QUERY", data);
  },
  addAudtTypeQuery({ commit }, data) {
    commit("AUDIT_TYPE_QUERY", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
