import request from "@/utils/request";
// 立项管理保存接口
export function saveOrupdate(data) {
  return request({
    url: `/jfzg/projectlibrary/ProjectInitiationManage/Manage/saveOrupdate`,
    method: "post",
    data,
  });
}
// 发起立项提交接口
export function submitUpdate(data) {
  return request({
    url: `/jfzg/projectlibrary/ProjectInitiationManage/Manage/tj`,
    method: "post",
    data,
  });
}
// 发起立项提交保存接口
export function saveUpdate(data) {
  return request({
    url: `/jfzg/projectlibrary/ProjectInitiationManage/Manage/savelx`,
    method: "post",
    data,
  });
}
