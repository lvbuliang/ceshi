import request from '@/utils/request'
const URL = '/csportalsite'


// 日月周报列表
export function list(data) {
  return request({
    url: `${URL}/report/project/list`,
    method: 'post',
    data
  })
}
// 日周月报当前时间内的最子集任务列表
export function taskChildTaskForNow(params) {
  return request({
    url: `${URL}/taskInfo/listChildTaskForNow`,
    method: 'get',
    params
  })
}
// 日周月报列表查询
export function set(projectId) {
  return request({
    url: `${URL}/projectImplementatio/project/report/set/${projectId}`,
    method: 'get',

  })
}
// 日月周报列表查询日周月打开或关闭
export function openorclose(projectId, set) {
  return request({
    url: `${URL}/projectImplementatio/project/report/set/${projectId}/${set}`,
    method: 'post',
  })
}
// 日月周报查询项目列表数据
export function reportQuery(projectId) {
  return request({
    url: `${URL}/report/reportQuery`,
    method: 'get',

  })
}

// 查询日报日历
export function calendar(data) {
  return request({
    url: `${URL}/report/day/calendar`,
    method: 'post',
    data
  })
}
// 查询周报日历
export function weekCalendar(data) {
  return request({
    url: `${URL}/report/week/calendar`,
    method: 'post',
    data
  })
}

// 查询月报日历
export function monthCalendar(data) {
  return request({
    url: `${URL}/report/month/calendar`,
    method: 'post',
    data
  })
}
//新增日周月报
export function addReport(data) {
  return request({
    url: `${URL}/report/add`,
    method: 'post',
    data
  })
}
//查询日周月报详情
export function getDetail(params) {
  return request({
    url: `${URL}/report/data/detail`,
    method: 'get',
    params
  })
}

//日周月报事件
export function eventListByProjectId(params) {
  return request({
    url: `${URL}/event/project/eventListByProjectId`,
    method: 'get',
    params
  })
}
// 日周月报工作流通过驳回接口
export function day_workflowAgreeAndReject(data) {
  return request({
    url: `${URL}/dayWeekMonthWorkFlow/workflowAgreeAndReject`,
    method: 'post',
    data
  })
}
// 事件进展汇报更新情况说明

export function updateIntroduction(data) {
  return request({
    url: `${URL}/event/project/updateIntroduction`,
    method: 'post',
    data
  })
}
/**
 * 事件进展汇报功能模块接口
 * 
 */
// 查询项目列表数据

export function api_eventProjectList(data) {
  return request({
    url: `${URL}/event/project/projectList`,
    method: 'post',
    data
  })
}
// 查询事件列表详情
export function api_eventList(data) {
  return request({
    url: `${URL}/event/project/list`,
    method: 'post',
    data
  })
}
// 事件进展详情查询
export function api_eventQuery(params) {
  return request({
    url: `${URL}/event/project/query`,
    method: 'get',
    params
  })
}
// 新增事件进展数据
export function api_eventSave(data) {
  return request({
    url: `${URL}/event/project/eventSave`,
    method: 'post',
    data
  })
}
/**
 * 里程碑列表
 * @param {pageSize，pageNum} data 
 */
export function getCsportalsiteList(data) {
  return request({
    url: `${URL}/milestone/report/query`,
    method: 'post',
    data
  })
}
/**
 * 里程碑阶段列表
 * @param {id} data 
 */
export function projectStageManageList(data) {
  return request({
    url: `${URL}/projectStageManage/selectObject`,
    method: 'post',
    data
  })
}
//里程碑交付物文件审核
export function deliveryAudit(data) {
  return request({
    url: `${URL}/api/file/insertFileReview`,
    method: 'post',
    data
  })
}
//里程碑交付物审核查询详情
export function seeDeliveryAudit(params) {
  return request({
    url: `${URL}/api/file/fileReview`,
    method: 'get',
    params
  })
}
// 根据登记项目id查询项目信息
export function api_projectInfo(params) {
  return request({
    url: `${URL}/snopshot/project/info`,
    method: 'get',
    params
  })
}
/**
 * 试运行功能模块接口
 * 
 */
//试运行列表获取
export function getPilotRunList(data) {
  return request({
    url: `${URL}/pilotRun/pilotRunPageList`,
    method: 'post',
    data
  })
}
//试运行查看
export function getQueryList(params) {
  return request({
    url: `${URL}/pilotRun/query`,
    method: 'get',
    params
  })
}
//试运行承建单位保存
export function setBuildNameData(data) {
  return request({
    url: `${URL}/pilotRun/savePilotRun`,
    method: 'post',
    data
  })
}

