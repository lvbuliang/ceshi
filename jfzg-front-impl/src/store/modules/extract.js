export default {
    namespaced: true,
    state: {
        one: JSON.parse(localStorage.getItem('one')) || {},
        two: {},
        tree: {}
    },
    mutations: {
        UPDATE_ONE_PARAMS(state, data) {
            state.one = data;
            localStorage.setItem("one", JSON.stringify(state.one));
        },
        UPDATE_TWO_PARAMS(state, data) {
            state.two = data;
            localStorage.setItem("two", JSON.stringify(state.two));
        },
        UPDATE_TREE_PARAMS(state, data) {
            state.two = data;
            localStorage.setItem("tree", JSON.stringify(state.tree));
        },
    }
};
