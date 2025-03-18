import request from "@/utils/request";

// 金额项目列表统计
export function amountProjectList(data) {
  return request({
    url: `/jfzg/commonapi/statistics/amountProjectList`,
    method: "post",
    data,
  });
}
// 建设单位投资统计
export function constructionUnitList(data) {
  return request({
    url: `/jfzg/commonapi/statistics/constructionUnitList`,
    method: "post",
    data,
  });
}
// 获取所有承建单位
export function getChengjianUnit(data) {
  return request({
    url: `/jfzg/ucenter/bizUnit/queryBizunitsByProperty`,
    method: "post",
    data,
  });
}
// 获取所有建设单位
export function getChengjianUnits(data) {
  return request({
    url: `/jfzg/ucenter/bizUnit/queryBizunitsByProperties`,
    method: "post",
    data,
  });
}
// 获取项目类型
export function listByTopicAndItem(params) {
  return request({
    url: `/jfzg/commonapi/dict/listByTopicAndItem`,
    method: "get",
    params,
  });
}
// 获取项目类型
export function amountTotal(data) {
  return request({
    url: `/jfzg/commonapi/statistics/amountTotal`,
    method: "post",
    data,
  });
}

// 年度投资进展统计
export function yearPlanInves(data) {
  return request({
    url: `/jfzg/commonapi/statistics/yearPlanInves`,
    method: "post",
    data,
  });
}

// 年度建设统计
export function yearPlanCons(data) {
  return request({
    url: `/jfzg/commonapi/statistics/yearPlanCons`,
    method: "post",
    data,
  });
}
// 年度建设统计
export function riskAndProblems(data) {
  return request({
    url: `/jfzg/commonapi/statistics/riskAndProblems`,
    method: "post",
    data,
  });
}

// 项目类型统计
export function projectType(data) {
  return request({
    url: `/jfzg/commonapi/statistics/projectType`,
    method: "post",
    data,
  });
}
// 0804
// 项目名称项目编号
export function getAllProject(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getAllProject`,
    method: "get",
    params,
  });
}
// 申报单位
export function getAllBuName(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getAllBuName`,
    method: "get",
    params,
  });
}
// 年度投资进展统计
export function getYearPlanProgress(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/yearPlanProgress`,
    method: "post",
    params,
  });
}

// 项目立项申报
export function getProjectDeclaration(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getProjectDeclaration`,
    method: "post",
    params,
  });
}
// 项目立项批复
export function getProjectApproval(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getProjectApproval`,
    method: "post",
    params,
  });
}
// 申报年份
export function getAllProjectYears() {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getAllProjectYears`,
    method: "post",
  });
}
// 计划项目申报
export function getYearDeclareProject(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/yearDeclareProject`,
    method: "post",
    params,
  });
}
// 计划项目入库
export function getYearRKProject(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/yearRKProject`,
    method: "post",
    params,
  });
}
// 年度项目服务类型汇总看板
export function getProjectServiceBoard(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getProjectServiceBoard`,
    method: "post",
    params,
  });
}
// 年度建设进展
export function getyearProjectConstruction(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getyearProjectConstruction`,
    method: "post",
    params,
  });
}
// 风险问题柱状图
export function getprojectRiskAndProblmTotal(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getprojectRiskAndProblmTotal`,
    method: "post",
    params,
  });
}
// 风险问题柱表格
export function getprojectRiskAndProblmTable(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/getprojectRiskAndProblmTable`,
    method: "post",
    params,
  });
}

// 资金使用进度
export function getfundprogress(params) {
  return request({
    url: `/jfzg/commonapi/departmentDynamics/get/fund/progress`,
    method: "get",
    params,
  });
}