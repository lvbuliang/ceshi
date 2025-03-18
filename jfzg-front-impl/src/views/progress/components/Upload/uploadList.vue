<template>
  <div class="upload_list">
    <div
      class="upload_item"
      v-for="(tag, k) in uploadItem.fileList"
      v-show="k < (uploadItem.colNum || 3) || expand"
      :key="k"
    >
      <img src="@/assets/upload/link.png" />
      <span class="upload_text" :title="tag.name">{{ tag.name }}</span>
      <img class="preview" @click="preview(tag)" src="@/assets/upload/see.png" />

      <i v-if="!isOff && offUpload" class="el-icon-close"  @click="delFile(k)"></i>
    </div>
  </div>
</template>

<script>
import config from '@/settings.js';

export default {
  props: {
    uploadItem: {
      type: Object,
      default() {
        return {};
      }
    },
    expand: Boolean,
    isOff: Boolean,
    offUpload:{
      type:Boolean,
      default(){
        return true
      }
    }
  },
  methods: {
    preview(item) {
      if (['zip', 'rar'].includes(item.name.split('.').pop())) {
        let fileUrl = config.getEncryUrl(item.id, true);
        this.$utils.exportFile(fileUrl);
      } else {
        let fileUrl = config.getEncryUrl(item.id);
        window.open(`${fileUrl}`);
      }
    },
    delFile(k) {
      this.$emit('delFile', k);
    }
  }
};
</script>

<style lang="scss" scoped>
.upload_list {
  display: flex;
  flex-wrap: wrap;
  .upload_item {
    height: 36px;
    background: rgba(230, 247, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(212, 240, 255, 1);
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin-right: 12px;
    &:nth-of-type(n + 4) {
      margin-top: 12px;
    }
    .preview {
      cursor: pointer;
      margin-right: 12px;
    }
    .upload_text {
      margin-left: 8px;
      margin-right: 12px;
      color: #333;
      font-size: 14px;
      max-width: 110px;
      min-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .el-icon-close {
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
    }
  }
}
</style>