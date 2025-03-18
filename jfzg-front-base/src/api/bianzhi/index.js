import request from "@/utils/request";


// 项目列表页
export function technicalProposalListAjax(params) {
  return request({
    url: `/jfzg/projectImpl/technicalProposal/list/project`,
    method: "get",
    params,
  });
}

// 项目成员添加
export function addMembersAjax(data) {
  return request({
    url: `/jfzg/projectImpl/projectTaskMember/add`,
    method: "post",
    data,
  });
}



//根据buid和角色code查询前端查询企业成员列表

export function queryUnitMembersBy(data) {
  return request({
    url: '/jfzg/ucenter/unit/member/front/queryUnitMembersByParams',
    method: 'post',
    data
  })
}

//根据项目Id和单位类型查询前端成员列表

export function queryByUnitType(data) {
  return request({
    url: '/jfzg/projectImpl/projectTaskMember/queryByUnitType',
    method: 'post',
    data
  })
}

//项目库获取详情
export function getDetailById(params) {
  return request({
      url: `/jfzg/projectlibrary/project/getDetailById`,
      method: 'get',
      params
  })
}

//实施方案编制-查询里程碑列表
export function getlichengbeilist(params) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/list/stage/${params.projectId}`,
      method: 'get',
  })
}


// 项目成员添加
export function addlichengbeilist(data) {
  return request({
    url: `/jfzg/projectImpl/technicalProposal/save/stage`,
    method: "post",
    data,
  });
}

// 项目成员删除
export function removeMembersAjax(data) {
  return request({
    url: `/jfzg/projectImpl/projectTaskMember/delete`,
    method: "post",
    data,
  });
}

// 里程碑批量删除接口删除
export function removelcbAjax(data) {
  return request({
    url: `/jfzg/projectImpl/technicalProposal/delete/stage`,
    method: "post",
    data,
  });
}
//实施方案编制-查询交付物列表
export function getJFWlist(params) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/list/delivery/${params.projectId}`,
      method: 'get',
  })
}

//实施方案编制-查询交付物列表
export function saveJFWlist(data,projectId) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/save/delivery/${projectId}`,
      method: 'post',
      data
  })
}

//实施方案编制-查询任务列表
export function getRWlist(params) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/list/task/${params.projectId}`,
      method: 'get',
  })
}
//实施方案编制-查询登记信息和附件
export function getBianzhiFilelist(params) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/scheme/${params.projectId}`,
      method: 'get',
  })
}


//实施方案编制-新增任务
export function saveRWlist(data) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/add/task`,
      method: 'post',
      data
  })
}

//实施方案编制-修改任务
export function editRWlist(data) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/edit/task`,
      method: 'post',
      data
  })
}

//实施方案编制-修改任务
export function deleteRWlist(data) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/delete/task/${data.taskId}`,
      method: 'post',
  })
}


//实施方案编制-tijiao
export function saveBianzhi(data) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/save`,
      method: 'post',
      data
  })
}

//实施方案编制-tijiao
export function submitBianzhi(data) {
  return request({
      url: `/jfzg/projectImpl/technicalProposal/submit`,
      method: 'post',
      data
  })
}

//实施方案编制-撤回
export function submitChehui(data) {
  return request({
      url: `jfzg/projectImpl/XMFABZ/cjdw/ch/${data.projectId}`,
      method: 'post',
  })
}


//实施方案编制-//拉取模板
export function mobanList(params) {
  return request({
      url: `/jfzg/opcenter//checkTemplManage/listAll`,
      method: 'get',
      params
  })
}
//实施方案编制-//根据模板Id 拉取里程碑列表
export function mobanlcbList(params) {
  return request({
      url: `/jfzg/opcenter/templStageConfig/listByManageId/${params.id}`,
      method: 'get',
  })
}
//实施方案编制-//根据里程碑ID 拉取交付物列表
export function mobanJFWList(params) {
  return request({
      url: `/jfzg/opcenter/templStageDeliver/listByStageId/${params.id}`,
      method: 'get',
  })
}
//实施方案编制-//根据里程碑ID 拉取任务列表
export function mobantaskList(params) {
  return request({
      url: `/jfzg/opcenter/templStageTask/listByManageId/${params.id}`,
      method: 'get',
  })
}


