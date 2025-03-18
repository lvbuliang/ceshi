<template>
  <div class="total-page">
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
    
      :config="table.tableConfig"
      :page="table.page"
    ></SrTable>
  </div>
</template>

<script>
import store from "@/store";
import {
  api_userSetQuery,
  api_userSetSave,
  api_userSetExport,
} from "@/api/index.js";
import {
  permissionCode,
  milestonepermissionCode,
} from "@/views/milestone/const.js";
import config from "@/settings.js";
import { api_milestoneList } from "@/api/milestone/index";
import { api_queryList } from "@/api/projectLibrary";
import { setSession, getSession, removeSession } from "@/core/session.js";

export default {
  //组件注册
  // components: {
  //   SrTbale
  // },
  props: {
    hideSearchBtn: {
      type: Boolean,
      default: false,
    },
    viewProjectId: String, // 实施中查看组件项目id传参
    backName: String, //实施中组件返回列表参数
  },
  data() {
    return {
      params: {
        // planType: 0, // 0 无 1、专项规划 2、总体规划
        status: 4,
      },
      dialogVisible: false,
      isTableHeaderId: "",
      editableTabs: [],
      loading: false,
      userInfo: store.getters.userInfo,
      tableList: {
        header: [],
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: this.ifHideAddBtn
              ? "M004_M002_001"
              : "M003_M002_002",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
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
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "select",
            placeholder: "请选择年度计划",
            bind: "yearPlanId",
            data: "yearList", // 对应enum中的stateList
            class: "getyearclass",
            disabled: false,
          },
          {
            type: "text",
            placeholder: "请输入项目名称或编号",
            bind: "condition", // 对应this.search.data对象的field1
            disabled: false,
          },
        ],
        enum: {
          yearList: [],
        },
        btns: [],
        formData: {
          condition: "",
          yearPlanId: this.yearPlanId ? Number(this.yearPlanId) : "",
        },
      },
    };
  },
  methods: {
    btnValidate(item, row) {
      let flag = false;
      if (
        item.name == "编制" &&
        this.userInfo.currentRole.roleCode == "CJDW_JBR"
      ) {
        flag = true;
      }
      return flag;
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此申报项目, 是否继续?",
        okFun: () => {
          api_getlist_in_delete({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNum = this.table.page.pageNum - 1;
              }
              this.getTbData();
            }
          });
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        },
      });
    },

    btnValidate2(row, item) {
      if (this.ifHideAddBtn) {
        return false;
      }
      return true;
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: milestonepermissionCode }).then(
        (res) => {
          this.isTableHeaderId = res.data.id;
          let headerData = JSON.parse(res.data.data).sort(
            (a, b) => a.index - b.index
          );
          this.table.tableConfig.operateConfig.allTableHeader = headerData;
          this.table.tableConfig.header = headerData.filter(
            (item) => item.isShow
          );
        }
      );
    },
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectDecl/api/plan/wthin/projectDeclare/export?permissionCode=${milestonepermissionCode}&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    getTbData() {
      let param = {
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        projectId: this.$route.query.projectId,
        // ...this.search.formData,
      };
      if (this.viewProjectId) {
        param.projectId = this.viewProjectId;
      }
      this.loading = true;
      api_milestoneList(param).then((res) => {
        if (res) {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          this.table.data = res.data.records;
        } else {
          this.table.data = [];
        }

        this.loading = false;
      });
    },
    settingHeader() {
      this.dialogVisible = true;
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: milestonepermissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    handleSelect(val) {
      removeSession("infoId_planedProject" + val.id);
      this.$router.push({
        name: "planedProjectAdd",
        query: { projectId: val.id },
      });
    },
    see(row) {},
  },
  created() {
    this.getTbData();
    this.getTbHeader();
  },
};
</script>
<style lang="scss" scoped>
.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
.searchPage {
  ::v-deep .getyearclass {
    width: 240px !important;
  }
}
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}
</style>
