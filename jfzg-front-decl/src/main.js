
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
import VueQuillEditor from "vue-quill-editor";
// require styles 引入样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "@/styles/index.scss";
import CustomLoading from "@/components/CustomLoading.vue"; // 引入自定义loading组件
import '../src/styles/index.scss'
import "@/assets/font/font.scss";
import "@/assets/css/btn.css";

Vue.prototype.$setState = setState;
Vue.prototype.$plan = plan;
Vue.prototype.$utils = utils;
import VueDragResize from "vue-drag-resize";

import permissionDirective from "./directives/permission";

Vue.component("CustomLoading", CustomLoading);
Vue.component("vue-drag-resize", VueDragResize);
Vue.prototype.$EventBus = new Vue();

// 封装自定义指令
Vue.directive("ellipsis-width", {
  inserted(el) {
    updateWidth(el);
  },
  updated(el) {
    updateWidth(el);
  },
});

function updateWidth(el) {
  const parent = el.parentElement;
  if (parent) {
    const parentWidth = parent.clientWidth;
    el.style.maxWidth = `${parentWidth * 0.8}px`;
  }
}
Vue.directive("permission", permissionDirective);

Vue.use(uploader);
Vue.use(Viewer);
Vue.use(VueQuillEditor);
Vue.component("SrWorkFlow", SrWorkFlow);
Viewer.setDefaults({
  Options: {
    inline: true,
    navbar: true,
    zoomable: true,
    transition: true,
    url: "data-source",
  },
});

/**
 * @name 统一注册插件
 */
// import './core/install';

// 存储全局定时器
window.__styleFixTimers = [];

// 简化版的样式修复函数 - 不依赖Vue路由
const simpleFixStyles = () => {
  // 表格布局修复
  const fixTables = () => {
    document.querySelectorAll('.el-table').forEach(table => {
      const tableInstance = table.__vue__;
      if (tableInstance && tableInstance.doLayout) {
        tableInstance.doLayout();
      }
    });
  };
  
  // 表单样式修复
  const fixForms = () => {
    document.querySelectorAll('.el-form').forEach(form => {
      // 确保表单项样式
      form.querySelectorAll('.el-form-item').forEach(item => {
        if (window.getComputedStyle(item).marginBottom === '0px') {
          item.style.marginBottom = '18px';
        }
      });
    });
  };
  
  // 定期检查样式
  const startPeriodicStyleCheck = () => {
    // 清理旧的定时器
    window.__styleFixTimers.forEach(timer => clearInterval(timer));
    window.__styleFixTimers = [];
    
    // 设置新的定时器
    const checkInterval = setInterval(() => {
      fixTables();
      fixForms();
    }, 5000);
    
    window.__styleFixTimers.push(checkInterval);
    
    return checkInterval;
  };
  
  // 立即执行一次修复
  fixTables();
  fixForms();
  
  // 开始定期检查
  if (window.__POWERED_BY_QIANKUN__) {
    startPeriodicStyleCheck();
  }
};

// 添加自定义样式修复函数到window，便于调试
window.__fixMicroAppStyles = () => {
  simpleFixStyles();
  return '样式修复函数已执行';
};

// 添加Vue mixin，在组件级别应用样式修复
Vue.mixin({
  mounted() {
    if (window.__POWERED_BY_QIANKUN__) {
      this.$nextTick(() => {
        if (this.$el && this.$el.querySelector) {
          // 处理表格
          const tables = this.$el.querySelectorAll('.el-table');
          tables.forEach(table => {
            const tableVue = table.__vue__;
            if (tableVue && tableVue.doLayout) {
              setTimeout(() => tableVue.doLayout(), 50);
              setTimeout(() => tableVue.doLayout(), 200);
            }
          });
          
          // 处理表单
          const forms = this.$el.querySelectorAll('.el-form');
          forms.forEach(form => {
            // 确保表单项样式
            form.querySelectorAll('.el-form-item').forEach(item => {
              if (window.getComputedStyle(item).marginBottom === '0px') {
                item.style.marginBottom = '18px';
              }
            });
          });
        }
        
        // 检测是否是根组件且有路由实例
        if (this.$root === this && this.$router) {
          // 安装路由钩子
          this.$router.afterEach(() => {
            // 路由变化后修复样式
            setTimeout(() => {
              window.__fixMicroAppStyles();
            }, 100);
          });
        }
      });
    }
  }
});

/**
 * @name 导出微应用生命周期
 */
// 获取生命周期函数
let { bootstrap, mount, unmount } = lifeCycle();

// 增强mount
const originalMount = mount;
const enhancedMount = function(...args) {
  return originalMount.apply(this, args).then(() => {
    // 应用挂载后执行样式修复
    simpleFixStyles();
    return Promise.resolve();
  });
};

// 增强unmount - 清理资源
const originalUnmount = unmount;
const enhancedUnmount = function(...args) {
  // 执行清理
  window.__styleFixTimers.forEach(timer => clearInterval(timer));
  window.__styleFixTimers = [];
  
  return originalUnmount.apply(this, args);
};

// 导出增强版的生命周期函数
export { bootstrap, enhancedMount as mount, enhancedUnmount as unmount };

/**
 * @name 单独环境直接实例化vue
 */
const __qiankun__ = window.__POWERED_BY_QIANKUN__;
__qiankun__ || render();