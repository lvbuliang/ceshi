<template>
  <div class="total-page">
    <div class="searchPage">
      <SrSearch :search="search"
                :searchExpand="true"
                :showTextBtns="true"
                :hideBtns="false"
                @queryList="pageChanged(1)"></SrSearch>
    </div>
    <SrTable @pageChanged="pageChanged"
             :data="table.data"
             @sizeChanged="sizeChanged"
             :config="table.tableConfig"
             @sortChange="sortChange"
             :page="table.page">
      <template slot="cellSlot"
                slot-scope="scope">
        <p class="statusBox"
           v-if="scope.scope.item.prop == 'constructUnitFullName'">
          <span>{{ scope.scope.row.constructUnitFullName }}</span>
        </p>
        <p class="statusBox"
           v-if="scope.scope.item.prop == 'contractUnitFullName'">
          <span>{{ scope.scope.row.contractUnitFullName }}</span>
        </p>
      </template>
    </SrTable>
  </div>
</template>

<script>
import store from "@/store";
import {
  api_userSetQuery,
  api_userSetSave,
  api_userSetExport,
  queryBizunitsByProperties
} from "@/api/index.js";
import { permissionCode } from "../const.js";
import config from "@/settings.js";
import { api_deliverList } from "@/api/deliver/index";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { listByTopicAndItem } from "@/api/index.js";
import { getChengjianUnit } from "@/api/milestone/index";
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
    yearPlanId: {
      type: String,
      default: "",
    },
  },
  data () {
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
          },
          {
            type: "select",
            placeholder: "请选择承建单位",
            bind: "contractUnit",
            data: "contractUnitFullNameList", // 对应enum中的stateList
            disabled: false,
            unitName:'CJDW'
          },
          {
            type: "select",
            placeholder: "请选择监理单位",
            bind: "controlUnit",
            data: "controlUnitFullNameList", // 对应enum中的stateList
            disabled: false,
            unitName:'JLDW'
          },
          {
            type: "select",
            placeholder: "请选择建设单位",
            bind: "constructionUnit",
            data: "constructUnitFullNameList", // 对应enum中的stateList
            disabled: false,
            unitName:'JSDW'
          },
          // {
          //   type: "select",
          //   placeholder: "请选择项目类型",
          //   bind: "projectType",
          //   data: "projectTypeList", // 对应enum中的stateList
          //   disabled: false,
          // },
        ],
        enum: {
          contractUnitFullNameList: [],
          constructUnitFullNameList: [],
          controlUnitFullNameList: [],
          projectTypeList: [],
        },
        btns: [],
        formData: {
          controlUnit:'',
          projectName: "",
          contractUnit: "",
          constructionUnit: "",
          projectType: "",
        },
      },
    };
  },
  methods: {
    //根据当前登陆人单位设置搜索栏
    setSearchConfig () {
      if (this.userInfo && this.userInfo.currentRole.roleCode)
      {
        this.search.config = this.search.config.filter(item=>{
          return item.unitName != this.userInfo.currentRole.roleCode.split('_')[0]
        })
      }
    },
    // 获取单位
    getUnitFullLsit (buPropertyEnum) {
      if (!buPropertyEnum) return
      let data = {
        buPropertyEnum,
      };
      let listObj = {
        // 'JSDW': 'constructUnitFullNameList',
        'CJDW': 'contractUnitFullNameList',
        'JLDW': 'controlUnitFullNameList'
      }
      getChengjianUnit(data).then((res) => {
        console.log("单位list", res.data);
        let type_list = [];
        res.data.forEach((item) => {
          let emunObj = {};
          emunObj.label = item.buName;
          emunObj.value = item.buid;
          type_list.push(emunObj);
        });
        this.$set(this.search.enum, listObj[buPropertyEnum], type_list);
      });
    },
    // 获取建设单位
     getQueryBizunitsByProperty() {
      // 获取建设单位
      queryBizunitsByProperties([
        { buPropertyEnum: "JSDW" },
        { buPropertyEnum: "TCDW" },
      ]).then(res => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "constructUnitFullNameList",
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
    // 获取项目类型
    getListByTopicAndItem () {
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        if (res?.data)
        {
          this.$set(
            this.search.enum,
            "projectTypeList",
            this.$utils.enumsDataNameValue(
              res.data,
              "chName",
              "itemCode",
              "label",
              "value"
            )
          );
        }
      });
    },
    delete (row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          api_getlist_in_delete({ id: row.id }).then((res) => {
            if (res.msg.code == "0000")
            {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              if (this.table.data.length == 1)
              {
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
    btnValidate (row, item) {
      if (
        row.name == "编辑" &&
        item.editable &&
        this.$route.name == "planedProject"
      )
      {
        return true;
      }
      if (
        row.name == "删除" &&
        item.removeFlag &&
        this.$route.name == "planedProject"
      )
      {
        return true;
      }
      return false;
    },
    btnValidate2 (row, item) {
      if (this.ifHideAddBtn)
      {
        return false;
      }
      return true;
    },
    getTbHeader () {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "beginDate" ||item.prop == "deliveryUpdateTime") {
            item.sortable = 'custom';
          }
          return item.isShow
        });
      });
    },
    sortChange(column) {
      if (column.order === "ascending") {
        this.search.formData['orderByColumn'] = column.prop
        this.search.formData['orderBy'] = 'ASC'
      } else if (column.order === "descending") {
        this.search.formData['orderByColumn'] = column.prop
        this.search.formData['orderBy'] = 'DESC'
      } else {
        this.search.formData['orderByColumn'] = ''
        this.search.formData['orderBy'] = ''
      }
      this.getTbData()
    },
    export () {
      window.open(
        `${config.baseUrl
        }/jfzg/projectDecl/api/plan/wthin/projectDeclare/export?permissionCode=${permissionCode}&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    //页数发生改变
    pageChanged (val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged (val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    getTbData () {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      this.loading = true;
      api_deliverList(param).then((res) => {
        if (res)
        {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          res.data.records.forEach((item, index) => {
            item.num = index + 1;
            if (item.todo)
            {
              item.operationBtns = [];
              //按钮筛选  以assignee优先roleCode
              if (item.assignee == jfid)
              {
                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    if (item1.operationBtns && item1.role == "assignee")
                    {
                      item.operationBtns.push(item1.operationBtns[0]);
                    }
                  });
                item.path = this.workView;
              } else
              {
                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    if (roleCode == item1.role)
                    {
                      if (item1.operationBtns)
                      {
                        item.operationBtns.push(item1.operationBtns[0]);
                      }
                    }
                  });
                item.path = this.workView;
              }
            }
          });
          this.table.data = res.data.records;
        } else
        {
          this.table.data = [];
        }

        this.loading = false;
      });
    },
    settingHeader () {
      this.dialogVisible = true;
    },
    saveHeaderList (data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: permissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000")
        {
          this.getUnitFullLsit('JLDW');
          this.getUnitFullLsit('CJDW');
          this.getUnitFullLsit('JSDW');
          this.getListByTopicAndItem();
          this.getTbData();
          this.getTbHeader();
          this.setSearchConfig()
        }
      });
    },
    add () {
      this.$router.push({
        name: "bianzhiInitiateDetail",
        query: {
          som: "show",
        },
      });
    },
    handleSelect (val) {
      removeSession("infoId_planedProject" + val.id);
      this.$router.push({
        name: "planedProjectAdd",
        query: { projectId: val.id },
      });
    },
    edit (row) {
      this.$router.push({
        name: "planedProjectEdit",
        query: { id: row.id, templateId: row.templateId },
      });
    },
    workView (row) {
      this.$router.push({
        name:
          this.$route.name == "planedProject"
            ? "planedProjectWorkView"
            : "planedProjectAuditWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
        },
      });
    },
    see (row) {
      console.log(row);
      this.$router.push({
        name: "deliverTaskView",
        query: {
          projectId: row.id,
        },
      });
    },
  },
  created () {
    this.getUnitFullLsit('JLDW');
    this.getUnitFullLsit('CJDW');
    // this.getUnitFullLsit('JSDW');
    this.getListByTopicAndItem();
    this.getTbData();
    this.getTbHeader();
    this.setSearchConfig()
    this.getQueryBizunitsByProperty()
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
  ::v-deep .default_select {
    width: 160px;
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
