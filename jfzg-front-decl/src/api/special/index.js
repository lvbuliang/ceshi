import request from "@/utils/request";


//表单新增保存
export function api_globalPlanSave(data, id) {
    if (id) {
        return request({
            url: `/jfzg/pm-plan/api/globalPlan/save?id=${id}`,
            method: 'post',
            data
        })
    } else {
        return request({
            url: '/jfzg/pm-plan/api/globalPlan/save',
            method: 'post',
            data
        })
    }

}

// 总体规划列表
export function api_globalPlanList(params) {
    return request({
        url: `/jfzg/pm-plan/api/globalPlan/list`,
        method: 'get',
        params
    })
  }
  

  // 规划详情
export function api_globalPlanDetail(params) {
    return request({
      url: `/jfzg/pm-plan/api/globalPlan/detail`,
      method: 'get',
      params
    })
  }