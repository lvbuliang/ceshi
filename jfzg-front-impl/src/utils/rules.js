export function getRules() { // message和trigger可由页面传入
  const rules = {
    // 必填
    requiredText: [{
      required: true,
      message: '必填',
      trigger: 'blur'
    }],
    requiredFalseText: [{
      required: false,
      message: '必填',
      trigger: 'blur'
    }],
    maxLength: [{ // 限制字数，
      max: 100,
      trigger: 'blur',
      message: '输入超过20字'
    }],
    regular: [{ // 指定正则
      pattern: /^((1[345678]\d{9})|(0\d{2,3}-?\d{7,8}))$/,
      message: '目前只支持中国大陆的手机号码或固定电话',
      trigger: 'blur'
    }],
    validator: [{
      validator: (rule, value, callback) => {
        callback();
      },
      trigger: 'blur'
    }],
    requiredNotText: [{
      required: true,
      message: '请选择',
      trigger: 'change'
    }],
    requiredIsArray: [{
      type: 'array',
      required: true,
      message: '请选择',
      trigger: 'change'
    }],
    // 手机号码
    isphone: [{
      pattern: /^((1[345678]\d{9})|(0\d{2,3}-?\d{7,8}))$/,
      message: '目前只支持中国大陆的手机号码或固定电话',
      trigger: 'blur'
    }],
    // 密码
    isPWD: [{
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
      message: '只允许设置8-20位数字和字母的密码',
      trigger: 'blur'
    }],
    //邮箱验证
    isEmail: [{
      pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
      message: '只能输入邮箱的格式',
      trigger: 'blur'
    }],
    // 输入长度限制
    textMax20: [{
      max: 20,
      trigger: 'blur',
      message: '输入超过20字'
    }],
    textMax50: [{
      max: 50,
      trigger: 'blur',
      message: '输入超过50字'
    }],
    textMax100: [{
      max: 100,
      trigger: 'blur',
      message: '输入超过100字'
    }],
    // 金额（小数点之前8位，小数点之后2位）
    isMoney: [{
      pattern: /^([1-9]\d{0,7})$|^(0|[1-9]\d{0,7})\.(\d{1,2})$/,
      message: '请输入正确金额，保留小数点后两位'
    }],
    //金额11位
    isMoney11: [{
      pattern: /^\d{11}$/,
      message: '最多输入11位'
    }],

    // 正整数
    isNumber: [{
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数'
    }],
    // 数组
    isArrayList: [{
      type: 'array',
      required: true,
      message: '请至少选择一个',
      trigger: 'change'
    }],
    isURL: [{
      pattern: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/,
      message: '请输入网址',
      trigger: 'blur'
    }],
    regularList: {
      Number1: /^(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)$/, // 大于零的两位小数
      Number2: /(^([-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^([-]?)(0){1}$)|(^([-]?)[0-9]\.[0-9]([0-9])?$)/, // 数字两位小数
      Number3: /^[1-9]\d*$/,
      Number4: /^\d+$/,
      Number5: /^(^[0-9](\d{1,17})?(\.\d{1,4})?$)$/, // 必须大于等于零的且不能超过四位小数
      text1: /^[\u4e00-\u9fa5]{0,}$/, // 中文
      rate: /^[1-5]$/,
      // 身份证号
      IdCard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      // 银行卡号
      BankCard: /^([1-9]{1})(\d{12}|\d{15}|\d{18})$/,
      // 邮箱
      Email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
      NumberText: /^[0-9a-zA-Z]*$/,
    }
  }

  return rules
}