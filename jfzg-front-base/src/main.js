// 解决IE11兼容
import 'whatwg-fetch'
import 'custom-event-polyfill'
import 'core-js/stable/promise'
import 'core-js/stable/symbol'
import 'core-js/stable/string/starts-with'
import 'core-js/web/url'

// 最终解决方案 - 彻底处理 ResizeObserver 警告
(function() {
  // 第1层: 拦截 window.onerror 以捕获所有未捕获的 ResizeObserver 错误
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (message && 
        (String(message).includes('ResizeObserver') || 
         (error && error.message && error.message.includes('ResizeObserver')))) {
      // 阻止错误传播
      return true;
    }
    
    // 对于其他错误，使用原始处理程序
    return originalOnError ? originalOnError.apply(this, arguments) : false;
  };


  // 第3层: 如果浏览器支持 ResizeObserver，增强它
  if (window.ResizeObserver) {
    const OriginalResizeObserver = window.ResizeObserver;
    
    // 记录所有创建的观察者
    const allObservers = new Set();
    
    // 增强后的 ResizeObserver，使用更长的防抖延迟
    window.ResizeObserver = class EnhancedResizeObserver extends OriginalResizeObserver {
      constructor(callback) {
        // 创建带有较长延迟的防抖函数
        const debouncedCallback = (function() {
          let timer = null;
          return function(...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
              try {
                callback.apply(this, args);
              } catch (e) {
                // 忽略回调中的错误
              }
            }, 100); // 使用更长的延迟 (100ms)
          };
        })();
        
        super(debouncedCallback);
        allObservers.add(this);
        
        // 增强原始方法
        const originalDisconnect = this.disconnect;
        this.disconnect = function() {
          allObservers.delete(this);
          return originalDisconnect.call(this);
        };
      }
    };
    
    // 在页面卸载时清理所有观察者
    window.addEventListener('beforeunload', () => {
      allObservers.forEach(observer => {
        try {
          observer.disconnect();
        } catch (e) {
          // 忽略错误
        }
      });
      allObservers.clear();
    });
  }
})();

/**
 * @name 统一注册外部插件、样式、服务等
 */
import './core/install'
import bus from '@/utils/bus'
import Vue from 'vue'

Vue.prototype.$bus = bus

// 特别优化的 Element UI 表格处理
Vue.mixin({
  mounted() {
    this.$nextTick(() => {
      this.optimizeElTables();
    });
  },
  
  activated() {
    this.$nextTick(() => {
      this.optimizeElTables();
    });
  },
  
  updated() {
    this.$nextTick(() => {
      // 在组件更新后也尝试优化表格
      if (this.$el && this.$el.querySelector && this.$el.querySelector('.el-table')) {
        this.optimizeElTables();
      }
    });
  },
  
  methods: {
    optimizeElTables() {
      if (!this.$el || !this.$el.querySelectorAll) return;
      
      const tables = this.$el.querySelectorAll('.el-table');
      if (tables.length === 0) return;
      
      // 使用随机延迟，避免表格同时调整
      const delay = Math.floor(Math.random() * 200) + 50;
      
      setTimeout(() => {
        tables.forEach(table => {
          try {
            const tableVM = table.__vue__;
            if (tableVM && tableVM.doLayout) {
              tableVM.doLayout();
            }
          } catch (e) {
            // 忽略错误
          }
        });
      }, delay);
    }
  }
});

class Event {
  constructor() {
    this.callbacks = []
  }
  on(cb) {
    this.callbacks.push(cb)
  }
  emit(callBackFnHandler) {
    if (typeof callBackFnHandler === 'function') {
      callBackFnHandler(this.callbacks)
    } else {
      this.callbacks.forEach(fn => fn())
    }
    this.callbacks = []
  }
}
let e = new Event();
window.$bus = e

/**
 * @name 微前端基座主应用vue实例化
 */
import microAppStart from '@/core/auth'
microAppStart()