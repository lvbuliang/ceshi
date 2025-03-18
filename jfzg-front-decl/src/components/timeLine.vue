<template>
  <div class="timeline">
    <el-tree
      class="filter-tree"
      :data="optionalData"
      :props="props"
      node-key="id"
      show-checkbox
      highlight-current
      :default-checked-keys="defaultCheckedKeys"
      @node-click="handleNodeClick"
      @check-change="check"
      @check="checkData"
      ref="tree"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "JfzgCommonSiteTimeLine",
  props: {
    optionalData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      reverse: false,
      activities: [],
      props: {
        label: "taskName",
        children: "children",
      },
      count: 1,
      defaultCheckedKeys: [], // 默认选中的节点的 key 值
    };
  },
  watch: {
    optionalData: {
      handler(v) {
        console.log(v);
        // 每次设置默认选中节点前需置空,防止数据多次进去
        this.defaultCheckedKeys = [];
        this.setDefaultCheckedKeys(this.optionalData);
        console.log(this.defaultCheckedKeys);
      },
    },
  },
  created() {
    this.setDefaultCheckedKeys(this.optionalData);
  },
  mounted() {},

  methods: {
    // 处理默认全选
    setDefaultCheckedKeys(nodes) {
      for (const node of nodes) {
        this.defaultCheckedKeys.push(node.id);
        if (node.children) {
          this.setDefaultCheckedKeys(node.children);
        }
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    check(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    checkData(checkedNodes, checkedKeys) {
      console.log(checkedNodes, checkedKeys);
      console.log("选中的数据", checkedKeys.checkedNodes);
      let ids = [];
      if (checkedKeys.checkedNodes) {
        checkedKeys.checkedNodes.map((item) => {
          console.log(item);
          if (item.children.length == 0) {
            ids.push(item.id);
          }
        });
        console.log(ids);
        this.$emit("getSelectIds", ids);
      }
      // const bottomLevelIds = this.getBottomLevelIds(checkedKeys);
      // console.log(bottomLevelIds)
      // 将最底层子级的id传递出去
      // this.$emit("selected-ids", bottomLevelIds);
    },
    getBottomLevelIds(nodes) {
      const ids = [];
      if (Array.isArray(nodes)) {
        // 检查 nodes 是否是一个数组
        for (const node of nodes) {
          if (!node.children || node.children.length === 0) {
            ids.push(node.id);
          } else {
            const childIds = this.getBottomLevelIds(node.children);
            ids.push(...childIds);
          }
        }
        console.log(ids);
      }
      return ids;
    },
  },
};
</script>

<style lang="scss" scoped>
.timeline {
  // 让暂无数据居中
  height: 370px;
  /* overflow-y: auto; */
  margin-left: 10px;
  margin-right: 10px;
  ::v-deep
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    // 设置颜色
    background-color: transparent !important;
    color: #1890ff;
  }
}
.filter-tree {
  ::v-deep .el-tree-node__expand-icon {
    position: absolute;
    right: 2%;
  }
  ::v-deep .el-icon-caret-right:before {
    content: "\e6df";
  }
  ::v-deep .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
}
</style>
