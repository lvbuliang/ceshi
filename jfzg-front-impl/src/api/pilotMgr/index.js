import request from "@/utils/request";


// 列表
export function api_pilotMgrList(data) {
  return request({
    url: `/jfzg/projectImpl/pilotRun/list`,
    method: 'post',
    data
  })
}
//申请
export function api_pilotRunApply(data) {
  return request({
    url: `/jfzg/projectImpl/pilotRun/saveOrUpdate`,
    method: 'post',
    data
  })
}
//详情
export function api_pilotRunDetail(params) {
  return request({
    url: `/jfzg/projectImpl/pilotRun/detail`,
    method: 'get',
    params
  })
}
//根据项目id查询初验业务id
export function api_getIdByProjectId(params) {
  return request({
    url: `/jfzg/projectImpl/firstCheck/getIdByProjectId`,
    method: 'get',
    params
  })
}

//过滤id查询项目id
export function api_queryProjectNotInIds(params) {
  return request({
    url: `/jfzg/projectlibrary/project/queryProjectNotInIds`,
    method: 'get',
    params
  })
}
export function api_queryProjectInitiativeTest(params) {
  return request({
    url: `/jfzg/projectlibrary/project/queryProjectInitiativeTest`,
    method: 'get',
    params
  })
}
// 终验查询项目
export function api_queryProjectFinalTest(params) {
  return request({
    url: `/jfzg/projectlibrary/project/queryProjectFinalTest`,
    method: 'get',
    params
  })
}

//获取试运行ids
export function api_getAllIds(params) {
  return request({
    url: `/jfzg/projectImpl/pilotRun/getAllIds`,
    method: 'get',
    params
  })
}
//风险问题获取数量
export function api_getCount(data) {
  return request({
    url: `/jfzg/projectImpl/projectRiskProblem/count`,
    method: 'post',
    data
  })
}
//附件归档
export function api_fileAway(data) {
  return request({
    url: `/jfzg/projectImpl/pilotRun/fileAway`,
    method: 'post',
    data
  })
}
