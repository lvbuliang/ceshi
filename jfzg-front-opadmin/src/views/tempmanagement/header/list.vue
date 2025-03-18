
<template>
  <div class="headerList" v-if="$route.meta.lv == 2">
    <!-- 搜索  -->
    <div class="search">
      <FSearch :form="search" @queryList="getTempList(1)"></FSearch>
    </div>
    <!-- 操作按钮 -->
    <!-- <div class="buttonOperation">
      <el-button class="exportbtnFour" type="primary" @click="add">
        <i class="el-icon-circle-plus-outline el-icon--left"></i>添加
      </el-button>
    </div>-->
    <!-- 表格 -->
    <div class="table">
      <FTable
        class="tableData"
        :data="table.data"
        :config="table.config"
        :page="table.page"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
      ></FTable>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <div
        :is="childName"
        :moduleCode="moduleCode"
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
      ></div>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import FSearch from "@/components/FSearch/index.vue";
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add";
import { listModule, listCustomFormTemplate } from "@/api/index.js";
import {
  api_updateTableHead,
  api_getTableHaedPage,
  api_getTabelHeadById,
} from "@/api/header/index.js";
export default {
  components: {
    FSearch,
    FTable,
    FForm,
  },
  data() {
    return {
      moduleCode: null,
      dialogVisible: false,
      dialogTitle: "",
      childName: "version",

      search: {
        textMaxNum: 5, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "权限码",
            placeholder: "权限码",
            bind: "permissionCode",
          },
          {
            type: "text",
            name: "模块名称",
            placeholder: "模块名称",
            bind: "remark",
          },
        ],
        form: {
          permissionCode: "",
          remark: "",
        },
        enum: {
          moduleList: [],
        },
      },
      table: {
        data: [],
        config: {
          operationWidth: 150, // 操作列的宽度，不传默认180
          title: "表格的标题", // 表格标题
          index: "", // 是否显示序号
          selection: false,
          multiple: true,
          rowKey: "buid",
          header: [
            // 表格列配置
            { name: "序号", prop: "num", width: 220 },
            { name: "权限码", prop: "permissionCode" },
            { name: "模块名称", prop: "remark" },
          ],
          innerBtn: [
            {
              name: "修改",
              field: "id",
              method: "edit",
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: "", //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
    };
  },
  mounted() {
    this.getTempList();
  },
  methods: {
    // 新增模版
    add() {
      this.dialogVisible = true;
      this.dialogTitle = "提示";
      this.childName = "confirm";
    },

    // 获取版本列表
    edit(row) {
      this.$router.push({
        name: "headerEdit",
        query: {
          id: row.id,
        },
      });
    },

    getPageData(val) {
      this.table.page.pageNum = val;
      this.getTempList();
    },
    getSizeDate(val) {
      this.table.page.pageSize = val;
      this.getTempList();
    },
    // 获取模块列表
    getTempList(page) {
      let params = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
      };
      const searchForms = this.search.form;
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });
      if (page) {
        params.pageNum = page;
      }
      api_getTableHaedPage(params).then((res) => {
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.records);
          //   this.$set(this.table.page, "pageNum", res.data.pageNum);
          //   this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
  },
};
</script>
