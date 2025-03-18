import request from "@/utils/request";

// 订单管理

// 列表查询
export function api_contractSearchLise(data) {
  return request({
    url: `/jfzg/projectlibrary/order/management/getContractServiceList`,
    method: "post",
    data,
  });
}
export function api_orderSearchLise(data) {
  return request({
    url: `/jfzg/projectlibrary/order/management/getDetailOrderById`,
    method: "post",
    data,
  });
}
// 项目联级查询
export function api_selectProject(data) {
  return request({
    url: `/jfzg/projectlibrary/order/management/selectProject`,
    method: "post",
    data,
  });
}
// 新增服务功能
export function api_addContract(data) {
  return request({
    url: `/jfzg/projectlibrary/order/management/addContractService`,
    method: "post",
    data,
  });
}
// 合同查看回显
export function api_getDetail(data) {
  return request({
    url: `/jfzg/projectlibrary/order/management/GetDetailById`,
    method: "post",
    data,
  });
}
//  订单详情回显
export function api_getOrderDetail(params) {
  return request({
    url: `/jfzg/projectlibrary/order/management/orderDisplay`,
    method: "post",
    params,
  });
}
//   新增、编辑订单
export function api_addOrder(data) {
  return request({
    url: `/jfzg/projectlibrary/order/management/saveOrupdateOrderDetail`,
    method: "post",
    data,
  });
}
// 服务删除
export function api_deleteService(params) {
  return request({
    url: `/jfzg/projectlibrary/order/management/deleteService`,
    method: "post",
    params,
  });
}
// 服务删除
export function api_deleteOrderService(data) {
  return request({
    url: `jfzg/projectlibrary/order/management/deleteOrderPay`,
    method: "post",
    data,
  });
}
// 订单导入
export function api_importOrder(data) {
  return request({
    url: `/jfzg/projectlibrary/order/management/importOrder`,
    method: "post",
    data,
  });
}
// 合同导出
export function api_exportContract(data) {
  return request({
    url: `/jfzg/projectlibrary/order/management/export`,
    method: "post",
    data,
    responseType: "blob",
  });
}
// 搜索项目负责人
export function api_searchRoleCode(params) {
  return request({
    url: `/jfzg/opcenter/getUserByRoleCode`,
    method: "post",
    params: {
      roleCode: params.roleCode,
    },
  });
}