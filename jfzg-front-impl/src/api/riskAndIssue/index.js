import request from "@/utils/request";
import axios from "@/utils/axios";
const URL = '/jfzg/projectImpl/projectRiskProblem/project'
const RISKURL = '/jfzg/projectImpl/projectRisk'
const TROUBLEURL = '/jfzg/projectImpl/projectProblem'
/*
 * 所属模块：日常管理-风险管理
 * wiki：https://wiki.jointforce.com/pages/viewpage.action?pageId=148278415
 * 所属模块：日常管理-问题管理
 * wiki：https://wiki.jointforce.com/pages/viewpage.action?pageId=148278513
 */

// 风险问题列表
export function api_project_list(data) {
  return request({
    url: `${URL}/list`,
    method: 'post',
    data
  })
}

/******************* 风险 *******************/
// 风险列表
export function api_list(data) {
  return request({
    url: `${RISKURL}/risk/list`,
    method: 'post',
    data
  })
}

//无loading表单保存编辑
export function api_saveOrUpdate_noLoading(data, id) {
  if (id) {
    return axios({
      url: `${RISKURL}/risk/update`,
      method: 'post',
      data
    })
  } else {
    return axios({
      url: `${RISKURL}/risk/save`,
      method: 'post',
      data
    })
  }
}

// 新增风险
export function api_save(data) {
  return request({
    url: `${RISKURL}/risk/save`,
    method: 'post',
    data
  })
}

// 编辑风险
export function api_update(data) {
  return request({
    url: `${RISKURL}/risk/update`,
    method: 'post',
    data
  })
}

// 删除风险
export function api_delete(params) {
  return request({
    url: `${RISKURL}/risk/delete`,
    method: 'get',
    params
  })
}

// 处理页-风险关闭
export function api_close(params) {
  return request({
    url: `${RISKURL}/risk/close`,
    method: 'get',
    params
  })
}

// 风险详情
export function api_detail(params) {
  return request({
    url: `${RISKURL}/risk/detail`,
    method: 'get',
    params
  })
}
/******************* 风险措施 *******************/
// 风险措施列表-根据风险id查询
export function api_measure_listByRiskId(params) {
  return request({
    url: `${RISKURL}/measure/listByRiskId`,
    method: 'get',
    params
  })
}

// 风险措施详情
export function api_measure_detail(params) {
  return request({
    url: `${RISKURL}/measure/detail`,
    method: 'get',
    params
  })
}

// 风险措施保存或修改
export function api_measure_saveOrUpdate(data) {
  return request({
    url: `${RISKURL}/measure/saveOrUpdate`,
    method: 'post',
    data
  })
}

// 风险措施删除
export function api_measure_delete(params) {
  return request({
    url: `${RISKURL}/measure/delete`,
    method: 'get',
    params
  })
}

// 风险措施完成并提交
export function api_measure_complete(params) {
  return request({
    url: `${RISKURL}/measure/complete`,
    method: 'get',
    params
  })
}

/******************* 措施回复 *******************/
// 措施回复列表-根据措施id查询
export function api_reply_listByMeasureId(params) {
  return request({
    url: `${RISKURL}/reply/listByMeasureId`,
    method: 'get',
    params
  })
}

// 措施回复详情
export function api_reply_detail(params) {
  return request({
    url: `${RISKURL}/reply/detail`,
    method: 'get',
    params
  })
}

// 措施回复保存或修改
export function api_reply_saveOrUpdate(data) {
  return request({
    url: `${RISKURL}/reply/saveOrUpdate`,
    method: 'post',
    data
  })
}

// 措施回复删除
export function api_reply_delete(params) {
  return request({
    url: `${RISKURL}/reply/delete`,
    method: 'get',
    params
  })
}

/******************* 问题 *******************/
// 问题列表
export function api_getPage(params) {
  return request({
    url: `${TROUBLEURL}/getPage`,
    method: 'get',
    params
  })
}

// 删除
export function api_delelteProblemById(params) {
  return request({
    url: `${TROUBLEURL}/delelteProblemById`,
    method: 'get',
    params
  })
}

// 关闭按钮
export function api_closeProblmeurl(params) {
  return request({
    url: `${TROUBLEURL}/closeProblme`,
    method: 'get',
    params
  })
}


// 问题数据回显
export function api_getProblemById(params) {
  return request({
    url: `${TROUBLEURL}/getProblemById`,
    method: 'get',
    params
  })
}

// 措施数据回显
export function api_getMeasureListById(params) {
  return request({
    url: `${TROUBLEURL}/getMeasureListById`,
    method: 'get',
    params
  })
}

// 措施数据回显 （问题主键id）
export function api_getMeasures(params) {
  return request({
    url: `${TROUBLEURL}/getMeasures`,
    method: 'get',
    params
  })
}

//无loading表单保存
export function api_insertProjectProblem_noLoading(data) {
  return axios({
    url: `${TROUBLEURL}/insertProjectProblem`,
    method: 'post',
    data
  })
}

// 问题新增
export function api_insertProjectProblem(data) {
  return request({
    url: `${TROUBLEURL}/insertProjectProblem`,
    method: 'post',
    data
  })
}

// 措施新增|| 编辑
export function api_insertMeasure(data) {
  return request({
    url: `${TROUBLEURL}/insertMeasure`,
    method: 'post',
    data
  })
}

// 措施删除
export function api_deleteMeasureById(params) {
  return request({
    url: `${TROUBLEURL}/deleteMeasureById`,
    method: 'get',
    params
  })
}
// 查看
export function api_getSee(params) {
  return request({
    url: `${TROUBLEURL}/getSee`,
    method: 'get',
    params
  })
}

// 处理页-新增回复
export function api_insertReply(data) {
  return request({
    url: `${TROUBLEURL}/insertReply`,
    method: 'post',
    data
  })
}

// 完成提交按钮
export function api_submitReply(params) {
  return request({
    url: `${TROUBLEURL}/submitReply`,
    method: 'get',
    params
  })
}



// 措施删除
export function api_deleteMeasure(params) {
  return request({
    url: `${TROUBLEURL}/deleteMeasure`,
    method: 'get',
    params
  })
}