<template>
  <div id="uploadBtn">
    <el-upload
      :on-success="(res) => callSuccessFn(res)"
      :on-error="(err, file, fileList) => callErrorFn(err, file, fileList)"
      :before-upload="(res) => callBeforeUpLoad(res)"
      :action="actionUrl"
      :accept="config.fileType"
      :disabled="config.disabled"
      multiple
      :show-file-list="false"
      v-if="actionUrl.indexOf('getWordContext') != -1"
    >
      <div class="slotContent">
        <slot></slot>
      </div>
    </el-upload>
    <sr-upload
      ref="srUpload"
      v-else
      @uploadImgSuccess="uploadImgSuccess"
      :item="{fileType: config.fileType, fileSize: config.fileSize, uploadIngOff: true, uploadListOFF: true, limit: config.limit}"
    >
      <slot></slot>
    </sr-upload>
  </div>
</template>

<script>
import config from "@/settings.js";
import { upload } from "@/api/progress";
export default {
  name: "uploadBtn",
  props: {
    actionUrl: {
      type: String,
      default: config.baseUrl + "/csportalsite/api/dispatch/getWordContext",
    },
    config: {
      type: Object,
      default() {
        return {
          fileType: "docx,doc",
          disabled: false,
          fileSize: 50,
          type: "bs_upload",
        };
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    uploadImgSuccess(res) {
      if (this.config.fileList) {
        this.config.fileList.push(res);
      } else {
        this.$set(this.config, "fileList", [res]);
      }
      this.$emit("getFileInfo", res);
    },
    callSuccessFn(r) {
      this.$emit("update:loading", false);
      if (r && r.data) {
        if (this.config.type == "upload") {
          upload(r.data).then((res) => {
            let flag = false;
            if (this.config.fileList) {
              // 过滤重名的文件
              this.config.fileList = this.config.fileList.filter((val) => {
                if (val.name == res.data.fileInfo.name) {
                  flag = true;
                }
                return val.name != res.data.fileInfo.name;
              });
              this.config.fileList.push(res.data.fileInfo);
            } else {
              this.$set(this.config, "fileList", [res.data.fileInfo]);
            }
            flag
              ? this.$message.warning("文件名重复,已自动覆盖同名文件!")
              : this.$message.success("上传成功!");
            this.$emit("getFileInfo", res.data.fileInfo);
          });
        } else if (this.config.type == "bs_upload") {
          this.$emit("getFileInfo", r.data);
        }
      } else {
        this.$message.warning("上传文件失败！");
      }
    },
    callBeforeUpLoad(res) {
      this.$emit("update:loading", true);
      const fileType = res.name.split(".")[res.name.split(".").length - 1];
      const extension = this.config.fileType.indexOf(fileType) !== -1;
      const isSize = res.size / 1024 / 1024 < this.config.fileSize;
      if (!extension) {
        this.$message.warning(`上传文件只能是${this.config.fileType}格式!`);

        this.$emit("update:loading", false);
      }
      if (!isSize) {
        this.$message.warning(
          `上传文件大小不能超过 ${this.config.fileSize}MB!`
        );
        this.$emit("update:loading", false);
      }
      return extension && isSize;
    },
    callErrorFn(err, file, fileList) {
      this.$message.error(err || "上传文件失败！");
      this.$emit("update:loading", false);
    },
  },
};
</script>

<style lang="scss" scoped>
#uploadBtn {
  .slotContent {
    cursor: pointer;
  }
}

::v-deep .uploader-btn {
  height: 32px;
  line-height: 32px;
  width: 96px;
}
</style>