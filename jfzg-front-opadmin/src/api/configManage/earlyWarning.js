
import request from '@/utils/request'


// 获取模块列表
export function api_queryModulesList(param) {
  return request({
    url: `/jfzg/schedule/earlyWarningRule/queryTemplateCode`,
    method: 'get',
    param
  })
}

// 获取模块列表
export function api_queryWarningList(data) {
    return request({
      url: `/jfzg/schedule/earlyWarningRule/insertSchduleNew`,
      method: 'post',
      data
    })
  }

    // 新增
export function api_add(data) {
    return request({
      url: `/jfzg/schedule/earlyWarningRule/save`,
      method: 'post',
      data
    })
  }

  // 删除
export function api_delete(param) {
    return request({
      url: `/jfzg/schedule/earlyWarningRule/deleteById?id=${param.id}`,
      method: 'get',
      param
    })
  }

    // 修改
export function api_update(data) {
    return request({
      url: `/jfzg/schedule/earlyWarningRule/updateById`,
      method: 'post',
      data
    })
  }

    // 查看
export function api_preview(param) {
    return request({
      url: `/jfzg/schedule/earlyWarningRule/queryDetailById`,
      method: 'get',
      param
    })
  }
