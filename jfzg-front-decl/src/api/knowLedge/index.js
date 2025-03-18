import request from "@/utils/request";
// 列表查询
export function api_query_knowLedge(data) {
  return request({
    url: `/jfzg/projectlibrary/projectKnowledgeBase/queryIndexV2`,
    method: "post",
    data,
  });
}

// 新增保存 /jfzg/projectlibrary/projectKnowledgeBase/addProjectKnowledge

export function api_add_knowLedge(data) {
  return request({
    url: `/jfzg/projectlibrary/projectKnowledgeBase/addOrUpdateProjectKnowledgeV2`,
    method: "post",
    data,
  });
}

// 查询roleCode /jfzg/opcenter/buRole/getRoleCodeAndNames 
export function api_query_getRoleCodeAndNames(params) {
    return request({
      url: `/jfzg/opcenter/buRole/getRoleCodeAndNames`,
      method: "get",
      params,
    });
  }

  // 删除 /jfzg/projectlibrary/projectKnowledgeBase/deleteKnowledgeById
  export function api_delete_getRoleCodeAndNames(params) {
    return request({
      url: `/jfzg/projectlibrary/projectKnowledgeBase/deleteKnowledgeById?id=${params.id}`,
      method: "post",
    });
  }

  // 查询详情 /jfzg/projectlibrary/projectKnowledgeBase/getKnowledgeDetailById
  export function api_detail_getRoleCodeAndNames(params) {
    return request({
      url: `/jfzg/projectlibrary/projectKnowledgeBase/getKnowledgeDetailById?id=${params.id}`,
      method: "post",
    });
  }

// 撤回 /jfzg/gateway/jfzg/projectlibrary/projectKnowledgeBase/withdraw
export function api_withdraw_knowLedge(data) {
  return request({
    url: `/jfzg/projectlibrary/projectKnowledgeBase/withdraw`,
    method: "post",
    data,
  });
}