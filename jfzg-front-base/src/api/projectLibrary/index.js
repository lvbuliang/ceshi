import request from "@/utils/request";
const URL = '/jfzg'

// 项目库列表
export function getQueryList(params) {
    return request({
        url: `/jfzg/projectlibrary/project/queryList`,
        method: 'get',
        params
    })
}
// 获取项目列（不在各业务中）
export function api_queryProjectNotInIds(params) {
    return request({
        url: `/jfzg/projectlibrary/project/queryProjectNotInIds`,
        method: 'get',
        params
    })
}
//项目库新增
export function querySave(data) {
    return request({
        url: `/jfzg/projectlibrary/project/save`,
        method: 'post',
        data
    })
}
//项目库修改
export function queryUpdate(data) {
    return request({
        url: `/jfzg/projectlibrary/project/update`,
        method: 'post',
        data
    })
}
//项目库删除
export function queryRemove(data) {
    return request({
        url: `/jfzg/projectlibrary/project/remove`,
        method: 'post',
        data
    })
}
//项目库获取详情
export function getDetailById(params) {
    return request({
        url: `/jfzg/projectlibrary/project/getDetailById`,
        method: 'get',
        params
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

// 查询子项目是否存在
export function api_queryChildExist(params) {
    return request({
        url: `${URL}/queryChildExist`,
        method: 'get',
        params
    })
}