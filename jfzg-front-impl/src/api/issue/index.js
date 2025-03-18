import request from "@/utils/request";
import axios from "@/utils/axios";

const URL = '/jfzg/projectImpl/dispatch'
const RISKURL = '/jfzg/projectImpl/dispatchRisk'
const TROUBLEURL = '/jfzg/projectImpl/dispatchQuestion'
/*
 * 所属模块：预警与防范 （风险问题）
 * wiki：https://wiki.jointforce.com/pages/viewpage.action?pageId=148278305
 * 所属模块：问题
 * wiki：https://wiki.jointforce.com/pages/viewpage.action?pageId=148278603
 */

// 风险问题列表
export function api_getProjectDispatchList(params) {
  return request({
    url: `${URL}/getProjectDispatchList`,
    method: 'get',
    params
  })
}

/******************* 风险 *******************/
// 风险列表
export function api_getRiskList(params) {
  return request({
    url: `${RISKURL}/getRiskList`,
    method: 'get',
    params
  })
}

// 提交风险
export function api_submitRiskInfo(data) {
  return request({
    url: `${RISKURL}/submitRiskInfo`,
    method: 'post',
    data
  })
}

//无loading表单编辑风险
export function api_editRiskInfo_noLoading(data) {
  return axios({
    url: `${RISKURL}/editRiskInfo`,
    method: 'post',
    data
  })
}

// 风险详情
export function api_getRiskDelitail(params) {
  return request({
    url: `${RISKURL}/getRiskDelitail`,
    method: 'get',
    params
  })
}

// 整改风险
export function api_uploadRectResult(data) {
  return request({
    url: `${RISKURL}/uploadRectResult`,
    method: 'post',
    data
  })
}

/******************* 问题 *******************/
// 问题列表
export function api_getQuestionList(params) {
  return request({
    url: `${TROUBLEURL}/getQuestionList`,
    method: 'get',
    params
  })
}

// 提交
export function api_submitQuestionInfo(data) {
  return request({
    url: `${TROUBLEURL}/submitQuestionInfo`,
    method: 'post',
    data
  })
}

//无loading表单编辑问题
export function api_editQuestionInfo_noLoading(data) {
  return axios({
    url: `${TROUBLEURL}/editQuestionInfo`,
    method: 'post',
    data
  })
}

// 整改
export function api_t_uploadRectResult(data) {
  return request({
    url: `${TROUBLEURL}/uploadRectResult`,
    method: 'post',
    data
  })
}

// 详情
export function api_getQuestionDelitail(params) {
  return request({
    url: `${TROUBLEURL}/getQuestionDelitail`,
    method: 'get',
    params
  })
}