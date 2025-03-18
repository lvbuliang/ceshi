import request from '@/utils/request'
const URL = '/jfzg/opcenter/'
export function getMenu(data) {
  return request({
    url: `${URL}user/op/getUserOpPermissionByToken`,
    method: 'get',
    data: data
  })
}