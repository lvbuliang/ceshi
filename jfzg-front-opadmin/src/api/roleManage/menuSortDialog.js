import request from "@/utils/request";
const URL = "/jfzg/opcenter";

//新增修改角色
export function getListByRoleId(data) {
  return request({
    url: `${URL}/permission/op/queryTopMenusByRoleId`,
    method: "post",
    data
  });
}

//单位类型下拉
export function updateRoleTopMenuSort(data) {
  return request({
    url: `${URL}/permission/op/updateRoleTopMenuSort`,
    method: "post",
    data
  });
}
