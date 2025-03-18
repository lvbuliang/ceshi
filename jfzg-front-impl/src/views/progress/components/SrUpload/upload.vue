<template>
  <div>
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
      <div class="upload-tip">
        <uploader-btn :single="!item.multiple" v-if="!item.hideUploadBtn">
          <slot>
            <div>
              <svg-icon icon-class="icon_upload" class="uploadImg_before" />
              <span>{{ item.btnName ? item.btnName : "上传文件" }}</span>
            </div>
          </slot>
        </uploader-btn>
        <div
          @click.stop="mobanclick(item.uploadUrl)"
          slot="moban"
          class="tip_moban"
          v-if="item.isCurrentMoban"
        >{{ item.isCurrentMobanName || "下载模板" }}</div>
        <div class="tip" v-if="item.fileTip">
          <svg-icon icon-class="icon_info" />
          <div v-if="item.fileTip2">
            <span class="up_tip">{{ item.fileTip }}</span>
            <span class="up_tip">{{ item.fileTip2 }}</span>
          </div>
          <span class="up_tip" v-else>{{ item.fileTip }}</span>
        </div>
        <!-- 参考模板 -->
        <div @click.stop class="tplContent" v-if="item.hasTpl" name="ckTpl">
          <div class="flex tplContainer">
            <label class="tplLabel">参考模板:</label>
            <div class="tplFile" v-if="form[item.tplBind]">
              <svg-icon style="font-size: 16px" icon-class="icon_fujian" />
              <span>{{ form[item.tplBind].name }}</span>
              <svg-icon
                @click.stop="tpluploadclick(form[item.tplBind].url)"
                style="font-size: 18px"
                icon-class="icon_down"
              />
            </div>
          </div>
        </div>
      </div>

      <slot name="viewTitle"></slot>
      <div class="uploadDiv" v-if="!item.uploadListOFF">
        <div class="uploader-file-info success" v-for="(val, index) in list" :key="index">
          <div class="file-name">
            <img v-if="isHide" class="fileImg" :src="fileImg(val)" alt />
            <!-- <i v-else class="el-icon-paperclip"></i> -->
            <svg-icon v-else icon-class="icon_fujian" />
            <span class="name" :title="val.name || val.fileName">
              {{
              val.name || val.fileName
              }}
            </span>
          </div>
          <div class="operate">
            <!-- <i class="el-icon-view" @click="seeclick(val)"></i> -->

            <svg-icon
              title="查看"
              @click="seeclick(val)"
              icon-class="watch"
              class="pointer uploader_class seebtn"
            />
            <svg-icon
              title="下载"
              @click="download(val)"
              icon-class="icon_down"
              class="pointer uploader_class seebtn ml-8"
            />
            <i
              class="el-icon-close"
              @click="remove(val)"
              v-if="!item.deleteIconHide && !val.nodelete && !isAdd"
            ></i>
          </div>
        </div>
      </div>
      <uploader-list v-if="!item.uploadIngOff">
        <div slot-scope="scope">
          <uploader-file
            :file="itemEr"
            v-for="(itemEr, index) in scope.fileList"
            :key="index"
            :list="true"
            @pause="pause"
            @resume="resume"
            @startUpload="startUpload"
          ></uploader-file>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
import uploaderFile from "./file.vue";
import { md5Mixin } from "./common/mixins";
import config from "@/settings.js";

export default {
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
    isAdd: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  mixins: [md5Mixin],
  watch: {
    fileList(val) {
      this.list = JSON.parse(JSON.stringify(val));
    },
  },
  data() {
    return {
      list: JSON.parse(JSON.stringify(this.fileList)),
    };
  },
  methods: {
    mobanclick(url) {
      if (url) {
        this.$utils.exportFile(`${config.baseUrl}${url}`);
      } else {
        this.$utils.exportFile(
          `${config.baseUrl}/csportalsite/yuhua/projectapply/exportTemple`
        );
      }
    },
  },
  components: {
    uploaderFile,
  },
};
</script>

<style lang="scss" scoped>
.uploader-btn {
  width: 144px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #d1e1ec !important;
  padding: 0 !important;
  color: #666 !important;
  font-size: 14px;
  margin-right: 10px;
  &:hover {
    color: #007aff !important;
    border-color: #b3d7ff;
    background-color: #e6f2ff;
  }
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    .uploadImg_before {
      margin-right: 8px;
      font-size: 20px;
    }
  }
}
.upload-tip {
  display: flex;
  font-size: 12px;
  align-items: center;
  .tip {
    display: flex;
    align-items: center;
    .up_tip {
      margin-left: 6px;
      line-height: initial;
    }
  }
  .fileTip2 {
    position: absolute;
    left: 172px;
    top: 40px;
  }
}
.uploader-file-info {
  margin-top: 8px;
  width: 440px;
  background: #e6f7ff;
  border-radius: 2px;
  border: 1px solid #d4f0ff;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  line-height: initial;
  &:hover {
    border: 1px solid #007aff;
  }
  .file-name {
    font-size: 12px;
    color: #333;
    display: flex;
    align-items: center;
    line-height: initial;
    .name {
      width: 300px;
      margin-left: 8px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-icon-error {
      color: #ff0000;
    }
  }
  .el-icon-close {
    color: #999999;
    &:hover {
      color: #007aff;
    }
  }
  i {
    font-size: 14px;
  }
  .el-icon-video-pause,
  .el-icon-video-play,
  .el-icon-close,
  .iconxiazai {
    color: #999;
    cursor: pointer;
  }
  .operate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      margin-left: 12px;
    }
  }

  &.success {
    .el-icon-loading,
    .el-icon-paperclip,
    .el-icon-close,
    .el-icon-view,
    .iconxiazai {
      color: #007aff;
    }
    .iconxiazai {
      font-size: 17px;
    }
  }
}
.fileImg {
  width: 16px;
  height: 16px;
}
::v-deep .el-progress__text {
  display: none;
}
::v-deep .el-progress-bar {
  margin-right: 0 !important;
  padding-right: 0 !important;
}
</style>