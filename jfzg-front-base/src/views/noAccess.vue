<template>
  <div class="noAccess">
    <div class="noAccessBox">
      <img src="@/assets/images/noAccess_img.png" class="not-found"/>
      <p>抱歉，您没有权限访问本页</p>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
  .noAccess{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80vh;
  }
  .noAccessBox{
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
