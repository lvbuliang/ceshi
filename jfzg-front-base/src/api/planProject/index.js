import request from "@/utils/request";
const URL = "/jfzg/projectlibrary/JHXMK/project";
const URL1 = "/jfzg/projectlibrary/project";
import qs from "qs";
// wiki: https://wiki.jointforce.com/pages/viewpage.action?pageId=148277254
//可研归档
export function api_fileAway(data) {
  return request({
    url: `/jfzg/projectDecl/projectStudy/fileAway`,
    method: "post",
    data,
  });
}
// 项目库列表
export function api_queryList(data) {
  return request({
    url: `${URL}/queryList`,
    method: "post",
    data,
  });
}
// 获取项目列（不在各业务中）
export function api_queryProjectNotInIds(params) {
  return request({
    url: `${URL1}/queryProjectNotInIds`,
    method: "get",
    params,
  });
}

// 计划项目库获取详情
export function getDetailById(params) {
  return request({
    url: `${URL}/getDetailById`,
    method: "get",
    params,
  });
}

// 查询子项目是否存在
export function api_queryChildExist(params) {
  return request({
    url: `${URL}/queryChildExist`,
    method: "get",
    params,
  });
}
// 获取年度计划下拉框
export function api_getyearPlanList(params) {
  return request({
    url: `jfzg/projectDecl/yearPlan/getYearPlanList`,
    method: "get",
    params,
  });
}
// 服务类型,目标标签下拉框,结论下拉框
export function api_getServiceTypeList(params) {
  return request({
    url: `jfzg/commonapi/dict/listByTopicAndItem`,
    method: "get",
    params,
  });
}
//计划项目库新增
export function querySave(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/save`,
    method: "post",
    data,
  });
}
//计划项目库修改
export function queryUpdate(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/update`,
    method: "post",
    data,
  });
}
//计划项目库删除
export function queryRemove(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/remove?id=${params.id}`,
    method: "post",
  });
}
// 获取项目编码
export function api_getLibraryNumber() {
  return request({
    url: `/jfzg/projectlibrary/project/getLibraryNumber`,
    method: "get",
  });
}
// 项目增加标签
export function addProjectTags(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/addProjectTags`,
    method: "post",
    data,
  });
}
// 查询项目标签
export function getProjectTags(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/getProjectTags?projectId=${data}`,
    method: "post",
    data,
  });
}
// 计划项目库 - 读取该流程节点下的项目的所有状态
export function getStatusListWithNodeInfo(params) {
  return request({
    url: `/jfzg/projectlibrary/open/api/getStatusListWithNodeInfo?node=${params}`,
    method: "get",
  });
}
// 计划项目库 - 读取该流程节点下所有项目所属的年度计划
export function getYearPlanListWithProjectInfo(params) {
  return request({
    url: `/jfzg/projectlibrary/open/api/getYearPlanListWithProjectInfo?status=${params}`,
    method: "get",
  });
}
// 计划项目库 - 读取该流程节点下所有的已申报项目的单位信息
export function getBuPropertyWithNodeInfo(params) {
  return request({
    url: `/jfzg/projectlibrary/open/api/getBuPropertyWithNodeInfo?node=${params}`,
    method: "get",
  });
}
// 计划项目库 - 查询可选专家列表
export function getOptionalApprovalExpertsWhenJhxmByProjectId(params) {
  return request({
    url: `/jfzg/projectlibrary/approval/expert/getOptionalApprovalExpertsWhenJhxmByProjectId?id=${params.id}`,
    method: "get",
  });
}
// 计划项目库 - 查询已选专家列表
export function getSelectedApprovalExpertsWhenJhxmByProjectId(params) {
  return request({
    url: `/jfzg/projectlibrary/approval/expert/getSelectedApprovalExpertsWhenJhxmByProjectId?id=${params.id}`,
    method: "get",
  });
}
// 批量分配审核小组
export function getPlfpshxz(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/tcdw/jbr/plfpshxz`,
    method: "post",
    data,
  });
}
// 分组初审意见查询已提交意见
export function getCx(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/shxz/jbr/cx?projectId=${params.id}`,
    method: "get",
  });
}
// 分组初审意见保存
export function getBc(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/shxz/jbr/bc`,
    method: "post",
    data,
  });
}
// 分组初审意见提交
export function getTj(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/shxz/jbr/tj`,
    method: "post",
    data,
  });
}
//分配列表
export function getBuBaseInfoByConditions(params) {
  return request({
    url: `/jfzg/ucenter/bu/getBuBaseInfoByConditions`,
    method: "post",
    params,
  });
}
// 专家技能详情
export function expertSkillDetail(params) {
  return request({
    url: `/jfzg/projectImpl/api/expert/detail`,
    method: "get",
    params,
  });
}
// 统筹单位经办人-获取审核小组的审核意见和结论
export function getAuditTeamOpinion(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/tcdw/jbr/getAuditTeamOpinion?projectId=${params.id}`,
    method: "get",
  });
}
// 专家-获取专家保存的意见和结论
export function getExpertopioinCx(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/zjhp/spzj/cx?projectId=${params.id}`,
    method: "get",
  });
}
// 导出
export function exprotByCondition(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/exprotByCondition`,
    method: "post",
    data,
    responseType: "blob",
  });
}

