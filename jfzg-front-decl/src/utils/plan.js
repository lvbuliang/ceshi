// import {
//   cityPlanList
// } from "@/api/projectPlan/index"; //
// import {
//   common_aduitSave,
//   fileBusinessInfo,
//   fileBusinessInfoList
// } from "@/api";
// import moment from 'moment' //导入文件


/**
 * 获取当年之前10年的年份
 */

export function getBeforeYear() {
  let year = new Date().getFullYear();
  let arr = [];
  for (let i = 0; i < 10; i++) {
    let obj = {
      dataName: year - i,
      dataValue: year - i,
    }
    arr.push(obj)
  }

  return arr
}
export function getAfterYear() {
  let year = new Date().getFullYear();
  let arr = [];
  for (let i = 0; i < 20; i++) {
    let obj = {
      dataName: year + i,
      dataValue: (year + i).toString(),
    }
    arr.push(obj)
  }

  return arr
}

/*
//对比对象的值有没有更改
 */
//a拷贝之后的值
export function diffObject(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  //a和b同时去除最后一位
  bProps.pop()
  //判断属性名的length是否一致
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }

  }
  return true;

}

/**
 * 
 * @param {判断汉字个数} _price 
 */
export function getCnWordTotal(str) {
  var total = 0;
  if (str.length > 0) {
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      //匹配中文
      if (c.match(/[\u4E00-\u9FFF]/)) {
        total++
      }
    }
  }
  return total
}

/**
 * 
 * @param {*金额分割} _price 
 */

export function formatPrice(_price) {
  var result = '0'
  if (null != _price || undefined != _price) {
    var price = parseInt(_price)
    if (!isNaN(price)) {
      var val = price
      result = String(val).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    }
  }
  return result
}

//金额切割且金额处理
export function thousandFun(num, flag) {
  if (num == undefined || num == null) return
  let stringNum = num.toString()
  if (Number(num) > 10000) {
    if (stringNum.indexOf('.') != -1) {
      let str = stringNum.split('.')[0]
      num = str.slice(0, str.length - 4)
    } else {
      num = JSON.stringify(num).slice(0, JSON.stringify(num).length - 4)
    }
    return flag == 'character' ? '万元' : flag == 'money' ? formatPrice(num) : formatPrice(num) + '万元'
  } else {

    return flag == 'character' ? '元' : flag == 'money' ? formatPrice(num) : formatPrice(num) + '元'
  }
}

/**
 * 多个页面共用全市列表数据
 */
export function qsQList() {
  let params = {
    pageNum: 1,
    status: 3,
    pageSize: 1000
  };

  // return cityPlanList(params).then(res => {
  //   let data = res.data.records.map(item => {
  //     let obj = {
  //       dataName: item.cityPlanName,
  //       dataValue: item.id
  //     };
  //     return obj
  //   });
  //   return data
  // });
}

/**
 * 获取当前时间的毫秒
 */
export function curMilliSecond() {
  var timestamp1 = Date.parse(new Date());
  return timestamp1
}


/**
 * 多个页面共用审核，提审,审核
 */
export function saveProcess(params) {
  // return common_aduitSave(params).then(res => {
  //   if (res.msg.code != 1004) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }).catch((err) => {
  //   return false
  // });;
}

/**
 *  根据上传文件数组获取对应id
 */
export function getId(arr) {
  if (!arr) return ''
  let temp = []
  temp = arr.map((item => item.id))
  return temp
}
/**
 *  根据projectId,sourceType 获取附件数组-wxx
 */
export function s_gaiNaccessory(params) {
  // return fileBusinessInfo(params).then(res => {
  //   if (!res || res.msg.code != '0000' || res.data.length == 0) return;
  //   //待提交附件
  //   let fileArr = [];
  //   res.data.forEach(fileItem => {
  //     fileArr.push({
  //       id: fileItem.fileId,
  //       name: fileItem.fileName,
  //       url: fileItem.url
  //     });

  //   });
  //   return fileArr
  // });
}

