import request from '@/utils/request'
const URL = 'jfzg/opcenter'
import qs from 'qs';

//里程碑模板列表
export function api_getMilepostList(params) {
  return request({
    url: `${URL}/stageConfig/findByCondintion`,
    method: 'get',
    params
  })
}
//新增编辑里程碑
export function api_addMilepostList(data) {
  return request({
    url: `${URL}/stageConfig/saveOrUpdate`,
    method: 'post',
    data
  })
}
//删除里程碑
export function api_removeMilepostList(params) {
  return request({
    url: `${URL}/stageConfig/delete`,
    method: 'get',
    params
  })
}
//交付物模板列表
export function api_deliverableList(params) {
  return request({
    url: `${URL}/stageDeliver/findByCondintion`,
    method: 'get',
    params
  })
}
//删除交付物
export function api_removeDeliverableList(params) {
  return request({
    url: `${URL}/stageDeliver/delete`,
    method: 'get',
    params
  })
}
//交付物里程碑下拉
export function api_lcbSelect(params) {
  return request({
    url: `${URL}/stageConfig/findStageConfigList`,
    method: 'get',
    params
  })
}
//交付物提交编辑
export function api_saveDeliverable(data) {
  return request({
    url: `${URL}/stageDeliver/saveOrUpdate`,
    method: 'post',
    data
  })
}
//分册跟项目类型
export function api_qtDeliverable(params) {
  return request({
    url: `${URL}/dictcode/findDictcodeList`,
    method: 'get',
    params
  })
}
// 任务模板列表
export function api_getTaskList(params) {
  return request({
    url: `${URL}/stageTask/findByCondintion`,
    method: 'get',
    params
  })
}
// 删除任务模板
export function api_removeTaskList(params) {
  return request({
    url: `${URL}/stageTask/delete`,
    method: 'get',
    params
  })
}
// 新增编辑任务模板
export function api_addTaskList(data) {
  return request({
    url: `${URL}/stageTask/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 回显附件数据
export function fileData(params) {
  return request({
    url: `${URL}/api/file/` + params.id,
    method: 'get',
    params
  })
}
// 添加里程碑
export function api_addMilestoneList(data) {
  return request({
    url: `${URL}/temp/stage/add`,
    method: 'post',
    data
  })
}
// 编辑里程碑
export function api_editMilestoneList(data) {
  return request({
    url: `${URL}/temp/stage/update`,
    method: 'post',
    data
  })
}
// 删除里程碑
export function api_removeMilestoneList(templId) {
  return request({
    url: `${URL}/temp/stage/delete/` + templId,
    method: 'post',
    templId
  })
}
// 里程碑模板列表
export function api_getMilestoneList(params) {
  return request({
    url: `${URL}/temp/stage/list`,
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}
// 风险问题模板列表
export function api_getRiskQuestionList(params) {
  return request({
    url: `${URL}/temp/measure/list`,
    method: 'get',
    params
  })
}
// 新增风险问题模板列表
export function api_addRiskQuestionList(data) {
  return request({
    url: `${URL}/temp/measure/add`,
    method: 'post',
    data
  })
}
// 编辑风险问题模板列表
export function api_editRiskQuestionList(data) {
  return request({
    url: `${URL}/temp/measure/update`,
    method: 'post',
    data
  })
}

// 删除风险问题模板列表
export function api_removeRiskQuestionList(templId) {
  return request({
    url: `${URL}/temp/measure/` + templId,
    method: 'post',
    templId
  })
}
// 进度模板系统检查项列表
export function api_getPlanTemplateList(params) {
  return request({
    url: `${URL}/cpItem/findByCondintion`,
    method: 'get',
    params
  })
}
// 添加里程碑节点查询
export function api_addLcbList(params) {
  return request({
    url: `${URL}/temp/stage/toAdd/list`,
    method: 'get',
    params
  })
}
// 删除进度模板
export function api_removePlanTemplateList(params) {
  return request({
    url: `${URL}/cpItem/delete`,
    method: 'get',
    params
  })
}
// 进度模板检查项新增修改
export function api_mingleTemplateList(data) {
  return request({
    url: `${URL}/cpItem/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 查询模板检查项列表
export function api_queryTemplateList(params) {
  return request({
    url: `${URL}/cpItem/findByTemplCondintion`,
    method: 'get',
    params
  })
}
// 新增编辑模板进度检查项
export function api_addTemplateList(data) {
  return request({
    url: `${URL}/cpItem/cpCheckitemSaveOrUpdate`,
    method: 'post',
    data
  })
}
// 解绑模板检查项
export function api_relieveTemplateList(params) {
  return request({
    url: `${URL}/cpItem/unbundling`,
    method: 'get',
    params
  })
}
// 质量评估系统检查项列表
export function api_getQualityList(params) {
  return request({
    url: `${URL}/item/findByCondintion`,
    method: 'get',
    params
  })
}
// 质量评估检查项新增修改
export function api_addQualityList(data) {
  return request({
    url: `${URL}/item/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 新增质量评估模板
export function api_addQualityTemplate(data) {
  return request({
    url: `${URL}/temp/quality/add`,
    method: 'post',
    data
  })
}
// 编辑质量评估模板
export function api_editQualityTemplate(data) {
  return request({
    url: `${URL}/temp/quality/update`,
    method: 'post',
    data
  })
}
// 删除质量评估模板
export function api_deleteQualityTemplate(data) {
  return request({
    url: `${URL}/temp/quality/delete/` + data,
    method: 'post',
  })
}
// 删除质量评估检查项
export function api_removeQualityList(params) {
  return request({
    url: `${URL}/item/delete`,
    method: 'get',
    params
  })
}
// 质量评估系统检查项列表
export function api_getQualityCheckList(params) {
  return request({
    url: `${URL}/item/findByTemplCondintion`,
    method: 'get',
    params
  })
}
// 质量评估模板检查项新增
export function api_addQualityCheckList(data) {
  return request({
    url: `${URL}/item/saveCheckitem`,
    method: 'post',
    data
  })
}
// 解绑模板检查项
export function api_addJbCheckList(params) {
  return request({
    url: `${URL}/item/unbundling`,
    method: 'get',
    params
  })
}
// 质量、进度模板列表查询
export function api_getMultiList(params) {
  return request({
    url: `${URL}/cpItem/findTemplByCondintion`,
    method: 'get',
    params
  })
}
// 模板下添加里程碑节点
export function api_addIdList(data) {
  return request({
    url: `${URL}/temp/stage/addnode`,
    method: 'post',
    data
  })
}
// 	工单列表查询
export function api_getWorkOrderList(params) {
  return request({
    url: `${URL}/workOrderContent/query`,
    method: 'get',
    params
  })
}
// 	工单类型查询
export function api_getWorkType(params) {
  return request({
    url: `${URL}/workOrderContent/queryWorkType`,
    method: 'get',
    params
  })
}
// 	删除工单
export function api_removeWorkType(data) {
  return request({
    url: `${URL}/workOrderContent/delete`,
    method: 'post',
    data
  })
}
// 	新增工单
export function api_addWorkType(data) {
  return request({
    url: `${URL}/workOrderContent/add`,
    method: 'post',
    data
  })
}
// 	编辑工单
export function api_editWorkType(data) {
  return request({
    url: `${URL}/workOrderContent/update`,
    method: 'post',
    data
  })
}
// 工单里程碑下拉
export function api_gdSelect(params) {
  return request({
    url: `${URL}/temp/measure/stage/select`,
    method: 'get',
    params
  })
}
// 项目类型
export function api_getDictcodeList(params) {
  return request({
    url: `${URL}/dictcode/getDictcodeList`,
    method: 'get',
    params
  })
}