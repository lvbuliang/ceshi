import request from '@/utils/request'
const URL = ''

//时间配置信息新增
export function api_addTimeConfigInfo(data) {
  return request({
    url: `${URL}/projectReport/insert`,
    method: 'post',
    data
  })
}
//时间配置信息查询
export function api_queryTimeConfigList(params) {
  return request({
    url: `${URL}/projectReport/query`,
    method: 'get',
    params
  })
}
//时间配置信息修改
export function api_updateTimeConfigInfo(data) {
  return request({
    url: `${URL}/projectReport/update`,
    method: 'post',
    data
  })
}
//待办预警查询
export function api_queryCommWarnList(params) {
  return request({
    url: `${URL}/schduleWarn/query`,
    method: 'get',
    params
  })
}
//待办预警修改
export function api_updateCommWarnInfo(data) {
  return request({
    url: `${URL}/schduleWarn/update`,
    method: 'post',
    data
  })
}
//消息配置查询
export function api_queryMessageConfigList(data) {
  return request({
    url: `${URL}/messageConfig/query`,
    method: 'get',
    data
  })
}
//消息配置修改
export function api_updateMessageConfigInfo(data) {
  return request({
    url: `${URL}/messageConfig/update`,
    method: 'post',
    data
  })
}
//获取角色
export function api_queryRoleList(params) {
  return request({
    url: `${URL}/schduleWarn/queryRoleList`,
    method: 'get',
    params
  })
}
