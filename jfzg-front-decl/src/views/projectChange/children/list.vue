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
      @close="dailogClose"
      @refresh="dailogRefresh"
      :getNumber="getNumber"
    >
      <el-input
        slot="search"
        clearable
        v-model="params.keyWords"
        placeholder="请输入项目名称/编号"
      ></el-input>
    </SrDialogSelect>
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
import { getChengjianUnit } from "@/api/shangyun/index";
import { permissionCode } from "../const.js";
import config from "@/settings.js";
import {
  api_getList,
  api_getDetailById,
  api_saveNew,
  api_export,
  api_delete,
  getProjectlist,
  api_fileAway,
} from "@/api/biangeng/index";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { api_getLibraryNumber } from "@/api/projectLibrary";
import upload from "@/utils/upload";
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
    // 是否是项目变更审批
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
      getNumber: api_getLibraryNumber, //弹框新增接口
      activeRow: {},
      supplementRow: {},
      menuTypeObject: {
        menuType: "7001",
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
        updateFileCode: "M003_M008_005",
        //删除code
        deleteCode: "M003_M008_006",
        //停止上传code
        stopUploadingCode: "M003_M008_007",
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
      sortDtos: [],
      getList: getProjectlist,
      params: {
        ids: "",
        keyWords: "",
        // isSubproject: 0,
        status: 1000,
        activationStatus: 1,
        isArchive: 0,
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
            /*   exportPermissionCode: this.ifHideAddBtn
              ? "M004_M002_001"
              : "M003_M002_002", */
            exportPermissionCode: this.ifHideAddBtn
              ? "M004_M008_001"
              : "M003_M008_002",
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
              value: ["2", "3", "1000", "4"],
              field: "status",
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate3, //自定义判断是否展示按钮权限
            },
            /*  {
              name: "上传附件", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "supplement", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate4,
            }, */
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
            type: "text",
            placeholder: "请输入项目名称/编号关键字",
            bind: "keyWords",
            disabled: false,
            maxlength: 50,
          },
          {
            type: "select",
            placeholder: "请输入承建单位",
            bind: "buildName",
            data: "designUnitsList", // 对应enum中的stateList
            class: "selectWidthCustom",
            isHave: true, //支持下拉框输入
          },
        ],
        enum: {
          // yearList: [],
          designUnitsList: [],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            validate: this.btnValidate2,
            permissionCode: "M003_M008_001",
          },
        ],
        formData: {
          buildName: "",
          keyWords: "",
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
    dailogClose() {
      this.$set(this.params, "keyWords", "");
    },
    dailogRefresh() {
      this.$set(this.params, "keyWords", "");
      setTimeout(() => {
        this.$refs.SrDialogSelect.queryList();
      }, 100);
    },
    getChengjianUnit() {
      let data = {
        buPropertyEnum: "CJDW",
      };
      getChengjianUnit(data).then((res) => {
        let type_list = [];
        res.data.forEach((item) => {
          let emunObj = {};
          emunObj.label = item.buName;
          emunObj.value = item.buName;
          type_list.push(emunObj);
        });
        this.$set(this.search.enum, "designUnitsList", type_list);
      });
      getChengjianUnit({ buPropertyEnum: "JSDW" }).then((res) => {
        let type_list = [];
        res.data.forEach((item) => {
          let emunObj = {};
          emunObj.label = item.buName;
          emunObj.value = item.buName;
          type_list.push(emunObj);
        });
        this.$set(this.search.enum, "jsdwList", type_list);
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
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此项目, 是否继续?",
        okFun: () => {
          api_delete({ id: row.id }).then((res) => {
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
    btnValidate(row, item) {
      if (
        row.name == "编辑" &&
        this.$route.name == "projectChange" &&
        item.status !== 1000
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
    btnValidate3(row, item) {
      let { roleCode } = this.userInfo.currentRole;
      let arr = ["JSDW_JBR"];
      if (arr.includes(roleCode) && item.status !== 1) {
        return false;
      }
      if (
        row.name == "删除" &&
        this.$route.name == "projectChange" &&
        this.checkCodeInArr("M003_M008_006")
      ) {
        return true;
      }
      return false;
    },
    btnValidate4(row, item) {
      if (
        this.checkCodeInArr("M003_M008_004") ||
        this.checkCodeInArr("M003_M008_005") ||
        this.checkCodeInArr("M004_M008_003") ||
        this.checkCodeInArr("M004_M008_004")
      ) {
        return true;
      }
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "totalInvestmentAmount") {
            item.width = "120px";
            item.sortable = "custom";
          }
          return item.isShow;
        });
      });
    },
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectImpl/changeProject/export?permissionCode=${permissionCode}&access_token=${sessionStorage.getItem(
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
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      if (this.sortDtos.length > 0) {
        param.sortDtos = this.sortDtos;
      }
      api_getList(param).then((res) => {
        if (res) {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
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
                // 非申报单位没有撤回按钮
                item.operationBtns.map((item2) => {
                  if (item2.btnName == "撤回" && roleCode != "JSDW_JBR") {
                    item2.btnName = "";
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
      this.$refs.SrDialogSelect.refresh();
    },
    handleSelect(val) {
      removeSession("infoId_projectChange" + val.projectId || val.id);
      this.$router.push({
        name: "projectChangeAdd",
        query: { projectId: val.projectId || val.id },
      });
    },
    edit(row) {
      this.$router.push({
        name: "projectChangeEdit",
        query: {
          id: row.id,
          projectId: row.projectId,
          templateId: row.templateId,
        },
      });
    },
    workView(row) {
      this.$router.push({
        name:
          this.$route.name == "projectChange"
            ? "projectChangeWorkView"
            : "projectChangeAuditWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          projectId: row.projectId,
        },
      });
    },
    see(row) {
      this.$router.push({
        name:
          this.$route.name == "projectChange"
            ? "projectChangeView"
            : "projectChangeAuditView",
        query: {
          id: row.id,
          processId: row.processId,
          projectId: row.projectId,
          templateId: row.templateId,
        },
      });
    },
    getYear() {
      // get_year_plan().then((res) => {
      //   var yearlist = [];
      //   for (var i = 0; i < res.data.length; i++) {
      //     var map = {
      //       value: res.data[i].id,
      //       label: res.data[i].yearPlanName,
      //     };
      //     yearlist.push(map);
      //   }
      //   this.$set(this.search.enum, "yearList", yearlist);
      // });
    },
  },
  created() {
    this.getTbData();
    this.getYear();
    this.getTbHeader();
    this.getChengjianUnit();
    if (this.yearPlanId) {
      this.$set(this.search.config[0], "disabled", true);
    }
    if (this.$route.name == "projectChangeAudit") {
      this.search.config.splice(1, 0, {
        type: "select",
        placeholder: "请选择建设单位",
        bind: "supplyName",
        data: "jsdwList",
        class: "selectWidthCustom",
      });
      this.codeObject = {
        //上传文件权限code
        updateFileCode: "M004_M008_004",
        //删除code
        deleteCode: "M004_M008_005",
        //停止上传code
        stopUploadingCode: "M004_M008_006",
      };
    }
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
  ::v-deep .selectWidthCustom {
    width: 153px !important;
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
