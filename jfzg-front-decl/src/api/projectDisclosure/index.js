
import request from "@/utils/request";
// 列表查询
export function api_queryProjectDisclosure(data) {
  return request({
    url: `/jfzg/projectlibrary/projectDisclode/list`,
    method: "post",
    data,
  });
}

// 详情
export function api_getDetail(params) {
  return request({
    url: `/jfzg/projectlibrary/projectDisclode/detail`,
    method: "get",
    params,
  });
}
// 新增、编辑、保存
export function api_saveOrUpdate(data) {
  return request({
    url: `/jfzg/projectlibrary/projectDisclode/saveOrUpdate`,
    method: "post",
    data,
  });
}

// 查看意见
export function api_queryOpinion(data) {
  return request({
    url: `/jfzg/projectlibrary/projectDisclode/audit/common/queryOpinion`,
    method: "post",
    data,
  });
}

// 根据code查询角色
export function getUserByRoleCode(data) {
  return request({
    url: `/jfzg/opcenter/getUserByRoleCode?roleCode=${data.roleCode}`,
    method: "post",
    data,
  });
}


// 撤回
export function api_before_thxg(param) {
  return request({
    url: `/jfzg/projectlibrary/projectDisclode/audit/withdraw?processId=${param.processId}`,
    method: "get",
  });
}