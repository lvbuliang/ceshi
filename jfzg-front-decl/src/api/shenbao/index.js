import request from "@/utils/request";
import axios from "@/utils/axios";

// 计划外项目申报--列表接口
export function api_getlist(data) {
    return request({
        url: `/jfzg/projectDecl/api/plan/unplanned/projectDeclare/list`,
        method: 'post',
        data
    })
}
// 计划内项目申报--列表接口
export function api_getlist_in(data) {
    return request({
        url: `/jfzg/projectDecl/api/plan/wthin/projectDeclare/list`,
        method: 'post',
        data
    })
}
// 计划内项目申报--查询年度计划
export function get_year_plan() {
  return request({
      url: `/jfzg/projectDecl/yearPlan/getPublishedYearPlan`,
      method: 'get',
  })
}



  // 计划外项目申报--列表接口
export function api_getlist_add(data) {
    return request({
        url: `/jfzg/projectDecl/api/plan/unplanned/projectDeclare/save`,
        method: 'post',
        data
    })
  }

  // 计划内项目申报--列表接口
  export function api_getlist_in_add(data) {
    if(data.isDelete){
        return axios({
          url: `/jfzg/projectDecl/api/plan/wthin/projectDeclare/save`,
          method: 'post',
          data
      })
    }else{
        return request({
          url: `/jfzg/projectDecl/api/plan/wthin/projectDeclare/save`,
          method: 'post',
          data
      })
    }
    
  }
  // 计划内项目申报--列表接口
  export function api_getlist_add_linshi(data) {
    return axios({
        url: `/jfzg/projectDecl/api/plan/unplanned/projectDeclare/draft`,
        method: 'post',
        data
    })
  }
  


  // 计划外项目申报--详情接口
  export function api_getlist_view(params) {
    return request({
        url: `/jfzg/projectDecl/api/plan/unplanned/projectDeclare/detail`,
        method: 'get',
        params
    })
  }

  // 计划内项目申报--详情接口
  export function api_getlist_in_view(params) {
    return request({
        url: `/jfzg/projectDecl/api/plan/wthin/projectDeclare/detail`,
        method: 'get',
        params
    })
  }
 
// 计划内项目申报--删除接口
export function api_getlist_in_delete(params) {
  return request({
      url: `/jfzg/projectDecl/api/plan/wthin/projectDeclare/delete?id=${params.id}`,
      method: 'get',
  })
}

// 计划 外项目申报--删除接口
export function api_getlist_delete(params) {
  return request({
      url: `/jfzg/projectDecl/api/plan/unplanned/projectDeclare/delete?id=${params.id}`,
      method: 'get',
  })
}
// 年度计划项目申报--归档
export function api_wthinFileAway(data) {
  return request({
      url: `jfzg/projectDecl/api/plan/wthin/projectDeclare/fileAway`,
      method: 'post',
      data
  })
}
// 计划外项目--归档
export function api_unplannedFileAway(data) {
  return request({
      url: `/jfzg/projectDecl/api/plan/unplanned/projectDeclare/fileAway`,
      method: 'post',
      data
  })
}
  
