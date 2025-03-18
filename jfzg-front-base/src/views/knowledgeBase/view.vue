<template>
  <div class="knowledgeBaseView">
    <header>
      <div class="left">
        <img src="@/assets/images/zhishiku/view.png" alt="" />
        <h3>{{ viewData.fileName }}</h3>
      </div>

      <el-button type="primary" icon="el-icon-download" @click="download"
        >立即下载</el-button
      >
    </header>
    <Table :viewData="viewData"></Table>
    <iframe class="iframe" :src="url"></iframe>
  </div>
</template>

<script>
import Table from "./table";
import { queryById } from "@/api/knowledgeBase/index";
import config from "@/setting.js";
import { getStorageToken } from "@/utils/user-vali.js";

export default {
  components: {
    Table,
  },
  data() {
    return {
      viewData: {},
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    url() {
      if (!this.viewData.fileName) {
        return "";
      }
      if (
        ['txt', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'html', 'pdf'].includes(
          this.viewData.fileName.split(".").pop()
        )
      ) {
        return `${config.baseUrl}/viewPdf?id=${this.viewData.url}`;
      } else {
        return `${config.baseUrl}/jfzg/file/api/file/download?key=${this.viewData.url}&access_token=${this.access_token}`;
      }
    },
    access_token() {
      return getStorageToken();
    },
  },
  created() {
    this.getViewData();
  },
  methods: {
    getViewData() {
      queryById({ id: this.id }).then((res) => {
        if (res && res.msg && res.msg.code == "0000") {
          this.viewData = res.data;
        }
      });
    },
    download() {
      window.open(
        `${config.baseUrl}/jfzg/file/api/file/downloadStream?key=${this.viewData.url}&access_token=${this.access_token}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledgeBaseView {
  ::v-deep {
    .el-button {
      width: 124px;
      height: 32px;
      background: #1890ff;
      border-radius: 16px;
      padding: 0 24px;
    }
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    .left {
      img {
        width: 32px;
        margin-right: 4px;
      }
      h3 {
        font-size: 24px;
        font-weight: 500;
        color: #333333;
      }
    }
  }
  .iframe {
    width: 100%;
    height: 480px;
  }
}
</style>
