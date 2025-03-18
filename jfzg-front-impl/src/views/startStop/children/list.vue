<template>
  <div class="contractLisr">
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        @queryList="pageChanged(1)"
      ></SrSearch>
    </div>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'status'">
          <div>{{ statusFun(scope.row.status) }}</div>
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
    <!-- 启停记录 -->
    <TableDialog
      class="SrDialogSelect2"
      ref="SrDialogSelect2"
      :getList="getList2"
      :params="params2"
      :tableConfig="tableConfig2"
      :dialogTitle="tableTitle"
      :isButton="true"
    ></TableDialog>
    <FormDialog
      ref="stopFormDialog"
      :form="stopForm"
      :title="stopTitle"
      @confirm="stopConfirm"
    >
      <sr-nav-page
        slot="center"
        :type="2"
        :project="srNavPageObj"
      ></sr-nav-page>
    </FormDialog>
  </div>
</template>

<script>
import { permissionCode } from "./const.js";
import upload from "@/utils/upload";
import config from "@/settings.js";
import store from "@/store";
import {
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
  queryBizunitsByProperty,
} from "@/api/index.js";
import { api_queryProjectNotInIds } from "@/api/projectLibrary";
import {
  api_getList,
  api_stopProject,
  api_getStopListByProjectId,
} from "@/api/startStop";
import FormDialog from "@/components/formDialog.vue";
import TableDialog from "../components/tableDialog.vue";

