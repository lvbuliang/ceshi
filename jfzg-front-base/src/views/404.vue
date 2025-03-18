<template>
  <div class="not-found-page">
    <div class="not-found-box">
      <img src="@/assets/images/404@2x.png" class="not-found"/>
      <p>抱歉，您访问的页面找不到了</p>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
  .not-found-page{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
  }
  .not-found-box{
    text-align: center;
    img{
      width: 240px;
    }
    p{
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      text-align: center;
      margin-top: 24px;
    }
  }
</style>
