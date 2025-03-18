import request from "@/utils/request";


//获取自定义表单（单个模板）
export function api_getCustomFormTemplate(params) {
  return request({
    url: '/jfzg/opcenter/customFormTemplate/getCustomFormTemplate',
    method: 'get',
    params
  })
}

//表单新增保存
export function api_getSpecialSave(data, id) {
  if (id) {
    return request({
      url: `/jfzg/pm-plan/api/special/save?id=${id}`,
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/jfzg/pm-plan/api/special/save',
      method: 'post',
      data
    })
  }

}

// 规划列表
export function api_specialList(params) {
  return request({
    url: `/jfzg/pm-plan/api/special/list`,
    method: 'get',
    params
  })
}

// 表头接口
export function api_userSetQuery(params) {
  return request({
    url: `/jfzg/commonapi/api/userSet/query`,
    method: 'get',
    params
  })
}


// 导出
export function api_userSetExport(params) {
  return request({
    url: `/jfzg/pm-plan/api/special/export`,
    method: 'get',
    params,
  })
}


// 表头保存
export function api_userSetSave(data) {
  return request({
    url: `/jfzg/commonapi/api/userSet/save`,
    method: 'post',
    data
  })
}

// 规划详情
export function api_specialDetail(params) {
  return request({
    url: `/jfzg/pm-plan/api/special/detail`,
    method: 'get',
    params
  })
}
//流程图
export function api_workFlowimage(params) {
  return request({
    url: '/jfzg/commonapi/activity/image',
    method: 'get',
    params
  })
}
//留痕轨迹
export function api_workFlowGetList(params) {
  return request({
    url: '/jfzg/commonapi/processLog/getListForHistory',
    method: 'get',
    params
  })
}
// 工作流查询按钮接口
export function api_activititodo(params) {
  return request({
    url: `/jfzg/commonapi/activity/user/todo`,
    method: 'get',
    params
  })
}

//工作流按钮点击接口
export function api_afferentUrlOfPost(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

//工作流按钮点击接口
export function api_afferentUrlOfGet(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

//获取承建单位
export function queryBizunitsByProperty(data) {
  return request({
    url: '/jfzg/ucenter/bizUnit/queryBizunitsByProperty',
    method: 'post',
    data
  })
}
//获取建设单位
export function queryBizunitsByProperties(data) {
  return request({
    url: '/jfzg/ucenter/bizUnit/queryBizunitsByProperties',
    method: 'post',
    data
  })
}
//根据buid和角色code查询前端查询企业成员列表

export function queryUnitMembersBy(data) {
  return request({
    url: '/jfzg/ucenter/unit/member/front/queryUnitMembersByParams',
    method: 'post',
    data
  })
}
// 字典表
export function listByTopicAndItem(params) {
  return request({
    url: `/jfzg/commonapi/dict/listByTopicAndItem`,
    method: 'get',
    params
  })
}
//获取项目库总体规划
export function queryAll(params) {
  return request({
    url: `/jfzg/pm-plan/api/globalPlan/queryAll`,
    method: 'get',
    params
  })
}

//根据企业code查询用户列表
export function api_queryUsersByBuUniqueCode(data) {
  return request({
    url: `/jfzg/ucenter/users/queryUsersByBuUniqueCode`,
    method: 'post',
    data
  })
}

// 专项发展规划删除
export function api_total_delete(data) {
  return request({
    url: `/jfzg/pm-plan/api/special/delete?id=${data.id}`,
    method: 'get',
  })
}

// 总体发展规划删除
export function api_spec_delete(data) {
  return request({
    url: `/jfzg/pm-plan/api/globalPlan/delete?id=${data.id}`,
    method: 'get',
  })
}

//获取省市
export function queryProvineCity(params) {
  return request({
    url: `/jfzg/commonapi/dict/queryLoc`,
    method: 'get',
    params
  })
}

//埋点接口
export function buriedPointSave(data) {
  return request({
    url: `/jfzg/commonapi/buriedPoint/save`,
    method: 'post',
    data,
  })
}
//文件新增
export function api_addFile(data) {
  return request({
    url: `/jfzg/commonapi/business/files/manage/add/file`,
    method: 'post',
    data
  })
}
//文件更新
export function api_updateFile(data) {
  return request({
    url: `/jfzg/commonapi/business/files/manage/update/file`,
    method: 'post',
    data
  })
}
//文件列表查询
export function api_listByInstanceId(data) {
  return request({
    url: `/jfzg/commonapi/business/files/manage/listByInstanceId/${data}`,
    method: 'get',
    data
  })
}
//文件列表删除
export function api_deleteItem(data) {
  return request({
    url: `/jfzg/commonapi/business/files/manage/deleteItem`,
    method: 'post',
    data
  })
}
// 项目库获取详情
export function api_getDetailById(params) {
  return request({
    url: `/jfzg/projectlibrary/project/getDetailById`,
    method: 'get',
    params
  })
}
// 提交申请验证交付物
export function api_checkFile(params) {
  return request({
    url: `/jfzg/projectImpl/delivery/check/file`,
    method: 'get',
    params
  })
}
