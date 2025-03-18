const isDev = process.env.NODE_ENV === 'development' // 是否本地开发环境

// let baseUrl = isDev ? 'https://jfzgdev.jiefanghao.com' : location.protocol + '//' + location.host
// let baseUrl = isDev ? 'https://jfzgcsdev.jiefanghao.com' : location.protocol + '//' + location.host
// let baseUrl = isDev ? 'http://192.168.1.2:9805' : location.protocol + '//' + location.host
let baseUrl = isDev
  ? 'http://172.20.19.160:81'
  : location.protocol + '//' + location.host
// let baseUrl = isDev ? 'https://jfzgys.jiefanghao.com' : location.protocol + '//' + location.host
// let baseUrl = isDev ? 'https://qxys.jiefanghao.com' : location.protocol + '//' + location.host

/**
 * @author weilan
 * @time 2020.05.19
 * @description 项目配置项
 */

const SETTING = {
  timout: 10000, // 接口超时时间
  tokenKey: 'token',
  baseUrl,
  imgBaseUrl: baseUrl + '/jfzg/file/api/file/downlaodDocToPDF?key=',
  // imgBaseUrl: baseUrl + "/api/file/downlaodDocToPDF?key="
}

export default SETTING
