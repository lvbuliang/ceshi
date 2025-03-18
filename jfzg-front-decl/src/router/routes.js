import Vue from "vue";
import VueRouter from "vue-router";
// 年度计划
const Yearplan = () => import("../views/yearplan/index.vue");
const YearplanList = () => import("../views/yearplan/children/list.vue");
const YearplanAdd = () => import("../views/yearplan/children/add.vue");
const YearplanView = () => import("../views/yearplan/children/view.vue");
const workView = () => import("../views/yearplan/children/workView.vue");
//备案
const beian = () => import("../views/beian/index.vue");
const beianAdd = () => import("../views/beian/children/add.vue");
const beianView = () => import("../views/beian/children/view.vue");
const beianApprove = () => import("../views/beian/children/workView.vue");
// 年度计划项目申报
const PlanedProject = () => import("../views/planedProject/index.vue");
const PlanedProjectAdd = () =>
  import("../views/planedProject/children/add.vue");
const PlanedProjectView = () =>
  import("../views/planedProject/children/view.vue");
const PlanedProjectWorkView = () =>
  import("../views/planedProject/children/workView.vue");
// 项目计划管理
const ProgramManagement = () => import("../views/programManagement/index.vue");
const ProgramManagementView = () =>
  import("../views/programManagement/children/view.vue");
// 计划项目库
const PlanProject = () => import("../views/planProject/index.vue");
const PlanProjectAdd = () => import("../views/planProject/children/add.vue");
const PlanProjectView = () => import("../views/planProject/children/view.vue");
const PlanProjectWorkView = () =>
  import("../views/planProject/children/workView.vue");
// 新增执行管理路由
const ExecutionManagement = () =>
  import("../views/executionManagement/index.vue");
const ExecutionManagementPhase = () =>
  import("../views/executionManagement/children/projectPhase/list.vue");
const ExecutionManagementTask = () =>
  import("../views/executionManagement/children/task/list.vue");
const ExecutionManagementChildrenTask = () =>
  import("../views/executionManagement/children/task/chilrenList.vue");
const ExecutionManagementView = () =>
  import("../views/executionManagement/children/view.vue");
const ExecutionManagementWorkView = () =>
  import("../views/executionManagement/children/workView.vue");
const LookExadminView = () =>
  import("../views/executionManagement/children/lookView.vue");
// examinionWorkView
const examinationAndapprovalWorkView = () =>
  import("../views/executionManagement/children/examinionWorkView.vue");
// 创建项目信息路由
const CreateProject = () =>
  import("../views/planProject/children/createList.vue");
// 计划外项目申报
const unPlanedProject = () => import("../views/unPlanedProject/index.vue");
const unPlanedProjectAdd = () =>
  import("../views/unPlanedProject/children/add.vue");
const unPlanedProjectView = () =>
  import("../views/unPlanedProject/children/view.vue");
const unPlanedProjectWorkView = () =>
  import("../views/unPlanedProject/children/workView.vue");

// 初设
const chusheGaisuan = () => import("../views/chushe/index.vue");
const chusheAdd = () => import("../views/chushe/children/add.vue");
const chusheView = () => import("../views/chushe/children/view.vue");
const chusheWorkView = () => import("../views/chushe/children/workView.vue");
const cs_intensificationList = () =>
  import("../views/chushe/children/intensification/list.vue");
const cs_intensificationView = () =>
  import("../views/chushe/children/intensification/view.vue");
// 设计公司
const Design = () => import("../views/design/index.vue");
const Company = () => import("../views/design/company/index.vue");
const Person = () => import("../views/design/person/index.vue");
const DesignView = () => import("../views/design/components/details.vue");

// 可研
const Keyan = () => import("../views/keyan/index.vue");
const keyanAdd = () => import("../views/keyan/children/add.vue");
const keyanView = () => import("../views/keyan/children/view.vue");
const keyanWorkView = () => import("../views/keyan/children/workView.vue");
const intensificationList = () =>
  import("../views/keyan/children/intensification/list.vue");
const intensificationView = () =>
  import("../views/keyan/children/intensification/view.vue");

// 项目变更
const projectChange = () => import("../views/projectChange/index.vue");
const projectChangeAdd = () =>
  import("../views/projectChange/children/add.vue");
const projectChangeView = () =>
  import("../views/projectChange/children/view.vue");
const projectChangeWorkView = () =>
  import("../views/projectChange/children/workView.vue");

// 上云
const shangyun = () => import("../views/shangyun/index.vue");
const shangyunAdd = () => import("../views/shangyun/children/add.vue");
const shangyunView = () => import("../views/shangyun/children/view.vue");
const shangyunApprove = () => import("../views/shangyun/children/workView.vue");

// 项目台账
const Ledger = () => import("../views/ledger/index.vue");

// 项目周报
const Report = () => import("../views/report/index.vue");
const ReportList = () => import("../views/report/children/list.vue");
const ReportAdd = () => import("../views/report/children/add.vue");
const ReportView = () => import("../views/report/children/view.vue");
const ReportWorkView = () => import("../views/report/children/workView.vue");

// 项目交底
const projectDisclosure = () => import("../views/projectDisclosure/index.vue");
const projectDisclosureView = () =>
  import("../views/projectDisclosure/children/view.vue");
const projectDisclosureAdd = () =>
  import("../views/projectDisclosure/children/add.vue");
