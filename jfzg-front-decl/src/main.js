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
