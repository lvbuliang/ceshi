<template>
  <div class="uploader-file" :class="status" :status="status">
    <slot
      :file="file"
      :list="list"
      :status="status"
      :paused="paused"
      :error="error"
      :response="response"
      :average-speed="averageSpeed"
      :formated-average-speed="formatedAverageSpeed"
      :current-speed="currentSpeed"
      :is-complete="isComplete"
      :is-uploading="isUploading"
      :size="size"
      :formated-size="formatedSize"
      :uploaded-size="uploadedSize"
      :progress="progress"
      :progressing-class="progressingClass"
      :time-remaining="timeRemaining"
      :formated-time-remaining="formatedTimeRemaining"
      :type="type"
      :extension="extension"
      :file-category="fileCategory"
    >
      <!-- <div class="icons">
                <i class="el-icon-loading" v-if="status == 'uploading'"></i>
                <i class="el-icon-error" v-else-if="status == 'error'"></i>
                <i class="el-icon-success" v-else-if="status == 'success'"></i>
                <i class="el-icon-refresh-right" v-else-if="status == 'paused'"></i>
            </div> -->
      <div class="files">
        <div class="uploader-file-info">
          <div class="file-name">
            <span style="cursor: pointer" class="name" @click="toDwon(file)">{{
              file.name || file.fileName
            }}</span>
          </div>
          <span class="percentage">{{ percentage }}%</span>
          <div class="operate">
            <i
              class="el-icon-video-pause"
              v-if="status == 'uploading'"
              @click="pause"
            ></i>
            <i
              class="el-icon-video-play"
              v-else-if="status == 'paused'"
              @click="resume"
            ></i>
            <i
              class="el-icon-refresh-right"
              v-else-if="status == 'error'"
              @click="retry"
            ></i>
            <i class="el-icon-close" @click="remove"></i>
          </div>
        </div>
        <div class="progress">
          <el-progress
            :percentage="percentage"
            status="exception"
            color="#F5222D"
            :stroke-width="2"
            v-if="status == 'error'"
          ></el-progress>
          <el-progress
            :percentage="percentage"
            status="success"
            color="#52C41A"
            :stroke-width="2"
            v-else-if="status == 'success' || status === 'uploading'"
          ></el-progress>
          <el-progress
            :percentage="percentage"
            :stroke-width="2"
            color="#CCCCCC"
            v-else
          ></el-progress>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import Uploader from "simple-uploader.js";
import events from "./common/file-events";
import { secondsToStr } from "./common/utils";

const COMPONENT_NAME = "uploader-file";

