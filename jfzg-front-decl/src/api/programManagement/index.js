import request from "@/utils/request";
// 列表查询
export function getProjectMaintainList(params) {
  return request({
    url: `/jfzg/projectDecl/projectMaintain/getProjectMaintainList`,
    method: "get",
    params,
  });
}
// 项目维护查询
export function api_detail(params) {
  return request({
    url: `/jfzg/projectDecl/projectMaintain/detail`,
    method: "get",
    params,
  });
}
// 项目维护修改
export function api_update(data) {
  return request({
    url: `/jfzg/projectDecl/projectMaintain/update`,
    method: "post",
    data,
  });
}
// 项年度计划列表
export function getYearPlanList(params) {
  return request({
    url: `/jfzg/projectDecl/yearPlan/getYearPlanList`,
    method: "get",
    params,
  });
}
//专项增补获取详情
export function getSpecialProjectDetailById(params) {
  return request({
    url: `/jfzg/projectlibrary/project/getDetailById`,
    method: "get",
    params,
  });
}
// 项目备案
export function getXMBADetailById(params) {
  return request({
    url: `/jfzg/projectlibrary/XMBA/project/getDetailById`,
    method: "get",
    params,
  });
}
