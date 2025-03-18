import request from "@/utils/request";

//树添加
export function api_catalogueAdd(data) {
  return request({
    url: `/jfzg/commonapi/assets/catalogueAdd`,
    method: "post",
    data,
  });
}
//树列表查询
export function api_catalogueList(params) {
  return request({
    url: `/jfzg/commonapi/assets/catalogueList`,
    method: "get",
    params,
  });
}

//树列表删除
export function api_deleteCatalogue(params) {
  return request({
    url: `/jfzg/commonapi/assets/deleteCatalogue`,
    method: "get",
    params,
  });
}
//编辑资产
export function add_zichanCatalogueUpdate(data) {
  return request({
    url: '/jfzg/commonapi/assets/catalogueUpdate',
    method: 'post',
    data
  })
}