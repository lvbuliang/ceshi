import request from "@/utils/request";
// 获取项目台账列表数据
export function queryProjectLists(data) {
  return request({
    url: `/jfzg/projectlibrary/ledger/pageList`,
    method: "POST",
    data,
  });
}
// 项目台账导出
// export function exportByIds(data) {
//   return request({
//     url: `/jfzg/projectlibrary/JHXMK/project/exportByIds`,
//     method: "post",
//     data,
//     responseType: "blob",
//   });
// }
export function exportByIds(data) {
  return request({
    url: `/jfzg/projectlibrary/ledger/exportByName`,
    method: "post",
    data,
    responseType: "blob",
  });
}
