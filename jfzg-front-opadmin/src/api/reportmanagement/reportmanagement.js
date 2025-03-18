import request from '@/utils/request'
const URL = ''

//获取类型
export function specialFromType(params) {
  return request({
    url: `${URL}/specialFrom/list/type`,
    method: 'get',
    params
  })
}
//新增或编辑类型
export function addorupType(data) {
  return request({
    url: `${URL}/specialFrom/add/type`,
    method: 'post',
    data
  })
}

// 删除类型
export function delType(data) {
  return request({
    url: `${URL}/specialFrom/del/type`,
    method: 'post',
    data
  })
}
// 根据code查询类型表格字段
export function get_typeName(data) {
  return request({
    url: `${URL}/specialFrom/list/typeName`,
    method: 'post',
    data
  })
}
// 编辑类型表格字段
export function editTypeName(data) {
  return request({
    url: `${URL}/specialFrom/add/typeName`,
    method: 'post',
    data
  })
}
// 类型表格字段启动
export function isBegin(data) {
  return request({
    url: `${URL}/specialFrom/update/begin`,
    method: 'post',
    data
  })
}
