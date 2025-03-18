<template>
    <div v-if="visible" class="custom-loader-overlay">
      <div class="loader"></div>
      <span>数据正在加载中。。。。。。</span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomLoading',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .custom-loader-overlay {
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loader {
    width: 20px;
    aspect-ratio: 1;
    background: #0176ff;
    box-shadow: 0 0 60px 15px #0176ff;
    transform: translate(-80px);
    clip-path: inset(0);
    animation:
      l4-1 0.5s ease-in-out infinite alternate,
      l4-2 1s ease-in-out infinite;
  }
  span{
    margin-top: 50px;
    color: #6DD5FA;
  }
  @keyframes l4-1 {
    100% {
      transform: translateX(80px);
    }
  }
  
  @keyframes l4-2 {
    33% {
      clip-path: inset(0 0 0 -100px);
    }
    50% {
      clip-path: inset(0 0 0 0);
    }
    83% {
      clip-path: inset(0 -100px 0 0);
    }
  }
  </style>