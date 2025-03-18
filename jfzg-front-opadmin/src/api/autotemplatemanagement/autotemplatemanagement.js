import request from '@/utils/request'
const URL = 'jfzg/opcenter'

//获取tagCode
export function getTagCode(params) {
  return request({
    url: `${URL}/template/getTagList`,
    method: 'get',
    params
  })
}
//新增待办模板
export function addTodoTemplate(data) {
  return request({
    url: `${URL}/template/addSchduleTemplate`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}
// 绑定角色的待办标签
export function bindTodoLabel(data) {
  return request({
    url: `${URL}/template/addTemplateRole`,
    method: 'post',
    data
  })
}

// 新增待办标签
export function addTodoLabel(data) {
  return request({
    url: `${URL}/template/addTag`,
    method: 'post',
    data
  })
}
// 编辑待办标签
export function editTodoLabel(data) {
  return request({
    url: `${URL}/template/updateTag`,
    method: 'post',
    data
  })
}

// 获取所有code
export function getRoleList(data) {
  return request({
    url: `/jfzg/ucenter/buRole/queryAllBuRoles`,
    method: 'post',
    data
  })
}
// 获取待办模板列表
export function getTodoList(params) {
  return request({
    url: `${URL}/template/getTemplateList`,
    method: 'get',
    params
  })
}
// 编辑待办模板
export function editTodoTemplate(data) {
  return request({
    url: `${URL}/template/updateSchduleTemplate`,
    method: 'post',
    data, headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}
// ---------------------------------代办标签
// 代办标签列表
export function todoLabelList(params) {
  return request({
    url: `${URL}/template/getTagPageList`,
    method: 'get',
    params
  })
}
// 删除 deletaLabel
export function deletaLabel(params) {
  return request({
    url: `${URL}/template/deleteTag`,
    method: 'get',
    params
  })
}
// ----------------------------------消息模板
// 新增消息模板
export function addMessageTemplate(data) {
  return request({
    url: `${URL}/template/message/addTemplate`,
    method: 'post',
    data
  })
}
// 编辑消息模板
export function editMessageTemplate(data) {
  return request({
    url: `${URL}/template/message/updateTemplate`,
    method: 'post',
    data
  })
}
// 删除消息模板
export function deleteMessageTemplate(params) {
  return request({
    url: `${URL}/template/message/deleteTemplate`,
    method: 'get',
    params
  })
}
// 消息模板详情
export function messageTemplateDetail(data) {
  return request({
    url: `${URL}/template/message/getTemplateMessageDetail`,
    method: 'post',
    data
  })
}
// 消息模板列表
export function messageTemplateList(params) {
  return request({
    url: `${URL}/template/message/getTemplateMessageList`,
    method: 'get',
    params
  })
}
// 竣工验收金额配置
export function projectMoneyConfig(data) {
  return request({
    url: `${URL}/projectAmount/save`,
    method: 'post',
    data
  })
}

//获取op后台竣工验收金额
export function api_getAmount(params) {
  return request({
    url: `jfzg/opcenter/projectAmount/getAmount`,
    method: "get",
    params,
  });
}