import request from "@/utils/request";
const PROJECTENDLIST = '/jfzg/projectlibrary/ProjectFinalInspectionManage/queryList'
const PROJECTENDVIEWLIST = '/jfzg/projectlibrary/ProjectFinalInspectionManage/detailById'
const SAVEPROEND = '/jfzg/projectlibrary/ProjectFinalInspectionManage/saveOrUpdate'
const SUBMITPROEND = '/jfzg/projectlibrary/ProjectFinalInspectionManage/cjdwTj'
// 获取列表
export function api_getList(data) {
    return request({
        url: `${PROJECTENDLIST}`,
        method: 'post',
        data
    })
}
// 终验查看
export function api_getViewList(params) {
    return request({
        url: `${PROJECTENDVIEWLIST}`,
        method: 'get',
        params
    })
}
// 终验申请保存
export function api_saveProjectEnd(data) {
    return request({
        url: `${SAVEPROEND}`,
        method: 'post',
        data
    })
}
// 终验申请提交
export function api_submitProjectEnd(data) {
    return request({
        url: `${SUBMITPROEND}`,
        method: 'post',
        data
    })
}