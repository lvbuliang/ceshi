<template>
  <div class="FundLisr">
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
      :config="table.tableConfig"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="scope">
        <div v-if="scope.scope.item.prop == 'credentials'">
          <i
            v-if="scope.scope.row.credentials == '未上传'"
            class="base-iconfont icon-reeor-fill"
          ></i>
          <i
            v-else-if="scope.scope.row.credentials == '已上传'"
            class="base-iconfont icon-success-fill"
          ></i>
          <span>{{ scope.scope.row.credentials }}</span>
        </div>
      </template>
    </SrTable>
    <el-dialog
      class="dialog"
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      width="800px"
      center
    >
      <div v-if="dialogType == 'edit'" class="contentBox">
        <SrAdd
          :config="form.config"
          :otherConfig="otherConfig"
          :enums="form.enums"
          :form="form.data"
          :ref="`form`"
        ></SrAdd>
      </div>
      <div v-else-if="dialogType == 'view'" class="contentBox">
        <SrView
          :formData="formView.config"
          :ruleForm="formView.data"
          :ref="`form`"
        ></SrView>
      </div>
      <span v-if="dialogType == 'edit'" slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          round
          type="primary"
          v-debounce="[() => centerDialogSubmit(), config.deTime]"
          >确 定</el-button
        >
        <el-button size="medium" round @click="centerDialogClose"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { getQueryList } from "@/api/projectLibrary";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { api_getCustomFormTemplate } from "@/api/index.js";