/**
 * 终验功能模块接口
 * 
 */
//终验列表获取
export function getFinalAcceptanceList(data) {
  return request({
    url: `${URL}/lastcheck/report/query`,
    method: 'post',
    data
  })
}
//终验承建提交
export function setFinalAcceptanceReport(data) {
  return request({
    url: `${URL}/lastcheck/report/submit`,
    method: 'post',
    data
  })
}


//终验详情获取
export function getFinalAcceptanceDetails(data) {
  return request({
    url: `${URL}/lastcheck/report/queryDetail`,
    method: 'post',
    data
  })
}



/**
 * 里程碑详情页面
 * @param  projectId 实施项目id	里程碑列表获取
 * @param  milestoneId 里程碑节点id 里程碑阶段列表获取
 */
export function milestoneQueryDetail(data) {
  return request({
    url: `${URL}/milestone/report/queryDetail`,
    method: 'post',
    data
  })
}

/**
 * 里程碑详情页面项目信息
 * @param  projectId 实施项目id	里程碑列表获取
 */
export function projectInfo(params) {
  return request({
    url: `${URL}/snopshot/project/info`,
    method: 'get',
    params
  })
}
/**
 * 里程碑列表内 所有交付物文件信息
 */
export function deliInfo(params) {
  return request({
    url: `${URL}/api/file/deliInfo`,
    method: 'get',
    params
  })
}
/**
 * 里程碑列表内 任务完成情况
 */
export function milestoneTaskInfo(data) {
  return request({
    url: `${URL}/projectStageManage/milestoneTaskInfo`,
    method: 'post',
    data
  })
}
//里程碑任务完成情况任务评价
export function setExplain(data) {
  return request({
    url: `${URL}/taskInfo/batchUpdateTask`,
    method: 'post',
    data
  })
}
//里程碑承建提交
export function setMilestoneReport(data) {
  return request({
    url: `${URL}/milestone/report/submit`,
    method: 'post',
    data
  })
}
//当前里程碑完成里程碑数据获取
export function api_getMilestoneList(params) {
  return request({
    url: `${URL}/projectStageManages/queryProjectStageManage`,
    method: 'get',
    params
  })
}
/**
 * 获取问题列表接口
 * @param  projectId 实施项目id	里程碑列表获取
 */
export function getProjectQuestionList(params) {
  return request({
    url: `${URL}/questionandrisk/getProjectQuestionListNoPage`,
    method: 'post',
    params
  })
}

/**
 * 获取风险列表接口
 * @param  projectId 实施项目id	里程碑列表获取
 */
export function getProjectRiskList(params) {
  return request({
    url: `${URL}/questionandrisk/getProjectRiskListNoPage`,
    method: 'get',
    params
  })
}
/***
 * 获取风险与问题的总数
 */
export function getQuestionAndRiskCount(params) {
  return request({
    url: `${URL}/questionandrisk/getQuestionAndRiskCount`,
    method: 'get',
    params
  })
}

/**
 * 交付物列表
 */
export function deliverDeliInfo(params) {
  return request({
    url: `${URL}/api/file/deliInfo`,
    method: 'get',
    params
  })
}
//交付物总数
export function api_getProjectAllDeliInfoNumber(params) {
  return request({
    url: `${URL}/csportalsite/deliverables/getProjectAllDeliInfoNumber`,
    method: 'get',
    params
  })
}
// 初验列表
export function queryFirstCheckList(params) {
  return request({
    url: `${URL}/firstCheck/queryFirstCheckList`,
    method: 'get',
    params
  })
}
// 初验申请   
export function apply(data) {
  return request({
    url: `${URL}/firstCheck/apply`,
    method: 'post',
    data
  })
}
// 初验查看详情
export function queryCheckInfo(params) {
  return request({
    url: `${URL}/firstCheck/queryCheckInfo`,
    method: 'get',
    params
  })
}

// 初验下载模板
export function firstDownload(data) {
  return request({
    url: `${URL}/firstCheck/download`,
    method: 'post',
    data
  })
}
// 初验工作流通过驳回接口
export function first_workflowAgreeAndReject(data) {
  return request({
    url: `${URL}/firstCheck/workflowAgreeAndReject`,
    method: 'post',
    data
  })
}
/**
 * 工作流通过驳回接口 日月周报，里程碑，初验，试运行，终验，事件 公用接口
 */
export function api_workflowAgreeAndReject(data) {
  return request({
    url: `${URL}/milePostAndDayWeekWorkFlow/workflowAgreeAndReject`,
    method: 'post',
    data
  })
}
/**
 * 获取附件详情公共接口
 * @param {*} params 
 */
