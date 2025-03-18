// 采购管理
export const moduleCode = "7001"; // 模板code
export const permissionCode = "M005_025";

// 查看页公开采购单条数据项
export const previewRowItem1 = {
  projectProcurementSubVo: {
    otherConfig: {
      labelNum: 140,
    },
    config: [
      {
        label: "采购类型",
        value: "deliveryType",
        col: 12,
        type: "value",
      },
      {
        value: "successfulBuid",
        label: "中标单位",
        span: 12,
        type: "value",
      },
      {
        value: "adInternetTime",
        label: "公告挂网时间",
        span: 12,
        type: "value",
      },
      {
        value: "successfulTime",
        label: "开标时间",
        span: 12,
        type: "value",
      },
      {
        span: 12,
        type: "slot",
        slotName: "11",
      },
      {
        span: 12,
        type: "slot",
        slotName: "22",
      },
      {
        span: 24,
        type: "slot",
        slotName: "33",
      },
    ],

    data: {
      deliveryType: "", // 采购类型
      successfulBuid: "", //中标单位
      adInternetTime: null, // 公告挂网时间
      successfulTime: null, // 开标时间
      tenderFileList: "", // 招标文件
      bidFileList: "", // 投标文件
      bidNotice: "", // 中标通知书
    },
    enums: {},
  },
  projectProcurementContractVo: {
    otherConfig: {
      labelNum: 140,
    },
    config: [
      {
        label: "合同名称",
        value: "contractName",
        col: 12,
        type: "value",
      },
      {
        value: "contractAmount",
        label: "合同金额(万元)",
        span: 12,
        type: "value",
      },
      {
        value: "startTime",
        label: "合同开始日期",
        span: 12,
        type: "value",
      },
      {
        value: "endTime",
        label: "合同建设期结束日期",
        span: 12,
        type: "value",
      },
      {
        value: "operationTime",
        label: "运维期限(年)",
        span: 12,
        type: "value",
      },
      {
        span: 12,
        type: "slot",
        slotName: "00",
      },
    ],

    data: {
      contractName: "", // 合同名称
      contractId: '', //合同id
      contractAmount: "", //合同金额
      startTime: null, // 合同开始日期
      endTime: null, // 合同结束日期
      operationTime: "", //运维期限
      contractFileList: "", // 合同
    },
    enums: {},
  },
  projectPayPointVos: [],
};

// 查看页协同采购单条数据项
export const previewRowItem2 = {
  projectProcurementSubVo: {
    otherConfig: {
      labelNum: 140,
    },
    config: [
      {
        label: "采购类型",
        value: "deliveryType",
        col: 12,
        type: "value",
      },
      {
        value: "successfulBuid",
        label: "中标单位",
        span: 12,
        type: "value",
      },
      {
        value: "togetherProcurementTime",
        label: "协同采购时间",
        span: 12,
        type: "value",
      },
      {
        // value: "decisionDocument",
        label: "公司决策文件",
        span: 12,
        type: "slot",
        slotName: "44",
      },
      {
        // value: "negotiation",
        label: "谈判纪要",
        span: 24,
        type: "slot",
        slotName: "55",
      },
    ],

    data: {
      deliveryType: "", // 采购类型
      successfulBuid: "", //中标单位
      togetherProcurementTime: null, // 协同采购时间
      decisionDocument: "", // 公司决策文件
      negotiation: "", // 谈判纪要
    },
    enums: {},
  },
  projectProcurementContractVo: {
    otherConfig: {
      labelNum: 140,
    },
    config: [
      {
        label: "合同名称",
        value: "contractName",
        col: 12,
        type: "value",
      },
      {
        value: "contractAmount",
        label: "合同金额",
        span: 12,
        type: "value",
      },
      {
        value: "startTime",
        label: "合同开始日期",
        span: 12,
        type: "value",
      },
      {
        value: "endTime",
        label: "合同建设期结束日期",
        span: 12,
        type: "value",
      },
      {
        value: "operationTime",
        label: "运维期限",
        span: 12,
        type: "value",
      },
      {
        span: 12,
        type: "value",
        slotName: "00",
      },
    ],

    data: {
      contractName: "", // 合同名称
      contractId: '', // 合同id
      contractAmount: "", //合同金额
      startTime: null, // 合同开始日期
      endTime: null, // 合同结束日期
      operationTime: "", //运维期限
      contractFileList: "", // 合同
    },
    enums: {},
  },
  projectPayPointVos: [],
};

