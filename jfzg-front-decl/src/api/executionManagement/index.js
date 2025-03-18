import request from "@/utils/request";
import axios from "axios";
// 获取执行管理list
export function queryExecutionLists(params) {
  return request({
    url: `/jfzg/projectlibrary/execution/queryExecutionListsV2`,
    method: "get",
    params,
  });
}
// 执行管理list  编辑
export function updateConstruction(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateConstruction`,
    method: "post",
    data,
  });
}
// 执行管理list  查看
// export function viewGantt(data) {
//   return request({
//     url: `/jfzg/projectlibrary/execution/ganttChartDataList`,
//     method: "post",
//     data
//     // params: {
//     //   projectId: data.projectId,
//     //   contractId:data.contractId
//     // },
//   });
// }
export function viewGantt(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/queryStageAndSubTaskList`,
    method: "post",
    data,
    // params: {
    //   projectId: data.projectId,
    //   contractId:data.contractId
    // },
  });
}
// 执行管理list  查看时间
export function viewGanttTime(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/GanttTime`,
    method: "post",
    params: {
      projectId: data,
    },
  });
}
// 阶段导出接口
export function exportGanttApi(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/exportGantt`,
    method: "post",
    data,
    responseType: "blob",
  });
}
// 阶段导入接口
export function importManagementApi(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/importGantt`,
    method: "post",
    data,
  });
}
// 项目阶段列表
export function queryStageList(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/queryStageList`,
    method: "post",
    data,
  });
}
// 项目阶段进度
export function updateStageProgress(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateStageProgress`,
    method: "post",
    data,
  });
}
// 项目阶段编辑
export function updateStageName(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateStageName`,
    method: "post",
    data,
  });
}

//  /jfzg/gateway/jfzg/projectlibrary/execution/updateStageDisplaySort
export function newupdateStageName(data) {
  return request({
    url: "/jfzg/projectlibrary/execution/updateStageDisplaySort",
    method: "post",
    data,
  });
}

// 项目阶段删除
export function removeStageById(params) {
  return request({
    url: `/jfzg/projectlibrary/execution/removeStageById`,
    method: "post",
    params,
  });
}
// 项目任务列表
export function queryTaskList(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/queryTaskList`,
    method: "post",
    data,
  });
}
// 项目任务编辑
export function updateTaskName(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateTaskName`,
    method: "post",
    data,
  });
}
// 项目任务删除
export function removeTaskById(params) {
  return request({
    url: `/jfzg/projectlibrary/execution/removeTaskById`,
    method: "post",
    params,
  });
}
// 项目任务进度
export function updateTaskProgress(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateTaskProgress`,
    method: "post",
    data,
  });
}
// 子任务列表
export function querySubTaskList(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/querySubTaskList`,
    method: "post",
    data,
  });
}
// 子任务添加
export function updateSubTaskName(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateSubTaskName`,
    method: "post",
    data,
  });
}
// 子任务删除
export function removeSubTaskById(params) {
  return request({
    url: `/jfzg/projectlibrary/execution/removeSubTaskById`,
    method: "post",
    params,
  });
}
// 子任务计划填报
export function updateSubTaskPlan(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateSubTaskPlan`,
    method: "post",
    data,
  });
}
// 子任务进度
export function updateSubTaskProgress(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateSubTaskProgress`,
    method: "post",
    data,
  });
}
// 执行管理交付物
export function queryDeliveryList(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/queryDeliveryList`,
    method: "post",
    data,
  });
}
// 交付物保存
export function updateDeliveryInfo(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateDeliveryInfo`,
    method: "post",
    data,
  });
}

// 轨迹留痕
export function getList(params) {
  return request({
    url: `/jfzg/commonapi/processLog/getList`,
    method: "get",
    params,
  });
}

//流程图
export function srtraceTrackImage(params) {
  return request({
    url: `/jfzg/commonapi/activity/image`,
    method: "get",
    params,
  });
}

//悬浮留痕轨迹
export function api_workFlowGetList(params) {
  return request({
    url: `/jfzg/commonapi/processLog/getListForHistory`,
    method: "get",
    params,
  });
}

// 工作流查询按钮接口
export function api_activititodo(params) {
  return request({
    url: `/jfzg/commonapi/activity/user/todo`,
    method: "get",
    params,
  });
}

//工作流按钮点击接口
export function api_afferentUrlOfPost(url, data) {
  return request({
    url: url,
    method: "post",
    data,
  });
}

//工作流按钮点击接口
export function api_afferentUrlOfGet(url, params) {
  return request({
    url: url,
    method: "get",
    params,
  });
}
// 获取项目详情信息
// /jfzg/gateway
export function executionManagementDetail(data) {
  return request({
    url: `/jfzg/projectlibrary/projectExecutionManagement/detail`,
    method: "POST",
    data: data,
  });
}

// /jfzg/gateway
export function api_startStageUrlOfPost(data) {
  return request({
    url: "/jfzg/projectlibrary/projectExecutionManagement/startStage",
    method: "post",
    data,
  });
}

//

export function api_approveOfPost(data) {
  return request({
    url: "/jfzg/projectlibrary/projectExecutionManagement/comfirm/approve",
    method: "post",
    data,
  });
}

// 留痕

export function getListleaveTrace(data) {
  return request({
    url: `/jfzg/commonapi/processLog/getProjectExecutionHistory?busId=${data.busId}`,
    method: "get",
  });
}

// 新

// /jfzg/gateway/jfzg/projectlibrary/execution/queryStageAndSubTaskList

export function newqueryTaskList(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/queryStageAndSubTaskList`,
    method: "post",
    data,
  });
}

// 子任务添加新

export function newupdateSubTaskName(data) {
  return request({
    url: `/jfzg/projectlibrary/execution/updateOrAddTask`,
    method: "post",
    data,
  });
}
// /jfzg/gateway/jfzg/projectlibrary/execution/updateOrAddTask

// /jfzg/gateway/jfzg/projectlibrary/execution/deleteDeliveryById
// 交付物删除
export function newDeleteSubTaskName(params) {
  return request({
    url: `/jfzg/projectlibrary/execution/deleteDeliveryById`,
    method: "get",
    params,
  });
}
