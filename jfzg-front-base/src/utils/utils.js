/**
 * auth: weilan
 * time: 2017/01/17
 * des: 公共工具类
 */

/**
 * 跨应用路由跳转
 * @param {String} href url地址
 * @param {Object} stateObj 状态参数 可以通过history.state读取
 * @param {String} title 标题 暂时没有用
 */
function routerGo(href = '/', title = null, stateObj = {}) {
  window.history.pushState(stateObj, title, href);
}

// 获取元素数组下标
function getArrayIndex(arr, obj) {
  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    if (item.url === obj) {
      return index;
    }
  }
  return -1;
}

// 判断权限code在不在数组里
function checkCodeInArr(code, arr) {
  arr = arr || sessionStorage.getItem('permission_btns') || []
  if (!code) {
    return true;
  }
  arr = typeof arr == 'string' ? JSON.parse(arr) : arr
  let flag = false;
  for (let k = 0; k < arr.length; k++) {
    if (arr[k].permissionCode == code) {
      flag = true;
      break;
    }

  }

  return flag;
}

export {
  routerGo, // 跨应用路由跳转
  getArrayIndex,
  checkCodeInArr,

}
