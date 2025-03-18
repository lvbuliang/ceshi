<template>
  <div class="total-page">
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
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
      :footerFlag="false"
      :params="params"
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
    <Dialog ref="dialog" @confirm="intensificationConfirm" />
  </div>
</template>

<script>
import Dialog from "@/views/components/intensification/dialog.vue";
import { setSession, getSession, removeSession } from "@/core/session.js";
import config from "@/settings.js";
import store from "@/store";
import { permissionCode } from "../const.js";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import {
  api_cs_queryList,
  api_cs_queryIdList,
  api_cs_remove,
  api_fileAway,
} from "@/api/chushe";
import {
  api_getAllDesignCompanyList,
  api_userSetQuery,
  api_userSetSave,
  queryBizunitsByProperty,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";
import upload from "@/utils/upload";
export default {
  props: {},
  components: {
    Dialog,
  },
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
  data() {
    return {
      activeRow: {},
      supplementRow: {},
      menuTypeObject: {
        menuType: "9001",
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
        updateFileCode: "M003_M005_005",
        //删除code
        deleteCode: "M003_M005_006",
        //停止上传code
        stopUploadingCode: "M003_M005_007",
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
      getList: api_queryProjectNotInIds,
      params: {
        ids: "",
        activationStatus: 1, // 非暂停的项目
        isSubproject: 0, // 是否是子项目 1 是 0 不是
        status: 1000, // 审批完成
        isArchive:0
      },
      userInfo: store.getters.userInfo,
      rowId: "",
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
            placeholder: "请输入项目关键字",
            bind: "keyword", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "请选择设计单位",
            bind: "designUnits",
            data: "designUnitsList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          jsdwList: [],
          designUnitsList: [],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M003_M005_001",
          },
          // { name: "导出", click: this.export, permissionCode: "M003_M005_002" },
        ],
        formData: {
          keyword: "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
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
            width: "160",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode:
              this.$route.name == "chusheAudit"
                ? "M004_M005_001"
                : "M003_M005_002",
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
              validate: this.btnValidate,
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate2, //自定义判断是否展示按钮权限
            },
            {
              name: "比对",
              method: "intensification",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M004_M005_003",
              validate: this.btnValidate3,
            },
            {
              name: "上传附件", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "supplement", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate4,
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

      isTableHeaderId: null,
    };
  },
  watch: {
    $route(val) {
      if (val) {
        this.getTbData();
      }
    },
  },
  created() {
    if (this.$route.name == "chusheAudit") {
      // this.search.btns = [
      //   { name: "导出", click: this.export, permissionCode: "M004_M005_001" },
      // ];
      this.search.config = [
        {
          type: "text",
          placeholder: "请输入项目关键字",
          bind: "keyword", // 对应this.search.data对象的field1
        },
        {
          type: "select",
          placeholder: "请选择建设单位",
          bind: "creatorBuid",
          data: "jsdwList", // 对应enum中的stateList
          class: "selectWidthCustom",
        },
      ];
      this.codeObject = {
        //上传文件权限code
        updateFileCode: "M004_M005_005",
        //删除code
        deleteCode: "M004_M005_006",
        //停止上传code
        stopUploadingCode: "M004_M005_007",
      };
      this.getQueryBizunitsByProperty();
    } else {
      this.initCompany();
    }
    this.getTbHeader();
    this.getTbData();
    // this.initIds();
  },
  mounted() {},
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
      api_fileAway(params).then((res) => {
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
    async initIds() {
      let res = await api_cs_queryIdList();
      if (!res.data || res.msg.code != "0000") return;
      this.$set(this.params, "ids", res.data);
    },
    getQueryBizunitsByProperty() {
      // 获取建设单位
      queryBizunitsByProperty({ buPropertyEnum: "JSDW" }).then((res) => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "jsdwList",
            this.$utils.enumsDataNameValue(
              res.data,
              "buName",
              "buid",
              "label",
              "value"
            )
          );
        }
      });
    },
    async initCompany() {
      // 设计单位接口
      let res = await api_getAllDesignCompanyList({
        pageNum: 1,
        pageSize: 9999999,
      });
      if (res?.data?.records) {
        this.$set(
          this.search.enum,
          "designUnitsList",
          this.$utils.enumsDataNameValue(
            res.data.records,
            "companyName",
            "id",
            "label",
            "value"
          )
        );
      }
    },
    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      if (param.orderByColumn == "") {
        delete param.orderByColumn;
      }
      if (param.orderBy == "") {
        delete param.orderBy;
      }
      api_cs_queryList(param).then((res) => {
        if (!res?.data?.records) return;
        this.table.page.pages = res?.data?.pages;
        this.table.page.total = res?.data?.total;
        let { roleCode } = this.userInfo.currentRole;
        let { jfid } = this.userInfo;

        res.data.records.forEach((item) => {
          if (item.todo) {
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
      });
    },
    workView(val) {
      this.$router.push({
        name: `${
          this.$route.name.includes("Audit")
            ? "chusheAuditWorkView"
            : "chusheWorkView"
        }`,
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "auditMoney" || item.prop == "createTime") {
            item.sortable = 'custom';
            item.width = "180px";
          }
          return item.isShow;
        });
      });
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
    handleSelect(val) {
      if (val.id) {
        removeSession("infoId_chushe" + val.id);
        this.$router.push({
          name: "chusheAdd",
          query: { projectId: val.id },
        });
      }
    },
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectDecl/preliminary/export?permissionCode=${permissionCode}&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    intensification(row) {
      this.rowId = row.id;

      // 比对
      this.$refs["dialog"].dialogVisible = true;
    },
    intensificationConfirm(row) {
      this.$router.push({
        name: "cs_intensificationList",
        query: { id: this.rowId },
      });
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          api_cs_remove({ id: row.id }).then((res) => {
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
    add() {
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    see(val) {
      this.$router.push({
        name: `${
          this.$route.name.includes("Audit") ? "chusheAuditView" : "chusheView"
        }`,
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },

    edit(val) {
      this.$router.push({
        name: "chusheEdit",
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
        },
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
    settingHeader() {
      this.dialogVisible = true;
    },
    btnValidate(item, row) {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;

      let arr = ["YYJSC_FZR", "YYJSC_JBR", "JSDW_JBR", "JSDW_FZR"];
      if (
        arr.includes(roleCode) &&
        row.creatorJfid == jfid &&
        (row.status == 0 || row.status == 1 || row.status == 5)
      ) {
        return true;
      } else {
        return false;
      }
    },
    btnValidate2(row, item) {
      if (
        row.name == "删除" &&
        item.editable &&
        !item.statusName.includes("驳回")
      ) {
        return true;
      }
      return false;
    },
    btnValidate3(row, item) {
      if (
        row.name == "比对" &&
        item.processId &&
        this.$utils.checkCodeInArr(row.code)
      ) {
        return true;
      }
    },
    btnValidate4(row, item) {
      if (
        this.$utils.checkCodeInArr("M003_M005_004") ||
        this.$utils.checkCodeInArr("M003_M005_005") ||
        this.$utils.checkCodeInArr("M004_M005_004") ||
        this.$utils.checkCodeInArr("M004_M005_005")
      ) {
        return true;
      }
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
          this.initCompany();
          this.getQueryBizunitsByProperty();
        }
      });
    },
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
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
}
</style>
