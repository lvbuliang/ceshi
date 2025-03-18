<template>
  <div class="authList">
    <div class="form">
      <FForm
        ref="modelMgrRef"
        :config="form.config"
        :form="form.data"
        :rules="form.rules"
        :enums="form.enums"
        :other-config="otherConfig"
        refForm="modelMgrRefForm"
        :column="2"
      ></FForm>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="back">取 消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import FForm from "@/components/FForm/form-add";
import config from "@/settings.js";
import { listModule } from "@/api/index.js";
import {
  getTagCode,
  addTodoTemplate,
  editTodoTemplate,
} from "@/api/autotemplatemanagement/autotemplatemanagement.js";
export default {
  components: {
    FForm,
  },
  data() {
    return {
      otherConfig: {
        labelNum: 150,
      },
      form: {
        config: [
          {
            col: 12, // 独占一行
            type: "text",
            name: "模板名称",
            placeholder: "请输入模板名称",
            bind: "templateName",
            trigger: "blur", // 校验时机
            required: "请输入模板名称", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "模板编号",
            placeholder: "请输入模板编号",
            bind: "templateCode",
            trigger: "blur", // 校验时机
            required: "请输入模板编号", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "select",
            name: "来源",
            placeholder: "请选择来源",
            bind: "platform",
            dataList: "platformList",
            trigger: "blur", // 校验时机
            required: "请选择来源", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "select",
            name: "业务编码",
            placeholder: "请选择业务编码",
            bind: "modelCode",
            dataList: "typeList",
            trigger: "blur", // 校验时机
            required: "请选择业务编码", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "待办期限（天）",
            placeholder: "请输入待办期限（天）",
            bind: "limitDay",
            trigger: "blur", // 校验时机
            required: "请输入待办期限（天）", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "内容",
            placeholder: "请输入内容",
            bind: "schduleName",
            trigger: "blur", // 校验时机
            required: "请输入内容", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "按钮跳转链接",
            placeholder: "请输入按钮跳转链接",
            bind: "schduleUrl",
            trigger: "blur", // 校验时机
            required: "请输入按钮跳转链接", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "待办详情地址",
            placeholder: "请输入待办详情地址",
            bind: "schduleUrlRead",
            trigger: "blur", // 校验时机
            required: "请输入待办详情地址", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "单位id",
            placeholder: "请输入单位id",
            bind: "buid",
            trigger: "blur", // 校验时机
            required: "请输入单位id", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "解放id",
            placeholder: "请输入解放id",
            bind: "jfid",
            trigger: "blur", // 校验时机
            required: "请输入解放id", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "接收待办人/角色",
            placeholder: "请输入接收待办人/角色",
            bind: "jobHandler",
            trigger: "blur", // 校验时机
            required: "请输入接收待办人/角色", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "接收待办类型",
            placeholder: "请输入接收待办类型",
            bind: "jobHandlerType",
            trigger: "blur", // 校验时机
            required: "请输入接收待办类型", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "text",
            name: "按钮名称",
            placeholder: "请输入按钮名称",
            bind: "schduleUrlTitle",
            trigger: "blur", // 校验时机
            required: "请输入按钮名称", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "select",
            name: "待办标签",
            placeholder: "请选择待办标签",
            bind: "tagTypeCode",
            dataList: "tageList",
            trigger: "blur", // 校验时机
            required: "请选择待办标签", // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: "select",
            name: "是否发送短信",
            placeholder: "请选择是否发送短信",
            bind: "smsFlag",
            dataList: "smsFlagList",
            trigger: "blur", // 校验时机
            required: "请选择是否发送短信", // 必填需要指定提示信息
          },
        ],
        data: {
          templateName: "",
          templateCode: "",
          platform: "",
          buid: "#{buid}",
          jfid: "#{jfid}",
          jobHandler: "#{jobHandler}",
          jobHandlerType: "#{jobHandlerType}",
          modelCode: "",
          limitDay: "",
          schduleName: "",
          schduleUrl: "",
          schduleUrlRead: "",
          schduleUrlTitle: "去处理",
          tagTypeCode: "",
          smsFlag: "",
        },
        enums: {
          typeList: [],
          tageList: [],
          platformList: [
            {
              dataName: "解放智管",
              dataValue: "JFZG_CLOUD",
            },
            {
              dataName: "深圳智管",
              dataValue: "TEST_CLOUD",
            },
          ],
          smsFlagList: [
            { dataName: "发送", dataValue: "1" },
            { dataName: "不发送", dataValue: "0" },
          ],
        },

        rules: {},
      },
    };
  },
  computed: {
    rowData() {
      if (this.$route.query.rowData) {
        return JSON.parse(this.$route.query.rowData);
      }
    },
  },
  watch: {},
  mounted() {
    this.getMoubleCode();
    this.gettagCode();
    if (this.$route.query.rowData) {
      this.editFullData(this.rowData);
    }
  },
  methods: {
    editFullData(rowData) {
      console.log("初始化数据", rowData);
      this.form.data.templateName = rowData.templateName;
      this.form.data.templateCode = rowData.templateCode;
      this.form.data.modelCode = rowData.modelCode;
      this.form.data.platform = rowData.platform;
      this.form.data.limitDay = rowData.limitDay;
      this.form.data.smsFlag = rowData.smsFlag.toString();
      this.form.data.buid = JSON.parse(this.rowData.templateContext).buid;
      this.form.data.jfid = JSON.parse(this.rowData.templateContext).jfid;
      this.form.data.jobHandler = JSON.parse(
        this.rowData.templateContext
      ).jobHandler;
      this.form.data.jobHandlerType = JSON.parse(
        this.rowData.templateContext
      ).jobHandlerType;
      this.form.data.schduleName = JSON.parse(
        this.rowData.templateContext
      ).schduleName;
      this.form.data.schduleUrl = JSON.parse(
        this.rowData.templateContext
      ).schduleUrl;
      this.form.data.schduleUrlRead = JSON.parse(
        this.rowData.templateContext
      ).schduleUrlRead;
      this.form.data.schduleUrlTitle = JSON.parse(
        this.rowData.templateContext
      ).schduleUrlTitle;
      this.form.data.tagTypeCode = JSON.parse(
        this.rowData.templateContext
      ).tagTypeCode;
    },

    getMoubleCode() {
      listModule().then((res) => {
        if (res.msg.code === "0000") {
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.dataValue = item.moduleCode;
              obj.dataName = item.moduleName;
              arr.push(obj);
            }
          });
          this.form.enums.typeList = arr;
        }
      });
    },
    gettagCode() {
      getTagCode().then((res) => {
        if (res.msg.code === "0000") {
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.dataValue = item.tagTypeCode;
              obj.dataName = item.tagTypeName;
              arr.push(obj);
            }
          });
          this.form.enums.tageList = arr;
        }
      });
    },
    cancel() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
    },
    submit() {
      // this.submitData();
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
        if (valid) {
          this.submitData();
        }
      });
    },
    back() {
      this.$router.push({
        name: "todotemplateList",
      });
    },
    // /subplan/#/projectLibrary/projectLibraryWorkView?id=3&&temp=123123&projectCode=QWER
    submitData() {
      let obj = {
        templateCode: this.form.data.templateCode,
        templateName: this.form.data.templateName,
        platform: this.form.data.platform,
        modelCode: this.form.data.modelCode,
        limitDay: this.form.data.limitDay,
        smsFlag: this.form.data.smsFlag,
        templateContextEntity: {
          schduleName: this.form.data.schduleName,
          schduleUrl: this.form.data.schduleUrl,
          schduleUrlRead: this.form.data.schduleUrlRead,
          schduleUrlTitle: this.form.data.schduleUrlTitle,
          tagTypeCode: this.form.data.tagTypeCode,
          buid: this.form.data.buid,
          jfid: this.form.data.jfid,
          jobHandler: this.form.data.jobHandler,
          jobHandlerType: this.form.data.jobHandlerType,
        },
      };
      let str = "";
      let str2 = "";
      let idStr = "";
      let idStr2 = "";
      if (obj.templateContextEntity.schduleUrl.indexOf("?") != -1) {
        // 多个参数
        if (
          obj.templateContextEntity.schduleUrl.split("?")[1].indexOf("&") != -1
        ) {
          obj.templateContextEntity.schduleUrl
            .split("?")[1]
            .split("&")
            .forEach((a) => {
              console.log(a.split("="));
              if (a.split("=")[0] == "id") {
                // idStr = "id=#{objectId}&";
                idStr = a.split("=")[0] + "=" + a.split("=")[1] + "&";
              } else if (a.split("=")[0] != "id") {
                /* str +=
                  a.split("=")[0] + "=" + "#{" + a.split("=")[0] + "}" + "&"; */
                str += a.split("=")[0] + "=" + a.split("=")[1] + "&";
              }
            });

          obj.templateContextEntity.schduleUrl =
            obj.templateContextEntity.schduleUrl.split("?")[0] +
            "?" +
            idStr +
            str.slice(0, str.length - 1);
        }
        // 一个参数
        else {
          if (
            obj.templateContextEntity.schduleUrl.split("?")[1].split("=")[0] ==
            "id"
          ) {
            // idStr = "id=#{objectId}";
            idStr = obj.templateContextEntity.schduleUrl.split("?")[1].split("=")[0] + "=" + obj.templateContextEntity.schduleUrl.split("?")[1].split("=")[1] ;
            obj.templateContextEntity.schduleUrl =
              obj.templateContextEntity.schduleUrl.split("?")[0] + "?" + idStr;
          } else if (
            obj.templateContextEntity.schduleUrl.split("?")[1].split("=")[0] !=
            "id"
          ) {
            /* str =
              obj.templateContextEntity.schduleUrl.split("?")[1].split("=")[0] +
              "=" +
              "#{" +
              obj.templateContextEntity.schduleUrl.split("?")[1].split("=")[0] +
              "}";
            obj.templateContextEntity.schduleUrl =
              obj.templateContextEntity.schduleUrl.split("?")[0] + "?" + str; */
            str =
              obj.templateContextEntity.schduleUrl.split("?")[1].split("=")[0] +
              "=" +
              obj.templateContextEntity.schduleUrl.split("?")[1].split("=")[1];
            obj.templateContextEntity.schduleUrl =
              obj.templateContextEntity.schduleUrl.split("?")[0] + "?" + str;
          }
        }
      }
      console.log(obj.templateContextEntity.schduleUrl);
      // 多个参数
      if (obj.templateContextEntity.schduleUrlRead.indexOf("?") != -1) {
        if (
          obj.templateContextEntity.schduleUrlRead.split("?")[1].indexOf("&") !=
          -1
        ) {
          obj.templateContextEntity.schduleUrlRead
            .split("?")[1]
            .split("&")
            .forEach((a) => {
              console.log(a.split("="));
              if (a.split("=")[0] == "id") {
                // idStr2 = "id=#{objectId}&";
                idStr2 = a.split("=")[0] + "=" + a.split("=")[1] + "&";
              } else if (a.split("=")[0] != "id") {
                /* str2 +=
                  a.split("=")[0] + "=" + "#{" + a.split("=")[0] + "}" + "&"; */
                str2 += a.split("=")[0] + "=" + a.split("=")[1] + "&";
              }
            });
          obj.templateContextEntity.schduleUrlRead =
            obj.templateContextEntity.schduleUrlRead.split("?")[0] +
            "?" +
            idStr2 +
            str2.slice(0, str2.length - 1);
        }
        // 一个参数
        else {
          if (
            obj.templateContextEntity.schduleUrlRead
              .split("?")[1]
              .split("=")[0] == "id"
          ) {
            // idStr2 = "id=#{objectId}";
            idStr2 = obj.templateContextEntity.schduleUrlRead
              .split("?")[1]
              .split("=")[0] + "=" + obj.templateContextEntity.schduleUrlRead
              .split("?")[1]
              .split("=")[1];
            obj.templateContextEntity.schduleUrlRead =
              obj.templateContextEntity.schduleUrlRead.split("?")[0] +
              "?" +
              idStr2;
          } else if (
            obj.templateContextEntity.schduleUrlRead
              .split("?")[1]
              .split("=")[0] != "id"
          ) {
            /* str2 =
              obj.templateContextEntity.schduleUrlRead
                .split("?")[1]
                .split("=")[0] +
              "=" +
              "#{" +
              obj.templateContextEntity.schduleUrlRead
                .split("?")[1]
                .split("=")[0] +
              "}";
            obj.templateContextEntity.schduleUrlRead =
              obj.templateContextEntity.schduleUrlRead.split("?")[0] +
              "?" +
              str2; */
            str2 =
              obj.templateContextEntity.schduleUrlRead
                .split("?")[1]
                .split("=")[0] +
              "=" +
              obj.templateContextEntity.schduleUrlRead
                .split("?")[1]
                .split("=")[1];
            obj.templateContextEntity.schduleUrlRead =
              obj.templateContextEntity.schduleUrlRead.split("?")[0] +
              "?" +
              str2;
          }
        }
      }
      console.log("obj", obj);
      // 编辑
      if (this.$route.query.rowData) {
        obj.templateId = this.rowData.templateId;
        editTodoTemplate(obj).then((res) => {
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "编辑成功!",
            });
            this.$router.push({
              name: "todotemplateList",
            });
          }
        });
      } else {
        addTodoTemplate(obj).then((res) => {
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            this.$router.push({
              name: "todotemplateList",
            });
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.authList {
  /deep/ .form {
    .dialog-footer {
      margin-left: 270px;
    }
    .el-form {
      .el-form-item {
        display: flex;
        align-items: center;
        width: 100% !important;
      }
      .el-form-item__content {
        width: 500px !important;
        margin-left: 20px !important;
      }
    }
  }
}
</style>
