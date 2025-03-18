<template>
  <div class="knowledgeBaseList">
    <p v-if="total > 0">知识库为您找到相关结果{{ total }}个</p>
    <ul>
      <li v-for="(item, index) in listData" :key="index" @click="liClick(item)">
        <div class="title">
          <span v-html="item.fileName"></span>
        </div>
        <p>
          <span v-html="item.fileContent"></span>
        </p>
        <div class="footer">
          <span class="timeBox">{{ item.createTime }}</span>
          <b>{{ item.createPerson }}</b>
          <span v-if="item.tagList.length" class="tagBox">
            <el-tag
              class="tag"
              v-for="(item1, index) in item.tagList"
              :key="index"
              :type="list[item1].type"
              size="small"
              >{{ list[item1].title }}</el-tag
            >
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    total: [String, Number],
    listData: [Array],
  },
  data() {
    return {
      list: [
        { title: "数据挖掘", type: "" },
        { title: "项目管理", type: "success" },
        { title: "大数据局", type: "info" },
        { title: "业务系统", type: "warning" },
        { title: "知识图谱", type: "danger" },
        { title: "专项规划", type: "" },
        { title: "可研文档", type: "success" },
        { title: "概算文档", type: "info" },
        { title: "虚拟现实", type: "warning" },
        { title: "区块链", type: "danger" },
        { title: "物联网", type: "" },
        { title: "信息安全", type: "success" },
        { title: "人工智能", type: "info" },
        { title: "云计算", type: "warning" },
        { title: "生物特征识别", type: "danger" },
        { title: "人机交互", type: "" },
        { title: "智慧城市", type: "success" },
        { title: "数据归集", type: "info" },
        { title: "云网建设", type: "warning" },
        { title: "物联感知", type: "danger" },
        { title: "一网协同", type: "" },
      ],
    };
  },
  methods: {
    liClick(item) {
      this.$router.push({
        name: "knowledgeBaseView",
        query: { id: item.busiId, title: item.title },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledgeBaseList {
  margin-top: 24px;
  > p {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    margin-bottom: 16px;
  }
  ul {
    li {
      border-bottom: 1px dashed #e6e6e6;
      padding: 16px 0;
      cursor: pointer;
      .title {
        font-size: 18px;
        font-weight: 400;
        color: #096dd9;
      }
      p {
        margin: 8px 0;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .footer {
        .timeBox {
          font-size: 12px;
          color: #999999;
          position: relative;
          &::after {
            position: absolute;
            content: "";
            width: 1px;
            height: 10px;
            background-color: #cccccc;
            top: 2px;
            right: -8px;
          }
        }
        .tagBox{
          margin-left: 16px;
        }
        .tag {
          margin-right: 8px;
        }
        b {
          font-size: 12px;
          font-weight: 400;
          color: #666666;
          margin-left: 16px;
        }
      }
    }
  }
}
</style>
