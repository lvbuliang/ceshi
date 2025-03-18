<template>
  <div class="issue" v-if="$route.name == 'issue'">
    <SrSearch
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      :hideBtns="false"
      @queryList="pageChanged(1)"
    ></SrSearch>
    <!-- <div class="tips">
      <i class="base-iconfont icon icon-prompt-fill"></i>该项目截止目前，已建设5个月，共产生了150条风险，其中高度风险50条，已解决49条；中度风险50条，已解决50条；轻度风险50条，已解决50条
    </div>-->
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      @sortChange="sortChange"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'projectType'">
          <div>{{ projectTypeFun(scope.row.projectType) }}</div>
        </template>
        <template v-if="scope.item.prop == 'questionInfo'">
          <div class="rowImgDiv">
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/high.png" />
              {{ scope.row.heighQuestion * 1 }}
            </span>
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/middle.png" />
              {{ scope.row.middleQuestion * 1 }}
            </span>
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/low.png" />
              {{ scope.row.lowQuestion * 1 }}
            </span>
          </div>
        </template>
        <template v-if="scope.item.prop == 'riskInfo'">
          <div class="rowImgDiv">
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/high.png" />
              {{ scope.row.heighRisk * 1 }}
            </span>
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/middle.png" />
              {{ scope.row.middleRisk * 1 }}
            </span>
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/low.png" />
              {{ scope.row.lowRisk * 1 }}
            </span>
          </div>
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
  </div>
  <router-view v-else></router-view>
</template>
<script>
import store from "@/store";
import { permissionCode } from "./const.js";

import {
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
} from "@/api/index.js";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import { api_getProjectDispatchList } from "@/api/issue";
export default {
  data() {
    return {
      theNew: "",
      userInfo: store.getters.userInfo,
      getList: api_queryProjectNotInIds,
      params: {
        status: 1000, // 审批完成
        activationStatus: 1, // 非暂停的项目
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
            bind: "keyword", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "请选择项目类型",
            bind: "projectType",
            data: "projectList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          projectList: [],
        },
        btns: [
          {
            name: "新建风险",
            click: this.addRisk,
            type: "primary",
            permissionCode: "M007_M002_003",
          },
          {
            name: "新建问题",
            click: this.addTrouble,
            type: "primary",
            permissionCode: "M007_M002_007",
          },
        ],
        formData: {
          keyword: "",
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
              name: "风险管理", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "risk", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M007_M002_001", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            },
            {
              name: "问题管理", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "trouble", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M007_M002_002", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
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
    projectTypeFun(val) {
      let arr = this.search.enum.projectList;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    getListByTopicAndItem() {
      // 获取项目类型
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "projectList",
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

    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
      };
      const searchForms = this.search.formData;
      Object.keys(searchForms).map((item) => {
        if (this.$utils.isEmpty(searchForms[item])) {
          param[item] = searchForms[item];
        }
      });
      api_getProjectDispatchList(param).then((res) => {
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
        this.table.tableConfig.header = headerData.filter((item) => {
          if (
            item.prop == "questionInfo" ||
            item.prop == "riskInfo" ||
            item.prop == "beginDate"    ||
            item.prop == "endDate"
          ) {
            item.sortable = 'custom';
          }
          return item.isShow;
        });
        console.log( this.table.tableConfig.header);
      });
    },
    workView(val) {
      this.$router.push({
        name: "issueView",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    risk(val) {
      this.$router.push({
        name: "risk",
        query: {
          projectId: val.id,
        },
      });
    },
    trouble(val) {
      this.$router.push({
        name: "trouble",
        query: {
          projectId: val.id,
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
    addRisk() {
      this.theNew = "风险";
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    addTrouble() {
      this.theNew = "问题";
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    handleSelect(val) {
      if (val.id) {
        this.$router.push({
          name: `${this.theNew == "风险" ? "riskAdd" : "troubleAdd"}`,
          query: { projectId: val.id, routeName: this.$route.name },
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
.tips {
  margin-bottom: 8px;
  color: #999999;
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  .icon {
    color: #1890ff;
    margin-right: 5px;
  }
}
.issue {
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
  ::v-deep .rowImgDiv {
    display: flex;
    .colSpan {
      flex-grow: 1;
      .iconImg {
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
    }
  }
}
</style>
