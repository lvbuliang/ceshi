<template>
  <div class="jurisdictionDailog common-dialog">
    <el-dialog
      title="权限配置"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
    <!-- @click="search($event)" -->
      <div class="search" >
        <el-input
          v-model="permissionName"
          placeholder="请输入内容"
          suffix-icon="el-icon-search"
        ></el-input>
      </div>
      <el-scrollbar style="height: 100%">
        <div>
          <el-tree
            :data="treeData"
            v-loading="loading"
            ref="tree"
            node-key="permissionId"
            show-checkbox
            :props="treeProps"
            :default-checked-keys="defaultArr"
            :default-expanded-keys="defaultArr"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @check="checkNode"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span
                ><img
                  class="img"
                  :src="
                    data.menuLevel == 1
                      ? roleLive1
                      : data.menuLevel == 2
                      ? roleLive2
                      : roleLive3
                  "
                  alt=""
                />{{ data.permissionName }}</span
              >
            </span>
          </el-tree>
        </div>
      </el-scrollbar>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { api_getRolePermissionyInfoList, api_roleBinding } from "@/api/roleManage/roleManage"
import role_1 from "@/assets/role_1.png"
import role_2 from "@/assets/role_2.png"
import role_3 from "@/assets/role_3.png"
export default {
  data () {
    return {
      flag: true,
      defaultArr: [],
      treeProps: {
        children: 'childPermissionEntityList'
      },
      dialogVisible: false,
      treeData: [],
      permissionName: '',
      roleId: '',
      roleLive1: role_1,
      roleLive2: role_2,
      roleLive3: role_3,
      loading: true
    }
  },
  watch: {
    permissionName (val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted () {
  },
  methods: {
    init (data) {
      this.loading = true
      this.flag = false
      this.$nextTick(() => {
        this.flag = true
      })
      this.roleId = data.roleId
      this.permissionName = ''
      this.defaultArr = []
      this.treeData = []
      this.getData()
      this.dialogVisible = true
    },
    // 过滤树表单内容
    filterNode (value, data) {
      // console.log(data)
      // return
      if (!value) return true;
      return data.permissionName.indexOf(value) !== -1;
    },
    handleClose () {
      this.dialogVisible = false
    },
    getData () {
      let data = {
        roleId: this.roleId,
        permissionName: this.permissionName
      }
      api_getRolePermissionyInfoList(data).then(res => {
        if (res.msg && res.msg.code == '0000') {
          this.treeData = [...res.data]
          this.defaultArr
          this.setDefaultArr(res.data)
          this.loading = false
        }
      })
    },
    //设置默认选中的数组
    setDefaultArr (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].selected) {
          if (arr[i].childPermissionEntityList && arr[i].childPermissionEntityList.length > 0) {
            this.setDefaultArr(arr[i].childPermissionEntityList)
          } else {
            this.defaultArr.push(arr[i].permissionId)
          }
        }
      }
    },
    search (event) {
      // event.target.classList
      // el - icon - search
      if (event.target.classList[1] == 'el-icon-search') {
        this.loading = true
        this.getData()
      }
    },
    checkNode (row, data) {
      console.log(row, data);
    },
    submit () {
      let list = this.$refs.tree.getCheckedKeys()
      let list1 = this.$refs.tree.getHalfCheckedKeys()
      console.log(list, list1);
      let data = {
        roleId: this.roleId,
        permissionIds: [...list, ...list1]
      }
      debugger
      api_roleBinding(data).then((res) => {
        if (res.msg && res.msg.code == '0000') {
          this.$message({
            message: '配置成功',
            type: 'success'
          });
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.jurisdictionDailog {
  .el-tree-node__content {
    height: 38px;
  }
  .el-tree-node__content:hover {
    background: #e6f7ff;
  }
  .rightSearch {
    .container {
      padding: 5px;
    }
  }
}
</style>
<style lang='scss' scoped>
.jurisdictionDailog {
  .search {
    margin-bottom: 14px;
  }
  .img {
    width: 16px;
    height: 16px;
    vertical-align: bottom;
  }
  /deep/.el-tree-node__content {
    .el-checkbox {
      position: absolute;
      right: 0;
    }
  }
  /deep/ .el-dialog__body {
    padding: 24px;
  }
  /deep/ .el-tree {
    padding: 10px 0;
  }
  /deep/.el-tree-node {
    padding: 8px 0;
  }
  /deep/.el-input__icon.el-icon-search {
    cursor: pointer;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>