import request from "@/utils/request";


// 项目列表
export function api_projectList(data) {
  return request({
    url: `/jfzg/projectImpl/milestoneReview/listProject`,
    method: 'post',
    data
  })
}
// 交付物列表
export function api_deliverList(params) {
  return request({
    url: `/jfzg/projectImpl/delivery/getDeliveryPage`,
    method: 'get',
    params
  })
}
// 根据项目Id获取交付物列表
export function api_getdeliverListById(params) {
  return request({
    url: `/jfzg/projectImpl/delivery/getDeliveryList`,
    method: 'get',
    params
  })
}

// 根据项目Id和里程碑id获取交付物列表
export function api_getDeliveryListByStageId(params) {
  return request({
    url: `/jfzg/projectImpl/delivery/getDeliveryListByStageId`,
    method: 'get',
    params
  })
}

// 保存交付物 	
export function api_addDeliver(data) {
  return request({
    url: `/jfzg/projectImpl/delivery/saveDelivery`,
    method: 'post',
    data
  })
}
// 获取项目下的里程碑阶段 
export function getProjectStages(params) {
  return request({
    url: `/jfzg/projectImpl/technicalProposal/list/stage/${params.projectId}`,
    method: 'get',
  })
}
export function upload(data) {
  return request({
      url: `/jfzg/file/api/file/uploadBig`,
      method: 'post',
      timeout: 300000,
      data
  })
}
// 上传交付物文件 /delivery/uploadDeliveryFile
export function uploadDeliverFile(data) {
  return request({
      url: `/jfzg/projectImpl/delivery/uploadDeliveryFile`,
      method: 'post',
      data
  })
}
// 删除交付物附件 
export function deleteDeliverFile(params) {
  return request({
      url: `/jfzg/projectImpl/delivery/deleteDeliveryFileById`,
      method: 'get',
      params
  })
}
// 删除交付物 
export function deleteDeliver(params) {
  return request({
      url: `/jfzg/projectImpl/delivery/deleteDeliveryById`,
      method: 'get',
      params
  })
}
// 审核交付物附件
export function approveDeliverFile(data) {
  return request({
      url: `/jfzg/projectImpl/delivery/checkDeliveryFile`,
      method: 'post',
      data
  })
}
// 查看交付物附件审核结果 
export function getDeliverApproveDetail(params) {
  return request({
      url: `/jfzg/projectImpl/delivery/checkFileResult`,
      method: 'get',
      params
  })
}
// 编辑交付物
export function editDeliverApprove(data) {
  return request({
      url: `/jfzg/projectImpl/delivery/editDelivery`,
      method: 'post',
      data
  })
}