//抽取专家规避专家查询接口
export function evadeExpert(data) {
  return request({
    url: `/jfzg/projectImpl/api/expert/evadeExpert`,
    method: "post",
    data,
  });
}

// 查询专家列表
export function getExpert(data) {
  return request({
    url: `/jfzg/projectImpl/api/expert/query`,
    method: "post",
    data,
  });
}

// 根据项目id查询所属所有评审活动列表及抽选专家列表
export function getReviewAndProject(params) {
  return request({
    url: `/jfzg/projectImpl/reviewActivities/getReviewAndExpertListByProjectIdList`,
    method: "get",
    params,
    /*   paramsSerializer: (params) => {
        return qs.stringify(params, { indices: false });
      }, */
  });
}

// 保存评审会信息
export function saveOrUpdateConference(data) {
  return request({
    url: `/jfzg/projectImpl/reviewActivities/saveOrUpdateConference`,
    method: "post",
    data,
  });
}

// 保存评审活动
export function saveOrUpdateReviewActivities(data) {
  return request({
    url: "jfzg/projectImpl/reviewActivities/saveOrUpdate",
    method: "post",
    data,
  });
}

//保存专家抽取规则
export function save(data) {
  return request({
    url: `/jfzg/projectImpl/api/expert/review/rule/save`,
    method: "post",
    data,
  });
}
// 专家抽取
export function conferenceExtract(data) {
  return request({
    url: `/jfzg/projectImpl/api/expert/conferenceExtract`,
    method: "post",
    data,
  });
}

//保存专家抽取规则
export function queryDetail(params) {
  return request({
    url: `/jfzg/projectImpl/api/expert/review/rule/query`,
    method: "get",
    params,
  });
}
// 保存专家分组详细
export function saveOrUpdateGroupDetail(data, isSimple) {
  return request({
    url: `/jfzg/projectImpl/api/expert/saveOrUpdateGroupDetail`,
    method: "post",
    data,
    params: {
      isSimple: isSimple,
    },
  });
}

// 分组初审批量分配审核小组
export function batchAuditTeam(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/tcdw/jbr/fqpsh`,
    method: "post",
    data,
  });
}
// 保存抽取专家
export function expertAspirationSave(data) {
  return request({
    url: `/jfzg/projectImpl/api/expertAspiration/save`,
    method: "post",
    data,
  });
}

// 分组初审专家出具意见
export function firstTrialByExpert(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/pszj/tj `,
    method: "post",
    data,
  });
}

// 分组初审专家保存出具意见
export function saveFirstTrialByExpert(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/pszj/bc `,
    method: "post",
    data,
  });
}

// 分组初审评审专家查询已提交意见
export function getOpinionByExpert(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/pszj/cx`,
    method: "get",
    params,
  });
}
// 分组初审-统筹单位经办人-获取评审会意见和结论
export function getFirstTrialOpinion(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fzcs/tcdw/jbr/cxpshyj`,
    method: "get",
    params,
  });
}

// 批量分配联合会审发起评审会
export function batchAuditTeamAtJointTrial(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/lhhs/tcdw/jbr/fqpsh`,
    method: "post",
    data,
  });
}

