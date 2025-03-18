import Vue, { KeepAlive } from "vue";
import VueRouter from "vue-router";
// 实施进度跟踪
const progress = () => import('../views/progress/index.vue');
const progressView = () => import('../views/progress/children/view.vue');

//合同信息管理
const contract = () => import("../views/contract/index.vue");
const contractList = () => import("../views/contract/children/list.vue");
const contractView = () => import("../views/contract/children/view.vue");
const contractEdit = () => import("../views/contract/children/add.vue");
//子合同
const subcontractList = () => import("../views/contract/children/subcontract/subcontractList.vue");
const subcontractView = () => import("../views/contract/children/subcontract/subcontractView.vue");
const subcontractEdit = () => import("../views/contract/children/subcontract/subcontractAdd.vue");
//资金管理 fund
const fundView = () => import("../views/contract/children/fund/fundView.vue");
const fundEdit = () => import("../views/contract/children/fund/fundAdd.vue");
// views/riskAndIssueNew/children/list.vue
//实施方案编制
const bianzhi = () => import("../views/bianzhi/index.vue");
const bianzhiInitiateAdd = () => import("../views/bianzhi/children/add.vue");
const bianzhiInitiateEdit = () => import("../views/bianzhi/children/add.vue");
const bianzhiInitiateDetail = () => import("../views/bianzhi/children/InitiateDetail.vue");
const bianzhiInitiateSee = () => import("../views/bianzhi/children/view.vue");
const bianzhiInitiateMemberSee = () => import("../views/bianzhi/children/view.vue");
const bianzhiInitiateWorkview = () => import("../views/bianzhi/children/InitiateWorkview.vue");

// 成员管理
const memberMgr = () => import("../views/memberMgr/index.vue");
const memberMgrView = () => import("../views/memberMgr/children/view.vue");

//专家管理
const expert = () => import("../views/expert/index.vue")
const expertList = () => import("../views/expert/children/list.vue")
const expertAdd = () => import("../views/expert/children/add.vue")
const expertEdit = () => import("../views/expert/children/add.vue")
const expertView = () => import("../views/expert/children/view.vue")
const expertWorkView = () => import("../views/expert/children/workView.vue")

//评审活动
const activityList = () => import("../views/activityList/index.vue")
const activityAdd = () => import("../views/activityList/children/add.vue")
const activityView = () => import("../views/activityList/children/view.vue")
const activityExtract = () => import("../views/activityList/children/extract.vue")
const querenCanhui = () => import("../views/activityList/children/querenCanhui.vue")
const pingjia = () => import("../views/activityList/children/pingjia.vue")
//专家请假
const absenceApply = () => import("../views/absenceApply/index.vue")
const absenceApplyWorkView = () => import("../views/absenceApply/children/workView.vue")
const absenceApplyView = () => import("../views/absenceApply/children/view.vue")

// 项目报送与报备
const report = () => import("../views/report/index.vue");
// 报送
const submit = () => import("../views/report/submit/index.vue");
const submitEdit = () => import("../views/report/submit/add.vue");
const submitView = () => import("../views/report/submit/view.vue");
// 报备
const course = () => import("../views/report/course/index.vue");
const courseView = () => import("../views/report/course/view.vue");

// 预警与防范
const issue = () => import("../views/issue/index.vue");
// 风险
const risk = () => import("../views/issue/risk/index.vue");
const riskView = () => import("../views/issue/risk/view.vue");
const riskEdit = () => import("../views/issue/risk/add.vue");
const riskDispose = () => import("../views/issue/risk/dispose.vue");
const riskWorkView = () => import("../views/issue/risk/workView.vue");
// 问题
const trouble = () => import("../views/issue/trouble/index.vue");
const troubleView = () => import("../views/issue/trouble/view.vue");
const troubleEdit = () => import("../views/issue/trouble/add.vue");
const troubleDispose = () => import("../views/issue/trouble/dispose.vue");
const troubleWorkView = () => import("../views/issue/trouble/workView.vue");

