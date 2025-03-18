import request from "@/utils/request";

//mzg + 多规合一
 // 项目信息列表
export function getduoguiheyi(data) {
  return request({
    url: `/csportalsite/projectImplementatio/smart/info/${data}`,
    method: "get",
  });
}

/**
 *
 * 项目信息列表
 */


 // 项目内新增 拉取中长期项目
export function getZCQList(data) {
  return request({
    url: `/csportalsite/yuhua/project/recordForYH/queryProjectList`,
    method: "post",
    data,
  });
}

 // 项目内新增 拉取中长期项目
 export function getYearList() {
  return request({
    url: `/csportalsite/yuhua/project/recordForYH/pullList`,
    method: "post",
  });
}


 // 通过父项目Id查询子项目list
export function getSonPro(data) {
  return request({
    url: `/csportalsite/projectImplementatio/sub/simple/info`,
    method: "get",
    params:data,
  });
}


 // 新版父子项目-项目信息列表
export function newList(data) {
  return request({
    url: `/csportalsite/projectImplementatio/registered/list`,
    method: "get",
    params:data,
  });
}

 // 新长沙项目外进行项目信息登记
export function ProjectOutSumbit(data) {
  return request({
    url: `/csportalsite/projectImplementatio/outside/master/register/submit`,
    method: "post",
    data,
  });
}
 // 新长沙项目外进行子项目信息登记
export function ProjectSonSumbit(data) {
  return request({
    url: `/csportalsite/projectImplementatio/sub/register/submit`,
    method: "post",
    data,
  });
}
 // 新长沙项目内进行项目信息登记
export function ProjectInSumbit(data) {
  return request({
    url: `/csportalsite/projectImplementatio/inside/master/register/submit`,
    method: "post",
    data,
  });
}




 // 登记信息提交
export function messageSumbit(data) {
  return request({
    url: `/csportalsite/projectImplementatio/register/submit`,
    method: "post",
    data,
  });
}

// 项目登记信息查询
export function queryMessageSave(params) {
  return request({
    url: `/csportalsite/projectImplementatio/register/query`,
    method: "get",
    params,
  });
}

// 项目基本信息查询
export function queryBasicMessage(params) {
  return request({
    url: `/csportalsite/yearplanproject/yearPlanImplementationInfo`,
    method: "get",
    params,
  });
}

// 流程审核人查询
export function getDictcode(params) {
  return request({
    url: `/csportalsite/open/queryListDictcode`,
    method: "get",
    params,
  });
}

// 企业角色查询
export function getRoleUsers(params) {
  return request({
    url: `/csportalsite/csapi/bu/roleUsers`,
    method: "get",
    params,
  });
}

// 企业角色查询(新接口)
export function getRoleJBR(params) {
  return request({
    url: `/csportalsite/csapi/bu/roleJBR`,
    method: "get",
    params,
  });
} 

// 企业信息查询
export function getInfo(params) {
  return request({
    url: `/csportalsite/csapi/bu/info`,
    method: "get",
    params,
  });
}

// 合同分类查询
export function getQueryListInfo(params) {
  return request({
    url: `/csportalsite//open/queryListDictcode`,
    method: "get",
    params,
  });
}

 // 项目信息登记列表页接口--长沙
 export function getMessageList(data) {
  return request({
    url: `/csportalsite/yearplanproject/yearPlanImplementationList`,
    method: "get",
    params:data,
  });
}

 //  项目信息登记第一步列表页接口 --雨花
 export function getYhMessageList(data) {
  return request({
    url: `/csportalsite/yuhua/yearplanproject/yearPlanImplementationList`,
    method: "get",
    params:data,
  });
}
// 项目信息登记第二步列表页接口 --雨花
export function getYhMessageListSec(data) {
  return request({
    url: `/csportalsite/projectImplementatio/project/scheme/list`,
    method: "get",
    params:data,
  });
}


 // 新雨花-项目信息登记第一步
export function submit_yh_dengji(data) {
  return request({
    url: `/csportalsite/projectImplementatio/project/info/submit`,
    method: "post",
    data,
  });
}
// 新雨花-项目信息登记第二步
export function submit_yh_shezhi(data) {
  return request({
    url: `/csportalsite/projectImplementatio/project/scheme/set/submit`,
    method: "post",
    data,
  });
}

// 新雨花-项目信息登记第一步信息查询
export function queryMessageSave_first(params) {
  return request({
    url: `/csportalsite/projectImplementatio/project/info/submitted/${params}`,
    method: "get",
  });
}
// 新雨花-项目信息登记第er步信息查询
export function queryMessageSave_sec(params) {
  return request({
    url: `/csportalsite/projectImplementatio/project/scheme/info/${params}`,
    method: "get",
  });
}


 // 新雨花-查询项目信息登记第一步
export function get_yh_dengji(params) {
  return request({
    url: `/csportalsite/projectImplementatio/project/info/submitted`,
    method: "get",
    params,
  });
}

 // 新雨花-根据企业名称查询企业ID
 export function getYHrole(params) {
  return request({
    url: `/csportalsite/csapi/bu/infoByName`,
    method: "get",
    params,
  });
}
