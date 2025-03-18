import request from "@/utils/request";
import axios from "@/utils/axios";
// 提交项目备案
export function submitBeian(data) {
    return request({
        url: `/jfzg/projectDecl/projectRecord/save`,
        method: 'post',
        data
    })
  }

// 保存、编辑项目备案
export function saveBeian(data) {
    return axios({
        url: `/jfzg/projectDecl/projectRecord/updateProjectRecordInfo`,
        method: 'post',
        data
    })
  }
// 获取备案列表
export function queryBeianList(data) {
    return request({
        url: `/jfzg/projectDecl/projectRecord/list`,
        method: 'post',
        data
    })
  }
// 获取备案详情
export function queryBeianDetail(params) {
    return request({
        url: `/jfzg/projectDecl/projectRecord/detail`,
        method: 'get',
        params
    })
  }
// 删除备案
export function deleteBeian(params) {
    return request({
        url: `/jfzg/projectDecl/projectRecord/deleteProjectRecordById`,
        method: 'get',
        params
    })
  }
  // 获取所有承建单位
  export function getChengjianUnit(data) {
    return request({
        url: `/jfzg/ucenter/bizUnit/queryBizunitsByProperty`,
        method: 'post',
        data
    })
  }
    // 附件归档
    export function api_fileAway(data) {
      return request({
          url: `/jfzg/projectDecl/projectRecord/fileAway`,
          method: 'post',
          data
      })
    }

  