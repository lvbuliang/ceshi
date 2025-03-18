<template>
  <div>
    <!-- <el-input
      v-model="project.projectName"
      readonly
      placeholder="请选择项目"
      suffix-icon="el-icon-caret-bottom"
      @focus="handleFocus"
    ></el-input>-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      append-to-body
      :width="dialogWidth"
      center
      custom-class="reportdialog"
      v-if="dialogVisible"
    >
      <!-- <div class="dialog_select_header">
        <div class="search">
          <el-input v-model="keyword" placeholder="请输入项目名称/编号"></el-input>
          <el-button size="small" type="primary" icon="el-icon-search" circle @click="search2"></el-button>
          <el-button size="small" icon="el-icon-refresh" circle @click="refresh"></el-button>
        </div>
      </div>-->
      <SrTable
        class="table"
        :data="table.data"
        :config="table.tableConfig"
        :page="table.page"
        @pageChanged="pageChanged"
        @clickRow="clickRow"
        @rowDblclick="rowDblclick"
      >
        <template slot="cellSlot" slot-scope="{ scope }">
          <slot name="cellSlot" :scope="scope"></slot>
        </template>
      </SrTable>
      <!-- <slot name="footer" slot="footer">
        <el-button size="small" round type="primary" @click="confirm">确定</el-button>
        <el-button size="small" round @click="dialogVisible = false">取消</el-button>
      </slot>-->
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "dialogTable",
  props: {
    dialogTitle: {
      type: String,
      default: "选择项目",
    },
    dialogWidth: String,
    getList: {
      type: Function,
      default: () => {
        return function () {};
      },
    },
    header: Array,
    innerBtn: Array,
    params: Object,
  },
  data() {
    return {
      status: "",
      dialogVisible: false,
      project: {
        projectName: null,
        projectCode: null,
        projectId: null,
      },
      keyword: null,
      table: {
        data: [],
        tableConfig: {
          load: this.load,
          highlightCurrentRow: true,
          header: [],
          indexConfig: {
            display: true,
            label: "序列",
            width: "52",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
          },
          innerBtn: [],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageNum: 1, //当前页
          layout: "prev, pager, next, jumper",
        },
      },
      selectObj: {},
    };
  },
  created() {
    if (this.header && this.header.length) {
      this.$set(this.table.tableConfig, "header", this.header);
    }

    if (this.innerBtn && this.innerBtn.length) {
      this.$set(this.table.tableConfig, "innerBtn", this.innerBtn);
    }
  },
  methods: {
    load(tree, treeNode, resolve) {
      let params = {
        pageNum: 1,
        pageSize: 999,
        isSubproject: 1,
        mainProjectId: tree.mainProjectId,
      };
      this.getList(params).then((res) => {
        if (res.msg.code === "0000") {
          resolve(res.data.records);
        }
      });
      // setTimeout(() => {
      //     resolve([
      //         {
      //             id: 31,
      //             projectName: "测试子项目",
      //             projectCode: "123",
      //         },
      //         {
      //             id: 32,
      //             projectName: "测试子项目",
      //             projectCode: "123",
      //         },
      //     ]);
      // }, 1000);
    },
    // 点击按钮搜索
    search(status) {
      this.keyword = null;
      this.status = status;
      this.table.page.pageNum = 1;
      this.queryList();
    },
    search2() {
      this.table.page.pageNum = 1;
      this.queryList();
    },
    // 点击按钮重置
    refresh() {
      this.keyword = null;
      this.table.page.pageNum = 1;
      this.queryList();
    },
    // 输入框获得焦点之后打开dialog弹框
    handleFocus() {
      this.dialogVisible = true;
      this.queryList();
    },
    // 点击单行事件
    clickRow(val) {
      this.selectObj = val;
    },
    // 单行双击事件
    rowDblclick(val) {
      this.selectObj = val;
      this.confirm();
    },
    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.queryList();
    },
    // 搜索条件查询事件
    queryList() {
      this.$emit("queryList");
      let params = {
        ...this.params,
        pageNo: this.table.page.pageNum,
        pageSize: 10,
        keyword: this.keyword,
      };
      if (this.status) {
        params.status = this.status;
      }
      this.getList(params).then((res) => {
        if (res.msg.code === "0000") {
          this.table.data = res.data.records;
          this.table.page.total = res.data.total;
        }
      });
    },
    // 确认选中
    confirm() {
      this.project = this.selectObj;
      this.$emit("select", this.project);
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss">
.reportdialog {
  .table {
    .sr-icon-set {
      display: none;
    }
  }
}
</style>
