import request from "@/utils/request";

/**
 *
 * 任务列表
 */
// 获取项目列表
export function api_queryMemberProjects(data) {
  return request({
    url: `/jfzg/projectImpl/projectTaskMember/queryMemberProjects`,
    method: "post",
    data
  });
}

// 项目成员添加
export function addMembersAjax(data) {
  return request({
    url: `/jfzg/projectImpl/projectTaskMember/add`,
    method: "post",
    data
  });
}

// 项目成员删除
export function removeMembersAjax(data) {
  return request({
    url: `/jfzg/projectImpl/projectTaskMember/delete`,
    method: "post",
    data
  });
}

//根据buid和角色code查询前端查询企业成员列表
export function queryUnitMembersBy(data) {
  return request({
    url: "/jfzg/ucenter/unit/member/front/queryUnitMembersByParams",
    method: "post",
    data
  });
}

//根据项目Id和单位类型查询成员列表
export function queryByUnitType(data) {
  return request({
    url: "/jfzg/projectImpl/projectTaskMember/queryByUnitType",
    method: "post",
    data
  });
}

//项目库获取详情
export function getDetailById(params) {
  return request({
    url: `/jfzg/projectlibrary/project/getDetailById`,
    method: "get",
    params
  });
}
