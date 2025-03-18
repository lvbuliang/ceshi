import request from "@/utils/request";

//工作流按钮点击接口
export function api_workFlow(url,params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

