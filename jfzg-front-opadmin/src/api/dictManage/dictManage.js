import request from '@/utils/request'
const URL = 'jfzg/opcenter'
//获取字典类型列表
export function api_queryDicttypeList(params) {
  return request({
    url: `${URL}/dict/type/list`,
    method: 'get',
    params
  })
}
//获取字典列表
export function api_queryDictList(params) {
  return request({
    url: `${URL}/dict/item/list`,
    method: 'get',
    params
  })
}
//新增字典记录
export function api_addDictRecord(data) {
  return request({
    url: `${URL}/dict/item/add`,
    method: 'post',
    data
  })
}
//新增字典记录
export function api_addDictRecordType(data) {
  return request({
    url: `${URL}/dict/item/add/type`,
    method: 'post',
    data
  })
}
//编辑字典字段记录
export function api_editDictRecord(data) {
  return request({
    url: `${URL}/dict/item/edit`,
    method: 'post',
    data
  })
}
//删除字典字段记录
export function api_deleteDictRecord(data) {
  return request({
    url: `${URL}/dict/item/delete/` + data,
    method: 'post',

  })
}


//服务能力类型列表
export function api_getServeTypeList(params) {
  return request({
    url: `${URL}/serverCapacity/list/type`,
    method: 'get',
    params
  })
}
//添加服务能力类型
export function api_addServeType(data) {
  return request({
    url: `${URL}/serverCapacity/add/type`,
    method: 'post',
    data
  })
}
//服务能力标签列表
export function api_getServeTagList(params) {
  return request({
    url: `${URL}/serverCapacity/list/tag`,
    method: 'get',
    params
  })
}
//添加服务能力标签
export function api_addServeTag(data) {
  return request({
    url: `${URL}/serverCapacity/add/tag`,
    method: 'post',
    data
  })
}
//编辑服务能力标签
export function api_editServeTag(data) {
  return request({
    url: `${URL}/serverCapacity/update/tag`,
    method: 'post',
    data
  })
}
//查询行业方向领域
export function api_queryIndustryDirection(data) {
  return request({
    url: `${URL}/industryDirection/list/territory`,
    method: 'get',
    data
  })
}
//添加行业方向领域
export function api_addIndustryDirection(data) {
  return request({
    url: `${URL}/industryDirection/add/territory`,
    method: 'post',
    data
  })
}
//编辑行业方向领域
export function api_updateIndustryDirection(data) {
  return request({
    url: `${URL}/industryDirection/update/territory`,
    method: 'post',
    data
  })
}
//查询行业方向类型
export function api_queryType(params) {
  return request({
    url: `${URL}/industryDirection/list/type`,
    method: 'get',
    params
  })
}
//添加行业方向类型
export function api_addType(data) {
  return request({
    url: `${URL}/industryDirection/add/type`,
    method: 'post',
    data
  })
}
//编辑行业方向类型
export function api_updateType(data) {
  return request({
    url: `${URL}/industryDirection/update/type`,
    method: 'post',
    data
  })
}
//删除行业方向类型领域
export function api_deleteIndustryDirection(data) {
  return request({
    url: `${URL}/industryDirection/delete/${data.id}`,
    method: 'post',
    data
  })
}