import request from "@/utils/request";
import axios from "@/utils/axios";
const URL = '/jfzg/projectImpl/deliveryReport'
/*
 * 所属模块：报备
 * wiki：https://wiki.jointforce.com/pages/viewpage.action?pageId=148278207
 */

// 列表
export function api_projectList(data) {
  return request({
    url: `${URL}/projectList`,
    method: 'post',
    data
  })
}

// 报备列表，可以根据projectId获取所在项目所有报备信息
export function api_reportList(data) {
  return request({
    url: `${URL}/reportList`,
    method: 'post',
    data
  })
}

// 报备详情，根据报备id获取报备信息
export function api_detail(params) {
  return request({
    url: `${URL}/detail`,
    method: 'get',
    params
  })
}

//无loading表单保存编辑
export function api_saveOrUpdate_noLoading(data, id) {
  if (id) {
    return axios({
      url: `${URL}/update`,
      method: 'post',
      data
    })
  } else {
    return axios({
      url: `${URL}/save`,
      method: 'post',
      data
    })
  }
}
// 新增
export function api_save(data) {
  return request({
    url: `${URL}/save`,
    method: 'post',
    data
  })
}

// 修改
export function api_update(data) {
  return request({
    url: `${URL}/update`,
    method: 'post',
    data
  })
}

// 删除
export function api_delete(params) {
  return request({
    url: `${URL}/delete`,
    method: 'get',
    params
  })
}