import request from "@/utils/request";
const URL = '/jfzg/projectImpl'

// 项目详情
export function api_getProjectById(params) {
  return request({
    url: `${URL}/xmjdxq/getProjectById`,
    method: 'get',
    params
  })
}
// 项目进度 
export function overdueTime(params) {
  return request({
    url: `${URL}/xmjdxq/overdueTime`,
    method: 'get',
    params
  })
}

// 风险问题
export function riskAndProblemQuantity(params) {
  return request({
    url: `${URL}/xmjdxq/riskAndProblemQuantity`,
    method: 'get',
    params
  })
}

// 任务完成情况
export function task(params) {
  return request({
    url: `${URL}/xmjdxq/task`,
    method: 'get',
    params
  })
}

// 交付物情况
export function delivery(params) {
  return request({
    url: `${URL}/xmjdxq/delivery`,
    method: 'get',
    params
  })
}

// 交付物提交情况
export function deliveryFileSubmit(params) {
  return request({
    url: `${URL}/xmjdxq/deliveryFileSubmit`,
    method: 'get',
    params
  })
}

// 检查通过率	
export function deliveryFilePass(params) {
  return request({
    url: `${URL}/xmjdxq/deliveryFilePass`,
    method: 'get',
    params
  })
}

// 交付物清单	
export function getDeliveryFileList(params) {
  return request({
    url: `${URL}/xmjdxq/getDeliveryFileList`,
    method: 'get',
    params
  })
}

// 交付物清单	分页
export function deliveryList(data) {
  return request({
    url: `${URL}/xmjdxq/deliveryList`,
    method: 'post',
    data
  })
}