const projectDisclosureWorkView = () =>
  import("../views/projectDisclosure/children/workView.vue");

// 项目启动
const projectStart = () => import("../views/projectStart/index.vue");
const projectStartAdd = () => import("../views/projectStart/children/add.vue");
const projectStartView = () =>
  import("../views/projectStart/children/view.vue");
const projectStartWorkView = () =>
  import("../views/projectStart/children/workView.vue");

// 项目初验
const projectInitial = () => import("../views/projectInitial/index.vue");
const projectInitialAdd = () =>
  import("../views/projectInitial/children/add.vue");
const projectInitialView = () =>
  import("../views/projectInitial/children/view.vue");
const projectInitialWorkView = () =>
  import("../views/projectInitial/children/workView.vue");

// 立项管理
const projectManagement = () => import("../views/projectManagement/index.vue");
// 发起立项
const projectAdd = () => import("../views/projectManagement/children/add.vue");
// 集团审议 内部立项
const projectWorkView = () =>
  import("../views/projectManagement/children/workView.vue");
// 查看
const projectSeeView = () =>
  import("../views/projectManagement/children/view.vue");
// 预研交付申请
const preResearchDelivery = () =>
  import("../views/preResearchDelivery/index.vue");
const preResearchDeliveryView = () =>
  import("../views/preResearchDelivery/children/view.vue");
const preResearchDeliveryAdd = () =>
  import("../views/preResearchDelivery/children/add.vue");
const preResearchDeliveryWorkView = () =>
  import("../views/preResearchDelivery/children/workView.vue");

// 项目终验
const projectEnd = () => import("../views/projectEnd/index.vue");
// 发起终验申请
const projectEndAdd = () => import("../views/projectEnd/children/add.vue");
// 项目终验查看
const projectEndView = () => import("../views/projectEnd/children/view.vue");
// 项目终验审批
const projectEndWorkView = () =>
  import("../views/projectEnd/children/workView.vue");
// 项目结项
const projectClose = () => import("../views/projectClose/index.vue");
// 项目结项申请
const projectCloseAdd = () => import("../views/projectClose/children/add.vue");
// 项目结项查看
const projectCloseView = () =>
  import("../views/projectClose/children/view.vue");
// 项目结项审批
const projectCloseWork = () =>
  import("../views/projectClose/children/workView.vue");

//采购管理模块
const purchasingManagement = () =>
  import("../views/purchasingManagement/index.vue");
const purchasingManagementAdd = () =>
  import("../views/purchasingManagement/children/add.vue");
const purchasingManagementView = () =>
  import("../views/purchasingManagement/children/view.vue");

// 新项目变更模块
const projectChangeManagement = () =>
  import("../views/projectChangeManagement/index.vue");
// const projectChangeManagementAdd = () =>
//   import("../views/projectChangeManagement/children/add.vue");
const projectChangeApplication = () =>
  import("../views/projectChangeManagement/children/application.vue");
const projectChangeManagementView = () =>
  import("../views/projectChangeManagement/children/view.vue");
const projectChangeManagementworkView = () =>
  import("../views/projectChangeManagement/children/workView.vue");

// 订单管理
const orderManagement = () => import("../views/orderManagement/index.vue");
const orderManagementView = () =>
  import("../views/orderManagement/component/orderManagementView.vue");
const contractManagementView = () =>
  import("../views/orderManagement/component/contractManagementView.vue");
// 合同
const AddOrder = () =>
  import("../views/orderManagement/component/addOrder.vue");
// 订单
const AddContract = () =>
  import("../views/orderManagement/component/addContract.vue");

// 知识库
const KnowLedge = () => import("../views/knowLedge/index.vue");
// const KnowLedgeInfo = () =>
//   import("../views/knowLedge/children/knowLedgeInfo.vue");

Vue.use(VueRouter);
/*
 * 申报下正常命名：如：yearplan
 * 审批下加Audit：如：yearplanAudit
 */

