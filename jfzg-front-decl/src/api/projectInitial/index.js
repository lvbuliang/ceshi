import request from "@/utils/request";

// 列表查询
export function api_queryProjectInitial(data) {
  return request({
    url: `/jfzg/projectlibrary/projectFirst/list`,
    method: "post",
    data,
  });
}

// 预研交付详情
export function api_getDetail(params) {
  return request({
    url: "/jfzg/projectlibrary/projectFirst/detail",
    method: "get",
    params,
  });
}

// 活动固定小组成员
export function api_getFixedGroupMembers(data) {
  return request({
    url: `/jfzg/opcenter/getAddedGroupMembersV2?type=${data.type}`,
    method: "post",
    data,
  });
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
    url: `/jfzg/projectlibrary/projectFirst/saveOrUpdate`,
    method: "post",
    data,
  });
}

// 查看意见
export function api_queryOpinion(data) {
  return request({
    url: `/jfzg/projectlibrary/projectFirst/common/queryOpinion`,
    method: "post",
    data,
  });
}
