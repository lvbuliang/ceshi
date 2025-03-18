<template>
  <div class="submit" v-if="$route.name == 'submit'">
    <SrSearch
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      :hideBtns="false"
      @queryList="pageChanged(1)"
    ></SrSearch>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sortChange="sortChange"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'projectStatus'">
          <div>{{ statusFun(scope.row.projectStatus) }}</div>
        </template>
      </template>
    </SrTable>
    <SrDialogSelect
      class="SrDialogSelect"
      ref="SrDialogSelect"
      :getList="getList"
      :params="params"
      :footerFlag="false"
      @select="handleSelect"
    ></SrDialogSelect>
    <DialogTable
      class="DialogTable"
      ref="DialogTable"
      :dialogTitle="dialogTitle"
      :getList="dialogGetList"
      :params="dialogParams"
      :header="dialogHeader"
      :innerBtn="dialogInnerBtn"
    >
      <template slot="cellSlot" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'projectStatus'">
          <div>{{ statusFun(scope.row.projectStatus) }}</div>
        </template>
      </template>
    </DialogTable>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import store from "@/store";
import { permissionCode } from "./const.js";
import DialogTable from "../components/dialogTable.vue";
import {
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
  queryBizunitsByProperty,
  queryBizunitsByProperties,
} from "@/api/index.js";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";

import {
  api_projectList,
  api_getProjectRPListById,
  api_saveBuriedPoint,
} from "@/api/submit";

export default {
  components: { DialogTable },
  data() {
    return {
      userInfo: store.getters.userInfo,
      dwList: ["YYJSC_FZR", "YYJSC_JBR", "JSDW_JBR", "JSDW_FZR"],
      dialogHeader: [
        {
          label: "周/月报名称",
          prop: "reportName",
        },
        {
          label: "项目状态",
          prop: "projectStatus",
          cellSlot: true,
        },
        {
          label: "项目阶段",
          prop: "projectStageName",
        },
        {
          label: "累计付款金额（万元）",
          width: "170px",
          prop: "projectCumulativePayment",
        },
      ],
      dialogInnerBtn: [
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
      dialogGetList: api_getProjectRPListById,
      dialogParams: { projectId: "", pageNo: 1, pageSize: 10 },
      getList: api_queryProjectNotInIds,
      dialogTitle: "",
      params: {
        status: 1000, // 审批完成
        activationStatus: 1, // 非暂停的项目
        isXMBA: 1, //查询新增项目
        // isSubproject: 0, // 是否是子项目 1 是 0 不是
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
            placeholder: "请输入项目关键字",
            bind: "projectStr", // 对应this.search.data对象的field1
          },
          // {
          //   type: "select",
          //   placeholder: "请选择项目类型",
          //   bind: "projectType",
          //   data: "projectList", // 对应enum中的stateList
          //   class: "selectWidthCustom",
          // },
        ],
        enum: {
          // 搜索项下拉数据
          projectList: [],
          jsdwList: [],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            // permissionCode: "M007_M001_M001_001",
            permissionCode: "M005_M006_M001",
          },
          // { name: "导出", click: this.export, permissionCode: "M003_M004_002" },
        ],
        formData: {
          projectStr: "",
          projectType: "",
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
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "seeDialog", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              // code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            },
            {
              name: "新建",
              method: "add2",
              type: "text",
              size: "small",
              // field: "status",
              // value: ["2", "3", "4"],
              icon: "el-icon-document",
              className: "font-size-20",
              // code: "M007_M001_M001_001",
              code: "M005_M006_M001",
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
          pageNo: 1, //当前页
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
    let { roleCode } = this.userInfo?.currentRole;

    if (!this.dwList.includes(roleCode)) {
      // 非建设单位
      this.search.config.push({
        type: "select",
        placeholder: "请选择建设单位",
        bind: "constructionUnit",
        data: "jsdwList", // 对应enum中的stateList
        class: "selectWidthCustom",
      });

      this.getQueryBizunitsByProperty();
    }
    this.getTbHeader();
    this.getTbData();
    this.getListByTopicAndItem();
  },
  methods: {
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
      // this.table.page.pageNum = 1;
      this.getTbData();
    },
    btnValidate(row, item) {
      if (row.name == "新建" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }
    },
    statusFun(val) {
      let arr = [
        { label: "正常", value: 1 },
        { label: "暂停", value: 2 },
        { label: "取消", value: 3 },
      ];
      return arr.find((item) => item["value"] == val)?.label;
    },
    getListByTopicAndItem() {
      // 获取项目类型
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        console.log(111111111111, res);
        if (res?.data) {
          this.$set(
            this.search.enum,
            "projectList",
            this.$utils.enumsDataNameValue(
              res.data,
              "chName",
              "chName",
              "label",
              "value"
            )
          );
        }
      });
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
              "buName",
              "label",
              "value"
            )
          );
        }
      });
    },
    getTbData() {
      let param = {
        pageNo: this.table.page.pageNo,
        pageSize: this.table.page.pageSize,
      };
      const searchForms = this.search.formData;
      Object.keys(searchForms).map((item) => {
        if (this.$utils.isEmpty(searchForms[item])) {
          param[item] = searchForms[item];
        }
      });
      console.log(param);
      api_projectList(param).then((res) => {
        if (!res?.data?.records) return;

        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        let { roleCode } = this.userInfo?.currentRole;
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
    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        //合同金额（万元）contractAmount 报送次数 number 最后报送时间 lastTime
        this.table.tableConfig.header = headerData.filter((item) => {
          if (
            item.prop == "contractAmount" ||
            item.prop == "number" ||
            item.prop == "lastTime"
          ) {
            item.sortable = "custom";
          }
          return item.isShow;
        });
      });
    },
    workView(val) {
      this.$router.push({
        name: "submitView",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    see(val) {
      let params = {
        clientType: 1,
        id: val.id,
      };
      api_saveBuriedPoint(params).then((res) => {
        console.log(res);
        this.$router.push({
          name: "submitView",
          query: {
            id: val.id,
            projectId: val.projectId,
            templateId: val.templateId,
            processId: val.processId,
          },
        });
      });
    },
    seeDialog(val) {
      this.dialogTitle = val.projectName + "项目周月报列表";
      this.$refs.DialogTable.dialogVisible = true;
      this.dialogParams.projectId = val.projectId;
      this.$refs.DialogTable.search();
    },
    pageChanged(val) {
      this.table.page.pageNo = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNo = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    add() {
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    add2(val) {
      console.log(val);
      if (val.projectId) {
        this.$router.push({
          name: "submitAdd",
          query: { projectId: val.projectId },
        });
      }
    },
    handleSelect(val) {
      if (val.id) {
        this.$router.push({
          name: "submitAdd",
          query: { projectId: val.id },
        });
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
          this.getQueryBizunitsByProperty();
          this.getListByTopicAndItem();
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
.submit {
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
}
</style>
