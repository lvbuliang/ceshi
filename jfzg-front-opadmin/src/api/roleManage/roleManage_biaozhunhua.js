import request from '@/utils/request'
const URL = '/jfzg/opcenter'

//新增修改角色
export function addandedit_api_biaozhunhua(data) {
  return request({
    url: `${URL}/buRole/saveOrUpdate`,
    method: 'post',
    data
  })
}

//单位类型下拉
export function api_buPropertyList(params) {
  return request({
    url: `${URL}/buProperty/list`,
    method: 'get',
    params
  })
}
