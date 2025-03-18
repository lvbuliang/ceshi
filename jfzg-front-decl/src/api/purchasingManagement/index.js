import request from "@/utils/request";

// 列表查询
export function api_queryProjectPurch(data) {
  return request({
    url: `/jfzg/projectlibrary/projectProcurement/queryExecutionLists`,
    method: "post",
    data,
  });
}

// 编辑_暂存
export function api_saveProjectPurch(data) {
  return request({
    url: `/jfzg/projectlibrary/projectProcurement/projectProcurement`,
    method: "post",
    data,
  });
}

// 查看
export function api_previewProjectPurch(data) {
  return request({
    url: `/jfzg/projectlibrary/projectProcurement/queryProjectProcurementList`,
    method: "post",
    data,
  });
}


