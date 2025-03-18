import request from "@/utils/request";


//获取自定义表单（单个模板）
export function api_getCustomFormTemplate(params) {
  return request({
    url: '/customFormTemplate/getCustomFormTemplate',
    method: 'get',
    params
  })
}


//工作流按钮点击接口
export function api_workFlow(url,params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

