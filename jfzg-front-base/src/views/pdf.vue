<template>
  <div
    class="pdf"
    style="text-align: center"
    v-loading.fullscreen.lock="isLoading"
  >
    <el-button-group class="padfHeader">
      <div class='text'>预览文件</div>
      <!-- <el-button @click="prePage">
        <i class="base-iconfont icon-shangyiye"></i>
        <span>上一页</span>
      </el-button>
      <div class="text">
        <span class="left">{{ pageNum }}</span
        ><span class="right">/{{ numPages }}</span>
      </div>
      <el-button @click="nextPage">
        <span>下一页</span>
        <i class="base-iconfont icon-xiayiye"></i>
      </el-button> -->
    </el-button-group>
    <div class="pdfBox">
      <pdf
        ref="pdf"
        v-for="i in numPages"
        :key="i"
        :src="url"
        :page="i"
        style="display: inline-block; width: 80%; text-align: center"
        class='pdf-page'
        
      >
      </pdf>
      <!-- <div v-for="i in numPages" :key="i" class="page-divider"></div> -->
    </div>
  </div>
</template>
<script>
import pdf from "vue-pdf";
import SETTING from "@/setting.js";
import { getStorageToken } from "@/utils/user-vali.js";
export default {
  components: {
    pdf,
  },
  computed: {
    // url() {
    //   let access_token = getStorageToken();
    //   console.log(
    //     SETTING.imgBaseUrl +
    //       this.$route.query.id +
    //       `&access_token=${access_token}`
    //   );
    //   return;
    // },
  },
  data() {
    return {
      pageNum: 1,
      numPages: 100,
      isLoading: true,
      url: pdf.createLoadingTask(
        SETTING.imgBaseUrl +
          this.$route.query.id +
          `&access_token=${getStorageToken()}`
      ),
    };
  },
  mounted() {
    console.log("查看页面");
    console.log(this.url, "url");
    this.url.promise
      .then((pdf) => {
        console.log(pdf, "pdf");

        this.numPages = pdf.numPages;
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
  methods: {
    // 上一页
    prePage() {
      let page = this.pageNum;
      page = page > 1 ? page - 1 : this.numPages;
      this.pageNum = page;
    },

    // 下一页
    nextPage() {
      let page = this.pageNum;
      page = page < this.numPages ? page + 1 : 1;
      this.pageNum = page;
    },
  },
};
</script>
<style lang="scss" scoped>

.pdf-page {
  /* 根据需要自定义每页PDF的样式 */
  display: inline-block;
  // background: #f3f3f3;
  background: #cccc;
  margin: 15px !important; /* 示例间距 */
  z-index: 999 !important;
}

.pdf {
  padding-top: 40px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .pdfBox {
    width: 100%;
    height: 100%;
    z-index: 0;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .padfHeader {
    width: 100%;
    height: 40px;
    background: rgba(0, 0, 0, 0.75);
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.2);
    border: 1px solid #4d4d4d;
    box-sizing: border-box;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    .text {
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      width: 206px;
      height: 100%;
      line-height: 40px;
      span {
        display: inline-block;
      }
      .right {
        color: rgba(255, 255, 255, 0.2);
      }
    }
    // .el-button {
    //   width: 72px;
    //   height: 28px;
    //   line-height: 28px;
    //   font-size: 14px;
    //   padding: 0;
    //   color: rgba(255, 255, 255, 0.2);
    //   background: transparent;
    //   border: 0;
    //   border-radius: 8px;
    //   text-align: center;
    //   &:hover {
    //     background: rgba($color: #fff, $alpha: 0.2);
    //     color: #fff;
    //   }
    //   i {
    //     font-size: 16px;
    //     vertical-align: middle;
    //   }
    // }
  }
}

.page-divider {
  border-bottom: 1px solid #ccc;
  margin: 30px 0;
}
</style>
<style>
body {
  overflow: hidden;
}
</style>
