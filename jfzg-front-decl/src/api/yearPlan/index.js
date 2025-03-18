import request from "@/utils/request";
import axios from "@/utils/axios";

// 项年度计划列表
export function getQueryList(params) {
    return request({
        url: `/jfzg/projectDecl/yearPlan/getYearPlanList`,
        method: 'get',
        params
    })
  }
// 项年度计划保存、修改
export function saveOrEditYearPlan(data) {
    return axios({
        url: `/jfzg/projectDecl/yearPlan/insertYearPlan`,
        method: 'post',
        data
    })
  }
// 项年度计划提交
export function submitOrEditYearPlan(data) {
    return request({
        url: `/jfzg/projectDecl/yearPlan/submitCheckYearPlan`,
        method: 'post',
        data
    })
  }
// 项年度计划审批
export function approveYearPlan(data) {
    return request({
        url: `/jfzg/projectDecl/yearPlan/chageStatus`,
        method: 'post',
        data
    })
  }
  
// 项年度计划查看
export function viewYearPlan(params) {
    return request({
        url: `/jfzg/projectDecl/yearPlan/getYearPlanById`,
        method: 'get',
        params
    })
  }
// 项年度计划审批
export function changeYearPlanStatus(data) {
    return request({
        url: `/jfzg/projectDecl/yearPlan/chageStatus`,
        method: 'post',
        data
    })
  }
// 删除
export function deleteYearPlan(params) {
    return request({
        url: `/jfzg/projectDecl/yearPlan/deleteYearPlanById`,
        method: 'get',
        params
    })
  }
  // 归档
export function api_fileAway(data) {
  return request({
      url: `/jfzg/projectDecl/yearPlan/fileAway`,
      method: 'post',
      data
  })
}
// 年度内项目信息
export function queryListByYearPlanId(params) {
    return request({
        url: `/jfzg/projectlibrary/open/api/queryListByYearPlanId/${params.page}/${params.size}`,
      method: 'post',
      params
    })
}
// 年度内项目信息(新)
export function getlistYearPlanProjects(params) {
    return request({
      url: `/jfzg/projectDecl/yearPlan/listYearPlanProjects`,
      method: 'get',
      params
    })
}