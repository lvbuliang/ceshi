import request from "@/utils/request";


// 项目列表
export function getProject(params) {
  return request({
    url: `/jfzg/projectImpl/projectProcessTrack/listProcessTrack`,
    method: "get",
    params,
  });
}

// 项目 建设中 已完成数量
export function countProcessTrack(params) {
  return request({
    url: `/jfzg/projectImpl/projectProcessTrack/countProcessTrack`,
    method: "get",
    params,
  });
}
// 获取详情
export function getContractAmountByProjectId(params) {
  return request({
      url: `/jfzg/projectImpl/projectContract/getContractAmountByProjectId`,
      method: 'get',
      params
  })
}
// 项目基本信息
export function getInfoProject(params) {
  return request({
    url: `/jfzg/projectImpl/projectProcessTrack/getProjectHeadInfo`,
    method: "get",
    params,
  });
}

// 根据项目ID查询里程碑
export function getProjectTrackMileStone(params) {
  return request({
    url: `/jfzg/projectImpl/projectProcessTrack/getProjectTrackMileStone`,
    method: "get",
    params,
  });
}

// 根据项目ID和里程碑Id查询交付物
export function getProjectTrackDeliveryAll(params) {
  return request({
    url: `/jfzg/projectImpl/projectProcessTrack/getProjectTrackDeliveryAll`,
    method: "get",
    params,
  });
}

// 根据项目ID和里程碑Id查询任务
export function getProjectTrackTaskAll(params) {
  return request({
    url: `/jfzg/projectImpl/projectProcessTrack/getProjectTrackTaskAll`,
    method: "get",
    params,
  });
}	

// 根据项目ID和里程碑Id查询风险问题 processType=1风险 processType=2 问题
export function getProjectTrackProblemAll(params) {
  return request({
    url: `/jfzg/projectImpl/projectProcessTrack/getProjectTrackProblemAll`,
    method: "get",
    params,
  });
}	

