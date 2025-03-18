<template>
  <div class="container-left">
    <div class="placeholder_custom">阶段维护</div>
    <div class="container_list">
      <div v-for="(data, index) in treeData" :key="index">
        <span
          class="custom-tree-node"
          :class="{ custom_tree: activeIndex === index }"
        >
          <div class="custom-container">
            <div v-if="data.newList == 1">
              <el-input v-model="data.stageName"></el-input>
            </div>
            <div
              v-else
              @click="handleNodeClick(data, index)"
              :class="{ highlighted: activeIndex === index }"
            >
              <div class="stageList">
                {{ data.stageName }}
              </div>
            </div>
          </div>

          <div class="elIcon" v-if="hasConstructionPermission">
            <span
              v-if="
                data.isEdit == 1 &&
                userInfo.fullname == JSON.parse(data.currentFounder)
              "
            >
              <i class="el-icon-edit" @click="editFl(data, index)"></i>
            </span>
            <span
              @click="handleDeleteNode(data)"
              v-if="
                data.isEdit == 1 &&
                userInfo.fullname == JSON.parse(data.currentFounder)
              "
              ><i class="el-icon-delete"></i
            ></span>

            <span @click="handleAddNode(data, index)">
              <i class="el-icon-document-add"></i>
            </span>

            <span @click="emptyDeleteNode(data, index)" v-if="data.emplyFlag"
              ><i class="el-icon-delete"></i
            ></span>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    treeData: Array,
    activeIndex: Number,
    hasConstructionPermission: Boolean,
    userInfo: Object,
  },
  methods: {
    handleNodeClick(data, index) {
      this.$emit("node-click", data, index);
    },
    editFl(data, index) {
      data.newList = 1;
      this.$emit("edit-node", data, index);
    },
    handleAddNode(data, index) {
      this.$emit("add-node", data, index);
    },
    handleDeleteNode(data) {
      this.$emit("delete-node", data);
    },
    emptyDeleteNode(data, index) {
      this.$emit("empty-delete", data, index);
    },
  },
};
</script>

<style scoped lang='scss'>
// .container-left {
//   width: 230px;
//   height: calc(100% - 30px);
//   overflow-y: auto;
// }
.container-left {
  width: 230px;
  height: calc(100% - 30px);
  // border-right: #e6e6e6 solid 11px;
  overflow-y: auto;

  .container_list {
    height: 500px;
    overflow: auto;
  }
}

.custom-tree-node {
  display: flex;
}

.container-left {
  overflow: auto; /* 保持可滚动 */
  scrollbar-width: none; /* 对于 Firefox 隐藏滚动条 */
}
.container-left::-webkit-scrollbar {
  overflow: hidden;
  display: none; /* 对于 Chrome, Safari 和 Opera 隐藏滚动条 */
}

.custom_tree {
  // 236，243，251
  border-left: 2px solid rgb(104, 137, 204);

  // background: linear-gradient(to left, rgb(104, 137, 204), skyblue) repeat;
  // background: rgb(236, 243, 251);
  background: #f1f1f1;

  // background: linear-gradient(to left, rgb(70, 130, 246), rgb(255, 255, 255)) repeat;
}

.placeholder_custom {
  height: 65px;

  margin-left: 10px;
  line-height: 65px;
  font-size: 18px;
  font-weight: 800;
}

.custom-container {
  top: 8px;
  width: 220px;
  height: 36px;
  opacity: 1;
  display: flex;
  // justify-content: flex-start;
  align-items: center;
  padding: 8px 16px 8px 0px;
  div {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 20px;
    color: rgba(51, 51, 51, 1);
    text-align: left;
    vertical-align: top;
    font-weight: 800;
  }
}

.highlighted {
  left: 0px;
  top: 8px;
  width: 102px;
  height: 20px;
  opacity: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 20px;

  // background: #000;
  // border-left: 2px solid rgba(1, 118, 255, 1);
  font-weight: 800;
  // background: linear-gradient(to left, rgb(70, 130, 246), rgb(75, 130, 245));
  color: #fff !important;

  div {
    left: 0px;
    top: 8px;
    width: 102px;
    height: 20px;
    font-weight: 800;
    opacity: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 20px;
    // color: rgba(1, 118, 255, 1) !important;
    color: #3794ff;

    margin-left: 10px;
    // min-width: 120px;
    // max-width: 120px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // display: block;
    // font-size: 12px;
  }
}

.elIcon {
  width: 110px;
  display: flex;
  margin-right: 0px;

  // margin-left: 100px;
  span {
    padding-left: 8px;
    line-height: 40px;
    // font-size: 16px;
  }
}
.custom-tree-node {
  display: flex;
}
.stageList {
  margin-left: 10px;
  min-width: 120px;
  cursor: pointer;
}
.highlighted {
  background: #f1f1f1;
  border-left: 2px solid rgb(104, 137, 204);
}

.actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: 20px;

      i {
        font-size: 18px;
        color: #6c757d;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: #409eff;
        }
      }

      .el-icon-delete:hover {
        color: #f56c6c;
      }
    }
</style>

