import request from "@/utils/request";
const URL = "/jfzg/opcenter";
// const URL2 = '/jfzg/ucenter'

//账号列表
///jfzg/ucenter/user/op/queryUsersByPage
export function api_unitManageDetailList(data) {
  return request({
    url: `${URL}/unit/member/listByPage`,
    method: "post",
    data,
  });
}
//新增人员账户列表
export function api_accountTableList(data) {
  return request({
    url: `/jfzg/opcenter/user/op/queryUsersByPage`,
    method: "post",
    data,
  });
}
//账户列表
export function api_queryUsersByPage(data) {
  return request({
    url: `/jfzg/opcenter/user/op/queryUsersByPage`,
    method: "post",
    data,
  });
}
//账号启用
export function api_enabledUnitMembers(data) {
  return request({
    url: `/jfzg/opcenter/user/op/enabled/` + data,
    method: "post",
    data,
  });
}
//获取  子账号
export function api_queryByParentId(data) {
  return request({
    url: `${URL}/bizUnit/queryByParentId`,
    method: "post",
    data,
  });
}
//账号停用
export function api_forbiddenUnitMembers(data) {
  return request({
    url: `/jfzg/opcenter/user/op/forbidden/` + data,
    method: "post",
    data,
  });
}
//新增人员编辑人员
export function api_saveOrUpdate(data) {
  return request({
    url: `${URL}/user/saveOrUpdate`,
    method: "post",
    data,
  });
}
//删除账号
export function api_delete(params) {
  return request({
    url: `${URL}/user/delete`,
    method: "get",
    params,
  });
}
//单位类型下拉
export function api_buPropertyList(params) {
  return request({
    url: `${URL}/buProperty/list`,
    method: "get",
    params,
  });
}
//检测登录账号
export function api_isExist(params) {
  return request({
    url: `${URL}/user/isExist`,
    method: "get",
    params,
  });
}

//导出列表数据
export function api_exportUserExcel(params) {
  return request({
    url: `${URL}/user/exportUserExcel`,
    method: "get",
    params,
  });
}
//角色下拉框
export function api_findBuRoleList(params) {
  return request({
    url: `${URL}/buRole/findBuRoleList`,
    method: "get",
    params,
  });
}

//部门列表
export function api_departmentList(params) {
  return request({
    url: `${URL}/unit/dep/list/`,
    method: "get",
    params,
  });
}
//按id导出文件
export function api_excel(params) {
  return request({
    url: `${URL}/unit/export/excel/part`,
    method: "get",
    params,
  });
}
// 导入
export function api_uploadfile(data) {
  return request({
    url: `/jfzg/ucenter/user/op/importAccount`,
    method: "post",
    data,
  });
}

// 下拉用户
export function api_sysPullTacc() {
  return request({
    url: `/jfzg/ucenter/thirApi/sysPullTacc`,
    method: "post",
  });
}

// 返回处理结果
export function api_sysDoneTacc() {
  return request({
    url: `/jfzg/ucenter/thirdApi/sysDoneTacc`,
    method: "post",
  });
}