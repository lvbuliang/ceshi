<template>
  <el-dialog
    class="menuSortDialog common-dialog"
    title="权限配置"
    :visible.sync="dialogVisible"
    width="450px"
    :before-close="close"
  >
    <el-radio-group v-model="isHide">
      <draggable v-model="menuList" animation="500">
        <div class="dra_item" v-for="item in menuList" :key="item.permissionId">
          {{ item.permissionName }}
          <div style="display: inline-block;">
            <el-radio :label="item.permissionId">此菜单及以下设为隐藏</el-radio>
          </div>
        </div>
      </draggable>
    </el-radio-group>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="reset">重 置</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from "vuedraggable";
import {
  getListByRoleId,
  updateRoleTopMenuSort
} from "@/api/roleManage/menuSortDialog";
export default {
  components: {
    draggable
  },
  data() {
    return {
      dialogVisible: false,
      firstId: null,
      isHide: null,
      menuList: []
    };
  },
  mounted() {},
  methods: {
    init(data) {
      this.dialogVisible = true;
      getListByRoleId({ roleId: data.roleId }).then(res => {
        if (res.msg.code == "0000") {
          let firstId = null;
          if (res.data && res.data.length) {
            res.data.forEach(item => {
              if (firstId == null) {
                if (item.hidden == 0) {
                  firstId = item.permissionId;
                  this.firstId = item.permissionId;
                  this.isHide = item.permissionId;
                }
              }
            });
            this.menuList = res.data;
          } else {
            this.menuList = [];
          }
        }
      });
    },
    submit() {
      let arrList = this.menuList;
      let firstIndex = null;
      arrList.forEach((item, index) => {
        if (firstIndex == null) {
          if (item.permissionId == this.isHide) {
            firstIndex = index;
            item.hidden = 0;
          } else {
            item.hidden = 1;
          }
        } else {
          item.hidden = 0;
        }
      });
      updateRoleTopMenuSort(arrList)
        .then(res => {
          if (res.msg.code == "0000") {
            this.$message({
              message: "保存成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "保存失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "保存失败",
            type: "error"
          });
        });
      this.close();
    },
    reset() {
      this.isHide = null;
    },
    close() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.menuSortDialog {
  /deep/ .dialog-footer {
    text-align: center;
  }
  /deep/ .el-dialog__body {
    padding: 16px 24px 24px;
    .el-radio-group {
      width: 100%;
    }
  }
  .dra_item {
    cursor: move;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
  }
  // .dra_item:hover {
  //   background-color: #ccc;
  // }
}
</style>
