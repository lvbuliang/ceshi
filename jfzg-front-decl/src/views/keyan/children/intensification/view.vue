<template>
  <div class="intensificationView">
    <Title :isPreview="false" :obj="obj" name="intensificationList" :query="{id: this.id}" />
    <div class="content">
      <div class="left">
        <iframe
          :src="url(obj.fileId,obj.fileName)"
          frameborder="0"
          style="width: 100%; height: 600px"
        ></iframe>
      </div>
      <div class="right">
        <div class="title">
          <div>相似文档（{{arr.length}}）</div>
          <i class="icon el-icon-arrow-right" @click="goClick"></i>
        </div>
        <ul class="fileGather">
          <li v-for="(item,i) in arr" :key="i +'view'">
            <span>
              <i class="icon el-icon-paperclip"></i>
              {{item.fileName}}
            </span>
            <span :class="item.color == 'red' && 'red'">{{item.similarity}}%</span>
          </li>
        </ul>
      </div>
    </div>
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="[{ role: '', btns: [],  nodes: []}]"
      :backName="$route.name.includes('Audit') ? 'keyanAudit' : 'keyan'"
    ></sr-work-flow>
  </div>
</template>
<script>
import config from "@/settings.js";
import Title from "@/views/components/intensification/title.vue";
import { api_projectStudy_detail, api_projectStudy_list } from "@/api/keyan";
import { getStorageToken } from "@/utils/user-vali.js";

export default {
  components: {
    Title,
  },
  created() {
    this.init();
    this.initView();
  },
  mounted() {},
  data() {
    return {
      id: this.$route.query.id, // 业务id
      arr: [],
      obj: {},
      page: {
        total: 11,
        pageSize: 6,
        pageSizes: [5, 10, 20, 30],
        pageNum: 1,
      },
    };
  },
  methods: {
    url(fileId, fileName) {
      if (!fileName) return "";

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
        ].includes(this.getFileType(fileName))
      ) {
        return `${config.baseUrl}/viewPdf?id=${fileId}`;
      } else {
        return `${config.baseUrl}/jfzg/file/api/file/download?key=${fileId}&access_token=${this.access_token}`;
      }
    },
    async init() {
      let params = {
        busiId: this.id, //当前可研主键
        pageNum: this.page.pageNum, //当前页
        pageSize: this.page.pageSize, //每页条数
      };
      let res = await api_projectStudy_list(params);
      if (res.msg.code != "0000" || !res.data) return;
      this.$set(this, "arr", res.data.records);
    },
    async initView() {
      let params = {
        id: this.id, //当前可研主键
      };
      let res = await api_projectStudy_detail(params);
      if (res.msg.code != "0000" || !res.data) return;
      this.$set(this, "obj", res.data);
    },
    goClick() {
      // 跳到集约化列表页
      this.$router.push({
        name: "intensificationList",
        query: { id: this.id },
      });
    },
    // 上一页
    prePage() {
      let page = this.pageNum;
      page = page > 1 ? page - 1 : this.numPages;
      this.pageNum = page;
    },

    // 下一页
    nextPage() {
      let page = this.pageNum;
      page = page < this.numPages ? page + 1 : 1;
      this.pageNum = page;
    },
    access_token() {
      return getStorageToken();
    },
    getFileType(filePath) {
      // 获取文件后缀
      return filePath && filePath.substr(filePath.lastIndexOf(".") + 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.pdf {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .pdfBox {
    width: 100%;
    height: 100%;
    z-index: 0;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .padfHeader {
    width: 100%;
    height: 40px;
    background: rgba(0, 0, 0, 0.75);
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.2);
    border: 1px solid #4d4d4d;
    box-sizing: border-box;

    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    .text {
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      width: 206px;
      height: 100%;
      line-height: 40px;
      span {
        display: inline-block;
      }
      .right {
        color: rgba(255, 255, 255, 0.2);
      }
    }
    .el-button {
      width: 72px;
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      padding: 0;
      color: rgba(255, 255, 255, 0.2);
      background: transparent;
      border: 0;
      border-radius: 8px;
      text-align: center;
      &:hover {
        background: rgba($color: #fff, $alpha: 0.2);
        color: #fff;
      }
      i {
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
}

.intensificationView {
  .content {
    display: flex;
    margin-top: 23px;
    .left {
      flex-grow: 1;
    }
    .right {
      box-sizing: border-box;
      width: 410px;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #efefef;
      margin-left: 16px;

      .title {
        height: 24px;
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        line-height: 24px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;

        .icon {
          font-size: 14px;
          color: #1890ff;
          cursor: pointer;
        }
      }

      .fileGather {
        li {
          width: 100%;
          display: flex;
          padding-left: 12px;
          padding-right: 8px;
          height: 32px;
          line-height: 32px;
          background: linear-gradient(270deg, #ffffff 0%, #f7f7f7 100%);
          border-radius: 8px;
          justify-content: space-between;
          color: #333333;
          margin-top: 8px;
          cursor: pointer;
          .icon {
            margin-right: 4px;
          }

          .red {
            color: #f5222d;
          }
        }
      }
    }
  }
}
</style>