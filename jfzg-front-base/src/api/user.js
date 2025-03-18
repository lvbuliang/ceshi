import request from "@/utils/request";
import loginRequest from "@/utils/loginRequest";
import Qs from 'qs';
import axios from "@/utils/axios.js"

// 获取用户信息
export function api_getUserByToken(data) {
  return request({
    url: '/jfzg/ucenter/users/getUserByToken',
    method: 'post',
    data
  })
}

// export function api_getUserByToken(params) {
//   return request({
//     url: '/jfzg/opcenter/customFormTemplate/getCustomFormTemplate?moduleCode=1',
//     method: 'get',
//     params
//   })
// }

// 获取菜单权限
export function api_getUserPermissionByToken(data) {
  return request({
    url: '/jfzg/ucenter/users/getUserPermissionByToken',
    method: 'post',
    data
  })
}

// 登录接口
export function api_login(data) {
  return loginRequest({
    url: '/jfzg/uaa/oauth/token',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function api_loginFullname(data, url) {
  return loginRequest({
    url: `${url}/jfzg/uaa/oauth/token`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
// 切换角色
export function api_changeRole(data) {
  return request({
    url: '/jfzg/ucenter/users/changeUserBizunitAndRole',
    method: 'post',
    data
  })
}

export function getUserDraftBox(data, url) {
  return axios({
    url: '/jfzg/commonapi/api/draftBox/getUserDraftBox',
    method: 'get',
    data
  })
}

// 消息列表
export function api_getMessageList() {
  return new Promise((resolve) => {
    let subApps = {
      "pageNum": 1,
      "pageSize": 5,
      "size": 5,
      "startRow": 1,
      "endRow": 5,
      "total": 143,
      "pages": 29,
      "list": [
        {
          "id": 76255,
          "messageContent": "「2021-06-10」「0407-test04」中「发送到发斯蒂芬」已关闭。",
          "buildName": "长沙市数据资源管理局",
          "creatorName": "应推经办人1",
          "createTime": "2021-06-10 20:43:42"
        },
        {
          "id": 76007,
          "messageContent": "「规划发展处李国雄」确认了「0408-test01会议」",
          "buildName": "长沙市数据资源管理局",
          "creatorName": "李国雄",
          "createTime": "2021-06-09 19:47:52"
        },
        {
          "id": 75943,
          "messageContent": "「规划发展处李国雄」确认了「0408-test01会议」",
          "buildName": "长沙市数据资源管理局",
          "creatorName": "李国雄",
          "createTime": "2021-06-09 16:46:46"
        },
        {
          "id": 75889,
          "messageContent": "「规划发展处李国雄」确认了「0408-test01会议」",
          "buildName": "长沙市数据资源管理局",
          "creatorName": "李国雄",
          "createTime": "2021-06-08 20:54:41"
        },
        {
          "id": 75836,
          "messageContent": "「规划发展处李国雄」确认了「2021年6月3日16:15:57会议」",
          "buildName": "长沙市数据资源管理局",
          "creatorName": "李国雄",
          "createTime": "2021-06-08 15:06:08"
        }
      ],
      "prePage": 0,
      "nextPage": 2,
      "isFirstPage": true,
      "isLastPage": false,
      "hasPreviousPage": false,
      "hasNextPage": true,
      "navigatePages": 8,
      "navigatepageNums": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "navigateFirstPage": 1,
      "navigateLastPage": 8,
      "firstPage": 1,
      "lastPage": 8
    }
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS"
      },
      data: subApps
    })
  })
}

// 获取信息数量
export function api_queryMessageNumber() {
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: "0000",
        message: "SUCCESS"
      },
      data: {
        "unreadNumber": 122,
        "readedNumber": 21
      }
    })
  })
}

// 获取用户默认首页
export function getDefaultMenuByToken(data) {
  return request({
    url: '/jfzg/ucenter/users/getDefaultMenuByToken',
    method: 'post',
    data
  })
}
// 统一认证登录
export function api_oauthToken(data, url) {
  return loginRequest({
    url: `${url}/jfzg/uaa/oauth/token`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* export function api_loginOut() {
  return request({
    url: `/jfzg/ucenter/thirApi/apiLoginOut`,
    method: 'get',
  })
} */
export function api_removeToken(access_token) {
  return request({
    url: `/jfzg/uaa/oauth/remove/token?token=${access_token}`,
    method: 'get',
  })
}

// 单点登录-测试
export function getTokenByCode(params) {
  return request({
    url: `/jfzg/ucenter/OAuthClient/getTokenByCode?code=${params.code}`,
    method: 'post'
  })
}
export function codeLogin(data) {
  return request({
    url: `/jfzg/ucenter/OAuthClient/codeLogin?token=${data}`,
    method: 'post',
  })
}
