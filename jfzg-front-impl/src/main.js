// 解决IE11兼容
import 'whatwg-fetch'
import 'custom-event-polyfill'
import 'core-js/stable/promise'
import 'core-js/stable/symbol'
import 'core-js/stable/string/starts-with'
import 'core-js/web/url'

import "./core/public-path";
import { lifeCycle, render } from "./core/life-cycle";
import Vue from "vue";
import plan from "@/utils/plan.js";
import utils from "@/utils/index.js";
import uploader from "vue-simple-uploader";
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
import SrWorkFlow from "@/components/SrWorkFlow.vue";
import { setState } from "@/utils/app-store";
import moment from 'moment' //导入文件
import CustomLoading from '@/components/CustomLoading.vue'; // 引入自定义loading组件
import './icons' // icon
//地图echarts
import echarts from 'echarts'
const shishiRouterList = [
  "milestoneEdit",
  "milestoneReport",
  "milestoneView",
  "preliminaryMgrView",
  "preliminaryMgrApplyFor",
  "preliminarySupervisor",
  "preliminaryAffirm",
  "pilotMgrView",
  'pilotMgrApplyFor',
  'pilotMgrSupervisor',
  'pilotMgrAffirm',
  'finalAcceptanceView',
  'finalAcceptanceApplyFor',
  'finalAcceptanceSupervisor',
  'finalAcceptanceAffirm',
  'finalAcceptanceApproval',
  'preliminaryMgrAdd',
  'pilotMgrAdd',
  'finalAcceptanceAdd',
  'beCompletedAdd',
  'beCompletedView',
  'beCompletedApplyFor',
  'beCompletedSupervisor',
  'beCompletedAffirm',
  'beCompletedApproval',

]; // 里程碑、初验 查看实施中列表需要的路由
Vue.prototype.$setState = setState
Vue.prototype.$plan = plan;
Vue.prototype.$echarts = echarts
Vue.prototype.$utils = utils;
Vue.prototype.$moment = moment //赋值使用
Vue.prototype.$shishiRouterList = shishiRouterList;
Vue.component('CustomLoading', CustomLoading);
Vue.use(uploader);
Vue.use(Viewer);
Vue.component("SrWorkFlow", SrWorkFlow);
Viewer.setDefaults({
  Options: { url: false, title: false },
});

Vue.directive('Alphabet', {
  inserted: function (el) {
    const input = el.querySelector('#valueInput');
    input.onkeyup = function (e) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, '')
    }
    input.onblur = function (e) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, '')
    }
  }
});
/**
 * @name 统一注册插件
 */
// import "./core/install";

/**
 * @name 导出微应用生命周期
 */
const { bootstrap, mount, unmount } = lifeCycle();
export { bootstrap, mount, unmount };

/**
 * @name 单独环境直接实例化vue
 */
const __qiankun__ = window.__POWERED_BY_QIANKUN__;
__qiankun__ || render();
