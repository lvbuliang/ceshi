<template>
  <div class="sfq">
    <el-tree
      class="filter-tree"
      :data="leftData"
      :props="props"
      showTooltip
      node-key="id"
      highlight-current
      @node-click="handleNodeClick"
      @check-change="check"
      ref="tree"
    >
      <template v-slot="{ node }">
        <el-tooltip
          :content="node.label"
          placement="top"
          :disabled="!isShowTooltip"
        >
          <span
            class="tree-node-label"
            @mouseenter="visibilityChange($event)"
            >{{ node.label }}</span
          >
        </el-tooltip>
      </template>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "DynamicAccordion",
  props: {
    leftData: {
      type: Array,
      default() {
        return [
          {
            id: 1,
            label: "一级 1啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
            children: [
              {
                id: 4,
                label: "二级 1-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1",
                    children: [
                      {
                        id: 22,
                        label: "si级 1-1-1-1",
                      },
                      {
                        id: 23,
                        label: "si级 1-1-1-2",
                      },
                    ],
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            label: "一级 2",
            children: [
              {
                id: 5,
                label: "二级 2-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1",
                    children: [
                      {
                        id: 22,
                        label: "si级 1-1-1-1",
                      },
                      {
                        id: 23,
                        label: "si级 1-1-1-2",
                      },
                    ],
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2",
                  },
                ],
              },
              {
                id: 6,
                label: "二级 2-2",
              },
            ],
          },
          {
            id: 3,
            label: "一级 3",
            children: [
              {
                id: 7,
                label: "二级 3-1",
              },
              {
                id: 8,
                label: "二级 3-2",
              },
            ],
          },
        ];
      },
    },
  },
  data() {
    return {
      isShowTooltip: false,
      props: {
        label: "taskName",
        children: "children",
      },
    };
  },
  watch: {},
  mounted() {
    console.log(this.leftData);
  },

  methods: {
    // 是否显示提示
    visibilityChange(event) {
      // console.log(event);
      const ev = event.target;
      const ev_weight = ev.scrollWidth; // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
      const content_weight = ev.clientWidth; // 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
      // const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
      if (ev_weight > content_weight) {
        // 实际宽度 > 可视宽度  文字溢出
        this.isShowTooltip = true;
      } else {
        // 否则为不溢出
        this.isShowTooltip = false;
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {
      console.log(data);
      this.$emit("zdselectData", data);
    },
    check(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
  },
};
</script>

<style lang="scss" scoped>
.sfq {
  margin: 0 10px;
  width: 90%;
  height: 95%;
  // overflow-y: auto;
  .tree-node-label {
    margin-right: 13px;
    white-space: nowrap; /* 禁止文字换行 */
    overflow: hidden; /* 隐藏溢出部分 */
    text-overflow: ellipsis; /* 使用省略号表示溢出部分 */
  }
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
<style>
/* 解决征求意见窗口抖动问题 */
html {
  overflow: hidden;
}
</style>
