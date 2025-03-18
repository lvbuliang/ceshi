<template>
  <div class="total-page">
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      ></SrSearch>
    </div>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
    ></SrTable>
    <SrDialogSelect
      class="SrDialogSelect"
      ref="SrDialogSelect"
      :getList="getList"
      :params="params"
      :footerFlag="false"
      :hasChildrenFlag="false"
      @select="handleSelect"
    ></SrDialogSelect>
    <SrSupplementBox
      ref="supplementBox"
      type="operationLibrary"
      :apiObject="apiObject"
      :title="supplementBoxTitle"
      :codeObject="codeObject"
      :tableDataList="tableDataList"
      :stopUploadingFlag="stopUploadingFlag"
      :stopUploadingPassedName="'文件归档'"
      :stopUploadingStoppedName="'文件已归档'"
      :stopUploadingIcon="'sr-icon-a-guidang1'"
      :menuTypeObject="menuTypeObject"
      @stopUploading="stopUploading"
    />
  </div>
</template>

<script>
import store from "@/store";
import {
  api_userSetQuery,
  api_userSetSave,
  api_userSetExport,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";

import { permissionCode } from "../const.js";
import config from "@/settings.js";
import {
  api_getlist_in,
  api_getlist_add,
  get_year_plan,
  api_getlist_in_delete,
  api_wthinFileAway,
} from "@/api/shenbao/index";
import upload from "@/utils/upload";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import { setSession, getSession, removeSession } from "@/core/session.js";

export default {
  //组件注册
  // components: {
  //   SrTbale
  // },
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      uploadFileUrl: config.uploadFileUrl,
      previewUrl: config.previewUrl,
    };
  },
  props: {
    ifHideAddBtn: {
      type: Boolean,
      default: false,
    },
    yearPlanId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeRow: {},
      supplementRow: {},
      menuTypeObject: {
        menuType: "4001001",
        objectId: "",
        projectId: "",
      },
      //补充文件数据组
      tableDataList: [
        {
          //列表名称
          fileName: "上传附件",
          //文件提示
          popover: "",
          //按钮名称
          uploadReportName: "上传附件",
          //列表数据
          dataList: [],
          //实例id
          instanceId: 503,
        },
      ],
      // 上传意见
      codeObject: {
        //上传文件权限code
        updateFileCode: "M003_M002_005",
        //删除code
        deleteCode: "M003_M002_006",
        //停止上传code
        stopUploadingCode: "M003_M002_007",
      },
      //停止上传状态
      stopUploadingFlag: true,
      //接口集合
      apiObject: {
        api_addFile,
        api_updateFile,
        api_listByInstanceId,
        api_deleteItem,
      },
      //弹框名称
      supplementBoxTitle: "上传附件",
      // sortDtos: [],
      getList: api_queryProjectNotInIds,
      params: {
        ids: "",
        isSubproject: 0,
        status: 1000,
        activationStatus: 1,
        isArchive:0
      },
      dialogVisible: false,
      isTableHeaderId: "",
      editableTabs: [],

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
            display: true,
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
              // code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            },
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "上传附件", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "supplement", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
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
        btns: this.ifHideAddBtn
          ? [
              // {
              //   name: "导出",
              //   click: this.export,
              //   permissionCode: "M004_M002_001",
              // },
            ]
          : [
              {
                name: "新增",
                click: this.add,
                type: "primary",
                validate: this.btnValidate2,
                permissionCode: "M003_M002_001",
              },
              // {
              //   name: "导出",
              //   click: this.export,
              //   permissionCode: "M003_M002_002",
              // },
            ],
        formData: {
          condition: "",
          yearPlanId: this.yearPlanId ? Number(this.yearPlanId) : "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
      },
    };
  },
  methods: {
    stopUploading(obj) {
      let { id, fileInstanceId } = this.supplementRow;
      let str = JSON.parse(fileInstanceId);
      str[0].is_stop = 1;
      let params = {
        id,
        fileInstanceId: JSON.stringify(str),
      };
      if (obj) {
        params.instanceId = obj[0]?.instanceId;
        params.id = this.activeRow.id;
      }
      api_wthinFileAway(params).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "停止成功",
          });
          this.stopUploadingFlag = false;
          this.getTbData();
        }
      });
    },
    // 上传报告
    supplement(row) {
      if (!row.fileInstanceId && !JSON.parse(row.fileInstanceId).length) {
        return;
      }
      this.supplementRow = row;
      let fileInstance = JSON.parse(row.fileInstanceId)[0];
      this.stopUploadingFlag = true;
      this.activeRow = row;
      if (fileInstance.is_stop) {
        this.stopUploadingFlag = false;
      }
      this.menuTypeObject.projectId = row.projectId;
      this.menuTypeObject.objectId = row.id;
      this.tableDataList = [
        {
          //列表名称
          fileName: "上传附件",
          //按钮名称
          uploadReportName: "上传报告",
          //列表数据
          dataList: [],
          uploadReportName: "上传附件",
          //实例id
          instanceId: fileInstance.file_currency,
        },
      ];
      this.$refs.supplementBox.init();
    },
    sortChange(column) {
      if (column.order === "ascending") {
        this.search.formData["orderByColumn"] = column.prop;
        this.search.formData["orderBy"] = "ASC";
      } else if (column.order === "descending") {
        this.search.formData["orderByColumn"] = column.prop;
        this.search.formData["orderBy"] = "DESC";
      } else {
        this.search.formData["orderByColumn"] = "";
        this.search.formData["orderBy"] = "";
      }
      this.getTbData();
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
    btnValidate(row, item) {
      if (
        row.name == "编辑" &&
        item.editable &&
        this.$route.name == "planedProject"
      ) {
        return true;
      }
      if (
        row.name == "删除" &&
        item.removeFlag &&
        this.$route.name == "planedProject"
      ) {
        return true;
      }
      if (
        row.name == "上传附件" &&
        (this.$utils.checkCodeInArr("M003_M002_004") ||
          this.$utils.checkCodeInArr("M003_M002_005") ||
          this.$utils.checkCodeInArr("M004_M002_003") ||
          this.$utils.checkCodeInArr("M004_M002_004"))
      ) {
        return true;
      }
      return false;
    },
    btnValidate2(row, item) {
      if (this.ifHideAddBtn) {
        return false;
      }
      return true;
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "amountDeclared" || item.prop == "created") {
            item.sortable = 'custom';
            item.width = "180px";
          }
          return item.isShow;
        });
      });
    },
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectDecl/api/plan/wthin/projectDeclare/export?permissionCode=${permissionCode}&access_token=${sessionStorage.getItem(
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
        ...this.search.formData,
      };
      // if (this.sortDtos.length > 0) {
      //   param.sortDtos = this.sortDtos;
      // }
      if (param.orderByColumn == "") {
        delete param.orderByColumn;
      }
      if (param.orderBy == "") {
        delete param.orderBy;
      }
      api_getlist_in(param).then((res) => {
        if (res) {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          res.data.records.forEach((item) => {
            if (item.todo && this.$route.name != "yearplanAuditView") {
              item.operationBtns = [];
              //按钮筛选  以assignee优先roleCode
              if (item.assignee == jfid) {
                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    if (item1.operationBtns && item1.role == "assignee") {
                      item.operationBtns.push(item1.operationBtns[0]);
                    }
                  });
                item.path = this.workView;
              } else {
                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    if (roleCode == item1.role) {
                      if (item1.operationBtns) {
                        item.operationBtns.push(item1.operationBtns[0]);
                      }
                    }
                  });
                item.path = this.workView;
              }
            }
          });
          this.table.data = res.data.records;
        } else {
          this.table.data = [];
        }
      });
    },
    settingHeader() {
      this.dialogVisible = true;
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: permissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    add() {
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    handleSelect(val) {
      removeSession("infoId_planedProject" + val.id);
      this.$router.push({
        name: "planedProjectAdd",
        query: { projectId: val.id },
      });
    },
    edit(row) {
      this.$router.push({
        name: "planedProjectEdit",
        query: { id: row.id, templateId: row.templateId,projectId:row.projectId },
      });
    },
    workView(row) {
      this.$router.push({
        name:
          this.$route.name == "planedProject"
            ? "planedProjectWorkView"
            : "planedProjectAuditWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          projectId: row.projectId,
          templateId: row.templateId,
        },
      });
    },
    see(row) {
      this.$router.push({
        name:
          this.$route.name == "planedProject"
            ? "planedProjectView"
            : "planedProjectAuditView",
        query: {
          id: row.id,
          processId: row.processId,
          projectId: row.projectId,
          templateId: row.templateId,
        },
      });
    },
    getYear() {
      get_year_plan().then((res) => {
        var yearlist = [];
        for (var i = 0; i < res.data.length; i++) {
          var map = {
            value: res.data[i].id,
            label: res.data[i].yearPlanName,
          };
          yearlist.push(map);
        }
        this.$set(this.search.enum, "yearList", yearlist);
      });
    },
  },
  created() {
    this.getTbData();
    this.getYear();
    this.getTbHeader();
    if (this.yearPlanId) {
      this.$set(this.search.config[0], "disabled", true);
    }
    console.log(this.yearPlanId)
    if (this.$route.name == "planedProjectAudit") {
      this.codeObject = {
        //上传文件权限code
        updateFileCode: "M004_M002_004",
        //删除code
        deleteCode: "M004_M002_005",
        //停止上传code
        stopUploadingCode: "M004_M002_006",
      };
    }
  },
};
</script>
<style lang="scss" scoped>
.total-page{
  background-color: #fff;
}
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
