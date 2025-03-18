import request from "@/utils/request";
// 列表查询
export function api_queryProjectStart(data) {
  return request({
    url: `/jfzg/projectlibrary/projectStart/list`,
    method: "post",
    data,
  });
}

// 详情
export function api_getDetail(params) {
  return request({
    url: `/jfzg/projectlibrary/projectStart/detail`,
    method: "get",
    params,
  });
}

// 新增、编辑、保存
export function api_saveOrUpdate(data) {
  return request({
    url: `/jfzg/projectlibrary/projectStart/saveOrUpdate`,
    method: "post",
    data,
  });
}

// 开启项目启动
export function api_projectStart(data) {
  return request({
    url: `/jfzg/projectlibrary/projectStart/startProject`,
    method: "post",
    data,
  });
}

// 查看意见
export function api_queryOpinion(params) {
  return request({
    url: `/jfzg/projectlibrary/projectStart/common/queryOpinion`,
    method: "get",
    params,
  });
}
