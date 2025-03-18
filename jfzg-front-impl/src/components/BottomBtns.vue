<template>
  <div class="bottom-btns workflow" :style="{width: `calc(100% - ${widthB})`}">
    <div class="btns">
      <slot name="btnList"></slot>
      <div @click="onBackClick" class="back-btn" v-if="isShowBack">
        <el-button plain size="medium" round>返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
    return{
      widthB: ""
    }
  },
    props:{
      isShowBack: {
        type: Boolean,
        default: true
      }
    },
    methods:{
      onBackClick() {
        this.$emit('onBackClick')
      },
      initResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.widthB = entry.contentRect.width + "px";
        });
      });
      this.resizeObserver.observe(document.querySelector(".main-menu-box"));
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
    },
    mounted() {
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
  }
</script>

<style lang="scss" scoped>
  .bottom-btns {
    position: fixed;
    bottom: 0;
    // width: calc(100% - 220px);
    border-left:2px solid rgb(230,230,230) ;
    background: #fff;
    z-index: 10;
    right: 0;
    .btns{
      height: 64px;
      text-align: center;
      padding-top: 16px;
      border-top: 1px solid #e6e6e6;
      position: relative;
      .btnList{
        display: inline-block;
      }
      .back-btn{
        display: inline-block;
        margin-left: 16px;
      }
      button {
        padding: 0px 24px;
        line-height: 32px;
        border-radius: 4px;
      }
    }
  }
</style>
