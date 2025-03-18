import request from "@/utils/request";
import axios from "@/utils/axios";
const URL = "/jfzg/projectDecl/preliminary";
/*
 * 初设
 */
// 列表
export function api_cs_queryList(params) {
  return request({
    url: `${URL}/queryList`,
    method: "get",
    params,
  });
}

// 保存
export function api_cs_save(data) {
  return request({
    url: `${URL}/save`,
    method: "post",
    data,
  });
}

//无loading表单新增保存草稿
export function api_cs_draft_noLoading(data) {
  return axios({
    url: `${URL}/draft`,
    method: "post",
    data,
  });
}

//  编辑
export function api_cs_update(data) {
  return request({
    url: `${URL}/update`,
    method: "post",
    data,
  });
}

//  删除
export function api_cs_remove(data) {
  return request({
    url: `${URL}/remove`,
    method: "post",
    data,
  });
}

// 详情
export function api_cs_getDetailById(params) {
  return request({
    url: `${URL}/getDetailById`,
    method: "get",
    params,
  });
}

// 获取概算id集合
export function api_cs_queryIdList(params) {
  return request({
    url: `${URL}/queryIdList`,
    method: "get",
    params,
  });
}

/*
 节约化比对
 https://wiki.jointforce.com/pages/viewpage.action?pageId=148281741
*/

// 概算集约化比对当前项目详情
export function api_projectPreliminary_detail(params) {
  return request({
    url: `/jfzg/projectDecl/api/IntensiveComparison/projectPreliminary/detail`,
    method: "get",
    params,
  });
}

// 可研集约化比对列表
export function api_projectPreliminary_list(data) {
  return request({
    url: `/jfzg/projectDecl/api/IntensiveComparison/projectPreliminary/list`,
    method: "post",
    data,
  });
}

// 附件归档
export function api_fileAway(data) {
  return request({
    url: `/jfzg/projectDecl/preliminary/fileAway`,
    method: "post",
    data,
  });
}
