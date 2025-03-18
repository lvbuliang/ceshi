import request from "@/utils/request";

// 交付物管理api
// 获取项目列表
export function api_projectInfoByStageItem(data){
  return request({
    url:`/csportalsite/projectImplementatio/project/projectInfoByStageItem`,
    method:'get',
    params:data
  })
}
// 查询里程碑下的所有交付物文件信息
export function api_lcbFileInfo(data){
  return request({
    url:`/csportalsite/api/file/deliInfo`,
    method:'get',
    params:data
  })
}
// 查询交付物详情
export function api_JFWgetProjectDeliInfo(data){
  return request({
    url:`/csportalsite/deliverables/getProjectDeliInfo`,
    method:'get',
    params:data
  })
}
// 长沙上传交付物文件接口
export function api_uploadJFWFile(data){
  return request({
    url:`/csportalsite/api/file/deliUpload`,
    method:'post',
    data
  })
}

// 雨花上传交付物文件接口
export function api_uploadJFWFileYH(data){
  return request({
    url:`/csportalsite/api/file/YH/deliUpload`,
    method:'post',
    data
  })
}

// 模板列表
export function api_template(data){
  return request({
    url:`/csportalsite/checkTemplManage/queryPageListTempl`,
    method:'post',
    data
  })
}
// 查询某个交付物的详情和历史版本
export function api_historyDetail(data){
  return request({
    url:`/csportalsite/api/file/fileInfo`,
    method:'get',
    params:data
  })
}
// 长沙删除某个文件的所有版本
export function api_deleteAllVersion(data){
  return request({
    url:`/csportalsite/deliverables/deleteByFileNo`,
    method:'get',
    params:data
  })
}
// 雨花删除交付物文件的所有版本
export function api_deleteAllVersionYH(data){
  return request({
    url:`/csportalsite/deliverables/YH/deleteByFileNo`,
    method:'get',
    params:data
  })
}
// 删除某个文件的某个版本
export function deleteFileVersion(data){
  return request({
    url:`/csportalsite/deliverables/deleteByFileId`,
    method:'get',
    params:data
  })
}
// 长沙新增交付物
export function api_addNewdelivery(data){
  return request({
    url:`/csportalsite/deliverables/insertDeli`,
    method:'post',
    data
  })
}
// 雨花新增交付物
export function api_addNewdeliveryYH(data){
  return request({
    url:`/csportalsite/deliverables/YH/insertDeli`,
    method:'post',
    data
  })
}
// 长沙审核接口
export function insertFileReview(data){
  return request({
    url:`/csportalsite/api/file/insertFileReview`,
    method:'post',
    data
  })
}
// 雨花审核接口
export function insertFileReviewYH(data){
  return request({
    url:`/csportalsite/api/file/YH/insertFileReview`,
    method:'post',
    data
  })
}
// 长沙更新版本
export function uploadVersion(data){
  return request({
    url:`/csportalsite/deliverables/version`,
    method:'get',
    params:data
  })
}
// 雨花更新版本
export function uploadVersionYH(data){
  return request({
    url:`/csportalsite/deliverables/YH/version`,
    method:'get',
    params:data
  })
}
// 长沙删除整个交付物
export function deletedDelivery(data){
  return request({
    url:`/csportalsite/deliverables/deletedDelivery`,
    method:'get',
    params:data
  })
}
// 雨花删除整个交付物
export function deletedDeliveryYH(data){
  return request({
    url:`/csportalsite/deliverables/YH/deletedDelivery`,
    method:'get',
    params:data
  })
}

// 长沙修改交付物状态
export function updateDeliStatus(data){
  return request({
    url:`/csportalsite/deliverables/updateDeliStatus`,
    method:'post',
    data
  })
}
// 雨花修改交付物状态
export function updateDeliStatusYH(data){
  return request({
    url:`/csportalsite/deliverables/YH/updateDeliStatus`,
    method:'post',
    data
  })
}

// 获取交付物的详细信息
export function getJFWDetails(data){
  return request({
    url:`/csportalsite/deliverables/getDeliInfoById`,
    method:'get',
    params:data
  })
}
// 修改是否为盖章件
export function updateSourcrIsSeal(data){
  return request({
    url:`/csportalsite/api/file/updateSourcrIsSeal`,
    method:'post',
    data
  })
}
// 获取项目信息
export function getProjectInfoById(params) {
  return request({
    url: `/csportalsite/cloudApply/getProjectInfoById`,
    method: 'get',
    params
  })
}