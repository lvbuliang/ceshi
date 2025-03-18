<template>
  <div class="empty"> 
   
      <img src="@/assets/images/zhishiku/empty.png" alt="" />
     
      <!-- <p>请输入关键字进行搜索</p> -->
      <p>暂无内容</p>
   
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 336px;
    margin-bottom: 24px;
  }
  p {
    font-size: 20px;
    font-weight: 400;
    color: #666666;
    text-align: center;
    margin-top: 24px;
  }
}
</style>