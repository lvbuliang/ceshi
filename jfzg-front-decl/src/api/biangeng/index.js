import request from "@/utils/request";
import axios from "@/utils/axios"
const URL = '/jfzg/projectImpl/changeProject'
// 获取列表
export function api_getList(data) {
    return request({
        url: `${URL}/list`,
        method: 'post',
        data
    })
}

// 获取详情
export function api_getbiangengDetailById(params) {
    return request({
        url: `${URL}/detail`,
        method: 'get',
        params
    })
}
// 获取详情
export function getContractAmountByProjectId(params) {
    return request({
        url: `/jfzg/projectImpl/projectContract/getContractAmountByProjectId`,
        method: 'get',
        params
    })
}

// 新增修改
export function api_saveNew(data) {
    return request({
        url: `${URL}/save`,
        method: 'post',
        data
    })
}

// 导出
export function api_export(params) {
    return request({
        url: `${URL}/export`,
        method: 'post',
        params
    })
}

// 删除
export function api_delete(params) {
    return request({
        url: `${URL}/delete`,
        method: 'get',
        params
    })
}

// 自动保存接口
export function api_draft(data) {
    return axios({
        url: `${URL}/draft`,
        method: 'post',
        data
    })
}

// 获取所有单位
export function getChengjianUnit(data) {
    return request({
        url: `/jfzg/ucenter/bizUnit/queryBizunitsByProperty`,
        method: 'post',
        data
    })
}

// 获取所有单位ren
export function getUnitMembers(data) {
    return request({
        url: `/jfzg/ucenter/unit/member/front/queryUnitMembersByParams`,
        method: 'post',
        data
    })
}

// 获取所有单位ren
export function getProjectlist(data) {
    return request({
        url: `jfzg/projectImpl/changeProject/projectlist`,
        method: 'post',
        data
    })
}
// 附件停止上传
export function api_fileAway(data) {
    return request({
        url: `/jfzg/projectImpl/changeProject/fileAway`,
        method: 'post',
        data
    })
}

// 服务类型,目标标签下拉框,结论下拉框
export function api_getServiceTypeList(params) {
    return request({
        url: `jfzg/commonapi/dict/listByTopicAndItem`,
        method: "get",
        params,
    });
}

// 获取主合同信息
export function getMainContractAmountByProjectId(params) {
    return request({
        url: `/jfzg/projectImpl/projectContract/getMainContractAmountByProjectId`,
        method: 'get',
        params
    })
}