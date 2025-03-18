export default {
    namespaced: true,
    state: {
        userInfo: {},
        fromRoute:''
    },
    mutations: {
        SET_USER_INFO(state, data) {
            state.userInfo = data;
        },
        SET_FROM_ROUTE(state, data) {
            state.fromRoute = data;
            sessionStorage.setItem("FROMROUTER", data);
            // setSession("FROMROUTER", data);
        }
    },
    actions: {
        getUserInfo({ commit }) {
         let data =  JSON.parse(window.sessionStorage.getItem('userInfo'));
          commit('SET_USER_INFO', data);
        },
    }
};
