import request from "@/utils/request";
import axios from "@/utils/axios";
// 提交上云
export function submitShangyun(data) {
  return request({
    url: `/jfzg/projectDecl/projectRecord/save`,
    method: "post",
    data,
  });
}

// 新增修改上云
export function saveShangyun(data) {
  return request({
    url: `/jfzg/projectImpl/projectUpCloud/saveOrUpdate`,
    method: "post",
    data,
  });
}

export function saveShangyun_noloading(data) {
  return axios({
    url: `/jfzg/projectImpl/projectUpCloud/saveOrUpdate`,
    method: "post",
    data,
  });
}

// 获取上云列表
export function queryShangyunList(data) {
  return request({
    url: `/jfzg/projectImpl/projectUpCloud/list`,
    method: "post",
    data,
  });
}
// 获取上云详情
export function queryShangyunDetail(params) {
  return request({
    url: `/jfzg/projectImpl/projectUpCloud/getDetailById`,
    method: "get",
    params,
  });
}
// 删除上云
export function deleteShangyun(params) {
  return request({
    url: `/jfzg/projectImpl/projectUpCloud/delete`,
    method: "get",
    params,
  });
}
// 获取所有承建单位
export function getChengjianUnit(data) {
  return request({
    url: `/jfzg/ucenter/bizUnit/queryBizunitsByProperty`,
    method: "post",
    data,
  });
}
// 附件归档
export function api_fileAway(data) {
  return request({
    url: `/jfzg/projectImpl/projectUpCloud/fileAway`,
    method: "post",
    data,
  });
}
