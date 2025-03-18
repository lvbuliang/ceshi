<template>
  <div class="left-wrap">
    <div class="search-wrap">
      <el-input
        placeholder="请输入关键词"
        v-model="searchVal"
        slot="suffix"
        @keyup.enter="onEnterSearch"
      >
      </el-input>
      <el-button
        icon="el-icon-search"
        size="small"
        type="primary"
        name="搜索"
        circle
        style="margin-left: 10px"
        @click="handleSearh"
      ></el-button>
      <el-button
        icon="el-icon-refresh"
        size="small"
        class="resetBtn"
        name="重置"
        circle
        @click="resetData()"
      ></el-button>
    </div>
    <div class="list-wrap">
      <div
        v-for="item in dataList"
        :key="item.id"
        class="list-item"
        @click="handleDetail(item)"
      >
        <el-tooltip
          :content="item.projectName"
          placement="top-start"
          effect="light"
        >
          <span class="content">{{ item.projectName }}</span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    projectList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      searchVal: "", //关键词
      dataList: [], //列表数据
    };
  },
  created() {
    console.log(this.projectList);
    this.dataList = this.projectList;
    if (this.dataList && this.dataList.length > 0) {
      this.$emit("handleDetail", this.dataList[0]);
    }
  },
  methods: {
    // 查看详情
    handleDetail(row) {
      console.log("当前行", row);
      this.$emit("handleDetail", row);
    },
    // 搜索按钮操作
    handleSearh() {
      if (!this.searchVal) {
        this.dataList = this.projectList;
        return;
      }
      this.dataList = this.projectList.filter((item) =>
        item.projectName
          .toLowerCase()
          .includes(this.searchVal.trim().toLowerCase())
      );
    },
    // 重置按钮操作
    resetData() {
      this.searchVal = "";
      this.dataList = this.projectList;
    },
  },
};
</script>

<style lang="scss" scoped>
.left-wrap {
  // width: 240px;
  width: 310px;
  padding: 16px;
  border: 1px solid #e2e1e1;
  min-height: 500px;
  .search-wrap {
    ::v-deep .el-input {
      width: 60%;
    }
  }
  .list-wrap {
    padding: 8px 0px;
    .list-item {
      line-height: 32px;
      padding: 0px 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .list-item:hover {
      border-radius: 8px;
      background-color: #f7f7f7;
    }
  }
}
</style>
