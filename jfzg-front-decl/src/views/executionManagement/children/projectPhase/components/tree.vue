<template>
  <el-tree
    ref="tree"
    :class="[
      'menu-el-tree',
      iconStyle.src && 'menu-expand-icon',
      highlighColor && 'menu-node-highligh',
    ]"
    :style="{
      '--bgUrl': 'url(' + iconStyle.src + ')',
      '--iconWidth': iconStyle.width,
      '--iconHeight': iconStyle.height,
      '--iconTransform': iconStyle.transform,
      '--hoverColor': hoverStyle.color,
      '--hoverBgColor': hoverStyle.bgColor,
      '--highlighColor': highlighColor.color,
      '--highlighBgColor': highlighColor.bgColor,
    }"
    node-key="id"
    :draggable="draggable"
    :allow-drag="allowDrag"
    :expand-on-click-node="expandOnClickNode"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot="{ node, data }">
      <div
        v-if="!data.isEdit"
        class="custom-tree-node-root"
        @mouseenter="nodeMouseEnter(node)"
        @mouseleave="nodeMouseLeve(node)"
      >
        <span class="custom-tree-node">{{ node.label }}</span>
        <section v-show="node.showBtn" class="tree-btn-group">
          <el-tooltip
            v-for="item in btnGroup"
            :key="item"
            effect="light"
            placement="top"
            popper-class="common-tooltip-primary"
            :content="
              {
                addChild: '新增子级',
                delete: '删除',
                edit: '修改',
                addSibling: '新增同级',
              }[item]
            "
          >
            <i
              :class="
                {
                  addChild: 'el-icon-circle-plus-outline',
                  delete: 'el-icon-circle-close',
                  edit: 'el-icon-edit',
                  addSibling: 'el-icon-plus',
                }[item]
              "
              @click.stop="() => handleOperaion(item, node, data)"
            />
          </el-tooltip>
        </section>
      </div>
      <div v-else class="custom-tree-node-root-edit">
        <el-input
          v-model="inputValue"
          :size="editInputStyle.size"
          :style="{ width: editInputStyle.width }"
        />
        <section :id="data.id">
          <el-tooltip
            content="确定"
            popper-class="common-tooltip-primary"
            effect="light"
            placement="top"
          >
            <i
              class="el-icon-success"
              @click.stop="() => editMenuSubmit(node, data)"
            />
          </el-tooltip>
          <el-tooltip
            content="取消"
            popper-class="common-tooltip-primary"
            effect="light"
            placement="top"
          >
            <i
              class="el-icon-error"
              @click.stop="() => addSiblingCancel(node, data)"
            />
          </el-tooltip>
        </section>
      </div>
    </template>
  </el-tree>
