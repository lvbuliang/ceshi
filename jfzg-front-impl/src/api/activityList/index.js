import request from "@/utils/request";
import axios from "@/utils/axios";

//新增修改
export function subAndSave(data) {
    return request({
        url: 'jfzg/projectImpl/reviewActivities/saveOrUpdate',
        method: 'post',
        data
    })
}

//详情
export function detail(params) {
    return request({
        url: 'jfzg/projectImpl/reviewActivities/detail',
        method: 'get',
        params
    })
}

//列表
export function list(data) {
    return request({
        url: 'jfzg/projectImpl/reviewActivities/list',
        method: 'post',
        data
    })
}

//删除
export function del(params) {
    return request({
        url: 'jfzg/projectImpl/reviewActivities/delete',
        method: 'post',
        params
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
//抽取专家规避单位
export function getUnitName(params) {
    return request({
        url: `/jfzg/projectImpl/api/expert/unitName`,
        method: 'get',
        params
    })
}
//保存专家抽取规则
export function save(data) {
    return request({
        url: `/jfzg/projectImpl/api/expert/review/rule/save`,
        method: 'post',
        data
    })
}

//保存专家抽取规则
export function queryDetail(params) {
    return request({
        url: `/jfzg/projectImpl/api/expert/review/rule/query`,
        method: 'get',
        params
    })
}
//抽取专家规避专家查询接口
export function evadeExpert(data) {
    return request({
        url: `/jfzg/projectImpl/api/expert/evadeExpert`,
        method: 'post',
        data
    })
}
//抽取专家查看评审活动中的专家
export function queryByReviewId(params) {
    return request({
        url: `/jfzg/projectImpl/api/expertAspiration/queryByReviewId`,
        method: 'get',
        params
    })
}
//手动抽取专家列表接口
export function queryExtract(data) {
    return request({
        url: `/jfzg/projectImpl/api/expert/extract`,
        method: 'post',
        data
    })
}
//步骤2 保存抽取专家
export function expertAspirationSave(data) {
    return request({
        url: `/jfzg/projectImpl/api/expertAspiration/save`,
        method: 'post',
        data
    })
}

//抽取专家随机接口
export function autoExtract(params) {
    return request({
        url: `/jfzg/projectImpl/api/expert/autoExtract`,
        method: 'get',
        params
    })
}
//是否可以重新抽取接口 判断第三步是否可以返回上一步

export function queryIsVisible(params) {
    return request({
        url: `/jfzg/projectImpl/api/expertAspiration/isVisible`,
        method: 'get',
        params
    })
}

//是否可以重新抽取接口 判断第三步是否可以返回上一步

export function invite(data) {
    return request({
        url: `/jfzg/projectImpl/api/expertAspiration/invite`,
        method: 'post',
        data
    })
}

//第三步专家抽取确认按钮

export function confirm(params) {
    return request({
        url: `/jfzg/projectImpl/api/expertAspiration/confirm`,
        method: 'get',
        params
    })
}

//专家评审列表  experList

export function experList(data) {
    return request({
        url: `/jfzg/projectImpl/reviewActivities/experList`,
        method: 'post',
        data
    })
}

//专家确认拒绝 
export function updateStatus(data) {
    return request({
        url: `jfzg/projectImpl/api/expertAspiration/updateStatus`,
        method: 'post',
        data
    })
}
// 评价专家查询已抽取专家
export function queryByReviewIdNotGroups(params) {
    return request({
        url: `/jfzg/projectImpl/api/expertAspiration/queryByReviewIdNotGroup`,
        method: 'get',
        params
    })
}


// 评价专家打分
export function detailByReviewActivitiesId(params) {
    if (params.axious) {
        return axios({
            url: `/jfzg/projectImpl/expertEvaluation/detailByReviewActivitiesId`,
            method: 'get',
            params
        })
    } else {
        return request({
            url: `/jfzg/projectImpl/expertEvaluation/detailByReviewActivitiesId`,
            method: 'get',
            params
        })
    }

}

// 专家评价详情
export function queryCodeList(params) {
    return request({
        url: `/jfzg/commonapi/dict/queryCodeList`,
        method: 'get',
        params
    })
}
// 专家评价详情
export function toSave(data) {
    return request({
        url: `/jfzg/projectImpl/expertEvaluation/toSave`,
        method: 'post',
        data
    })
}
// 专家评价详情
export function toSave2(data) {
    return axios({
        url: `/jfzg/projectImpl/expertEvaluation/toSave`,
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
//项目库获取详情-----方案
export function getDetailById(params) {
    return request({
        url: `/jfzg/projectlibrary/project/getDetailById`,
        method: "get",
        params,
    });
}
// 项目库获取详情-----清单
export function getDetailByIdJ(params) {
    return request({
        url: `/jfzg/projectlibrary/JHXMK/project/getDetailById`,
        method: "get",
        params,
    });
}
// 保存专家分组
export function saveGroup(data) {
    return axios({
        url: `/jfzg/projectImpl/api/expert/saveGroup`,
        method: 'post',
        data
    })
}

// 获取专家分组信息列表
export function getGroupList(params) {
    return request({
        url: `/jfzg/projectImpl/api/expert/getGroupList`,
        method: "get",
        params,
    });
}
// 删除专家分组
export function deleteGroup(data) {
    return axios({
        url: `/jfzg/projectImpl/api/expert/deleteGroup`,
        method: 'post',
        data
    })
}

// 获取评审活动记录
export function getReviewRecord(params) {
    return request({
        url: `/jfzg/projectImpl/reviewActivities/getReviewRecord`,
        method: "get",
        params,
    });
}

// 保存专家分组详细
export function saveOrUpdateGroupDetail(data) {
    return axios({
        url: `/jfzg/projectImpl/api/expert/saveOrUpdateGroupDetail`,
        method: 'post',
        data
    })
}

// 根据年份查询当年已经有多少场评审活动
export function getReviewActivitiesCountOfYear(params) {
    return request({
        url: `/jfzg/projectImpl/reviewActivities/getReviewActivitiesCountOfYear`,
        method: "get",
        params,
    });
}
// 评审完成接口
export function complete(params) {
    return request({
        url: `/jfzg/projectImpl/api/expertAspiration/complete`,
        method: "get",
        params,
    });
}
