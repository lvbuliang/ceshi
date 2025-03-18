import request from "@/utils/request";
export function getIdWork(params) {
  return request({
    url: `/jfzg/schedule/schduleNew/getDetailById?id=${params.id}`,
    method: "get"
  });
}
export function getIdDingWork(params) {
  return request({
    url: `/jfzg/schedule/schduleNew/getNewScheduleDetailById?id=${params.id}`,
    method: "get"
  });
}
