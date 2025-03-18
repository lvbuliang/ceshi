import request from '@/utils/request'
const URL = ''

//列表
export function api_tableList(data) {
  return request({
    url: `${URL}/jfzg/opcenter/oauth/client/list`,
    method: 'post',
    data
  })
}

//新增修改
export function api_saveOrUpdate(data) {
  return request({
    url: `${URL}/jfzg/opcenter/oauth/client/saveOrUpdate`,
    method: 'post',
    data
  })
}
//删除
export function api_delete(params) {
  return request({
    url: `${URL}/jfzg/opcenter/oauth/client/delete`,
    method: 'get',
    params
  })
}
//删除
export function api_info(params) {
  return request({
    url: `${URL}/jfzg/opcenter/oauth/client/info`,
    method: 'get',
    params
  })
}