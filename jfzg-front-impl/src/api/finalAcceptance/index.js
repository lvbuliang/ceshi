import request from "@/utils/request";
//终验
// 列表
export function api_finalAcceptanceList(data) {
  return request({
    url: `/jfzg/projectImpl/projectLastCheck/list`,
    method: "post",
    data,
  });
}
// 新增和修改
export function api_saveOrUpdate(data) {
  return request({
    url: `/jfzg/projectImpl/projectLastCheck/saveOrUpdate`,
    method: "post",
    data,
  });
}

// 获取详情
export function api_getDetailById(params) {
  return request({
    url: `/jfzg/projectImpl/projectLastCheck/getDetailById`,
    method: "get",
    params,
  });
}

// 删除
export function api_getDelete(params) {
  return request({
    url: `/jfzg/projectImpl/projectLastCheck/delete`,
    method: "get",
    params,
  });
}

// 获取所有已申请的项目id
export function api_queryIdList(params) {
  return request({
    url: `/jfzg/projectImpl/projectLastCheck/queryIdList`,
    method: "get",
    params,
  });
}
//获取试运行id
export function api_getPilotRunIdByProjectId(params) {
  return request({
    url: `/jfzg/projectImpl/pilotRun/getIdByProjectId`,
    method: "get",
    params,
  });
}
//终验备案
export function api_setSaveRecord(data) {
  return request({
    url: `/jfzg/projectImpl/projectLastCheck/saveRecord`,
    method: "post",
    data,
  });
}
//文件归档
export function api_fileAway(data) {
  return request({
    url: `/jfzg/projectImpl/projectLastCheck/fileAway`,
    method: 'post',
    data
  })
}
