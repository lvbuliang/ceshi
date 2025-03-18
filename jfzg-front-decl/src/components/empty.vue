<template>
  <div class="empty-box" :style="{ height:height || '100%'}">
    <img src="@/assets/images/empty-icon.png" />
    <span>暂无内容</span>
  </div>
</template>

<script>
export default {
  props: {
    height: String,
  },
};
</script>

<style lang="scss" scoped>
.empty-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    width: 80px;
    vertical-align: middle;
  }
  span {
    color: #d6dbe3;
    font-size: 14px;
  }
}
</style>
