<template>
  <div class="accountList">
    <div class="main">
      <FSearch :form="search" @queryList="searchData()"></FSearch>
      <!-- 操作按钮 -->
      <div class="buttonOperation">
        <el-button class="button interval" type="primary" @click="add">
          <i class="el-icon-circle-plus-outline el-icon--left"></i>新增
        </el-button>
      </div>
      <FTable
        class="tableData"
        :data="table.data"
        :config="table.config"
        :page="table.page"
        @pageChanged="pageChanged"
        @sortChange="sortChange"
        @sizeChanged="sizeChanged"
      ></FTable>
    </div>
    <selectDialog ref="selectDialog" @refresh="refresh"></selectDialog>
  </div>
</template>
<script>
import FForm from "@/components/FForm/form-add";
import FTable from "@/components/FTable/index.vue";
import FSearch from "@/components/FSearch/index.vue";
import config from "@/settings.js";
import selectDialog from "./components/selectDialog";
import { api_getList, api_delete } from "@/api/reviewMembers/reviewMembers";
export default {
  components: {
    FForm,
    FTable,
    FSearch,
    selectDialog,
  },
  data() {
    return {
      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          selection: false, // 是否显示复选框
          multiple: true,
          rowKey: "jfid",
          // expand: true, // 表格扩展
          operationWidth: 350, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "姓名",
              prop: "fullName",
            },
            {
              name: "联系方式",
              prop: "mobile",
              width: 150,
            },
            {
              name: "jfid",
              prop: "jfid",
              width: 150,
            },
          ],
          innerBtn: [
            {
              name: "删除",
              method: "delete",
              className: "font-size-20",
            },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: 2, //总页数
          pageSize: 10, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: true, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
        {
            type: "select",
            name: "成员类型",
            data: "typeList", // 定义在this.form.enums中的typeList
            placeholder: "请选择成员类型",
            bind: "type", // 对应this.search.data对象的field1
            lableWidth: 45,
          },
          // {
          //   type: "text",
          //   name: "姓名",
          //   placeholder: "请输入姓名",
          //   bind: "keyword", // 对应this.search.data对象的field1
          //   lableWidth: 45,
          // },
        ],
        enum: {
          typeList: [
          { dataName: '固定评审组员', dataValue: 1 },
          { dataName: '非固定评审组员', dataValue: 2 }
          ]
        },
        form: {
          // keyword: "",
          type: null
        },
      },
      buids: [],
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        id: "",
      },
    };
  },
  computed: {
    themeName() {
      return this.$store.state.permission.theme || "";
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    searchData() {
      this.table.page.pageNum = 1;
      this.getData();
    },
    sortChange(column) {},
    //获取表格数据
    getData() {
      let data = {
        // size: this.table.page.pageSize,
        // page: this.table.page.pageNum,
        // topic: "FIXED_PSXZ_CY",
        // keyword: this.search.form.keyword,
        type: this.search.form.type == null ? 0 : this.search.form.type
      };
      api_getList(data)
        .then((res) => {
          // console.log(res);
          if (res.msg && res.msg.code == "0000") {
            // this.table.page.pages = res.data.pages;
            // this.table.page.total = res.data.total;
            this.table.data = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 用于格式化表格数据，
     */
    formatter() {},
    //编辑
    edit(row) {
      row.title = "编辑";
      console.log(row);
      this.$refs.selectDialog.init(row);
    },
    //新增
    add() {
      let data = {
        title: "新增",
      };
      this.$refs.selectDialog.init(data);
    },
    //删除
    delete(row) {
      console.log(row);
      
      this.$confirm(
        "此操作将永久删除该记录, 是否继续?",
        "确认要删除该记录吗？",
        {
          showClose: false,
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          customClass: "biaozhunhua_confirm changsha_confirm_warning", //
          type: "warning",
        }
      )
        .then(() => {
          api_delete({
            jfid: row.jfid
          }).then((res) => {
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    refresh() {
      this.getData();
    },
    //前端分页组件
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getData();
    },
    sizeChanged(val) {
      this.table.page.pageSize = val;
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.accountList {
  /deep/.search {
    .el-form {
      .el-form-item {
        margin-right: 10px;
        .el-form-item__label {
          width: auto !important;
        }
      }
    }
  }
  .buttonOperation {
    display: flex;
    .upload-demo {
      margin-left: 10px;
    }
    /deep/ .button {
      width: 116px;
      height: 32px;
      border-radius: 16px;
      padding: 0;
    }
    /deep/ .interval {
      margin-right: 10px;
    }
  }
}
</style>