import {
  api_getFundList,
  api_getFundDetail,
  api_fundDelete,
  api_saveOrUpdate,
} from "@/api/contract/index.js";
import config from "@/settings.js";
import upload from "@/utils/upload";
export default {
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {
    projectId: [Number, String],
    parentId: [Number, String],
    viewType: [String],
  },
  data() {
    return {
      config,
      dialogType: "edit",
      id: "",
      templateId: "",
      form: {
        config: [],
        data: {},
        enums: {},
      },
      formView: {
        config: [],
        data: {},
        enums: {},
      },
      dialogTitle: "新增资金使用计划",
      getList: getQueryList,
      isTableHeaderId: "",
      params: {
        // ids: "",
        status: 1000,
        isArchive: 0,
      },
      otherConfig: {
        labelNum: 155,
      },
      centerDialogVisible: false,
      permissionCode: "M005_001_001",
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
            placeholder: "请输入关键字",
            bind: "stageName",
          },
        ],
        enum: {},
        btns: [
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M005_001_007",
          },
          // { name: "导出", click: this.export, permissionCode: "M004_M001_002" },
        ],
        formData: {
          stageName: "",
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
            exportPermissionCode: "M005_001_008",
          },
          emptyConfig: {
            // 表格数据为空时默认显示的内容
            display: true,
            emptyNull: "暂无资金使用计划",
          },
          innerBtn: [
            {
              name: "查看",
              method: "see",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
            },
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M005_001_009",
              validate: this.btnValidate,
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M005_001_010",
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
    this.getTbHeader();
    this.getTbData(1);
    console.log(this.viewType);
    if (this.viewType == "view") {
      this.table.tableConfig.innerBtn = [
        {
          name: "查看",
          method: "see",
          type: "text",
          size: "small",
          icon: "el-icon-document",
          className: "font-size-20",
        },
      ];
      this.search.btns = [];
    }
  },
  methods: {
    btnValidate(row, item) {
      let flag = false;
      console.log(this.$utils.checkCodeInArr(row.code), row.name);
      if (this.$utils.checkCodeInArr(row.code)) {
        flag = true;
      }
      return flag;
    },
    centerDialogSubmit() {
      console.log(this.form.data);
      this.$refs["form"].validate((val) => {
        if (val) {
          // 如果填写实际付款金额,,没有填写实际付款时间,给提示,不允许提交
          // 如果填写实际付款时间,,没有填写实际付款金额,给提示,不允许提交
          if (this.form.data.realityAmount && !this.form.data.realityTime) {
            this.$message({
              type: "info",
              message: "请填写实际付款时间",
            });
            return;
          } else if (
            !this.form.data.realityAmount &&
            this.form.data.realityTime
          ) {
            this.$message({
              type: "info",
              message: "请填写实际付款金额",
            });
            return;
          }
          let params = {
            ...this.form.data,
            templateId: this.templateId,
          };
          params.contractId = this.parentId;
          params.credentialsFile =
            params.credentialsFile && params.credentialsFile.length > 0
              ? JSON.stringify(params.credentialsFile)
              : "";
          params.otherFile =
            params.otherFile && params.otherFile.length > 0
              ? JSON.stringify(params.otherFile)
              : "";
          if (this.id) {
            params.id = this.id;
          }
          api_saveOrUpdate(params).then((res) => {
            if (res.msg.code == "0000") {
              if (this.id) {
                this.$message({
                  type: "info",
                  message: "编辑成功",
                });
              } else {
                this.$message({
                  type: "info",
                  message: "添加成功",
                });
              }
              this.getTbData(1);
              this.centerDialogVisible = false;
            }
          });
        }
      });
    },
    centerDialogClose() {
      this.form.data = {};
      this.centerDialogVisible = false;
    },
    getDetal(item) {
      api_getFundDetail({ id: item.id }).then((res) => {
        if (res.msg.code == "0000") {
          this.id = item.id;
          this.getCustomFormTemplate(res.data);
        }
      });
    },
    //自定义表单获取
    getCustomFormTemplate(data) {
      let moduleCode = "13003";
      let params = {
        moduleCode,
        templateId: this.templateId,
      };
      api_getCustomFormTemplate(params).then((res) => {
        if (res.msg.code == "0000") {
          let list = res.data.templateDetail
            ? JSON.parse(res.data.templateDetail)
            : [];
          if (list.length > 0) {
            this.form = JSON.parse(list[0].formArr)[0].selectData.formAdd;
            this.formView = JSON.parse(list[0].formArr)[0].selectData.formView;
          }
          this.templateId = res.data.id;
          if (data) {
            data.credentialsFile = data.credentialsFile
              ? JSON.parse(data.credentialsFile)
              : [];
            data.otherFile = data.otherFile ? JSON.parse(data.otherFile) : [];
            this.$set(this.form, "data", data);
            this.$set(this.formView, "data", data);
          }
          console.log(this.formView);
          this.centerDialogVisible = true;
        }
      });
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
        contractId: this.parentId,
      };
      api_getFundList(params).then((res) => {
        if (res.msg.code == "0000") {
          this.table.page.total = res.data.total;
          this.table.data = res.data.records.map((item) => {
            item.ratio = item.ratio + "%";
            return item;
          });
        }
      });
    },
    //新增
    add(item) {
      this.dialogTitle = "新增资金使用计划";
      this.dialogType = "edit";
      this.form.data = {};
      this.id = "";
      this.getCustomFormTemplate();
    },
    see(item) {
      this.dialogType = "view";
      this.dialogTitle = "查看资金使用计划";
      this.getDetal(item);
    },
    //导出
    export(item) {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectImpl/projectContractPlan/listExcel?permissionCode=${
          this.permissionCode
        }&contractId=${this.parentId}&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    //编辑
    edit(item) {
      this.dialogTitle = "编辑资金使用计划";
      this.dialogType = "edit";
      this.getDetal(item);
    },
    //删除
    delete(item) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此资金使用计划, 是否继续?",
        okFun: () => {
          api_fundDelete({ id: item.id }).then((res) => {
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
          if (item.prop == "credentials") {
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
.FundLisr {
  ::v-deep .SrDialogSelect {
    .el-input--suffix {
      display: none;
    }
  }
  ::v-deep .el-table {
    .el-table__fixed-right {
      height: 100% !important;
    }
  }
  ::v-deep .dialog {
    .el-dialog__header {
      height: 56px;
    }
    .el-dialog__footer {
      padding: 12px 0;
    }
    .dialog-footer {
      .el-button {
        width: 76px;
        height: 32px;
        font-size: 14px;
        order: 0 !important;
      }
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
  }
}
</style>
