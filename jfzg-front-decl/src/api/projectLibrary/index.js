import request from "@/utils/request";
const URL = '/jfzg/projectlibrary/project'
// wiki: https://wiki.jointforce.com/pages/viewpage.action?pageId=148277254
// 项目库列表
export function api_queryList(params) {
    return request({
        url: `${URL}/queryList`,
        method: 'get',
        params
    })
}
// 获取项目列（不在各业务中）
export function api_queryProjectNotInIds(params) {
    return request({
        url: `${URL}/queryProjectNotInIds`,
        method: 'get',
        params
    })
}

// 项目库获取详情
export function api_getDetailById(params) {
    return request({
        url: `${URL}/getDetailById`,
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
// 获取年度计划下拉框
export function api_getyearPlanList(params) {
    return request({
        url: `jfzg/projectDecl/yearPlan/getYearPlanList`,
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

// 获取项目编码
export function api_getLibraryNumber() {
    return request({
        url: `/jfzg/projectlibrary/project/getLibraryNumber`,
        method: 'get'
    })
}