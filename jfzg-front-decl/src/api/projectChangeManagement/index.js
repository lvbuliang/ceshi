/*
 *@Description: 
 项目变更api接口文件
 *@MethodAuthor: 乔宏恩
 *@Date: 2024-09-15 03:38:27
*/

import request from "@/utils/request";

// 项目变更列表接口
export function api_getChangeList(data) {
  return request({
    url: `/jfzg/projectlibrary/changeProject/list`,
    method: "post",
    data,
  });
}
//
export function api_changeProjectIds(data) {
  return request({
    url: `/jfzg/projectlibrary/changeProject/changeProjectIds`,
    method: "post",
    data,
  });
}
// 项目变更，提交或保存
export function api_changeprojectUpdate(data) {
  console.log(data,'产地给后弹')
  return request({
    url: "/jfzg/projectlibrary/changeProject/saveOrUpdate",
    method: "post",
    data,
  });
}
export function api_getDetail(params) {
  return request({
    url: "/jfzg/projectlibrary/changeProject/detail",
    method: "get",
    params,
  });
}

export function api_changeProjectList(data) {
  return request({
    url: `/jfzg/projectlibrary/changeProject/listBasic`,
    method: "post",
    data,
  });
}

export function getListleaveTrace(data) {
  return request({
    // url: `/jfzg/commonapi/processLog/getProjectExecutionHistory?busId=${data}`,
    url: `/jfzg/commonapi/processLog/getList?busiId=${data}&busiType=PROJECT_CHANGENEW `,
    method: "get",
  });
}

export function api_presssbtoDosth(data) {
  return request({
    url: `/jfzg/projectlibrary/changeProject/Reminders`,
    method: "post",
    data,
  });
}

export function api_presscontract(data) {
  return request({
    url: `/jfzg/commonapi/contract/byProjectId`,
    method: "get",
    data,
  });
}