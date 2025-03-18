import request from '@/utils/request'
const URL = '/jfzg/opcenter'

//激活流程
export function api_activateProgress(data) {
  return request({
    url: `${URL}/activiti/definition/activeApply`,
    method: 'post',
    data
  })
}
//挂起流程
export function api_hangProgress(data) {
  return request({
    url: `${URL}/activiti/definition/suspendApply`,
    method: 'post',
    data
  })
}
//流程列表
export function api_queryProgressList(params) {
  return request({
    url: `${URL}/activiti/definition/list`,
    method: 'get',
    params
  })
}
//读取流程图资源
export function api_readProgressData(params) {
  return request({
    url: `${URL}/activiti/definition/readResource`,
    method: 'get',
    params
  })
}
//删除流程
export function api_removeProgress(data) {
  return request({
    url: `${URL}/activiti/definition/remove`,
    method: 'post',
    data
  })
}
//流程转模型
export function api_progressToModel(data) {
  return request({
    url: `${URL}/activiti/definition/convert2Model`,
    method: 'post',
    data
  })
}

// 里程碑到期天数提醒接口
export function api_saveOrUpdate(data) {
  return request({
    url: `/whportalsite/wuhan/stageMessageConfig/saveOrUpdate`,
    method: 'post',
    data
  })
}
//部署流程
export function api_deployFlows(data) {
  return request({
    url: `${URL}/activiti/definition/upload`,
    method: 'post',
    data
  })
}
