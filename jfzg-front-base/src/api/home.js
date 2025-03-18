import request from "@/utils/request";

// 取标签列表
export function api_queryNeedDoCount(params) {
  return request({
    url: `/jfzg/schedule/schdule/getTags`,
    method: "get",
    params,
  });
}

export function api_queryDoList(data) {
  return request({
    url: `/jfzg/schedule/schduleNew/queryData`,
    method: "post",
    data,
  });
}

//快捷入口编辑
export function api_quickEdit(data) {
  return request({
    url: `/jfzg/commonapi/api/userSet/save`,
    method: "post",
    data,
  });
}
//快捷入口查询
export function api_quickData(params) {
  return request({
    url: `/jfzg/commonapi/api/userSet/query`,
    method: "get",
    params,
  });
}

//获取项目基本信息列表
export function getProjectBasciInfoList(data) {
  return request({
    url: `/jfzg/commonapi/project/library/getProjectBasciInfoList`,
    method: "post",
    data,
  });
}

//获取项目基本信息详情
export function getProjectBasciInfo(params) {
  return request({
    url: `/jfzg/commonapi/project/library/getProjectBasciInfo`,
    method: "get",
    params,
  });
}

//获取项目基本信息详情
export function dispatchStaticInfo(params) {
  return request({
    url: `/jfzg/commonapi/project/library/getDispatchStaticInfo`,
    method: "get",
    params,
  });
}

//获取子项目实施管理统计信息
export function getImplementStaticInfo(params) {
  return request({
    url: `/jfzg/commonapi/project/library/getImplementStaticInfo`,
    method: "get",
    params,
  });
}
// 子项目统计
export function getOperatorNameAndDetailUrl(params) {
  return request({
    url: `/jfzg/commonapi/project/library/getOperatorNameAndDetailUrl`,
    method: "get",
    params,
  });
}

//埋点接口
export function buriedPointSave(data) {
  return request({
    url: `/jfzg/commonapi/buriedPoint/save`,
    method: "post",
    data,
  });
}
// 获取统建项目tags
export function querySchduleByTab(data) {
  return request({
    url: `/jfzg/schedule/schduleNew/querySchduleByTab`,
    method: "post",
    data,
  });
}

// 获取统建项目tagsv2
export function querySchduleByTabV2(data) {
  return request({
    url: `/jfzg/schedule/schduleNew/querySchduleByTabV2`,
    method: "post",
    data,
  });
}
// 活动固定小组成员
export function api_getFixedGroupMembers(data) {
  return request({
    url: `/jfzg/opcenter/getAddedGroupMembersV2?type=${data.type}`,
    method: "post",
    data
  })
}
// 获取tag头部
export function queryTabAndNum() {
  return request({
    url: `/jfzg/schedule/schduleNew/queryTabAndNum`,
    method: "get",
  });
}
// 待办已办list
export function queryData(data) {
  return request({
    url: `/jfzg/schedule/schduleNew/queryData`,
    method: "post",
    data,
  });
}
// 修改已办去查看
export function updateTitle(param) {
  return request({
    url: `/jfzg/schedule/schduleNew/updateTitle?id=${param.id}`,
    method: "get",
    param,
  });
}

//查询播报公告
export function api_getNotice(data) {
  return request({
    url: `/jfzg/projectlibrary/projectKnowledgeBase/knowledgeBroadCast`,
    method: "post",
    data,
  });
}

