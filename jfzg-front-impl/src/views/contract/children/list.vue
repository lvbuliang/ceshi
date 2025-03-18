<template>
  <div class="contractLisr" v-if="$route.name == 'contract'">
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
      @emptyClick="add"
      @clickRow="clickRow"
      :config="table.tableConfig"
      :page="table.page"
      @sortChange="sortChange"
    >
      <template slot="cellSlot" slot-scope="scope">
        <div class="tableIcon" v-if="scope.scope.item.prop == 'statusName'">
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
      :tableConfig="tableConfig"
      :hasChildrenFlag="false"
      :buttonFlag="false"
      :footerFlag="false"
      @select="centerDialogSbmit"
      @close="close"
      :getNumber="getNumber"
    >
      <div class="contractSearchBox" slot="search">
        <el-input
          class="input"
          v-model="params.keyword"
          placeholder="请输入项目名称/编号"
        ></el-input>
        <!-- 6.30版本暂时隐藏 -->
        <!-- <el-select
          v-model="params.projectTags"
          :clearable="true"
          multiple
          placeholder="请选择项目标签"
        >
          <el-option
            v-for="item in projectTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
        <sr-popover content="搜索">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            v-debounce="[() => dialogSelectSearch(), config.deTime]"
          ></el-button>
        </sr-popover>
        <sr-popover content="重置">
          <el-button
            size="small"
            icon="el-icon-refresh"
            circle
            v-debounce="[() => dialogSelectRefresh(), config.deTime]"
          ></el-button>
        </sr-popover>
      </div>
    </SrDialogSelect>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import store from "@/store";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import {
  api_userSetQuery,
  api_userSetSave,
  listByTopicAndItem,
} from "@/api/index.js";
import moment from "moment";
import {
  api_getTableList,
  api_setContractDelete,
} from "@/api/contract/index.js";
import config from "@/settings.js";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { api_getLibraryNumber } from "@/api/projectLibrary";
export default {
  data() {
    return {
      getNumber: api_getLibraryNumber, //弹框新增接口
      config,
      maps: new Map(),
      selectObj: {},
      getList: api_queryProjectNotInIds,
      projectTypeList: [],
      parentId: "",
      isTableHeaderId: "",
      params: {
        // ids: "",
        status: 1000,
        keyword: "",
        // projectType: [],
        projectTags: [],
        activationStatus: 1,
        isSubproject: 0,
        isArchive: 0,
        isFromContract: 1,
      },
      centerDialogVisible: false,
      projectId: "",
      parentId: "",
      permissionCode: "M005_M001",
      loading: false,
      sortDtos: [],
      tableConfig: {
        load: this.load,
        highlightCurrentRow: true,
        selectionConfig: {
          display: false,
        },
        header: [
          {
            label: "项目名称",
            prop: "projectName",
          },
          {
            label: "项目编号",
            prop: "projectCode",
          },
          {
            label: "总投资(万元)",
            prop: "totalInvestmentAmount",
          },
        ],
        indexConfig: {
          display: true,
          label: "序列",
          width: "52",
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
            placeholder: "请输入合同编号/合同名称",
            bind: "queryStr",
          },
          {
            type: "text",
            placeholder: "请输入项目编号/项目名称",
            bind: "projectStr",
          },
        ],
        enum: {},
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M005_001_001",
          },
          // { name: "导出", click: this.export, permissionCode: "M004_M001_002" },
        ],
        formData: {
          queryStr: "",
          projectStr: "",
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
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
            exportPermissionCode: "M005_001_002",
          },
          emptyConfig: {
            // 表格数据为空时默认显示的内容
            display: true,
            emptyNull: "暂无合同",
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
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M005_001_003",
              validate: this.btnValidate,
            },
            {
              name: "子合同",
              method: "subcontract",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M005_001_005",
              validate: this.btnValidate,
            },
            {
              name: "资金",
              method: "fund",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M005_001_006",
              validate: this.btnValidate,
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M005_001_004",
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
    };
  },
  mounted() {
    if (this.parentId) {
      this.permissionCode = "M005_001_003";
    }
    this.getTbHeader();
    this.getTbData(1);
    this.getProjectType();
  },
  methods: {
    btnValidate(row, item) {
      let flag = false;
      // console.log(this.$utils.checkCodeInArr(row.code), row.name);
      if (this.$utils.checkCodeInArr(row.code)) {
        flag = true;
      }
      return flag;
    },
    close() {
      this.params = {
        keyword: "",
        // projectType: null,
        projectTags: null,
        isSubproject: 0,
        activationStatus: 1,
        status: 1000,
      };
    },
    //获取项目类型
    getProjectType() {
      listByTopicAndItem({ topic: "JHXMK_PROJECT_TAG" }).then((res) => {
        if (res.msg.code == "0000") {
          let list = res.data.map((item) => {
            return {
              label: item.chName,
              value: item.itemCode,
            };
          });
          this.$set(this, "projectTypeList", list);
        }
      });
    },
    load(tree, treeNode, resolve) {
      console.log(resolve);
      let params = {
        pageNo: 1,
        pageSize: 9999,
        ...this.search.formData,
        parentId: tree.id,
      };
      let pid = tree.id;
      this.maps.set(pid, { tree, treeNode, resolve });
      api_getTableList(params).then((res) => {
        console.log("load", res);
        if (res.msg.code == "0000") {
          let list = res.data.records.map((item) => {
            item.contractNum = "-";
            item.contractDuration =
              item.contractDuration && JSON.parse(item.contractDuration)
                ? JSON.parse(item.contractDuration)[0] +
                  "~" +
                  JSON.parse(item.contractDuration)[1]
                : "";
            item.num = tree.num + "." + item.num;
            item.btns = [
              {
                name: "查看", // 按钮名称，优先显示icon
                type: "text",
                size: "small",
                method: "see", // 点击执行该页面methods中对应的方法
                icon: "iconbianji", // 按钮显示的图标,不传显示中文
              },
              {
                name: "编辑",
                method: "edit",
                type: "text",
                size: "small",
                icon: "el-icon-document",
                className: "font-size-20",
                code: "M005_001_003",
              },
              {
                name: "资金",
                method: "fund",
                type: "text",
                size: "small",
                icon: "el-icon-document",
                className: "font-size-20",
                code: "M005_001_006",
              },
              {
                name: "删除",
                method: "delete",
                type: "text",
                size: "small",
                icon: "el-icon-document",
                className: "font-size-20",
                code: "M005_001_004",
              },
            ];
            // 处理统筹经办人只要查看权限
            item.btns = item.btns.filter((btnItem) => {
              let flag = false;
              console.log(
                this.$utils.checkCodeInArr(btnItem.code),
                btnItem.name
              );
              if (this.$utils.checkCodeInArr(btnItem.code)) {
                flag = true;
              }
              return flag == true;
            });
            return item;
          });
          resolve(list);
        }
      });
    },
    clickRow(val) {
      this.selectObj = val;
    },
    //选择项目确定
    centerDialogSbmit(val) {
      if (val.id) {
        removeSession("infoId_contractAdd" + val.id);
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
      };
      if (this.sortDtos.length > 0) {
        params.sortDtos = this.sortDtos;
      }
      api_getTableList(params).then((res) => {
        if (res.msg.code == "0000") {
          this.table.page.total = res.data.total;
          this.table.data = res.data.records.map((item) => {
            item.statusName = item.statusName ? item.statusName : "-";
            item.contractDuration =
              item.contractDuration &&
              JSON.parse(item.contractDuration) &&
              JSON.parse(item.contractDuration).length
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
    //弹框重置
    dialogSelectRefresh() {
      // this.params.projectType = [];
      this.params.projectTags = [];
      this.params.keyword = "";
      this.$refs.SrDialogSelect.search();
    },
    //弹框搜索
    dialogSelectSearch() {
      this.$refs.SrDialogSelect.search();
    },
    //新增
    add(item) {
      this.parentId = null;
      this.params.isSubproject = 0;
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
        }&access_token=${sessionStorage.getItem("token")}`
      );
    },
    //编辑
    edit(item) {
      removeSession("infoId_contractAdd" + item.projectId);
      if (item.parentId) {
        this.$router.push({
          name: "contractEdit",
          query: {
            id: item.id,
            projectId: item.projectId,
            parentId: item.parentId,
          },
        });
      } else {
        this.$router.push({
          name: "contractEdit",
          query: {
            id: item.id,
            projectId: item.projectId,
          },
        });
      }
    },
    //子合同
    subcontract(item) {
      if (item.id) {
        this.parentId = item.id;
        this.$router.push({
          name: "contractAdd",
          query: {
            projectId: item.projectId,
            parentId: item.id,
          },
        });
      }
      /* if (item.id) {
        this.params.isSubproject = 1;
        this.params.mainProjectId = item.projectId;
        this.parentId = item.id;
        this.$refs.SrDialogSelect.dialogVisible = true;
        this.$refs.SrDialogSelect.search();
      } */
    },
    see(item) {
      if (item.parentId) {
        this.$router.push({
          name: "contractView",
          query: {
            id: item.id,
            projectId: item.projectId,
            parentId: item.parentId,
          },
        });
      } else {
        this.$router.push({
          name: "contractView",
          query: {
            id: item.id,
            projectId: item.projectId,
          },
        });
      }
    },
    //资金
    fund(item) {
      this.$router.push({
        name: "fundList",
        query: {
          id: item.id,
          projectId: item.projectId,
          type: "fundList",
        },
      });
    },
    //删除
    delete(item) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此合同, 是否继续?",
        okFun: () => {
          api_setContractDelete({ id: item.id }).then((res) => {
            if (res.msg.code == "0000") {
              if (item.parentId) {
                const pid = item.parentId;
                const { tree, treeNode, resolve } = this.maps.get(pid);
                this.load(tree, treeNode, resolve);
              }
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
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "statusName") {
            item.cellSlot = true;
          }
          if (item.prop == "contractAmount") {
            item.width = "170px";
            item.sortable = "custom";
          }
          if (item.prop == "contractDuration") {
            item.sortable = "custom";
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
  },
};
</script>

<style lang="scss" scoped>
.contractLisr {
  ::v-deep .SrDialogSelect {
    .el-input--suffix {
      display: none;
    }
  }
  ::v-deep .table {
    .tableIcon {
      display: flex;
      align-items: center;
    }
    .icon-success-fill {
      color: #1890ff;
      // vertical-align: middle;
      margin-right: 4px;
    }
    .icon-reeor-fill {
      color: #ccc;
      // vertical-align: middle;
      margin-right: 4px;
    }
  }
}
</style>
<style lang="scss">
.contractSearchBox {
  display: flex;
  align-items: center;
  .input {
    margin-right: 8px;
  }
  .el-select {
    .el-input {
      width: 150px;
    }
  }
}
</style>
