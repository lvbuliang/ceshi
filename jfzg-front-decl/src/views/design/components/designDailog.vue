<template>
  <el-dialog :visible.sync="visible"
             :title="title"
             :width="'800px'"
             :before-close="handleClose"
             custom-class="sr-dialog"
             class="designDialog"
             :center="true">
    <div class="dialogCongtent">
      <SrAdd :config="form1.config"
             :otherConfig="otherConfig"
             :enums="form1.enums"
             :form="form1.data"
             :ref="`form1`"
             class="form"
             v-if="
          (title == '新增人员' || title == '编辑人员') &&
            !formData.companyData &&
            type
        "></SrAdd>
      <div class="nav"
           v-if="
          (title == '新增人员' || title == '编辑人员') &&
            formData.companyData &&
            type
        ">
        <img src="@/assets/design/design_company_nav.png"
             alt />
        <div class="nav_title">
          <div>
            <span class="title">{{ formData.companyData.companyName }}</span>
          </div>
          <div v-if="formData.companyData.companyCode">
            <div class="workNumbering">
              <label>编号：</label>
              <div class="projectNoBox">
                <span class="projectNo">{{
                  formData.companyData.companyCode
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SrAdd :config="form.config"
             :otherConfig="otherConfig"
             :enums="form.enums"
             :form="form.data"
             :ref="`form`"
             class="form"
             v-if="visible"></SrAdd>
    </div>
    <div class="dialog_footer">
      <el-button size="medium"
                 round
                 type="primary"
                 v-debounce="[() =>SrDialogSubmit(), config.deTime]"
               >
        提交
      </el-button>
      <el-button size="medium"
                 round
                 @click="SrDialogClose"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  api_userSetQuery,
  api_getCustomFormTemplate,
  api_userSetSave,
} from "@/api/index.js";
import { api_getAllDesignCompanyList } from "@/api/design/index.js";
import config from "@/settings";
export default {
  provide () {
    return {
      baseUrl: config.apiBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {
    title: {
      type: String,
      default () {
        return "新增公司";
      },
    },
    formData: {
      type: Object,
      default () {
        return {};
      },
    },
    type: {
      type: Boolean,
      default () {
        return true;
      },
    },
    visible: {
      type: Boolean,
      default () {
        return false;
      },
    },
  },
  data () {
    return {
      formConfig: [],
      form: {
        data: {},
        enums: {},
      },
      otherConfig: {
        labelNum: 120,
      },
       config,
      form1: {
        config: [
          {
            type: "select",
            name: "设计公司",
            placeholder: "请选择设计公司",
            bind: "companyId",
            dataList: "selectList",
            required: "请选择设计公司",
            trigger: "change",
            col: 24,
            change: this.companyIdChange,
          },
          {
            type: "input",
            name: "设计公司编号",
            placeholder: "请输入设计公司编码",
            bind: "companyCode",
            col: 24,
            disabled: true,
          },
        ],
        data: {
          companyId: "",
          companyCode: "",
        },
        enums: {
          selectList: [{ dataValue: "1", dataName: "我是选项1" }],
        },
      },
    };
  },
  watch: {
    visible: {
      handler: function (params) {
        if (params)
        {
          this.templateId = "";
          this.getCustomFormTemplate(this.title);
          this.getAllDesignCompanyList();
          if (this.title == "编辑人员" || this.title == "新增人员")
          {
            this.setCompanyData();
          }
        }
      },
    },
  },
  mounted () { },
  methods: {
    //切换公司
    companyIdChange (value) {
      let flag = this.form1.enums.selectList.find((item) => {
        return item.dataValue == value;
      });
      if (flag)
      {
        this.$set(this.form1.data, "companyCode", flag.companyCode);
      }
    },
    //编辑回写  设置已选定公司
    setCompanyData () {
      if (this.formData && this.formData.companyData)
      {
        this.form1.data.companyId = this.formData.companyData.companyId;
        this.form1.data.companyCode = this.formData.companyData.companyCode;
      }
      if (this.title == "编辑人员")
      {
        this.$set(this.form, "data", this.formData.companyData);
      }
    },
    //获取所哟公司
    getAllDesignCompanyList () {
      let params = {
        pageSize: 10000,
        pageNum: 1,
      };
      api_getAllDesignCompanyList(params).then((res) => {
        if (res.msg.code == "0000")
        {
          this.form1.enums.selectList = res.data.records.map((item) => {
            return {
              dataName: item.companyName,
              dataValue: item.id,
              companyCode: item.companyCode,
            };
          });
        }
      });
    },
    SrDialogClose () {
      if (this.form)
      {
        this.form.data = {};
      }
      if (this.fomr1)
      {
        this.fomr1.data = {};
      }
      this.$emit("SrDialogClose");
    },
    //保存
    SrDialogSubmit () {
      let data = {};
      if (this.title == "新增公司" || this.title == "编辑公司")
      {
        data = this.form.data;
      } else if (this.title == "新增人员" || this.title == "编辑人员")
      {
        data = { ...this.form.data, ...this.form1.data };
      }
      this.$refs["form"].validate((val) => {
        if (val)
        {
          this.$emit("SrDialogSubmit", data);
        }
      });
    },
    handleClose () {
      this.$emit("handleClose");
    },
    //自定义表单获取
    getCustomFormTemplate (type) {
      let params = {
        moduleCode: "11001",
        templateId: this.templateId,
      };
      if (type == "新增公司" || type == "编辑公司")
      {
        params.moduleCode = "11001";
      } else if (type == "新增人员" || type == "编辑人员")
      {
        params.moduleCode = "12001";
      }
      api_getCustomFormTemplate(params).then((res) => {
        if (res.msg.code == "0000")
        {
          let list = res.data.templateDetail
            ? JSON.parse(res.data.templateDetail)
            : [];
          if (list.length > 0)
          {
            this.form = JSON.parse(list[0].formArr)[0].selectData.formAdd;
          }
          if (this.title == "编辑人员")
          {
            this.$set(this.form, "data", this.formData.companyData);
          }
          this.templateId = res.data.id;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.designDialog {
  .el-dialog {
    .dialogCongtent {
      // padding: 24px;
      .nav {
        display: flex;
        padding: 17px 15px;
        background: #FAFAFA;
        img {
          width: 66px;
          height: 66px;
        }
      }
      .nav_title {
        .title {
          height: 32px;
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
        }
        .workNumbering {
          height: 20px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          display: flex;
        }
      }
      .form{
        margin-top: 24px;
      }
    }
    .el-dialog__header {
      display: block;
    }
    .el-dialog__body {
      padding: 0;
      .form{
        padding-right:24px;
      }
    }
    .el-dialog__header .el-dialog__headerbtn {
      position: absolute;
    }
    .dialog_footer {
      width: 100%;
      height: 56px;
      line-height: 56px;
      border-top: 1px solid #e8e8e8;
      text-align: center;
      .el-button {
      }
    }
  }
}
</style>
