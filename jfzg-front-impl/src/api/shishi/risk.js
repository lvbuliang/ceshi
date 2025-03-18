import request from "@/utils/request";

/**
 *
 * 风险问题管理
 */
// 获取项目列表
export function api_getProjectList(data)  {
  return request({
    url: `/csportalsite/riskproblemlist/queryList`,
    method: 'post',
    data
  })
}
// 获取风险列表
export function api_getProjectRiskList(data) {
  return request({
    url: `/csportalsite/questionandrisk/getProjectRiskList`,
    method: 'post',
    data
  })
};

// 风险出处
export function api_getRiskSource(params) {
  return request({
    url: '/csportalsite/projectImplementatio/stage/list',
    method: 'get',
    params
  })
}

// 获取责任人
export function api_getUserList(params) {
  return request({
    url: '/csportalsite/questionandrisk/getUserRoleByProjectId',
    method: 'get',
    params
  })
}

// 获取改进措施模板
export function api_getMeasureFromTmpl(data) {
  return request({
    url: '/csportalsite/questionandrisk/getMeasureFromTmpl',
    method: 'post',
    data
  })
}

// 获取处理措施模板中的查询下拉框中里程碑列表
export function api_getStageByProjectType(params) {
  return request({
    url: '/csportalsite/questionandrisk/getStageByProjectType',
    method: 'get',
    params
  })
}

// 新增风险
export function api_saveProjectQuestionAndRisk(data) {
  return request({
    url: '/csportalsite/questionandrisk/saveProjectQuestionAndRisk',
    method: 'post',
    data
  })
}

// 修改风险
export function api_updateRisk(data) {
  return request({
    url: '/csportalsite/questionandrisk/updateRiskStatus',
    method: 'post',
    data
  })
}

// 删除风险
export function api_deleteProjectRisk(params) {
  return request({
    url: '/csportalsite/questionandrisk/deleteProjectRisk',
    method: 'get',
    params
  })
}

// 获取风险详情接口
export function api_getProjectRisk(params) {
  return request({
    url: '/csportalsite/questionandrisk/getProjectRisk',
    method: 'get',
    params
  })
}

// 快速回复接口
export function api_saveImprovementMsg(data) {
  return request({
    url: '/csportalsite/questionandrisk/saveImprovementMsg',
    method: 'post',
    data
  })
}

// 获取风险改进措施详情接口
export function api_getProjectRiskImprovement(params) {
  return request({
    url: '/csportalsite/questionandrisk/getProjectRiskImprovement',
    method: 'get',
    params
  })
}

// 关闭风险
export function api_closeProjectRisk(params) {
  return request({
    url: '/csportalsite/questionandrisk/closeProjectRisk',
    method: 'get',
    params
  })
}

// 更新修改措施的状态
export function api_updateImprovementStatus(data) {
  return request({
    url: '/csportalsite/questionandrisk/updateImprovementStatus',
    method: 'post',
    data
  })
}

/*
** 问题管理
*/
// 获取问题列表
export function api_getProjectQuestionList(data) {
  return request({
    url: `/csportalsite/questionandrisk/getProjectQuestionList`,
    method: 'post',
    data
  })
};

// 删除问题
export function api_deleteProjectQuestion(params) {
  return request({
    url: '/csportalsite/questionandrisk/deleteProjectQuestion',
    method: 'get',
    params
  })
}

// 问题详情
export function api_getProjectQuestion(params) {
  return request({
    url: '/csportalsite/questionandrisk/getProjectQuestion',
    method: 'get',
    params
  })
}
// 修改问题
export function api_updateQuestion(data) {
  return request({
    url: '/csportalsite/questionandrisk/updateQuestionStatus',
    method: 'post',
    data
  })
}

// 关闭问题
export function api_closeProjectQuestion(params) {
  return request({
    url: '/csportalsite/questionandrisk/closeProjectQuestion',
    method: 'get',
    params
  })
}
// 
// 获取问题改进措施详情接口
export function api_getProjectQuestionImprovement(params) {
  return request({
    url: '/csportalsite/questionandrisk/getProjectQuestionImprovement',
    method: 'get',
    params
  })
}
//获取里程碑阶段下拉列表
export function api_findStageConfigList (params) {
    return request({
      url:'/csportalsite/stageConfig/findStageConfigList',
      method:'get',
      params
    })
}