export default {
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  components: {
    FormDialog,
    TableDialog,
  },
  data() {
    return {
      srNavPageObj: { name: "", code: "" },
      dwList: ["YYJSC_FZR", "YYJSC_JBR", "JSDW_JBR", "JSDW_FZR"],
      userInfo: store.getters.userInfo,
      getList: api_queryProjectNotInIds,
      params: {
        // status: 1000, // 审批完成
        activationStatus: 1,
        status: 1000,
        isArchive:0
      },
      getList2: api_getStopListByProjectId,
      params2: {
        projectId: "",
        isArchive:0
      },
      tableConfig2: {
        header: [
          {
            label: "暂停时间",
            prop: "createTime",
          },
          {
            label: "启动时间",
            prop: "startTime",
          },
          {
            label: "整改说明",
            prop: "descContext",
          },
          {
            label: "启动理由",
            prop: "improveContext",
          },
        ],
        innerBtn: [
          {
            name: "查看", // 按钮名称，优先显示icon
            type: "text",
            size: "small",
            method: "see2", // 点击执行该页面methods中对应的方法
            // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
            // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
            icon: "iconbianji", // 按钮显示的图标,不传显示中文
          },
        ],
        operateConfig: {
          hideHeaderSetting: true,
          display: true,
          label: "操作",
          width: "170",
          fixed: "right",
        },
      },
      projectId: "",
      id: "",
      stopTitle: "",
      viewTitle: "",
      tableTitle: "",
      stopForm: {
        config: [
          {
            type: "textarea",
            name: "整改内容",
            placeholder: "请输入内容",
            maxlength: 500,
            bind: "descContext",
            col: 24,
            trigger: "blur", // 校验时机
            required: "请输入内容",
          },
          {
            type: "upload",
            name: "项目暂停通知单",
            fileSize: 500,
            fileList: [],
            placeholder: "选择上传文件",
            fileType: "pdf",
            required: "选择上传文件",
            col: 24,
            bind: "stopFile",
          },
          {
            type: "upload",
            name: "整改通知单",
            fileSize: 500,
            fileList: [],
            placeholder: "选择上传文件",
            fileType: "pdf",
            required: "选择上传文件",
            col: 24,
            bind: "rectFile",
          },
        ],
        otherConfig: {
          labelNum: 140,
          column: 2,
        },
        enums: {
          liablerList: [],
        },
        rules: {},
        data: {},
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
            placeholder: "请输入项目名称/编号",
            bind: "keyword",
          },
          {
            type: "select",
            placeholder: "请选择项目状态",
            bind: "status",
            data: "statusList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
          {
            type: "select",
            placeholder: "项目类型",
            bind: "projectType", // 对应this.search.data对象的field1
            disabled: false,
            class: "selectWidth",
            data: "projectTypeList", // 对应enum中的stateList
          },
        ],
        enum: {
          statusList: [],
          projectTypeList: [],
          jsdwList: [],
        },
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M007_M003_005",
          },
        ],
        formData: {
          status: "",
          keyword: "",
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
            width: "180",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },
          innerBtn: [
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            // {
            //   name: "启动", // 按钮名称，优先显示icon
            //   type: "text",
            //   size: "small",
            //   method: "start", // 点击执行该页面methods中对应的方法
            //   // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
            //   // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
            //   icon: "iconbianji", // 按钮显示的图标,不传显示中文
            //   code: "M007_M003_001", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            //  validate: this.btnValidate //自定义判断是否展示按钮权限
            // },
            {
              name: "暂停", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "stop", // 点击执行该页面methods中对应的方法
              field: "status", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [1], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M007_M003_002", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              reverse: true,
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },

            {
              name: "启动申请", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "apply", // 点击执行该页面methods中对应的方法
              field: "status", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M007_M003_003", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              reverse: true,
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "启动申请", // 驳回状态重新申请
              type: "text",
              size: "small",
              method: "againApply", // 点击执行该页面methods中对应的方法
              field: "status", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [4], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M007_M003_003", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              reverse: true,
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "启停记录", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "record", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              // code: "M007_M003_001", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
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
  watch: {
    $route(val) {
      if (val) {
        this.init();
      }
    },
  },
  created() {
    this.init();
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
    init() {
      let roleCode = this.userInfo.currentRole.roleCode;
      if (!this.dwList.includes(roleCode)) {
        this.search.config.push({
          type: "select",
          placeholder: "请选择建设单位",
          bind: "buid",
          data: "jsdwList", // 对应enum中的stateList
          class: "selectWidthCustom",
        });
        this.getQueryBizunitsByProperty();
      } else {
        let index = this.$utils.getArrIndex(this.search.config, "buid", "bind");
        if (index > -1) {
          this.search.config.pop();
        }
      }
      this.getTbHeader();
      this.getTbData();
      this.getListByTopicAndItem();
    },
    statusFun(val) {
      let arr = this.search.enum.statusList;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    getQueryBizunitsByProperty() {
      // 获取建设单位
      queryBizunitsByProperty({ buPropertyEnum: "JSDW" }).then((res) => {
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
      // 获取项目状态
      listByTopicAndItem({ topic: "JFZG_PROJECT_STOP_STATUS" }).then((res) => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "statusList",
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

      // 获取项目类型
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        if (res?.data) {
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
    handleSelect(val) {
      this.srNavPageObj = val;
      this.stopTitle = val.projectName + "项目暂停";
      this.projectId = val.id;
      this.stopForm.data = {};
      this.$refs["stopFormDialog"].$isShow();
    },

    stopConfirm(obj) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "确认暂停",
        content: "确定后项目不可进行申报、实施、验收等操作。",
        okFun: () => {
          // 项目暂停确定
          let params = {
            ...obj,
            projectId: this.projectId,
            stopFile:
              obj.stopFile && Array.isArray(obj.stopFile)
                ? JSON.stringify(obj.stopFile)
                : "",
            rectFile:
              obj.rectFile && Array.isArray(obj.rectFile)
                ? JSON.stringify(obj.rectFile)
                : "",
          };
          api_stopProject(params).then((res) => {
            if (res.msg.code == "0000") {
              this.getTbData();
              this.$refs["stopFormDialog"].$isShow();
              this.$message.success("暂停成功！");
            }
          });
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        },
      });
    },

    async againApply(val) {
      this.$router.push({
        name: "startStopApply",
        query: { id: val.id, projectId: val.projectId, isAgain: true },
      });
    },
    apply(val) {
      this.$router.push({
        name: "startStopApply",
        query: { id: val.id, projectId: val.projectId },
      });
    },
    stop(val) {
      this.srNavPageObj = val;
      this.stopTitle = val.projectName + "项目暂停";
      this.projectId = val.projectId;
      this.stopForm.data = {};
      this.$refs["stopFormDialog"].$isShow();
    },
    record(val) {
      this.tableTitle = val.projectName + "项目启停列表";
      this.params2.projectId = val.projectId;
      this.$refs.SrDialogSelect2.dialogVisible = true;
      this.$refs.SrDialogSelect2.search();
    },
    see(val) {
      this.$router.push({
        name: "startStopView",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId || "",
          isProject: true, // 为true 用项目id查详情
        },
      });
    },
    see2(val) {
      this.$router.push({
        name: "startStopView",
        query: {
          id: val.id,
          projectId: val.projectId,
        },
      });
    },
    start(val) {},

    add() {
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
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

      api_getList(param).then((res) => {
        if (!res?.data?.records) return;

        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        let { roleCode } = this.userInfo?.currentRole;
        let { jfid } = this.userInfo;
        if (!this.hideSearchBtn) {
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
        }
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
          if (item.prop == "contractAmount") {
            item.sortable = 'custom';
            item.width = '220'
          }
          return item.isShow;
        });
        console.log( this.table.tableConfig.header );
      });
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
    workView(val) {
      this.$router.push({
        name: "startStopWorkView",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
          templateId: val.templateId,
          processId: val.processId,
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
    btnValidate(row, item) {
      if (row.name == "启动" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }

      if (row.name == "暂停" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }

      if (row.name == "启动申请" && this.$utils.checkCodeInArr(row.code)) {
        return true;
      }
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
.searchPage {
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
}

.Sr_Nav_Page {
  height: 100px;
  padding: 24px;
  margin-bottom: 0;
  box-sizing: border-box;
  background: #fafafa;
}
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .sr-add {
  padding: 24px;
}
</style>
