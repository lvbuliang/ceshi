import request from "@/utils/request";
const URL = '/jfzg/projectImpl'


// 合同信息列表
export function api_getTableList(data) {
  return request({
    url: `${URL}/projectContract/list`,
    method: 'post',
    data
  })
}

// 合同信息新增  编辑
export function api_setContractData(data) {
  return request({
    url: `${URL}/projectContract/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 获取项目类型
export function listByTopicAndItem(params) {
  return request({
    url: `/jfzg/commonapi/dict/listByTopicAndItem`,
    method: 'get',
    params
  })
}
// 合同信息详情
export function api_getContractDetail(params) {
  return request({
    url: `${URL}/projectContract/detail`,
    method: 'get',
    params
  })
}
// 合同信息-草稿
export function api_setContractDraft(data) {
  return request({
    url: `${URL}/projectContract/draft`,
    method: 'post',
    data
  })
}

// 合同信息-删除
export function api_setContractDelete(params) {
  return request({
    url: `${URL}/projectContract/delete`,
    method: 'get',
    params
  })
}

//资金使用计划-列表
export function api_getFundList(data) {
  return request({
    url: `${URL}/projectContractPlan/list`,
    method: 'post',
    data
  })
}
//资金使用计划-详情
export function api_getFundDetail(params) {
  return request({
    url: `${URL}/projectContractPlan/detail`,
    method: 'get',
    params
  })
}
//资金使用计划-新增 编辑
export function api_saveOrUpdate(data) {
  return request({
    url: `${URL}/projectContractPlan/saveOrUpdate`,
    method: 'post',
    data
  })
}
//资金使用计划-删除
export function api_fundDelete(params) {
  return request({
    url: `${URL}/projectContractPlan/delete`,
    method: 'get',
    params
  })
}

// 根据项目id查询最新的合同信息
export function api_getContractAmountByProjectId(params) {
  return request({
    url: `${URL}/projectContract/getContractAmountByProjectId`,
    method: 'get',
    params
  })
}
