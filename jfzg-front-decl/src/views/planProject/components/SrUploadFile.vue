<template>
  <div>
    <uploader
      :options="options"
      class="uploader-example custom-upload"
      ref="uploader"
      @file-success="fileSuccess"
      @file-added="onFileAdded"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @file-removed="onFileRemove"
      style="width: 100%"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-btn class="uploader-btn">
        <div v-if="btns" class="btns" plain>
          <i class="el-icon-plus"></i>
          添加交付物
        </div>
        <div v-else>上传</div>
      </uploader-btn>
    </uploader>
  </div>
</template>

<script>
import { md5Mixin } from './common/mixins'
export default {
  name: '',
  components: {},
  props: {
    btns: {
      type: Boolean,
      default() {
        return false
      },
    },
    fileList: {
      type: Array,
      default() {
        return []
      },
    },
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    form: {
      type: Object,
      default() {
        return {}
      },
    },
    isHide: Boolean,
  },
  inject: ['baseUrl', 'imgBaseUrl', 'uploadBaseUrl'],
  mixins: [md5Mixin],
  watch: {
    fileList(val) {
      this.list = JSON.parse(JSON.stringify(val))
      this.getUploaderWidth()
    },
  },
  data() {
    return {
      list: JSON.parse(JSON.stringify(this.fileList)),
      fileListMaxLength: 0,
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
// 上传
.custom-upload {
  .uploader-btn {
    /*  width: 36px;
      height: 36px;
      text-align: center; */
    color: #1890ff;
    padding: 0px;
    border: none;
  }
}
.uploader-btn:hover {
  background-color: transparent;
}
.btns {
  margin-top: 20px;
  width: 112px;
  text-align: center;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  background: rgba(66, 130, 255, 0.1);

  border: 1px dashed rgba(66, 130, 255, 1);
}
</style>
