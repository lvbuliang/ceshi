<template>
  <div class="risk" v-if="$route.name == 'risk'">
    <navBox class="navBox" />
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
      :config="table.tableConfig"
      @sortChange="sortChange"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'riskBasis'">
          <div>{{ riskBasisFun(scope.row.riskBasis) }}</div>
        </template>
        <template v-if="scope.item.prop == 'riskType'">
          <div>{{ typeFun(scope.row.riskType) }}</div>
        </template>
        <template v-if="scope.item.prop == 'riskLevel'">
          <div>
            <img class="iconImg" :src="levelImgFun(scope.row.riskLevel)" alt />
            {{ levelFun(scope.row.riskLevel) }}
          </div>
        </template>
      </template>
      <!-- <div slot="leftBottomSlot" class="back-btn" @click="backToList">
        <i class="base-iconfont icon-return1"></i>
        <span>返回列表</span>
      </div> -->
    </SrTable>
    <BottomBtns @onBackClick="backToList"></BottomBtns>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import store from "@/store";
import { permissionCode, TYPELIST, BASISLIST } from "./const.js";
import {
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
} from "@/api/index.js";
import BottomBtns from "@/components/BottomBtns.vue";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import { api_getRiskList } from "@/api/issue";
import navBox from "@/components/navBox.vue";
export default {
  components: {
    navBox,
    BottomBtns,
  },
  data() {
    return {
      userInfo: store.getters.userInfo,
      dwList: ["YYJSC_FZR", "YYJSC_JBR", "JSDW_JBR", "JSDW_FZR"],

      getList: api_queryProjectNotInIds,
      params: {},
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
            placeholder: "请输入风险关键词",
            bind: "keyword", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "请选择风险级别",
            bind: "riskLevel",
            data: "riskList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          riskList: [],
        },
        btns: [
          {
            name: "新建风险",
            click: this.add,
            type: "primary",
            permissionCode: "M007_M002_003",
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
              field: "riskStatus",
              value: [0],
              icon: "el-icon-document",
              code: "M007_M002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              reverse: true,
              validate: this.btnValidate,
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              field: "riskStatus",
              value: [0],
              icon: "el-icon-document",
              code: "M007_M002_005", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              reverse: true,
              validate: this.btnValidate,
            },
            {
              name: "处理",
              method: "dispose",
              type: "text",
              size: "medium",
              field: "riskStatus",
              value: [2, 6],
              reverse: true,
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M007_M002_006", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
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
  watch: {
    $route(val) {
      if (val) {
        this.getTbHeader();
        this.getTbData();
        this.getListByTopicAndItem();
      }
    },
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
    backToList() {
      this.routeClose();

      this.$router.push({ name: "issue" });
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subdis", this.$setState);
    },
    typeFun(val) {
      let arr = TYPELIST;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    riskBasisFun(val) {
      let arr = BASISLIST;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    levelFun(val) {
      let arr = this.search.enum.riskList;

      let label = this.$utils.arrFind(arr, val, "value")?.label;
      return label;
    },
    levelImgFun(val) {
      let imgArr = [
        require("@/assets/riskTrouble/low.png"),
        require("@/assets/riskTrouble/middle.png"),
        require("@/assets/riskTrouble/high.png"),
      ];
      return typeof val == "string" || typeof val == "number"
        ? imgArr[val]
        : "";
    },
    getListByTopicAndItem() {
      // 获取风险等级
      listByTopicAndItem({ topic: "JFZG_DISPATCHRISK_LEVEL" }).then((res) => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "riskList",
            this.$utils.enumsDataNameValue(
              res.data,
              "chName",
              "itemCode",
              "label",
              "value"
            )
          );
        }
        console.log(this.search.enum.riskList);
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

      if (this.$route.query.projectId) {
        param.projectId = this.$route.query.projectId;
      }
      api_getRiskList(param).then((res) => {
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
        this.$emit("getDataList", res.data.records);
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
            item.prop == "riskLevel" ||
            item.prop == "createTime" 
          ) {
            item.sortable = 'custom';
          }
          return item.isShow;
        });
        console.log(this.table.tableConfig.header);
      });
    },
    workView(val) {
      this.$router.push({
        name: "riskWorkView",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    dispose(val) {
      this.$router.push({
        name: "riskDispose",
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    see(val) {
      this.$router.push({
        name: "riskView",
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          api_ky_delete({ id: row.id }).then((res) => {
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
    edit(val) {
      this.$router.push({
        name: "riskEdit",
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
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
    add() {
      if (this.$route.query.projectId) {
        this.$router.push({
          name: "riskAdd",
          query: { projectId: this.$route.query.projectId },
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
    btnValidate(row, item) {
      if (row.name == "编辑" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }

      if (row.name == "删除" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }

      if (row.name == "处理" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.risk {
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
  .navBox {
    margin-bottom: 24px;
  }
  ::v-deep.sr_table .iconImg {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    vertical-align: middle;
  }
}
</style>
