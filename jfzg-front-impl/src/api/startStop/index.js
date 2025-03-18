import request from "@/utils/request";
const URL = '/jfzg/projectImpl/projectStop'
/*
 * 所属模块：启停
 * wiki：https://wiki.jointforce.com/pages/viewpage.action?pageId=148278800
 */

// 项目启停项目列表
export function api_getList(params) {
  return request({
    url: `${URL}/getList`,
    method: 'get',
    params
  })
}

// 根据项目id查启停详情接口	
export function api_getProjectStopDelitail(params) {
  return request({
    url: `${URL}/getProjectStopDelitail`,
    method: 'get',
    params
  })
}

// 根据业务id查项目启停详情接口	
export function api_getStopInfoById(params) {
  return request({
    url: `${URL}/getStopInfoById`,
    method: 'get',
    params
  })
}

// 根据项目Id查询启停信息列表
export function api_getStopListByProjectId(params) {
  return request({
    url: `${URL}/getStopListByProjectId`,
    method: 'get',
    params
  })
}

// 暂停项目
export function api_stopProject(data) {
  return request({
    url: `${URL}/stopProject`,
    method: 'post',
    data
  })
}


// 申请启动项目
export function api_applyStartProject(data) {
  return request({
    url: `${URL}/applyStartProject`,
    method: 'post',
    data
  })
}

