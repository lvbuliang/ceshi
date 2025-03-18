import request from "@/utils/request";

// 获取项目预研交付列表数据
export function preResearchList(data) {
  return request({
    url: "/jfzg/projectlibrary/research/delivery/queryResearchDelivery",
    method: "post",
    data
  })
}
// 获取项目预研交付列表数据
export function api_getList(data) {
  return request({
    url: "/jfzg/projectlibrary/projectPreResearch/list",
    method: "post",
    data
  })
}

// 预研交付详情
export function api_getDetail(params) {
  return request({
    url: "/jfzg/projectlibrary/projectPreResearch/detail",
    method: "get",
    params
  })
}

// 活动固定小组成员
export function api_getFixedGroupMembers(data) {
  return request({
    url: `/jfzg/opcenter/getAddedGroupMembersV2?type=${data.type}`,
    method: "post",
    data
  })
}

// 根据code查询角色
export function getAddedGroupMembers(data) {
  return request({
    url: `/jfzg/opcenter/getAddedGroupMembers?roleCode=${data.roleCode}`,
    method: "post",
    data,
  });
}

// 新增、保存、编辑
export function api_saveOrUpdate(data) {
  return request({
    url: `/jfzg/projectlibrary/projectPreResearch/saveOrUpdate`,
    method: "post",
    data,
  });
}

// 查看意见
export function api_queryOpinion(data) {
  return request({
    url: `/jfzg/projectlibrary/projectPreResearch/audit/common/queryOpinion`,
    method: "post",
    data,
  });
}

// 撤回
export function api_before_thxg(param) {
  return request({
    url: `/jfzg/projectlibrary/projectPreResearch/audit/withdraw?processId=${param.processId}`,
    method: "get",
  });
}

