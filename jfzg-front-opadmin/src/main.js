import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
// import '@/styles/element-variables.scss'
import SrUi from './plugins/dist/sr-ui.js'
import './plugins/dist/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import './permission' // permission control
import moment from 'moment' //时间过滤
import './icons' // icon
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import uploader from 'vue-simple-uploader'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
/**
 * 公用组件 发放到全局
 */
import SrTable from "./components/FTable"
import SrInput from "./components/FInput"
import SrSelect from "./components/FSelect"

Vue.component('SrTable', SrTable)
Vue.component('SrInput', SrInput)
Vue.component('SrSelect', SrSelect)
Vue.prototype.$moment = moment; //赋值使用
moment.locale('zh-cn'); //需要汉化
/**
 * element全局样式设定
 */
Vue.prototype.$ELEMENT = { size: 'medium' };

Vue.use(uploader)
Vue.use(VueQuillEditor)
Vue.use(Element)
Vue.use(SrUi)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



