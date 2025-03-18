import moment from 'moment' //导入文件
import {compareTimeTwice } from "@/utils/plan";
/**
 * 获取百分比
 */
export function getPer(num, total) {
    // return total <= 0 ? "0" : (Math.ceil(Math.ceil(num / total * 10000) / 100));
    return total <= 0 ? "0" : (Math.ceil(num / total * 10000) / 100);
}
/**
 * 找出数组对象中相同的值,按时间排序
 * 第一个数据和第二个数据比较，如果时间相同，组和数据，不相同，单独一个数据
 *  for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i][time] == arr[i + 1][time]) {
            //相等
            //1完成，2逾期完成，3逾期
            let state = ""
            if (arr[i][isDelay] == 0 && arr[i][isComplete] == 0) {
                state = 1
            } else if (arr[i][isDelay] == 1 && arr[i][isComplete] == 0) {
                state = 2
            } else {
                state = 3
            }
            let obj = {
                time: arr[i][time],
                child: [
                    { title: arr[i][name], status: state },
                    { title: arr[i + 1][name], status: state },
                ]
            }
            arrList.push(obj)
            arr.splice(i, 1)

        } else {
            //不相等
            let state = ""
            if (arr[i][isDelay] == 0 && arr[i][isComplete] == 0) {
                state = 1
            } else if (arr[i][isDelay] == 1 && arr[i][isComplete] == 0) {
                state = 2
            } else {
                state = 3
            }
            let obj = {
                time: arr[i][time],
                child: [
                    { title: arr[i][name], status: state },
                ]
            }
            arrList.push(obj)
        }

    };
 */
/**废弃的方法 */
export function findSame(arr, time, name, isDelay, isComplete) {
    let arrList = [];
    //遍历找到showTime相同的元素，找出对应的下标
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i][time] == arr[i + 1][time]) {
            //相等
            //1完成，2逾期完成，3逾期
            let state = ""
            if (arr[i][isDelay] == 0 && arr[i][isComplete] == 0) {
                state = 1
            } else if (arr[i][isDelay] == 1 && arr[i][isComplete] == 0) {
                state = 2
            } else {
                state = 3
            }
            let obj = {
                time: arr[i][time],
                child: [
                    { title: arr[i][name], status: state },
                    { title: arr[i + 1][name], status: state },
                ]
            }
            arrList.push(obj)
            arr.splice(i, 1)

        } else {
            //不相等
            let state = ""
            if (arr[i][isDelay] == 0 && arr[i][isComplete] == 0) {
                state = 1
            } else if (arr[i][isDelay] == 1 && arr[i][isComplete] == 0) {
                state = 2
            } else {
                state = 3
            }
            let obj = {
                time: arr[i][time],
                child: [
                    { title: arr[i][name], status: state },
                ]
            }
            arrList.push(obj)
        }

    };
    return arrList
}

/**
 * 
 * @param {数组} arr 
 * @param {对象中的某个值*} time 
 */
export function findSame2(arr, time) {
    var _arr = [],
        _t = [],
        // 临时的变量
        _tmp;
    arr = arr.sort(function (a, b) {
        var s = a[time],
            t = b[time];

        return s < t ? -1 : 1;
    });
    if (arr.length) {
        _tmp = arr[0][time];
    }
    for (var i in arr) {
        if (arr[i][time] === _tmp) {
            _t.push(arr[i]);
        } else {
            _tmp = arr[i][time];
            _arr.push(_t);
            _t = [arr[i]];
        }
    }
    // 将最后的内容推出新数组
    // 当前时间如何解决，是不是包含在某个里程碑里面
    _arr.push(_t);

    return _arr;
}


//数组扁平化
export function flatten(arr, depth = 1) {
    let arrLst = arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v), []);
    return arrLst
}
//获取数组中最大的值-先排序
export function maxArrNumber(arr) {
    arr.sort(function (a, b) {
        return a - b;
    });
    return arr[arr.length - 1]
}

//日期字符截取 2020-06-09取 06-09
export function getMonthDay(str) {
    let arr = str.split('-')
    return arr[1] + '-' + arr[2]
}

//某值处于数组的哪个阶段
export function getstage(num, arr) {
    //arr是一个数组，[3,6,20] num=5
    for (let i = 0; i < arr.length; i++) {
        if (num <= arr[i]) {
            return i
        }
    }
}
//比较时间大小
export function CompareDate(d1, d2) {
    //小于当前时间
    if ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/")))) {
        return 0
    } else if ((new Date(d1.replace(/-/g, "\/"))) == (new Date(d2.replace(/-/g, "\/")))) {
        return 1
    } else {
        // 小于
        return 2
    }
}

//判断当前时间，是否存在于某数组
export function curTimeIsExit(arrList, curday) {
    let day = "";
    let type = '';//0代表大于，1代表等于，2代表小于
    let obj = {};
    //先对日期排个序
  let arr= sortByKey(arrList,'time','up')
    for (let i = 0; i < arr.length; i++) {
        /**负数：代表没有，正数：包含当前日期 */
        if (arr[i].time) {
            if (moment(arr[i].time)._i < moment(curday)._i) {
                //当前时间大于showTime
                day = i + 1;
                type = 0;
            
            } else if (moment(arr[i].time)._i == moment(curday)._i) {
                //当前时间等于showTime
                day = i - 1
                type = 1;
                break;
            } else {
                //当前时间小于showTime
                day = i
                type = 2;
                break;
            }
        }
    }
    obj.day = day;
    obj.type = type;

    return obj
}


//数组对象按某个排序
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
 * 日期范围
 */
export  function TimeRange(start_time, end_time) { 
    var bd = new Date(start_time),
    be = new Date(end_time);
    var bd_time = bd.getTime(),
    be_time = be.getTime(),
    time_diff = be_time - bd_time;

  var c_arr = [];
  let year = moment(start_time).format("YYYY");

  for (var i = 0; i <= time_diff; i += 86400000) {
    var ds = new Date(bd_time + i);
    // 计算月份
    let month =
      (ds.getMonth() + 1).toString().length == 1
        ? "0" + (ds.getMonth() + 1)
        : "" + (ds.getMonth() + 1);
    //计算天数
    let day =
      ds.getDate().toString().length == 1
        ? "0" + ds.getDate()
        : "" + ds.getDate();

    //计算年份
    if (month == "12" && day == "31") {
      year = parseInt(year) + 1;
    }
 
    let obj=year+'-'+month+'-'+day
    c_arr.push(obj);
  
  }
  return c_arr
}

// 获取上一周的开始结束时间
export function getLastWeekDays () {
    let date = []
    let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
    let start = moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD') // 周一日期
    let end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
    date.push(start)
    date.push(end)
    console.log('本周',date)
    return date
  }

  /**日期等分 */
export  function group(arrayList) {
    let array=arrayList.split(',')
    let u=[];
    u.push(array[array.length-1])
    //都是7的倍数,确定分几分
    // 1-0 2-1 3-2 4-3
    let subGroupLength=7;
    let num=array.length/subGroupLength
    console.log(num)
    let newArray = [];
    for(let i=0;i<=array.length;i++){
      newArray.push(array.slice(num*i,num*i+1))
    }
    newArray.push(u)
  
    return newArray;
}