<template>
  <el-dialog
    :title="deliverableName"
    :visible.sync="dialogVisible"
    width="50%"
    class="deliverable-dialog"
  >
    <div
      class="deliverable-container"
      :class="{ 'columns-layout': hasSynchronous }"
    >
      <div class="main-column" :class="{ 'full-width': !hasSynchronous }">
        <div class="column-header">
          <h3>{{ deliverableName }}</h3>
        </div>
        <div class="attachment-list">
          <div
            v-for="(file, index) in previewForm.data.uploadFiles"
            :key="file.id"
            class="attachment-item"
          >
            <div class="file-info">
              <div class="upload-name">{{ file.name }}</div>
            </div>
            <div class="actions">
              <i class="el-icon-view" @click="handlePreview(file)"></i>
              <i class="el-icon-download" @click="handleDownload(file)"></i>
              <i
                class="el-icon-delete"
                @click="handleDeletePlease(file, index)"
                v-if="hasConstructionPermission"
              ></i>
            </div>
          </div>
          <div v-if="previewForm.data.uploadFiles.length === 0" class="no-attachments">
            <div class="empty-state">
              <i class="el-icon-box empty-icon"></i>
              <p class="empty-text">暂无交付物</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sync-column" v-if="hasSynchronous">
        <div class="column-header">
          <h3>{{ SynchronousName }}</h3>
        </div>
        <div class="attachment-list">
          <div
            v-for="(file, index) in Synchronous"
            :key="file.id"
            class="attachment-item"
          >
            <div class="file-info">
              <div class="original-name">{{ file.deliveryName }}：</div>
              <div class="upload-name">{{ file.name }}</div>
            </div>
            <div class="actions">
              <i class="el-icon-view" @click="handlePreview(file)"></i>
              <i class="el-icon-download" @click="handleDownload(file)"></i>
            </div>
          </div>
          <div v-if="Synchronous.length === 0" class="no-attachments">
            <div class="empty-state">
              <i class="el-icon-box empty-icon"></i>
              <p class="empty-text">暂无同步交付物</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: Boolean,
    deliverableName: String,
    SynchronousName: String,
    previewForm: Object,
    Synchronous: Array,
    hasConstructionPermission: Boolean,
  },
  computed:{
    hasSynchronous() {
      return this.Synchronous && this.Synchronous.length > 0;
    },
  },
  methods: {
    handlePreview(file) {
      this.$emit("preview", file);
    },
    handleDownload(file) {
      this.$emit("download", file);
    },
    handleDeletePlease(file, index) {
      this.$emit("delete", file, index);
    },
  },
};
</script>

<style scoped lang='scss'>

::v-deep .sr-big-upload .uploader-btn .btn {
  height: 30px;
  position: relative !important;
  overflow: hidden !important;
  visibility: hidden !important; /* 隐藏原始文字 */
}
::v-deep .sr-big-upload .uploader-btn .btn::after {
  content: "上传";
  position: absolute;
  top: 12px;
  left: 0;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #3794ff;
  visibility: visible; /* 确保伪元素文字可见 */
}

::v-deep .uploader-list {
  display: none !important;
}

.attachment-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  .attachment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    margin: 8px 0;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;

    &:hover {
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .file-info {
      display: flex;
      flex: 1;
      min-width: 0;

      .original-name {
        font-weight: 500;
        color: #2c3e50;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .upload-name {
        font-size: 12px;
        color: #6c757d;
        margin-top: 4px;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: 20px;

      i {
        font-size: 18px;
        color: #6c757d;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: #409eff;
        }
      }

      .el-icon-delete:hover {
        color: #f56c6c;
      }
    }
  }
}

.no-attachments {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #e9ecef;

  .empty-state {
    text-align: center;
    padding: 40px;

    .empty-icon {
      font-size: 64px;
      color: #ced4da;
      margin-bottom: 16px;
    }

    .empty-text {
      color: #6c757d;
      font-size: 16px;
      margin: 0;
      letter-spacing: 0.5px;
    }
  }
}

::v-deep .el-table .cell {
  display: flex !important;
}
.uploading_span {
  font-size: 12px !important;
}

.deliverable-dialog {
  /* 弹窗样式 */
}

.deliverable-container {
  // display: flex;
  // justify-content: space-between;
  // width: 100%;
}

.deliverable-column {
  // width: 48%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
}

.column-header {
  // margin-bottom: 10px;
  padding: 10px;

  border-bottom: 1px solid #ebeef5;
}

.attachment-list {
  max-height: 400px;
  overflow-y: auto;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
}

.file-info {
  flex: 1;
}

.original-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.upload-name {
  color: #999;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.no-attachments {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  color: #ddd;
  margin-bottom: 10px;
}

.empty-text {
  color: #999;
}

.deliverable-container {
  transition: all 0.3s;
}

.columns-layout {
  display: flex;
  gap: 24px; /* 添加列间距 */
}

.main-column {
  border: 1px solid #ebeef5;
  flex: 1;
}

.full-width {
  border: 1px solid #ebeef5;
  width: 100%;
}

.sync-column {
  border: 1px solid #ebeef5;
  flex: 1;
  max-width: 50%; /* 限制右侧最大宽度 */
}

.column-header {
  margin-bottom: 1px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.attachment-list {
  min-height: 200px;
}
</style>
