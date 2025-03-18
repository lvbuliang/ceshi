<template>
  <div>
    <SrSearch
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      @queryList="pageChanged(1)"
    ></SrSearch>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
    ></SrTable>
    <el-dialog
      center
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div
        :is="child"
        :formData="formData"
        :visible.sync="dialogVisible"
        ref="add"
        @refresh="refresh"
        v-if="dialogVisible"
      ></div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" round type="primary" v-debounce="[() => submit(), config.deTime]"
          >确 定</el-button
        >
        <el-button size="small" round @click="dialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  expertLeaveList,
  api_userSetQuery,
  expertLeaveDetail,
  api_userSetSave,
} from "@/api/expert";
import config from "@/settings.js";
import store from "@/store";
import add from "./add.vue";
import utils from "@/utils/utils.js";

export default {
  components: {
    add,
  },
  props: {},
  data() {
    return {
      config,
      userInfo: store.getters.userInfo,
      dialogVisible: false,
      dialogTitle: "",
      child: "",
      isTableHeaderId: "",
      formData: {},
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "请输入专家姓名",
            bind: "expertname",
          },
        ],
        enum: {},
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M008_M002_001",
          },
        ],
        formData: {},
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M008_M002_003",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              method: "see", // 点击执行该页面methods中对应的方法
            },
            {
              name: "编辑",
              method: "edit",
              type: "text",
              code: "M008_M002_002",
              validate: this.btnValidate,
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
        },
      },
    };
  },
  mounted() {
    if (utils.checkCodeInArr("M008_M002_003")) {
      this.table.tableConfig.operateConfig.exportPermissionCode =
        "M008_M002_003";
    } else if (utils.checkCodeInArr("M008_M003_003")) {
      this.table.tableConfig.operateConfig.exportPermissionCode =
        "M008_M003_003";
    }
    this.getTbHeader();
    this.getTbData();
  },
  methods: {
    btnValidate(row, item) {
      if (row.name === "编辑" && item.editFlag) {
        return true;
      }
      return false;
    },
    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };

      expertLeaveList(param).then((res) => {
        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        res.data.records.forEach((item) => {
          if (item.todo && item.curDesc && item.curDesc.operationBtns) {
            item.operationBtns = item.curDesc.operationBtns;
            item.path = this.workView;
          }
        });
        this.table.data = res.data.records;
      });
    },
    // 新增
    add() {
      this.formData = {
        expertId: this.userInfo.jfid,
        expertName: this.userInfo.fullname,
      };
      this.dialogTitle = "请假申请";
      this.dialogVisible = true;
      this.child = "add";
    },
    // 新增请假申请提交
    submit() {
      this.$refs.add.submit();
    },
    // 导出
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectImpl/api/expertLeave/export?permissionCode=M008_M002&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    // 查看请假详情
    see(row) {
      this.$router.push({
        name: "absenceApplyView",
        query: {
          id: row.id,
          processId: row.processId,
        },
      });
    },
    // 编辑
    edit(row) {
      expertLeaveDetail({ id: row.id }).then((res) => {
        if (res.msg.code === "0000") {
          res.data.leaveDate = [res.data.leaveStartDate, res.data.leaveEndDate];
          if (res.data.leaveFile) {
            res.data.leaveFile = JSON.parse(res.data.leaveFile);
          }
          this.formData = res.data;
          this.dialogTitle = "编辑请假";
          this.dialogVisible = true;
          this.child = "add";
        }
      });
    },
    // 刷新页面
    refresh() {
      this.dialogVisible = false;
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      this.getTbData();
    },
    workView(row) {
      this.$router.push({
        name: "absenceApplyWorkView",
        query: {
          id: row.id,
          processId: row.processId,
        },
      });
    },
    // 获取全部表头以及已选中表头
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M008_M002" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter(
          (item) => item.isShow
        );
      });
    },
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: 'M008_M002',
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
  },
};
</script>

<style scoped >
</style>