export default {
  inject: ["baseUrl", "imgBaseUrl", "uploadBaseUrl"],
  name: COMPONENT_NAME,
  props: {
    file: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      response: null,
      paused: false,
      error: false,
      averageSpeed: 0,
      currentSpeed: 0,
      isComplete: false,
      isUploading: false,
      size: 0,
      formatedSize: "",
      uploadedSize: 0,
      progress: 0,
      timeRemaining: 0,
      type: "",
      extension: "",
      progressingClass: "",
    };
  },
  computed: {
    fileCategory() {
      const extension = this.extension;
      const isFolder = this.file.isFolder;
      let type = isFolder ? "folder" : "unknown";
      const categoryMap = this.file.uploader.opts.categoryMap;
      const typeMap = categoryMap || {
        image: ["gif", "jpg", "jpeg", "png", "bmp", "webp"],
        video: ["mp4", "m3u8", "rmvb", "avi", "swf", "3gp", "mkv", "flv"],
        audio: ["mp3", "wav", "wma", "ogg", "aac", "flac"],
        document: [
          "doc",
          "txt",
          "docx",
          "pages",
          "epub",
          "pdf",
          "numbers",
          "csv",
          "xls",
          "xlsx",
          "keynote",
          "ppt",
          "pptx",
        ],
      };
      Object.keys(typeMap).forEach((_type) => {
        const extensions = typeMap[_type];
        if (extensions.indexOf(extension) > -1) {
          type = _type;
        }
      });
      return type;
    },
    percentage() {
      const progress = Math.floor(this.progress * 100);
      return progress;
    },
    formatedAverageSpeed() {
      return `${Uploader.utils.formatSize(this.averageSpeed)} / s`;
    },
    progressStatus() {
      if (this.status == "error") {
        return "exception";
      } else {
        return "";
      }
    },
    status() {
      const isUploading = this.isUploading;
      const isComplete = this.isComplete;
      const isError = this.error;
      const paused = this.paused;
      if (isComplete) {
        return "success";
      } else if (isError) {
        return "error";
      } else if (isUploading) {
        return "uploading";
      } else if (paused) {
        return "paused";
      } else {
        return "waiting";
      }
    },
    statusText() {
      const status = this.status;
      const fileStatusText = this.file.uploader.fileStatusText;
      let txt = status;
      if (typeof fileStatusText === "function") {
        txt = fileStatusText(status, this.response);
      } else {
        txt = fileStatusText[status];
      }
      return txt || status;
    },
    formatedTimeRemaining() {
      const timeRemaining = this.timeRemaining;
      const file = this.file;
      if (timeRemaining === Number.POSITIVE_INFINITY || timeRemaining === 0) {
        return "";
      }
      let parsedTimeRemaining = secondsToStr(timeRemaining);
      const parseTimeRemaining = file.uploader.opts.parseTimeRemaining;
      if (parseTimeRemaining) {
        parsedTimeRemaining = parseTimeRemaining(
          timeRemaining,
          parsedTimeRemaining
        );
      }
      return parsedTimeRemaining;
    },
  },
  watch: {
    status(newStatus, oldStatus) {
      if (oldStatus && newStatus === "uploading" && oldStatus !== "uploading") {
        this.tid = setTimeout(() => {
          this.progressingClass = "uploader-file-progressing";
        }, 200);
      } else {
        clearTimeout(this.tid);
        this.progressingClass = "";
      }
    },
  },
  methods: {
    _actionCheck() {
      this.paused = this.file.paused;
      this.error = this.file.error;
      this.isUploading = this.file.isUploading();
    },
    pause() {
      this.file.pause();
      this._actionCheck();
      this._fileProgress();
      this.$emit("pause");
    },
    resume() {
      this.file.resume();
      this._actionCheck();
      this.$emit("resume");
    },
    remove() {
      this.file.cancel();
    },
    retry() {
      this.file.retry();
      this._actionCheck();
    },
    processResponse(message) {
      let res = message;
      try {
        res = JSON.parse(message);
      } catch (e) {}
      this.response = res;
    },
    fileEventsHandler(event, args) {
      const rootFile = args[0];
      const file = args[1];
      const target = this.list ? rootFile : file;
      if (this.file === target) {
        if (this.list && event === "fileSuccess") {
          this.processResponse(args[2]);
          return;
        }
        this[`_${event}`].apply(this, args);
      }
    },
    _fileProgress() {
      this.progress = this.file.progress();
      this.averageSpeed = this.file.averageSpeed;
      this.currentSpeed = this.file.currentSpeed;
      this.timeRemaining = this.file.timeRemaining();
      this.uploadedSize = this.file.sizeUploaded();
      this._actionCheck();
    },
    _fileSuccess(rootFile, file, message) {
      if (rootFile) {
        this.processResponse(message);
      }
      this._fileProgress();
      this.error = false;
      this.isComplete = true;
      this.isUploading = false;
    },
    _fileComplete() {
      this._fileSuccess();
    },
    _fileError(rootFile, file, message) {
      this._fileProgress();
      this.processResponse(message);
      this.error = true;
      this.isComplete = false;
      this.isUploading = false;
    },
    toDwon(file) {
      let token = sessionStorage.getItem("token");
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
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      }
    },
  },
  mounted() {
    const staticProps = ["paused", "error", "averageSpeed", "currentSpeed"];
    const fnProps = [
      "isComplete",
      "isUploading",
      {
        key: "size",
        fn: "getSize",
      },
      {
        key: "formatedSize",
        fn: "getFormatSize",
      },
      {
        key: "uploadedSize",
        fn: "sizeUploaded",
      },
      "progress",
      "timeRemaining",
      {
        key: "type",
        fn: "getType",
      },
      {
        key: "extension",
        fn: "getExtension",
      },
    ];
    staticProps.forEach((prop) => {
      this[prop] = this.file[prop];
    });
    fnProps.forEach((fnProp) => {
      if (typeof fnProp === "string") {
        this[fnProp] = this.file[fnProp]();
      } else {
        this[fnProp.key] = this.file[fnProp.fn]();
      }
    });

    const handlers = (this._handlers = {});
    const eventHandler = (event) => {
      handlers[event] = (...args) => {
        this.fileEventsHandler(event, args);
      };
      return handlers[event];
    };
    events.forEach((event) => {
      this.file.uploader.on(event, eventHandler(event));
    });
  },
  destroyed() {
    events.forEach((event) => {
      this.file.uploader.off(event, this._handlers[event]);
    });
    this._handlers = null;
  },
};
</script>