const routes = [
  {
    path: "/report",
    name: "report",
    redirect: "/reportList",
    component: Report,
    meta: {
      title: "项目周报列表",
      busiType: "PROJECT_WEEKLY_REPORT",
      keepAlive: false,
      isBack: false,
    },
    children: [
      {
        path: "/reportList",
        name: "reportList",
        component: ReportList,
        meta: {
          title: "项目周报列表",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
      {
        path: "reportEdit",
        name: "reportEdit",
        component: ReportAdd,
        meta: {
          title: "编辑项目周报",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
      {
        path: "reportView",
        name: "reportView",
        component: ReportView,
        meta: {
          title: "查看项目周报",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
      {
        path: "reportAdd",
        name: "reportAdd",
        component: ReportAdd,
        meta: {
          title: "新增项目周报",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
      {
        path: "reportWorkView",
        name: "reportWorkView",
        component: ReportWorkView,
        meta: {
          title: "审核项目周报",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
    ],
  },
  {
    path: "/yearplan",
    name: "yearplan",
    component: Yearplan,
    meta: {
      title: "年度计划查询",
      busiType: "YEAR_PLAN",
      keepAlive: false,
    },
    children: [
      {
        path: "YearplanList",
        name: "YearplanList",
        component: YearplanList,
        meta: {
          title: "年度项目计划列表",
          busiType: "YEAR_PLAN",
        },
      },
      {
        path: "yearplanView",
        name: "yearplanView",
        component: YearplanView,
        meta: {
          title: "查看年度计划",
          busiType: "YEAR_PLAN",
        },
      },
    ],
  },
  // {
  // 	path: "/yearplanAuditAdd",
  // 	name: "yearplanAuditAdd",
  // 	component: YearplanAdd,
  // 	meta: {
  // 		title: "新增年度项目计划",
  // 		busiType: 'YEAR_PLAN',
  // 		type: "add"
  // 	},
  // },
  {
    path: "/yearplanAudit",
    name: "yearplanAudit",
    component: Yearplan,
    meta: {
      title: "年度计划管理",
      busiType: "YEAR_PLAN",
      keepAlive: false,
    },
    children: [
      {
        path: "yearplanAuditList",
        name: "yearplanAuditList",
        component: YearplanList,
        meta: {
          title: "年度项目计划列表",
          busiType: "YEAR_PLAN",
        },
      },
      {
        path: "yearplanAuditEdit",
        name: "yearplanAuditEdit",
        component: YearplanAdd,
        meta: {
          title: "编辑年度项目计划",
          busiType: "YEAR_PLAN",
        },
      },
      {
        path: "yearplanAuditView",
        name: "yearplanAuditView",
        component: YearplanView,
        meta: {
          title: "查看年度计划",
          busiType: "YEAR_PLAN",
        },
      },
      {
        path: "yearplanAuditApprove",
        name: "yearplanAuditApprove",
        component: workView,
        meta: {
          title: "年度项目计划审批",
          busiType: "YEAR_PLAN",
        },
      },
      {
        path: "yearplanAuditAdd",
        name: "yearplanAuditAdd",
        component: YearplanAdd,
        meta: {
          title: "新增年度项目计划",
          busiType: "YEAR_PLAN",
          // type: "add"
        },
      },
    ],
  },
  {
    path: "/programManagement",
    name: "programManagement",
    component: ProgramManagement,
    meta: {
      title: "项目计划列表",
      // busiType: 'PRO_MANAGEMENT'
      keepAlive: false,
    },
    children: [
      {
        path: "programManagementView",
        name: "programManagementView",
        component: ProgramManagementView,
        meta: {
          title: "查看项目计划",
          // busiType: 'PRO_MANAGEMENT'
        },
      },
      {
        path: "programManagementEdit",
        name: "programManagementEdit",
        component: ProgramManagementView,
        meta: {
          title: "维护项目计划",
          // busiType: 'PRO_MANAGEMENT'
        },
      },
    ],
  },
  {
    path: "/planedProject",
    name: "planedProject",
    component: PlanedProject,
    meta: {
      title: "",
      busiType: "YEAR_PLAN_PROJECT",
      keepAlive: false,
    },
    children: [
      {
        path: "planedProjectEdit",
        name: "planedProjectEdit",
        component: PlanedProjectAdd,
        meta: {
          title: "编辑年度计划项目申报",
          busiType: "YEAR_PLAN_PROJECT",
        },
      },
      {
        path: "planedProjectView",
        name: "planedProjectView",
        component: PlanedProjectView,
        meta: {
          title: "查看年度计划项目申报",
          busiType: "YEAR_PLAN_PROJECT",
        },
      },
      {
        path: "planedProjectWorkView",
        name: "planedProjectWorkView",
        component: PlanedProjectWorkView,
        meta: {
          title: "年度计划项目申报审批流操作",
          busiType: "YEAR_PLAN_PROJECT",
        },
      },
    ],
  },
  {
    path: "/planProject",
    name: "planProject",
    component: PlanProject,
    meta: {
      title: "项目信息列表",
      busiType: "MEDIUMLONG_PROJECT",
      keepAlive: false,
    },
    children: [
      // {
      //   path: 'planProjectEdit',
      //   name: 'planProjectEdit',
      //   component: PlanProjectAdd,
      //   meta: {
      //     title: '编辑清单项目',
      //     busiType: 'MEDIUMLONG_PROJECT',
      //   },
      // },
      {
        path: "planProjectEdit",
        name: "planProjectEdit",
        component: PlanProjectView,
        meta: {
          title: "编辑项目信息",
          busiType: "MEDIUMLONG_PROJECT",
        },
      },
      {
        path: "planProjectView",
        name: "planProjectView",
        component: PlanProjectView,
        meta: {
          title: "查看项目信息",
          busiType: "MEDIUMLONG_PROJECT",
        },
      },
      {
        path: "planProjectWorkView",
        name: "planProjectWorkView",
        component: PlanProjectWorkView,
        meta: {
          title: "审批清单项目",
          busiType: "MEDIUMLONG_PROJECT",
        },
      },
      {
        path: "planProjectAdd",
        name: "planProjectAdd",
        component: PlanProjectAdd,
        meta: {
          title: "新增清单项目",
          busiType: "MEDIUMLONG_PROJECT",
        },
      },
      // 创建项目信息的路由
      {
        path: "createProject",
        name: "createProject",
        component: CreateProject,
        meta: {
          title: "新增项目信息",
          busiType: "MEDIUMLONG_PROJECT",
        },
      },
    ],
  },
  {
    path: "/executionManagement",
    name: "executionManagement",
    component: ExecutionManagement,
    meta: {
      title: "执行管理列表",
      busiType: "MEDIUMLONG_PROJECT",
      keepAlive: false,
    },
    children: [
      {
        path: "projectPhase",
        name: "projectPhase",
        component: ExecutionManagementPhase,
        meta: {
          title: "项目阶段列表",
          busiType: "PROJECT_RISK",
        },
      },
      {
        path: "task",
        name: "task",
        component: ExecutionManagementTask,
        meta: {
          title: "项目任务列表",
          busiType: "PROJECT_RISK",
        },
      },
      {
        path: "childrenTask",
        name: "childrenTask",
        component: ExecutionManagementChildrenTask,
        meta: {
          title: "项目子任务列表",
          busiType: "PROJECT_RISK",
        },
      },
      {
        path: "executionManagementView",
        name: "executionManagementView",
        component: ExecutionManagementView,
        meta: {
          title: "查看项目阶段",
          busiType: "PROJECT_TASKSUN",
        },
      },
      {
        path: "executionManagementWorkView",
        name: "executionManagementWorkView",
        component: ExecutionManagementWorkView,
        meta: {
          title: "项目子任务审核",
          busiType: "PROJECT_TASKSUN",
        },
      },
      {
        path: "examinionWorkView",
        name: "examinionWorkView",
        component: examinationAndapprovalWorkView,
        meta: {
          title: "执行管理审批",
          busiType: "PROJECT_TASKSUN",
        },
      },
      {
        path: "LookExadminView",
        name: "LookExadminView",
        component: LookExadminView,
        meta: {
          title: "执行管理查看",
          busiType: "PROJECT_TASKSUN",
        },
      },
    ],
  },
  {
    path: "/planedProjectAdd",
    name: "planedProjectAdd",
    component: PlanedProjectAdd,
    meta: {
      title: "新增年度计划项目申报",
      busiType: "YEAR_PLAN_PROJECT",
      type: "add",
      keepAlive: false,
    },
  },
  {
    path: "/planedProjectAudit",
    name: "planedProjectAudit",
    component: PlanedProject,
    meta: {
      title: "年度计划项目审批",
      busiType: "YEAR_PLAN_PROJECT",
      keepAlive: false,
    },
    children: [
      {
        path: "planedProjectAuditView",
        name: "planedProjectAuditView",
        component: PlanedProjectView,
        meta: {
          title: "查看年度计划项目申报",
          busiType: "YEAR_PLAN_PROJECT",
        },
      },
      {
        path: "planedProjectAuditWorkView",
        name: "planedProjectAuditWorkView",
        component: PlanedProjectWorkView,
        meta: {
          title: "年度计划项目申报审批流操作",
          busiType: "YEAR_PLAN_PROJECT",
        },
      },
    ],
  },
  {
    path: "/unplanedProject",
    name: "unPlanedProject",
    component: unPlanedProject,
    meta: {
      title: "计划外项目申报",
      busiType: "PROJECT_APPLY_001",
      keepAlive: false,
    },
    children: [
      {
        path: "unplanedProjectEdit",
        name: "unPlanedProjectEdit",
        component: unPlanedProjectAdd,
        meta: {
          title: "编辑计划外项目申报",
          busiType: "PROJECT_APPLY_001",
        },
      },
      {
        path: "unplanedProjectView",
        name: "unPlanedProjectView",
        component: unPlanedProjectView,
        meta: {
          title: "查看计划外项目申报",
          busiType: "PROJECT_APPLY_001",
        },
      },
      {
        path: "unplanedProjectWorkView",
        name: "unPlanedProjectWorkView",
        component: unPlanedProjectWorkView,
        meta: {
          title: "计划外项目申报审批流操作",
          busiType: "PROJECT_APPLY_001",
        },
      },
    ],
  },
  {
    path: "/unplanedProjectAdd",
    name: "unPlanedProjectAdd",
    component: unPlanedProjectAdd,
    meta: {
      title: "新增计划外项目申报",
      busiType: "PROJECT_APPLY_001",
      type: "add",
      keepAlive: false,
    },
  },
  {
    path: "/unplanedProjectAudit",
    name: "unPlanedProjectAudit",
    component: unPlanedProject,
    meta: {
      title: "计划外项目审批",
      busiType: "PROJECT_APPLY_001",
      keepAlive: false,
    },
    children: [
      {
        path: "unplanedProjectAuditView",
        name: "unPlanedProjectAuditView",
        component: unPlanedProjectView,
        meta: {
          title: "查看计划外项目申报",
          busiType: "PROJECT_APPLY_001",
        },
      },
      {
        path: "unplanedProjectAuditWorkView",
        name: "unPlanedProjectAuditWorkView",
        component: unPlanedProjectWorkView,
        meta: {
          title: "计划外项目申报审批流操作",
          busiType: "PROJECT_APPLY_001",
        },
      },
    ],
  },
  {
    path: "/keyan",
    name: "keyan",
    component: Keyan,
    meta: {
      title: "项目可研性研究",
      busiType: "PROJECT_STUDY",
      keepAlive: false,
    },
    children: [
      {
        path: "edit",
        name: "keyanEdit",
        component: keyanAdd,
        meta: {
          title: "编辑项目可研申报",
          busiType: "PROJECT_STUDY",
        },
      },
      {
        path: "view",
        name: "keyanView",
        component: keyanView,
        meta: {
          title: "查看项目可研申报",
          busiType: "PROJECT_STUDY",
        },
      },
      {
        path: "workView",
        name: "keyanWorkView",
        component: keyanWorkView,
        meta: {
          title: "可研申报审批流操作",
          busiType: "PROJECT_STUDY",
        },
      },
    ],
  },
  {
    path: "/keyanAdd",
    name: "keyanAdd",
    component: keyanAdd,
    meta: {
      title: "新增项目可研申报",
      busiType: "PROJECT_STUDY",
      type: "add",
    },
  },
  {
    path: "/keyanAudit",
    name: "keyanAudit",
    component: Keyan,
    meta: {
      title: "可研性研究审批",
      busiType: "PROJECT_STUDY",
    },
    children: [
      {
        path: "view",
        name: "keyanAuditView",
        component: keyanView,
        meta: {
          title: "查看可研性研究审批",
          busiType: "PROJECT_STUDY",
        },
      },
      {
        path: "workView",
        name: "keyanAuditWorkView",
        component: keyanWorkView,
        meta: {
          title: "可研性研究审批流操作",
          busiType: "PROJECT_STUDY",
        },
      },
      {
        path: "intensificationList",
        name: "intensificationList",
        component: intensificationList,
        meta: {
          title: "集约化比对结果",
          busiType: "PROJECT_STUDY",
        },
      },
      {
        path: "intensificationView",
        name: "intensificationView",
        component: intensificationView,
        meta: {
          title: "集约化比对详情",
          busiType: "PROJECT_STUDY",
        },
      },
    ],
  },
  {
    path: "/chushe",
    name: "chushe",
    component: chusheGaisuan,
    meta: {
      title: "项目初设及概算",
      busiType: "PROJECT_PRILIMINARY",
    },
    children: [
      {
        path: "edit",
        name: "chusheEdit",
        component: chusheAdd,
        meta: {
          title: "编辑项目初设及概算",
          busiType: "PROJECT_PRILIMINARY",
        },
      },
      {
        path: "view",
        name: "chusheView",
        component: chusheView,
        meta: {
          title: "查看项目初设及概算",
          busiType: "PROJECT_PRILIMINARY",
        },
      },
      {
        path: "workView",
        name: "chusheWorkView",
        component: chusheWorkView,
        meta: {
          title: "初设及概算审批流操作",
          busiType: "PROJECT_PRILIMINARY",
        },
      },
    ],
  },
  {
    path: "/chusheAdd",
    name: "chusheAdd",
    component: chusheAdd,
    meta: {
      title: "新增项目初设及概算",
      busiType: "PROJECT_PRILIMINARY",
      type: "add",
    },
  },
  {
    path: "/chusheAudit",
    name: "chusheAudit",
    component: chusheGaisuan,
    meta: {
      title: "初设及概算审批",
      busiType: "PROJECT_PRILIMINARY",
    },
    children: [
      {
        path: "view",
        name: "chusheAuditView",
        component: chusheView,
        meta: {
          title: "查看初设及概算审批",
          busiType: "PROJECT_PRILIMINARY",
        },
      },
      {
        path: "workView",
        name: "chusheAuditWorkView",
        component: chusheWorkView,
        meta: {
          title: "初设及概算审批流操作",
          busiType: "PROJECT_PRILIMINARY",
        },
      },
      {
        path: "csIntensificationList",
        name: "cs_intensificationList",
        component: cs_intensificationList,
        meta: {
          title: "集约化比对结果",
          busiType: "PROJECT_PRILIMINARY",
        },
      },
      {
        path: "csIntensificationView",
        name: "cs_intensificationView",
        component: cs_intensificationView,
        meta: {
          title: "集约化比对详情",
          busiType: "PROJECT_PRILIMINARY",
        },
      },
    ],
  },
  {
    path: "/beian",
    name: "beianList",
    component: beian,
    meta: {
      title: "项目备案申报",
      busiType: "PROJECT_RECORD",
    },
    children: [
      {
        path: "beianEdit",
        name: "beianEdit",
        component: beianAdd,
        meta: {
          title: "编辑项目备案",
          busiType: "PROJECT_RECORD",
        },
      },
      {
        path: "beianView",
        name: "beianView",
        component: beianView,
        meta: {
          title: "查看项目备案",
          busiType: "PROJECT_RECORD",
        },
      },
      {
        path: "beianWorkView",
        name: "beianWorkView",
        component: beianApprove,
        meta: {
          title: "审批流操作",
          busiType: "PROJECT_RECORD",
        },
      },
    ],
  },
  {
    path: "/beianAdd",
    name: "beianAdd",
    component: beianAdd,
    meta: {
      title: "新增项目备案",
      busiType: "PROJECT_RECORD",
      type: "add",
    },
  },
  {
    path: "/beianAudit",
    name: "beianAuditList",
    component: beian,
    meta: {
      title: "项目备案审批",
      busiType: "PROJECT_RECORD",
    },
    children: [
      {
        path: "beianAuditView",
        name: "beianAuditView",
        component: beianView,
        meta: {
          title: "查看项目备案",
          busiType: "PROJECT_RECORD",
        },
      },
      {
        path: "beianAuditWorkView",
        name: "beianAuditWorkView",
        component: beianApprove,
        meta: {
          title: "审批流操作",
          busiType: "PROJECT_RECORD",
        },
      },
      {
        path: "beianView",
        name: "beianView",
        component: beianView,
        meta: {
          title: "查看项目备案",
          busiType: "PROJECT_RECORD",
        },
      },
    ],
  },
  {
    path: "/shangyun",
    name: "shangyunList",
    component: shangyun,
    meta: {
      title: "上云申请",
      busiType: "PROJECT_CLOUD",
    },
    children: [
      {
        path: "shangyunEdit",
        name: "shangyunEdit",
        component: shangyunAdd,
        meta: {
          title: "编辑上云申请",
          busiType: "PROJECT_CLOUD",
        },
      },
      {
        path: "shangyunView",
        name: "shangyunView",
        component: shangyunView,
        meta: {
          title: "查看上云申请",
          busiType: "PROJECT_CLOUD",
        },
      },
      {
        path: "shangyunWorkView",
        name: "shangyunWorkView",
        component: shangyunApprove,
        meta: {
          title: "上云申请审批流操作",
          busiType: "PROJECT_CLOUD",
        },
      },
    ],
  },
  {
    path: "/shangyunAdd",
    name: "shangyunAdd",
    component: shangyunAdd,
    meta: {
      title: "新增上云申请",
      busiType: "PROJECT_CLOUD",
      type: "add",
    },
  },
  {
    path: "/shangyunAudit",
    name: "shangyunAuditList",
    component: shangyun,
    meta: {
      title: "项目上云审批",
      busiType: "PROJECT_CLOUD",
    },
    children: [
      {
        path: "shangyunAuditView",
        name: "shangyunAuditView",
        component: shangyunView,
        meta: {
          title: "查看上云申请",
          busiType: "PROJECT_CLOUD",
        },
      },
      {
        path: "shangyunAuditWorkView",
        name: "shangyunAuditWorkView",
        component: shangyunApprove,
        meta: {
          title: "上云申请审批流操作",
          busiType: "PROJECT_CLOUD",
        },
      },
    ],
  },
  {
    path: "/design",
    name: "design",
    component: Design,
    meta: {
      title: "设计公司查询",
      busiType: "DESIGN_COMPANY",
    },
    children: [
      {
        path: "company",
        name: "company",
        component: Company,
        meta: {
          title: "设计公司列表",
          busiType: "DESIGN_COMPANY",
        },
        children: [
          {
            path: "companyView",
            name: "companyView",
            component: DesignView,
            meta: {
              title: "查看设计公司",
              busiType: "DESIGN_COMPANY",
            },
          },
        ],
      },
      {
        path: "person",
        name: "person",
        component: Person,
        meta: {
          title: "设计公司人员列表",
          busiType: "DESIGN_PERSON",
        },
        children: [
          {
            path: "personView",
            name: "personView",
            component: DesignView,
            meta: {
              title: "查看设计公司人员",
              busiType: "DESIGN_PERSON",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/designAudit",
    name: "designAudit",
    component: Design,
    meta: {
      title: "设计公司管理与评价",
      busiType: "DESIGN_COMPANY",
    },
    children: [
      {
        path: "companyAudit",
        name: "companyAudit",
        component: Company,
        meta: {
          title: "设计公司列表",
          busiType: "DESIGN_COMPANY",
        },
        children: [
          {
            path: "companyAuditView",
            name: "companyAuditView",
            component: DesignView,
            meta: {
              title: "查看设计公司",
              busiType: "DESIGN_COMPANY",
            },
          },
        ],
      },
      {
        path: "personAudit",
        name: "personAudit",
        component: Person,
        meta: {
          title: "设计公司人员列表",
          busiType: "DESIGN_PERSON",
        },
        children: [
          {
            path: "personAuditView",
            name: "personAuditView",
            component: DesignView,
            meta: {
              title: "查看设计公司人员",
              busiType: "DESIGN_PERSON",
            },
          },
        ],
      },
    ],
  },

  {
    path: "/projectChange",
    name: "projectChange",
    component: projectChange,
    meta: {
      title: "项目变更申报",
      busiType: "PROJECT_CHANGE",
    },
    children: [
      {
        path: "projectChangeEdit",
        name: "projectChangeEdit",
        component: projectChangeAdd,
        meta: {
          title: "编辑项目变更申报",
          busiType: "PROJECT_CHANGE",
        },
      },
      {
        path: "projectChangeView",
        name: "projectChangeView",
        component: projectChangeView,
        meta: {
          title: "查看项目变更申报",
          busiType: "PROJECT_CHANGE",
        },
      },
      {
        path: "projectChangeWorkView",
        name: "projectChangeWorkView",
        component: projectChangeWorkView,
        meta: {
          title: "项目变更审批流操作",
          busiType: "PROJECT_CHANGE",
        },
      },
    ],
  },
  {
    path: "/projectChangeAdd",
    name: "projectChangeAdd",
    component: projectChangeAdd,
    meta: {
      title: "新增项目变更申报",
      type: "add",
      busiType: "PROJECT_CHANGE",
      keepAlive: false,
    },
  },
  {
    path: "/projectChangeAudit",
    name: "projectChangeAudit",
    component: projectChange,
    meta: {
      title: "项目变更审批",
      busiType: "PROJECT_CHANGE",
    },
    children: [
      {
        path: "projectChangeAuditView",
        name: "projectChangeAuditView",
        component: projectChangeView,
        meta: {
          title: "查看项目变更",
          busiType: "PROJECT_CHANGE",
        },
      },
      {
        path: "projectChangeAuditWorkView",
        name: "projectChangeAuditWorkView",
        component: projectChangeWorkView,
        meta: {
          title: "项目变更审批流操作",
          busiType: "PROJECT_CHANGE",
        },
      },
    ],
  },
  {
    path: "/projectInitial",
    name: "projectInitial",
    component: projectInitial,
    meta: {
      title: "项目初验",
      busiType: "PROJECT_FIRST",
      keepAlive: false,
    },
    children: [
      {
        path: "projectInitialAdd",
        name: "projectInitialAdd",
        component: projectInitialAdd,
        meta: {
          title: "初验申请",
          busiType: "PROJECT_FIRST",
        },
      },
      {
        path: "projectInitialView",
        name: "projectInitialView",
        component: projectInitialView,
        meta: {
          title: "项目初验查看",
          busiType: "PROJECT_FIRST",
        },
      },
      {
        path: "projectInitialWorkView",
        name: "projectInitialWorkView",
        component: projectInitialWorkView,
        meta: {
          title: "项目初验审批",
          busiType: "PROJECT_FIRST",
        },
      },
    ],
  },
  {
    path: "/projectStart",
    name: "projectStart",
    component: projectStart,
    meta: {
      title: "项目启动",
      busiType: "PROJECT_STARTER",
      keepAlive: false,
    },
    children: [
      {
        path: "projectStartAdd",
        name: "projectStartAdd",
        component: projectStartAdd,
        meta: {
          title: "开工申请",
          busiType: "PROJECT_STARTER",
        },
      },
      {
        path: "projectStartView",
        name: "projectStartView",
        component: projectStartView,
        meta: {
          title: "项目启动查看",
          busiType: "PROJECT_STARTER",
        },
      },
      {
        path: "projectStartWorkView",
        name: "projectStartWorkView",
        component: projectStartWorkView,
        meta: {
          title: "项目启动审批",
          busiType: "PROJECT_STARTER",
        },
      },
    ],
  },
  {
    path: "/projectDisclosure",
    name: "projectDisclosure",
    component: projectDisclosure,
    meta: {
      title: "项目交底",
      busiType: "PROJECT_DISCLOSE",
      keepAlive: false,
    },
    children: [
      {
        path: "/projectDisclosureAdd",
        name: "projectDisclosureAdd",
        component: projectDisclosureAdd,
        meta: {
          title: "项目交底",
          busiType: "PROJECT_DISCLOSE",
        },
      },
      {
        path: "projectDisclosureView",
        name: "projectDisclosureView",
        component: projectDisclosureView,
        meta: {
          title: "项目交底查看",
          busiType: "PROJECT_DISCLOSE",
        },
      },
      {
        path: "projectDisclosureWorkView",
        name: "projectDisclosureWorkView",
        component: projectDisclosureWorkView,
        meta: {
          title: "项目交底",
          busiType: "PROJECT_DISCLOSE",
        },
      },
    ],
  },

  {
    path: "/ledger",
    name: "ledger",
    component: Ledger,
    meta: {
      title: "项目台账",
      busiType: "PROJECT_CHANGE",
      keepAlive: false,
    },
  },
  // 立项管理
  {
    path: "/projectManagement",
    name: "projectManagement",
    component: projectManagement, //projectManagementView
    meta: {
      title: "项目立项",
      busiType: "PROJECT_TASKSUN",
      keepAlive: false,
    },
    children: [
      {
        path: "projectAdd",
        name: "projectAdd",
        component: projectAdd,
        meta: {
          title: "集团初审",
          busiType: "PROJECT_TASKSUN",
        },
      },
      {
        path: "projectWorkView",
        name: "projectWorkView",
        component: projectWorkView,
        meta: {
          title: "项目立项",
          busiType: "PROJECT_TASKSUN",
        },
      },
      {
        path: "projectSeeView",
        name: "projectSeeView",
        component: projectSeeView,
        meta: {
          title: "查看立项",
          busiType: "PROJECT_TASKSUN",
        },
      },
    ],
  },
  {
    path: "/preResearchDelivery",
    name: "preResearchDelivery",
    component: preResearchDelivery,
    meta: {
      title: "预研交付申请",
      busiType: "PROJECT_PRE_RESEARCH_DELIVERY",
      keepAlive: false,
    },
    children: [
      {
        path: "preResearchDeliveryView",
        name: "preResearchDeliveryView",
        component: preResearchDeliveryView,
        meta: {
          title: "预研交付发起",
          busiType: "PROJECT_PRE_RESEARCH_DELIVERY",
          keepAlive: false,
        },
      },
      {
        path: "preResearchDeliveryWorkView",
        name: "preResearchDeliveryWorkView",
        component: preResearchDeliveryWorkView,
        meta: {
          title: "预研交付发起",
          busiType: "PROJECT_PRE_RESEARCH_DELIVERY",
        },
      },
      {
        path: "/preResearchDeliveryAdd",
        name: "preResearchDeliveryAdd",
        component: preResearchDeliveryAdd,
        meta: {
          title: "预研交付发起",
          busiType: "PROJECT_PRE_RESEARCH_DELIVERY",
        },
      },

      // {
      //   path: "groupView",
      //   name: "groupView",
      //   component: groupView,
      //   meta: {
      //     title: "集团审议",
      //     busiType: "PROJECT_CHANGE",
      //   },
      // },
      // {
      //   path: "interiorView",
      //   name: "interiorView",
      //   component: interiorView,
      //   meta: {
      //     title: "内部立项",
      //     busiType: "PROJECT_CHANGE",
      //   },
      // },
    ],
  },
  // 项目终验
  {
    path: "/projectEnd",
    name: "projectEnd",
    component: projectEnd, //projectManagementView
    meta: {
      title: "项目终验",
      busiType: "PROJECT_CHANGE",
      keepAlive: false,
    },
    children: [
      {
        path: "projectEndAdd",
        name: "projectEndAdd",
        component: projectEndAdd,
        meta: {
          title: "发起终验",
          busiType: "PROJECT_TASKSUN",
        },
      },
      {
        path: "projectEndWorkView",
        name: "projectEndWorkView",
        component: projectEndWorkView,
        meta: {
          title: "项目终验",
          busiType: "PROJECT_TASKSUN",
        },
      },
      {
        path: "projectEndView",
        name: "projectEndView",
        component: projectEndView,
        meta: {
          title: "查看终验",
          busiType: "PROJECT_TASKSUN",
        },
      },
    ],
  },
  // 项目结项
  {
    path: "/projectClose",
    name: "projectClose",
    component: projectClose, //projectManagementView
    meta: {
      title: "项目结项",
      busiType: "PROJECT_ClOSE",
      keepAlive: false,
    },
    children: [
      {
        path: "projectCloseAdd",
        name: "projectCloseAdd",
        component: projectCloseAdd,
        meta: {
          title: "发起结项",
          busiType: "PROJECT_ClOSE",
        },
      },
      {
        path: "projectCloseWork",
        name: "projectCloseWork",
        component: projectCloseWork,
        meta: {
          title: "项目结项",
          busiType: "PROJECT_ClOSE",
        },
      },
      {
        path: "projectCloseView",
        name: "projectCloseView",
        component: projectCloseView,
        meta: {
          title: "查看结项",
          busiType: "PROJECT_ClOSE",
        },
      },
    ],
  },
  // 采购管理
  {
    path: "/purchasingManagement",
    name: "purchasingManagement",
    component: purchasingManagement, //purchasingManagement
    meta: {
      title: "采购管理",
      busiType: "PROJECT_ClOSE",
      keepAlive: false,
    },
    children: [
      {
        path: "purchasingManagementAdd",
        name: "purchasingManagementAdd",
        component: purchasingManagementAdd,
        meta: {
          title: "采购管理_编辑",
          busiType: "PROJECT_ClOSE",
        },
      },
      {
        path: "purchasingManagementView",
        name: "purchasingManagementView",
        component: purchasingManagementView,
        meta: {
          title: "采购管理_查看",
          busiType: "PROJECT_ClOSE",
        },
      },
    ],
  },

  {
    path: "/projectChangeManagement",
    name: "projectChangeManagement",
    component: projectChangeManagement,
    meta: {
      title: "项目变更",
      busiType: "PROJECT_WEEKLY_REPORT",
      keepAlive: true,
    },
    // projectChangeManagementAdd
    children: [
      {
        path: "projectChangeApplication",
        name: "projectChangeApplication",
        component: projectChangeApplication,
        meta: {
          title: "申请变更填写",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
      {
        path: "projectChangeManagementView",
        name: "projectChangeManagementView",
        component: projectChangeManagementView,
        meta: {
          title: "申请变更查看",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
      {
        path: "projectChangeManagementEdit",
        name: "projectChangeManagementEdit",
        component: projectChangeApplication,
        meta: {
          title: "编辑项目变更申报",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
      // projectChangeManagementworkView
      {
        path: "projectChangeManagementworkView",
        name: "projectChangeManagementworkView",
        component: projectChangeManagementworkView,
        meta: {
          title: "项目变更审批",
          busiType: "PROJECT_WEEKLY_REPORT",
        },
      },
    ],
  },

  // 订单管理
  {
    path: "/orderManagement",
    name: "orderManagement",
    component: orderManagement,
    meta: {
      title: "订单管理",
      keepAlive: true,
    },
    children: [
      {
        path: "orderManagementView",
        name: "orderManagementView",
        component: orderManagementView,
        meta: {
          title: "合同管理详情",
        },
      },
      {
        path: "contractManagementView",
        name: "contractManagementView",
        component: contractManagementView,
        meta: {
          title: "订单管理详情",
        },
      },
      {
        path: "AddOrder",
        name: "AddOrder",
        component: AddOrder,
        meta: {
          title: "新增订单信息",
        },
      },
      {
        path: "AddContract",
        name: "AddContract",
        component: AddContract,
        meta: {
          title: "新增合同信息",
        },
      },
    ],
  },
  // 知识库
  {
    path: "/knowLedge",
    name: "knowLedge",
    component: KnowLedge,
    meta: {
      title: "知识库",
    },
    // children: [
    //   {
    //     path: "knowLedgeInfo",
    //     name: "knowLedgeInfo",
    //     component: KnowLedgeInfo,
    //     meta: {
    //       title: "知识库信息",
    //     },
    //   },
    // ],
  },
];

export default routes;
