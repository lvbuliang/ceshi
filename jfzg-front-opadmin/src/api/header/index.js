import request from "@/utils/request";
const URL = "/jfzg/opcenter/template/table/head";
// wiki: https://wiki.jointforce.com/pages/viewpage.action?pageId=154435954

// 修改
export function api_updateTableHead(data) {
  return request({
    url: `${URL}/updateTableHead`,
    method: "post",
    data
  });
}

// 列表
export function api_getTableHaedPage(params) {
  return request({
    url: `${URL}/getTableHaedPage`,
    method: "get",
    params
  });
}

// 查看
export function api_getTabelHeadById(params) {
  return request({
    url: `${URL}/getTabelHeadById`,
    method: "get",
    params
  });
}