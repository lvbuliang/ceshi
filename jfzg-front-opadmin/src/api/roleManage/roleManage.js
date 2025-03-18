import request from '@/utils/request'
const URL = '/jfzg/opcenter'

// 导入标签
export function api_bootFile(data) {
  return request({
    url: `${URL}/permission/import/importPermission`,
    method: 'post',
    data
  })
}
//获取角色列表
export function api_findByCondintion(params) {
  return request({
    url: `${URL}/buRole/findByCondintion`,
    method: 'get',
    params
  })
}
//新增修改角色
export function api_saveOrUpdate(data) {
  return request({
    url: `${URL}/buRole/saveOrUpdate`,
    method: 'post',
    data
  })
}
//角色权限树列表
export function api_getRolePermissionyInfoList(params) {
  return request({
    url: `${URL}/buRole/getPermissionyInfoListSelected`,
    method: 'get',
    params
  })
}
//角色权限绑定
export function api_roleBinding(data) {
  return request({
    url: `${URL}/buRole/roleBinding`,
    method: 'post',
    data
  })
}
//权限管理树列表
export function api_getPermissionyInfoList(data) {
  return request({
    url: `${URL}/permission/op/getPermissionList`,
    method: 'post',
    data
  })
}
//权限管理  权限详情
export function api_getPermissionyInfo(data) {
  return request({
    url: `${URL}/permission/op/getPermissionDetail`,
    method: 'post',
    data
  })
}
//权限新增修改
export function api_permissionSaveOrUpdate(data) {
  return request({
    url: `${URL}/permission/op/saveOrUpdate`,
    method: 'post',
    data
  })
}

//权限删除
export function api_delPermissiony(data) {
  return request({
    url: `${URL}/permission/op/delPermission`,
    method: 'post',
    data
  })
}
// 初始化
export function api_initRolePermiss(params) {
  return request({
    url: `${URL}/api/role/initRolePermiss`,
    method: 'get',
    params
  })
}

// 下载模板
export function api_importUserTemplate(params) {
  return request({
    url: `${URL}/api/role/importUserTemplate`,
    method: 'post',
    params
  })
}
// 下载用户模板
export function api_userDownLoad(params) {
  return request({
    url: `${URL}//user/userDownLoad`,
    method: 'get',
    params
  })
}
// 角色父级查询
export function api_getAloneRole(params) {
  return request({
    url: `${URL}/buRole/getAloneRole`,
    method: 'post',
    params
  })
}
//权限管理快捷入口
export function api_listByTopicAndItem(params) {
  return request({
    url: `jfzg/commonapi/dict/listByTopicAndItem`,
    method: 'get',
    params
  })
}

//移动权限菜单
export function api_moveMenus(data) {
  return request({
    url: `jfzg/opcenter/permission/op/moveMenus`,
    method: 'post',
    data
  })
}