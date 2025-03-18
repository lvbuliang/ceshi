import request from "@/utils/request";

// 获取金额
export function getstatisticsAmount(params) {
  return request({
    url: `/jfzg/commonapi/projectStatistics/statisticsAmount`,
    method: "get",
    params,
  });
}
// 保存项目库标签
export function updateProject(data) {
  return request({
    url: `/jfzg/projectlibrary/open/api/update`,
    method: "post",
    data,
  });
}
// 里程碑汇报
export function getLichengbei(data) {
  return request({
    url: `/jfzg/projectImpl/milestoneReview/list`,
    method: "post",
    data,
  });
}
// 风险和问题统计图数据
export function getCountRiskLevel(params) {
  return request({
    url: `/jfzg/commonapi/projectStatistics/countRiskLevel`,
    method: "get",
    params,
  });
}

// 获取报送数据
export function getlistReportPush(params) {
  return request({
    url: `/jfzg/commonapi/projectStatistics/listReportPush`,
    method: "get",
    params,
  });
}
// 获取字典表
export function getlistByTopicAndItem(params) {
  return request({
    url: `/jfzg/commonapi/dict/listByTopicAndItem`,
    method: "get",
    params,
  });
}

// 获取验收管理信息
export function getCheckInfos(params) {
  return request({
    url: `/jfzg/commonapi/projectStatistics/getCheckInfos`,
    method: "get",
    params,
  });
}
// 获取项目标签和已选择的数据
export function getProjectLabel(params) {
  return request({
    url: `/jfzg/commonapi/projectStatistics/getProjectLabel`,
    method: "get",
    params,
  });
}

// 过程文档
export function getAllFilesByModule(params) {
  return request({
    url: `/jfzg/commonapi/projectStatistics/getAllFilesByModule`,
    method: "get",
    params,
  });
}
// 立项附件文档
export function getAllProjectFile(params) {
  return request({
    url: `/jfzg/commonapi/projectStatistics/getAllProjectFile`,
    method: "get",
    params,
  });
}
// 过程文档
export function getDeliveryReport(params) {
  return request({
    url: `/jfzg/commonapi/projectStatistics/getDeliveryReportByProjectId`,
    method: "get",
    params,
  });
}



