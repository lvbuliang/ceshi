import axios from 'axios'
import config from '@/setting.js'
import Vue from 'vue'


// create an axios instance
const service = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: config.timout, // request timeout
  headers: {
    'cache-contral': 'no-cache',
    'Pragma': 'no-cache'
  }
})
const V = new Vue()

service.defaults.withCredentials = true

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let token = 'Basic d2ViQXBwOiQyYSQxMCRzd2FxSWNrNmJKYmI4bVdERVUydFl1dkQwU0hQNjFYS0sud0x0M2lHTTRaT0RLZnhmMWIwbQ==';
    if (token) {
      //给请求头添加token
      config.headers['Authorization'] = token
      // config.headers['X-Token'] = getToken()
    }
    config.headers["x-source-header"] = "pc";
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config
  },
  error => {
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
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res && res.code !== '0000') {
      //错误信息情况
      V.$message({
        message: res.message || '请求错误',
        type: 'error',
        duration: 5 * 1000
      })
      return res
    } else {
      res.success = res.code === '0000'
      return res
    }
  },
  ({response}) => {
    if(response.data.message == '服务内部错误') {
      return Promise.reject(response.data)
    }else{
      V.$message({
        message: (response && response.data && response.data.message) ? response.data.message : '请求错误',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(response.data)
    }
  }
)

export default service
