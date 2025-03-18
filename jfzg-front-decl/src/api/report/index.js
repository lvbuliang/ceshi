import request from "@/utils/request";
// 获取角色下面的账户
export function getUserByRoleCode(data) {
  return request({
    url: `/jfzg/opcenter/getUserByRoleCode?roleCode=${data.roleCode}`,
    method: "post",
    data,
  });
}
// 获取周报填报人
export function filterData(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/filterData`,
    method: "get",
    data,
  });
}
// 字典表枚举接口
export function api_getServiceTypeList(params) {
  return request({
    url: `/jfzg/commonapi/dict/listByTopicAndItem`,
    method: "get",
    params,
  });
}
// 字典表枚举接口
export function api_getProjectList(data) {
  return request({
    url: `/jfzg/projectImpl/weekly/getProjectList`,
    method: "post",
    data,
  });
}
// 问题列表
export function api_queryProblemPage(data) {
  return request({
    url: `/jfzg/projectImpl/project/riskAndProblem/queryProblemPage`,
    method: "post",
    data,
  });
}
// 周报新增/编辑
export function querySave(data) {
  return request({
    url: `/jfzg/projectImpl/weekly/saveOrUpdateReport`,
    method: "post",
    data,
  });
}
// 周报记录查询
export function api_getReportByProjectId(data) {
  return request({
    url: `/jfzg/projectImpl/weekly/getReportByProjectId`,
    method: "post",
    data,
  });
}
// 周报删除
export function api_delReportById(params) {
  return request({
    url: `/jfzg/projectImpl/weekly/delReportById`,
    method: "get",
    params,
  });
}
// 周报详情
export function api_getReportById(params) {
  return request({
    url: `/jfzg/projectImpl/weekly/getReportById`,
    method: "get",
    params,
  });
}
// 新增问题
export function api_saveProblem(data) {
  return request({
    url: `/jfzg/projectImpl/project/riskAndProblem/saveProblem`,
    method: "post",
    data,
  });
}
//编辑新增问题
export function api_updateInfo(data) {
  return request({
    url: `/jfzg/projectImpl/project/riskAndProblem/updateInfo `,
    method: "post",
    data,
  });
}
// 删除新增问题
export function api_deleteProblem(data) {
  return request({
    url: `/jfzg/projectImpl/project/riskAndProblem/deleteProblem?id=${data.id} `,
    method: "post",
    data,
  });
}
// 问题详情列表
export function api_queryProblemDetailById(data) {
  return request({
    url: `/jfzg/projectImpl/project/riskAndProblem/queryProblemDetailById?id=${data.id} `,
    method: "post",
    data,
  });
}
// 新增问题列表查询
export function api_queryAllProblemPage(data) {
  return request({
    url: `/jfzg/projectImpl/project/riskAndProblem/queryAllProblemPage`,
    method: "post",
    data,
  });
}

// 批量导出
export function exportByIds(data) {
  return request({
    url: `/jfzg/projectImpl/weekly/export`,
    method: "post",
    data,
    responseType: "blob",
  });
}
// 查询子周报
export function getContractListByProjectId(params) {
  return request({
    url: "/jfzg/projectImpl/weekly/getContractListByProjectId",
    methods: "get",
    params,
  });
}
// 合同周报填报
export function saveOrUpdateReportByContract(data) {
  return request({
    url: "/jfzg/projectImpl/weekly/saveOrUpdateReportByContract",
    method: "post",
    data,
  });
}
// 合同周报记录列表
export function getReportByContractId(data) {
  return request({
    url: "/jfzg/projectImpl/weekly/getReportByContractId",
    method: "post",
    data,
  });
}
// 合同周报详情
export function getSonReportById(params) {
  return request({
    url: "/jfzg/projectImpl/weekly/getSonReportById",
    method: "get",
    params,
  });
}
// 推送台账
export function examineReport(data) {
  return request({
    url: "/jfzg/projectImpl/weekly/examineReport",
    method: "post",
    data,
  });
}
// 周报评论
export function reportComment(params) {
  return request({
    url: "/jfzg/projectImpl/weekly/reportComment",
    methods: "get",
    params,
  });
}
// 周报启停
export function useReport(params) {
  return request({
    url: "/jfzg/projectlibrary/JHXMK/project/isStartWeeklyReport",
    methods: "get",
    params,
  });
}
// 删除草稿
export function deleteWeeklyDraft(params) {
  return request({
    url: "jfzg/projectImpl/weekly/deleteWeeklyDraft",
    method: "post",
    params,
  });
}
// 查周期周报
/**
 * 
 * @param {beginTime: 2025-01-13
endTime: 2025-01-19
projectId: 7963} params 
 * @returns 
 */
export function searckWeeklyDraft(params) {
  return request({
    url: `/jfzg/projectImpl/weekly/isSubmit?beginTime=${params.beginTime}&endTime=${params.endTime}&projectId=${params.projectId}&contractId=${params.contractId}`,
    method: "get",
  });
}
