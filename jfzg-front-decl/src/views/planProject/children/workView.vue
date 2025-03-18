<template>
  <div class="total-page workview">
    <!-- <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page> -->
    <srNavPage :project="srNavPageObj"></srNavPage>
    <TestFormView
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :hideTrackIcon="true"
      :tableData="tableData"
      :form="form"
      :isPlan="isPlan"
    >
    </TestFormView>
    <!-- <sr-work-flow
      v-if="buttonList.length"
      ref="work_flow"
      :taskId="taskId"
      :buttonList="buttonList"
      backName="projectLibrary"
    ></sr-work-flow> -->
    <WorkFlow1
      v-if="buttonList.length"
      ref="work_flow"
      :taskId="taskId"
      :buttonList="buttonList"
      backName="planProject"
      :auditJson="auditJson"
      :createBuid="createBuid"
      :currentStatus="currentStatus"
      :currentKind="currentKind"
      :clickMethods="clickmethods"
      @openExpert="openExpert"
      @openPinionSolverd="openPinionSolverd"
      :expertViewList="expertViewList"
    ></WorkFlow1>
    <ExpertSelectDialog
      :dialogVisible="expertSelectDialog"
      @close="closeExpertSelectDialog"
      v-if="expertSelectDialog"
      :pilId="pilId"
      :projectList="projectList"
      :spanaActive="spanaActive"
      :taskName="taskName"
    ></ExpertSelectDialog>
    <Drawer ref="drawer" :currentStatus="currentStatus"></Drawer>
    <PinionSolver
      :dialogVisible="pinionSolverdialogVisible"
      @close="closepinionSolverList"
      @saveLabelList="savepinionSolverList"
      :data="pinionSolverList"
      :dataThree="dataThree"
      v-if="pinionSolverdialogVisible"
    ></PinionSolver>
  </div>
</template>

