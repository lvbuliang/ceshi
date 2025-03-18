<template>
  <div class="roleList">
    <FSearch :form="search" @queryList="getData(1)"></FSearch>
    <!-- 操作按钮 -->
    <div class="buttonOperation">
      <el-button class="button" type="primary" @click="add"
        ><i class="el-icon-circle-plus-outline el-icon--left"></i
        >新增角色</el-button
      >
      <el-button class="button" type="primary" @click="exportFlie"
        >导出</el-button
      >
      <!-- <uploadBtn  class="uploadBtn" @getFileInfo="getFileInfo">
        <el-button type="primary" class="button">
          <i class="iconfont icontijiaobiangengcailiao"></i>
          导入菜单
        </el-button>
      </uploadBtn>
      <uploadBtn  class="uploadBtn" @getFileInfo="getFileInfo">
        <el-button type="primary" class="button">
          <i class="iconfont icontijiaobiangengcailiao"></i>
          导入用户
        </el-button>
      </uploadBtn>
      <el-button class="button" type="primary" @click="init"
        >初始化</el-button
      >
      <el-button class="button" type="primary" 
        >下载模板</el-button
      >
      <el-button class="button" type="primary"
        >下载用户模板</el-button
      > -->
    </div>
    <div class="form">
      <FTable
        class="tableData"
        :data="table.data"
        :config="table.config"
        :page="table.page"
        :formatter="formatter"
        @pageChanged="pageChanged"
        @sizeChanged="sizeChanged"
      >
      </FTable>
    </div>
    <roleListDialog
      ref="roleListDialog"
      @success="successMethods"
    ></roleListDialog>
    <jurisdictionDialog ref="jurisdictionDialog"></jurisdictionDialog>
    <menuSortDialog ref="menuSortDialog"></menuSortDialog>
  </div>
</template>

<script>
import { getStorageToken } from "@/utils/user-vali";
import config from "@/settings.js";
import FTable from "@/components/FTable/index.vue";
import FSearch from "@/components/FSearch/index.vue";
import roleListDialog from "./components/roleListDialog";
import jurisdictionDialog from "./components/jurisdictionDialog";
import menuSortDialog from "./components/menuSortDialog";

import {
  api_findByCondintion,
  api_initRolePermiss,
  api_importUserTemplate,
  api_userDownLoad,
} from "@/api/roleManage/roleManage";
import {
  api_buPropertyList,
  addandedit_api_biaozhunhua,
} from "@/api/roleManage/roleManage_biaozhunhua";

