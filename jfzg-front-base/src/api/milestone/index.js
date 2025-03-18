import request from "@/utils/request";


// 项目列表
export function api_projectList(data) {
  return request({
    url: `/jfzg/projectImpl/milestoneReview/listProject`,
    method: 'post',
    data
  })
}
// 里程碑审查列表
export function api_milestoneList(data) {
  return request({
    url: `/jfzg/projectImpl/milestoneReview/list`,
    method: 'post',
    data
  })
}
// 新增/修改
export function api_saveOrUpdate(data) {
  return request({
    url: `/jfzg/projectImpl/milestoneReview/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 草稿
export function api_draft(data) {
  return request({
    url: `/jfzg/projectImpl/milestoneReview/draft`,
    method: 'post',
    data
  })
}
// 查询详情
export function api_detail(params) {
  return request({
    url: `/jfzg/projectImpl/milestoneReview/getDetailById`,
    method: 'get',
    params
  })
}
export function getChengjianUnit(data) {
  return request({
      url: `/jfzg/ucenter/bizUnit/queryBizunitsByProperty`,
      method: 'post',
      data
  })
}
// 获取当前提交的里程碑 /jfzg/projectImpl/milestoneReview/getStoneDetailById?id=1
export function getActiveMilestone(params) {
  return request({
      url: `/jfzg/projectImpl/milestoneReview/getStoneDetailById`,
      method: 'get',
      params
  })
}
// 风险问题统计 
export function projectRiskProblemCount(data) {
  return request({
      url: `/jfzg/projectImpl/projectRiskProblem/count`,
      method: 'post',
      data 
  })
}