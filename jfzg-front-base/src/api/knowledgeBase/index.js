import request from "@/utils/request";

export function querylist(data) {
  return request({
    url: `/jfzg/commonapi/api/knowledgeSearch/query`,
    method: "post",
    data,
  });
}

export function queryById(params) {
  return request({
    url: `/jfzg/commonapi/api/knowledgeSerrch/queryById`,
    method: "get",
    params,
  });
}

