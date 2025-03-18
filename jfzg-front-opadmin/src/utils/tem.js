/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/**
 * num 小于0，左缩进num*2个空格； 大于0，右缩进num*2个空格。
 * @param {string} str 代码
 * @param {number} num 缩进次数
 * @param {number} len 【可选】缩进单位，空格数
 */
 export function indent(str, num, len = 2) {
    if (num === 0) return str
    const isLeft = num < 0; const result = []; let reg; let
      spaces = ''
    if (isLeft) {
      num *= -1
      reg = new RegExp(`(^\\s{0,${num * len}})`, 'g')
    } else {
      for (let i = 0; i < num * len; i++) spaces += ' '
    }
  
    str.split('\n').forEach(line => {
      line = isLeft ? line.replace(reg, '') : spaces + line
      result.push(line)
    })
    return result.join('\n')
  }
  
  // 首字母大小
  export function titleCase(str) {
    return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
  }
  
  // 下划转驼峰
  export function camelCase(str) {
    return str.replace(/-[a-z]/g, str1 => str1.substr(-1).toUpperCase())
  }
  
  export function isNumberStr(str) {
    return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
  }
  
  export const exportDefault = 'export default '
  
  export const beautifierConf = {
    html: {
      indent_size: '2',
      indent_char: ' ',
      max_preserve_newlines: '-1',
      preserve_newlines: false,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'separate',
      brace_style: 'end-expand',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: true,
      wrap_line_length: '110',
      indent_inner_html: true,
      comma_first: false,
      e4x: true,
      indent_empty_lines: true
    },
    js: {
      indent_size: '2',
      indent_char: ' ',
      max_preserve_newlines: '-1',
      preserve_newlines: false,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'normal',
      brace_style: 'end-expand',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: true,
      end_with_newline: true,
      wrap_line_length: '110',
      indent_inner_html: true,
      comma_first: false,
      e4x: true,
      indent_empty_lines: true
    }
  }
  
  function stringify(obj) {
    return JSON.stringify(obj, (key, val) => {
      if (typeof val === 'function') {
        return `${val}`
      }
      return val
    })
  }
  
  function parse(str) {
    JSON.parse(str, (k, v) => {
      if (v.indexOf && v.indexOf('function') > -1) {
        return eval(`(${v})`)
      }
      return v
    })
  }
  
  export function jsonClone(obj) {
    return parse(stringify(obj))
  }
  
  // 深拷贝对象
  export function deepClone(obj) {
    const _toString = Object.prototype.toString
  
    // null, undefined, non-object, function
    if (!obj || typeof obj !== 'object') {
      return obj
    }
  
    // DOM Node
    if (obj.nodeType && 'cloneNode' in obj) {
      return obj.cloneNode(true)
    }
  
    // Date
    if (_toString.call(obj) === '[object Date]') {
      return new Date(obj.getTime())
    }
  
    // RegExp
    if (_toString.call(obj) === '[object RegExp]') {
      const flags = []
      if (obj.global) { flags.push('g') }
      if (obj.multiline) { flags.push('m') }
      if (obj.ignoreCase) { flags.push('i') }
  
      return new RegExp(obj.source, flags.join(''))
    }
  
    const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}
  
    for (const key in obj) {
      result[key] = deepClone(obj[key])
    }
  
    return result
  }
  
  export function formatFormAddConfig(data) {
    // 把widgetForm组件转成formAdd的配置项
    let result = {
      config: [],
      data: {},
      otherConfig: {
        labelNum: 130
      }
    }
    if (data && data.list && data.list.length>0) {
      let config = []
      let formDataItem = {}
      let enums = {}
      data.list.map(item => {
        if (item.options && item.options.options && item.options.dataList) {
          enums[item.options.dataList] = item.options.options
        }
        let formConfigItem = {
          key: item.key,
          type: item.type
        }
        for (let opitem in item.options){
          if (opitem != 'options' && opitem != 'defaultValue') {
            formConfigItem[opitem] = item.options[opitem]
          }
        }
        if (item.rule) {
          if (item.rule.required) {
            formConfigItem['required'] = item.options.name + '为必填项'
          } else {
            delete formConfigItem.required
          }
          formConfigItem['trigger'] = item.rule.trigger
          let rules = {}

          if (item.rule.list && item.rule.list.length && item.rule.list.length > 0) {
            item.rule.list.map(ruleItem => {
              if (ruleItem.type == 1) {
                // 内置规则名
                rules['regular_'+ruleItem.ruleName] = ruleItem.errorTip
              } else {
                // 自定义正则
                if (ruleItem && ruleItem.expression) {
                  const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
                  rules['define_'+key] = {
                    pattern: ruleItem.expression,
                    message: ruleItem.errorTip,
                    trigger: item.rule.trigger
                  }
                }
              }
            })
          } else {
            rules = item.rule.list
          }
          formConfigItem['rules'] = rules
        }
        if (item.type === 'checkbox') {
          formDataItem[formConfigItem.bind] = []
        } else if (item.type === 'dateRelevancy') {
          let dateRelevancyObj = {}
          dateRelevancyObj[formConfigItem.startname] = ''
          dateRelevancyObj[formConfigItem.endname] = ''
          formDataItem[formConfigItem.bind] = dateRelevancyObj
        } else if (item.type === 'star' || item.type === 'number'){
          formDataItem[formConfigItem.bind] = 0
        } else {
          formDataItem[formConfigItem.bind] = ''
        }
        config.push(formConfigItem)
      })
      result['config'] = config
      result['data'] = formDataItem
      result['enums'] = enums
    }
    result['otherConfig']['labelNum'] = data.config.labelNum
    return result
  }