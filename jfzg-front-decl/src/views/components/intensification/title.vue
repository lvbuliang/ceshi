<template>
  <div class="intensificationTitleDiv">
    <div class="left">
      <img class="img" :src="fileImg(obj.fileName)" alt />
    </div>
    <div class="right">
      <h3 class="title" @click="goClick">{{obj.projectName}}</h3>
      <ul class="info">
        <li>{{obj.createTime}}</li>
        <li>上传人：{{obj.creatorName}}</li>
        <li>预算单位：{{obj.buName}}</li>
      </ul>
      <div class="tag" :class="!openOffFlag && 'limitHeight'">
        <p v-for="(item,i) in obj.labelVos" :key="i +'info'">{{item}}</p>
        <div v-if="obj.labelVos && obj.labelVos.length > 15" class="openOff">
          <i v-if="openOffFlag" class="icon el-icon-arrow-up" @click="openOffFlag = false"></i>
          <i v-else class="icon el-icon-arrow-down" @click="openOffFlag = true"></i>
        </div>
      </div>
      <div class="btns">
        <el-button
          v-if="isPreview"
          type="primary"
          class="btn"
          @click="preview(obj.fileId,obj.fileName)"
        >
          <i class="base-iconfont icon-browse"></i>
          文件预览
        </el-button>
        <el-button
          :type="!isPreview ? 'primary' :''"
          class="btn download"
          @click="download(obj.fileId)"
        >
          <i class="base-iconfont icon-download"></i>立即下载
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import config from "@/settings.js";
import { fileTypeImg, getFileType } from "./utils.js";
export default {
  props: {
    isPreview: {
      // 文件预览 默认开启
      type: Boolean,
      default: true,
    },
    obj: {
      type: Object,
      default: {
        labelVos: [],
      },
    }, // 详情数据
    name: String, // 路由名称
    query: Object, // 路由传参
  },
  data() {
    return {
      openOffFlag: false,
      baseUrl: config.uploadBaseUrl,
    };
  },
  created() {},
  methods: {
    fileImg(val) {
      return val ? fileTypeImg(getFileType(val)) : "";
    },
    goClick() {
      this.$router.push({ name: this.name, query: this.query });
    },
    preview(id, name) {
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
        ].includes(getFileType(name))
      ) {
        window.open(`${config.baseUrl}/viewPdf?id=${id}`);
      } else {
        window.open(
          `${config.baseUrl}/jfzg/file/api/file/download?key=${id}&access_token=${token}`
        );
      }
    },
    download(id) {
      let token = sessionStorage.getItem("token");
      this.exportFile(
        `${this.baseUrl}/jfzg/file/api/file/downloadStream?key=${id}&access_token=${token}`
      );
    },
    //无闪烁跳转
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
  },
};
</script>
<style lang="scss"scoped>
.intensificationTitleDiv {
  padding-bottom: 17px;
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  .left {
    width: 48px;
    align-items: start;
    .img {
      width: 100%;
      height: 48px;
    }
  }

  .right {
    flex-grow: 1;
    position: relative;
    padding-left: 16px;
    .btns {
      position: absolute;
      right: 0;
      top: 13px;

      .btn {
        width: 124px;
        height: 32px;
        border: 0;
        border-radius: 16px;
        margin-left: 16px;
        padding-top: 0;
        padding-bottom: 0;
        &:first-child {
          margin-left: 0;
        }

        .base-iconfont {
          margin-right: 3px;
        }
      }

      .download {
        border: 1px solid #cccccc;
      }
    }
    .title {
      font-size: 24px;
      color: #333333;
      height: 32px;
      line-height: 32px;
      max-width: 936px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    }

    .info {
      margin: 8px 0;
      height: 18px;
      font-size: 12px;
      color: #999999;
      line-height: 18px;
      display: flex;
      max-width: 936px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      li {
        border-left: 1px solid #979797;
        padding: 0 16px;
        &:first-child {
          border-left: none;
          padding-left: 0;
        }
      }
    }

    .tag {
      position: relative;
      padding-right: 30px;
      .openOff {
        position: absolute;
        right: 0px;
        top: 4px;
        .icon {
          font-size: 14px;
          color: #1890ff;
        }
      }
      p {
        display: inline-block;
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        box-sizing: border-box;
        color: #1890ff;
        background: rgba(230, 247, 255, 0.5);
        border-radius: 8px;
        padding: 0px 8px;
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }

    .limitHeight {
      height: 32px;
      overflow: hidden;
    }
  }
}
</style>