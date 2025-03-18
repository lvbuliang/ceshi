import request from "@/utils/request";


// 列表
export function api_preliminaryMgrList(data) {
  return request({
    url: `/jfzg/projectImpl/firstCheck/list`,
    method: 'post',
    data
  })
}
//申请
export function api_preliminaryMgrApply(data) {
  return request({
    url: `/jfzg/projectImpl/firstCheck/saveOrUpdate`,
    method: 'post',
    data
  })
}
//详情
export function api_preliminaryMgrDetail(params) {
  return request({
    url: `/jfzg/projectImpl/firstCheck/detail`,
    method: 'get',
    params
  })
}

//获取初验ids
export function api_getAllIds(params) {
  return request({
    url: `/jfzg/projectImpl/firstCheck/getAllIds`,
    method: 'get',
    params
  })
}

//文件归档
export function api_fileAway(data) {
  return request({
    url: `/jfzg/projectImpl/firstCheck/fileAway`,
    method: 'post',
    data
  })
}