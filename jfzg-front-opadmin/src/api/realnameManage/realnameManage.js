import request from '@/utils/request'
const URL = ''

//获取供应商列表
export function api_querySupplierList(params) {
  return request({
    url: `${URL}/iden/unit/list`,
    method: 'get',
    params
  })
}
//供应商认证信息
export function api_supplierAuthInfo(params) {
  return request({
    url: `${URL}/iden/unit/info`,
    method: 'get',
    params
  })
}
//供应商审核通过
export function api_supplierCheckPass(data) {
  return request({
    url: `${URL}/iden/unit/pass`,
    method: 'post',
    data
  })
}
//供应商审核不通过
export function api_supplierCheckReject(data) {
    return request({
      url: `${URL}/iden/unit/reject`,
      method: 'post',
      data
    })
  }
//获取个人列表列表
export function api_queryPersonList(params) {
  return request({
    url: `${URL}/iden/member/list`,
    method: 'get',
    params
  })
}
//个人信息认证
export function api_personAuthInfo(params) {
  return request({
    url: `${URL}/iden/member/info`,
    method: 'get',
    params
  })
}
//个人认证通过
export function api_personCheckPass(data) {
  return request({
    url: `${URL}/iden/member/pass`,
    method: 'post',
    data
  })
}

//个人认证不通过
export function api_personCheckReject(data) {
    return request({
      url: `${URL}/iden/member/reject`,
      method: 'post',
      data
    })
  }
// GYSSMRZ("", "供应商留痕 "),
// GYSCYSMRZ("", "员工审核留痕"),
// 获取留痕轨迹
export function common_trajectoryList(busiId, busiType) {
  return request({
    url: `${URL}/project/log/getList?busiId=${busiId}&busiType=${busiType}`,
    method: 'get'
  })
}