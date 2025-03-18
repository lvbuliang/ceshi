import request from "@/utils/request";
const URL = '/jfzg'
// 轨迹留痕
export function getList(params) {
    return request({
        url: `/jfzg/commonapi/processLog/getList`,
        method: 'get',
        params
    })
}


//流程图
export function srtraceTrackImage(params) {
    return request({
        url: `${URL}/commonapi/activity/image`,
        method: 'get',
        params
    })
}

//悬浮留痕轨迹
export function api_workFlowGetList(params) {
    return request({
        url: `${URL}/commonapi/processLog/getListForHistory`,
        method: 'get',
        params
    })
}