// 批量分配专家会审发起评审会
export function batchAuditTeamAtExpertTrial(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/zjps/tcdw/jbr/fqpsh`,
    method: "post",
    data,
  });
}

// 联合会审-统筹单位经办人-获取评审会意见和结论
export function getJointTrialOpinion(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/lhhs/tcdw/jbr/cxpshyj`,
    method: "get",
    params,
  });
}
// 联合会审-审批专家-查询已提交意见
export function queryJointTrialExpertOpinion(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/lhhs/spzj/cx`,
    method: "get",
    params,
  });
}

// 专家函评-审批专家-查询已提交意见
export function queryExpertCommentaryOpinion(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/zjhp/spzj/cx`,
    method: "get",
    params,
  });
}
// 分组初审-统筹单位经办人-获取评审会意见和结论
export function getExpertCommentaryOpinion(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/zjhp/tcdw/jbr/cxpshyj`,
    method: "get",
    params,
  });
}
// 根据年份查询当年已经有多少场评审活动
export function getReviewActivitiesCountOfYear(params) {
  return request({
    url: `/jfzg/projectImpl/reviewActivities/getReviewActivitiesCountOfYear`,
    method: "get",
    params,
  });
}
// 获取所有可选
export function getBuAndUserInfoByBuPorperty(params) {
  return request({
    url: `/jfzg/opcenter/user/users/getBuAndUserInfoByBuPorperty?buPorperty=${params.buPorperty}`,
    method: "get",
  });
}
// 初审服务人员分配确定
export function api_fpshr(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fhxqzjc/tcdw/jbr/fpshr`,
    method: "post",
    data,
  });
}
// 协审人员-符合前置阶段-出具意见
// /jfzg/projectlibrary/JHXMK/audit/fhxqzjc/xsdw/jbr/tjyj
export function getTjyj(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fhxqzjc/xsdw/jbr/tjyj`,
    method: "post",
    data,
  });
}
// 符合性前置审查-分组初审-协审单位经办人（规划处经办人，审核小组）-查看协审单位提交意见
export function getCkxsyj(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/audit/fhxqzjc/all/ckxsyj?projectId=${params.projectId}`,
    method: "get",
  });
}

