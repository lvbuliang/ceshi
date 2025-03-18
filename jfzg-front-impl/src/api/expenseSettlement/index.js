import request from "@/utils/request";
//专家费用列表
export function getList(data) {
    return request({
        url: '/jfzg/projectImpl/expertFee/queryTotalPage',
        method: 'post',
        data
    })
}

// 查询专家个人年月费用列表
export function queryYearMonthListApi(params) {
    return request({
        url: '/jfzg/projectImpl/expertFee/queryYearMonthList',
        method: 'get',
        params
    })
}
// 查询专家费用详细分页
export function queryDetail(data) {
    return request({
        url: '/jfzg/projectImpl/expertFee/queryDetail',
        method: 'post',
        data
    })
}
