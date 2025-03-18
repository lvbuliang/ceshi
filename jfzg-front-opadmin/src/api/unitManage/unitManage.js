import request from '@/utils/request'
const URL = '/jfzg/opcenter'
// const URL2 = '/jfzg/opcenter'

//单位列表
export function api_unitList(data) {
  return request({
    url: `${URL}/unit/listUnit`,
    method: 'post',
    data
  })
}

//新增单位
export function api_addUnit(data) {
  return request({
    url: `${URL}/unit/add`,
    method: 'post',
    data
  })
}

//编辑单位
export function api_updateUnit(data) {
  return request({
    url: `${URL}/unit/update`,
    method: 'post',
    data
  })
}

//停用单位
export function api_unitForbidden(data) {
  return request({
    url: `${URL}/unit/forbidden/` + data,
    method: 'post',
  })
}
//启用单位
export function api_unitEnabled(data) {
  return request({
    url: `${URL}/unit/enabled/` + data,
    method: 'post',
  })
}

// 删除单位
export function api_unitDelete(data) {
  return request({
    url: `${URL}/unit/delete/` + data,
    method: 'post',
  })
}

//企业类型
export function api_buPropertyList(params) {
  return request({
    url: `${URL}/buProperty/list`,
    method: 'get',
    params
  })
}

//部门列表
export function api_unitDepList(params) {
  return request({
    url: `${URL}/unit/dep/list/`,
    method: 'get',
    params
  })
}

//单位成员列表
export function api_unitDepMembersList(params) {
  return request({
    url: `${URL}/unit/dep/members/list`,
    method: 'get',
    params
  })
}

// 新增成员
export function api_addUnitMembers(data) {
  return request({
    url: `${URL}/unit/member/add`,
    method: 'post',
    data
  })
}

// 编辑成员
export function api_updateUnitMembers(data) {
  return request({
    url: `${URL}/unit/member/update`,
    method: 'post',
    data
  })
}
//新增人员
export function api_opAdd(data) {
  return request({
    url: `/jfzg/opcenter/user/op/add`,
    method: 'post',
    data
  })
}
//编辑人员
export function api_opUpdate(data) {
  return request({
    url: `/jfzg/opcenter/user/op/update`,
    method: 'post',
    data
  })
}
// 停用成员
export function api_forbiddenUnitMembers(data) {
  return request({
    url: `${URL}/unit/member/forbidden/` + data,
    method: 'post',
  })
}
// 启用成员
export function api_enabledUnitMembers(data) {
  return request({
    url: `${URL}/unit/member/enabled/` + data,
    method: 'post',
  })
}

// 删除成员
export function api_deleteUnitMembers(data) {
  return request({
    url: `${URL}/unit/member/delete/` + data,
    method: 'post',
  })
}

// 重置密码
export function api_resetPwdUnitMembers(data) {
  return request({
    url: `/jfzg/opcenter/user/op/password/set`,
    method: 'post',
    data
  })
}

// 角色列表
export function api_roleUnitList(params) {
  return request({
    url: `${URL}/unit/role/list` + data,
    method: 'get',
    params
  })
}

// 成员角色
export function api_roleMemberUnitList(params) {
  return request({
    url: `${URL}/unit/member/role/list`,
    method: 'get',
    params
  })
}

// 成员设置角色
export function api_setRoleMemberUnit(data) {
  return request({
    url: `${URL}/unit/member/set/role`,
    method: 'post',
    data
  })
}

// 新增部门
export function api_setDeptUnitAdd(data) {
  return request({
    url: `${URL}/unit/dept/add`,
    method: 'post',
    data
  })
}
// 删除部门
export function api_setDeptrUnitDelete(data) {
  return request({
    url: `${URL}/unit/dept/delete`,
    method: 'post',
    data
  })
}
// 修改部门信息
export function api_setDeptrUnitUpdate(data) {
  return request({
    url: `${URL}/unit/dept/update`,
    method: 'post',
    data
  })
}
//  重置密码
export function api_setMemberrUnitUpdate(data) {
  return request({
    url: `${URL}/unit/member/password/set`,
    method: 'post',
    data
  })
}

//  查询全部单位
export function api_selectAllUnitList(params) {
  return request({
    url: `${URL}/unit/list/all/select`,
    method: 'get',
    params
  })
}
//  查询父级单位
export function api_getAloneUnit(data) {
  return request({
    url: `${URL}/bizUnit/getAloneUnit`,
    method: 'post',
    data
  })
}
//  查询所有账号
export function api_allUserList(data) {
  return request({
    url: `${URL}/user/op/allUserList`,
    method: 'post',
    data
  })
}
//  查询所有账号
export function api_accountList(data) {
  return request({
    url: `/jfzg/opcenter/user/op/queryUsersByPageV2`,
    method: "post",
    data,
  });
}
//单位删除成员
export function api_deleteMembers(data) {
  return request({
    url: `${URL}/unit/member/delete`,
    method: 'post',
    data
  })
}