<template>
  <div class="subcontractList">
    <div class="searchPage">
      <SrSearch
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
    
      :config="table.tableConfig"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="scope">
        <div v-if="scope.scope.item.prop == 'statusName'">
          <i
            v-if="scope.scope.row.status == 2"
            class="base-iconfont icon-reeor-fill"
          ></i>
          <i
            v-else-if="scope.scope.row.status == 1000"
            class="base-iconfont icon-success-fill"
          ></i>
          <span>{{ scope.scope.row.statusName }}</span>
        </div>
      </template>
    </SrTable>
    <SrDialogSelect
      class="SrDialogSelect"
      ref="SrDialogSelect"
      :getList="getList"
      :params="params"
      @select="centerDialogSbmit"
    ></SrDialogSelect>
  </div>
</template>

<script>
import store from "@/store";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import {
  api_getTableList,
  api_setContractDelete,
} from "@/api/contract/index.js";
import config from "@/settings.js";
export default {
  props: {
    projectId: [Number, String],
    parentId: [Number, String],
  },
  data() {
    return {
      getList: api_queryProjectNotInIds,
      isTableHeaderId: "",
      params: {
        // ids: "",
        status:1000,
        isArchive:0
      },
      centerDialogVisible: false,
      permissionCode: "M005_M001",
      loading: false,
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
            placeholder: "请输入合同编号/合同名称",
            bind: "queryStr",
          },
        ],
        enum: {},
        btns: [
          // {
          //   name: "新增",
          //   click: this.add,
          //   type: "primary",
          //   // permissionCode: "M005_001_002",
          // },
          // { name: "导出", click: this.export, permissionCode: "M004_M001_002" },
        ],
        formData: {
          queryStr: "",
        },
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
            width: "170",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M005_001_004",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            // {
            //   name: "查看", // 按钮名称，优先显示icon
            //   type: "text",
            //   size: "small",
            //   method: "see", // 点击执行该页面methods中对应的方法
            //   field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
            //   value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
            //   icon: "iconbianji", // 按钮显示的图标,不传显示中文
            // },
            // {
            //   name: "编辑",
            //   method: "edit",
            //   type: "text",
            //   size: "small",
            //   icon: "el-icon-document",
            //   className: "font-size-20",
            // },
            // {
            //   name: "子合同",
            //   method: "subcontract",
            //   type: "text",
            //   size: "small",
            //   icon: "el-icon-document",
            //   className: "font-size-20",
            // },
            // {
            //   name: "资金",
            //   method: "fund",
            //   type: "text",
            //   size: "small",
            //   icon: "el-icon-document",
            //   className: "font-size-20",
            // },
            // {
            //   name: "删除",
            //   method: "delete",
            //   type: "text",
            //   size: "small",
            //   icon: "el-icon-document",
            //   className: "font-size-20",
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
  mounted() {
    if (this.parentId) {
      this.permissionCode = "M005_001_003";
      this.params.isSubproject = 1;
      this.params.mainProjectId = this.projectId;
      this.parentId = this.parentId;
    }
    this.getTbHeader();
    this.getTbData(1);
  },
  methods: {
    //选择项目确定
    centerDialogSbmit(val) {
      if (val.id) {
        if (this.parentId) {
          this.$router.push({
            name: "contractAdd",
            query: {
              projectId: val.id,
              parentId: this.parentId,
            },
          });
        } else {
          this.$router.push({
            name: "contractAdd",
            query: {
              projectId: val.id,
            },
          });
        }
      }
    },
    //获取表格数据
    getTbData(index) {
      if (index) {
        this.table.page.pageNum = index;
      }
      let params = {
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
        parentId: this.parentId,
      };
      api_getTableList(params).then((res) => {
        if (res.msg.code == "0000") {
          this.table.page.total = res.data.total;
          this.table.data = res.data.records.map((item) => {
            item.statusName = item.statusName ? item.statusName : "-";
            item.contractDuration =
              item.contractDuration && JSON.parse(item.contractDuration)
                ? JSON.parse(item.contractDuration)[0] +
                  "~" +
                  JSON.parse(item.contractDuration)[1]
                : "";
            item.hasChildren = item.contractNum;
            return item;
          });
        }
      });
    },
    //新增
    add(item) {
      this.params.isSubproject = 0;
      this.params.mainProjectId = "";
      this.parentId = "";
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    //导出
    export(item) {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectImpl/projectContract/listExcel?permissionCode=${
          this.permissionCode
        }&parentId=${+this.parentId}&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    //编辑
    edit(item) {
      removeSession("infoId_contractAdd" + item.projectId);
      this.$router.push({
        name: "contractAdd",
        query: {
          id: item.id,
          projectId: item.projectId,
        },
      });
    },
    //子合同
    subcontract(item) {
      if (item.id) {
        this.params.isSubproject = 1;
        this.params.mainProjectId = item.projectId;
        this.parentId = item.id;
        this.$refs.SrDialogSelect.dialogVisible = true;
        this.$refs.SrDialogSelect.search();
      }
    },
    see(item) {
      this.$router.push({
        name: "contractView",
        query: {
          id: item.id,
          projectId: item.projectId,
        },
      });
    },
    //资金
    fund(item) {},
    //删除
    delete(item) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此合同, 是否继续?",
        okFun: () => {
          api_setContractDelete({ id: item.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.getTbData(1);
              this.$message({
                type: "info",
                message: "删除成功",
              });
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
    getTbHeader() {
      api_userSetQuery({ permissionCode: this.permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "statusName") {
            item.cellSlot = true;
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
  },
};
</script>

<style lang="scss" scoped>
.subcontractList {
  ::v-deep .SrDialogSelect {
    .el-input--suffix {
      display: none;
    }
  }
  ::v-deep .table {
    .icon-success-fill {
      color: #1890ff;
      vertical-align: middle;
      margin-right: 4px;
    }
    .icon-reeor-fill {
      color: #ccc;
      vertical-align: middle;
      margin-right: 4px;
    }
    .sr-icon-set {
      display: none;
    }
  }
}
</style>
