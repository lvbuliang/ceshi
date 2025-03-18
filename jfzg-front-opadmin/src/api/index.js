
import request from "@/utils/request"
const URL = '/jfzg/opcenter/'

// 新增模版
export function saveTemplate(data) {
    return request({
        url: `${URL}customFormTemplate/save`,
        method: 'post',
        data
    })
}

// 导入文件更新关联表单数据
export function importModuleTableTemplate(data) {
    return request({
        url: `${URL}moduleTable/importModuleTableTemplate`,
        method: 'post',
        data
    })
}

// 编辑更新关联表单数据
export function updateModuleTableTemplate(data) {
    return request({
        url: `${URL}moduleTable/update`,
        method: 'post',
        data
    })
}

// 获取模版列表
export function listCustomFormTemplate(params) {
    return request({
        url: `${URL}customFormTemplate/listCustomFormTemplate`,
        method: 'get',
        params
    })
}

// 表头接口
export function api_userSetQuery(params) {
    return request({
      url: `/jfzg/commonapi/api/userSet/query`,
      method: 'get',
      params,
    })
  }

  // 表头保存
export function api_userSetSave(data) {
    return request({
      url: `/jfzg/commonapi/api/userSet/save`,
      method: 'post',
      data,
    })
  }

// 获取对应模块字典表
export function listModuleTableByModuleCode(params) {
    return request({
        url: `${URL}moduleTable/listModuleTableByModuleCode`,
        method: 'get',
        params
    })
}

// 获取模块
export function listModule(params) {
    return request({
        url: `${URL}jfZgModule/listModule`,
        method: 'get',
        params
    })
}

// 获取自定义表单
export function getCustomFormTemplate(params) {
    return request({
        url: `${URL}customFormTemplate/getCustomFormTemplate`,
        method: 'get',
        params
    })
}

// 设置启用
export function updateDefaultTemplate(data) {
    return request({
        url: `${URL}customFormTemplate/updateDefaultTemplate`,
        method: 'post',
        data
    })
}
// 获取单位编码
export function getunitcode() {
    return request({
        url: `/jfzg/ucenter/bizUnit/getunitcode`,
        method: 'get',
    })
}
// 校验单位编码是否重复
export function checkunitcode(data) {
    return request({
        url: `/jfzg/ucenter/bizUnit/checkunitcode?orgcode=${data}`,
        method: 'get'
    })
}