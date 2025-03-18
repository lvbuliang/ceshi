import request from "@/utils/request";

/**
 *
 * 任务列表
 */
// 获取项目列表
export function api_queryTaskProjects(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/queryTaskProjects`,
    method: "post",
    data,
  });
}

// 里程碑阶段查询
export function api_queryStageList(projectId) {
  return request({
    url: `/jfzg/projectImpl/technicalProposal/list/stage/${projectId}`,
    method: "get"
  });
}
// 查询项目所有成员列表
export function api_queryAllMembers(data) {
  return request({
    url: `/jfzg/projectImpl/projectTaskMember/queryAllMembers`,
    method: "post",
    data,
  });
}
// 创建任务
export function api_addTask(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/add`,
    method: "post",
    data,
  });
}
// 编辑任务
export function api_updateTask(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/update`,
    method: "post",
    data,
  });
}

// 获取任务列表
export function api_getTaskList(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/queryPage`,
    method: "post",
    data,
  });
}
// 获取子任务列表
export function api_querySubTask(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/querySubTasks`,
    method: "post",
    data,
  });
}
// 获取任务详情
export function api_getTaskDetail(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/detail`,
    method: "post",
    data,
  });
}

// 删除任务
export function api_deleteTask(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/delete`,
    method: "post",
    data,
  });
}

// 处理任务
export function api_disposeTask(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/dispose`,
    method: "post",
    data,
  });
}
// 评价任务
export function api_evaluateTask(data) {
  return request({
    url: `/jfzg/projectImpl/projectTask/evaluate`,
    method: "post",
    data,
  });
}
// 承建单位项目人员查询
export function getSupplyerListAjax(params) {
  return request({
    url: `/csportalsite/projectImplementatio/supplyer/members`,
    method: "get",
    params,
  });
}

// 项目成员添加
export function addMembersAjax(data) {
  return request({
    url: `/csportalsite/projectImplementatio/member/add`,
    method: "post",
    data,
  });
}

// 项目成员移除
export function removeMembersAjax(data) {
  return request({
    url: `/csportalsite/projectImplementatio/member/remove`,
    method: "post",
    data,
  });
}

// 查询企业成员列表
export function getMembersListAjax(params) {
  return request({
    url: `/csportalsite/bizunit/buMembers`,
    method: "post",
    params,
  });
}

// 承建单位提交审核
export function supplyerSubmitAjax(data) {
  return request({
    url: `/projectAudit/supplyer/submit`,
    method: "post",
    data,
  });
}
// 监理单位驳回
export function supervisorRejectAjax(data) {
  return request({
    url: `/projectAudit/supervisor/reject`,
    method: "post",
    data,
  });
}
// 监理单位通过
export function supervisorPassAjax(data) {
  return request({
    url: `/projectAudit/supervisor/pass`,
    method: "post",
    data,
  });
}
// 建设单位驳回
export function buildRejectAjax(data) {
  return request({
    url: `/projectAudit/build/reject`,
    method: "post",
    data,
  });
}
// 建设单位通过
export function buildPassAjax(data) {
  return request({
    url: `/projectAudit/build/pass`,
    method: "post",
    data,
  });
}
// 提交审核接口
export function schemeSubmitAjax(data) {
  return request({
    url: `/csportalsite/projectImplementatio/scheme/submit`,
    method: "post",
    data,
  });
}

// 获取任务列表
export function gettaskList(data) {
  return request({
    url: `/csportalsite/taskInfo/getCsTaskInfoList`,
    method: "post",
    data,
  });
}
// 获取任务详情
export function gettaskInfo(params) {
  return request({
    url: `/csportalsite/taskInfo/getTaskInfo`,
    method: "get",
    params: params,
  });
}
// 获取项目成员
export function api_getProjectMember(params) {
  return request({
    url: `/csportalsite/taskInfo/getProjectMember`,
    method: "get",
    params: params,
  });
}
// 获取项目阶段
export function getProjectStage(data) {
  return request({
    url: `/csportalsite/taskInfo/getProjectStage`,
    method: "get",
    params: data,
  });
}
//项目登记信息查询
export function api_projectInfoQuery(data) {
  return request({
    url: `/csportalsite/snapshot/project/info`,
    method: "get",
    params: data,
  });
}
//获取项目实施方案列表
export function getDoneList(data) {
  return request({
    url: `/csportalsite/checkTemplManage/queryPageListTempl`,
    method: "post",
    data,
  });
}

// 任务通过
export function api_taskPass(data) {
  return request({
    url: `/csportalsite/taskInfo/taskPass`,
    method: "get",
    params: data,
  });
}
// 任务驳回
export function api_taskRejected(data) {
  return request({
    url: `/csportalsite/taskInfo/taskRejected`,
    method: "post",
    data,
  });
}
// 评价查询
export function api_listEvalue(data) {
  return request({
    url: `/csportalsite/taskEvaluate/listEvalue`,
    method: "get",
    params: data,
  });
}
// 评价提交
export function api_saveEvaluate(data) {
  return request({
    url: `/csportalsite/taskEvaluate/saveEvaluate`,
    method: "post",
    data,
  });
}
// 查询项目成员
export function api_members(data) {
  return request({
    url: `/csportalsite/projectImplementatio/members/without/third`,
    method: "get",
    params: data,
  });
}
// 获取项目的基本信息
export function api_projectInfo(data){
  return request({
    url:`/csportalsite/projectStageManage/selectObject`,
    method:'post',
    data
  })
}
// 查询里程碑下所有交付物文件信息
export function api_fileInfo(data){
  return request ({
    url:`/csportalsite/api/file/deliInfo`,
    method:'get',
    params:data
  })
}
// 提交留言接口
export function api_saveTaskReply(data){
  return request ({
    url:`/csportalsite/taskReply/saveTaskReply`,
    method:'post',
    data
  })
}
export function getWithOutTask(data) {
  return request({
    url: `/csportalsite/taskInfo/getWithOutTask`,
    method: "get",
    params:data
  });
}
// 项目登记信息查询
export function getinfo(data) {
  return request({
    url: `/csportalsite/projectImplementatio/register/query`,
    method: "get",
    data,
  });
}
// 上传交付物  更新版本
export function api_updateVersion(data){
  return request({
    url:`/csportalsite/yearplanproject/version`,
    method:'get',
    params:data
  })
}
// 删除交付物下面的某个文件
export function api_deleteFile(data){
  return request({
    url:`/csportalsite/yearplanproject/deleteByFileNo`,
    method:'get',
    params:data
  })
}
// 删除整个交付物接口
export function api_deleteJFW(data){
  return request({
    url:`/csportalsite/deliverables/deleteById`,
    method:'get',
    params:data
  })
}
// 在交付物文件详情下查询文件审批的详情
export function api_fileDetail(data){
  return request({
    url:`/csportalsite/api/file/fileReview`,
    method:'get',
    params:data
  })
}
// 任务留痕轨迹接口
export function api_saveProcess(data){
  return request({
    url:'/csportalsite/taskInfo/saveProcess',
    method:'post',
    data
  })
}