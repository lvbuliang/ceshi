const isDev = process.env.NODE_ENV === 'development' // 是否本地开发环境
// let baseUrl = isDev ? 'https://jfzgdev.jiefanghao.com' : location.protocol + '//' + location.host
// let baseUrl = isDev ? 'https://jfzgcsdev.jiefanghao.com' : location.protocol + '//' + location.host
// let baseUrl = isDev ? 'http://192.168.1.2:9805' : location.protocol + '//' + location.host
let baseUrl = isDev
  ? 'http://172.20.19.160:81'
  : location.protocol + '//' + location.host
// let baseUrl = isDev ? 'https://jfzgys.jiefanghao.com' : location.protocol + '//' + location.host
// let baseUrl = isDev ? 'https://qxys.jiefanghao.com' : location.protocol + '//' + location.host

// const imgBaseUrl = baseUrl + "/jfzg/file/api/file/downlaodDocToPDF?key="
const imgBaseUrl = baseUrl + '/api/file/downlaodDocToPDF?key='
const imgStaticUrl = baseUrl + '/statics/workbench/'
const uploadBaseUrl = baseUrl
const uploadFileUrl = baseUrl + '/jfzg/file/api/file/uploadFile'
const previewUrl = baseUrl + '/jfzg/file/api/file/download'
const SETTING = {
  tokenKey: 'token',
  baseUrl: baseUrl,
}

module.exports = {
  title: '',
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
  sidebarLogo: false,
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  baseUrl: baseUrl,
  imgBaseUrl: imgBaseUrl,
  imgStaticUrl,
  uploadBaseUrl,
  SETTING,
  uploadFileUrl,
  previewUrl,
  timout: 10000, // 接口超时时间
  deTime: 1000,
}
