import request from '@/utils/request'
const URL = ''

//获取项目列表
export function api_queryProjectList(params) {
  return request({
    url: `${URL}/project/info/list`,
    method: 'get',
    params
  })
}
//编辑项目信息
export function api_editProjectInfo(data) {
  return request({
    url: `${URL}/project/info/edit`,
    method: 'post',
    data
  })
}
//项目成员列表
export function api_queryMemberList(params) {
  return request({
    url: `${URL}/project/member/list`,
    method: 'get',
    params
  })
}
//移除项目成员
export function api_removeMember(data) {
    return request({
      url: `${URL}/project/member/remove`,
      method: 'post',
      data
    })
  }
//新增项目成员
export function api_addMember(data) {
  return request({
    url: `${URL}/project/member/add`,
    method: 'post',
    data
  })
}
//可添加成员列表
export function api_canAddMemberList(data) {
  return request({
    url: `${URL}/bizunit/buMembers?buid=${data.buid}&&projectId=${data.projectId}`,
    method: 'post',
    
  })
}
