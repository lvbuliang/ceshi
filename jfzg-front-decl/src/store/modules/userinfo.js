export default {
    namespaced: true,
    state: {
        userInfo: {}
    },
    mutations: {
        SET_USER_INFO(state, data) {
            state.userInfo = data;
        }
    },
    actions: {
        getUserInfo({ commit }) {
         let data =  JSON.parse(window.sessionStorage.getItem('userInfo'));
          commit('SET_USER_INFO', data);
        },
    }
};
