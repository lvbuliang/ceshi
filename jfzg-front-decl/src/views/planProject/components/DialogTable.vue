<template>
  <transition name="dialog-fade">
    <div class="el-dialog" v-show="visible" @click.self="handleWrapperClick">
      <div class="el-dialog__header">
        <slot name="title">{{ title }}</slot>
        <button class="el-dialog__headerbtn" aria-label="Close" @click="handleClose">
          <i class="el-dialog__close el-icon el-icon-close"></i>
        </button>
      </div>
      <div class="el-dialog__body">
        <slot></slot>
      </div>
      <div class="el-dialog__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>
 
<script>
export default {
  name: 'ElDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleWrapperClick() {
      // 可以在这里实现点击外部关闭对话框的逻辑
    },
    handleClose() {
      this.$emit('update:visible', false);
    }
  }
};
</script>
 
<style scoped>
.dialog-fade-enter-active, .dialog-fade-leave-active {
  transition: opacity 0.3s;
}
.dialog-fade-enter, .dialog-fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
 
.el-dialog {
  /* 样式按需添加，这里只提供基础样式 */
  position: fixed;
  margin: 0 auto;
  background: #fff;
  border-radius: 2px;
  width: 50%;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3.5px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
  z-index: 3;
}
 
.el-dialog__header {
  padding: 20px;
  position: relative;
  border-bottom: 1px solid #eaecef;
}
 
.el-dialog__headerbtn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 18px;
}
 
.el-dialog__body {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
}
 
.el-dialog__footer {
  padding: 20px;
  text-align: right;
  border-top: 1px solid #eaecef;
}
</style>
