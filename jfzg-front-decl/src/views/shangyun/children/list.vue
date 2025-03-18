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
      :config="table.tableConfig"
      :page="table.page"
      @sortChange="sortChange"
    ></SrTable>
    <SrDialogSelect
      class="SrDialogSelect"
      ref="SrDialogSelect"
      :getList="getList"
      :params="params"
      @select="handleSelect"
      :footerFlag="false"
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
import config from "@/settings.js";

import store from "@/store";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import {
  queryShangyunList,
  deleteShangyun,
  getChengjianUnit,
  api_fileAway,
} from "@/api/shangyun/index";
import { removeSession } from "@/core/session.js";
import {
  api_userSetQuery,
  api_userSetSave,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";
import { api_ky_queryIdList } from "@/api/keyan";
import upload from "@/utils/upload";

export default {
  props: {},
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
        menuType: "16001",
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
        updateFileCode: "M003_M009_005",
        //删除code
        deleteCode: "M003_M009_006",
        //停止上传code
        stopUploadingCode: "M003_M009_007",
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
        status: 1000,
        activationStatus: 1,
        isArchive:0
        // isSubproject: 0,
      },
      userInfo: store.getters.userInfo,
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
            placeholder: "请选择承建单位",
            bind: "contractUnitFullName",
            data: "designUnitsList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          designUnitsList: [],
          jsdwList: [],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M003_M009_001",
          },
          // { name: "导出", click: this.export, permissionCode: "M003_M004_002" },
        ],
        formData: {
          keyword: "",
          constructUnitFullName: "",
          contractUnitFullName: "",
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
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode:
              this.$route.name == "shangyunAuditList"
                ? "M004_M009_001"
                : "M003_M009_001",
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
              field: "status",
              value: ["2", "3", "1000"],
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate,
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              field: "status",
              value: ["1"],
              icon: "el-icon-document",
              className: "font-size-20",
              reverse: true,
              validate: this.btnValidate,
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
  computed: {
    permissionCode() {
      return this.$route.name == "shangyunAudit" ? "M004_M009" : "M003_M009";
    },
  },
  created() {
    if (this.$route.name == "shangyunAuditList") {
      this.search.config.splice(1, 0, {
        type: "select",
        placeholder: "请选择建设单位",
        bind: "constructUnitFullName",
        data: "jsdwList",
        class: "selectWidthCustom",
      });
      this.codeObject = {
        //上传文件权限code
        updateFileCode: "M004_M009_004",
        //删除code
        deleteCode: "M004_M009_005",
        //停止上传code
        stopUploadingCode: "M004_M009_006",
      };
    }
    this.getTbHeader(this.permissionCode);
    this.getChengjianUnit();
    this.getTbData(1);
    // this.initIds();
    // 审批搜索条件增加建设单位
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
    // 获取承建单位
    getChengjianUnit() {
      let data = {
        buPropertyEnum: "CJDW",
      };
      getChengjianUnit(data).then((res) => {
        let type_list = [];
        res.data.forEach((item) => {
          let emunObj = {};
          emunObj.label = item.buName;
          emunObj.value = item.buid;
          type_list.push(emunObj);
        });
        this.$set(this.search.enum, "designUnitsList", type_list);
      });
      getChengjianUnit({ buPropertyEnum: "JSDW" }).then((res) => {
        let type_list = [];
        res.data.forEach((item) => {
          let emunObj = {};
          emunObj.label = item.buName;
          emunObj.value = item.buid;
          type_list.push(emunObj);
        });
        this.$set(this.search.enum, "jsdwList", type_list);
      });
    },
    async initIds() {
      let res = await api_ky_queryIdList();
      if (!res.data || res.msg.code != "0000") return;
      this.$set(this.params, "ids", res.data);
    },

    btnValidate() {
      let { roleCode } = this.userInfo.currentRole;
      console.log(roleCode);
      let arr = ["GHFZC_FZR", "GHFZC_JBR", "TCDW_LD"];
      if (arr.includes(roleCode)) {
        return false;
      } else {
        return true;
      }
    },
    btnValidate4(row, item) {
      if (
        this.$utils.checkCodeInArr("M003_M009_004") ||
        this.$utils.checkCodeInArr("M003_M009_005") ||
        this.$utils.checkCodeInArr("M004_M009_003") ||
        this.$utils.checkCodeInArr("M004_M009_004")
      ) {
        return true;
      }
    },
    // 判断权限code在不在数组里
    checkCodeInArr(code, arr) {
      arr = arr || sessionStorage.getItem("permission_btns") || [];
      if (!code) {
        return true;
      }
      arr = typeof arr == "string" ? JSON.parse(arr) : arr;
      let flag = false;
      for (let k = 0; k < arr.length; k++) {
        if (arr[k].permissionCode == code) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    getTbData() {
      let param = {
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      this.search.enum.designUnitsList.forEach((item) => {
        if (param.contractUnitFullName == item.value) {
          param.contractUnitFullName = item.label;
        }
      });
      this.search.enum.jsdwList.forEach((item) => {
        if (param.constructUnitFullName == item.value) {
          param.constructUnitFullName = item.label;
        }
      });

      queryShangyunList(param).then((res) => {
        if (!res?.data?.records) return;

        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        let { roleCode } = this.userInfo.currentRole;
        let { jfid } = this.userInfo;
        res.data.records.forEach((item) => {
          if (item.todo) {
            item.operationBtns = [];
            if (item.assignee == jfid) {
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  item1.operationBtns &&
                    item.operationBtns.push(item1.operationBtns[0]);
                });
              item.path = this.workView;
            } else {
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  if (roleCode == item1.role) {
                    item1.operationBtns &&
                      item.operationBtns.push(item1.operationBtns[0]);
                  }
                });
              item.path = this.workView;
            }
          }
        });
        this.table.data = res.data.records;
      });
    },

    workView(row) {
      console.log(row);
      this.$router.push({
        name:
          this.$route.name == "shangyunAuditList"
            ? "shangyunAuditWorkView"
            : "shangyunWorkView",
        query: {
          id: row.id,
          projectId: row.projectId,
          templateId: row.templateId,
          processId: row.workflowId,
        },
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
    getTbHeader(permissionCode) {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "totalInvestmentAmount") {
            item.width = "170px";
            item.sortable = 'custom';
          }
          return item.isShow;
        });

        console.log(
          " this.table.tableConfig.header",
          this.table.tableConfig.header
        );
      });
    },
    handleSelect(val) {
      if (val.id) {
        this.$router.push({
          name: "shangyunAdd",
          query: { projectId: val.id },
        });
      }
    },
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectImpl/projectUpCloud/export?permissionCode=${
          this.permissionCode
        }&access_token=${sessionStorage.getItem("token")}`
      );
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          deleteShangyun({ id: row.id }).then((res) => {
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
      removeSession("infoId_shangyunProject");
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs["SrDialogSelect"].refresh();
    },
    see(val) {
      this.$router.push({
        name: `shangyunView`,
        name:
          this.$route.name == "shangyunAuditList"
            ? "shangyunAuditView"
            : "shangyunView",
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
          processId: val.workflowId,
        },
      });
    },

    edit(val) {
      removeSession("infoId_shangyunProject");
      this.$router.push({
        name: "shangyunEdit",
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
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: this.permissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader(this.permissionCode);
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
