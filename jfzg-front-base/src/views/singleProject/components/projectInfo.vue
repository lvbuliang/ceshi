<template>
  <div class="projectInfo">
    <div
      class="projectInfo-content"
      v-if="informationList && informationList.length > 0"
    >
      <div
        v-for="item in informationList"
        :key="item.id"
        class="projectInfo-content-item"
      >
        <div class="top">
          <div class="circle"></div>
          <span>{{ item.reportTime }}</span>
          <div class="status">已报送</div>
        </div>
        <div class="bottom">
          <span class="title">项目状态：</span>
          <span>{{ item.statusName }}</span>
          <span class="title">项目阶段：</span>
          <span>{{ item.projectStage }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <EmptyFile
        :title="'暂无项目信息报送，立即'"
        :btnName="'报送'"
        @handleEmptyClick="infoTalk"
        v-if="roleCode == 'JSDW_JBR'"
      ></EmptyFile>
      <EmptyFile
        :title="'暂无项目信息报送'"
        @handleEmptyClick="infoTalk"
        v-else
      ></EmptyFile>
    </div>
  </div>
</template>

<script>
import { getlistReportPush } from "@/api/singleProject.js";
import EmptyFile from "./emptyFile.vue";
export default {
  props: {},
  data() {
    return {
      informationList: [],
    };
  },
  computed: {
    roleCode: function () {
      return JSON.parse(sessionStorage.getItem("userInfo")).roles[0].roleCode;
    },
  },
  created() {
    console.log(this.roleCode, "2222");
    this.getlistReportPush();
  },
  methods: {
    // 获取报送列表
    getlistReportPush() {
      getlistReportPush({
        projectId: this.$route.query.projectId,
        pageNum: 1,
        pageSize: 3,
      }).then((res) => {
        this.informationList = res.data.records;
      });
    },
    // 点击报送跳转报送页面
    infoTalk() {
      window.location.href = `/subdis/#/submitAdd?projectId=${this.$route.query.projectId}`;
    },
  },
  components: {
    EmptyFile,
  },
};
</script>

<style lang="scss">
.projectInfo {
  padding-bottom: 16px;
  .projectInfo-content {
    display: flex;
    flex-wrap: wrap;
    .projectInfo-content-item {
      margin-bottom: 15px;
      width: 100%;
      .top {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .circle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid #1890ff;
          margin-right: 4px;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          margin-right: 16px;
        }
        .status {
          height: 24px;
          background: #e6f7ff;
          border-radius: 12px;
          padding: 0 8px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1890ff;
          line-height: 24px;
          &.noWork {
            background: #fff1f0;
            color: #f5222d;
          }
        }
      }
      .bottom {
        background: linear-gradient(270deg, #ffffff 0%, #f7f7f7 100%);
        border-radius: 8px;
        padding: 5px 0 5px 12px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
          &:nth-child(2) {
            margin-right: 79px;
          }
        }
        .title {
          color: #666666;
        }
      }
    }
    .projectInfo-content-item:nth-last-child(1) {
      margin-bottom: 0px;
    }
  }
}
</style>