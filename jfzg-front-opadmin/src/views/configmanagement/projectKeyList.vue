<template>
  <div class="projectKeyList">
    <FSearch :form="search" @queryList="getData(1)"></FSearch>
    <div class="buttonOperation">
      <el-button class="button" type="primary" @click="add"
        ><i class="el-icon-circle-plus-outline el-icon--left"></i
        >新增项目密钥</el-button
      >
    </div>
    <div class="form">
      <FTable
        class="tableData"
        :data="table.data"
        :config="table.config"
        :page="table.page"
        :formatter="formatter"
        @pageChanged="pageChanged"
        @sizeChanged="sizeChanged"
      >
      </FTable>
    </div>
    <el-dialog
      class="projectKeyDailog common-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="close"
    >
      <FForm
        ref="modelMgrRef"
        v-if="dailogType == 'edit'"
        :config="form.config"
        :form="form.data"
        :rules="form.rules"
        :enums="form.enums"
        :other-config="otherConfig"
        refForm="modelMgrRefForm"
        :column="2"
      >
        <template slot="switch">
          <el-switch
            v-model="form.data.autoapprove"
            :active-text="active"
            @change="switchChange"
          >
          </el-switch>
        </template>
      </FForm>
      <sr-view
        v-if="dailogType == 'view'"
        class="formView"
        :formData="formView.config"
        :ruleForm="formView.data"
      ></sr-view>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" v-if="dailogType == 'edit'"
          >确 定</el-button
        >
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStorageToken } from "@/utils/user-vali";
import config from "@/settings.js";
import FTable from "@/components/FTable/index.vue";
import upload from "@/utils/upload";
import FSearch from "@/components/FSearch/index.vue";
import FForm from "@/components/FForm/form-add";
import {
  api_tableList,
  api_saveOrUpdate,
  api_delete,
  api_info,
} from "@/api/configManage/projectKeyList.js";
export default {
  components: {
    FTable,
    FSearch,
    FForm,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
      dailogType: "edit",
      title: "新增项目密钥",
      active: "是",
      dialogVisible: false,
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "应用标识",
            placeholder: "请输入应用标识",
            bind: "clientId", // 对应this.search.data对象的field1
            lableWidth: 70,
          },
        ],
        enum: {},
        form: {
          clientId: "",
        },
      },
      table: {
        data: [], // 表格数据
        config: {
          // expand: true, // 表格扩展
          operationWidth: 200, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "应用标识",
              prop: "clientName",
              haveHTML: true,
            },
            // {
            //   name: "refresh_token有效期",
            //   prop: "refreshTokenValidity",
            // },
            {
              name: "是否自动授权",
              prop: "autoapprove",
              haveHTML: true,
            },
            {
              name: "应用密钥(明文)",
              prop: "clientSecretStr",
              haveHTML: true,
            },
            {
              name: "应用密钥(bcyt) 加密",
              prop: "clientSecret",
            },
            {
              name: "范围",
              prop: "scope",
              haveHTML: true,
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              method: "see", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
            },
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "edit", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
            },
            {
              name: "删除",
              method: "delete",
              className: "font-size-20",
              // field: "status",
              // value: [0],
            },
          ],
        },
        page: {
          // 分页配置
          total: "", //总条数
          pages: "", //总页数
          pageSize: 10, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      otherConfig: {
        // 其他配置
        labelNum: 160, // label宽度，可选120和150，默认120
        column: 2, // 列数，默认2
        validateOnRuleChange: false,
      },
      form: {
        config: [
          {
            col: 24, // 独占一行
            type: "text",
            name: "应用名称",
            placeholder: "请输入应用名称",
            bind: "clientName",
            trigger: "blur", // 校验时机
            required: "请输入应用名称", // 必填需要指定提示信息
            maxLength:128,
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "应用标识",
            placeholder: "请输入应用标识",
            bind: "clientId",
            trigger: "blur",
            required: "请输入应用标识", // 必填需要指定提示信息
            maxLength:32,
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "应用密钥(明文)",
            placeholder: "请输入应用密钥(明文)",
            bind: "clientSecretStr",
            trigger: "blur",
            required: "请输入应用密钥(明文)", // 必填需要指定提示信息
            maxLength:256,
          },

          {
            col: 24, // 独占一行
            type: "text",
            name: "应用密钥(bcyt) 加密",
            placeholder: "请输入应用密钥(bcyt) 加密",
            bind: "clientSecret",
            trigger: "blur",
            required: "请输入应用密钥(bcyt) 加密", // 必填需要指定提示信息
            maxLength:256,
          },
          // {
          //   col: 24, // 独占一行
          //   type: "text",
          //   name: "refresh_token有效期",
          //   placeholder: "请输入refresh_token有效期",
          //   bind: "refreshTokenValidity",
          // },
          // {
          //   col: 24, // 独占一行
          //   type: "text",
          //   name: "access_token有效期",
          //   placeholder: "请输入access_token有效期",
          //   bind: "accessTokenValidity",
          // },
          {
            col: 24, // 独占一行
            type: "text",
            name: "权限",
            placeholder: "请输入权限",
            bind: "authorities",
            maxLength:256,
          },
          {
            col: 24, // 独占一行
            type: "checkbox",
            name: "oauth授权方式",
            placeholder: "请输入oauth授权方式",
            dataList: "authorizedGrantTypesList",
            bind: "authorizedGrantTypes",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "资源限定串(逗号分割)",
            placeholder: "请输入资源限定串(逗号分割)",
            bind: "resourceIds",
            maxLength:256,
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "回调地址",
            placeholder: "请输入回调地址",
            bind: "webServerRedirectUri",
            maxLength:256,
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "范围",
            placeholder: "请输入范围",
            bind: "scope",
            maxLength:256,
          },
          {
            type: "slot",
            slotName: "switch",
            name: "是否自动授权",
            bind: "autoapprove",
          },
        ],
        data: {
          clientName: "",
          clientId: "",
          clientSecretStr: "",
          autoapprove: true,
          clientSecret: "",
          refreshTokenValidity: "",
          accessTokenValidity: "",
          authorities: "",
          resourceIds: "",
          webServerRedirectUri: "",
          scope: "",
          authorizedGrantTypes: [],
        },
        enums: {
          authorizedGrantTypesList: [
            {
              dataName: "authorization_code",
              dataValue: "authorization_code",
            },
            {
              dataName: "password",
              dataValue: "password",
            },
            {
              dataName: "refresh_token",
              dataValue: "refresh_token",
            },
            {
              dataName: "client_credentials",
              dataValue: "client_credentials",
            },
            {
              dataName: "ci",
              dataValue: "ci",
            },
          ],
        },
        rules: {},
      },
      formView: {
        config: [
          {
            col: 24, // 独占一行
            value: "clientName",
            label: "应用名称",
            type: "value",
            labelWidth: 200,
          },
          {
            col: 24, // 独占一行
            type: "value",
            label: "应用标识",
            value: "clientId",
            labelWidth: 200,
          },
          {
            col: 24, // 独占一行
            type: "value",
            label: "应用密钥(明文)",
            value: "clientSecretStr",
            labelWidth: 200,
          },

          {
            col: 24, // 独占一行
            type: "value",
            label: "应用密钥(bcyt) 加密",
            value: "clientSecret",
            labelWidth: 200,
          },
          // {
          //   col: 24, // 独占一行
          //   type: "value",
          //   label: "refresh_token有效期",
          //   value: "refreshTokenValidity",
          //   labelWidth: 200,
          //   maxLength:256,
          // },
          // {
          //   col: 24, // 独占一行
          //   type: "value",
          //   label: "access_token有效期",
          //   value: "accessTokenValidity",
          //   labelWidth: 200,
          //   maxLength:256,
          // },
          {
            col: 24, // 独占一行
            type: "value",
            label: "权限",
            value: "authorities",
            labelWidth: 200,
          },
          {
            col: 24, // 独占一行
            type: "value",
            label: "oauth授权方式",
            value: "authorizedGrantTypes",
            labelWidth: 200,
          },
          {
            col: 24, // 独占一行
            type: "value",
            label: "资源限定串(逗号分割)",
            value: "resourceIds",
            labelWidth: 200,
          },
          {
            col: 24, // 独占一行
            type: "value",
            label: "回调地址",
            value: "webServerRedirectUri",
            labelWidth: 200,
          },
          {
            col: 24, // 独占一行
            type: "value",
            label: "范围",
            value: "scope",
            labelWidth: 200,
          },
          {
            type: "value",
            label: "是否自动授权",
            value: "autoapprove",
            labelWidth: 200,
          },
        ],
        data: {
          clientName: "",
          clientId: "",
          clientSecretStr: "",
          autoapprove: true,
          clientSecret: "",
          refreshTokenValidity: "",
          accessTokenValidity: "",
          authorities: "",
          resourceIds: "",
          webServerRedirectUri: "",
          scope: "",
          authorizedGrantTypes: [],
        },
      },
      // source:''
    };
  },
  mounted() {
    this.getData(1);
  },
  methods: {
    formatter(key, val, row) {
      if (key === "autoapprove") {
        if (row["autoapprove"] == 'true') {
          return "<div class='enabled round-state'>是</div>";
        } else if (row["autoapprove"] == 'false') {
          return "<div class='wait round-state'>否</div>";
        }
      }
    },
    pageChanged(value) {
      this.table.page.pageNum = value;
      this.getData();
    },
    sizeChanged(value) {
      this.table.page.pageSize = value;
      this.getData();
    },
    getData(val) {
      if (val) {
        this.table.page.pageNum = val;
      }
      let params = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.form,
      };
      api_tableList(params).then((res) => {
        if (res.msg.code == "0000") {
          this.table.data = res.data.records.map((item) => {
            return item;
          });
          this.table.page.total = res.data.total;
        }
      });
    },
    delete(row) {
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api_delete({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getData(1);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(row) {
      this.title = "编辑项目密钥";
      this.dailogType = "edit";
      this.dialogVisible = true;
      this.getDetail(row);
    },
    see(row) {
      this.title = "查看项目密钥";
      this.dailogType = "view";
      this.dialogVisible = true;
      this.getDetail(row);
    },
    getDetail(row) {
      api_info({ id: row.id }).then((res) => {
        if (res.msg.code == "0000") {
          this.$nextTick(() => {
            this.form.data = { ...res.data };
            this.formView.data = { ...res.data };
            this.form.data.authorizedGrantTypes =
              this.form.data.authorizedGrantTypes &&
              this.form.data.authorizedGrantTypes.split(",");
            this.form.data.autoapprove = this.form.data.autoapprove&&this.form.data.autoapprove=="true"?true:false;
            this.active = this.formView.data.autoapprove == 'true' ? "是" : "否";
            this.formView.data.autoapprove = this.formView.data.autoapprove == 'true'
              ? "是"
              : "否";
          });
        }
      });
    },
    add() {
      this.title = "新增项目密钥";
      this.dailogType = "edit";
      this.form.data = {
        clientName: "",
        clientId: "",
        clientSecretStr: "",
        autoapprove: true,
        clientSecret: "",
        refreshTokenValidity: "",
        accessTokenValidity: "",
        authorities: "",
        resourceIds: "",
        webServerRedirectUri: "",
        scope: "",
        authorizedGrantTypes: [],
      };
      this.active ='是'
      this.dialogVisible = true;
    },
    submit() {
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve(valid);
          }
        });
      });
      Promise.all([parameter]).then((valid) => {
        console.log(this.form.data);
        let params = {
          ...this.form.data,
        };
        params.authorizedGrantTypes = params.authorizedGrantTypes&&params.authorizedGrantTypes.join(",")||'';
        api_saveOrUpdate(params).then((res) => {
          if (res.msg.code == "0000") {
            if (params.id) {
              this.$message({
                type: "success",
                message: "编辑成功",
              });
            } else {
              this.$message({
                type: "success",
                message: "新增成功",
              });
            }
            this.getData(1);
            this.dialogVisible = false;
          }
        });
      });
    },
    close() {
      this.dialogVisible = false;
    },
    switchChange() {
      this.active = this.active == "是" ? "否" : "是";
    },
  },
};
</script>

<style lang="scss" scoped>
.projectKeyList {
  ::v-deep {
    .el-dialog__header {
      text-align: center;
    }
    .sr-view {
      .label-item {
        width: 28.8% !important;
      }
    }
  }
}
</style>
