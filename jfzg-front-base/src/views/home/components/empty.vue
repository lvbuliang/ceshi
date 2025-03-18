<template>
  <div class="empty-box">
    <img src="@/assets/images/empty-icon.png" />
    <span style="color: #4f4848;">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: "Empty",
  props: {
    text: {
      type: String,
      default: "暂无内容",
    },
    imageUrl: {
      type: String,
      default: "@/assets/images/empty-icon.png",
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-box {
  width: 100%;
  height: 100%;
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
    margin-top: -39px; /* 调整图片和文字的间隔 */
  }
}
</style>
