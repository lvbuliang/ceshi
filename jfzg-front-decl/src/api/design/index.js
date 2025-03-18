import request from "@/utils/request";
const URL = "/jfzg/projectDecl";
/*
 * 设计公司
 */
// 列表
export function api_designCompanyList(data) {
  return request({
    url: `${URL}/designCompany/designCompanyList`,
    method: "post",
    data,
  });
}
//新增
export function api_saveCompany(data) {
  return request({
    url: `${URL}/designCompany/saveCompany`,
    method: "post",
    data,
  });
}
//删除设计公司
export function api_delCompany(params) {
  return request({
    url: `${URL}/designCompany/delCompany`,
    method: "get",
    params,
  });
}
//设计公司详情
export function api_getDesignCompanyById(data) {
  return request({
    url: `${URL}/designCompany/getDesignCompanyById`,
    method: "post",
    data,
  });
}
//新增设计人员
export function api_saveDesigner(data) {
  return request({
    url: `${URL}/designer/saveDesigner`,
    method: "post",
    data,
  });
}
//查询设计公司项目列表   公司
export function api_getDesignComPanyList(data) {
    return request({
      url: `${URL}/designer/getDesignComPanyList`,
      method: "post",
      data,
    });
}
//删除设计人员
export function api_delDesigner(params) {
  return request({
    url: `${URL}/designer/delDesigner`,
    method: "get",
    params,
  });
}
//新增设计人员评分
export function api_saveDesignerScore(data) {
  return request({
    url: `${URL}/designer/saveDesignerScore`,
    method: "post",
    data,
  });
}
//设计人员详情接口
export function api_getDesignerById(data) {
  return request({
    url: `${URL}/designer/getDesignerById`,
    method: "post",
    data,
  });
}
//公司全部人员列表
export function api_getAllDesignerList(data) {
  return request({
    url: `${URL}/designer/getAllDesignerList`,
    method: "post",
    data,
  });
}
//公司全部人员列表
export function api_getDesignerList(data) {
  return request({
    url: `${URL}/designer/getDesignerList`,
    method: "post",
    data,
  });
}

//全部公司下拉
export function api_getAllDesignCompanyList(data) {
  return request({
    url: `${URL}/designCompany/getAllDesignCompanyList`,
    method: "post",
    data,
  });
}

//全部公司导出
export function api_companyExport(data) {
  return request({
    url: `${URL}/designCompany/export`,
    method: "get",
    data,
  });
}