export function s_fileBusinessInfoList(params) {
  // return fileBusinessInfoList(params).then(res => {
  //   if (!res || res.msg.code != '0000' || res.data.length == 0) return;
  //   //待提交附件
  //   let fileArr = [];
  //   res.data.forEach(fileItem => {
  //     fileArr.push({
  //       id: fileItem.fileId,
  //       name: fileItem.fileName,
  //       url: fileItem.url
  //     });

  //   });
  //   return fileArr
  // });
}

// 计算百分比-wxx
export function percentage(num, sum) {
  if (typeof num != 'number' && typeof sum != 'number') return
  if (sum == 0) {
    return '0%';
  } else {
    return parseInt((num / sum) * 100) + '%';
  }
}

// 判断对象里的key有没有值-wxx
export function flagKey(obj) {
  let flag = false
  for (const key in obj) {

    if (obj[key] && obj[key].length > 0) {
      flag = true;
      break
    }
  }
  return flag
}

//元转换为万元 -wtt
export function changeMoney(num) {
  if (num == undefined || num == null) return
  var regexp = /(?:\.0*|(\.\d+?)0+)$/
  let stringNum = num.toString()
  if (Number(num) > 10000) {
    if (null != num || undefined != num) {
      var price = parseInt(num)
      if (!isNaN(price)) {
        var val = price
        price = String(val).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
      }
    }
    return price
  } else {
    // num = (num / 100).toFixed(2)
    // num = num.replace(regexp, '$1')
    return num
  }
}

//判断金额
export function judeMoney(money, val) {
  if (money > val || money == val) {
    return true
  } else {
    return false
  }

}

/*
 * @parm array 排序的数组对象
 * @parm key 要根据数组对象的哪条属性排序
 * @parm updown （up 升序 down 降序）
 */
export function sortByKey(array, key, updown) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    if (updown == "up") {
      return (x < y) ? -1 : ((x > y) ? 1 : 0);
    }
    if (updown == "down") {
      return (x < y) ? 1 : ((x > y) ? -1 : 0);
    }
  })

}

/**
 * 判断传入的数据是否为空
 */
export function arrIsNone(arr) {
  if (arr.length > 0) {
    return true
  } else {
    return false
  }
}

export function getFileType(filePath) {
  return filePath.substr(filePath.lastIndexOf('.') + 1)
}

/**
 * 
 * 数组排序
 */



/**
 * 数组中找出最大日期或最小值
 */
export function getCompareDate(arr, type) {
  let arr_sed = [];
  arr_sed = arr.map(item => {
    return new Date(item.replace(/-/g, '/')).getTime()
  })
  if (type == 'min') {
    //最小值,从小到大
    arr_sed.sort(function (a, b) {
      return a - b
    })
  } else {
    //最大值 ，从大到小
    arr_sed.sort(function (a, b) {
      return b - a
    })
  }
  return moment(arr_sed[0]).format('YYYY-MM-DD')

}

/**月份补0 */
export function getMarkZero(YearMonth) {
  let str = "";
  let data = YearMonth.split('-');
  data[1] = data[1] < 10 ? '0' + data[1] : data[1];
  str = data[0] + '-' + data[1]
  return str

}
//两个时间比较大小
export function compareTimeTwice(data1, data2) {
  if (moment(data1)._i < moment(data2)._i) {
    return true
  } else {
    return false
  }
}

// 数组内某一固定值是否大于五位数
export function twoVerify(arr, value) {
  return arr.some((item) => (item[value] > 99999 ? true : false));
}

// 资源申请校验是否超过五位数
export function resourceVerifyNumber(arr) {
  let serverSize = twoVerify(arr, "serverSize")
  let serverG = twoVerify(arr, "serverG")
  let serverNum = twoVerify(arr, "serverNum")

  if (serverSize) {
    this.$message.warning("资源分配下(规格核数)最多输入五位数!");
  } else if (serverG) {
    this.$message.warning("资源分配下(G)最多输入五位数!");
  } else if (serverNum) {
    this.$message.warning("资源分配下(服务器台数)最多输入五位数!");
  }
  return new Promise(resolve => {
    if (!serverSize && !serverG && !serverNum) {
      resolve()
    }
  })
}

// 时间转换格式
export function getNowFormatDate() {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + hours + ':' + minutes;
  return currentdate;
}

export default {
  getNowFormatDate,
  getFileType
}