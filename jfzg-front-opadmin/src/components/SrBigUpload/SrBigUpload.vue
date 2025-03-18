<template>
  <div>
    <uploader
      :options="options"
      class="uploader-example sr-big-upload"
      ref="uploader"
      @file-success="fileSuccess"
      @file-added="onFileAdded"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @file-removed="onFileRemove"
      style="width: 100%"
    >
      <!-- 上传成功之后的列表展示 -->
      <div class="uploadDiv">
        <div
          class="uploader-file-info success"
          v-for="(fitem, index) in list.slice(0, fileListMaxLength)"
          :key="'fitem_' + index"
        >
          <div class="file-name">
            <i class="el-icon-paperclip"></i>
            <span
              class="name"
              @click="toDwon(fitem)"
              :title="fitem.name || fitem.fileName"
              >{{ fitem.name || fitem.fileName }}</span
            >
          </div>
          <div class="operate" @click="remove(fitem)">
            <i class="el-icon-close"></i>
          </div>
        </div>
      </div>
      <!-- 正在上传的附件列表 -->
      <uploader-list>
        <div slot-scope="scope">
          <uploader-file
            :file="itemEr"
            v-for="(itemEr, index) in scope.fileList"
            :key="'itemEr_' + index"
            :list="true"
            @pause="pause"
            @resume="resume"
            @startUpload="startUpload"
          ></uploader-file>
        </div>
      </uploader-list>
      <!-- 附件列表一行放不下显示更多的popover -->
      <el-popover
        popper-class="file_popover"
        placement="top-end"
        width="280"
        trigger="hover"
        v-if="list.length > fileListMaxLength"
      >
        <ul>
          <li
            class="more_file_list"
            v-for="(fitem, index) in list.slice(fileListMaxLength)"
            :key="'fitem_' + index"
          >
            <div class="file-name">
              <i class="el-icon-paperclip"></i>
              <span
                class="name"
                @click="toDwon(fitem)"
                :title="fitem.name || fitem.fileName"
                >{{ fitem.name || fitem.fileName }}</span
              >
            </div>
            <div class="operate" @click="remove(fitem)">
              <i class="el-icon-close"></i>
            </div>
          </li>
        </ul>
        <div class="more_file" slot="reference">
          <i class="el-icon-more"></i>
        </div>
      </el-popover>

      <!-- 上传按钮的html -->
      <div
        :class="item.disabled ? 'uploaderDisabled upload-tip' : 'upload-tip'"
      >
        <uploader-btn :single="true">
          <el-popover
            v-if="!item.limit && fileList.length"
            placement="top"
            width="82"
            trigger="hover"
            content="重新上传"
          >
            <div class="btn" slot="reference">
              <i class="el-icon-refresh-left"></i>
            </div>
          </el-popover>
          <el-popover
            v-else
            placement="top"
            width="82"
            trigger="hover"
            content="上传附件"
          >
            <div class="btn" slot="reference">
              <i class="el-icon-plus"></i>
            </div>
          </el-popover>
        </uploader-btn>
      </div>
    </uploader>
  </div>
</template>

<script>
import uploaderFile from "./file.vue";
import { md5Mixin } from "./common/mixins";
import link from "./link.png";
export default {
  name: "SrBigUpload",
  provide() {
    return {
      uploader: this.$refs.uploader,
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
      linkPng: link,
      fileListMaxLength: 10,
    };
  },
  mounted() {
    this.getUploaderWidth();
  },
  components: {
    uploaderFile,
  },
  methods: {
    toDwon(file) {
      let token = sessionStorage.getItem("token");
      if (
        [
          "txt",
          "ppt",
          "pptx",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "html",
          "pdf",
        ].includes(file.name.split(".").pop())
      ) {
        window.open(`${this.baseUrl}/viewPdf?id=${file.id}`);
      } else {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      }
    },
    /**
     * 现在一个上传框的宽度为202px
     */
    getUploaderWidth() {
      if (this.item.target !== "editor" && !this.item.hideMore) {
        this.fileListMaxLength =
          Math.floor(this.$refs.uploader.$el.offsetWidth / 202) - 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sr-big-upload {
  .uploadDiv {
    display: flex;
    align-items: center;
  }
}
</style>
