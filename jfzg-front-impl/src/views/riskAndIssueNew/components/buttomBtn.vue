<template>
  <div
    class="bottom-btns"
    id='container_bottom_btns'
  >
      <div class="back-btn">
        <el-button
          v-if="isShowBack"
          type="primary"
          size="medium"
          :disabled="saveBtn"
          @click="onSubmit"
          >{{ btns == 2 ? "提交" : "保存" }}</el-button
        >
        <el-button plain size="medium" @click="onBackClick">返回列表</el-button>
        <el-button v-if=isFromWorkBench  type='success' size="small" @click="backWorkBench">前往工作台</el-button>
      </div>

  </div>
</template>

<script>

// initResizeObserver
// import {initResizeObserver,destroyResizeObserver} from "@/utils/observe.js"

import { debounce } from "@/utils/debounce";

export default {
  props: {
    isShowBack: {
      type: Boolean,
      default: true,
    },
    btns: {
      type: Number,
    },
    saveBtn: Boolean,
  },
  data() {
    return {
      isFromWorkBench: false,//是否从工作台进入
      widthB: "",
      resizeObserver: null,
    };
  },
  methods: {
    backWorkBench(){
    this.$router.go(-1)
    },
    onBackClick() {
      this.$emit("onBackClick");
    },
    onSubmit: debounce(function () {
      this.$emit("onSubmit");
    }, 2000),
    // document.querySelector('.main-menu-box')
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
    console.log("789789789789789789789",this.$route);
    if(this.$route.query.activeName=='待办'||this.$route.query.activeName=='风险预警'||this.$route.query.activeName=='已办'){
      this.isFromWorkBench = true
    }
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
};
</script>

<style lang="scss" scoped>
.bottom-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  .back-btn{
    display: flex;
  }
}


#container_bottom_btns {
  position: fixed;
  bottom: 0;
  width: calc(100% - 230px);
  background: #fff;
  z-index: 10;
  right: 0;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #e6e6e6;

  .goBackCss {
    display: inline-block;
    margin-left: 20px;
  }

  .workflow_button {
    box-sizing: border-box;
    display: inline-block;
    margin: 0 4px;

    button {
      padding: 0px 24px;
      line-height: 32px;
      border-radius: 16px;
    }
  }
}

</style>
