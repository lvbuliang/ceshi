<template>
  <div class="fileUpload">
    <div class="fileUpload-content" v-if="fileList && fileList.length > 0">
      <div
        v-for="item in fileList"
        :key="item.id"
        class="fileUpload-content-item"
      >
        <i class="el-icon-paperclip"></i>
        <span
          class="filename"
          @click="seeFile(item)"
          :title="item.name"
          v-if="item.name.length > 40"
          >{{ item.name.slice(0, 40) }}...</span
        >
        <span
          class="filename"
          @click="seeFile(item)"
          :title="item.name"
          v-else
          >{{ item.name }}</span
        >

        <i
          class="sr-icon-download"
          style="color: rgb(24, 144, 255);"
          @click="download(item)"
        ></i>
      </div>
    </div>
    <div v-else>
      <EmptyFile :title="'暂无过程文档报备'"></EmptyFile>
    </div>
  </div>
</template>

<script>
import { getDeliveryReport } from "@/api/singleProject.js";
import config from "@/setting.js";
import EmptyFile from "./emptyFile.vue";
export default {
  props: {},
  data() {
    return {
      fileList: [],
    };
  },
  created() {
    this.getDeliveryReport();
  },
  methods: {
    // 获取文件列表
    getDeliveryReport() {
      getDeliveryReport({ projectId: this.$route.query.projectId }).then(
        (res) => {
          for (let index = 0; index < res.data.length; index++) {
            res.data[index] = JSON.parse(res.data[index])[0];
          }
          this.fileList = res.data;
        }
      );
    },
    // 下载文件
    download(item) {
      let token = sessionStorage.getItem("token");
      window.open(
        `${config.baseUrl}/jfzg/file/api/file/downloadStream?key=${item.id}&access_token=${token}`
      );
    },
    // 查看文件
    seeFile(item) {
      let token = sessionStorage.getItem("token");
      if (item.name) {
        if (
          ['txt', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'html', 'pdf'].includes(
            item.name.split(".").pop()
          )
        ) {
          window.open(`${config.baseUrl}/viewPdf?id=${item.id}`);
        } else {
          window.open( `${config.baseUrl}/jfzg/file/api/file/download?key=${item.id}&access_token=${token}`)
        }
      }
    },
  },
  components: {
    EmptyFile,
  },
};
</script>

<style lang="scss">
.fileUpload {
  // padding-bottom: 8px;
 
  .fileUpload-content {
    display: flex;
    flex-wrap: wrap;
    .fileUpload-content-item {
      margin-top: 8px;
      width: 100%;
      height: 32px;
      background: linear-gradient(270deg, #ffffff 0%, #f7f7f7 100%);
      border-radius: 8px;
      line-height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      position: relative;
      padding-left: 15px;
      &:hover .sr-icon-download {
        display: inline-block;
      }
      .filename {
        cursor: pointer;
        &:hover {
          color: rgb(24, 144, 255);
        }
      }
      i {
        margin-right: 3px;
      }
      .sr-icon-download {
        display: none;
        position: absolute;
        cursor: pointer;
        right: 0;
        top: 24%;
      }
    }
     .fileUpload-content-item:nth-child(1){
       margin-top: 0px;
     }
  }
}
</style>