export function api_getCollectionDeliInfo(params) {
  return request({
    url: `${URL}/api/file/fileBusinessInfo`,
    method: 'get',
    params
  })
}
/**
 * 获取事件附件接口
 * @param {*} params 
 */
export function api_getFileBusinessInfoAndHistory(params) {
  return request({
    url: `${URL}/api/file/fileBusinessInfoAndHistory`,
    method: 'get',
    params
  })
}
/**
 * 解绑事件附件接口
 * @param {*} params 
 */
export function api_deleteFileBusinessByFileId(params) {
  return request({
    url: `${URL}/api/file/deleteFileBusinessByFileId`,
    method: 'get',
    params
  })
}
/**
 * 获取快照详情公共接口
 * @param {*} params 
 */
export function api_getSnopshotInfo(params) {
  return request({
    url: `${URL}/snopshot/querySnopshot`,
    method: 'post',
    params
  })
}
/**
 * 任务完成情况根据条件查询子集任务列表
 * 
 */
export function api_getCompletionTask(params) {
  return request({
    url: `${URL}/taskInfo/listChildTaskForTimeType`,
    method: 'get',
    params
  })
}
/**
 *根据日周月获取交付物 
 */
export function api_getDateDeliverable(params) {
  return request({
    url: `${URL}/deliverables/getDeliByTime`,
    method: 'get',
    params
  })
}
/**
 * 初验查询项目下的交付物
 */
export function api_getPreliminaryData(params) {
  return request({
    url: `${URL}/deliverables/getBeforeStageInfo`,
    method: 'get',
    params
  })
}
/**
 * 获取所有的交付物
 */
export function api_geiDEliverableAll(params) {
  return request({
    url: `${URL}/deliverables/getProjectAllDeliInfo`,
    method: 'get',
    params
  })
}

/**
 * 判断是否是建设无监理
 */
export function api_isJianli(params) {
  return request({
    url: `${URL}/milePostAndDayWeekWorkFlow/isJianli`,
    method: 'get',
    params
  })
}

//根据项目id和 日、周、月 类型查询风险
export function api_queryRiskByProjectAndType(params) {
  return request({
    // url: `${URL}/questionandrisk/queryRiskByProjectAndType`,
    url: `${URL}/questionandrisk/queryRiskByProjectStartDateAndDate`,
    method: 'get',
    params
  })
}
//根据项目id和 日、周、月 类型查询问题
export function api_queryQuestionByProjectAndType(params) {
  return request({
    // url: `${URL}/questionandrisk/queryQuestionByProjectAndType`,
    url: `${URL}/questionandrisk/queryQuestionByProjectStartDateAndDate`,
    method: 'get',
    params
  })
}
//根据里程碑id查询问题
export function api_queryQuestionStageId(params) {
  return request({
    url: `${URL}/questionandrisk/queryQuestionStageId`,
    method: 'get',
    params
  })
}
//根据里程碑id查询风险
export function api_queryRiskStageId(params) {
  return request({
    url: `${URL}/questionandrisk/queryRiskStageId`,
    method: 'get',
    params
  })
}
// 日周月报获取明日计划
export function listTaskForTimeType(params) {
  return request({
    url: `${URL}/taskInfo/listTaskForTimeType`,
    method: 'get',
    params
  })
}
//里程碑工作流通过驳回接口
export function api_milestoneAgreeAndReject(data) {
  return request({
    url: `${URL}/milestoneWorkFlow/workflowAgreeAndReject`,
    method: "post",
    data
  })
}

//事件审查工作流通过驳回接口
export function api_taskAuditWorkFlow(data) {
  return request({
    url: `${URL}/taskAuditWorkFlow/workflowAgreeAndReject`,
    method: 'post',
    data
  })
}

//试运行工作流通过驳回接口
export function api_pilotRunWorkFlow(data) {
  return request({
    url: `${URL}/pilotRunWorkFlow/workflowAgreeAndReject`,
    method: 'post',
    data
  })
}

// 终验/竣工
export function api_lastCheckWorkFlow(data) {
  return request({
    url: `${URL}/lastcheck/report/workflowAgreeAndReject`,
    method: 'post',
    data
  })
}

//获取工作流节点信息
export function api_dayWeekMonthWorkFlow(params) {
  return request({
    url: `${URL}/dayWeekMonthWorkFlow/getWorkFlowNode`,
    method: 'get',
    params
  })
}
//新增快照
export function api_addSnopshot(data) {
  return request({
    url: `${URL}/snopshot/add`,
    method: 'post',
    data
  })
}