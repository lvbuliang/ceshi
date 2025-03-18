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
      @selected="selected"
      :status="selectStatus"
      ref="selectTable"
      :extra-tooltip-labels="['项目编码', '需求部门']" 
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

<!--
  功能：功能描述
  汪振涛
  时间：2021年06月16日 15:34:49
  版本：v1.0
-->
<script>
import store from "@/store";
import { getProjectMaintainList } from "@/api/programManagement";
import { queryBizunitsByProperty } from "@/api/index.js";
import { api_getServiceTypeList } from "@/api/planProject/index";
import {
  api_userSetQuery,
  api_userSetSave,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";
import config from "@/settings.js";
import utils from "@/utils/index.js";
import { setSession, getSession, removeSession } from "@/core/session.js";
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
  props: {
    isSpanActive: String,
  },
  components: {
    // Table,
  },
  /* watch: {
    "search.formData.status": {
      handler(v) {
        console.log("search.formData.status", v);
        this.getTbData();
      },
    },
  }, */
  data() {
    return {
      supplementRow: {},
      activeRow: {},
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
        updateFileCode: "M002_003_007",
        //删除code
        deleteCode: "M002_003_008",
        //停止上传code
        stopUploadingCode: "M002_003_009",
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
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "keyword", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "请输入项目计划维护进度",
            // bind: "constructionUnit", // 对应this.search.data对象的field1
            bind: "status",
            class: "yearPlan",
            isHave: true, //支持下拉框输入
            data: "maintenance",
          },
        ],
        enum: {
          // 搜索项下拉数据
          maintenance: [], //申报单位
        },
        btns: [],
        formData: {
          status: "", //部门
          keyword: "", //关键字
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
        autoCompleteList: [],
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
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
          },
          innerBtn: [
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              // validate: this.btnValidate,
            },
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "维护计划", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "edit", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },

            // {
            //   name: "子项目",
            //   method: "addChildProject",
            //   type: "text",
            //   size: "small",
            //   icon: "el-icon-document",
            //   validate: this.btnValidate, //自定义判断是否展示按钮权限
            // },
            // {
            // 去掉成员管理页面
            // name: "成员管理", // 按钮名称，优先显示icon
            // type: "text",
            // size: "small",
            // method: "memberCatch", // 点击执行该页面methods中对应的方法
            // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
            // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
            // icon: "iconbianji", // 按钮显示的图标,不传显示中文
            // validate: this.btnValidate, //自定义判断是否展示按钮权限
            // permissionCode: "M003_M002_004",
            // },
            {
              name: "更新计划",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
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
    };
  },
  created() {},
  mounted() {
    this.getServerList();
    this.getTbData();
    this.getTbHeader();
  },
  methods: {
    getServerList() {
      let maintenance = []; //项目计划维护
      api_getServiceTypeList({ topic: "PROJECT_MAINTAIN_PLAN_STATUS" }).then(
        (res) => {
          res.data.map((item) => {
            maintenance.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.search.enum.maintenance.push(...maintenance);
        }
      );
    },
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
          uploadReportName: "上传附件",
          //列表数据
          dataList: [],
          uploadReportName: "上传附件",
          //实例id
          instanceId: fileInstance.file_currency,
        },
      ];
      this.$refs.supplementBox.init();
    },
    load(tree, treeNode, resolve) {
      let param = {
        pageNo: 1,
        pageSize: 9999,
        ...this.search.formData,
        isSubproject: 1,
        mainProjectId: tree.id,
      };
      api_queryList(param).then((res) => {
        if (res.msg.code == "0000") {
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          let list = res.data.records.map((item) => {
            // debugger;
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

            item.num = tree.num + "." + item.num;

            item.btns = [
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
            ];
            if (item.editable) {
              console.log("进来了");
              item.btns.push({
                name: "编辑",
                method: "edit",
                type: "text",
                size: "small",
                icon: "el-icon-document",
                className: "font-size-20",
              });
              // item.btns.push({
              //   name: "删除",
              //   method: "delete",
              //   type: "text",
              //   size: "medium",
              //   icon: "el-icon-document",
              //   className: "font-size-20",
              // });
            }
            if (
              item.memberStatus == 0 &&
              utils.checkCodeInArr("M002_003_004")
            ) {
              item.btns.push({
                name: "成员管理", // 按钮名称，优先显示icon
                type: "text",
                size: "small",
                method: "memberCatch", // 点击执行该页面methods中对应的方法
                // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
                // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
                icon: "iconbianji", // 按钮显示的图标,不传显示中文
              });
            }
            if (
              utils.checkCodeInArr("M002_003_006") ||
              utils.checkCodeInArr("M002_003_007")
            ) {
              item.btns.push({
                name: "上传附件", // 按钮名称，优先显示icon
                type: "text",
                size: "small",
                method: "supplement", // 点击执行该页面methods中对应的方法
                icon: "iconbianji", // 按钮显示的图标,不传显示中文
              });
            }
            if (item.operationBtns) {
              item.operationBtns.forEach((items) => {
                items.name = items.btnName;
              });
            }

            if (item.operationBtns) {
              // console.log('item.operationBtns.before',item.operationBtns)
              item.operationBtns = item.operationBtns.filter(
                (item) => item.name != ""
              );
              // console.log('item.operationBtns.after',item.operationBtns)
              item.btns = [...item.btns, ...item.operationBtns];
            }

            return item;
          });
          resolve(list);
        }
      });
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此项目, 是否继续?",
        okFun: () => {
          queryRemove({ id: row.id }).then((res) => {
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
    export() {
      // api_userSetExport({permissionCode:'M002_001',access_token:sessionStorage.getItem('token')}).then((res) => {
      // });
      window.open(
        `${
          config.baseUrl
        }/jfzg/planProject/project/export?permissionCode=M002_003&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    // 导出
    exprotByCondition() {
      let params = {
        buid: this.search.formData.buid,
        keyword: this.search.formData.keyword,
        node: this.spanaActive,
        orderBy: this.search.formData.orderBy,
        orderByColumn: this.search.formData.orderByColumn,
        pageSize: this.table.page.pageSize,
        pageNum: this.table.page.pageNum,
        status: this.search.formData.status,
        tags: this.search.formData.tags,
        yearPlanId: this.search.formData.yearPlanId,
      };
      exprotByCondition(params).then((res) => {
        console.log(res);
        // 创建a标签，并处理二进制数据
        const link = document.createElement("a");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        const pat = new RegExp("filename=([^;]+\\.[^\\.;]+)"); // 设置下载文件名称
        let contentDisposition;
        if (res.headers["content-disposition"])
          contentDisposition = res.headers["content-disposition"];
        if (res.headers["Content-Disposition"])
          contentDisposition = res.headers["Content-Disposition"];
        const result = pat.exec(contentDisposition);
        let fileName = result && result[1]; // 生成下载链接
        const URL = window.URL || window.webkitURL;
        console.log(blob, URL);
        link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
        fileName = "计划项目库导出数据";
        link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
        document.body.appendChild(link);
        link.click(); // 释放URL对象
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
    btnValidate(row, item) {
      let { buProperty } = this.userInfo.currentBizunit;
      let { roleCode } = this.userInfo.currentRole;
      // console.log("当前行", row, item);
      // 建设单位经办人有编辑的权限
      if (
        row.name == "维护计划" &&
        item.status == 1 &&
        (roleCode == "TCDW_CONSTRUCTOR" ||
          roleCode == "JSDW_CONSTRUCTOR" ||
          roleCode == "JSDW_CONSTRUCTOR_1")
      ) {
        return true;
      }
      if (
        row.name == "更新计划" &&
        item.status == 2 &&
        (roleCode == "TCDW_CONSTRUCTOR" ||
          roleCode == "JSDW_CONSTRUCTOR" ||
          roleCode == "JSDW_CONSTRUCTOR_1")
      ) {
        return true;
      }
      if (
        row.name == "删除" &&
        item.status == 1 &&
        item.creator == this.userInfo.jfid
      ) {
        return true;
      }

      if (
        row.name == "成员管理" &&
        item.memberStatus === 0 &&
        utils.checkCodeInArr("M002_003_004")
      ) {
        return true;
      }
      if (row.name == "子项目" && utils.checkCodeInArr("M002_003_001")) {
        return true;
      }
      if (
        row.name == "上传附件" &&
        (utils.checkCodeInArr("M002_003_006") ||
          utils.checkCodeInArr("M002_003_007"))
      ) {
        return true;
      }
      return false;
    },
    getBizunitsByProperty() {
      queryBizunitsByProperty({ buPropertyEnum: "JSDW" }).then((res) => {
        let list = [];
        if (res.success) {
          if (res.data && res.data.length > 0) {
            res.data.map((item) => {
              list.push({
                value: item.buName,
              });
            });
          }
          this.$set(this.search, "autoCompleteList", list);
        }
      });
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
      getProjectMaintainList(param).then((res) => {
        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        let { buProperty } = this.userInfo.currentBizunit;
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
              // 处理初审撤回
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  // console.log(item1);
                  if (roleCode == item1.role) {
                    // console.log("roleCode下的按钮", item1);
                    item1.operationBtns &&
                      item.operationBtns.push(item1.operationBtns[0]);
                  }
                });
              item.path = this.workView;

              console.log("按钮权限", item.operationBtns);
            }
          }
        });
        this.table.data = res.data.records;
        console.log(this.table.data);
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
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M002_019" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        console.log(headerData);
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "beginDate") {
            item.sortable = "custom";
            item.width = "110px";
          }
          if (item.prop == "totalInvestmentAmount") {
            item.sortable = "custom";
            item.width = "160px";
          }
          return item.isShow;
        });
      });
    },
    add() {
      api_getLibraryNumber().then((res) => {
        console.log(res);
        removeSession("infoId_planProjectAdd");
        this.$router.push({
          name: "planProjectAdd",
          query: {
            projectCode: res.data,
            timestamp: new Date().getTime(),
          },
        });
      });
    },
    edit(row) {
      this.$router.push({
        name: "programManagementEdit",
        query: {
          id: row.projectId,
          detailId: row.id,
          processId: row.processId,
          templateId: row.templateId,
          source: row.source,
          isSee: 0,
        },
      });
    },
    see(row) {
      this.$router.push({
        name: "programManagementView",
        query: {
          id: row.projectId,
          detailId: row.id,
          processId: row.processId,
          templateId: row.templateId,
          source: row.source,
          isSee: 1,
        },
      });
    },
    // 成员管理
    // memberCatch(row) {
    //   this.$router.push({
    //     name: "projectLibraryMemberView",
    //     query: {
    //       id: row.id,
    //       processId: row.processId,
    //       templateId: row.templateId,
    //     },
    //   });
    // },
    // 子项目
    // addChildProject(row) {
    //   this.$router.push({
    //     name: "projectLibraryAdd",
    //     query: {
    //       parentId: row.id,
    //     },
    //   });
    // },
    workView(row) {
      console.log("r", row);
      this.$router.push({
        name: "planProjectWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          spanaActive: this.spanaActive,
          // version: row.type == 1 ? row.version : "",
          type: row.type,
        },
      });
    },
    workView1(row, $event) {
      console.log(row, $event);
      if ($event.btnName == "审核") {
        this.$router.push({
          name: "planProjectWorkView",
          query: {
            id: row.id,
            processId: row.processId,
            templateId: row.templateId,
            flog: 2,
            spanaActive: this.spanaActive,
          },
        });
      } else {
        this.$router.push({
          name: "planProjectWorkView",
          query: {
            id: row.id,
            processId: row.processId,
            templateId: row.templateId,
            flog: 1,
            spanaActive: this.spanaActive,
          },
        });
      }
    },
    pageChanged(val) {
      console.log("页码改变");
      if (
        this.userInfo.currentBizunit.buProperty == 1 &&
        (this.spanaActive == 2 ||
          this.spanaActive == 3 ||
          this.spanaActive == 4 ||
          this.spanaActive == 5)
      ) {
        this.search.btns.splice(1, 1, {
          name: "批量分配",
          click: this.batchAllocation,
          type: "primary",
        });
      } else {
        this.search.btns.splice(1, 1);
      }

      this.table.tableConfig.selectionConfig.display = false;
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
        permissionCode: "M002_019",
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

<style lang="scss" scoped>
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
.statusTab {
  font-size: 15px;
  color: #919191;
  margin-bottom: 20px;
  span {
    display: inline-block;
    padding: 5px 28px;
    background-color: #f5f5f5;
    border-radius: 25px;
    margin-right: 10px;
    cursor: pointer;
  }
  span:not(:first-child) {
    margin-left: 10px;
  }
  // 节点高亮样式
  .spanActive {
    background-color: #5497f9;
    color: #fff;
  }
  // 最后一个icon不显示
  i:last-child {
    display: none;
  }
}
::v-deep .sr_search .yearPlan {
  width: 200px !important;
}
</style>
