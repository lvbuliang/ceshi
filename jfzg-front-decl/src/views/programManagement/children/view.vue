<template>
  <div class="total-page">
    <srNavPage :project="srNavPageObj"></srNavPage>
    <TestFormView
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :fromData="fromData"
      :tableData="tableData"
      :form="form"
      :isPlan="isPlan"
    >
    </TestFormView>
    <sr-work-flow
      class="srworkflow"
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      :clickMethods="clickmethods"
      backName="programManagement"
      :hideTrackIcon="true"
    ></sr-work-flow>
  </div>
</template>

<script>
import { queryBizunitsByProperty, queryUnitMembersBy } from "@/api/index";
import TestFormAdd from "../../../components/srFormAdd.vue";
import TestFormView from "../../../components/srFormView.vue";
import { api_specialDetail, api_getCustomFormTemplate } from "@/api/index";
import {
  getDetailById,
  queryUpdate,
  api_getServiceTypeList,
} from "@/api/planProject/index";
// 年度计划
import { viewYearPlan } from "@/api/yearPlan/index";
import {
  getSpecialProjectDetailById,
  getXMBADetailById,
  api_detail,
  api_update,
} from "@/api/programManagement";
import srNavPage from "../components/srNavPage.vue";
export default {
  components: {
    TestFormView,
    TestFormAdd,
    srNavPage,
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
  provide() {
    return {
      baseUrl: "",
      imgBaseUrl: "",
      uploadRequest: "",
      uploadBaseUrl: "",
    };
  },
  watch: {},
  data() {
    return {
      editableTabs: [],
      editableTabs2: [],
      editableTabs3: [],
      templateId2: null,
      activeName: "0",
      srNavPageObj: {},
      fromData: {},
      fromData2: {},
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
          nodes: [],
          showForm: true,
        },
      ],
      jsdwlist: [],
      jsdwjbrlist: [],
      cjdwlist: [],
      cjdwjbrlist: [],
      jldwlist: [],
      jldwjbrlist: [],
      clickmethods: { btg: this.btg },
      addTaskForm: "",
      serverList: [], //服务类型
      projectScopePublicSideList: [], //公众侧
      projectScopeGovernmentSideList: [], //政务侧
      constructionBasisList: [], //建设依据
      tableData: [], //重点列表
      form: [],
      isPlan: true,
      workFlowConfig: {
        config: [
          {
            type: "dateSelect",
            timeType: "daterange",
            name: "清单预计申报时间",
            bind: "jhxmExpert",
            // disabled: true,禁用
            // readonly: true,只读
            unlinkPanels: true,
            col: 12,
            startname: "jhxmExpertStartTime",
            endname: "jhxmExpertEndTime",
            // required: "未选择专家聘期",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            format: "yyyy-MM-dd",
          },
          {
            type: "dateSelect",
            timeType: "daterange",
            name: "方案预计申报时间",
            bind: "project",
            unlinkPanels: true,
            col: 12,
            startname: "projectExpertStartTime",
            endname: "projectExpertEndTime",
            // required: "未选择专家聘期",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            format: "yyyy-MM-dd",
          },
          {
            type: "dateSelect",
            timeType: "daterange",
            name: "合同预计签约时间",
            bind: "contract",
            unlinkPanels: true,
            col: 12,
            startname: "contractExpertStartTime",
            endname: "contractExpertEndTime",
            // required: "未选择专家聘期",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            format: "yyyy-MM-dd",
          },
          {
            type: "dateSelect",
            timeType: "daterange",
            name: "预计建设实施时间",
            bind: "construct",
            unlinkPanels: true,
            col: 12,
            startname: "constructExpertStartTime",
            endname: "constructExpertEndTime",
            // required: "未选择专家聘期",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            format: "yyyy-MM-dd",
          },
          {
            type: "dateSelect",
            timeType: "daterange",
            name: "预计合同初验时间",
            bind: "contractIntiativeTest",
            unlinkPanels: true,
            col: 12,
            startname: "contractIntiativeTestExpertStartTime",
            endname: "contractIntiativeTestExpertEndTime",
            // required: "未选择专家聘期",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            format: "yyyy-MM-dd",
          },
          {
            type: "dateSelect",
            timeType: "daterange",
            name: "预计合同终验时间",
            bind: "contractFinalInspection",
            unlinkPanels: true,
            col: 12,
            startname: "contractFinalInspectionExpertStartTime",
            endname: "contractFinalInspectionExpertEndTime",
            // required: "未选择专家聘期",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            format: "yyyy-MM-dd",
          },
          {
            type: "dateSelect",
            timeType: "daterange",
            name: "预计评价时间",
            bind: "evaluate",
            unlinkPanels: true,
            col: 12,
            startname: "evaluateExpertStartTime",
            endname: "evaluateExpertEndTime",
            // required: "未选择专家聘期",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            format: "yyyy-MM-dd",
          },
        ],
        data: {
          jhxmExpert: [],
          project: [],
          contract: [],
          construct: [],
          contractIntiativeTest: [],
          contractFinalInspection: [],
          evaluate: [],
        },
        enums: {},
      }, //工作流表单
    };
  },
  watch: {
    workFlowConfig: {
      handler(v) {
        console.log(v);
      },
      deep: true,
    },
  },
  methods: {
    btg() {
      let {
        jhxmExpert,
        project,
        contract,
        construct,
        contractIntiativeTest,
        contractFinalInspection,
        evaluate,
      } = this.workFlowConfig.data;
      let params = {
        id: this.$route.query.detailId,
        jhxmExpertStartTime: jhxmExpert ? jhxmExpert[0] : "",
        jhxmExpertEndTime: jhxmExpert ? jhxmExpert[1] : "",
        projectExpertStartTime: project ? project[0] : "",
        projectExpertEndTime: project ? project[1] : "",
        contractExpertStartTime: contract ? contract[0] : "",
        contractExpertEndTime: contract ? contract[1] : "",
        constructExpertStartTime: construct ? construct[0] : "",
        constructExpertEndTime: construct ? construct[1] : "",
        contractIntiativeTestExpertStartTime: contractIntiativeTest
          ? contractIntiativeTest[0]
          : "",
        contractIntiativeTestExpertEndTime: contractIntiativeTest
          ? contractIntiativeTest[1]
          : "",
        contractFinalInspectionExpertStartTime: contractFinalInspection
          ? contractFinalInspection[0]
          : "",
        contractFinalInspectionExpertEndTime: contractFinalInspection
          ? contractFinalInspection[1]
          : "",
        evaluateExpertStartTime: evaluate ? evaluate[0] : "",
        evaluateExpertEndTime: evaluate ? evaluate[1] : "",
      };
      console.log("params", params);
      api_update(params).then((res) => {
        console.log("res", res);
        if (res.msg.code == "0000") {
          this.$message.success("保存成功");
          this.$router.push({ name: "programManagement" });
        }
      });
    },
    handleClick(tab, event) {},
    forInItem(obj, val) {
      // 根据对应字段获取对象里对应的键和值
      if (typeof obj != "object" && typeof val != "string") return false;
      let newObj = {};
      for (const key in obj) {
        if (val.includes(key)) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    },
    getConfigBind(arr, key) {
      // 获取数组里对应键的值
      return Array.isArray(arr) && arr.map((item) => item[key]);
    },
    onRadioChange(val, item, k) {
      // 是否需要检查人的值切换
      if (item.bind == "contractUnit") {
        this.resetChecker(val, k);
      } else if (item.bind == "controlUnit") {
        this.resetChecker2(val, k);
      }
    },
    // 处理初始化项目类型问题
    getServerList() {
      let publicServerList = [];
      let personServerList = [];
      let projectScopePublicSideList = []; //公众侧
      let projectScopeGovernmentSideList = []; //政务侧
      let constructionBasisList = []; //建设依据
      api_getServiceTypeList({ topic: "JHXMK_SERVICE_TYPE_PUBLIC" }).then(
        (res) => {
          res.data.map((item) => {
            publicServerList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.serverList.push(...publicServerList);
        }
      );
      api_getServiceTypeList({ topic: "JHXMK_SERVICE_TYPE_PROFESSIONAL" }).then(
        (res) => {
          res.data.map((item) => {
            personServerList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.serverList.push(...personServerList);
        }
      );
      // 公众侧
      api_getServiceTypeList({ topic: "PROJECT_SCOPE_PUBLIC" }).then((res) => {
        res.data.map((item) => {
          projectScopePublicSideList.push({
            label: item.chName,
            value: item.itemCode,
          });
        });
        this.projectScopePublicSideList.push(...projectScopePublicSideList);
      });
      // 政务侧
      api_getServiceTypeList({ topic: "PROJECT_SCOPE_GOVERNMENT" }).then(
        (res) => {
          res.data.map((item) => {
            projectScopeGovernmentSideList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.projectScopeGovernmentSideList.push(
            ...projectScopeGovernmentSideList
          );
        }
      );
      // 建设依据
      api_getServiceTypeList({ topic: "JHXMK_CONSTRUCTION_BASIS" }).then(
        (res) => {
          res.data.map((item) => {
            constructionBasisList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.constructionBasisList.push(...constructionBasisList);
        }
      );
    },
    // 项目备案
    getXMBA() {
      getXMBADetailById({ id: this.$route.query.id }).then((res) => {
        // if (res.data.contentFile) {
        //   res.data.contentFile = JSON.parse(res.data.contentFile);
        // } else if (res.data.otherFile) {
        //   res.data.otherFile = JSON.parse(res.data.otherFile);
        // }
        if (res.data) {
          console.log(res.data);
          // 重点列表
          this.tableData = res.data.keyTaskList;
          this.form = res.data.planDtos;
          res.data.constructionCycle =
            (res.data.beginDate || "-") + "至" + (res.data.endDate || "-");
          res.data.isPwdProject = res.data.isPwdProject == 1 ? "是" : "否";
          console.log("DHW2", res, res.data.serviceType);
          if (res.data.serviceType) {
            // 服务类型处理
            let list = [];
            res.data.serviceType.map((item1) => {
              this.serverList.map((item) => {
                if (item.value == item1) {
                  list.push(item.label);
                }
              });
              res.data.serviceType = list.toString();
            });
          }
          if (res.data.constructionBasis) {
            // 建设依据处理
            let list = [];
            res.data.constructionBasis.map((item1) => {
              this.constructionBasisList.map((item) => {
                if (item1 == item.value) {
                  list.push(item.label);
                }
              });
              res.data.constructionBasis = list.toString();
            });
          }
          // 业务范围-公众侧
          if (
            res.data.projectScopePublicSide.indexOf("[") !== -1 &&
            res.data.projectScopePublicSide.indexOf("]") !== -1
          ) {
            let list = [];
            let pattern2 = new RegExp("[A-Za-z]+");
            res.data.projectScopePublicSide = JSON.parse(
              res.data.projectScopePublicSide
            ).map((item) => {
              console.log(item);
              if (!pattern2.test(item)) {
                list.push(item);
              }
              this.projectScopePublicSideList.map((item1) => {
                console.log(item1);
                if (item1.value == item) {
                  list.push(item1.label);
                }
              });
            });
            res.data.projectScopePublicSide = list.toString();
          } else {
            res.data.projectScopePublicSide = res.data.projectScopePublicSide;
          }
          // 业务范围-政务侧
          if (
            res.data.projectScopeGovernmentSide.indexOf("[") !== -1 &&
            res.data.projectScopeGovernmentSide.indexOf("]") !== -1
          ) {
            let list = [];
            let pattern2 = new RegExp("[A-Za-z]+");
            res.data.projectScopeGovernmentSide = JSON.parse(
              res.data.projectScopeGovernmentSide
            ).map((item) => {
              console.log(item);
              if (!pattern2.test(item)) {
                list.push(item);
              }
              this.projectScopeGovernmentSideList.map((item1) => {
                console.log(item1);
                if (item1.value == item) {
                  list.push(item1.label);
                }
              });
            });
            res.data.projectScopeGovernmentSide = list.toString();
          } else {
            res.data.projectScopeGovernmentSide =
              res.data.projectScopeGovernmentSide;
          }
          // res.data.selfInspectionAppendix = JSON.parse(
          //   res.data.selfInspectionAppendix
          // );
          // res.data.projectProposalAppendix = JSON.parse(
          //   res.data.projectProposalAppendix
          // );
          // console.log(res, projectType2);
          // // 文件处理
          // res.data.applicantUnitOpinions = JSON.parse(
          //   res.data.applicantUnitOpinions
          // );
          res.data.xmlxsqh = JSON.parse(res.data.xmlxsqh);
          res.data.xmlxsqb = JSON.parse(res.data.xmlxsqb);
          res.data.xmlxfa = JSON.parse(res.data.xmlxfa);
          res.data.xmlxfaml = JSON.parse(res.data.xmlxfaml);
          res.data.xmlzyj = JSON.parse(res.data.xmlzyj);
          res.data.sczjyj = JSON.parse(res.data.sczjyj);
          res.data.syxzzjddxmlxyj = JSON.parse(res.data.syxzzjddxmlxyj);
          res.data.mmyyshyj = JSON.parse(res.data.mmyyshyj);
          res.data.projectDescription = JSON.parse(res.data.projectDescription);
          res.data.otherAppendix = JSON.parse(res.data.otherAppendix);
          // res.data.contentFile = contentFile && JSON.parse(contentFile);
        }
        if (res.data && res.data.planType == 2) {
          // 规划类型0 无 1、专项规划 2、总体规划
          res.data.ztplan = res.data.planName;
          res.data.planName = "";
        }
        this.srNavPageObj = res.data;
        let data = res.data.data;
        // let data=res.data
        console.log(this.srNavPageObj);
        api_getCustomFormTemplate({
          moduleCode: "6001",
          // templateId: this.templateId,
        }).then((res1) => {
          console.log("res1", res1);
          this.editableTabs = JSON.parse(res1.data.templateDetail);
          this.editableTabs.forEach((item) => {
            item.formArr = JSON.parse(item.formArr);
            console.log("data", res.data);
            item.formArr.forEach((item1, index) => {
              item.formArr[index].selectData.formView.data = res.data;
              for (
                let k = 0;
                k < item1.selectData.formView.config.length;
                k++
              ) {
                // 处理计划完成时间为空时不显示
                if (
                  item1.selectData.formView.config[k] &&
                  item1.selectData.formView.config[k].value ==
                    "projectPlanFinishTime" &&
                  (res.data.projectPlanFinishTime == "" ||
                    res.data.projectPlanFinishTime == null)
                ) {
                  item1.selectData.formView.config[k].isHide = true;
                }
              }
            });
          });
        });
      });
    },
    // 方案审核与专项增补
    getZXFA() {
      getSpecialProjectDetailById({ id: this.$route.query.id }).then((res) => {
        if (res.data) {
          res.data.constructionUnit = res.data.constructUnitFullName;
          console.log(res.data.constructUnitFullName);
          //}
          // 密码应用
          res.data.isPwdProject = res.data.isPwdProject == 1 ? "是" : "否";
          // 重点列表
          this.tableData = res.data.keyTaskList;
          this.form = res.data.planDtos;
          console.log(res.data);
          res.data.constructionCycle =
            (res.data.beginDate || "-") + "至" + (res.data.endDate || "-");
          console.log("DHW2", res, res.data.serviceType);
          if (res.data.serviceType) {
            // 服务类型处理
            let list = [];
            res.data.serviceType.map((item1) => {
              this.serverList.map((item) => {
                if (item.value == item1) {
                  list.push(item.label);
                }
              });
              res.data.serviceType = list.toString();
            });
          }
          if (res.data.constructionBasis) {
            // 建设依据处理
            let list = [];
            res.data.constructionBasis.map((item1) => {
              this.constructionBasisList.map((item) => {
                if (item1 == item.value) {
                  list.push(item.label);
                }
              });
              res.data.constructionBasis = list.toString();
            });
          }
          // 业务范围-公众侧
          if (
            res.data.projectScopePublicSide &&
            res.data.projectScopePublicSide.indexOf("[") !== -1 &&
            res.data.projectScopePublicSide.indexOf("]") !== -1
          ) {
            let list = [];
            let pattern2 = new RegExp("[A-Za-z]+");
            res.data.projectScopePublicSide = JSON.parse(
              res.data.projectScopePublicSide
            ).map((item) => {
              console.log(item);
              if (!pattern2.test(item)) {
                list.push(item);
              }
              this.projectScopePublicSideList.map((item1) => {
                console.log(item1);
                if (item1.value == item) {
                  list.push(item1.label);
                }
              });
            });
            res.data.projectScopePublicSide = list.toString();
          } else {
            res.data.projectScopePublicSide = res.data.projectScopePublicSide;
          }
          // 业务范围-政务侧
          if (
            res.data.projectScopeGovernmentSide &&
            res.data.projectScopeGovernmentSide.indexOf("[") !== -1 &&
            res.data.projectScopeGovernmentSide.indexOf("]") !== -1
          ) {
            let list = [];
            let pattern2 = new RegExp("[A-Za-z]+");
            res.data.projectScopeGovernmentSide = JSON.parse(
              res.data.projectScopeGovernmentSide
            ).map((item) => {
              console.log(item);
              if (!pattern2.test(item)) {
                list.push(item);
              }
              this.projectScopeGovernmentSideList.map((item1) => {
                console.log(item1);
                if (item1.value == item) {
                  list.push(item1.label);
                }
              });
            });
            res.data.projectScopeGovernmentSide = list.toString();
          } else {
            res.data.projectScopeGovernmentSide =
              res.data.projectScopeGovernmentSide;
          }
          // res.data.selfInspectionAppendix = JSON.parse(
          //   res.data.selfInspectionAppendix
          // );
          // res.data.projectProposalAppendix = JSON.parse(
          //   res.data.projectProposalAppendix
          // );
          res.data.yearPlanId = res.data.yearPlanName; //处理查看页面年度计划字段
          if (res.data.yearPlanId) {
            this.yearPlanId = res.data.yearPlanId;
          }
          /*  // // 文件处理
          // res.data.applicantUnitOpinions = JSON.parse(
          //   res.data.applicantUnitOpinions
          // );
          res.data.xmlxsqh = JSON.parse(res.data.xmlxsqh);
          res.data.xmlxsqb = JSON.parse(res.data.xmlxsqb);
          res.data.xmlxfa = JSON.parse(res.data.xmlxfa);
          res.data.xmlxfaml = JSON.parse(res.data.xmlxfaml);
          res.data.xmlzyj = JSON.parse(res.data.xmlzyj);
          res.data.sczjyj = JSON.parse(res.data.sczjyj);
          res.data.syxzzjddxmlxyj = JSON.parse(res.data.syxzzjddxmlxyj);
          res.data.mmyyshyj = JSON.parse(res.data.mmyyshyj); */
          res.data.projectDescription = JSON.parse(res.data.projectDescription);
          res.data.otherAppendix = JSON.parse(res.data.otherAppendix);
          // res.data.contentFile = contentFile && JSON.parse(contentFile);
        }
        if (res.data && res.data.planType == 2) {
          // 规划类型0 无 1、专项规划 2、总体规划
          res.data.ztplan = res.data.planName;
          res.data.planName = "";
        }
        this.srNavPageObj = res.data;
        let data = res.data.data;
        // let data=res.data
        console.log(this.srNavPageObj);
        api_getCustomFormTemplate({
          moduleCode: "18011",
          // templateId: this.templateId,
        }).then((res1) => {
          console.log("res1", res1);
          this.editableTabs = JSON.parse(res1.data.templateDetail);
          this.editableTabs.forEach((item) => {
            item.formArr = JSON.parse(item.formArr);
            console.log("data", data);
            item.formArr.forEach((item1, index) => {
              item.formArr[index].selectData.formView.data = res.data;
              for (
                let k = 0;
                k < item1.selectData.formView.config.length;
                k++
              ) {
                // 处理计划完成时间为空时不显示
                if (
                  item1.selectData.formView.config[k] &&
                  item1.selectData.formView.config[k].value ==
                    "projectPlanFinishTime" &&
                  (res.data.projectPlanFinishTime == "" ||
                    res.data.projectPlanFinishTime == null)
                ) {
                  item1.selectData.formView.config[k].isHide = true;
                }
                // 处理市财政局意见附件字段sczjyj
                if (
                  item1.selectData.formView.config[k] &&
                  item1.selectData.formView.config[k].value == "sczjyj" &&
                  (res.data.projectPlanFinishTime == "" ||
                    res.data.projectPlanFinishTime == null)
                ) {
                  item1.selectData.formView.config[k].isHide = true;
                }
                // 处理密码应用附件字段mmyyshyj
                if (
                  item1.selectData.formView.config[k] &&
                  item1.selectData.formView.config[k].value == "mmyyshyj" &&
                  (res.data.projectPlanFinishTime == "" ||
                    res.data.projectPlanFinishTime == null)
                ) {
                  item1.selectData.formView.config[k].isHide = true;
                }
              }
            });
          });
        });
      });
    },
    // 工作流表单查询
    getWorkflowDetail() {
      api_detail({ id: this.$route.query.detailId }).then((res) => {
        console.log("res", res);
        if (res.data) {
          this.workFlowConfig.data = {
            jhxmExpert: [
              res.data.jhxmExpertStartTime ? res.data.jhxmExpertStartTime : "",
              res.data.jhxmExpertEndTime ? res.data.jhxmExpertEndTime : "",
            ],
            project: [
              res.data.projectExpertStartTime
                ? res.data.projectExpertStartTime
                : "",
              res.data.projectExpertEndTime
                ? res.data.projectExpertEndTime
                : "",
            ],
            contract: [
              res.data.contractExpertStartTime
                ? res.data.contractExpertStartTime
                : "",
              res.data.contractExpertEndTime
                ? res.data.contractExpertEndTime
                : "",
            ],
            construct: [
              res.data.constructExpertStartTime
                ? res.data.constructExpertStartTime
                : "",
              res.data.constructExpertEndTime
                ? res.data.constructExpertEndTime
                : "",
            ],
            contractIntiativeTest: [
              res.data.contractIntiativeTestExpertStartTime
                ? res.data.contractIntiativeTestExpertStartTime
                : "",
              res.data.contractIntiativeTestExpertEndTime
                ? res.data.contractIntiativeTestExpertEndTime
                : "",
            ],
            contractFinalInspection: [
              res.data.contractFinalInspectionExpertStartTime
                ? res.data.contractFinalInspectionExpertStartTime
                : "",
              res.data.contractFinalInspectionExpertEndTime
                ? res.data.contractFinalInspectionExpertEndTime
                : "",
            ],
            evaluate: [
              res.data.evaluateExpertStartTime
                ? res.data.evaluateExpertStartTime
                : "",
              res.data.evaluateExpertEndTime
                ? res.data.evaluateExpertEndTime
                : "",
            ],
          };
        }
        console.log("this.workFlowConfig.data", this.workFlowConfig.data);
      });
    },
  },

  created() {
    // 如果是isSee为true去掉保存按钮以及表单只读
    if (this.$route.query.isSee == 1) {
      this.buttonList[0].btns = [];
      this.workFlowConfig.config.map((item) => {
        item.readonly = true;
      });
    }
    /* console.log("工作流", this.$refs.work_flow);
    this.$refs.work_flow.$refs.work_flow.form = {}; */
    this.getServerList();
    this.getWorkflowDetail();
    if (this.$route.query.source == 3) {
      getDetailById({ id: this.$route.query.id }).then((res) => {
        console.log("eeeee", res);
        // if (res.data.contentFile) {
        //   res.data.contentFile = JSON.parse(res.data.contentFile);
        // } else if (res.data.otherFile) {
        //   res.data.otherFile = JSON.parse(res.data.otherFile);
        // }
        if (res.data) {
          // if (res.data.constructionUnit == res.data.createBuid) {
          //   res.data.constructionUnit = "";
          // } else {
          res.data.constructionUnit = res.data.constructUnitFullName;
          console.log(res.data.constructUnitFullName);
          // }
          console.log(res.data);
          // 密码应用
          res.data.isPwdProject = res.data.isPwdProject == 1 ? "是" : "否";
          // 重点列表
          this.tableData = res.data.keyTaskList ? res.data.keyTaskList : [];
          this.form = res.data.planDtos;
          res.data.constructionCycle =
            (res.data.beginDate || "-") + "至" + (res.data.endDate || "-");
          if (res.data.serviceType) {
            // 服务类型处理
            let list = [];
            res.data.serviceType.map((item1) => {
              this.serverList.map((item) => {
                if (item.value == item1) {
                  list.push(item.label);
                }
              });
              res.data.serviceType = list.toString();
            });
          }
          if (res.data.constructionBasis) {
            // 建设依据处理
            let list = [];
            res.data.constructionBasis.map((item1) => {
              this.constructionBasisList.map((item) => {
                if (item1 == item.value) {
                  list.push(item.label);
                }
              });
              res.data.constructionBasis = list.toString();
            });
          }
          // 业务范围-公众侧
          if (
            res.data.projectScopePublicSide &&
            res.data.projectScopePublicSide.indexOf("[") !== -1 &&
            res.data.projectScopePublicSide.indexOf("]") !== -1
          ) {
            let list = [];
            let pattern2 = new RegExp("[A-Za-z]+");
            res.data.projectScopePublicSide = JSON.parse(
              res.data.projectScopePublicSide
            ).map((item) => {
              console.log(item);
              if (!pattern2.test(item)) {
                list.push(item);
              }
              this.projectScopePublicSideList.map((item1) => {
                console.log(item1);
                if (item1.value == item) {
                  list.push(item1.label);
                }
              });
            });
            res.data.projectScopePublicSide = list.toString();
          } else {
            res.data.projectScopePublicSide = res.data.projectScopePublicSide;
          }
          // 业务范围-政务侧
          if (
            res.data.projectScopeGovernmentSide &&
            res.data.projectScopeGovernmentSide.indexOf("[") !== -1 &&
            res.data.projectScopeGovernmentSide.indexOf("]") !== -1
          ) {
            let list = [];
            let pattern2 = new RegExp("[A-Za-z]+");
            res.data.projectScopeGovernmentSide = JSON.parse(
              res.data.projectScopeGovernmentSide
            ).map((item) => {
              console.log(item);
              if (!pattern2.test(item)) {
                list.push(item);
              }
              this.projectScopeGovernmentSideList.map((item1) => {
                console.log(item1);
                if (item1.value == item) {
                  list.push(item1.label);
                }
              });
            });
            res.data.projectScopeGovernmentSide = list.toString();
          } else {
            res.data.projectScopeGovernmentSide =
              res.data.projectScopeGovernmentSide;
          }
          res.data.yearPlanId = res.data.yearPlanName; //处理查看页面年度计划字段
          // console.log(res, projectType2);
          /* res.data.projectType = res.data.projectType2.join(","); */
          // // 文件处理
          // res.data.applicantUnitOpinions = JSON.parse(
          //   res.data.applicantUnitOpinions
          // );
          /* res.data.xmlxsqh = JSON.parse(res.data.xmlxsqh);
          res.data.xmlxsqb = JSON.parse(res.data.xmlxsqb);
          res.data.xmlxfa = JSON.parse(res.data.xmlxfa);
          res.data.xmlxfaml = JSON.parse(res.data.xmlxfaml);
          res.data.xmlzyj = JSON.parse(res.data.xmlzyj);
          res.data.sczjyj = JSON.parse(res.data.sczjyj);
          res.data.syxzzjddxmlxyj = JSON.parse(res.data.syxzzjddxmlxyj);
          res.data.mmyyshyj = JSON.parse(res.data.mmyyshyj); */
          res.data.projectDescription = JSON.parse(res.data.projectDescription);
          res.data.otherAppendix = JSON.parse(res.data.otherAppendix);
          // res.data.contentFile = contentFile && JSON.parse(contentFile);
        }
        if (res.data && res.data.planType == 2) {
          // 规划类型0 无 1、专项规划 2、总体规划
          res.data.ztplan = res.data.planName;
          res.data.planName = "";
        }
        this.srNavPageObj = res.data;
        let data = res.data.data;
        // let data=res.data
        console.log(this.srNavPageObj);
        api_getCustomFormTemplate({
          moduleCode: "18008",
          // templateId: this.templateId,
        }).then((res1) => {
          console.log("res1", res1);
          this.editableTabs = JSON.parse(res1.data.templateDetail);
          this.editableTabs.forEach((item) => {
            item.formArr = JSON.parse(item.formArr);
            item.formArr.forEach((item1, index) => {
              item.formArr[index].selectData.formView.data = res.data;
              for (
                let k = 0;
                k < item1.selectData.formView.config.length;
                k++
              ) {
                // 处理计划完成时间为空时不显示
                if (
                  item1.selectData.formView.config[k] &&
                  item1.selectData.formView.config[k].value ==
                    "projectPlanFinishTime" &&
                  res.data.projectPlanFinishTime == ""
                ) {
                  item1.selectData.formView.config[k].isHide = true;
                }
              }
            });
          });
        });
      });
    } else if (this.$route.query.source == 2) {
      this.getXMBA();
    } else if (this.$route.query.source == 0) {
      this.getZXFA();
    }
  },
  mounted() {
    this.form.data;
    this.$set(
      this.$refs.work_flow.$refs.work_flow,
      "form",
      this.workFlowConfig
    );
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__content {
  padding: 0;
}
.projectmemberclass {
  ::v-deep .el-tabs__header {
    display: none;
  }
}
.searchPage {
  display: flex;
  justify-content: space-between;
}
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}
.tabsLabel {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 24px;
  i {
    margin-right: 4px;
  }
}
::v-deep .el-tabs__header {
  margin-bottom: 8px;
}
.tabsDataTitle {
  margin-top: 8px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
.sr-view {
  padding: 8px 0;
}
::v-deep .sr-view .row_box > .el-col {
  margin-bottom: 0px;
}
// 工作流按钮隐藏
::v-deep .srworkflow .workflow_formAdd .workflow_formAdd_left {
  width: 100% !important;
  padding-right: 0 !important;
}
::v-deep .workflow .workflow_formAdd_left .sr-add .el-form {
  max-height: 212px;
}
</style>
<style lang="scss">
// 工作流按钮隐藏
/* .workflow .workflow_formAdd_left {
  width: 100% !important;
  padding-right: 0 !important;
} */
</style>
