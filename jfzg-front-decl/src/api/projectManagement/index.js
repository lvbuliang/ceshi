import request from "@/utils/request";
// 立项管理列表查询
export function getProjectManagementList(data) {
  return request({
    url: `/jfzg/projectlibrary/ProjectInitiationManage/Manage/queryLiprojectList`,
    method: "post",
    data,
  });
}
// 项目立项查看接口
export function getSeePorManagment(data) {
  return request({
    url: `/jfzg/projectlibrary/ProjectInitiationManage/Manage/view`,
    method: "post",
    data,
  });
}