import config from "@/settings.js";

function compare(property) {
  return (obj1, obj2) => {
    const val1 = obj1[property]
    const val2 = obj2[property]
    return val1 - val2
  }
}
export function formatNum(num, character) {
  if (!isNaN(num)) {
    num = Number(num).toFixed(4)
  }
  num = num.toString()
  let numArr = num.split('.')
  var reg = /\d{1,3}(?=(\d{3})+$)/g;
  let num1 = numArr[0].replace(reg, "$&,");
  if (Number(num.split('.')[1]) === 0) {
    return num.split('.')[0]
  }
  if (character) {
    return numArr[1] ? (`${character}${num1}.${numArr[1]}`) : `${character}${num1}`
  } else {
    return numArr[1] ? (`${num1}.${numArr[1]}`) : num1
  }
}
/* 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
export function formatTime(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number); //不知道为什么多三位，请灵活使用
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

//数据转化  
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getTree(children, id, level = 1) {
  const tree = []
  if (children && children.length > 0) {
    children.forEach(child => {
      if (id === child.parentId) {
        const leafChildren = this.getTree(children, child.id, level + 1)

        let leaf = true
        if (child.type === 1) { // 菜单
          leaf = !leafChildren || leafChildren.length === 0 || leafChildren[0].type === 2
        }

        tree.push({
          ...child,
          level,
          leaf,
          name: child.href,
          path: child.href,
          meta: {
            title: child.menuName,
            icon: child.type === 1 ? child.code : undefined
          },
          children: leafChildren
        })
      }
    })
  }
  return tree
}

// 验证-根据form表单里的validate方法
async function isRequired(val) {
  return new Promise((resolve, reject) => {

    this.$refs[val].validate(valid => {
      if (valid) {
        resolve(true);
      } else {
        this.$message.warning('请输入必填项!');
      }
    });
  });
}
// 验证form表单 是否有required
function isRequired2(arr, obj) {
  let flag = true
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].required) {
      if (!obj[arr[i].bind]) {
        flag = false;
        break
      }
    }
  }
  return flag
}
/**
 * 验证设计时间 禁用当天以前的
 */
function disabledDate(time) {
  return time.getTime() > Date.now();
}

function disabledDate2(time) {
  return time.getTime() < Date.now() - 24 * 3600000;
}
/**验证时间，只能选择当前之前的日期 */
function disabledBeforeDate(time) {
  return time.getTime() > Date.now();
}
/**验证时间，只能选择当前之后的日期 */
function disabledafterDate(time) {
  return time.getTime() < Date.now();
}
// 资金来源获取名称
function capitalSource(arr = [], key) {
  let capitalSourceName = ""

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].dataValue == key) {
      capitalSourceName = arr[i].dataName;
      break;
    }
  }

  return capitalSourceName
}

function setFormData(obj1, obj2) {
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && (obj2[key] || obj2[key] == 0)) {
      const element = obj2[key];
      if (obj1.hasOwnProperty(key)) {
        obj1[key] = element;
      }
    }
  }
}

// 判断对象是否有值为空
function objectHaveEmpty(obj) {
  const keys = Object.keys(obj);
  if (keys.length < 1) {
    return true;
  } else {
    let flag = false;
    keys.forEach(key => {
      if (!obj[key]) {
        flag = true;
        return false;
      }
    })
    return flag;
  }
}

// 确认提示框
export function isOk(msg1, msg2, callBack, params) {
  this.$confirm(msg1, msg2, {
    showClose: false,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: "取消",
    confirmButtonText: "确认提交",
    customClass: "changsha_confirm changsha_confirm_success"
  })
    .then(() => {
      callBack(params);
    })
    .catch(() => {
      return false;
    });
}
// 取消提示框
export function isCancel(msg1, msg2, path) {
  this.$confirm(
    msg1,
    msg2, {
    showClose: false,
    showCancelButton: true, // 是否显示取消按钮
    showConfirmButton: true, // 是否显示确认按钮
    cancelButtonText: "留在本页", // 取消按钮名字
    confirmButtonText: "确认", // 确定按钮名字
    customClass: "changsha_confirm changsha_confirm_warning" //  类名必传支持三种样式
  }
  )
    .then(() => {
      if (path) {
        this.$router.push(path);
      } else {
        this.$router.go(-1);
      }
    })
    .catch(() => {
      return false;
    });
}

// 深拷贝
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// fileIds
export function getFileIds(fileList, key = 'id') {
  if (Array.isArray(fileList) && fileList.length > 0) {
    let arr = [];
    fileList.forEach(item => {
      arr.push(item[key]);
    });
    return arr.join();
  }
  return "";
}

/**
 * 禁用选择范围规则,栗子：禁用当天以前的
 */