</template>
<script>
export default {
  name: "MenuTree",
  inheritAttrs: true,
  props: {
    hoverStyle: {
      type: Object,
      default: () => ({
        color: "#606266",
        bgColor: "#F5F7FA",
      }),
    },
    /**
     * @description 当前行选中高亮颜色配置
     */
    highlighColor: {
      type: Object,
      default: () => ({
        color: "#606266",
        bgColor: "#fff9ec",
      }),
    },
    /**
     * @description 动态左侧图标配置(图片格式)
     */
    iconStyle: {
      type: Object,
      default: () => ({
        src: "",
        width: "20px",
        height: "17px",
        transform: "rotate(270deg)",
      }),
    },
    /**
     * @description 操作按钮组
     * addChild => 新增子级，delete => 删除, edit => 修改, addSibling => 新增同级
     */
    btnGroup: {
      type: Array,
      default: () => ["edit", "addSibling", "addChild", "delete"],
    },
    /**
     * @description 是否展示操作按钮
     */
    showBtnGroup: {
      type: Boolean,
      default: false,
    },
    /**
     * @description 编辑模式输入框样式
     */
    editInputStyle: {
      type: Object,
      default: () => ({
        size: "mini",
        width: "200px",
      }),
    },
    /**
     * 是否可拖拽
     */
    draggable: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否在点击节点的时候展开或者收缩节点
     * 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
     */
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      inputValue: "",
    };
  },
  methods: {
    /**
     * @description 鼠标移入目录层级
     */
    nodeMouseEnter(data) {
      if (!this.showBtnGroup) return;
      this.$set(data, "showBtn", true);
    },
    /**
     * @description 鼠标移除目录层级
     */
    nodeMouseLeve(data) {
      if (!this.showBtnGroup) return;
      this.$set(data, "showBtn", false);
    },
    /**
     * 当前目录操作分发
     * @param {string} eventKey 事件名称
     * @param {object} currentNode 当前Node节点内容
     * @param {object} data 当前节点数据
     */
    handleOperaion(eventKey, currentNode, data) {
      console.log(currentNode, data, "menuRoot");
      switch (eventKey) {
        case "addSibling":
          this.addSibling(currentNode, data);
          break;
        case "edit":
          this.editTreeItem(data);
          break;
        case "addChild":
          this.addChild(currentNode, data);
          break;
        case "delete":
          this.deleteTreeItem(currentNode, data);
          break;
      }
    },
    /**
     * @description 编辑当前节点
     */
    editTreeItem(data) {
      this.$set(data, "isEdit", true);
      this.inputValue = data.label; // 当前正在编辑内容赋值
      this.$nextTick(() => {
        document
          .getElementById(data.id)
          .previousElementSibling.firstElementChild.focus();
      });
    },
    /**
     * @description 添加同级节点
     */
    addSibling(currentNode, data) {
      const treeDOM = this.$refs.tree;
      const id = Math.ceil(Math.random() * 100);
      const newData = {
        id: id,
        pId: data.pId,
        label: "",
        isEdit: true,
        isNew: true,
        children: [],
      };
      treeDOM.insertAfter(newData, currentNode);
      // 聚焦当前新增目录
      this.$nextTick(() => {
        document
          .getElementById(newData.id)
          .previousElementSibling.firstElementChild.focus();
      });
    },
    /**
     * @description 添加子级节点
     */
    addChild(currentNode, data) {
      const treeDOM = this.$refs.tree;
      const id = Math.ceil(Math.random() * 100);
      const newData = {
        id: id,
        pId: data.id,
        label: "",
        isEdit: true,
        isNew: true,
        children: [],
      };
      treeDOM.append(newData, currentNode);
      // 展开子节点后才能获取DOM聚焦
      treeDOM.store.nodesMap[data.id].expanded = true;
      setTimeout(() => {
        document
          .getElementById(newData.id)
          .previousElementSibling.firstElementChild.focus();
      }, 500);
    },
    /**
     * @description 编辑模式修改确认
     */
    editMenuSubmit(node, data) {
      this.$emit("editNodeSubmit", {
        node,
        data,
        currentLabel: this.inputValue,
        // 新增同级/子级节点接口调用成功的话，即新增同级/子级节点
        callback: (status) => {
          if (status) {
            this.resetNode();
          }
        },
      });
    },
    /**
     * @description 删除当前节点
     */
    deleteTreeItem(node, data) {
      this.$emit("deleteNodeSubmit", {
        node,
        data,
        callback: (status) => {
          // 删除接口调用成功的话，即删除节点
          if (status) {
            const treeDOM = this.$refs.tree;
            treeDOM.remove(node);
          }
        },
      });
    },
    /**
     * @description 取消同级节点添加
     */
    addSiblingCancel(node, data) {
      // 如果是新增的节点，取消即是删除
      if (data.isNew) {
        const treeDOM = this.$refs.tree;
        treeDOM.remove(node);
      } else {
        // 重置修改内容
        this.inputValue = "";
        data.isEdit = false;
      }
    },
    /**
     * 寻找第一个叶子节点及叶子节点的父节点
     * @param {*} tree 平铺数组
     */
    findFirstChildAndParent(tree) {
      let firstChild = null;
      let parentOfFirstChild = null;
      const dfs = (node, parent) => {
        if (firstChild !== null) {
          return; // 如果已经找到了第一个子节点，则不再继续搜索
        }
        if (node.children && node.children.length > 0) {
          // eslint-disable-next-line
          for (const child of node.children) {
            dfs(child, node);
          }
        } else {
          firstChild = node;
          parentOfFirstChild = parent;
        }
      };
      // eslint-disable-next-line
      for (const node of tree) {
        dfs(node, null);
      }
      return {
        firstChild,
        parentOfFirstChild,
      };
    },
    /**
     * 获取自身树结构实例
     */
    getTree() {
      return this.$refs.tree;
    },
    /**
     * 重置节点数据
     */
    resetNode() {
      this.inputValue = "";
    },
    /**
     * 寻找节点对应的父级节点
     * @param {*} tree
     * @param {*} nodeId
     */
    findParentByChildId(tree, nodeId) {
      let parentOfFirstChild = null;
      const dfs = (node, parent) => {
        if (parentOfFirstChild !== null) {
          return;
        }
        if (node.children && node.children.length > 0) {
          // eslint-disable-next-line
          for (const child of node.children) {
            dfs(child, node);
          }
        } else {
          // 找到对应节点后，返回其父节点
          if (node.id === nodeId) {
            parentOfFirstChild = parent;
          }
        }
      };
      // eslint-disable-next-line
      for (const node of tree) {
        dfs(node, null);
      }
      return parentOfFirstChild;
    },
    /**
     * 允许拖动的节点
     * @param {*} draggingNode 拖动节点
     */
    allowDrag(draggingNode) {
      // 不处于编辑状态
      return !draggingNode.data.isEdit;
    },
  },
};
</script>
<style scoped lang="scss">
// 动态配置右侧图标
.menu-expand-icon {
  ::v-deep .el-tree-node__expand-icon:not(.is-leaf) {
    &::before {
      background: var(--bgUrl);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      content: "";
      width: var(--iconWidth);
      height: var(--iconHeight);
      display: inline-block;
      transform: var(--iconTransform);
    }
  }
}
// 动态配置hover样式
.menu-el-tree {
  ::v-deep .el-tree-node__content {
    &:hover {
      background: var(--hoverBgColor);
      color: var(--hoverColor);
    }
  }
  .custom-tree-node-root {
    display: flex;
    align-items: center;
    flex: 1;
    .tree-btn-group {
      margin-left: 15px;
      display: flex;
      align-items: center;
      column-gap: 8px;
      i {
        font-size: 15px;
        &:hover {
          // color: $primary
        }
      }
    }
  }
}
.menu-node-highligh.el-tree--highlight-current {
  ::v-deep .el-tree-node.is-current > .el-tree-node__content {
    background: var(--highlighBgColor);
    color: var(--highlighColor);
  }
}
.custom-tree-node-root-edit {
  display: flex;
  align-items: center;
  .el-input,
  ::v-deep .el-input .el-input__inner {
    height: 26px;
  }
  section {
    i {
      margin-left: 10px;
      font-size: 15px;
      // color: $primary;
    }
  }
}
</style>
