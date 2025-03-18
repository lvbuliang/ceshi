
import request from "@/utils/request";
// 列表查询
export function api_projectCloseLise(data) {
  return request({
    url: `/jfzg/projectlibrary/projectCloseManage/list`,
    method: "post",
    data,
  });
}
export function api_projectCloseView(params) {
  return request({
    url: `/jfzg/projectlibrary/projectCloseManage/detail`,
    method: "get",
    params,
  });
}
export function api_projectCloseSave(data) {
  return request({
    url: `/jfzg/projectlibrary/projectCloseManage/saveOrUpdate`,
    method: "post",
    data,
  });
}