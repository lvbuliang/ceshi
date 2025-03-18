import request from "@/utils/request";
import qs from "qs";

//查询可选任务下拉框
export function getCommonSource(params) {
  return request({
    url: `/jfzg/pm-plan/key/task/third/plan/list/task/source/with/planIds`,
    method: "get",
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { indices: false });
    },
  });
}
//查询所有任务
export function getCommonAllTask(params) {
  return request({
    url: `/jfzg/pm-plan/key/task/third/plan/list/task/with/parentId/keyword/with/planIds`,
    method: "get",
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { indices: false });
    },
  });
}
// 根据已选的项目id的list，返回tree的数据
export function getCommonIds(data) {
  return request({
    url: `/jfzg/pm-plan/key/task/third/plan/list/task/with/checked/ids/with/planIds`,
    method: "post",
    data,
  });
}
// 根据已选的项目id的list，返回tree的数据(新)
export function getCommonplanName(data, type = 1) {
  return request({
    url: `/jfzg/pm-plan/key/task/third/listPlanInfosByKeyTakIds?type=${type}`,
    method: "post",
    data,
  });
}