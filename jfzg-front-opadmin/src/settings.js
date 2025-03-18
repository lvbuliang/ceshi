const isDev = process.env.NODE_ENV === 'development' // 是否本地开发环境
// let baseUrl = isDev ? 'https://jfzgdev.jiefanghao.com' : window.location.protocol + '//' + window.location.host
// let baseUrl = isDev ? 'https://jfzgcsdev.jiefanghao.com' : location.protocol + '//' + location.host

// let baseUrl = isDev ? 'http://192.168.1.2:9805' : location.protocol + '//' + location.host

let baseUrl = isDev
  ? 'http://172.20.19.160:81'
  : location.protocol + '//' + location.host
// let baseUrl=window.location.protocol + '//' + window.location.hostname +':'+ window.location.port

// let baseUrl = isDev ? 'http://192.168.1.3:2750' : location.protocol + '//' + location.host

const imgBaseUrl = baseUrl + '/csportalsite/api/file/docapi/view?fileId='
const uploadBaseUrl = baseUrl
module.exports = {
  title: '豫信河南项目管理系统',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  baseUrl: baseUrl,
  imgBaseUrl: imgBaseUrl,
  uploadBaseUrl: uploadBaseUrl,
  tokenKey: 'token',
}
