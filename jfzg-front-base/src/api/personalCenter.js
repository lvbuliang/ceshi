import request from "@/utils/request";

//修改个人信息
export function api_updateUserInfoByJifd(data) {
  return request({
    url: `/jfzg/ucenter/users/updateUserInfoByJifd`,
    method: "post",
    data,
  });
}

//获取短信验证码
export function api_updatePwdMsg(data) {
  return request({
    url: `/jfzg/uaa/validata/smsCode/${data.mobile}`,
    method: "get",
    data,
  });
}
//修改密码
export function api_updateUserPass(data) {
  return request({
    url: `/jfzg/ucenter/users/updateUserPass`,
    method: "post",
    data,
  });
}
