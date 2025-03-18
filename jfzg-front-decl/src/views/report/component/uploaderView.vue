<template>
  <div class="widthUp uploaderview" v-if="viewDataS.length" ref="UpBoxHeight">
    <div class="uploaderList">
      <div
        class="uploader"
        v-for="(item, index) in viewDataS"
        :key="index"
        v-show="index < (dataUp.colNum || 3) || expand || !dataUp.showExpand"
      >
        <i class="icon-attachent"></i>
        <span
          @click="seeclick(item, dataUp)"
          class="uploader_title"
          :title="item.name || item.fileName"
          >{{ item.name || item.fileName }}</span
        >
        <i @click="download(item, dataUp)" class="icon-download"></i>
      </div>
    </div>
    <div class="expand_box" v-if="viewDataS.length">
      <div
        class="expand text-right more_less pointer"
        @click="expand = !expand"
        v-show="dataUp.showExpand && viewDataS.length > (dataUp.colNum || 3)"
      >
        <i class="el-icon-arrow-down el-icon--right" v-show="!expand"></i>
        <i class="el-icon-arrow-up el-icon--right" v-show="expand"></i>
      </div>
    </div>
  </div>
  <span class="context" v-else>{{ emptyPlacehoder }}</span>
</template>
<script>
export default {
  inject: ["baseUrl", "imgBaseUrl"],
  data() {
    return {
      expand: false,
      viewDataS: [],
      widthUpHeight: "",
    };
  },
  props: {
    labelWidth: {
      type: [String, Number],
      default: () => {
        return 120;
      },
    },
    dataUp: {
      type: Object,
      default: () => {
        return {};
      },
    },
    viewData: {
      type: [String, Array, Object],
      default: () => {
        return [];
      },
    },
    emptyPlacehoder: {
      type: String,
      default: () => {
        // 是否隐藏为空时，显示的占位- -
        return "";
        // return "暂无附件";
      },
    },
  },
  watch: {
    viewData: {
      handler(newName) {
        this.viewDataS = newName;
        if (newName && typeof newName == "string") {
          this.viewDataS = JSON.parse(newName);
        } else {
          this.viewDataS = newName;
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep: true,
    },
  },
  methods: {
    seeclick(file) {
      let token = sessionStorage.getItem("token");
      if (
        //12.27
        [
          "doc",
          "docx",
          "txt",
          "html",
          "pdf",
          "ppt",
          "pptx",
          "html",
          "ofd",
        ].includes(file.name.split(".").pop())
      ) {
        window.open(`${this.baseUrl}/viewPdf?id=${file.id}`);
      } else if (
        [
          "bmp",
          "jpg",
          "jpeg",
          "gif",
          "png",
          "zip",
          "rar",
          "xls",
          "xlsx",
        ].includes(file.name.split(".").pop())
      ) {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      }
    },
    download(file) {
      let token = sessionStorage.getItem("token");
      this.exportFile(
        `${this.baseUrl}/jfzg/file/api/file/downloadStream?key=${file.id}&access_token=${token}`
      );
    },
    // 判断文件后缀
    judgeTrail(filePath) {
      if (!filePath) return false;
      let index = filePath.lastIndexOf(".");
      //获取后缀
      let ext = filePath.substr(index + 1);
      //输出结果
      return ext;
    },
    //无闪烁跳转
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
  },
  mounted() {
    if (this.viewData && typeof this.viewData == "string") {
      // try {
      //   JSON.parse(this.viewData)
      //   this.viewDataS = JSON.parse(this.viewData);
      // } catch (error) {
      //   this.viewDataS = this.viewData
      // }
      this.viewDataS = JSON.parse(this.viewData);
    } else {
      this.viewDataS = this.viewData;
    }
  },
};
</script>
