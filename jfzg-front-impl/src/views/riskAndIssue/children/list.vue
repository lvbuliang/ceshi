<template>
  <div class="issue">
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
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'problemCountDesc'">
          <div class="rowImgDiv">
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/high.png" />
              {{
                scope.row.problemCount
                  ? scope.row.problemCount.heightLevelCount * 1
                  : null
              }}
            </span>
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/middle.png" />
              {{
                scope.row.problemCount
                  ? scope.row.problemCount.moderateLevelCount * 1
                  : null
              }}
            </span>
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/low.png" />
              {{
                scope.row.problemCount
                  ? scope.row.problemCount.lightLevelCount * 1
                  : null
              }}
            </span>
          </div>
        </template>
        <template v-if="scope.item.prop == 'riskCountDesc'">
          <div class="rowImgDiv">
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/high.png" />
              {{
                scope.row.riskCount
                  ? scope.row.riskCount.heightLevelCount * 1
                  : null
              }}
            </span>
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/middle.png" />
              {{
                scope.row.riskCount
                  ? scope.row.riskCount.moderateLevelCount * 1
                  : null
              }}
            </span>
            <span class="colSpan">
              <img class="iconImg" src="@/assets/riskTrouble/low.png" />
              {{
                scope.row.riskCount
                  ? scope.row.riskCount.lightLevelCount * 1
                  : null
              }}
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
      :getNumber="getNumber"
    ></SrDialogSelect>
  </div>
</template>
<script>
import store from "@/store";
import { permissionCode } from "./const.js";

import {
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
  queryBizunitsByProperty,
  queryBizunitsByProperties,
} from "@/api/index.js";
import {
  api_queryProjectNotInIds,
  api_getLibraryNumber,
} from "@/api/projectLibrary";
import { api_project_list } from "@/api/riskAndIssue";
export default {
  data() {
    return {
      theNew: "",
      userInfo: store.getters.userInfo,
      getList: api_queryProjectNotInIds,
      getNumber: api_getLibraryNumber, //弹框新增接口
      params: {
        status: 1000, // 审批完成
        activationStatus: 1, // 非暂停的项目
        isArchive: 0,
        // isXMBA: 1, //查询新增项目
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
            bind: "projectName", // 对应this.search.data对象的field1
          },
          // {
          //   type: "select",
          //   placeholder: "请选择项目类型",
          //   bind: "projectType",
          //   data: "projectList", // 对应enum中的stateList
          //   class: "selectWidthCustom",
          // },
          {
            type: "select",
            placeholder: "请选择建设单位",
            bind: "unitId",
            data: "jsdwList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          projectList: [],
          jsdwList: [],
        },
        btns: [
          {
            name: "新建风险",
            click: this.addRisk,
            type: "primary",
            permissionCode: "M005_003_002_003",
          },
          {
            name: "新建问题",
            click: this.addTrouble,
            type: "primary",
            permissionCode: "M005_003_002_007",
          },
        ],
        formData: {
          projectName: "",
          projectType: "",
          unitId: "",
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
              method: "everydayrisk", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M005_003_002_001", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            },
            {
              name: "问题管理", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "everydaytrouble", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M005_003_002_002", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
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

  created() {
    // if (this.userInfo.bizunitInfos[0].buid) {
    //   this.$set(
    //     this.params,
    //     "contractUnit",
    //     this.userInfo.bizunitInfos[0].buid
    //   );
    // }
    this.init();
  },
  methods: {
    init() {
      this.getTbHeader();
      this.getTbData();
      this.getListByTopicAndItem();
      this.getQueryBizunitsByProperty();
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
        pageNo: this.table.page.pageNo,
        pageSize: this.table.page.pageSize,
      };
      const searchForms = this.search.formData;
      Object.keys(searchForms).map((item) => {
        if (this.$utils.isEmpty(searchForms[item])) {
          param[item] = searchForms[item];
        }
      });
      api_project_list(param).then((res) => {
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
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (
            item.prop == "beginDate" ||
            item.prop == "endDate" ||
            item.prop == "problemCountDesc" ||
            item.prop == "riskCountDesc"
          ) {
            item.sortable = "custom";
          }
          return item.isShow;
        });
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
    everydayrisk(val) {
      this.$router.push({
        name: "everydayrisk",
        query: {
          // id: val.id,
          projectId: val.projectId,
          // templateId: val.templateId,
          // processId: val.processId,
        },
      });
    },
    everydaytrouble(val) {
      this.$router.push({
        name: "everydaytrouble",
        query: {
          // id: val.id,
          projectId: val.projectId,
          // templateId: val.templateId,
          // processId: val.processId,
        },
      });
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
    addRisk() {
      let { buName, buid } = this.userInfo?.bizunitInfos[0];
      this.theNew = "风险";
      // if (buName == "承建单位") {
      //   this.params.contractUnit = buid;
      // } else if (buName == "建设单位") {
      //   this.params.constructionUnit = buid;
      // }

      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    addTrouble() {
      let { buName, buid } = this.userInfo?.bizunitInfos[0];
      this.theNew = "问题";
      // if (buName == "承建单位") {
      //   this.params.contractUnit = buid;
      // } else if (buName == "建设单位") {
      //   this.params.constructionUnit = buid;
      // }
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    handleSelect(val) {
      if (val.id) {
        this.$router.push({
          name: `${
            this.theNew == "风险" ? "everydayriskAdd" : "everydaytroubleAdd"
          }`,
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
          this.init();
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
.issue {
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
  ::v-deep .rowImgDiv {
    display: flex;
    justify-content: center;
    .colSpan {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconImg {
        width: 14px;
        height: 14px;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
  }
}
</style>
