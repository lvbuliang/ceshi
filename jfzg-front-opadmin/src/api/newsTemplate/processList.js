import request from "@/utils/request";
const URL = "/jfzg/opcenter";

// 业务模板列表
export function api_getFileList(data) {
  return request({
    url: `${URL}/modelFile/list`,
    method: "post",
    data
  });
}

// 新增、保存
export function api_addOrSave(data) {
  return request({
    url: `${URL}/modelFile/save`,
    method: "post",
    data
  });
}

// 详情
export function api_getDetail(params) {
  return request({
    url: `${URL}/modelFile/detail`,
    method: "get",
    params
  });
}
