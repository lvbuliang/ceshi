import request from "@/utils/request";
import axios from "@/utils/axios";
const URL = '/jfzg/projectDecl/projectStudy'
/*
 * 可研
 */
// 列表
export function api_ky_queryList(data) {
    return request({
        url: `${URL}/queryList`,
        method: 'post',
        data
    })
}

// 保存 || 编辑
export function api_ky_saveOrUpdate(data) {
    return request({
        url: `${URL}/saveOrUpdate`,
        method: 'post',
        data
    })
}
// 无loading表单新增保存
export function api_ky_saveOrUpdate_noLoading(data) {
    return axios({
        url: `${URL}/saveOrUpdate`,
        method: 'post',
        data
    })
}

// 删除
export function api_ky_delete(data) {
    return request({
        url: `${URL}/delete`,
        method: 'post',
        data
    })
}

// 详情
export function api_ky_info(params) {
    return request({
        url: `${URL}/info`,
        method: 'get',
        params
    })
}

// 根据项目id查询可研信息
export function api_ky_getByProjectId(params) {
    return request({
        url: `${URL}/getByProjectId`,
        method: 'get',
        params
    })
}

// 流程
export function api_ky_startWorkFlow(data) {
    return request({
        url: `${URL}/startWorkFlow`,
        method: 'post',
        data
    })
}

// 获取概算id集合
export function api_ky_queryIdList(params) {
    return request({
        url: `${URL}/queryIdList`,
        method: 'get',
        params
    })
}

/*
 节约化比对
 https://wiki.jointforce.com/pages/viewpage.action?pageId=148281741
*/

// 可研集约化比对当前项目详情
export function api_projectStudy_detail(params) {
    return request({
        url: `/jfzg/projectDecl/api/IntensiveComparison/projectStudy/detail`,
        method: 'get',
        params
    })
}

// 可研集约化比对列表
export function api_projectStudy_list(data) {
    return request({
        url: `/jfzg/projectDecl/api/IntensiveComparison/projectStudy/list`,
        method: 'post',
        data
    })
}
//可研归档
export function api_fileAway(data) {
    return request({
        url: `/jfzg/projectDecl/projectStudy/fileAway`,
        method: 'post',
        data
    })
  }