import request from "@/utils/request";
import axios from "@/utils/axios";
const URL = '/jfzg/projectImpl/projectReportPushEntity'
/*
 * 所属模块：报送
 * wiki：https://wiki.jointforce.com/pages/viewpage.action?pageId=148278252
 */

// 列表
export function api_projectList(params) {
  return request({
    url: `${URL}/getProjectRPList`,
    method: 'get',
    params
  })
}

// 通过项目Id获取该项目报送信息列表
export function api_getProjectRPListById(params) {
  return request({
    url: `${URL}/getProjectRPListById`,
    method: 'get',
    params
  })
}

// 通过项目Id获取该项目报送信息
export function api_getProjectRPById(params) {
  return request({
    url: `${URL}/getProjectRPById`,
    method: 'get',
    params
  })
}

// 新增 || 编辑
export function api_insertProjectRP(data) {
  return request({
    url: `${URL}/insertProjectRP`,
    method: 'post',
    data
  })
}

//无loading表单保存编辑
export function api_insertProjectRP_noLoading(data) {
  return axios({
    url: `${URL}/insertProjectRP`,
    method: 'post',
    data
  })
}
//获取里程碑列表
export function api_getMilestoneList(projectId) {
  return request({
    url: `/jfzg/projectImpl/technicalProposal/list/stage/${projectId}`,
    method: 'get',
  })
}
//获取里程碑列表
export function api_saveBuriedPoint(params) {
  return request({
    url: `/jfzg/projectImpl/projectReportPushEntity/saveBuriedPoint`,
    method: 'get',
    params
  })
}