import uploadBtn from "../components/uploadBtn";
export default {
  components: {
    FTable,
    roleListDialog,
    FSearch,
    jurisdictionDialog,
    uploadBtn,
    menuSortDialog,
  },
  data() {
    return {
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "角色名称",
            placeholder: "请输入角色名称",
            bind: "roleName", // 对应this.search.data对象的field1
            lableWidth: 70,
          },
          {
            type: "select",
            name: "单位类型",
            placeholder: "请选择单位类型",
            bind: "buProperty",
            data: "stateList", // 对应enum中的stateList
          },
        ],
        enum: {
          // 搜索项下拉数据
          stateList: [],
        },
        form: {
          buProperty: "",
          buName: "",
          hasBuPower: 1,
        },
      },
      table: {
        data: [{ roleName: "1" }], // 表格数据
        config: {
          // expand: true, // 表格扩展
          operationWidth: 280, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "角色名称",
              prop: "roleName",
            },
            /* {
              name: "角色类型",
              prop: "hasBuPower",
              haveHTML: true,
            }, */
            {
              name: "单位类型",
              prop: "propertyName",
              haveHTML: true,
            },
            {
              name: "角色描述",
              prop: "remark",
            },
            // {
            //   name: "数据权限",
            //   prop: "dataType",
            //   haveHTML: true,
            // },
            {
              name: "状态",
              prop: "status",
              haveHTML: true,
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "edit", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
            },
            {
              name: "权限配置",
              method: "blockUp",
              className: "font-size-20",
            },
            {
              name: "停用",
              method: "tingyong",
              className: "font-size-20",
              field: "status",
              value: [0],
            },
            {
              name: "启用",
              method: "tingyong",
              className: "font-size-20",
              field: "status",
              value: [1],
            },
            {
              name: "菜单配置",
              method: "menuUp",
              className: "font-size-20",
            },
          ],
        },
        page: {
          // 分页配置
          total: "", //总条数
          pages: "", //总页数
          pageSize: 10, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      // source:''
    };
  },
  mounted() {
    this.getData();

    this.getBuPropertyList();
  },
  methods: {
    getFileInfo(e) {},
    //单位类型下拉菜单
    getBuPropertyList() {
      api_buPropertyList().then((res) => {
        if (res.msg && res.msg.code == "0000") {
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.dataValue = item.id;
              obj.dataName = item.propertyName;
              arr.push(obj);
            }
          });
          this.$set(this.search.enum, "stateList", arr);
        }
      });
    },
    treeClick(data) {
      // console.log(data)
    },
    // 过滤树表单内容
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    add() {
      let data = {
        title: "新增角色",
      };
      this.$refs.roleListDialog.init(data);
    },
    // 标签导出
    exportFlie() {
      // let access_token = "8fc9dac6-21fb-441b-883d-8de161a64f46";
      let access_token = getStorageToken();
      let exportUrl =
        config.baseUrl +
        `/jfzg/opcenter/buRole/export?access_token=${access_token}`;
      window.location.href = exportUrl;
    },
    // 导入文件
    importExl() {
      api_importUserTemplate().then((res) => {
        if (res.msg && res.msg.code == "0000") {
        }
      });
    },
    // 初始化
    init() {
      api_initRolePermiss().then((res) => {
        if (res.msg && res.msg.code == "0000") {
        }
      });
    },
    formatter(key, val, row) {
      if (key === "status") {
        if (row["status"] == 1) {
          return "<div class='enabled round-state'>正常</div>";
        } else if (row["status"] == 0) {
          return "<div class='wait round-state'>停用</div>";
        }
      }
      //else if (key === "hasBuPower") {
      //   if (row["hasBuPower"] == 1) {
      //     return "<span>企业角色</span>";
      //   } else if (row["hasBuPower"] == 2) {
      //     return "<span >部门角色</span>";
      //   } else if (row["hasBuPower"] == 3) {
      //     return "<span >个人角色</span>";
      //   }
      // }
      else if (key === "dataType") {
        if (row["dataType"]) {
          let data1 = row["dataType"].replace("1", "个人权限");
          let data2 = data1.replace("2", "单位权限");
          let data3 = data2.replace("3", "平台权限");
          return "<span>" + data3 + "</span>";
        }
      }
    },
    pageChanged(value) {
      this.table.page.pageNum = value;
      this.getData();
    },
    sizeChanged(value) {
      this.table.page.pageSize = value;
      this.getData();
    },
    edit(data) {
      data.title = "编辑角色";
      this.$refs.roleListDialog.init(data);
    },
    blockUp(data) {
      this.$refs.jurisdictionDialog.init(data);
    },
    // 菜单配置
    menuUp(data) {
      this.$refs.menuSortDialog.init(data);
    },
    tingyong(row) {
      let data = {
        roleId: row.roleId,
        roleName: row.roleName,
        roleCode: row.roleCode,
        status: row.status == 1 ? 0 : 1,
        remark: row.remark,
        buProperty: row.buProperty,
        hasBuPower: row.hasBuPower || 1,
      };
      addandedit_api_biaozhunhua(data).then((res) => {
        if (res.msg && res.msg.code == "0000") {
          this.$message({
            message: row.status == 1 ? "停用成功" : "启用成功",
            type: "success",
          });
          this.getData();
        }
      });
    },

    successMethods(data) {
      if (data) {
        this.getData();
      }
    },
    getData(page) {
      let data = {
        pageSize: this.table.page.pageSize,
        pageNum: this.table.page.pageNum,
        roleName: this.search.form.roleName,
        buProperty: this.search.form.buProperty,
      };
      if (page) {
        data.pageNum = page;
      }
      api_findByCondintion(data).then((res) => {
        if (res.msg && res.msg.code == "0000") {
          this.table.page.total = res.data.total;
          this.table.page.pages = res.data.pages;
          this.table.data = res.data.list;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.roleList {
  .first {
    width: 302px;
    padding-left: 80px;
    .lable {
      width: 80px;
    }
  }
  .buttonOperation {
    /deep/ .button {
      width: 116px;
      height: 32px;
      border-radius: 16px;
      padding: 0;
    }
    .uploadBtn {
      width: 116px;
      text-align: center;
      cursor: pointer;
      line-height: 32px;
      border-radius: 16px;
      padding: 0;
      display: inline-block;
      margin: 0 10px;
      color: #ffffff;
      background-color: #007aff;
      border-color: #007aff;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss">
.tree-box {
  width: 268px;
  height: 310px;
  border: solid 1px #e9e9e9;
  border-radius: 16px;
  margin-right: 20px;
  float: left;
  .tree-title {
    display: block;
    color: #666666;
    font-size: 14px;
    background-color: #f1f2f4;
    border-radius: 4px 4px 0 0;
    text-indent: 18px;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .el-input {
    display: inherit;
    margin: 10px auto;
    width: 90%;
  }
  .el-tree {
    margin: 10px auto;
    height: 200px;
    width: 90%;
    /*background: #000;*/
    overflow: auto;
  }
}
</style>
