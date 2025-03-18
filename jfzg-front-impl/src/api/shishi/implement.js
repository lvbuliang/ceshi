import request from "@/utils/request";

//获取项目实施方案列表
export function getDoneList(data) {
  return request({
    url: `/csportalsite/projectImplementatio/scheme/register/list`,
    method: "get",
    params: data,
  });
}

//获取项目实施方案列表--当前成员
export function getmemberList(data) {
  return request({
    url: `/csportalsite/projectImplementatio/members`,
    method: "get",
    params: data,
  });
}
//获取项目实施方案列表--当前里程碑
export function getstageList(data) {
  return request({
    url: `/csportalsite/projectImplementatio/stage/list`,
    method: "get",
    params: data,
  });
}
//获取项目实施方案列表--设置当前里程碑
export function setstageList(data) {
  return request({
    url: `/csportalsite/projectImplementatio/stage/set`,
    method: "post",
    data,
  });
}
//获取项目实施方案列表--删除当前里程碑
export function deletestageList(data) {
  return request({
    url: `/csportalsite/projectImplementatio/stage/delete/` + data,
    method: "post",
  });
}

//获取项目实施方案列表--当前交付物
export function getdeliveryList(data) {
  return request({
    url: `/csportalsite/projectImplementatio/delivery/list`,
    method: "get",
    params: data,
  });
}
//获取项目实施方案列表--当前交付物
export function setdeliveryList(data) {
  return request({
    url: `/csportalsite/projectImplementatio/delivery/set`,
    method: "post",
    data,
  });
}

// 模板列表接口
export function getmobanlistAjax(data) {
  return request({
    url: `/csportalsite/checkTemplManage/queryPageListTempl`,
    method: "post",
    data,
  });
}

// 模板的里程碑列表接口
export function getmobanLCBAjax(data) {
  return request({
    url: `/csportalsite/templStageConfig/queryListTemplStageConfig`,
    method: "post",
    data,
  });
}
// 项目登记信息查询
export function getinfo(params) {
  return request({
    url: `/csportalsite/projectImplementatio/register/query`,
    method: "get",
    params,
  });
}

// 模板的交付物列表接口
export function getqueryListTemplStageDeliver(data) {
  return request({
    url: `/csportalsite/templStageDeliver/queryListTemplStageDeliver`,
    method: "post",
    data,
  });
}

// 项目信息列表
export function getbaseInfo(params) {
  return request({
    url: `/csportalsite/yearplanproject/yearPlanImplementationInfo`,
    method: "get",
    params,
  });
}
// 企业角色查询
export function getbuRoles(data) {
  return request({
    url: `/csportalsite/csapi/bu/buRoles`,
    method: "get",
    params: data,
  });
}
// 发起项目实施编制
export function projectsubmit(data) {
  return request({
    url: `/csportalsite/projectAudit/supplyer/submit`,
    method: "post",
    data,
  });
}
// 发起一致性检查
export function yizhixingnosubmit(data) {
  return request({
    url: `/csportalsite/projectAudit/supervisor/reject`,
    method: "post",
    data,
  });
}
export function yizhixingpasssubmit(data) {
  return request({
    url: `/csportalsite/projectAudit/supervisor/pass`,
    method: "post",
    data,
  });
}
// 建设单位驳回
export function buildRejectAjax(data) {
  return request({
    url: `/csportalsite/projectAudit/build/reject`,
    method: "post",
    data,
  });
}
// 建设单位通过
export function buildPassAjax(data) {
  return request({
    url: `/csportalsite/projectAudit/build/pass`,
    method: "post",
    data,
  });
}

// 查询承建单位附件
export function getsupplyerInfo(data) {
  return request({
    url: `/csportalsite/projectAudit/supplyer/files`,
    method: "get",
    params: data,
  });
}

// 查询建设单位领导审核意见和附件
export function getLDInfo(params) {
  return request({
    url: `/csportalsite/projectAudit/build/leader/opinionAndFiles`,
    method: "get",
    params,
  });
}
// 查询监理单位审核意见和附件
export function getsupervisorInfo(params) {
  return request({
    url: `/csportalsite/projectAudit/supervisor/opinionAndFiles`,
    method: "get",
    params,
  });
}
// 查询建设单位审核意见和附件
export function getbuildInfo(data) {
  return request({
    url: `/csportalsite/projectAudit/build/opinionAndFiles`,
    method: "get",
    params: data,
  });
}
// 建设单位通过
export function getworkorder(data) {
  return request({
    url: `/csportalsite/workOrder/queryBySourceTypeAndId`,
    method: "post",
    data,
  });
}

// 部门领导通过
export function ldpasssubmit(data) {
  return request({
    url: `/csportalsite/projectAudit/build/leader/pass`,
    method: "post",
    data,
  });
}

// 部门领导驳回
export function ldbohuisubmit(data) {
  return request({
    url: `/csportalsite/projectAudit/build/leader/reject`,
    method: "post",
    data,
  });
}

// 删除所有里程碑，在进行模板覆盖的时候
export function deleteAllStage(data) {
  return request({
    url: "/csportalsite/projectImplementatio/stage/delete/byproject/" + data,
    method: "post",
  });
}

export function SendInvitation(data) {
  return request({
    url: "/csportalsite/invite/member",
    method: "post",
    data,
  });
}
//成员邀请
export function SendInvitation2(data) {
  return request({
    url: "/csportalsite/projectImplementatio/invite/member",
    method: "post",
    data,
  });
}

//成员邀请
export function getprocess(data) {
  return request({
    url: "/csportalsite/projectImplementatio/processNodes",
    method: "get",
    params: data,
  });
}


