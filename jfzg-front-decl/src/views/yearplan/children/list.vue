<template>
  <div class="yearPlanList">
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
import {
  getQueryList,
  deleteYearPlan,
  api_fileAway,
  S,
} from "@/api/yearPlan/index";
import upload from "@/utils/upload";
import { setSession, getSession, removeSession } from "@/core/session.js";
import config from "@/settings.js";
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
  data() {
    return {
      activeRow: {},
      supplementRow: {},
      menuTypeObject: {
        menuType: "4001",
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
        updateFileCode: "M004_M001_005",
        //删除code
        deleteCode: "M004_M001_006",
        //停止上传code
        stopUploadingCode: "M004_M001_007",
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
      userInfo: store.getters.userInfo,
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          // {
          //   type: "year",
          //   placeholder: "选择年份",
          //   bind: "year",
          //   showType: "year",
          //   format: "yyyy",
          // },
          {
            type: "text",
            placeholder: "请输入计划或编号",
            bind: "keyword",
          },
          {
            type: "select",
            placeholder: "请选择状态",
            bind: "status",
            data: "plan_typeList",
            className: "plan_type",
          },
        ],
        enum: {
          // 搜索项下拉数据
          plan_typeList: [
            {
              value: "1",
              label: "待提交",
            },
            {
              value: "2",
              label: "审批中",
            },
            {
              value: "3",
              label: "待发布",
            },
            {
              value: "1000",
              label: "已发布",
            },
            {
              value: "5",
              label: "审批驳回",
            },
          ],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M004_M001_001",
          },
          // { name: "导出", click: this.export, permissionCode: "M004_M001_002" },
        ],
        formData: {
          status: "",
          year: "",
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
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode:
              this.$route.name == "yearplanAudit"
                ? "M004_M001_002"
                : "M003_M001_001",
          },
          innerBtn: [
            {
              name: "查看",
              type: "text",
              size: "small",
              method: "see",
              // field: "id",
              // value: [1, 2],
              icon: "iconbianji",
              // code: "2334455",
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
              size: "small",
              field: "status",
              value: ["2", "3", "1000", "5"],
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.deleteValidate,
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

      isTableHeaderId: null,
    };
  },
  created() {
    console.log("userInfo", this.userInfo);
    // 年度计划查看
    if (this.$route.name == "yearplan") {
      this.search.config = [
        {
          type: "year",
          placeholder: "选择年份",
          bind: "year",
          showType: "year",
          format: "yyyy",
        },
        {
          type: "text",
          placeholder: "请输入计划或编号",
          bind: "keyword",
        },
      ];
      this.table.tableConfig.innerBtn = [
        {
          name: "查看",
          type: "text",
          size: "small",
          method: "see",
          // field: "id",
          // value: [1, 2],
          icon: "iconbianji",
          // code: "2334455",
        },
        {
          name: "上传附件", // 按钮名称，优先显示icon
          type: "text",
          size: "small",
          method: "supplement", // 点击执行该页面methods中对应的方法
          icon: "iconbianji", // 按钮显示的图标,不传显示中文
          validate: this.btnValidate,
        },
      ];
    }
    this.getTbHeader("M004_M001");
  },
  mounted() {
    this.getTbData();
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
    // 导出
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectDecl/yearPlan/export?permissionCode=M004_M001&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    // GHFZC_JBR
    btnValidate(item, row) {
      let flag = false;
      if (
        item.name == "编辑" &&
        this.userInfo.currentRole.roleCode == "GHFZC_JBR" &&
        this.userInfo.jfid === row.creator
      ) {
        flag = true;
      }
      console.log(
        item.name == "上传附件" &&
          (this.$utils.checkCodeInArr("M004_M001_004") ||
            this.$utils.checkCodeInArr("M004_M001_005") ||
            this.$utils.checkCodeInArr("M003_M001_003"))
      );
      if (
        item.name == "上传附件" &&
        (this.$utils.checkCodeInArr("M004_M001_004") ||
          this.$utils.checkCodeInArr("M004_M001_005") ||
          this.$utils.checkCodeInArr("M003_M001_003"))
      ) {
        return true;
      }
      return flag;
    },
    deleteValidate(item, row) {
      console.log("row", row.creator);
      let flag = false;
      if (item.name == "删除" && this.userInfo.jfid === row.creator) {
        flag = true;
      }
      return flag;
    },
    // 获取表格数据
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
      getQueryList(param).then((res) => {
        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        let { roleCode } = this.userInfo.currentRole;
        res.data.records.forEach((item) => {
          if (item.todo && this.$route.name == "yearplanAudit") {
            item.operationBtns = [];
            item.description &&
              JSON.parse(item.description).map((item1) => {
                if (
                  item1.operationBtns &&
                  item1.operationBtns[0].btnName == "发布"
                ) {
                  if (
                    roleCode == item1.role &&
                    this.userInfo.jfid == item.creator
                  ) {
                    item.operationBtns.push(item1.operationBtns[0]);
                  }
                } else {
                  if (roleCode == item1.role) {
                    item.operationBtns.push(item1.operationBtns[0]);
                  }
                }
              });
            item.path = this.Approve;
          }
          if (item.status === "1") {
            item.statusName = "待提交";
          } else if (item.status === "2") {
            item.statusName = "审批中";
          } else if (item.status === "3") {
            item.statusName = "待发布";
          } else if (item.status === "1000") {
            item.statusName = "已发布";
          } else if (item.status === "5") {
            item.statusName = "审批驳回";
          }
        });
        this.table.data = res.data.records;
      });
    },
    Fb() {
      alert("发布");
    },
    // 获取表头
    getTbHeader(permissionCode) {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "planYear") {
            item.sortable = 'custom';
          } else if (item.prop == "startTime" || item.prop == "endTime") {
            item.sortable = 'custom';
            item.width = "200px";
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
    add() {
      // removeSession("infoId_yearplanAuditAdd");
      this.$router.push({
        name: "yearplanAuditAdd",
      });
    },
    edit(row) {
      removeSession("infoId_yearplanAuditAdd");
      this.$router.push({
        name: "yearplanAuditEdit",
        query: { id: row.id, templateId: row.templateId ,
          processId: row.processId,
        },
      });
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将永久删除该数据, 是否继续?",
        okFun: () => {
          deleteYearPlan({
            id: row.id,
          }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("删除成功");
              this.getTbData(1);
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
    //     processId: row.processId,
    see(row) {
      this.$router.push({
        name: this.$route.name.includes("Audit")
          ? "yearplanAuditView"
          : "yearplanView",
        query: {
          id: row.id,
          templateId: row.templateId,
          processId: row.processId,
        },
      });
    },
    Approve(row) {
      this.$router.push({
        name: "yearplanAuditApprove",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
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
    // 设置表头
    saveHeaderList(data) {
      console.log("data", data);
      console.log("this.isTableHeaderId", this.isTableHeaderId);

      let permissionCode = "M004_M001";
      // if (this.$route.name == "yearplan") {
      //   permissionCode = "M002_004";
      // } else {
      //   permissionCode = "M002_005";
      // }
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: permissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          // if (this.$route.name == "yearplan") {
          this.getTbHeader("M004_M001");
          // } else {
          //   this.getTbHeader("M002_005");
          // }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
