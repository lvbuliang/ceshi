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
import {
  api_queryList,
  queryRemove,
  api_fileAway,
  api_getLibraryNumber,
} from "@/api/planProject";
import { queryBizunitsByProperty } from "@/api/index.js";
import {
  api_userSetQuery,
  api_userSetSave,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";
import { get_year_plan } from "@/api/shenbao/index";
import { queryListByYearPlanId } from '@/api/yearPlan/index'
import config from "@/settings.js";
import utils from "@/utils/index.js";
import { setSession, getSession, removeSession } from "@/core/session.js";
// import Table from "@/components/table";
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
    ifHideAddBtn: {
      type: Boolean,
      default: false,
    },
    yearPlanId: {
      type: String,
      default: "",
    },
  },
  components: {
    // Table,
  },
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
            type: "select",
            placeholder: "请选择年度计划",
            bind: "yearPlanId",
            data: "yearList", // 对应enum中的stateList
            class: "getyearclass",
            disabled: false,
          },
          // {
          //   type: "select",
          //   placeholder: "选择状态",
          //   bind: "status",
          //   data: "plan_typeList", // 对应enum中的stateList
          //   className: "plan_type",
          // },
          {
            type: "year",
            placeholder: "选择年份",
            bind: "beginYear",
            showType: "year",
            format: "yyyy",
          },

          {
            type: "text",
            placeholder: "请输入项目名称或编码",
            bind: "keyword", // 对应this.search.data对象的field1
          },
        ],
        enum: {
          yearList: [],
          // 搜索项下拉数据
          plan_typeList: [
            {
              value: "1",
              label: "未提交",
            },
            {
              value: "2", //初审征求意见中
              label: "待审核",
            },
            {
              value: "3", //初审征求意见中
              label: "审核驳回",
            },
            {
              value: "1000", //初审退回修改
              label: "已入库",
            },
          ],
        },
        btns: this.ifHideAddBtn
          ? []
          : [
              {
                name: "新增",
                click: this.add,
                type: "primary",
                permissionCode: "M015_M003_M001",
              },
              // { name: "导出", click: this.export, permissionCode: "M002_003_002" },
              // { name: "批量导入", click: this.bulkImport, permissionCode: "M002_003_003" },
            ],
        formData: {
          status: "",
          condition: "",
          beginYear: "",
          keyword: "",
          planType: "",
          createBuName: "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
          yearPlanId: this.yearPlanId ? Number(this.yearPlanId) : "",
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
            width: "70",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M002_003_002",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
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
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            // {
            //   name: "删除",
            //   method: "delete",
            //   type: "text",
            //   size: "medium",
            //   icon: "el-icon-document",
            //   className: "font-size-20",
            //   validate: this.btnValidate, //自定义判断是否展示按钮权限
            // },
            // {
            //   name: "上传附件", // 按钮名称，优先显示icon
            //   type: "text",
            //   size: "small",
            //   method: "supplement", // 点击执行该页面methods中对应的方法
            //   icon: "iconbianji", // 按钮显示的图标,不传显示中文
            //   validate: this.btnValidate,
            // },
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
  created() {
    if (this.yearPlanId) {
      this.$set(this.search.config[0], "disabled", true);
    }
    console.log(this.yearPlanId);
  },
  mounted() {
    console.log(this.userInfo);
    // 没有保存功能了
    // if (this.userInfo.currentBizunit.buProperty == 1) {
    //   console.log(this.search.enum.plan_typeList);
    //   this.search.enum.plan_typeList = this.search.enum.plan_typeList.slice(
    //     1,
    //     this.search.enum.plan_typeList.length
    //   );
    // }
    if (
      this.userInfo &&
      this.userInfo.currentBizunit &&
      this.userInfo.currentBizunit.buProperty == 2
    ) {
      // 建设单位角色登录没有建设单位的过滤条件
    } else {
      // 获取建设单位列表
      // this.getBizunitsByProperty()
      // this.search.config.push({
      //   type: "autoComplete",
      //   placeholder: "请输入建设单位名称",
      //   bind: "createBuName",
      // })
    }
    this.getTbData();
    this.getTbHeader();
    this.getYear();
  },
  methods: {
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
        console.log(res)
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
    btnValidate(row, item) {
      if (
        row.name == "编辑" &&
        (item.status == 3 || item.status == 1) &&
        item.createBuid == this.userInfo.currentBizunit.buid
      ) {
        return true;
      }
      if (row.name == "删除" && item.editable) {
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
      // isSubproject: 0,
      let param = {
        page: this.table.page.pageNum,
        size: this.table.page.pageSize,
        yearPlanId:this.yearPlanId,
        ...this.search.formData,
      };
      if (param.orderByColumn == "") {
        delete param.orderByColumn;
      }
      if (param.orderBy == "") {
        delete param.orderBy;
      }
      queryListByYearPlanId(param).then((res) => {
        console.log(res)
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
              // 处理初审撤回
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  console.log(item1);
                  if (roleCode == item1.role) {
                    if (item1.operationBtns) {
                      if (
                        item1.operationBtns[0].btnName == "撤回" &&
                        this.userInfo.currentBizunit.buid == item.createBuid
                      ) {
                        item.operationBtns.push(item1.operationBtns[0]);
                      } else if (item1.operationBtns[0].btnName != "撤回") {
                        item.operationBtns.push(item1.operationBtns[0]);
                      }
                    }
                  }
                });
              if (
                item.operationBtns.length > 1 &&
                item.operationBtns[1].btnName == "撤回"
              ) {
                item.path = this.workView1;
              } else {
                item.path = this.workView;
              }
            }
            console.log(item.operationBtns);
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
      api_userSetQuery({ permissionCode: "M004_M002" }).then((res) => {
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
          query: { projectCode: res.data },
        });
      });
    },
    edit(row) {
      this.$router.push({
        name: "planProjectEdit",
        query: { id: row.id, templateId: row.templateId },
      });
    },
    see(row) {
      this.$router.push({
        name: "planProjectView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
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
      this.$router.push({
        name: "planProjectWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
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
          },
        });
      }
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
        permissionCode: "M004_M002",
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
.searchPage {
  ::v-deep .getyearclass {
    width: 240px !important;
  }
}
::v-deep .el-input--mini .el-input__inner{
  height: 27px;
  line-height: 27px;
}
</style>