// 编辑页公开采购config
export const purchaseConfig1 = [
  {
    type: "slot",
    slotName: "deliveryType",
    collapseTags: true,
    name: "采购类型",
    required: "请选择采购类型",
    placeholder: "请选择",
    bind: "deliveryType",
    trigger: "change",
    col: 12,
  },
  {
    type: "slot",
    slotName: "successfulBuid",
    collapseTags: true,
    name: "中标单位",
    required: "请输入中标单位",
    placeholder: "请输入",
    bind: "successfulBuid",
    trigger: "blur",
    col: 12,
  },
  {
    type: "dateSelect",
    timeType: "date",
    name: "公告挂网时间",
    placeholder: "请选择",
    bind: "adInternetTime",
    required: "请选择公告挂网时间",
    format: "yyyy-MM-dd",
    col: 12,
  },
  {
    type: "dateSelect",
    timeType: "date",
    name: "开标时间",
    placeholder: "请选择",
    bind: "successfulTime",
    required: "请选择开标时间",
    format: "yyyy-MM-dd",
    col: 12,
  },
  {
    type: "upload",
    name: "招标文件",
    bind: "tenderFileList",
    required: "请上传附件",
    fileList: [],
    fileSize: 500,
    fileType: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
    fileTip:
      "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
    limit: 0,
    tipPopover: true,
    col: 24,
  },
  {
    type: "upload",
    name: "投标文件",
    bind: "bidFileList",
    required: "请上传附件",
    fileList: [],
    fileSize: 500,
    fileType: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
    fileTip:
      "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
    limit: 0,
    tipPopover: true,
    col: 24,
  },
  {
    type: "upload",
    name: "中标通知书",
    bind: "bidNotice",
    required: "请上传附件",
    fileList: [],
    fileSize: 500,
    fileType: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
    fileTip:
      "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
    limit: 0,
    tipPopover: true,
    col: 24,
  },
];

// 编辑页协同采购config
export const purchaseConfig2 = [
  {
    type: "slot",
    slotName: "deliveryType",
    collapseTags: true,
    name: "采购类型",
    required: "请选择采购类型",
    placeholder: "请选择",
    bind: "deliveryType",
    trigger: "change",
    col: 12,
  },
  {
    type: "slot",
    slotName: "successfulBuid",
    collapseTags: true,
    name: "中标单位",
    required: "请输入中标单位",
    placeholder: "请输入",
    bind: "successfulBuid",
    trigger: "blur",
    col: 12,
  },
  {
    type: "dateSelect",
    timeType: "date",
    name: "协同采购时间",
    placeholder: "请选择",
    bind: "togetherProcurementTime",
    required: "请选择协同采购时间",
    format: "yyyy-MM-dd",
    col: 12,
  },
  {
    type: "upload",
    name: "公司决策文件",
    bind: "decisionDocument",
    required: "请上传附件",
    fileList: [],
    fileSize: 500,
    fileType: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
    fileTip:
      "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
    limit: 0,
    tipPopover: true,
    col: 24,
  },
  {
    type: "upload",
    name: "谈判纪要",
    bind: "negotiation",
    required: "请上传附件",
    fileList: [],
    fileSize: 500,
    fileType: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
    fileTip:
      "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
    limit: 0,
    tipPopover: true, // hover显示提示  默认外面显示
    col: 24,
  },
];

// 编辑页合同部分config
export const contractConfig = [
  {
    type: "slot",
    slotName: "contractName",
    collapseTags: true,
    name: "合同名称",
    required: "请输入合同名称",
    placeholder: "请输入",
    bind: "contractName",
    trigger: "blur",
    col: 24,
  },
  {
    type: "slot",
    slotName: "contractAmount",
    collapseTags: true,
    name: "合同金额",
    required: "请输入合同金额",
    placeholder: "请输入",
    bind: "contractAmount",
    trigger: "blur",
    col: 12,
  },
  {
    type: "slot",
    slotName: "startTime",
    timeType: "date",
    name: "合同开始日期",
    placeholder: "请选择",
    bind: "startTime",
    required: "请选择合同开始日期",
    format: "yyyy-MM-dd",
    col: 12,
  },
  {
    type: "slot",
    slotName: "endTime",
    timeType: "date",
    name: "合同建设期结束日期",
    placeholder: "请选择",
    bind: "endTime",
    required: "请选择合同建设期结束日期",
    format: "yyyy-MM-dd",
    col: 12,
  },
  {
    type: "slot",
    slotName: "operationTime",
    collapseTags: true,
    name: "运维期限",
    required: "请输入运维期限",
    placeholder: "请输入",
    bind: "operationTime",
    trigger: "blur",
    col: 12,
  },
  {
    type: "upload",
    name: "合同",
    bind: "contractFileList",
    required: "请上传附件",
    fileList: [],
    fileSize: 500,
    fileType: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
    fileTip:
      "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
    limit: 10,
    tipPopover: true, // hover显示提示  默认外面显示
    col: 24,
  },
];

