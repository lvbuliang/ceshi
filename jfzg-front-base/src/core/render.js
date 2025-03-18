import Vue from "vue"
import router from '../router'
import store from '../store'
import App from '../App.vue'

Vue.config.productionTip = false

const instance = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#main-container");

export default instance