<template>
  <div class="hzBox">
    <div class="horizontalBarBox">
      <li v-for="(item,i) in dataList">
        <span style="background:#3AA0FF" :style="{width: item.setbacks+'%'}"></span>
        <i>{{item.setbacks}}%</i>
      </li>
    </div>
    <ul class="hzNumber">
      <li>0%</li>
      <li>10%</li>
      <li>20%</li>
      <li>30%</li>
      <li>40%</li>
      <li>50%</li>
      <li>60%</li>
      <li>70%</li>
      <li>80%</li>
      <li>90%</li>
      <li>100%</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    dataList: [Array],
  },
  data() {
    return {};
  },
  created() {
  },
};
</script>
<style lang="scss" scoped>
.hzBox {
  .horizontalBarBox {
    border-left: 1px solid #d9d9d9;
    margin-left: 30px;
    height: 200px;
    margin-top: 30px;
    width: 90%;
    li {
      height: 22px;
      //   background: #ccc;
      margin-top: 13px;
      position: relative;
      span {
        display: inline-block;
        transition: all 0.5s ease;
        height: 22px;
      }
      i {
        position: absolute;
        font-style: normal;
        color: #007aff;
        display: inline-block;
        background: #f3f3f3;
        padding: 0 6px;
        height: 22px;

        line-height: 22px;
        text-align: center;
      }
    }
  }
  .hzNumber {
    margin-top: 20px;
    color: #595959;
    display: flex;
    margin-left: 28px;
    li {
      flex-grow: 1;
      font-size: 12px;
    }
  }
}
</style>