//抽取专家查看评审活动中的专家
export function queryByReviewId(params) {
  return request({
    url: `/jfzg/projectImpl/api/expertAspiration/queryByReviewId`,
    method: "get",
    params,
  });
}
//抽取专家随机接口
export function autoExtract(params) {
  return request({
    url: `/jfzg/projectImpl/api/expert/autoExtract`,
    method: "get",
    params,
  });
}
//手动抽取专家列表接口
export function queryExtract(data) {
  return request({
    url: `/jfzg/projectImpl/api/expert/extract`,
    method: "post",
    data,
  });
}
// 根据项目id和状态获取历史选取过的专家
export function getHistoricalExpert(data) {
  return request({
    url: `/jfzg/projectImpl/api/expert/getHistoricalExpert`,
    method: "post",
    data,
  });
}
// 获取项目详情基本信息
export function getProjectDetail(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/getDetailById`,
    method: "get",
    params,
  });
}
// 修改项目详情基本信息
export function UpdateProjectDetail(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/updateDetailInfo`,
    method: "post",
    data,
  });
}
// 里程碑节点信息
export function getMilestoneNode(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/queryStageList`,
    method: "get",
    params,
  });
}
// 项目交付物列表
export function getQueryDeliveryList(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/queryDeliveryList`,
    method: "get",
    params,
  });
}
// 补充信息列表
export function getQueryReplenishmentInfoList(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/queryReplenishmentInfoList`,
    method: "get",
    params,
  });
}
// 添加交付物
export function putAddDelivery(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/addDelivery`,
    method: "post",
    data,
  });
}
// 补充信息
export function updateInfo(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/updateInfo`,
    method: "post",
    data,
  });
}

// list 项目信息列表
export function getQueryProjectList(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/queryProjectLists`,
    method: "post",
    data,
  });
}
// list  项目信息页面报表
export function getStatement(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/getStatement`,
    method: "get",
    params,
  });
}
// list  关注
export function updateIsConcern(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/updateIsConcern`,
    method: "post",
    data,
  });
}
// list  删除
export function removeList(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/remove/project`,
    method: "get",
    params,
  });
}
// 成员管理添加
export function getQueryBizunitsByProperty(data) {
  return request({
    url: `/jfzg/ucenter/bizUnit/queryBizunitsByProperty`,
    method: "post",
    data,
  });
}
// 成员管理保存
export function updateMemberManagement(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/updateMemberManagement`,
    method: "post",
    data,
  });
}
// 交付物上传
export function uploadTemporarily(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/uploadTemporarily`,
    method: "post",
    data,
  });
}

// 通过节点id获取必填项
// 交付物保存
export function getIsUpload(data) {
  return request({
    url: `jfzg/projectlibrary/JHXMK/project/isUpload`,
    method: "get",
    params: {
      stageId: data,
    },
  });
}
// 交付物保存
export function updateDeliveryInfo(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/updateDeliveryInfo`,
    method: "post",
    data,
  });
}
// 项目列表导出
export function exportByIds(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/exportByIds`,
    method: "post",
    data,
    responseType: "blob",
  });
}
// 项目列表导入
// 导入
export function importProject(data) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/importProject`,
    method: "post",
    data,
  });
}
// 创建项目系统名称校验
export function repeatCheck(params) {
  return request({
    url: `/jfzg/projectlibrary/JHXMK/project/repeatCheck`,
    method: "get",
    params,
  });
}
// 根据recode  查询角色信息
export function getUserByRoleCode(params) {
  return request({
    url: `/jfzg/opcenter/getUserByRoleCode`,
    method: "post",
    params,
  });
}
// 维护节点编辑
export function updateDate(data) {
  return request({
    url: `/jfzg/projectlibrary/projectStage/updateDate`,
    method: "post",
    data,
  });
}
// 成员管理周报人获取
export function queryUsersByBuProperty(data) {
  return request({
    url: `/jfzg/ucenter/users/queryUsersByBuProperty`,
    method: "post",
    params: {
      buPropertys: data,
    },
  });
}
// 付款信息列表
export function getQueryList(params) {
  return request({
    url: `/jfzg/projectlibrary/projectPaymentInfo/queryList`,
    method: "get",
    params,
  });
}
// 付款信息弹框详情
export function queryDetailById(params) {
  return request({
    url: `/jfzg/projectlibrary/projectPaymentInfo/queryDetailById`,
    method: "get",
    params,
  });
}
// 删除付款信息当前行
export function delById(params) {
  return request({
    url: `/jfzg/projectlibrary/projectPaymentInfo/delById`,
    method: "get",
    params,
  });
}
// 付款信息修改
export function updatePaymentInfo(data) {
  return request({
    url: `/jfzg/projectlibrary/projectPaymentInfo/updatePaymentInfo`,
    method: "post",
    data,
  });
}
// 付款信息添加
export function savePaymentInfo(data) {
  return request({
    url: `/jfzg/projectlibrary/projectPaymentInfo/savePaymentInfo`,
    method: "post",
    data,
  });
}

// 获取问题风险数量
export function getDangerInfo(data) {
  return request({
    url: `/jfzg/projectImpl/project/riskAndProblem/queryProblemRiskCount`,
    method: "post",
    data,
  });
}
// 表头接口
export function api_userSetQuery(params) {
  return request({
    url: `/jfzg/commonapi/api/userSet/query`,
    method: "get",
    params,
  });
}

// 查询多标段情况下的标段数量
export function getSectionCount(param) {
  return request({
    url: `/jfzg/projectlibrary/projectProcurement/querySectionNum?projectId=${param.projectId}`,
    method: "get",
    param
  });
}
