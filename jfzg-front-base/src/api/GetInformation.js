import axios from "@/utils/axios.js"

// 消息列表
export function api_getMessageList(data) {
  return axios({
    url: `/jfzg/schedule/message/queryPage`,
    method: "post",
    data,
  });
}
//消息设置已读
export function api_updateMessageReaded(data) {
  return axios({
    url: `/jfzg/schedule/message/updateMessageReaded`,
    method: "post",
    data,
  });
}
//获取  已读未读数量

export function api_queryCount(data) {
  return axios({
    url: `/jfzg/schedule/message/queryCount`,
    method: "post",
    data,
  });
}