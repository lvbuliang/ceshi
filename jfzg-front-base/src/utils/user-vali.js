/**
 * @author weilan
 * @time 2020.05.19
 * @description 用户身份校验
 */

// 导入核心库本地存储操作类
import { Storage } from "wl-core"
// 导入项目配置项
import SETTING from "@/setting"

/**
 * @name 浏览器本地存储是否有用户的登陆信息
 */
const setStorageToken = (val) => {
  Storage.set(SETTING.tokenKey, val, 'session')
}
const setStorageTokenType = (val) => {
  Storage.set('token_type', val, 'session')
}
const getStorageToken = () => {
  return Storage.get(SETTING.tokenKey, 'session')
}
const getStorageTokenType = () => {
  return Storage.get('token_type', 'session')
}
const clearStorageToken = () => {
  Storage.remove(SETTING.tokenKey, 'session')
}

export {
  setStorageToken,
  getStorageToken,
  clearStorageToken,
  setStorageTokenType,
  getStorageTokenType
}