<style lang="scss">
.uploader-file {
  position: relative;
  width: 194px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2px 12px;
  height: 32px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  display: inline-block;
  margin-right: 8px;
  &.success {
    .el-icon-loading,
    .el-icon-paperclip,
    .el-icon-close,
    .el-icon-view {
      color: #007aff;
    }
  }
  .progress {
    .el-progress-bar {
      padding-right: 0;
    }
    .el-progress__text {
      display: none;
    }
  }
  .percentage {
    font-size: 12px;
    color: #333;
    line-height: initial;
    display: flex;
    align-items: center;
  }
  .operate {
    display: none;
    line-height: initial;
  }
  &:hover {
    .operate {
      display: inline-block;
    }
    .percentage {
      display: none;
    }
  }
}
.uploader-file[status="waiting"] .uploader-file-pause,
.uploader-file[status="uploading"] .uploader-file-pause {
  display: block;
}
.uploader-file[status="paused"] .uploader-file-resume {
  display: block;
}
.uploader-file[status="error"] .uploader-file-retry {
  display: block;
}
.uploader-file[status="success"] .uploader-file-remove {
  display: none;
}
.uploader-file[status="error"] .uploader-file-progress {
  background: #ffe0e0;
}
.uploader-file-progress {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #e2eeff;
  transform: translateX(-100%);
}
.uploader-file-progressing {
  transition: all 0.4s linear;
}
.icons {
  margin-right: 5px;
  i {
    vertical-align: super;
    padding: 0 2px 0 2px;
  }
}
.files {
  width: 100%;
}
.uploader-file-info {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .file-name {
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;
    line-height: initial;
    .name {
      width: 100px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-icon-error {
      color: #f5222d;
    }
    .el-icon-success {
      color: #52c41a;
    }
  }
  .el-icon-close,
  .el-icon-video-play,
  .el-icon-refresh-right {
    margin-left: 8px;
    color: #999999;
    &:hover {
      color: #333;
    }
  }
  i {
    font-size: 14px;
  }
  .el-icon-video-pause,
  .el-icon-video-play,
  .el-icon-close,
  .el-icon-refresh-right,
  .el-icon-view {
    color: #999;
    cursor: pointer;
  }
}
.uploader-file-info:hover {
  background-color: rgba(240, 240, 240, 0.2);
}
.uploader-file-info i,
.uploader-file-info em {
  font-style: normal;
}
.uploader-file-name,
.uploader-file-size,
.uploader-file-meta,
.uploader-file-status,
.uploader-file-actions {
  float: left;
  position: relative;
  height: 100%;
}
.uploader-file-name {
  width: 45%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-indent: 14px;
}
.uploader-file-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: top;
  margin-top: 13px;
  margin-right: 8px;
}
.uploader-file-icon::before {
  content: "📃";
  display: block;
  height: 100%;
  font-size: 24px;
  line-height: 1;
  text-indent: 0;
}
.uploader-file-icon[icon="folder"]::before {
  content: "📂";
}
.uploader-file-icon[icon="image"]::before {
  content: "📊";
}
.uploader-file-icon[icon="video"]::before {
  content: "📹";
}
.uploader-file-icon[icon="audio"]::before {
  content: "🎵";
}
.uploader-file-icon[icon="document"]::before {
  content: "📋";
}
.uploader-file-size {
  width: 13%;
  text-indent: 10px;
}
.uploader-file-meta {
  width: 8%;
}
.uploader-file-status {
  width: 24%;
  text-indent: 20px;
}
.uploader-file-actions {
  width: 10%;
}
.uploader-file-actions > span {
  display: none;
  float: left;
  width: 16px;
  height: 16px;
  margin-top: 16px;
  margin-right: 10px;
  cursor: pointer;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAYAAAD0ZHJ6AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxMAAAsTAQCanBgAAARkSURBVGje7ZnfS1NRHMAH4ptPkvQSuAdBkCxD8FUQJMEULUgzy1KyyPVQ4JMiiP4Bvg6EwUQQfMmwhwRDshwaKUjDVCgoSdDNHkzTJZ6+Z37Purve8+PeTb2TM/ggu+ew89l33x8H9BBCPG7GowXTJej3+wnDvEm0JuLC04+EYWftVAUv+fiCvDUdQR1BHUEdQR3BTIygvixoQS14XgTtthLVdpNWwXRLqvQ724LplFRtyrYF0yVpFLQrKRVMh6RZ0I6kkmCqklaCqpKZH0FX56Crq9jVfdDVk0RfFrSgFsxkQVmLcdKCVrKySCrryhPEyYShhzOcrFtG0EoilfHHk1CRU5rF6ZjNZhlVOW6RnMSVyyilKies4pO41diVy8wIujoHXV3FGdMHXTtJKLFYTLhZtq4vC1rwXApCZTIqgR6g1PBMCO9DL3bMMSqBHqDU8EyISDAHiGKvWwcCQG2KgjlAFCDAOhAAap0K5gKLphk8mqJgLrCIgoxRJ4J5wKpJ7gAoMkn5EBXBPGDVJHcAFJmkfIhQcAql1oBpTvTol9gG9pm4RHAKpdaAaU706JfYBvaZuJVgPQrt4sFlnOh5MC/p3lmJYD0K7eLBZZzoeTAv6d5ZnuAYHjpgEOnk5F0ufhG6v1ggOIaHDhhEOjl5l4tfhO4vthLcwAMrFNvLJO5vEwhu4IEViu1lEve3WQmyoihQFBzG/V0CQVYUBYqCw7i/SxTBcpsRbFeIYLnNCLZbCY5b5KAnxRwct8hBj9McZFVMW0ihRNBuFdMWUigRlFaxuQ9WWYjRMTiIe5z0wSoLMToGB3GPsA9aTZIJoB+nRgBnM1tzOkkmgH6cGgGczWzNpzqLx3n/aULJJgezeNw07oxQySbVywKjBOgFRnDs+VEsx8FlgVEC9AIjOPb8KJYjvSzoG7UW1IJaUAtqQS14toLNM5fN5APdwBJA8G83Pk/aK/rgzVvXzeQD3cASQPBvNz5P2ssTzAaGUIrHEO6zI5gNDKEUjyHcxxWkh4Ylcowwk1QQpIeGJXKMMJO0EgwqyjGCioJBJvDrxRMSuVOTJEXfbz1/bHwWtBL0yoQehK6RucgE+bGzanzulQh6E3IgQV+xpc8kcrfuSO7eTfJ3ZYmQw0Oy9azVKOk1C/bJ5D5F38YPeLfx0rjWJxHsS0SqsSYuxySjj5qO5Oj7xQWy2VBtFOwzCy6ryH3YfE3uh64Y1xckgstJPydEjkkeHv07Iy4Xaao15+KCWTBx6M/db+T9xivSErqaJDdzXI6yLRE8Vgg0coex/SPJvT0SbWu0KpZtbgSpCH3NRt7I5OxHkObc6heU+/M/J5vrpBFM5GBLqCQux14COXs5CNXK5OjPGm1tSMrJSOMNYQ4mVTGV/L6zTL7+DovkbFUxbSW0Wo05l8hJWsU+cRWfSh+Mt5Lb1ck/J1TvVsdDaR/MiEni+llsdZuZp62EViu+96bpNjNPWwmtVnzvFd5m9IVVC54x/wA7gNvqFG9vXQAAAABJRU5ErkJggg==")
    no-repeat 0 0;
}
.uploader-file-actions > span:hover {
  background-position-x: -21px;
}
.uploader-file-actions .uploader-file-pause {
  background-position-y: 0;
}
.uploader-file-actions .uploader-file-resume {
  background-position-y: -17px;
}
.uploader-file-actions .uploader-file-retry {
  background-position-y: -53px;
}
.uploader-file-actions .uploader-file-remove {
  display: block;
  background-position-y: -34px;
}

::v-deep .el-progress__text {
  display: none;
}
::v-deep .el-progress-bar {
  margin-right: 0 !important;
  padding-right: 0 !important;
}
</style>
