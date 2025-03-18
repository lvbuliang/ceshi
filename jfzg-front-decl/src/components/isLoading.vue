<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-info">
      <span>数据加载中，请稍后！</span>
      <div class="loader"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "isLoading",
  props: {
    isLoading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
};
</script>
<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80%;
  /* background-color: rgba(255, 255, 255, 0.7); */
  display: flex;
  justify-content: center;
  align-items: self-end;
  z-index: 1000;
}

.loading-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* position: relative; */
  /* top: 50px; */
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