//项目启停管理
const startStop = () => import("../views/startStop/index.vue");
const startStopView = () => import("../views/startStop/children/view.vue");
const startStopWorkView = () => import("../views/startStop/children/workView.vue");
const startStopApply = () => import("../views/startStop/children/apply.vue");
//任务管理
const task = () => import("../views/task/index.vue");
const taskView = () => import("../views/task/children/view.vue");
const taskWorkView = () => import("../views/task/children/workView.vue");
const taskList = () => import("../views/task/children/taskList.vue")
// 交付物管理
const deliver = () => import("../views/deliver/index.vue");
const deliverView = () => import("../views/deliver/children/view.vue");
// 里程碑阶段审查
const milestone = () => import("../views/milestone/index.vue");
const milestoneReport = () => import("../views/milestone/children/report.vue");
const milestoneList = () => import("../views/milestone/children/milestonelist.vue");
//初验
const preliminaryMgr = () => import("@/views/preliminaryMgr/index.vue");
const preliminaryMgrList = () => import("@/views/preliminaryMgr/children/list.vue");
const preliminaryMgrView = () => import("@/views/preliminaryMgr/children/view.vue");
const preliminaryMgrWorkView = () => import("@/views/preliminaryMgr/children/workView.vue");
//试运行
const pilotMgr = () => import("@/views/pilotMgr/index.vue");
const pilotMgrList = () => import("@/views/pilotMgr/children/list.vue");
const pilotMgrView = () => import("@/views/pilotMgr/children/view.vue");
const pilotMgrWorkView = () => import("@/views/pilotMgr/children/workView.vue");
//终验
const finalAcceptance = () => import("@/views/finalAcceptance/index.vue");
const finalAcceptanceList = () => import("@/views/finalAcceptance/children/list.vue");
const finalAcceptanceView = () => import("@/views/finalAcceptance/children/view.vue");
const finalAcceptanceWorkView = () => import("@/views/finalAcceptance/children/workView.vue");

//竣工
const beCompleted = () => import("@/views/beCompleted/index.vue");
const beCompletedList = () => import("@/views/beCompleted/children/list.vue");
const beCompletedView = () => import("@/views/beCompleted/children/view.vue");
const beCompletedWorkView = () => import("@/views/beCompleted/children/workView.vue");

// 日常管理-风险问题
const riskAndIssue = () => import("../views/riskAndIssue/index.vue");
const riskAndIssueNew = () => import("../views/riskAndIssueNew/index.vue");
// 风险-问题
const everydaytroubleNew = () => import("../views/riskAndIssueNew/trouble/index.vue");
const everydaytroubleViewNew = () => import("../views/riskAndIssueNew/trouble/view.vue");
const everydaytroubleEditNew = () => import("../views/riskAndIssueNew/trouble/add.vue");
const everydaytroubleAssignNew = () => import("../views/riskAndIssueNew/trouble/assign.vue");
const everydaytroubleDisposeNew = () => import("../views/riskAndIssueNew/trouble/dispose.vue");
// 风险-新
const everydayriskNew = () => import("../views/riskAndIssueNew/risk/index.vue");
const everydayriskViewNew = () => import("../views/riskAndIssueNew/risk/view.vue");
const everydayriskEditNew = () => import("../views/riskAndIssueNew/risk/add.vue");
const everydayriskDisposeNew = () => import("../views/riskAndIssueNew/risk/dispose.vue");

// 风险
const everydayrisk = () => import("../views/riskAndIssue/risk/index.vue");
const everydayriskView = () => import("../views/riskAndIssue/risk/view.vue");
const everydayriskEdit = () => import("../views/riskAndIssue/risk/add.vue");
const everydayriskDispose = () => import("../views/riskAndIssue/risk/dispose.vue");
// 问题
const everydaytrouble = () => import("../views/riskAndIssue/trouble/index.vue");
const everydaytroubleView = () => import("../views/riskAndIssue/trouble/view.vue");
const everydaytroubleEdit = () => import("../views/riskAndIssue/trouble/add.vue");
const everydaytroubleDispose = () => import("../views/riskAndIssue/trouble/dispose.vue");

// 专家费用结算
const expenseSettlement = () => import("../views/expenseSettlement/index.vue");
const expenseSettlementView = () => import("../views/expenseSettlement/children/view.vue");

Vue.use(VueRouter);