<script>
import TestFormView from "../../../components/srFormView";
import Drawer from "../../../components/Drawer.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import store from "@/store";
import {
  getDetailById,
  api_getServiceTypeList,
  getOpinionByExpert,
  getCkxsyj,
  getBuAndUserInfoByBuPorperty,
  api_fpshr,
} from "@/api/planProject/index";
import { api_activititodo, api_getCustomFormTemplate } from "@/api/index";
import srtracetrack from "@/utils/srtracetrack";
import workflow from "@/utils/workflow";
import WorkFlow1 from "../components/workflow.vue";
import srNavPage from "../components/srNavPage.vue";
import ExpertSelectDialog from "@/components/ExpertSelectDialog.vue";
import PinionSolver from "../components/pinionSolver.vue";
export default {
  components: {
    TestFormView,
    WorkFlow1,
    srNavPage,
    Drawer,
    ExpertSelectDialog,
    PinionSolver,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflow,
    };
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  data() {
    return {
      taskName: "",
      editableTabs: [],
      activeName: "0",
      // userInfo: store.getters.userInfo,
      fromData: {},
      taskId: "",
      clickmethods: { firsttrial: this.firsttrial },
      buttonList: [],
      srNavPageObj: {},
      filterPath: "",
      auditJson: {},
      createBuid: "",
      currentStatus: null,
      currentKind: null,
      serverList: [], //服务类型
      projectScopePublicSideList: [], //公众侧
      projectScopeGovernmentSideList: [], //政务侧
      constructionBasisList: [], //建设依据
      tableData: [], //重点列表
      form: [],
      isPlan: true,
      expertSelectDialog: false,
      projectList: [], //已选项目列表
      pilId: [], //批量分配项目id
      expertViewList: [], //专家结论列表
      // 初审服务人员
      pinionSolverdialogVisible: false, //默认关闭
      // 相关处室数据
      pinionSolverList: [],
      // pilId: [], //已选项目id
      xmDetail: [],
      source: null,
      version: null,
      status: null,
    };
  },

  methods: {
    openExpert(val) {
      console.log(
        "接受子传递",
        val,
        this.$route.query.id,
        this.$route.query.spanaActive
      );
      if (this.$route.query.id) {
        this.pilId = [this.$route.query.id];
        this.projectList = [
          {
            id: this.$route.query.id,
            source: this.source,
            version: this.version,
            status: this.status,
          },
        ]; //征求意见
        console.log("11111", this.projectList);
        this.spanaActive = this.$route.query.spanaActive;
        this.expertSelectDialog = val;
      }
    },
    // 专家结论意见
    expertViewHandle() {
      /*   console.log("接受子传递专家结论", val);
      this.expertViewList = val; */
      let params = {
        projectId: this.$route.query.id,
        version: this.$route.query.version,
      };
      // getTjyj
      // getCkxsyj(params).then((res) => {
      getOpinionByExpert(params).then((res) => {
        this.expertViewList = res.data;
        console.log("专家意见-------", this.expertViewList);
      });
    },
    // 关闭抽取弹框
    closeExpertSelectDialog() {
      this.expertSelectDialog = false;
    },
    // 分配
    openPinionSolverd(val) {
      this.pinionSolverdialogVisible = true;
    },
    // 关闭初审弹框
    closepinionSolverList() {
      this.pinionSolverdialogVisible = false;
    },
    // 获取审查服务人员
    getBuAndUserInfoByBuPorpertyList() {
      getBuAndUserInfoByBuPorperty({ buPorperty: 39 }).then((res) => {
        if (res.data) {
          // console.log(res.data);
          this.pinionSolverList = res.data;
        }
      });
    },
    // 确定
    savepinionSolverList(all, select) {
      console.log("all, select", all, select);

      let arr1 = [];
      let arr2 = [];
      select.map((item) => {
        if (item.fullName == "信创小组") {
          arr1.push(...item.data);
        } else {
          arr2.push(...item.data);
        }
      });
      console.log("需传给后端arr1,arr2", arr1, arr2);
      api_fpshr({
        /* projectIds: this.pilId,
        xcshzDtos: arr1,
        zqyjdto: arr2, */
        scrBuCode: "",
        dtoList: this.xmDetail,
        scrBuid: arr2[0].buid,
        scrJfid: arr2[0].jfid,
        scrName: arr2[0].fullname,
        scrRole: arr2[0].roleCode,
      }).then((res) => {
        if (res.data) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          // this.search.btns.splice(1, 1, {
          //   name: "批量征求意见",
          //   click: this.plzqyj,
          //   type: "primary",
          // });
          // this.table.tableConfig.selectionConfig.display = false;
          // this.getTbData();
          // this.$refs.selectTable.$refs.SrTable.clearSelection();
          if (this.$route.query.spanaActive == 2) {
            this.buttonList[0].btns.splice(0, 1);
          }
          this.pinionSolverdialogVisible = false;
        }
      });
    },
    handleClick(tab, event) {},
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
    // 初审意见
    firsttrial() {
      // 抽屉弹框
      this.$EventBus.$emit("drawerisshow", true);
    },
  },

  async created() {
    this.getBuAndUserInfoByBuPorpertyList(); //可选符合性审核人员
    this.expertViewHandle();
    // 审核小组按钮处理
    if (this.userInfo.currentBizunit.buProperty == 38) {
      this.buttonList = [
        {
          role: "",
          btns: [
            {
              btnName: "出具初审意见",
              btnValue: "firsttrial",
              btnType: "primary",
              btnEventType: "firsttrial",
            },
          ],
          nodes: [],
        },
      ];
    }
    this.xmDetail = [
      {
        processInstanceId: this.$route.query.processId,
        taskId: this.$route.query.processId,
      },
    ];
    // 服务类型处理
    this.getServerList();
    await getDetailById({ id: this.$route.query.id }).then((res) => {
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
        console.log("项目信息", res.data);
        this.source = res.data.source;
        this.version = res.data.version;
        this.status = res.data.status;
        this.taskName = res.data.taskName;
        // this.projectList[0] = res.data;
        // 密码应用
        res.data.isPwdProject = res.data.isPwdProject == 1 ? "是" : "否";
        // 重点列表
        this.tableData = res.data.keyTaskList ? res.data.keyTaskList : [];
        this.form = res.data.planDtos;
        this.currentStatus = res.data.status;
        console.log("当前状态", this.currentStatus);
        this.currentKind = res.data.kind;
        this.createBuid = res.data.createBuid;
        res.data.yearPlanId = res.data.yearPlanName; //处理查看页面年度计划字段
        res.data.constructionCycle =
          (res.data.beginDate || "-") + "至" + (res.data.endDate || "-");
        if (res.data.serviceType) {
          // 服务类型处理
          let serlist = [];
          res.data.serviceType.map((item1) => {
            this.serverList.map((item) => {
              if (item.value == item1) {
                serlist.push(item.label);
              }
            });
            res.data.serviceType = serlist.toString();
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
            if (!pattern2.test(item)) {
              list.push(item);
            }
            this.projectScopePublicSideList.map((item1) => {
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
            if (!pattern2.test(item)) {
              list.push(item);
            }
            this.projectScopeGovernmentSideList.map((item1) => {
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
        // // 文件处理
        /*res.data.applicantUnitOpinions = JSON.parse(
          res.data.applicantUnitOpinions
        );
        res.data.xmlxsqh = JSON.parse(res.data.xmlxsqh);
        res.data.xmlxsqb = JSON.parse(res.data.xmlxsqb);
        res.data.xmlxfa = JSON.parse(res.data.xmlxfa);
        res.data.xmlxfaml = JSON.parse(res.data.xmlxfaml);
        res.data.xmlzyj = JSON.parse(res.data.xmlzyj);
        res.data.sczjyj = JSON.parse(res.data.sczjyj);
        res.data.syxzzjddxmlxyj = JSON.parse(res.data.syxzzjddxmlxyj);
        res.data.mmyyshyj = JSON.parse(res.data.mmyyshyj);*/
        res.data.otherAppendix = JSON.parse(res.data.otherAppendix);
      }
      this.srNavPageObj = res.data;

      let data = res.data.data;
      console.log(this.srNavPageObj);
      api_getCustomFormTemplate({
        moduleCode: "18008",
        // templateId: this.templateId,
      }).then((res1) => {
        console.log("模板值", res1);
        this.auditJson = JSON.parse(res1.data.auditJson);
        console.log("auditJson", this.auditJson);
        // 回显工作流表单
        if (res.data.projectLibraryFundReviewEntity) {
          this.auditJson.formAdd.data = res.data.projectLibraryFundReviewEntity;
        }
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          item.formArr = JSON.parse(item.formArr);
          console.log("data", data);
          item.formArr.forEach((item1, index) => {
            item.formArr[index].selectData.formView.data = res.data;
            for (let k = 0; k < item1.selectData.formView.config.length; k++) {
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
          // if (data) {
          //   JSON.parse(data).forEach((item1, index) => {
          //     item.formArr[index].selectData.formView.data = item1;
          //   });
          // } else {
          //   item.formArr[0].selectData.formView.data = res.data;
          // }
          let form = item.formArr[0].selectData.formView;
          let arr = [];
          if (form.data.planType == "0") {
            form.data.planType = "";
          }

          // this.$set(form.data, "projectType", form.data.projectTypeName);
          // this.$set(form.data, "projectType", res.data.projectType2.join(","));

          // this.$set(form.data, "constructionUnit", form.data.unitName || "");
          if (form.data.planType == "" || form.data.planType == "无") {
            arr = ["专项发展规划名称", "行业方向", "总体发展规划"];
            form.config.forEach((list) => {
              arr.forEach((i) => {
                if (list.label == i) {
                  this.$set(list, "isHide", true);
                  this.$set(list, "isHideView", true);
                }
              });
            });
            this.$set(form.data, "industryDirection", "");
            this.$set(form.data, "industryDirection", "");
            this.$set(form.data, "planType", "无");
          } else if (form.data.planType === 1 || form.data.planType === "1") {
            arr = ["总体发展规划"];
            form.config.forEach((list) => {
              arr.forEach((i) => {
                if (list.label == i) {
                  this.$set(list, "isHide", true);
                  this.$set(list, "isHideView", true);
                } else {
                  this.$set(list, "isHide", false);
                  this.$set(list, "isHideView", false);
                }
              });
            });
            this.$set(form.data, "planType", "专项发展规划");

            this.$set(form.data, "planId", form.data.planName);

            this.$set(form.data, "ztplan", form.data.planName);
          } else if (form.data.planType === "2" || form.data.planType === 2) {
            arr = ["专项发展规划名称"];
            form.config.forEach((list) => {
              arr.forEach((i) => {
                if (list.label == "专项发展规划名称") {
                  this.$set(list, "isHide", true);
                  this.$set(list, "isHideView", true);
                } else if (list.label == "行业方向") {
                  this.$set(list, "isHide", true);
                  this.$set(list, "isHideView", true);
                } else {
                  this.$set(list, "isHide", false);
                  this.$set(list, "isHideView", false);
                }
              });
            });
            this.$set(form.data, "industryDirection", "");
            this.$set(form.data, "planType", "总体发展规划");

            this.$set(form.data, "planId", form.data.planName);

            this.$set(form.data, "ztplan", form.data.planName);
          }
        });
      });
    });
    // api_workFlowImage({processId:this.$route.query.processId}).then(res=>{
    //
    // })
    // let userinfo = sessionStorage.getItem("userInfo");

    let { roleCode } = this.userInfo.currentRole;
    let { jfid } = this.userInfo;
    let { buid, buProperty } = this.userInfo.currentBizunit;
    let btnValue = 3;
    console.log(
      this.srNavPageObj.createBuid == buid,
      this.srNavPageObj.createBuid,
      buid,
      this.srNavPageObj
    );
    if (this.$route.query.flag && this.$route.query.flag == 0) {
      btnValue = 4;
    }
    console.log("type", this.$route.query.type);
    let param = {
      owner: jfid,
      role: roleCode,
      processId: this.$route.query.processId,
      btnValue: this.$route.query.flog || btnValue,
      type: this.$route.query.type || "",
    };

    api_activititodo(param).then((res) => {
      console.log("======", res);
      if (res.data[0]) {
        let assignee = res.data[0].assignee;
        console.log("按钮有啥", JSON.parse(res.data[0].description));
        this.buttonList = JSON.parse(res.data[0].description).filter((item) => {
          // item.btns = [
          //   {
          //     btnName: "征求意见",
          //     btnType: "default",
          //     btnEventType: "fp", // 是否开启公共组件按钮自定义事件
          //   },
          //   ...item.btns,
          // ];
          //按钮筛选  以assignee优先roleCode
          item.assignee = assignee;

          if (assignee == jfid) {
            return true;
          } else if (roleCode == item.role) {
            return true;
          }
        });
        console.log(this.buttonList);
        // &&this.$route.query.flag==0
        console.log(
          this.srNavPageObj.createBuid == buid,
          this.srNavPageObj.createBuid,
          buid
        );
        if (this.srNavPageObj.createBuid == buid && buid != "7231") {
          this.buttonList[0].btns = this.buttonList[0].btns.slice(0, 1);
          console.log("1.....", this.buttonList[0].btns);
        } else if (
          // 建设征集意见单位按钮(初审)
          this.$route.query.flag == 0 &&
          this.userInfo.currentBizunit.buProperty == 2 &&
          res.data[0].taskName == "立项初审"
        ) {
          this.buttonList[0].btns = this.buttonList[0].btns.slice(0);
          console.log("2.....");
        } else if (
          // 建设征集意见单位按钮(组织评审)
          this.$route.query.flag == 0 &&
          this.userInfo.currentBizunit.buProperty == 2 &&
          res.data[0].taskName == "组织评审"
        ) {
          this.buttonList[0].btns = this.buttonList[0].btns.slice(0);
          console.log("3.....");
        } else if (
          this.$route.query.flag == 0 &&
          this.userInfo.currentBizunit.buProperty == 1
        ) {
          this.buttonList[0].btns = this.buttonList[0].btns.slice(0, 2);
          console.log("4.....");
          // 区分申报单位与审核单位创建创建
        } else if (this.srNavPageObj.createBuid == buid && buid == "7231") {
          console.log("此时按钮", this.buttonList);
          // debugger;
          this.buttonList[0].btns = this.buttonList[0].btns.slice(0);
          console.log("5.....");
          console.log("此时按钮", this.buttonList);
          // debugger;
        } else if (
          this.currentStatus == 10 &&
          this.userInfo.currentBizunit.buProperty == 1
        ) {
          // 处理征求过专家函评后按钮该为名字为以专家函评
          this.buttonList[0].btns[0].btnName = "已组织评审";
          console.log("6.....");
        }
        // 统筹初审撤回
        if (
          this.$route.query.flog == 1 &&
          buProperty == 1 &&
          roleCode == "GHFZC_JBR"
        ) {
          // this.buttonList[0].btns = this.buttonList[0].btns.splice(3, 1);
        }
        // 符合性审查
        if (
          this.currentStatus == 2 &&
          this.userInfo.currentRole.roleCode != "GHFZC_JBR"
        ) {
          this.buttonList[0].btns = this.buttonList[0].btns.splice(0, 4);
          console.log("7.....");
        } else if (
          this.currentStatus == 201 &&
          this.userInfo.currentBizunit.buProperty == 1 &&
          this.userInfo.currentRole.roleCode == "GHFZC_JBR"
        ) {
          // this.userInfo.currentRole.roleCode != "GHFZC_SBJBR"
          console.log("this.currentStatus", this.currentStatus);
          console.log("此时的按钮", this.buttonList);
          // debugger;
          this.buttonList[0].btns = this.buttonList[0].btns.splice(1, 3);
          console.log("8.....");
          console.log("此时的按钮", this.buttonList);
        }
        //如果是专家身份且在分组初审阶段不展示其他按钮只展示返回列表
        if (
          this.userInfo.currentBizunit.buProperty == 9 &&
          this.$route.query.type == 1
        ) {
          console.log("是专家隐藏按钮");
          this.buttonList = [
            {
              role: "",
              btns: [
                {
                  btnName: "出具意见",
                  btnEventType: "cjyj",
                  btnType: "primary",
                },
              ],
              nodes: [],
            },
          ];
        }
        // 查看初审意见及详情只有发起评审，至少一个专家接受邀请，并出具意见
        if (
          this.$refs.drawer.moreformData.length == 0 &&
          (this.currentStatus == 3 || this.currentStatus == 5)
        ) {
          this.buttonList[0].btns.splice(1, 1);
        }

        this.taskId = res.data[0].taskId;
      }
    });
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log(to, from, next);
  //   next((vm) => {
  //     vm.filterPath = from.path;
  //     console.log(vm.filterPath);
  //   });
  // },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
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
</style>
