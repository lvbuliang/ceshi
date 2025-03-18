<template>
  <!-- 无权限页面 -->
  <div class="noJurisdiction flex flex-center">
    <div class="inner">
      <div class="img">
        <img :src="notFoundImg" />
      </div>
      <div class="msg">
        <span>抱歉，您没有权限访问本页</span>
      </div>
      <!-- <div class="buttons">
        <div class="inner">
          <el-button size="small" @click="$router.push({name: 'index'})" type="primary">返回首页</el-button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notFoundImg: require("../../assets/wuquanxian.png")
    };
  }
};
</script>

<style lang="scss" scoped>
.noJurisdiction {
  padding: 10% 0;
  background-color: #fff;
  width: 100%;
  height: 100%;
  .msg {
    color: #007aff;
    font-size: 16px;
    text-align: center;
    margin: 30px 0;
  }

  .buttons {
    position: relative;
    margin-bottom: 30px;
    height: 50px;
    .inner {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>