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
  </div>
</template>

<script>
import store from "@/store";
import {
  api_userSetQuery,
  api_userSetSave,
  api_userSetExport,
  listByTopicAndItem,
  queryBizunitsByProperty,
  queryBizunitsByProperties,
} from "@/api/index.js";
import { permissionCode } from "../const.js";
import config from "@/settings.js";
import {
  technicalProposalListAjax,
  submitChehui,
  api_getLibraryNumber,
} from "@/api/bianzhi/index";
import { setSession, getSession, removeSession } from "@/core/session.js";
// import {userConfig} from "/userCofig/userCofig.js";
export default {
  //组件注册
  // components: {
  //   SrTbale
  // },
  props: {
    ifHideAddBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sortDtos: [],
      params: {
        // planType: 0, // 0 无 1、专项规划 2、总体规划
        status: 4,
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
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编制", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "bianzhiInitiateDetail", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "view", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              // validate: this.btnValidate,
            },
            {
              name: "撤回",
              method: "back",
              type: "text",

              validate: this.btnValidate,
            },
            {
              // 去掉成员管理页面
              name: "成员管理", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "memberCatch", // 点击执行该页面methods中对应的方法
              field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate, //自定义判断是否展示按钮权限
              // permissionCode: "M003_M002_004",
            },
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "edit", // 点击执行该页面methods中对应的方法
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
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
            disabled: false,
            class: "selectWidthinput",
          },
          {
            type: "select",
            placeholder: "请选择建设单位",
            bind: "constructionUnit",
            data: "jsdwList", // 对应enum中的stateList
            class: "selectWidthinput1",
            disabled: false,
          },
          {
            type: "select",
            placeholder: "请输入承建单位",
            bind: "contractUnit",
            data: "cjdwList", // 对应enum中的stateList
            class: "selectWidthinput",
            disabled: false,
          },
          {
            type: "select",
            placeholder: "审核状态",
            bind: "auditStatus", // 对应this.search.data对象的field1
            disabled: false,
            class: "selectWidth",
            data: "auditStatusList", // 对应enum中的stateList
          },
          // {
          //   type: "select",
          //   placeholder: "项目类型",
          //   bind: "projectType", // 对应this.search.data对象的field1
          //   disabled: false,
          //   class: "selectWidth",
          //   data: "projectTypeList", // 对应enum中的stateList
          // },
        ],
        enum: {
          auditStatusList: [],
          projectTypeList: [],
          jsdwList: [],
          cjdwList: [],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M005_002_003",
          },
          // { name: "导出", click: this.export, permissionCode: "M002_003_002" },
          // { name: "批量导入", click: this.bulkImport, permissionCode: "M002_003_003" },
        ],

        formData: {
          projectName: "", //项目名
          constructionUnit: "", //建设单位
          contractUnit: "", //承建单位
          auditStatus: "", //审核状态
          projectType: "", //项目类型
        },
      },
    };
  },
  methods: {
    sortChange(column) {
      // debugger;
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
    getQueryBizunitsByProperty() {
      // 获取建设单位
      queryBizunitsByProperties([
        { buPropertyEnum: "JSDW" },
        { buPropertyEnum: "TCDW" },
      ]).then((res) => {
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
      queryBizunitsByProperty({ buPropertyEnum: "CJDW" }).then((res) => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "cjdwList",
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
    //撤回
    back(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "确认撤回该实施方案的编制？",
        content: "当前实施方案编制撤回后，您可以继续重新提交该实施方案",
        okFun: () => {
          submitChehui({ projectId: row.projectId }).then((res) => {
            if (res.msg.code != "0000") return;
            this.getTbData();
            this.$message({
              type: "success",
              message: "撤回成功",
            });
          });
        },
        cancelFun: () => {},
      });
    },
    getDict() {
      listByTopicAndItem({ topic: "JFZG_SSZ_XMFADJ" }).then((res) => {
        var XMFADJ = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.chName;
          emunObj.dataValue = item.itemCode;
          emunObj.label = item.chName;
          emunObj.value = item.itemCode;
          return emunObj;
        });
        this.$set(this.search.enum, "auditStatusList", XMFADJ);
      });
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        var XMLX = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.chName;
          emunObj.dataValue = item.itemCode;
          emunObj.label = item.chName;
          emunObj.value = item.itemCode;
          return emunObj;
        });
        this.$set(this.search.enum, "projectTypeList", XMLX);
      });
    },
    btnValidate(row, item) {
      if (row.name == "编制" && item.editable) {
        return true;
      }
      if (row.name == "提审" && item.auditStatus == 1000) {
        return true;
      }
      // if (row.name == "查看" && item.auditStatus != 2) {
      //   return true;
      // }
      if (row.name == "撤回" && item.revocation) {
        return true;
      }
      if (
        row.name == "成员管理" &&
        item.constructionUnit == this.userInfo.currentBizunit.buid &&
        item.contractor == null
        // item.contractUnitFullName == null
      ) {
        return true;
      }
      if (
        row.name == "编辑" &&
        item.constructionUnit == this.userInfo.currentBizunit.buid &&
        item.source == 1
      ) {
        return true;
      }
      return false;
    },

    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "submitTime") {
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
        page: this.table.page.pageNum,
        size: this.table.page.pageSize,
        ...this.search.formData,
      };
      // if (this.sortDtos.length > 0) {
      //   param.sortDtos = this.sortDtos;
      // }
      technicalProposalListAjax(param).then((res) => {
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
    // 新增
    add() {
      api_getLibraryNumber().then((res) => {
        console.log(res);
        removeSession("infoId_projectLibraryAdd");

        this.$router.push({
          name: "bianzhiInitiateAdd",
          query: { projectCode: res.data },
        });
      });
    },
    // 成员管理
    memberCatch(row) {
      this.$router.push({
        name: "bianzhiInitiateMemberSee",
        query: {
          id: row.projectId,
          active: 1,
          // processId: row.processId,
          // templateId: row.templateId,
        },
      });
    },
    // 编制
    bianzhiInitiateDetail(row) {
      this.$router.push({
        name: "bianzhiInitiateDetail",
        query: {
          id: row.projectId,
          processId: row.processId,
        },
      });
    },
    // 查看
    view(row) {
      this.$router.push({
        name: "bianzhiInitiateSee",
        query: {
          id: row.projectId,
          processId: row.processId,
          active: 2,
        },
      });
    },

    workView(row) {
      this.$router.push({
        name: "bianzhiInitiateWorkview",
        query: {
          id: row.projectId,
          processId: row.processId,
        },
      });
    },

    edit(row) {
      // removeSession("infoId_projectLibraryAdd");
      this.$router.push({
        name: "bianzhiInitiateEdit",
        query: {
          id: row.projectId,
          templateId: row.templateId,
          processId: row.processId,
        },
      });
    },
  },
  created() {
    // 处理建设单位只要数据处可以在实施管理新增
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (
      userInfo.currentBizunit.buName != "数据管理处" &&
      userInfo.currentBizunit.buName != "政务数据管理处（申报）" &&
      userInfo.currentBizunit.buid != "7245"
    ) {
      this.search.btns = [];
    }
    // this.getTbData();
    // if (userConfig.indexOf(userInfo.currentBizunit.buName) != -1) {
    //   this.search.btns = [];
    // }
    this.getTbHeader();
    this.getTbData();
    this.getDict();
    this.getQueryBizunitsByProperty();
  },
  mounted() {
    // 非统筹单位不能看见选择建设单位下拉框
    let obj = document.querySelector(
      ".search-config .el-form-item:nth-child(2)"
    );
    console.log(obj);
    if (this.userInfo.currentBizunit.buProperty == "2") {
      obj.style.display = "none";
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
::v-deep .selectWidthinput {
  width: 170px;
}
::v-deep .selectWidthinput1 {
  width: 170px;
}
::v-deep .selectWidth {
  width: 120px;
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
