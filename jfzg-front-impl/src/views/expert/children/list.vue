<template>
  <div v-loading="loading">
    <SrSearch
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      @queryList="pageChanged(1)"
    ></SrSearch>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
    ></SrTable>
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年07月05日 16:34:17
  版本：v1.0
-->
<script>
import {
  getList,
  api_userSetQuery,
  api_userSetSave,
  queryDelete,
  stopAndStar,
} from "@/api/expert";
import store from "@/store";
import config from "@/settings.js";
import { listByTopicAndItem } from "@/api/index";
export default {
  components: {},
  props: {},
  data() {
    return {
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
            placeholder: "请输入专家姓名",
            bind: "name",
          },
          // {
          //   type: "select",
          //   placeholder: "技术方向",
          //   bind: "expertTechnicalDirection",
          //   data: "expertTechnicalDirectionList", // 对应enum中的stateList
          //   label: "label",
          //   value: "itemCode",
          // },
          // {
          //   type: "select",
          //   placeholder: "行业领域",
          //   bind: "expertIndustry",
          //   data: "expertIndustryList", // 对应enum中的stateList
          //   label: "label",
          //   value: "itemCode",
          // },
        ],
        enum: { expertTechnicalDirectionList: [], expertIndustryList: [] },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M008_M001_001",
          },
          // { name: "导出", click: this.export, permissionCode: "M004_M001_002" },
        ],
        formData: {
          name: "",
          // expertTechnicalDirection: "",
          // expertIndustry: "",
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
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M008_M001_007",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code:"M008_M001_008"
            },
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
              code: "M008_M001_002",
            },
            {
              name: "停用",
              type: "text",
              method: "stop",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
              code: "M008_M001_004",
            },
            {
              name: "启用",
              type: "text",
              method: "star",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
              code: "M008_M001_005",
            },
            // {
            //   name: "删除",
            //   method: "delete",
            //   type: "text",
            //   size: "medium",
            //   icon: "el-icon-document",
            //   className: "font-size-20",
            //   validate: this.btnValidate, //自定义判断是否展示按钮权限
            //   code: "M008_M001_003",
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
      loading: true,
      permissionCode: "M008_M006",
    };
  },
  mounted() {
    this.getTbHeader();
    this.getTbData();
    this.getExpertTechnicalDirectionDtoList();
    this.getExpertIndustryDtoList();
  },
  methods: {
    btnValidate(row, item) {
      if (row.name == "查看"  && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }
      if (row.name == "编辑" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }
      if (row.name == "删除" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }
      if (row.name == "停用" && item.statusFlag && this.$utils.checkCodeInArr(row.code) && item.status == 1000 ) {
        return true;
      }
      if (row.name == "启用" && item.statusFlag && this.$utils.checkCodeInArr(row.code) && item.status == 4) {
        return true;
      }
      return false;
    },
    export() {
      window.open(
        `${config.baseUrl}/jfzg/projectImpl/api/expert/export?permissionCode=${
          this.permissionCode
        }&access_token=${sessionStorage.getItem("token")}`
      );
    },
    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      this.loading = true;
      getList(param).then((res) => {
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
                    if (item1.operationBtns[0].btnName != "") {
                      item1.operationBtns &&
                        item.operationBtns.push(item1.operationBtns[0]);
                    }
                  }
                });
            } else {
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  if (roleCode == item1.role) {
                    if (item1.operationBtns[0].btnName != "") {
                      item1.operationBtns &&
                        item.operationBtns.push(item1.operationBtns[0]);
                    }
                  }
                });
            }
            item.path = this.workView;
          }
        });
        this.table.data = res.data.records;
      }).finally(() => {
        this.loading = false;
      })
    },
    add() {
      this.$router.push({
        name: "expertAdd",
      });
    },
    edit(row) {
      this.$router.push({
        name: "expertEdit",
        query: { id: row.id, templateId: row.templateId },
      });
    },
    see(row) {
      this.$router.push({
        name: "expertView",
        query: {
          id: row.id,
          templateId: row.templateId,
          processId: row.processId,
        },
      });
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此专家, 是否继续?",
        okFun: () => {
          queryDelete({ id: row.id }).then((res) => {
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
    star(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将启用此专家, 是否继续?",
        okFun: () => {   
          stopAndStar({ id: row.id, status: 1000 }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "启用成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNum = this.table.page.pageNum - 1;
              }
              this.getTbData();
            }
          });
        },
        cancelFun: () => {},
      });
    },
    stop(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将停用此专家, 是否继续?",
        okFun: () => {
          stopAndStar({ id: row.id, status: 4 }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "停用成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNum = this.table.page.pageNum - 1;
              }
              this.getTbData();
            }
          });
        },
        cancelFun: () => {},
      });
    },
    workView(row) {
      this.$router.push({
        name: "expertWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
        },
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: this.permissionCode}).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        console.log(headerData);
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter(
          (item) => item.isShow
        );
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
    //获取技术方向
    getExpertTechnicalDirectionDtoList() {
      listByTopicAndItem({ topic: "JFZG_SKILL_DIRECTION" }).then((res) => {
        let arr = res.data.map((item) => {
          return {
            label: item.chName,
            itemCode: item.itemCode,
            expertId: item.expertId,
          };
        });
        this.$set(this.search.enum, "expertTechnicalDirectionList", arr);
      });
    },
    //获取行业领域
    getExpertIndustryDtoList() {
      listByTopicAndItem({ topic: "JFZG_INDUSTRY_TERRITORY" }).then((res) => {
        let arr = res.data.map((item) => {
          return {
            label: item.chName,
            itemCode: item.itemCode,
            expertId: item.expertId,
          };
        });
        this.$set(this.search.enum, "expertIndustryList", arr);
      });
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: this.permissionCode,
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

<style scoped></style>