// json格式方法
export function transitionJsonToString(jsonObj, callback) {
  // 转换后的jsonObj受体对象
  var _jsonObj = null;
  // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
  if (Object.prototype.toString.call(jsonObj) !== "[object String]") {
    try {
      _jsonObj = JSON.stringify(jsonObj);
    } catch (error) {
      // 转换失败错误信息
      console.error("您传递的json数据格式有误，请核对...");
      console.error(error);
      callback(error);
    }
  } else {
    try {
      jsonObj = jsonObj.replace(/(\')/g, '"');
      _jsonObj = JSON.stringify(JSON.parse(jsonObj));
    } catch (error) {
      // 转换失败错误信息
      console.error("您传递的json数据格式有误，请核对...");
      console.error(error);
      callback(error);
    }
  }
  return _jsonObj;
}

// callback为数据格式化错误的时候处理函数
export function formatJson(jsonObj, callback) {
  // 正则表达式匹配规则变量
  var reg = null;
  // 转换后的字符串变量
  var formatted = "";
  // 换行缩进位数
  var pad = 0;
  // 一个tab对应空格位数
  var PADDING = "    ";
  // json对象转换为字符串变量
  var jsonString = transitionJsonToString(jsonObj, callback);
  if (!jsonString) {
    return jsonString;
  }
  // 存储需要特殊处理的字符串段
  var _index = [];
  // 存储需要特殊处理的“再数组中的开始位置变量索引
  var _indexStart = null;
  // 存储需要特殊处理的“再数组中的结束位置变量索引
  var _indexEnd = null;
  // 将jsonString字符串内容通过\r\n符分割成数组
  var jsonArray = [];
  // 正则匹配到{,}符号则在两边添加回车换行
  jsonString = jsonString.replace(/([\{\}])/g, "\r\n$1\r\n");
  // 正则匹配到[,]符号则在两边添加回车换行
  jsonString = jsonString.replace(/([\[\]])/g, "\r\n$1\r\n");
  // 正则匹配到,符号则在两边添加回车换行
  jsonString = jsonString.replace(/(\,)/g, "$1\r\n");
  // 正则匹配到要超过一行的换行需要改为一行
  jsonString = jsonString.replace(/(\r\n\r\n)/g, "\r\n");
  // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
  jsonString = jsonString.replace(/\r\n\,/g, ",");
  // 特殊处理双引号中的内容
  jsonArray = jsonString.split("\r\n");
  jsonArray.forEach(function (node, index) {
    // 获取当前字符串段中"的数量
    var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
    // 判断num是否为奇数来确定是否需要特殊处理
    if (num % 2 && !_indexStart) {
      _indexStart = index;
    }
    if (num % 2 && _indexStart && _indexStart != index) {
      _indexEnd = index;
    }
    // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
    if (_indexStart && _indexEnd) {
      _index.push({
        start: _indexStart,
        end: _indexEnd,
      });
      _indexStart = null;
      _indexEnd = null;
    }
  });
  // 开始处理双引号中的内容，将多余的"去除
  _index.reverse().forEach(function (item, index) {
    var newArray = jsonArray.slice(item.start, item.end + 1);
    jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(""));
  });
  // 奖处理后的数组通过\r\n连接符重组为字符串
  jsonString = jsonArray.join("\r\n");
  // 将匹配到:后为回车换行加大括号替换为冒号加大括号
  jsonString = jsonString.replace(/\:\r\n\{/g, ":{");
  // 将匹配到:后为回车换行加中括号替换为冒号加中括号
  jsonString = jsonString.replace(/\:\r\n\[/g, ":[");
  // 将上述转换后的字符串再次以\r\n分割成数组
  jsonArray = jsonString.split("\r\n");
  // 将转换完成的字符串根据PADDING值来组合成最终的形态
  jsonArray.forEach(function (item, index) {
    console.log(item);
    var i = 0;
    // 表示缩进的位数，以tab作为计数单位
    var indent = 0;
    // 表示缩进的位数，以空格作为计数单位
    var padding = "";
    if (item.match(/\{$/) || item.match(/\[$/)) {
      // 匹配到以{和[结尾的时候indent加1
      indent += 1;
    } else if (
      item.match(/\}$/) ||
      item.match(/\]$/) ||
      item.match(/\},$/) ||
      item.match(/\],$/)
    ) {
      // 匹配到以}和]结尾的时候indent减1
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }
    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }
    formatted += padding + item + "\r\n";
    pad += indent;
  });
  // 返回的数据需要去除两边的空格
  return formatted.trim();
}
