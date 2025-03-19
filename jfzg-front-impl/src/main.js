// 解决IE11兼容
import "./core/public-path";
import 'whatwg-fetch'
import 'custom-event-polyfill'
import 'core-js/stable/promise'
import 'core-js/stable/symbol'
import 'core-js/stable/string/starts-with'
import 'core-js/web/url'
import '../src/styles/index.scss'
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
  "milestoneEdit", "milestoneReport", "milestoneView", "preliminaryMgrView",
  "preliminaryMgrApplyFor", "preliminarySupervisor", "preliminaryAffirm",
  "pilotMgrView", 'pilotMgrApplyFor', 'pilotMgrSupervisor', 'pilotMgrAffirm',
  'finalAcceptanceView', 'finalAcceptanceApplyFor', 'finalAcceptanceSupervisor',
  'finalAcceptanceAffirm', 'finalAcceptanceApproval', 'preliminaryMgrAdd',
  'pilotMgrAdd', 'finalAcceptanceAdd', 'beCompletedAdd', 'beCompletedView',
  'beCompletedApplyFor', 'beCompletedSupervisor', 'beCompletedAffirm', 'beCompletedApproval',
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
    if (input) {
      input.onkeyup = input.onblur = function() {
        input.value = input.value.replace(/[^A-Za-z0-9]/g, '')
      }
    }
  }
});

// 样式修复工具
const styleFixUtils = {
  // 定时器ID
  timer: null,
  
  // 修复表格布局
  fixTables: () => {
    document.querySelectorAll('.el-table').forEach(table => {
      const tableVM = table.__vue__;
      if (tableVM && typeof tableVM.doLayout === 'function') {
        tableVM.doLayout();
      }
    });
  },
  
  // 修复表单样式
  fixForms: () => {
    document.querySelectorAll('.el-form-item').forEach(item => {
      if (window.getComputedStyle(item).marginBottom === '0px') {
        item.style.marginBottom = '18px';
      }
    });
  },
  
  // 修复所有样式
  fixAll: () => {
    try {
      styleFixUtils.fixTables();
      styleFixUtils.fixForms();
    } catch (e) {
      console.debug('Style fix error:', e);
    }
  },
  
  // 开始定期检查
  startChecking: () => {
    styleFixUtils.stopChecking();
    styleFixUtils.timer = setInterval(styleFixUtils.fixAll, 5000);
  },
  
  // 停止定期检查
  stopChecking: () => {
    if (styleFixUtils.timer) {
      clearInterval(styleFixUtils.timer);
      styleFixUtils.timer = null;
    }
  }
};

// 全局调试函数
window.__fixStyles = styleFixUtils.fixAll;

// 添加Vue混入
Vue.mixin({
  mounted() {
    if (window.__POWERED_BY_QIANKUN__) {
      this.$nextTick(() => {
        // 检查this.$el是否是元素节点，且有querySelector方法
        if (this.$el && this.$el.nodeType === 1 && typeof this.$el.querySelector === 'function') {
          // 组件挂载后检查样式
          if (this.$el.querySelector('.el-table')) {
            styleFixUtils.fixTables();
          }
        }
      });
    }
    
    // 在根组件上设置路由钩子和启动样式检查
    if (this.$root === this && window.__POWERED_BY_QIANKUN__) {
      this.$nextTick(() => {
        // 启动定期检查
        styleFixUtils.startChecking();
        
        // 设置路由钩子（如果路由存在）
        if (this.$router) {
          this.$router.afterEach(() => {
            setTimeout(styleFixUtils.fixAll, 100);
          });
        }
      });
    }
  },
  
  activated() {
    // 组件被keep-alive激活时修复样式
    if (window.__POWERED_BY_QIANKUN__) {
      this.$nextTick(styleFixUtils.fixAll);
    }
  },
  
  beforeDestroy() {
    // 根组件销毁时停止样式检查
    if (this.$root === this && window.__POWERED_BY_QIANKUN__) {
      styleFixUtils.stopChecking();
    }
  }
});

/**
 * @name 导出微应用生命周期
 */
const { bootstrap, mount, unmount } = lifeCycle();

// 增强版mount
const enhancedMount = function(...args) {
  return mount.apply(this, args).then(() => {
    if (window.__POWERED_BY_QIANKUN__) {
      styleFixUtils.fixAll();
    }
    return Promise.resolve();
  });
};

// 增强版unmount
const enhancedUnmount = function(...args) {
  if (window.__POWERED_BY_QIANKUN__) {
    styleFixUtils.stopChecking();
  }
  return unmount.apply(this, args);
};

// 导出
export { bootstrap, enhancedMount as mount, enhancedUnmount as unmount };

/**
 * @name 单独环境直接实例化vue
 */
const __qiankun__ = window.__POWERED_BY_QIANKUN__;
__qiankun__ || render();