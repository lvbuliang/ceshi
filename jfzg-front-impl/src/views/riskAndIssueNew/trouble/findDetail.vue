<template>
    <!-- 查看详情 -->
    <div class="total-page">
      <span style="margin: 40px 0 32px 40px;font-size: 16px;font-weight: 800; color: #000;">问题基本信息</span>
      <SrAdd
        class="sradd"
        :config="form.config"
        :enums="form.enums"
        :form="form.data"
        :otherConfig="form.otherConfig"
        ref="add1"
      >
      </SrAdd>
      <div class="cen">
        <!-- style="margin: 40px 0 32px 40px;font-size: 16px;font-weight: 800; color: #000;" -->
        <span style="font-size: 16px;font-weight: 800; color: #000;">操作</span>
        <div class="one">
            <p>处理结果:</p>
            <div>
              <el-button type="primary">跟进</el-button>
              <el-button>转办</el-button>
              <el-button>关闭</el-button>
            </div>
        </div>
        <div class="two">
            <p>处理意见:</p>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="textarea">
            </el-input>
        </div>
        <div class="three">
          <p>处理日期:</p>
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <sr-work-flow
        :hideFrom="true"
        :clickMethods="clickmethods"
        :buttonList="buttonList"
        ref="work_flow"
        backName="report"
      ></sr-work-flow>
    </div>
  </template>
  <script>
  import TestFormAdd from "../../../components/srFormAdd.vue";
  import { api_getCustomFormTemplate } from "@/api/index";
  import config from "@/settings.js";
  import upload from "@/utils/upload";
  export default {
    name: "SrSettingTable",
    components: { TestFormAdd },
    provide() {
      return {
        baseUrl: config.uploadBaseUrl,
        imgBaseUrl: config.imgBaseUrl,
        uploadRequest: upload,
        uploadBaseUrl: config.uploadBaseUrl,
      };
    },
    props: {},
    updated() {},
    data() {
      return {
        templateId: this.$route.query.templateId,
        clickmethods: { tg: this.tg, btg: this.btg },
        buttonList: [
          {
            role: "",
            btns: [
              {
                btnValue: "btg",
                btnName: "保存",
                btnType: "primary",
                btnEventType: "btg",
              },
            ],
            nodes: [
              {
                dataName: "",
                dataValue: "节点值0",
              },
            ],
          },
        ],
        // 新增周报
        form: {
          otherConfig: {
            labelNum: 140,
          },
          config: [
            {
              type: "input",
              name: "问题描述",
              placeholder: "请输入",
              bind: "systemName",
              dataList: "systemNameList",
              trigger: "change",
              col: 24,
              required: "问题描述不能为空",
            },
            {
              type: "select",
              name: "问题类型",
              placeholder: "请选择",
              bind: "systemName",
              dataList: "systemNameList",
              trigger: "change",
              col: 8,
              required: "问题类型不能为空",
            },
            {
              type: "select",
              name: "问题等级",
              placeholder: "请选择",
              bind: "projectName",
              dataList: "projectNameList",
              trigger: "change",
              col: 8,
              required: "问题等级不能为空",
            },
            {
              type: "input",
              name: "提出人",
              placeholder: "请输入",
              bind: "contactName",
              trigger: "change",
              col: 8,
              // required: "项目负责人不能为空",
            },
            {
              type: "select",
              name: "问题处理人",
              placeholder: "请选择",
              bind: "programManagerName",
              dataList: "contactNameList",
              // trigger: "change",
              col: 8,
              // required: "所属阶段不能为空",
            },
            {
              type: "input",
              name: "责任处室/部门",
              placeholder: "请输入",
              bind: "clientManagerName",
              col: 8,
              // required: "周报期别不能为空",
              // trigger: "blur",
              // rules: {
              //   regular_Number3: "只能输入数字",
              // },
            },
            {
              type: "select",
              name: "责任人",
              placeholder: "请输入",
              bind: "clientManagerName",
              col: 8,
              // required: "周报期别不能为空",
              // trigger: "blur",
              // rules: {
              //   regular_Number3: "只能输入数字",
              // },
            }
            // {
            //   type: "textarea",
            //   name: "工作推进情况",
            //   placeholder: "请输入工作推进情况",
            //   bind: "clientManagerName1",
            //   col: 24,
            //   maxlength: 1000,
            //   row: 3,
            //   resize: "none",
            //   required: "工作推进情况不能为空",
            // },
            // {
            //   type: "textarea",
            //   name: "下周工作计划",
            //   placeholder: "请输入下周工作计划",
            //   bind: "clientManagerName2",
            //   col: 24,
            //   maxlength: 1000,
            //   row: 3,
            //   resize: "none",
            //   required: "下周工作计划不能为空",
            // },
            // {
            //   type: "slot",
            //   slotName: "existProblem",
            //   name: "存在的问题",
            //   // placeholder: "请输入下周工作计划",
            //   // bind: "clientManagerName",
            //   col: 24,
            //   // required: "下周工作计划不能为空",
            // },
            // {
            //   type: "slot",
            //   slotName: "addProblem",
            //   name: "新增问题",
            //   // placeholder: "请输入下周工作计划",
            //   // bind: "clientManagerName",
            //   col: 24,
            //   // required: "下周工作计划不能为空",
            // },
            // {
            //   type: "upload",
            //   name: "附件",
            //   className: "fujian",
            //   bind: "preliminaryExaminationAnnex",
            //   fileList: [],
            //   fileTip:
            //     "支持扩展名:.doc.docx.pdf.xls.xlsx.ppt.jpg.png，最多上传5个文件，每个文件大小不超过20MB",
            //   fileType: "doc,docx,pdf,xls,xlsx,ppt,jpg,png",
            //   limit: 5,
            //   tipPopover: true, // hover显示提示  默认外面显示
            //   col: 24,
            // },
          ],
          data: {
            contactName: "",
            programManagerId: "",
            contactName1: "",
            programManagerName: "",
            jhxmExpert: [],
            clientManagerName: "",
            clientManagerName1: "",
            clientManagerName2: "",
            preliminaryExaminationAnnex: "",
          },
          enums: {
            contactNameList: [], //项目负责人
            systemNameList: [], //系统名称
            projectNameList: [], //项目名称
            // clientManagerList: [],
  
            // contractUnitFullName: [],
            // controlUnitFullName: [],
          },
        },
        
      };
    },
    created() {
      if (this.$route.query.isReadonly) {
        this.$set(this.form.config[0], "disabled", true);
        this.$set(this.form.config[1], "disabled", true);
        this.$set(this.form.config[2], "disabled", true);
        this.$set(this.form.config[3], "disabled", true);
      }
    },
    mounted() {},
    methods: {
  
      getQueryBizunitsByPropertyA(d) {
        getQueryBizunitsByProperty({ buPropertyEnum: d }).then((res) => {
          if (d == "CJDW") {
            console.log("sdadadad", res.data);
            res.data.map((element) => {
              console.log("elemenememe", element.buName);
              this.form.enums.contractUnitFullName.push({
                dataName: String(element.buName),
                dataValue: String(element.buid),
              });
            });
            console.log("ioioioi", this.form.enums.contractUnitFullName);
          } else {
            // this.controlUnitFullName = res.data
            res.data.map((element) => {
              console.log("elemenememe", element.buName);
              this.form.enums.controlUnitFullName.push({
                dataName: String(element.buName),
                dataValue: String(element.buid),
              });
            });
          }
        });
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  .total-page {
    background: #fff;
    height: 50vh;
  }
  .sradd {
    margin-top: 40px;
    padding:0 80px;
  }
  ::v-deep .el-tabs__header {
    padding: 20px !important;
    padding-bottom: 0 !important;
  }
  .btns {
    width: 80px;
    text-align: center;
    height: 34px;
    font-size: 12px;
    line-height: 34px;
    border-radius: 4px;
    color: rgba(66, 130, 255, 1);
    background: rgba(66, 130, 255, 0.1);
    cursor: pointer;
    border: 1px dashed rgba(66, 130, 255, 1);
  }
  ::v-deep .sr_table {
    margin-bottom: 16px;
  }
  ::v-deep .el-dialog .el-dialog__header {
    height: 56px;
    margin: 0 24px;
    padding: 16px 0;
    text-align: left;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    border-bottom: 1px solid #e8e8e8;
    .el-dialog__title {
      font-size: 14px;
    }
  }
  ::v-deep .el-dialog__footer {
    height: 66px;
    .el-button {
      padding: 9px 27px;
    }
  }
  .cen {
    display: block;
    margin: 10px 40px;
    .one {
      margin: 24px 0;
      display: flex;
      div {
        .el-button {
          width: 4vw;
          height: 3vh;
          padding: 0;
        }
      }
    }
    .two {
      margin: 24px 0;
      display: flex;
      .el-textarea {
        width: 40vw;
        // height: 10vh;
      }
      
    }
    .three {
      display: flex;
    }
  }
  .el-textarea__inner {
    height: 100% !important;
  }
  .cen p{
    width: 4vw;
  }
  </style>
  