export function disabledDateBig(time, field, formData, startTime = "startTime", endTime = "endTime") {
  let flag = false;
  if (field == "start") {
    // 改变开始时间
    if (formData[endTime]) {
      // 有结束时间，开始时间必须小于它
      try {
        flag = time.getTime() >= new Date(formData[endTime]).getTime();
      } catch (errot) { }
    }
    return ((time.getTime() + 24 * 60 * 60 * 1000) >= Date.now()) || flag;

  } else {
    // 改变开始时间
    if (formData[startTime]) {
      // 有结束时间，开始时间必须小于它
      try {
        flag = (time.getTime() + 24 * 60 * 60 * 1000) < new Date(formData[startTime]).getTime();
      } catch (error) { }
    }
    return flag
    return ((time.getTime() + 24 * 60 * 60 * 1000) <= Date.now()) || flag;

  }
  // return flag
}

export function getLabel(value, list = []) {
  if (value || value === 0) {
    const found = list.find(item => {
      return (item.value == value || item.dataValue == value);
    });
    return found ? found.label || found.dataName : "";
  }
  return "";
}

export function getValue(label, list) {
  if (label) {
    const found = list.find(item => {
      return (item.label == label || item.dataName == label);
    });
    return found ? found.value || found.dataValue : "";
  }
  return null;
}

export function getClass(value, list) {
  if (value || value === 0) {
    const found = list.find(item => {
      return (item.value == value || item.dataValue == value);
    });
    return found ? found.class : "";
  }
  return "";
}

export function disabledDateWord(time, field, formData, startTime = "startTime", endTime = "endTime", isWorkOrder = false) {
  //isWorkOrder  如果是工单 则可以选择当前时间之前的时间
  let flag = false;
  if (field == "start") {
    // 改变开始时间
    if (formData[endTime]) {
      // 有结束时间，开始时间必须小于它
      try {
        flag = time.getTime() >= new Date(formData[endTime]).getTime();
      } catch (errot) { }
    }
  } else {
    // 改变开始时间
    if (formData[startTime]) {
      // 有结束时间，开始时间必须小于它
      try {
        flag = (time.getTime() + 24 * 60 * 60 * 1000) < new Date(formData[startTime]).getTime();
      } catch (error) { }
    }

  }
  if (isWorkOrder) {
    return flag
  } else {
    return (time.getTime() + 24 * 60 * 60 * 1000) <= Date.now() || flag;
  }

}
export function getNeedLongStorager(state) {
  let obj = {};
  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      const element = state[key];
      if (element.needLongStorager) {
        obj[key] = element;
      }
    }
  }
  return obj;
}

export function exportFile(url) {
  let a = document.createElement('a')
  a.href = url
  a.click()
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



// 判断文件后缀
export function judgeTrail(filePath) {
  if (!filePath) return false;
  let index = filePath.lastIndexOf(".");
  //获取后缀
  let ext = filePath.substr(index + 1);
  //输出结果
  return ext
}

// new Date 转换时间格式,时间获取
export function getNowFormatDate() {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

export function autorecodeFun(arr, obj) {// 根据bind自动赋值
  let newObj = {}
  for (const item of arr) {
    for (const key in obj) {
      if (item.bind == key) {
        newObj[key] = obj[key];
      }
    }
  }

  return newObj;
}
// 根据条件获取对应数组下标
export function getArrIndex(arr, val, key) {
  if (!arr) return -1;
  return arr.findIndex(item => item[key] == val)
}
// 根据条件获取数组匹配的对象
export function arrFind(arr, val, key) {
  return arr ? arr.find(item => item[key] == val) : []
}

// 过滤数组里的某个键有没有值
export function arrFilter(arr, key) {
  return arr ? arr.filter(item => item[key]) : []
}
// 根据数据如果是null 或 '' 或 undefined 返回false
export function isEmpty(str) {
  return str === null || str === undefined || str === '' ? false : true;
}

// 改变数组对象里某个key的内容为其他键的内容
export function arrContant(arr, key, val) {
  if (!arr) return [];
  let newArr = [];
  for (const item of arr) {
    item[key] = item[val]
    newArr.push(item)
  }
  return newArr;
}

// 工单判断点击事件 
export function workOrderClick(route) {

  if (route.query.isWorkOrder) {
    return { name: route.path.split("/")[3] }
  } else {
    return false
  }
}
// 金额整数值不用保留小数位
export function integerNoDecimals(str) {
  if (isNaN(str) || !str) return str;
  str = typeof str === 'number' ? str.toString() : str;
  let integer = str.split('.')[0]
  let newStr = str.split('.')[1]
  let flag = newStr?.split('')?.some(item => item != 0)

  return flag ? str : integer
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

export function getFileType(filePath) {
  return filePath && filePath.substr(filePath.lastIndexOf('.') + 1)
}
export default {
  getFileType,
  getTree,
  compare, // 按数组中的指定属性排序
  isRequired,
  isRequired2,
  disabledDate,
  disabledDate2,
  disabledafterDate,
  disabledDateBig,
  disabledDateWord,
  capitalSource,
  setFormData,
  objectHaveEmpty,
  isOk,
  getLabel,
  getValue,
  getClass,
  deepCopy,
  getFileIds,
  disabledBeforeDate,
  getNeedLongStorager,
  checkCodeInArr,
  exportFile,
  judgeTrail,
  getNowFormatDate,
  autorecodeFun,
  getArrIndex,
  isEmpty,
  arrContant,
  workOrderClick,
  arrFind,
  integerNoDecimals,
  arrFilter,
  resultObject,
}