// 里程碑列表
export function milestone_list(data) {
  return request({
    url: `${URL}/milestoneReview/list`,
    method: 'post',
    data
  })
}
/**
* 
* @param {中长期规划单个详情} data 
*/
export function detailMediumlongPlan(params) {
  let temp =
  {
    "id": 12616,
    "belongPlanType": null,
    "cityPlanId": null,
    "cityPlanName": null,
    "specialPlanId": null,
    "specialPlanName": null,
    "mediumlongProjectName": "变更附件1234",
    "mediumlongProjectNo": null,
    "mediumlongProjectCode": "CS-XM-2106240013",
    "industryNo": null,
    "industryNoName": null,
    "industryParentNo": null,
    "industryParentNoName": null,
    "totalInvestment": 1234,
    "projectType": "CSJCXMM,CSRJKFM,CSYXWHM,CSZXFWL",
    "projectTypeName": "集成项目,软件开发,运行维护,咨询服务",
    "constructionSite": null,
    "beginDate": null,
    "endDate": null,
    "contactName": null,
    "contactMobile": null,
    "contactEmail": null,
    "responsibilityBuid": 52,
    "responsibilityBuName": null,
    "background": "",
    "objective": "",
    "content": "",
    "contentFile": "",
    "industryCode": null,
    "industryName": null,
    "developmentFlag": null,
    "developmentName": null,
    "industrialStructureCode": null,
    "industrialStructureName": null,
    "administrativeDivisionCode": null,
    "administrativeDivisionName": null,
    "projectClassificationCode": null,
    "projectClassificationName": null,
    "approvalCode": null,
    "approvalName": null,
    "fundAttributeCode": null,
    "fundAttributeName": null,
    "constructionNatureCode": null,
    "constructionNatureName": null,
    "itemCategoryCode": null,
    "itemCategoryName": null,
    "activationStatus": 1,
    "status": 1,
    "currentNode": null,
    "creatorJfid": 9,
    "creatorFullName": "肖道刚",
    "creatorBuid": 52,
    "creatorBuName": "长沙市数据资源管理局",
    "createTime": "2021-06-24 15:28:20",
    "updaterJfid": null,
    "updaterFullName": null,
    "updateTime": "2021-06-24 15:28:20",
    "isDelete": 0,
    "workflowId": null,
    "isTrial": 0,
    "platform": "CHANGSHA_CLOUD",
    "checkBuid": null,
    "businessBuid": null,
    "businessBuName": null,
    "projectLeader": null,
    "projectLeaderPosition": null,
    "isImport": false,
    "projectSourceType": 3,
    "advanceTec": "0",
    "isAdvanceTec": 0,
    "projectNameDghy": null,
    "otherFile": null,
    "buildName": null,
    "approvalUserName": null,
    "approvalPhone": null,
    "yearMediumlongPlanId": null,
    "projectLabel": null,
    "projectLabelName": null,
    "contentFileInfo": null,
    "replyTime": null,
    "replyName": null,
    "replyOpinion": null,
    "replyOpinionFile": null,
    "replyOpinionFileInfo": null,
    "workStatus": null,
    "workorderId": null,
    "workorderTaskId": null,
    "developmentCodeName": null,
    "workflowStatus": null,
    "evaluationStatus": null,
    "busiStatistics": null,
    "otherFileInfo": null,
    "yearMediumlongPlanName": null

  };
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {风险/问题饼图} data 
*/
export function riskQuestionPieChart(params) {
  let temp = {
    "questionData": {
      "secondary": null,
      "highNum": null,
      "lowNum": null
    },
    "taskData": {
      "secondary": null,
      "highNum": null,
      "lowNum": null
    }

  };
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {统筹风险和问题} data 
*/
export function deliRiskStatistics(params) {
  let temp = {};
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {总体项目资金统筹} data 
*/
export function getAmount(params) {
  let temp = {
    "planAmount": null,
    "zbAmount": 3048610,
    "monthAmount": 0,
    "totalAmount": 0,
    "applyAmount": null,
    "totalCumulativePay": 95,
    "thisMonthPay": 27,
    "totalRate": 0,
    "yearRate": 0

  };
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {概览交付物近三个月提交统计} data 
*/
export function getNearThreeMon(params) {
  let temp = [
    {
      "total": 0,
      "month": 6
    },
    {
      "total": 1,
      "month": 7
    },
    {
      "total": 0,
      "month": 8
    },
    {
      "total": 0,
      "month": 9
    },
    {
      "total": 0,
      "month": 10
    },
    {
      "total": 0,
      "month": 11
    }
  ]
    ;
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {交付物完成情况} data 
*/
export function getAdoptDeliInfo(params) {
  let temp = { "adoptedDeliTotal": 1, "checkingDeli": 0, "adoptedDeli": 1, "unadoptedDeli": 0 };
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {近期内质量评估数据} data 
*/
export function getQualityByParam(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {统计三个月内汇报次数接口} data 
*/
export function reportCount(params) {
  let temp = {
    "totalCount": 0,
    "threeDateList": null,
    "totalDate": null,
    "codeList": [
      {
        "monthCount": "77",
        "month": "06",
        "sort": 1
      },
      {
        "monthCount": "88",
        "month": "07",
        "sort": 1
      },
      {
        "monthCount": "60",
        "month": "08",
        "sort": 1
      },
      {
        "monthCount": "0",
        "month": "09",
        "sort": 1
      },
      {
        "monthCount": "0",
        "month": "10",
        "sort": 1
      },
      {
        "monthCount": "0",
        "month": "11",
        "sort": 1
      }
    ],
    "dateCodeList": null

  };
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {交付物情况} data 
*/
export function getDeliSituation(params) {
  let temp = {
    "submitted": 1,
    "shouldSubmit": 38,
    "submitPercentage": "2.63"

  };
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {技术性检查工单-进度检查情况} data 
*/
export function statisticsWorkOrderCount(params) {
  let temp = {
    "allCount": 0,
    "itemRate": 0,
    "itemCount": 0
  };
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {工单里程碑质量评估} data 
*/
export function qualityAssessment(params) {
  let temp = [
    {
      "checkScore": 0,
      "stageName": "初步验收阶段",
      "warningScoreMemo": null,
      "entity_id": null,
      "manualAlarmrReason": null,
      "stageId": 4448
    },
    {
      "checkScore": 0,
      "stageName": "试运行阶段",
      "warningScoreMemo": null,
      "entity_id": null,
      "manualAlarmrReason": null,
      "stageId": 4449
    },
    {
      "checkScore": 0,
      "stageName": "竣工验收阶段",
      "warningScoreMemo": null,
      "entity_id": null,
      "manualAlarmrReason": null,
      "stageId": 4450
    }
  ]

  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {事件汇报情况} data 
*/
export function projectOverview(params) {
  let temp = {
    "project": {
      "totalCount": 0,
      "threeDateList": [],
      "totalDate": null,
      "codeList": null,
      "dateCodeList": [
        {
          "date": "2021-08-14",
          "eventNum": 0
        },
        {
          "date": "2021-08-15",
          "eventNum": 0
        },
        {
          "date": "2021-08-16",
          "eventNum": 0
        },
        {
          "date": "2021-08-17",
          "eventNum": 0
        },
        {
          "date": "2021-08-18",
          "eventNum": 0
        },
        {
          "date": "2021-08-19",
          "eventNum": 0
        },
        {
          "date": "2021-08-20",
          "eventNum": 0
        }
      ]
    },
    "taskInfo": [
      {
        "count": 32,
        "deadline": "2021-08-14"
      },
      {
        "count": 32,
        "deadline": "2021-08-15"
      },
      {
        "count": 32,
        "deadline": "2021-08-16"
      },
      {
        "count": 32,
        "deadline": "2021-08-17"
      },
      {
        "count": 32,
        "deadline": "2021-08-18"
      },
      {
        "count": 32,
        "deadline": "2021-08-19"
      },
      {
        "count": 32,
        "deadline": "2021-08-20"
      }
    ]

  };
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {任务燃尽图} data 
*/
export function taskStatistics(params) {
  let temp = [
    {
      "count": 32,
      "deadline": "2021-08-14"
    },
    {
      "count": 32,
      "deadline": "2021-08-15"
    },
    {
      "count": 32,
      "deadline": "2021-08-16"
    },
    {
      "count": 32,
      "deadline": "2021-08-17"
    },
    {
      "count": 32,
      "deadline": "2021-08-18"
    },
    {
      "count": 32,
      "deadline": "2021-08-19"
    },
    {
      "count": 32,
      "deadline": "2021-08-20"
    }
  ]

  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {通过父项目Id查询子项目list} data 
*/
export function getSonPro(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}


/**
* 
* @param {新增贯标} data 
*/
export function saveConstructionexperience(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {获取公告详情} data 
*/
export function getDetail(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {经验推广和服务能力接口} data 
*/
export function serverListInfo(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {里程碑完成情况 时间节点接口} data 
*/
export function stageCompleteNode(params) {
  let temp = [
    {
      "isDelay": 1,
      "stageName": "项目启动阶段",
      "delayNum": 49,
      "showTime": "2021-07-02",
      "actualEndTime": null,
      "isEnd": "1",
      "dueEndTime": "2021-07-02",
      "stageId": 4442,
      "isComplete": "0"
    },
    {
      "isDelay": 1,
      "stageName": "需求分析阶段",
      "delayNum": 47,
      "showTime": "2021-07-04",
      "actualEndTime": null,
      "isEnd": "1",
      "dueEndTime": "2021-07-04",
      "stageId": 4443,
      "isComplete": "0"
    },
    {
      "isDelay": 1,
      "stageName": "系统设计阶段",
      "delayNum": 45,
      "showTime": "2021-07-06",
      "actualEndTime": null,
      "isEnd": "1",
      "dueEndTime": "2021-07-06",
      "stageId": 4444,
      "isComplete": "0"
    },
    {
      "isDelay": 1,
      "stageName": "系统开发阶段",
      "delayNum": 43,
      "showTime": "2021-07-08",
      "actualEndTime": null,
      "isEnd": "0",
      "dueEndTime": "2021-07-08",
      "stageId": 4445,
      "isComplete": "0"
    },
    {
      "isDelay": 1,
      "stageName": "系统测试阶段",
      "delayNum": 40,
      "showTime": "2021-07-11",
      "actualEndTime": null,
      "isEnd": "0",
      "dueEndTime": "2021-07-11",
      "stageId": 4446,
      "isComplete": "0"
    },
    {
      "isDelay": 1,
      "stageName": "部署实施阶段",
      "delayNum": 38,
      "showTime": "2021-07-13",
      "actualEndTime": null,
      "isEnd": "0",
      "dueEndTime": "2021-07-13",
      "stageId": 4447,
      "isComplete": "0"
    },
    {
      "isDelay": 1,
      "stageName": "初步验收阶段",
      "delayNum": 35,
      "showTime": "2021-07-16",
      "actualEndTime": null,
      "isEnd": "0",
      "dueEndTime": "2021-07-16",
      "stageId": 4448,
      "isComplete": "0"
    },
    {
      "isDelay": 1,
      "stageName": "试运行阶段",
      "delayNum": 30,
      "showTime": "2021-07-21",
      "actualEndTime": null,
      "isEnd": "0",
      "dueEndTime": "2021-07-21",
      "stageId": 4449,
      "isComplete": "0"
    },
    {
      "isDelay": 1,
      "stageName": "竣工验收阶段",
      "delayNum": 24,
      "showTime": "2021-07-27",
      "actualEndTime": null,
      "isEnd": "0",
      "dueEndTime": "2021-07-27",
      "stageId": 4450,
      "isComplete": "0"
    }
  ]

  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {判断项目是否结项} data 
*/
export function getStatusByProjectId(params) {
  let temp = false;
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}


/**
* 
* @param {获取项目实施方案列表--当前里程碑} data 
*/
export function getstageList(params) {
  let temp = [
    {
      "stageId": 4442,
      "projectId": 12616,
      "stageName": "项目启动阶段",
      "stageWeight": 5,
      "stageCompleteDesc": "1.组织召开项目启动会\n2.项目实施方案通过评审\n3.项目整体计划通过评审",
      "dueStartTime": "2021-07-01 00:00:00",
      "dueEndTime": "2021-07-02 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 0,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": null,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    },
    {
      "stageId": 4443,
      "projectId": 12616,
      "stageName": "需求分析阶段",
      "stageWeight": 10,
      "stageCompleteDesc": "1.需求规格说明书通过评审\n2.系统原型通过评审",
      "dueStartTime": "2021-07-03 00:00:00",
      "dueEndTime": "2021-07-04 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 1,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": null,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    },
    {
      "stageId": 4444,
      "projectId": 12616,
      "stageName": "系统设计阶段",
      "stageWeight": 20,
      "stageCompleteDesc": "1.设计文档通过评审\n2.设计与需求对应一致",
      "dueStartTime": "2021-07-05 00:00:00",
      "dueEndTime": "2021-07-06 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 2,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": null,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    },
    {
      "stageId": 4445,
      "projectId": 12616,
      "stageName": "系统开发阶段",
      "stageWeight": 30,
      "stageCompleteDesc": "1.系统开发与设计对应一致\n2.系统开发符合规范要求",
      "dueStartTime": "2021-07-07 00:00:00",
      "dueEndTime": "2021-07-08 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 3,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": null,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    },
    {
      "stageId": 4446,
      "projectId": 12616,
      "stageName": "系统测试阶段",
      "stageWeight": 10,
      "stageCompleteDesc": "1.测试用例全部执行，形成测试记录，输出测试报告\n2.测试问题全部解决",
      "dueStartTime": "2021-07-10 00:00:00",
      "dueEndTime": "2021-07-11 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 4,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": null,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    },
    {
      "stageId": 4447,
      "projectId": 12616,
      "stageName": "部署实施阶段",
      "stageWeight": 5,
      "stageCompleteDesc": "1.依据部署手册完成系统部署\n2.验证系统功能\n3.培训材料齐全，并按计划完成培训",
      "dueStartTime": "2021-07-12 00:00:00",
      "dueEndTime": "2021-07-13 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 5,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": null,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    },
    {
      "stageId": 4448,
      "projectId": 12616,
      "stageName": "初步验收阶段",
      "stageWeight": 5,
      "stageCompleteDesc": "1.初验材料齐全\n2.通过初验评审",
      "dueStartTime": "2021-07-15 00:00:00",
      "dueEndTime": "2021-07-16 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 6,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": 1,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    },
    {
      "stageId": 4449,
      "projectId": 12616,
      "stageName": "试运行阶段",
      "stageWeight": 10,
      "stageCompleteDesc": "1.试运行期间问题跟踪记录，并全部解决\n2.形成试运行报告",
      "dueStartTime": "2021-07-18 00:00:00",
      "dueEndTime": "2021-07-21 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 7,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": 2,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    },
    {
      "stageId": 4450,
      "projectId": 12616,
      "stageName": "竣工验收阶段",
      "stageWeight": 5,
      "stageCompleteDesc": "1.验收材料齐全\n2.通过验收评审",
      "dueStartTime": "2021-07-25 00:00:00",
      "dueEndTime": "2021-07-27 00:00:00",
      "isEnd": "0",
      "actualEndTime": null,
      "sort": 8,
      "creator": null,
      "createTime": "2021-07-08 17:48:12",
      "templFrom": "CHANGSHA_CLOUD",
      "stageStatus": 0,
      "flag": 3,
      "updateTime": "2021-07-08",
      "tmplId": null,
      "taskCount": null
    }
  ]

  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {根据里程碑id,获取任务} data 
*/
export function stageTaskSetbacks(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {获取父子项目信息合计} data 
*/
export function getALLinfo(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}

/**
* 
* @param {服务能力统计饼图接口} data 
*/
export function api_statisticsByDictCode(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}


/**
* 
* @param {单个项目统筹页面中的项目分页列表接口} data 
*/
export function listConstructionexperience(params) {
  let temp = [];
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS",
      },
      data: temp,
    });
  });
}


// 大文件上传
export function upload(data) {
  return request({
    url: `/csportalsite/api/file/uploadBigFilePassOn`,
    method: 'post',
    timeout: 300000,
    data
  })
}

// 上传
export function uploadMerge(data) {
  return request({
    url: `/csportalsite/api/chunk/mergePartFile`,
    method: 'post',
    timeout: 300000,
    data
  })
}