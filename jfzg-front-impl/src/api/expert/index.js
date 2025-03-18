import request from "@/utils/request";

//新增修改
export function subAndSave(data) {
    return request({
        url: 'jfzg/projectImpl/api/expert/save',
        method: 'post',
        data
    })
}
//列表
export function getList(data) {
    return request({
        url: 'jfzg/projectImpl/api/expert/query',
        method: 'post',
        data
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

// 表头保存
export function api_userSetSave(data) {
    return request({
        url: `/jfzg/commonapi/api/userSet/save`,
        method: 'post',
        data
    })
}

// 详情
export function detail(params) {
    return request({
        url: `/jfzg/projectImpl/api/expert/detail`,
        method: 'get',
        params
    })
}

// 删除
export function queryDelete(params) {
    return request({
        url: `/jfzg/projectImpl/api/expert/delete`,
        method: 'get',
        params
    })
}

// 查询专家请假列表接口
export function expertLeaveList(data) {
    return request({
        url: 'jfzg/projectImpl/api/expertLeave/list',
        method: 'post',
        data
    })
}

// 新增专家请假接口
export function expertLeaveSave(data) {
    return request({
        url: 'jfzg/projectImpl/api/expertLeave/save',
        method: 'post',
        data
    })
}

// 获取专家请假详情接口
export function expertLeaveDetail(params) {
    return request({
        url: `jfzg/projectImpl/api/expertLeave/detail`,
        method: 'get',
        params
    })
}

// 停用启用
export function stopAndStar(params) {
    return request({
        url: `/jfzg/projectImpl/api/expert/stop`,
        method: 'get',
        params
    })
}
// 获取职称级别列表
export function getProfessionalLevel(params) {
    return request({
        url: `/jfzg/projectImpl/api/professionalLevel/getList`,
        method: 'get',
        params
    })
}

