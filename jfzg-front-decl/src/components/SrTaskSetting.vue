<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose1"
      :close-on-click-modal="false"
      :showClose="false"
      class="bzhTableHeader"
    >
      <div class="content_box">
        <div class="content_title">选择重点任务</div>
        <div class="content_left">
          <div class="content_left_lists">
            <div class="content_left_title">所有任务：</div>
            <div class="content_left_body">
              <!-- <el-menu
                class="el-menu-vertical-demo"
                :default-active="1 - 1 - 1 - 1"
                @open="handleOpen"
                @close="handleClose"
                @select="handleSelect"
              > -->
              <!-- @zdselectItem="zdselectItem"  :accordionData="collapseData"-->
              <sfq @zdselectData="zdselectData" :leftData="leftData"></sfq>
              <!--</el-menu>  -->
            </div>
          </div>
        </div>
        <div class="content_right">
          <div class="content_right_title">
            <div>可选任务：</div>
            <div class="searchPage1">
              <el-select
                v-model="value"
                :filterable="true"
                placeholder="请选择任务来源"
                size="mini"
                multiple
              >
                <el-option
                  v-for="item in rightOption"
                  :key="item.sourceId"
                  :label="item.sourceName"
                  :value="item.sourceId"
                >
                </el-option>
              </el-select>
              <el-input
                size="mini"
                placeholder="请输入任务名称"
                v-model="keyword"
                clearable
              >
              </el-input>
              <el-button type="primary" circle size="mini" @click="zdSearch">
                <i class="el-icon-search"></i>
              </el-button>
              <el-button
                circle
                size="mini"
                icon="el-icon-refresh"
                @click="zdClean"
              >
                <!-- <i class="el-icon-refresh"></i> -->
              </el-button>
            </div>
          </div>
          <div class="content_right_body">
            <timeLine
              :optionalData="optionalData"
              @getSelectIds="getSelectIds"
            ></timeLine>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSearchQuery">确 认</el-button>
        <el-button @click="handleClose1">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import sfq from "./sfq.vue";
import timeLine from "./timeLine.vue";
export default {
  name: "SrSettingTable",
  components: {
    sfq,
    timeLine,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 左边数据
    leftData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 右边接收数据
    optionalData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 右边下拉框数据
    rightOption: {
      type: Array,
      default() {
        return [];
      },
    },
    /* activities: {
      type
    } */
  },
  updated() {},
  data() {
    return {
      search: "",
      selectdata: [],
      value: [],
      keyword: "",
      activeNames: [],
    };
  },
  mounted() {},
  methods: {
    handleClose1() {
      this.$emit("close");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key) {
      this.activeIndex = key;
      console.log(key, this.activeIndex);
    },
    zdSearch() {
      console.log(this.value, this.keyword);
      this.$emit("zdSearch", this.value, this.keyword);
    },
    zdClean() {
      this.value = [];
      this.keyword = "";
      this.$emit("zdClean", this.value, this.keyword);
    },
    zdselectData(data) {
      this.$emit("zdselectData", data);
    },
    // 获取选择的可选数据id
    getSelectIds(ids) {
      this.$emit("getSelectIds", ids);
    },
    // 确定
    saveSearchQuery() {
      this.$emit("saveSearchQuery");
    },
  },
};
</script>
<style lang="scss" scoped>
.bzhTableHeader .el-dialog__body .content_box {
  .content_left {
    width: 30%;
    height: 450px;
    .content_left_title {
      margin-bottom: 10px;
    }
    .content_left_lists {
      height: 100%;
      overflow: hidden;
    }
    .content_left_body {
      height: 91%;
      overflow-y: auto;
    }
  }
  .content_right {
    width: 70%;
    position: relative;
    ::v-deep .content_right_title {
      display: flex;
      height: 26px;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 0px;
      .searchPage1 {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        .el-select {
          margin-right: 10px;
        }
        .el-button {
          position: relative;
          // color: #40A9FF;
          width: 28px;
          height: 28px;
        }
        .el-input {
          width: 200px;
        }
        .el-input--mini .el-input__inner {
          width: 200px;
        }

        .el-button:nth-child(3) {
          margin-left: 10px;
          width: 28px;
          i {
            width: 12px;
            height: 13px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
          }
        }
      }
      // ::v-deep .el-select__tags-text{
      //   float: left;
      // }
      span {
        margin-right: 0px;
        float: left;
      }
    }
    .content_right_body {
      height: 90%;
      overflow-y: auto;
    }
    // 滚动条
    .content_right_body::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 0px;
    }
    .content_right_body::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #f5f5f5;
    }
    .content_right_body::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #ffffff;
    }
  }
}
.el-menu {
  border: none;
}
// tree
::v-deep .el-tree {
  width: 100%;
  height: 92%;
}
::v-deep .el-tree-node {
  white-space: nowrap;
  outline: 0;
  // background-color: #f7f7f7;
  margin: 10px 0;
  border-radius: 5px;
  padding-left: 10px;
}
::v-deep .is-expanded {
  background-color: #f7f7f7; //背景色
  border-radius: 5px;
  padding-left: 10px;
}
::v-deep .el-tree-node:focus {
  background-color: #f7f7f7; //背景色
  border-radius: 5px;
  margin-left: 0px;
}
::v-deep .el-tree-node:hover {
  background-color: #f7f7f7; //背景色
  border-radius: 5px;
  margin-left: 0px;
}
// 滚动条
.content_left_body::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.content_left_body::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #f5f5f5;
}
.content_left_body::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}
// 下拉框文本溢出
::v-deep .el-select__tags-text {
  display: inline-block;
  max-width: 35px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-tag__close.el-icon-close {
  top: -7px;
}
::v-deep .el-input__inner {
  &::placeholder {
    //  color:red;
    font-size: 12px;
    font-weight: normal;
  }
}
</style>
