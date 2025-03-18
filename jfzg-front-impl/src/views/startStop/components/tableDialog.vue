<template>
  <div class="sr-dialog-select">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      append-to-body
      width="800px"
      center
      custom-class="dialog_select"
      v-if="dialogVisible"
    >
      <SrTable
        :data="table.data"
        :config="table.tableConfig"
        :page="table.page"
        @pageChanged="pageChanged"
        @clickRow="clickRow"
        @rowDblclick="rowDblclick"
        @selected="selected"
        @selectAll="selected"
      />
      <slot v-if="!isButton" class="el-dialog__footer" name="footer" slot="footer">
        <el-button size="small" round type="primary" v-debounce="[() => confirm(), config.deTime]">确定</el-button>
        <el-button size="small" round @click="dialogVisible = false">取消</el-button>
      </slot>
    </el-dialog>
  </div>
</template>
<script>
import config from "@/settings.js";
export default {
  name: "SrDialogSelect",
  props: {
    isButton: Boolean,
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
    params: Object,
    hasChildrenFlag: {
      type: Boolean,
      default() {
        return true;
      },
    },
    tableConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 多选时再次打开弹框已经选中的数据
    selectData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 多选最多可选几个
    max: {
      type: Number,
      default: () => {
        return 1;
      },
    },
  },
  data() {
    return {
      config,
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
          selectionConfig: {
            display: false,
          },
          header: [
            {
              label: "项目名称",
              prop: "projectName",
            },
            {
              label: "项目编号",
              prop: "projectCode",
            },
          ],
          indexConfig: {
            display: true,
            label: "序列",
            width: "52",
          },
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
      selectObj: null,
    };
  },
  mounted() {
    Object.keys(this.tableConfig).forEach((item) => {
      this.$set(this.table.tableConfig, item, this.tableConfig[item]);
    });
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
    search() {
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
      if (this.table.tableConfig.highlightCurrentRow) {
        this.selectObj = val;
      }
    },
    // 单行双击事件
    rowDblclick(val) {
      if (this.table.tableConfig.highlightCurrentRow) {
        this.selectObj = val;
        this.confirm();
      }
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
      };
      this.getList(params).then((res) => {
        if (res.msg.code === "0000") {
          this.table.data = res.data.map((item) => {
            if (!this.hasChildrenFlag) {
              item.hasChildren = false;
            }
            return item;
          });
          this.table.page.total = res.data.total;
        }
      });
    },
    // 确认选中
    confirm() {
      if (this.table.tableConfig.selectionConfig.display) {
        // 多选
        if (this.selectObj) {
          if (this.selectObj.length + this.selectData.length > this.max) {
            this.$message({
              message: "超出设定人数，请核对专家人数！",
              type: "warning",
            });
          } else {
            this.project = this.selectObj;
            this.$emit("select", this.project);
            this.dialogVisible = false;
          }
        } else {
          this.dialogVisible = false;
        }
      } else {
        // 单选
        this.project = this.selectObj;
        this.$emit("select", this.project);
        this.dialogVisible = false;
      }
    },
    // 开启多选框之后的选择事件
    selected(val) {
      this.selectObj = val;
    },
  },
};
</script>
