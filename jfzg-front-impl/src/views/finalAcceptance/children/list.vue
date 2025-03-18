<template>
  <div class="finalAcceptanceList">
    <div class="searchPage">
      <SrSearch
        class="SrSearch"
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        @queryList="pageChanged(1)"
      ></SrSearch>
    </div>
    <SrTable
      class="table"
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
    >
    </SrTable>
    <SrDialogSelect
      class="SrDialogSelect"
      ref="SrDialogSelect"
      :getList="getList"
      :footerFlag="false"
      :params="params"
      :hasChildrenFlag="false"
      @select="centerDialogSbmit"
      :getNumber="getNumber"
    >
    </SrDialogSelect>
    <SrSupplementBox
      class="SrSupplementBox"
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
    <keepRecordDialog ref="keepRecordDialog" @submitSuccess="submitSuccess" />
  </div>
</template>

<script>
import store from "@/store";
import {
  api_userSetQuery,
  api_userSetSave,
  listByTopicAndItem,
  queryBizunitsByProperty,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
  queryBizunitsByProperties,
} from "@/api/index.js";
import {
  api_queryProjectNotInIds,
  api_queryProjectFinalTest,
} from "@/api/pilotMgr/index.js";
import { api_getLibraryNumber} from "@/api/projectLibrary";
import {
  api_finalAcceptanceList,
  api_queryIdList,
  api_fileAway,
} from "@/api/finalAcceptance/index.js";
import { api_getAmount } from "@/api/beCompleted/index.js";
import moment from "moment";
import config from "@/settings.js";
import { setSession, getSession, removeSession } from "@/core/session.js";
import keepRecordDialog from "./keepRecordDialog.vue";
import upload from "@/utils/upload";
export default {
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
  components: {
    keepRecordDialog,
  },
  data() {
    return {
      activeRow: {},
      supplementRow: {},
      menuTypeObject: {
        menuType: "15003",
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
        updateFileCode: "M006_003_007",
        //删除code
        deleteCode: "M006_003_008",
        //停止上传code
        stopUploadingCode: "M006_003_009",
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
      params: {
        ids: "",
        finalType: 1,
        finalAmount: 0,
        status: 1000,
        activationStatus: 1,
        constructionUnit: "",
        isArchive: 0,
      },
      getList: api_queryProjectFinalTest,
      getNumber: api_getLibraryNumber, //弹框新增接口
      userInfo: store.getters.userInfo,
      loading: false,
      permissionCode: "M006_003",
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
            placeholder: "请输入项目名称",
            bind: "projectName",
          },
          {
            type: "select",
            placeholder: "请选择承建单位",
            bind: "contractUnitFullName",
            data: "contractUnitFullList",
            class: "selectWidthCustom",
          },
          {
            type: "select",
            placeholder: "请选择建设单位",
            bind: "constructUnitFullName",
            data: "constructUnitFullList",
            class: "selectWidthCustom",
          },
          /*    {
            type: "select",
            placeholder: "请选择项目类型",
            bind: "projectType",
            data: "projectTypeList",
            class: "selectWidthCustom",
          }, */
        ],
        enum: {
          contractUnitFullList: [],
          constructUnitFullList: [],
          projectTypeList: [],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M006_003_001",
          },
        ],
        formData: {
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
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
            width: "170",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M006_003_002",
          },
          emptyConfig: {
            // 表格数据为空时默认显示的内容
            display: true,
            emptyNull: "暂无终验",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M006_003_003",
              field: "status",
              value: [null],
            },
            // {
            //   name: "发起",
            //   method: "add",
            //   type: "text",
            //   size: "small",
            //   field: "status", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
            //   value: [1, 2, 3, 4, 6], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
            //   icon: "el-icon-document",
            //   className: "font-size-20",
            //   validate: this.btnValidate,
            // },
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              field: "status", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [null, 2, 3, 1000, 6], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate,
              code: "M006_003_001",
            },
            {
              name: "终验备案",
              method: "keepRecord",
              type: "text",
              size: "small", // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate,
              code: "M006_003_005",
            },
            {
              name: "终验备案查看",
              method: "keepRecordView",
              type: "text",
              size: "small", // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate,
              code: "M006_003_004",
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
      buNameList: {
        JSDW: "constructUnitFullList",
        CJDW: "contractUnitFullList",
      },
    };
  },
  created() {
    // if (this.userInfo.bizunitInfos[0].buid) {
    //   this.$set(this.params, "constructio", this.userInfo.bizunitInfos[0].buid);
    // }
  },
  mounted() {
    this.getTbHeader();
    this.getTbData(1);
    this.getProjectType();
    this.setSearchConfig();
    this.getAmount();
    // this.queryBizunitsByProperty("JSDW");
    this.queryBizunitsByProperty("CJDW");
    // 建设单位
    this.getQueryBizunitsByProperty();
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
    // 获取金额
    getAmount() {
      api_getAmount().then((res) => {
        if (res.msg.code == "0000") {
          this.$set(this.params, "finalAmount", res.data);
        }
      });
    },
    // 备案成功回调
    submitSuccess() {
      this.getTbData(1);
    },
    setSearchConfig() {
      let roleCode = this.userInfo.currentRole.roleCode;
      if (roleCode.indexOf("JSDW") != -1) {
        this.search.config = [
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName",
          },
          {
            type: "select",
            placeholder: "请选择承建单位",
            bind: "contractUnitFullName",
            data: "contractUnitFullList",
            class: "selectWidthCustom",
          },
          /*    {
            type: "select",
            placeholder: "请选择项目类型",
            bind: "projectType",
            data: "projectTypeList",
            class: "selectWidthCustom",
          }, */
        ];
      } else if (roleCode.indexOf("CJDW") != -1) {
        this.search.config = [
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName",
          },
          {
            type: "select",
            placeholder: "请选择建设单位",
            bind: "constructUnitFullName",
            data: "constructUnitFullList",
            class: "selectWidthCustom",
          },
          /*  {
            type: "select",
            placeholder: "请选择项目类型",
            bind: "projectType",
            data: "projectTypeList",
            class: "selectWidthCustom",
          }, */
        ];
      } else {
        this.search.config = [
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName",
          },
          {
            type: "select",
            placeholder: "请选择承建单位",
            bind: "contractUnitFullName",
            data: "contractUnitFullList",
            class: "selectWidthCustom",
          },
          {
            type: "select",
            placeholder: "请选择建设单位",
            bind: "constructUnitFullName",
            data: "constructUnitFullList",
            class: "selectWidthCustom",
          },
          /*    {
            type: "select",
            placeholder: "请选择项目类型",
            bind: "projectType",
            data: "projectTypeList",
            class: "selectWidthCustom",
          }, */
        ];
      }
    },
    btnValidate(item, row) {
      let flag = false;
      if (
        item.name == "编辑" &&
        this.$utils.checkCodeInArr(item.code) &&
        (row.status == 1 || row.status == 5)
      ) {
        flag = true;
      } else if (
        item.name == "终验备案" &&
        this.$utils.checkCodeInArr(item.code) &&
        row.status == 1000
      ) {
        flag = true;
      } else if (
        item.name == "终验备案查看" &&
        this.$utils.checkCodeInArr(item.code) &&
        row.status == 1001
      ) {
        flag = true;
      }
      if (
        item.name == "上传附件" &&
        (this.$utils.checkCodeInArr("M006_003_006") ||
          this.$utils.checkCodeInArr("M006_003_006"))
      ) {
        return true;
      }
      return flag;
    },
    see(item) {
      this.$router.push({
        name: "finalAcceptanceView",
        query: {
          projectId: item.projectId,
          id: item.id,
          processId: item.processId ? item.processId : "",
          templateId: item.templateId,
          bianji:true
        },
      });
    },
    //备案
    keepRecord(item) {
      this.$refs.keepRecordDialog.init(item);
    },
    keepRecordView(item) {
      this.$refs.keepRecordDialog.init(item);
    },
    workView(row) {
      let name = "";
      if (row.status == "3") {
        name = "finalAcceptanceAffirm";
      } else if (row.status == "2") {
        name = "finalAcceptanceSupervisor";
      } else if (row.status == "4") {
        name = "finalAcceptanceApproval";
      }
      this.$router.push({
        name: name,
        query: {
          id: row.id,
          projectId: row.projectId,
          processId: row.processId,
          templateId: row.templateId,
        },
      });
    },
    edit(item) {
      removeSession("finalAcceptanceAdd" + item.projectId);
      this.$router.push({
        name: "finalAcceptanceApplyFor",
        query: {
          projectId: item.projectId,
          id: item.id,
          processId: item.processId ? item.processId : "",
          templateId: item.templateId,
          bianji:true
        },
      });
    },
    //选择项目确定
    centerDialogSbmit(val) {
      if (val.id) {
        this.$router.push({
          name: "finalAcceptanceAdd",
          query: {
            projectId: val.id,
          },
        });
      }
    },
    async add(item) {
      let res = await api_queryIdList();
      if (res) {
        this.params.ids = res.data;
        this.$refs.SrDialogSelect.dialogVisible = true;
        this.$refs.SrDialogSelect.search();
      }
    },
    //导出
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectImpl/projectLastCheck/export?permissionCode=${
          this.permissionCode
        }&access_token=${sessionStorage.getItem("token")}&type=1`
      );
    },
    //获取指定单位
    queryBizunitsByProperty(buPropertyEnum) {
      queryBizunitsByProperty({ buPropertyEnum }).then((res) => {
        if (res.msg.code == "0000") {
          this.search.enum[this.buNameList[buPropertyEnum]] = res.data.map(
            (item) => {
              return {
                label: item.buName,
                value: item.buName,
              };
            }
          );
        }
      });
    },
    // 获取建设单位
    getQueryBizunitsByProperty() {
      queryBizunitsByProperties([
        { buPropertyEnum: "JSDW" },
        { buPropertyEnum: "TCDW" },
      ]).then((res) => {
        console.log("建设单位", res);
        if (res?.data) {
          this.search.enum.constructUnitFullList = res.data.map((item) => {
            return {
              label: item.buName,
              value: item.buName,
            };
          });
        }
      });
    },
    //获取项目类型
    getProjectType() {
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        if (res.msg.code == "0000") {
          let list = res.data.map((item) => {
            return {
              label: item.chName,
              value: item.itemCode,
            };
          });
          this.$set(this.search.enum, "projectTypeList", list);
        }
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: this.permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "applyTime") {
            item.sortable = "custom";
            item.width = "120px";
          }
          return item.isShow;
        });
      });
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: this.permissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData(1);
          this.getTbHeader();
        }
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
    getTbData(index) {
      if (index) {
        this.table.page.pageNum = index;
      }
      let params = {
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        type: 1,
        ...this.search.formData,
      };
      if (params.orderByColumn == "") {
        delete params.orderByColumn;
      }
      if (params.orderBy == "") {
        delete params.orderBy;
      }
      api_finalAcceptanceList(params).then((res) => {
        if (res.msg.code == "0000") {
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
                item.path = this.workView;
              }
            }
          });
          this.table.data = res.data.records;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.finalAcceptanceList {
  ::v-deep .SrSearch {
    .selectWidthCustom {
      width: 160px;
    }
  }
  ::v-deep .SrDialogSelect {
    .el-input--suffix {
      display: none;
    }
  }
  ::v-deep .SrSupplementBox {
    .el-dialog__footer {
      .dialog-footer {
        display: block;
      }
    }
  }
}
</style>
<style lang="scss">
.el-dialog .el-dialog__footer .dialog-footer .el-button:first-child {
  order: 0;
}
</style>
