const state = {
    checkMenu: false
}

const mutations = {
    CHECK_MENU: (state, token) => {
        state.checkMenu = token
    },
}
const actions = {
    checkMenu({ commit }, view) {
        commit('CHECK_MENU', view)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }