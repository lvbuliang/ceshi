import request from '@/utils/request'
const URL = '/jfzg/opcenter'


//模型列表
export function api_flowList(params) {
  return request({
    url: `${URL}/activiti/modeler/list`,
    method: 'get',
    params
  })
}
//删除模型
export function api_removeFlowList(data) {
  return request({
    url: `${URL}/activiti/modeler/remove`,
    method: 'post',
    data
  })
}
//部署模型
export function api_deployFlowList(data) {
  return request({
    url: `${URL}/activiti/modeler/deploy`,
    method: 'post',
    data
  })
}
//导出模型
export function api_exportFlowList(params) {
  return request({
    url: `${URL}/activiti/modeler/export`,
    method: 'get',
    params
  })
}
//新增模型
export function api_addFlowList(data) {
  return request({
    url: `${URL}/activiti/modeler/create`,
    method: 'post',
    data
  })
}
// 获取工作流任务
export function api_getFlowTaskList(modelId) {
  return request({
    url: `${URL}/activiti/modeler/userTaskNodes/${modelId}`,
    method: 'get',
    
  })
}

//获取经办人
export function api_jbr(data) {
  return request({
    url: `${URL}/buRole/getRoleCodeAndNames`,
    method: 'get',
  })
}
