import request from '@/utils/request'
const URL = '/jfzg/opcenter'

//列表
export function api_getList(data) {
  return request({
    url: `/jfzg/opcenter/getAddedGroupMembersV2?type=${data.type}`,
    method: 'post',
    data
  })
}
//人员列表
// export function api_getUserByRoleCode(data) {
//   return request({
//     url: `/jfzg/opcenter/getUserByRoleCode?roleCode=${data.roleCode}`,
//     method: "post",
//     data,
//   });
// }

export function api_getUserByRoleCode(data) {
  return request({
    url: `/jfzg/opcenter/user/op/allUserList`,
    method: "post",
    data,
  });
}

//新增人员
export function api_addUsers(data) {
  return request({
    url: `/jfzg/opcenter/addedGroupMember?jfid=${data.jfid}&type=${data.type}`,
    method: "post",
    data,
  });
}
// 删除
export function api_delete(param) {
  return request({
    url: `/jfzg/opcenter/delGroupMember?jfid=${param.jfid}`,
    method: "get",
    param,
  });
}