const routes = [
    {
        path: "/riskAndIssueNew",
        name: "riskAndIssueNew",
        component: riskAndIssueNew,
        meta: {
            title: "风险问题管理",
            keepAlive: true
        },
        children: [
            {
                path: "everydayriskNew",
                name: "everydayriskNew",
                component: everydayriskNew,
                meta: {
                    title: "风险列表",
                    busiType: "PROJECT_RISK",
                    keepAlive: true
                },
                children: [
                    {
                        path: "everydayriskAddNew",
                        name: "everydayriskAddNew",
                        component: everydayriskEditNew,
                        meta: {
                            title: "新建风险",
                            busiType: "PROJECT_RISK"
                        },
                    },
                   {
                        path: "everydayriskEditNew",
                        name: "everydayriskEditNew",
                        component: everydayriskEditNew,
                        meta: {
                            title: "编辑风险",
                            busiType: "PROJECT_RISK"
                        },
                    },
                    {
                        path: "everydayriskViewNew",
                        name: "everydayriskViewNew",
                        component: everydayriskViewNew,
                        meta: {
                            title: "查看风险",
                            busiType: "PROJECT_RISK"
                        },
                    },
                    {
                        path: "everydayriskDisposeNew",
                        name: "everydayriskDisposeNew",
                        component: everydayriskDisposeNew,
                        meta: {
                            title: "处理风险",
                            busiType: "PROJECT_RISK"
                        },
                    },
                ],
            },
            {
                path: "everydaytroubleNew",
                name: "everydaytroubleNew",
                component: everydaytroubleNew,
                meta: {
                    title: "风险问题管理-问题管理",
                    busiType: "PROJECT_RISK",
                    keepAlive: true
                },
                children: [
                    {
                        path: "everydaytroubleEditNew",
                        name: "everydaytroubleEditNew",
                        component: everydaytroubleEditNew,
                        meta: {
                            title: "新建问题",
                            busiType: "PROJECT_RISK"
                        },
                    },
                    {
                        path: "everydaytroubleViewNew",
                        name: "everydaytroubleViewNew",
                        component: everydaytroubleViewNew,
                        meta: {
                            title: "查看问题",
                            busiType: "PROJECT_RISK"
                        },
                    },
                    {
                        path: "everydaytroubleAssignNew",
                        name: "everydaytroubleAssignNew",
                        component: everydaytroubleAssignNew,
                        meta: {
                            title: "指派处理人问题",
                            busiType: "PROJECT_RISK"
                        },
                    },
                    {
                        path: "everydaytroubleDisposeNew",
                        name: "everydaytroubleDisposeNew",
                        component: everydaytroubleDisposeNew,
                        meta: {
                            title: "处理问题",
                            busiType: "PROJECT_RISK"
                        },
                    },
                ],
            },
        ],
    },
    
    {
        path: "/progress",
        name: "progress",
        component: progress,
        meta: {
            title: "项目进度跟踪",
        },
        children: [
            {
                path: "progressView",
                name: "progressView",
                component: progressView,
                meta: {
                    title: "项目进度详情",
                },
            },
        ],
    },
    {
        path: "/contract",
        name: "contract",
        component: contract,
        meta: {
            title: "合同信息管理",
            busiType: 'CONTRACT_MANAGEMENT'
        },
        children: [
            {
                path: "contractList",
                name: "contractList",
                component: contractList,
                meta: {
                    title: "合同信息管理列表",
                    busiType: 'CONTRACT_MANAGEMENT'
                },
            },
            {
                path: "contractEdit",
                name: "contractEdit",
                component: contractEdit,
                meta: {
                    title: "编辑合同信息",
                    busiType: 'CONTRACT_MANAGEMENT'
                },
            },
            {
                path: "contractView",
                name: "contractView",
                component: contractView,
                meta: {
                    title: "查看合同信息",
                    busiType: 'CONTRACT_MANAGEMENT'
                },
            },
            {
                path: "subcontractList",
                name: "subcontractList",
                component: subcontractList,
                meta: {
                    title: "子合同信息列表",
                    busiType: 'CHILD_CONTRACT'
                },
                children: [
                    {
                        path: "subcontractView",
                        name: "subcontractView",
                        component: subcontractView,
                        meta: {
                            title: "查看子合同信息",
                            busiType: 'CHILD_CONTRACT'
                        },
                    },
                    {
                        path: "subcontractEdit",
                        name: "subcontractEdit",
                        component: subcontractEdit,
                        meta: {
                            title: "编辑子合同信息",
                            busiType: 'CHILD_CONTRACT'
                        },
                    },
                ],
            },
            {
                path: "fundList",
                name: "fundList",
                component: contractView,
                meta: {
                    title: "资金使用计划列表",
                    busiType: 'FUND_MANAGEMENT'
                },
                children: [
                    {
                        path: "fundView",
                        name: "fundView",
                        component: fundView,
                        meta: {
                            title: "查看资金使用计划",
                            busiType: 'FUND_MANAGEMENT'
                        },
                    },
                    {
                        path: "fundEdit",
                        name: "fundEdit",
                        component: fundEdit,
                        meta: {
                            title: "编辑资金使用计划",
                            busiType: 'FUND_MANAGEMENT'
                        },
                    },
                ],
            },
        ],
    },
    {
        path: "/riskAndIssueEverydayriskAdd",
        name: "everydayriskAdd",
        component: everydayriskEdit,
        meta: {
            title: "新建风险",
            type: "add",
            busiType: "PROJECT_RISK",
            meta: '/riskAndIssue'
        },
    },
    {
        path: "/riskAndIssueEverydaytroubleAdd",
        name: "everydaytroubleAdd",
        component: everydaytroubleEdit,
        meta: {
            title: "新建问题",
            type: "add",
            busiType: "PROJECT_QUESTION"
        },
    },
    // {
    //     path: "/riskAndIssue",
    //     name: "riskAndIssue",
    //     component: riskAndIssue,
    //     meta: {
    //         title: "风险问题管理",
    //     },
    //     children: [
    //         {
    //             path: "everydayrisk",
    //             name: "everydayrisk",
    //             component: everydayrisk,
    //             meta: {
    //                 title: "风险列表",
    //                 busiType: "PROJECT_RISK"
    //             },
    //             children: [
    //                 {
    //                     path: "everydayriskEdit",
    //                     name: "everydayriskEdit",
    //                     component: everydayriskEdit,
    //                     meta: {
    //                         title: "编辑风险",
    //                         busiType: "PROJECT_RISK"
    //                     },
    //                 },
    //                 {
    //                     path: "everydayriskView",
    //                     name: "everydayriskView",
    //                     component: everydayriskView,
    //                     meta: {
    //                         title: "查看风险",
    //                         busiType: "PROJECT_RISK"
    //                     },
    //                 },
    //                 {
    //                     path: "everydayriskDispose",
    //                     name: "everydayriskDispose",
    //                     component: everydayriskDispose,
    //                     meta: {
    //                         title: "处理风险",
    //                         busiType: "PROJECT_RISK"
    //                     },
    //                 },
    //             ],
    //         },
    //         {
    //             path: "everydaytrouble",
    //             name: "everydaytrouble",
    //             component: everydaytrouble,
    //             meta: {
    //                 title: "问题列表",
    //                 busiType: "PROJECT_QUESTION"
    //             },
    //             children: [
    //                 {
    //                     path: "everydaytroubleEdit",
    //                     name: "everydaytroubleEdit",
    //                     component: everydaytroubleEdit,
    //                     meta: {
    //                         title: "编辑问题",
    //                         busiType: "PROJECT_QUESTION"
    //                     },
    //                 },
    //                 {
    //                     path: "everydaytroubleView",
    //                     name: "everydaytroubleView",
    //                     component: everydaytroubleView,
    //                     meta: {
    //                         title: "查看问题",
    //                         busiType: "PROJECT_QUESTION"
    //                     },
    //                 },
    //                 {
    //                     path: "everydaytroubleDispose",
    //                     name: "everydaytroubleDispose",
    //                     component: everydaytroubleDispose,
    //                     meta: {
    //                         title: "处理问题",
    //                         busiType: "PROJECT_QUESTION"
    //                     },
    //                 },
    //             ],
    //         },
    //     ],
    // },

    {
        path: "/contractAdd",
        name: "contractAdd",
        component: contractEdit,
        meta: {
            title: "合同信息管理新增",
            type: "add",
            busiType: "CONTRACT_MANAGEMENT"
        },
    },
    {
        path: "/bianzhi",
        name: "bianzhi",
        component: bianzhi,
        meta: {
            title: "实施方案管理",
            busiType: 'PROJECT_SCHEME_REGISTER'
        },
        children: [
            {
                path: "bianzhiInitiateDetail",
                name: "bianzhiInitiateDetail",
                component: bianzhiInitiateDetail,
                meta: {
                    title: "实施方案编制",
                    busiType: 'PROJECT_SCHEME_REGISTER'
                },
            },
            {
                path: "bianzhiInitiateWorkview",
                name: "bianzhiInitiateWorkview",
                component: bianzhiInitiateWorkview,
                meta: {
                    title: "实施方案提审",
                    busiType: 'PROJECT_SCHEME_REGISTER'
                },
            },
            {
                path: "bianzhiInitiateSee",
                name: "bianzhiInitiateSee",
                component: bianzhiInitiateSee,
                meta: {
                    title: "实施方案查看",
                    busiType: 'PROJECT_SCHEME_REGISTER'
                },
            },
            {
                path: "bianzhiInitiateAdd",
                name: "bianzhiInitiateAdd",
                component: bianzhiInitiateAdd,
                meta: {
                    title: "实施方案新增",
                    busiType: 'PROJECT_SCHEME_REGISTER'
                },
            },
            {
                path: "bianzhiInitiateEdit",
                name: "bianzhiInitiateEdit",
                component: bianzhiInitiateEdit,
                meta: {
                    title: "实施方案编辑",
                    busiType: 'PROJECT_SCHEME_REGISTER'
                },
            },
            {
                path: "bianzhiInitiateMemberSee",
                name: "bianzhiInitiateMemberSee",
                component: bianzhiInitiateSee,
                meta: {
                    title: "实施方案成员管理查看",
                    busiType: 'PROJECT_SCHEME_REGISTER'
                },
            },
        ],
    },


    // 任务管理
    {
        path: "/memberMgr",
        name: "memberMgr",
        component: memberMgr,
        meta: {
            title: "项目成员管理",
        },
        children: [
            {
                path: "memberMgrView",
                name: "memberMgrView",
                component: memberMgrView,
                meta: {
                    title: "成员维护",
                },
            },
        ],
    },

    {
        path: "/report/submitAdd",
        name: "submitAdd",
        component: submitEdit,
        meta: {
            title: "新增项目周月报",
            type: "add",
            busiType: "PROJECT_REPORT"
        },
    },

    {
        path: "/report",
        name: "report",
        component: report,
        meta: {
            // title: "项目报送与报备",
            title: "项目周月报",
        },
        children: [
            {
                path: "submit",
                name: "submit",
                component: submit,
                meta: {
                    // title: "项目周月报列表",
                    title: "项目周月报",
                    busiType: "PROJECT_REPORT"
                },
                children: [
                    {
                        path: "submitEdit",
                        name: "submitEdit",
                        component: submitEdit,
                        meta: {
                            title: "编辑项目周月报",
                            busiType: "PROJECT_REPORT"
                        },
                    },
                    {
                        path: "submitView",
                        name: "submitView",
                        component: submitView,
                        meta: {
                            title: "查看项目周月报",
                            busiType: "PROJECT_REPORT"
                        },
                    },
                ],
            },
            {
                path: "course",
                name: "course",
                component: course,
                meta: {
                    title: "过程文档报备",
                    busiType: "PROJECT_PREPARED"
                },
                children: [

                    {
                        path: "courseView",
                        name: "courseView",
                        component: courseView,
                        meta: {
                            title: "查看过程文档报备",
                            busiType: "PROJECT_PREPARED"
                        },
                    },
                ],
            },
        ],
    },
    {
        path: "/issueriskAdd",
        name: "riskAdd",
        component: riskEdit,
        meta: {
            title: "新建风险",
            type: "add",
            busiType: "DISPATCH_RISK"
        },
    },
    {
        path: "/issuetroubleAdd",
        name: "troubleAdd",
        component: troubleEdit,
        meta: {
            title: "新建问题",
            type: "add",
            busiType: "DISPATCH_QUESTION"
        },
    },
    {
        path: "/issue",
        name: "issue",
        component: issue,
        meta: {
            title: "预警与防范",
        },
        children: [
            {
                path: "risk",
                name: "risk",
                component: risk,
                meta: {
                    title: "风险列表",
                    busiType: "DISPATCH_RISK"
                },
                children: [
                    {
                        path: "riskEdit",
                        name: "riskEdit",
                        component: riskEdit,
                        meta: {
                            title: "编辑风险",
                            busiType: "DISPATCH_RISK"
                        },
                    },
                    {
                        path: "riskView",
                        name: "riskView",
                        component: riskView,
                        meta: {
                            title: "查看风险",
                            busiType: "DISPATCH_RISK"
                        },
                    },
                    {
                        path: "riskDispose",
                        name: "riskDispose",
                        component: riskDispose,
                        meta: {
                            title: "处理风险",
                            busiType: "DISPATCH_RISK"
                        },
                    },
                    {
                        path: "riskWorkView",
                        name: "riskWorkView",
                        component: riskWorkView,
                        meta: {
                            title: "审核风险",
                            busiType: "DISPATCH_RISK"
                        },
                    },
                ],
            },
            {
                path: "trouble",
                name: "trouble",
                component: trouble,
                meta: {
                    title: "问题列表",
                    busiType: "DISPATCH_QUESTION"
                },
                children: [
                    {
                        path: "troubleEdit",
                        name: "troubleEdit",
                        component: troubleEdit,
                        meta: {
                            title: "编辑问题",
                            busiType: "DISPATCH_QUESTION"
                        },
                    },
                    {
                        path: "troubleView",
                        name: "troubleView",
                        component: troubleView,
                        meta: {
                            title: "查看问题",
                            busiType: "DISPATCH_QUESTION"
                        },
                    },
                    {
                        path: "troubleDispose",
                        name: "troubleDispose",
                        component: troubleDispose,
                        meta: {
                            title: "处理问题",
                            busiType: "DISPATCH_QUESTION"

                        },
                    },
                    {
                        path: "troubleWorkView",
                        name: "troubleWorkView",
                        component: troubleWorkView,
                        meta: {
                            title: "审核问题",
                            busiType: "DISPATCH_QUESTION"

                        },
                    },
                ],
            },
        ],
    },

    {
        path: "/startStop",
        name: "startStop",
        component: startStop,
        meta: {
            title: "项目启停管理",
            busiType: 'PROJECT_START_STOP'
        },
        children: [
            {
                path: "startStopView",
                name: "startStopView",
                component: startStopView,
                meta: {
                    title: "查看项目启停管理",
                    busiType: 'PROJECT_START_STOP'
                },
            },
            {
                path: "startStopWorkView",
                name: "startStopWorkView",
                component: startStopWorkView,
                meta: {
                    title: "审核启停管理",
                    busiType: 'PROJECT_START_STOP'
                },
            },
            {
                path: "startStopApply",
                name: "startStopApply",
                component: startStopApply,
                meta: {
                    title: "项目启停管理",
                    busiType: 'PROJECT_START_STOP'
                },
            },
        ],
    },
    {
        path: "/activityListActivityAdd",
        name: "/activityAdd",
        component: activityAdd,
        meta: {
            title: "新增评审活动",
            type: "add",
            busiType: "REVIEW_ACTIVITIES"
        },
    },
    {
        path: "/activityList",
        name: "activityList",
        component: activityList,
        meta: {
            title: "评审活动",
            busiType: "REVIEW_ACTIVITIES"
        },
        children: [

            {
                path: 'activityView',
                name: 'activityView',
                component: activityView,
                meta: {
                    title: '查看评审活动',
                    busiType: "REVIEW_ACTIVITIES"
                }
            },
            {
                path: 'activityExtract',
                name: 'activityExtract',
                component: activityExtract,
                meta: {
                    title: '抽取专家',
                    busiType: "EXPERT_CQ"
                }
            },
            {
                path: 'activitycanhui',
                name: 'activitycanhui',
                component: querenCanhui,
                meta: {
                    title: '确认参会',
                    busiType: "EXPERT_CQ"
                }
            },
            {
                path: 'activitypingjia',
                name: 'activitypingjia',
                component: pingjia,
                meta: {
                    title: '专家评价',
                    busiType: "EXPERT_CQ"
                }
            }

        ],
    },
    {
        path: "/expertAdd",
        name: "expertAdd",
        component: expertAdd,
        meta: {
            title: "新增专家",
            type: "add",
            busiType: "SPECIALIST_MANAGE"
        },
    },
    //专家库
    {
        path: "/expert",
        name: "expert",
        component: expert,
        meta: {
            title: "专家列表",
            busiType: "SPECIALIST_MANAGE"
        },
        children: [
            {
                path: "expertList",
                name: "expertList",
                component: expertList,
                meta: {
                    title: "专家库列表",
                    busiType: "SPECIALIST_MANAGE"
                },
            },
            {
                path: "expertEdit",
                name: "expertEdit",
                component: expertEdit,
                meta: {
                    title: "编辑专家",
                    busiType: 'SPECIALIST_MANAGE'
                },
            },
            {
                path: "expertView",
                name: "expertView",
                component: expertView,
                meta: {
                    title: "专家详情",
                    busiType: 'SPECIALIST_MANAGE'
                },
            },
            {
                path: "expertWorkView",
                name: "expertWorkView",
                component: expertWorkView,
                meta: {
                    title: "专家库审批流",
                    busiType: 'SPECIALIST_MANAGE'
                }
            }
        ],
    },
    {
        path: "/absenceApply",
        name: "absenceApply",
        component: absenceApply,
        meta: {
            title: "请假管理",
            busiType: "SPECIALIST_HOLIDAYS"
        },
        children: [
            {
                path: "absenceApplyWorkView",
                name: "absenceApplyWorkView",
                component: absenceApplyWorkView,
                meta: {
                    title: "请假审批",
                    busiType: "SPECIALIST_HOLIDAYS"
                }
            },
            {
                path: "absenceApplyView",
                name: "absenceApplyView",
                component: absenceApplyView,
                meta: {
                    title: "请假详情",
                    busiType: "SPECIALIST_HOLIDAYS"
                }
            }
        ]
    },
    {
        path: '/expenseSettlement',
        name: "expenseSettlement",
        component: expenseSettlement,
        meta: {
            title: "专家费用结算",
            busiType: "TAST_MANAGE"
        },
        children: [
            {
                path: "expenseSettlementView",
                name: "expenseSettlementView",
                component: expenseSettlementView,
                meta: {
                    title: "专家费用结算详情",
                    busiType: "TAST_MANAGE"
                },
            },
        ],

    },
    // 任务管理
    {
        path: "/taskmgr",
        name: "taskProjectList",
        component: task,
        meta: {
            title: "任务管理",
            busiType: "TAST_MANAGE"
        },
        children: [
            {
                path: "taskList",
                name: "taskList",
                component: taskList,
                meta: {
                    title: "任务列表",
                    busiType: "TAST_MANAGE"
                },
            },
            {
                path: "taskView",
                name: "taskView",
                component: taskView,
                meta: {
                    title: "任务详情",
                    busiType: "TAST_MANAGE"
                },
            },
            {
                path: "taskCheck",
                name: "taskCheck",
                component: taskWorkView,
                meta: {
                    title: "任务检查",
                    busiType: "TAST_MANAGE"
                },
            },
            {
                path: "taskDispose",
                name: "taskDispose",
                component: taskWorkView,
                meta: {
                    title: "任务处理",
                    busiType: "TAST_MANAGE"
                },
            }
        ],
    },
    // 交付物管理
    {
        path: "/deliverMgr",
        name: "deliverProjectList",
        component: deliver,
        meta: {
            title: "交付物管理",
            busiType: "PROJECT_DELIVERY"
        },
        children: [
            {
                path: "deliverTaskView",
                name: "deliverTaskView",
                component: deliverView,
                meta: {
                    title: "交付物管理",
                    busiType: "PROJECT_DELIVERY"
                },
            },
        ],
    },
    // 里程碑阶段审查 MILESTONE_REVIEW
    {
        path: "/milestoneAudit",
        name: "milestoneProjectList",
        component: milestone,
        meta: {
            title: "里程碑阶段审查",
            busiType: 'MILESTONE_REVIEW'
        },
        children: [
            {
                path: "milestoneList",
                name: "milestoneList",
                component: milestoneList,
                meta: {
                    title: "里程碑阶段审查列表",
                    busiType: 'MILESTONE_REVIEW'
                },
            },
            {
                path: "milestoneEdit",
                name: "milestoneEdit",
                component: milestoneReport,
                meta: {
                    title: "里程碑阶段审查里程编辑",
                    busiType: 'MILESTONE_REVIEW'
                },
            },
            {
                path: "milestoneView",
                name: "milestoneView",
                component: milestoneReport,
                meta: {
                    title: "里程碑阶段审查里程查看",
                    busiType: 'MILESTONE_REVIEW'
                },
            },
            {
                path: "milestoneReport",
                name: "milestoneReport",
                component: milestoneReport,
                meta: {
                    title: "里程碑阶段审查里程汇报",
                    busiType: 'MILESTONE_REVIEW'
                },
            },
        ],
    },
    //初验
    {
        path: "/preliminaryMgr",
        name: "preliminaryMgr",
        component: preliminaryMgr,
        meta: {
            title: "初验管理",
            busiType: "FIRST_CHECK"
        },
        children: [
            {
                path: "projectList",
                name: "preliminaryProjectList",
                component: preliminaryMgrList,
                meta: {
                    title: "初验管理列表",
                    busiType: "FIRST_CHECK"
                },
            },
            {
                path: "preliminaryMgrView",
                name: "preliminaryMgrView",
                component: preliminaryMgrView,
                meta: {
                    title: "初验管理查看",
                    busiType: "FIRST_CHECK"
                },
            },
            {
                path: "preliminaryMgrApplyFor",
                name: "preliminaryMgrApplyFor",
                component: preliminaryMgrWorkView,
                meta: {
                    title: "初验申请",
                    busiType: "FIRST_CHECK"
                },
            },
            {
                path: "preliminarySupervisor",
                name: "preliminarySupervisor",
                component: preliminaryMgrWorkView,
                meta: {
                    title: "初验检查",
                    busiType: "FIRST_CHECK"
                },
            },
            {
                path: "preliminaryAffirm",
                name: "preliminaryAffirm",
                component: preliminaryMgrWorkView,
                meta: {
                    title: "初验审查",
                    busiType: "FIRST_CHECK"
                },
            },
        ],
    },
    {
        path: "/preliminaryMgrAdd",
        name: "preliminaryMgrAdd",
        component: preliminaryMgrWorkView,
        meta: {
            title: "初验申请",
            busiType: "FIRST_CHECK",
            type: 'add'
        },
    },
    {
        path: "/pilotMgrAdd",
        name: "pilotMgrAdd",
        component: pilotMgrWorkView,
        meta: {
            title: "试运行申请",
            busiType: "PILOT_RUN",
            type: 'add'
        },
    },
    {
        path: "/finalAcceptanceAdd",
        name: "finalAcceptanceAdd",
        component: finalAcceptanceWorkView,
        meta: {
            title: "终验申请",
            busiType: "LAST_CHECK",
            type: 'add'
        },
    },
    {
        path: "/beCompletedAdd",
        name: "beCompletedAdd",
        component: beCompletedWorkView,
        meta: {
            title: "竣工验收申请",
            busiType: "LAST_CHECK",
            type: 'add'
        },
    },
    //试运行
    {
        path: "/pilotMgr",
        name: "pilotMgr",
        component: pilotMgr,
        meta: {
            title: "试运行管理",
            busiType: "PILOT_RUN"
        },
        children: [
            {
                path: "projectList",
                name: "pilotProjectList",
                component: pilotMgrList,
                meta: {
                    title: "试运行管理列表",
                    busiType: "PILOT_RUN"
                },
            },
            {
                path: "pilotMgrView",
                name: "pilotMgrView",
                component: pilotMgrView,
                meta: {
                    title: "试运行管理查看",
                    busiType: "PILOT_RUN"
                },
            },
            {
                path: "pilotMgrApplyFor",
                name: "pilotMgrApplyFor",
                component: pilotMgrWorkView,
                meta: {
                    title: "试运行申请",
                    busiType: "PILOT_RUN"
                },
            },
            {
                path: "pilotMgrSupervisor",
                name: "pilotMgrSupervisor",
                component: pilotMgrWorkView,
                meta: {
                    title: "试运行检查",
                    busiType: "PILOT_RUN"
                },
            },
            {
                path: "pilotMgrAffirm",
                name: "pilotMgrAffirm",
                component: pilotMgrWorkView,
                meta: {
                    title: "试运行确认",
                    busiType: "PILOT_RUN"
                },
            },
        ],
    },
    //终验
    {
        path: "/finalAcceptance",
        name: "finalAcceptance",
        component: finalAcceptance,
        meta: {
            title: "终验管理",
            busiType: "LAST_CHECK"
        },
        children: [
            {
                path: "projectList",
                name: "finalAcceptanceProjectList",
                component: finalAcceptanceList,
                meta: {
                    title: "终验管理列表",
                    busiType: "LAST_CHECK"
                },
            },
            {
                path: "finalAcceptanceView",
                name: "finalAcceptanceView",
                component: finalAcceptanceView,
                meta: {
                    title: "终验管理查看",
                    busiType: "LAST_CHECK"
                },
            },
            {
                path: "finalAcceptanceApplyFor",
                name: "finalAcceptanceApplyFor",
                component: finalAcceptanceWorkView,
                meta: {
                    title: "终验申请",
                    busiType: "LAST_CHECK"
                },
            },
            {
                path: "finalAcceptanceSupervisor",
                name: "finalAcceptanceSupervisor",
                component: finalAcceptanceWorkView,
                meta: {
                    title: "终验检查",
                    busiType: "LAST_CHECK"
                },
            },
            {
                path: "finalAcceptanceAffirm",
                name: "finalAcceptanceAffirm",
                component: finalAcceptanceWorkView,
                meta: {
                    title: "终验审核",
                    busiType: "LAST_CHECK"
                },
            },
            {
                path: "finalAcceptanceApproval",
                name: "finalAcceptanceApproval",
                component: finalAcceptanceWorkView,
                meta: {
                    title: "终验审批",
                    busiType: "LAST_CHECK"
                },
            },
        ],
    },
    //竣工
    {
        path: "/beCompleted",
        name: "beCompleted",
        component: beCompleted,
        meta: {
            title: "竣工验收管理",
            busiType: "JGYS"
        },
        children: [
            {
                path: "beCompletedProjectList",
                name: "beCompletedProjectList",
                component: beCompletedList,
                meta: {
                    title: "竣工验收管理列表",
                    busiType: "JGYS"
                },
            },
            {
                path: "beCompletedView",
                name: "beCompletedView",
                component: beCompletedView,
                meta: {
                    title: "竣工验收管理查看",
                    busiType: "JGYS"
                },
            },
            {
                path: "beCompletedApplyFor",
                name: "beCompletedApplyFor",
                component: beCompletedWorkView,
                meta: {
                    title: "竣工验收申请",
                    busiType: "JGYS"
                },
            },
            {
                path: "beCompletedSupervisor",
                name: "beCompletedSupervisor",
                component: beCompletedWorkView,
                meta: {
                    title: "竣工验收检查",
                    busiType: "JGYS"
                },
            },
            {
                path: "beCompletedAffirm",
                name: "beCompletedAffirm",
                component: beCompletedWorkView,
                meta: {
                    title: "竣工验收审核",
                    busiType: "JGYS"
                },
            },
            {
                path: "beCompletedApproval",
                name: "beCompletedApproval",
                component: beCompletedWorkView,
                meta: {
                    title: "竣工验收审批",
                    busiType: "JGYS"
                },
            },
        ],
    },

];

export default routes;
