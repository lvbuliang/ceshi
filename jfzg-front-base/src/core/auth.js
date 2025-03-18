/**
 * @name 处理登陆身份鉴权
 * @author weilan
 * @time 2020.05.20
 */

import store from "../store";
// 类型检查
import { DataType } from "wl-core"
/**
* @name 导入获取本地身份token函数
*/
import { getStorageToken } from "@/utils/user-vali"
/**
 * @name 导入接口获取子应用注册表接口
 */
import { api_getAppConfigs } from "@/api/index"
import { api_getUserPermissionByToken } from "@/api/user.js"
/**
 * @name 导入消息组件
 */
import { wlMessage } from '@/plugins/element';
/**
 * @name 导入qiankun注册微应用方法
 */
import qianKunStart from "./app-register"
/**
 * @name 导入无需服务端获取的微应用
 */
import { noAuthApps, nextAuthApps } from "./app-config"
// 导入核心库本地存储操作类
import { Storage } from "wl-core"

/**
 * @name 请求获取服务端子应用注册表
 */
const getAppConfigs = () => {
  /*本地菜单数据*/

  // api_getAppConfigs().then(({ data }) => {
  //   // 验证数据有效性
  //   let _res = data || [];//
  //   if (_res.length === 0) {
  //     wlMessage({
  //       type: 'error',
  //       message: "没有可以注册的子应用数据"
  //     })
  //     return;
  //   }

  //   _res.forEach((i, index) => {
  //     if (i.entry) {
  //         if (i.module == 'subapp-plan') {
  //           i.entry = '//localhost:2753'
  //         } else if (i.module == 'subapp-shenbao') {
  //           i.entry = '//localhost:2756'
  //         } else if (i.module == 'subapp-decl') {
  //           i.entry = '//localhost:2756'
  //         } else if (i.module == 'subapp-impl') {
  //           i.entry = '//localhost:2757'
  //         } else if (i.module == 'subapp-dis') {
  //           i.entry = '//localhost:2757'
  //         }
  //     } else {
  //       NoEntryArr.push(i)
  //     }
  //     if (DataType.isArray(i.data)) _menu.push(...i.data)
  //   })
  //   store.dispatch('menu/setMenu', _menu);
  //   /**
  //    * @name 启用qiankun微前端应用，已启动过用手动加载，未启动过正常注册
  //    */
  //   qianKunStart([..._res, ...nextAuthApps]);
  // })



  api_getUserPermissionByToken().then(({ data }) => {
    console.log('当前登陆人用户信息',data)
    let isDev = process.env.NODE_ENV === 'development'
    let _res = data.menus || [];
    let appList = data.entryList || []
    if (appList.length === 0) {
      wlMessage({
        type: 'error',
        message: "没有可以注册的子应用数据"
      })
    } else {
      appList.forEach((i, index) => {
        if (i.entry && isDev) {
          if (i.routerBase == '/subplan' || i.routerBase == '/subzichan') {
            i.entry = '//localhost:2753'
          } else if (i.routerBase == '/subdecl' || i.routerBase == '/subshenbao') {
            i.entry = '//localhost:2756'
          } else if (i.routerBase == '/subimpl' || i.routerBase == '/subcheck' || i.routerBase == '/subdis' || i.routerBase == '/subexpert') {
            i.entry = '//localhost:2757'
          } else if (i.routerBase == '/subfinal' || i.routerBase == '/subservice') {
            i.entry = '//localhost:2758'
          } else if (i.routerBase == '/subradial') {
            i.entry = '//localhost:2759'
          } else if (i.routerBase == '/subzaojia') {
            i.entry = '//localhost:2754'
          }
        }
      })
    }
    // 处理菜单状态共享
    let _menu = []
    // let NoEntryArr = []

    _res.forEach((i, index) => {
      // if (i.entry) {
      //   if (isDev) {
      //     if (i.routerBase == '/subplan' || i.routerBase == '/subzichan') {
      //       i.entry = '//localhost:2753'
      //     } else if (i.routerBase == '/subdecl' || i.routerBase == '/subshenbao') {
      //       i.entry = '//localhost:2756'
      //     } else if (i.routerBase == '/subimpl' || i.routerBase == '/subcheck' || i.routerBase == '/subdis' || i.routerBase == '/subexpert') {
      //       i.entry = '//localhost:2757'
      //     } else if (i.routerBase == '/subfinal' || i.routerBase == '/subservice') {
      //       i.entry = '//localhost:2758'
      //     } else if (i.routerBase == '/subradial') {
      //       i.entry = '//localhost:2759'
      //     } else if (i.routerBase == '/subzaojia') {
      //       i.entry = '//localhost:2754'
      //     }
      //   }
      // } else {
      //   NoEntryArr.push(i)
      // }
      if (DataType.isArray(i.data)) _menu.push(...i.data)
    })
    // if (NoEntryArr && NoEntryArr.length > 0) {
    //   NoEntryArr.map(data => {
    //     _res.splice(_res.findIndex(item => item.permissionId === data.permissionId), 1)
    //   })
    // }
    if (data.btns) {
      Storage.set('permission_btns', [...data.btns, ...data.views], 'session')
    }
    if (data.views) {
      store.dispatch('app/permission_views', data.views);
    }

    // console.log('_res', _res)
    let menuList = []
    // _menu.forEach(item=>{
    //   if(item.children&&item.children.length>0){
    //     item.children.forEach(childr=>{
    //       if(childr.url){
    //         menuList.push(childr.url)
    //       }
    //     })
    //   }else{
    //     if(item.url){
    //       menuList.push(item.url)
    //     }
    //   }
    // })
    let each  = (arr,dataList)=>{
      if(Array.isArray(arr)&&arr.length>0){
        arr.forEach(item=>{
          if(item.children&&item.children.length>0){
            each(item.children,dataList)
          }
          if(item.url){
            dataList.push(item.url)
          }
        })
      }
      return
    }
    each(_menu,menuList)
    menuList.push("/noAccess");
    menuList.push("/base")
    menuList.push("/knowledgeBase")
    menuList.push("/set")
    menuList.push("/viewPdf")
    menuList.push("/download")
    menuList.push("/subcheck/#/riskAndIssue")
    sessionStorage.setItem('menus',JSON.stringify(menuList))
    store.dispatch('menu/setMenu', _menu);
    store.dispatch('menu/setSpeed', data.speed);
    /**
     * @name 启用qiankun微前端应用，已启动过用手动加载，未启动过正常注册
     */
    qianKunStart(appList)
    // qianKunStart([..._res, ...nextAuthApps]);
  })
}

/**
 * @name 验证用户身份并注册微应用
 */
const microAppStart = () => {
  const token = getStorageToken();
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiYWRtaW4iLCJpYXQiOjE2MTk0MDMzODYsImV4cCI6MTYxOTQ4OTc4Nn0.C5v2Us7fOxeCEdxM54TQr6aI3Mc1qvm892QTWM8_MEE';
  /**
   * @name 已登录状态获取服务端微应用注册表
   */
  if (token) {
    // 处理token状态共享
    store.dispatch('app/setToken', token);
    getAppConfigs();
    return;
  }
  /**
   * @name 默认加载未登录时无需服务端获取的微应用
   */
  qianKunStart(noAuthApps)
}

export default microAppStart