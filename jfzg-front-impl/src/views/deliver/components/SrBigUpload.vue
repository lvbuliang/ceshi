<template>
  <div class="bigFileUpload">
    <uploader
      :options="options"
      class="uploader-example"
      ref="uploader"
      @file-success="fileSuccess"
      @file-added="onFileAdded"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @file-removed="onFileRemove"
      style="width: 100%"
    >
      <div>
        <uploader-btn :single="true">
          <el-tooltip
            class="item"
            effect="light"
            content="上传"
            placement="top-start"
          >
            <i class="icon base-iconfont icon-upload"></i>
          </el-tooltip>
        </uploader-btn>
      </div>
    </uploader>
  </div>
</template>

<script>
import { md5Mixin } from "./common/mixins";
import Uploader from "simple-uploader.js";
export default {
  name: "SrBigUpload",
  provide() {
    return {
      //   uploader: this.$refs.uploader,
    };
  },
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    form: {
      type: Object,
      default() {
        return {};
      },
    },
    isHide: Boolean,
  },
  inject: ["baseUrl", "imgBaseUrl", "uploadBaseUrl"],
  mixins: [md5Mixin],
  watch: {
    fileList(val) {
      this.list = JSON.parse(JSON.stringify(val));
      this.getUploaderWidth();
    },
  },
  data() {
    return {
      list: JSON.parse(JSON.stringify(this.fileList)),
      fileListMaxLength: 0,
    };
  },
  mounted() {
    this.getUploaderWidth();
  },
  components: {
    // uploaderFile,
  },
  methods: {
    toDwon(file) {
      if (
        [
          "zip",
          "rar",
          "xls",
          "xlsx",
          "doc",
          "docx",
          "txt",
          "html",
          "pdf",
        ].includes(file.name.split(".").pop())
      ) {
        window.open(`${this.baseUrl}/viewPdf?id=${file.id}`);
      } else {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}`
        );
      }
    },
    /**
     * 现在一个上传框的宽度为202px
     */
    getUploaderWidth() {
      if (this.item.target !== "editor") {
        this.fileListMaxLength =
          Math.floor(this.$refs.uploader.$el.offsetWidth / 202) - 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bigFileUpload {
  ::v-deep .uploader-example {
    div {
      display: flex;
      align-items: center;

      .uploader-btn {
        width: 36px;
        height: 36px;
        text-align: center;
        border: none;
        input {
          display: none;
        }
        .icon-upload {
          font-size: 20px;
          font-weight: 600;
        }
        .icon-upload:hover {
          color: #1890ff!important;
        }
      }
      .uploader-btn:hover {
        background: #fafafa !important;
      }
    }
  }
}
</style>
