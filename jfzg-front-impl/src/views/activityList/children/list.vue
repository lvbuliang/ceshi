<template>
  <div>
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
  list,
  api_userSetQuery,
  del,
  experList,
  complete,
} from "@/api/activityList";
import { api_userSetSave } from "@/api/expert";
import store from "@/store";
import config from "@/settings.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      zjList: ["PSZJ"],
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
            placeholder: "请输入评审活动名称",
            bind: "reviewActivitiesName",
          },
          {
            type: "select",
            placeholder: "活动状态",
            bind: "status",
            data: "typeList", // 对应enum中的stateList
          },
          {
            type: "select",
            placeholder: "活动类型",
            bind: "reviewActivitiesType",
            data: "reviewActivitiesTypeList", // 对应enum中的stateList
          },
          {
            type: "select",
            placeholder: "会议时长",
            bind: "meetingLength",
            data: "meetingLengthList", // 对应enum中的stateList
          },
        ],
        enum: {
          typeList: [
            { label: "待抽取专家", value: "1" },
            { label: "进行中", value: "2" },
            { label: "已完成", value: "3" },
          ],
          reviewActivitiesTypeList: [
            { label: "函评", value: "0" },
            { label: "现场评审", value: "1" },
          ],
          meetingLengthList: [
            { label: "4小时以下", value: "0" },
            { label: "4小时以上", value: "1" },
          ],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M008_M001_001",
          },
        ],
        formData: {
          reviewActivitiesName: "",
          status: "",
          reviewActivitiesType: "",
          meetingLength: "",
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
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "抽取专家",
              method: "extract",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
              code: "M008_M004_002",
            },
            {
              name: "确认参会",
              method: "canhui",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
              code: "M008_M004_003",
            },
            {
              name: "评价",
              method: "pingjia",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M008_M004_004",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "评审完成",
              method: "expertAspirationComplete",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M008_M004_005",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
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
      permissionCode: "M008_M004",
      userInfo: null,
    };
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    console.log("userInfo", this.userInfo);
    // 专家访问页面，不显示状态过滤器
    const { roleCode } = this.userInfo.currentRole;
    if (this.zjList.includes(roleCode)) {
      this.search.config.pop();
    }

    this.getTbHeader();
    this.getTbData();
  },
  methods: {
    expertAspirationComplete(row) {
      console.log("row", row);
      complete({
        reviewId: row.id,
      }).then((res) => {
        console.log("res", res);
        this.getTbData();
      });
    },
    btnValidate(row, item) {
      console.log("111", row, item);
      if (
        row.name == "抽取专家" &&
        item.status == 1 &&
        this.$utils.checkCodeInArr(row.code)
      ) {
        console.log(this.$utils.checkCodeInArr(row.code));
        return true;
      }
      if (
        row.name == "确认参会" &&
        item.status == 2 &&
        this.$utils.checkCodeInArr(row.code)
      ) {
        return true;
      }
      if (
        row.name == "评价" &&
        item.status == 3 &&
        this.$utils.checkCodeInArr(row.code)
      ) {
        return true;
      }
      if (
        row.name == "评审完成" &&
        item.status == 2 &&
        this.userInfo.jfid == item.creator
      ) {
        return true;
      }

      return false;
    },
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectImpl/reviewActivities/listExcel?permissionCode=${
          this.permissionCode
        }&access_token=${sessionStorage.getItem("token")}`
      );
    },
    getTbData() {
      let param = {
        pageNo: this.table.page.pageNo,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };

      let roleCode = this.userInfo.currentRole.roleCode;
      if (!this.zjList.includes(roleCode)) {
        list(param).then((res) => {
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
                      item1.operationBtns &&
                        item.operationBtns.push(item1.operationBtns[0]);
                    }
                  });
              } else {
                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    if (roleCode == item1.role) {
                      item1.operationBtns &&
                        item.operationBtns.push(item1.operationBtns[0]);
                    }
                  });
              }
              item.path = this.workView;
            }
            console.log("item", item);
            item.meetingLength =
              item.meetingLength == 0
                ? "4小时以下"
                : item.meetingLength == 1
                ? "4小时以上"
                : "-";
            item.reviewActivitiesType =
              item.reviewActivitiesType == 0
                ? "函评"
                : item.reviewActivitiesType == 1
                ? "现场评审"
                : "-";

            item.meetingType =
              item.meetingType == 0
                ? "线上会议"
                : item.meetingType == 1
                ? "现场会议"
                : "-";
          });
          this.table.data = res.data.records;
        });
      } else {
        experList(param).then((res) => {
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
            console.log("item", item);
            item.meetingLength =
              item.meetingLength == 0
                ? "4小时以下"
                : item.meetingLength == 1
                ? "4小时以上"
                : "-";
            item.reviewActivitiesType =
              item.reviewActivitiesType == 0
                ? "函评"
                : item.reviewActivitiesType == 1
                ? "现场评审"
                : "-";

            item.meetingType =
              item.meetingType == 0
                ? "线上会议"
                : item.meetingType == 1
                ? "现场会议"
                : "-";
          });
          this.table.data = res.data.records;
        });
      }
    },
    see(row) {
      this.$router.push({
        name: "activityView",
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
          del({ id: row.id }).then((res) => {
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
      let permissionCode = "";
      let roleCode = this.userInfo.currentRole.roleCode;
      if (!this.zjList.includes(roleCode)) {
        this.permissionCode = "M008_M004";
        api_userSetQuery({ permissionCode: this.permissionCode }).then(
          (res) => {
            this.isTableHeaderId = res.data.id;
            let headerData = JSON.parse(res.data.data).sort(
              (a, b) => a.index - b.index
            );
            this.table.tableConfig.operateConfig.allTableHeader = headerData;
            this.table.tableConfig.header = headerData.filter(
              (item) => item.isShow
            );
          }
        );
      } else {
        this.permissionCode = "M008_M005";
        api_userSetQuery({ permissionCode: this.permissionCode }).then(
          (res) => {
            this.isTableHeaderId = res.data.id;
            let headerData = JSON.parse(res.data.data).sort(
              (a, b) => a.index - b.index
            );
            this.table.tableConfig.operateConfig.allTableHeader = headerData;
            this.table.tableConfig.header = headerData.filter(
              (item) => item.isShow
            );
          }
        );
      }
    },
    //页数发生改变
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
      this.$router.push({
        name: "/activityAdd",
      });
    },
    extract(row) {
      localStorage.removeItem("one");
      this.$router.push({
        name: "activityExtract",
        query: {
          projectId: row.projectId,
          id: row.id,
          extractNum: row.extractNum,
          status: row.status,
        },
      });
    },
    canhui(row, item) {
      this.$router.push({
        name: "activitycanhui",
        query: {
          id: row.id,
          templateId: row.templateId,
          processId: row.processId,
        },
      });
    },
    pingjia(row) {
      this.$router.push({
        name: "activitypingjia",
        query: {
          id: row.id,
          templateId: row.templateId,
          processId: row.processId,
        },
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

<style scoped lang="scss">
.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
</style>
