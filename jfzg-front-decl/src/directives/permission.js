// directives/permission.js

import store from "../store/index";

export default {
  inserted(el, binding, vnode) {
    // 获取用户信息（假设存储在 Vuex 或 Vue.prototype 中）
    const userInfo = store.getters.userInfo || {};

    // 获取指令的参数（角色代码数组）
    const allowedRoles = binding.value;

    console.log(userInfo.currentRole, "userInfo.currentRole");

    // 如果没有配置角色权限，直接允许操作
    if (!allowedRoles) {
      return;
    }
    // 判断用户是否有权限操作
    const hasPermission = allowedRoles.some(
      (role) => userInfo.currentRole && userInfo.currentRole.roleCode === role
    );

    // 如果没有权限，禁用元素
    if (!hasPermission) {
      // 禁用元素
      el.disabled = true;
      // el.style.display = "none";
      // 添加样式（可选）
      el.style.cursor = "not-allowed";
      el.style.opacity = "0.5";
    }
  },
  componentUpdated(el, binding, vnode) {
    // 在组件更新时重新判断权限
    const userInfo = store.getters.userInfo || {};
    const allowedRoles = binding.value;

    if (!allowedRoles) {
      return;
    }

    const hasPermission = allowedRoles.some(
      (role) => userInfo.currentRole && userInfo.currentRole.roleCode === role
    );

    if (!hasPermission) {
      el.disabled = true;
      el.style.cursor = "not-allowed";
      el.style.opacity = "1";
    } else {
      el.disabled = false;
      el.style.cursor = "auto";
      el.style.opacity = "0.5";
      el.style.display = "none";
    }
  },
};
