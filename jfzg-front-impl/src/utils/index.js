/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

function getTimeDifference(endTime, systemTime) {
  const end = new Date(endTime).getTime();
  const start = systemTime ? new Date(systemTime).getTime() : new Date().getTime();
  let day = 0;
  let hours = 0;
  if (end > start) {
    const difference = end - start;
    day = Math.floor(difference / (24 * 3600 * 1000));
    const leave1 = difference % (24 * 3600 * 1000);
    hours = Math.floor(leave1 / (3600 * 1000));
  }
  return {
    day,
    hours,
  };
}
export function exportFile(url) {
  let a = document.createElement('a')
  a.href = url
  a.click()
}

function resultObject(arr) {// 将数组里的多个对象转换成一个对象输出
  if (!Array.isArray(arr)) return arr;
  var resultObject = arr.reduce(function (result, currentObject) {
    for (var key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        result[key] = currentObject[key];
      }
    }
    return result;
  }, {});
  return resultObject;
}

function arrFind(arr, val, key, equal = false) {// 默认是包含查询，equal:true 是精确查询
  if (!Array.isArray(arr)) return arr;
  if (equal) {
    return arr.find(item => item[key] == val)
  } else {
    return arr.find(item => typeof item[key] == 'number' ? item[key].toString().includes(val) : item[key].includes(val))
  }

}

function enumsDataNameValue(arr, name, value, key1 = 'dataName', key2 = 'dataValue') {// select数据源，组装数据
  let newArr = []
  for (const item of arr) {
    if (item) {
      let obj = {}
      obj[key1] = item[name]
      obj[key2] = item[value]
      newArr.push(obj)
    }
  }
  return newArr;
}

// 根据条件获取对应数组下标
export function getArrIndex(arr, val, key) {
  return !arr ? -1 : arr.findIndex(item => item[key] == val)
}

// 根据数据如果是null 或 '' 或 undefined 返回false
export function isEmpty(str) {
  return str === null || str === undefined || str === '' ? false : true;
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

export function getFileType(filePath) {
  return filePath && filePath.substr(filePath.lastIndexOf(".") + 1);
}
//格局化日期：yyyy-MM-dd
export function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return myyear + "-" + mymonth + "-" + myweekday;
}

export default {
  exportFile,
  getFileType,
  getTimeDifference,
  resultObject,
  arrFind,
  enumsDataNameValue,
  getArrIndex,
  checkCodeInArr,
  isEmpty,
  formatDate,
};
