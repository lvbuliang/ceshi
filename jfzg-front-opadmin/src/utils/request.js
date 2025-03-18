import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import {
  getStorageTokenType,
  clearStorageToken,
  getStorageToken,
} from '@/utils/user-vali'
import config from '@/settings.js'
// import { filterOutEmptyValue } from "./datasign"

// create an axios instance
const service = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
})
const isDev = process.env.NODE_ENV === 'development'
service.defaults.withCredentials = true

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (isDev) {
      // config.headers['Authorization'] = 'bearer 82808aad-dbee-45cc-8e4e-84c3764004c2'
      config.headers['Authorization'] =
        'bearer 9aa5669f-bb02-4bbf-856c-04694aee59f8'
    } else {
      let token = getStorageToken()
      if (token) {
        //给请求头添加token
        config.headers['Authorization'] = getStorageTokenType() + ' ' + token
      }
    }
    config.headers['x-source-header'] = 'pc'
    //过滤掉空的内容  null 、undefined、空字符串、空数组
    // if (config.method == 'post') {
    //   config.data = filterOutEmptyValue(config.data || {})
    // } else {
    //   config.params = filterOutEmptyValue(config.params || {})
    // }

    config.headers['X-Requested-With'] = 'XMLHttpRequest'

    // debugger

    return config
  },
  (error) => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.msg.code !== '0000') {
      //未登录状态码
      if (res.msg.code == '1005') {
        // let pageUrl = window.location.href;
        // let targetUrl = config.baseUrl + '/csportalsite/login?redirectUrl=' + encodeURIComponent(pageUrl)
        // window.location.replace(targetUrl)
        let pageUrl = config.baseUrl + '/login'
        window.location.replace(pageUrl)
      }
      //错误信息情况
      if (res.msg.code == '1001') {
        Message({
          message: res.msg.message || '请求错误',
          type: 'error',
          duration: 5 * 1000,
        })
        return res
      } else if (res.msg.code == '1004' || res.msg.code == '1003') {
        Message({
          message: res.msg.message || '请求错误',
          type: 'error',
          duration: 5 * 1000,
        })
        return res
      }
    } else {
      //正常情况
      res.success = res.msg.code === '0000'
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: '请求错误',
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
