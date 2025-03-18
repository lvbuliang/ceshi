import request from '@/utils/request'
import request1 from '@/utils/axios'
export function api_getAppConfigs() {
  let isDev = process.env.NODE_ENV === 'development'
  let planEntry = window.location.origin + '/plan/#'
  let declEntry = window.location.origin + '/decl/#'
  let implEntry = window.location.origin + '/impl/#'
  if (isDev) {
    planEntry = '//localhost:2753'
    declEntry = '//localhost:2756'
    implEntry = '//localhost:2757'
  }
  let subApps = [
    {
      module: 'subapp-plan',
      title: '规划管理',
      defaultRegister: true,
      entry: planEntry,
      routerBase: '/subplan',
      data: [
        {
          permissionId: '1',
          title: '规划管理',
          routerBase: '/subplan',
          icon: 'menu-ghgl@2x.png',
          children: [
            {
              permissionId: '1-1',
              title: '专项发展规划',
              url: '/subplan/#/special',
            },
            {
              permissionId: '1-2',
              title: '总体发展规划',
              url: '/subplan/#/total',
            },
            {
              permissionId: '1-3',
              title: '项目库管理',
              url: '/subplan/#/projectLibrary',
            },
          ],
        },
      ],
    },
    {
      module: 'subapp-plan',
      title: '资产管理',
      defaultRegister: true,
      entry: planEntry,
      routerBase: '/subplan',
      data: [
        {
          permissionId: '1',
          title: '资产管理',
          routerBase: '/subplan',
          icon: 'menu-ghgl@2x.png',
          children: [
            {
              permissionId: '1-1',
              title: '资产管理',
              url: '/subplan/#/special',
            },
          ],
        },
      ],
    },
    {
      module: 'subapp-shenbao',
      title: '项目申报',
      defaultRegister: false,
      entry: declEntry,
      routerBase: '/subshenbao',
      data: [
        {
          permissionId: '2',
          title: '项目申报',
          routerBase: '/subshenbao',
          icon: 'menu-sbgl@2x.png',
          children: [
            {
              permissionId: '2-1',
              title: '年度计划查询',
              url: '/subshenbao/#/yearplan',
            },
            {
              permissionId: '2-2',
              title: '年度计划项目申报',
              url: '/subshenbao/#/planedProject',
            },
            {
              permissionId: '2-3',
              title: '计划外项目申报',
              url: '/subshenbao/#/unplanedProject',
            },
            {
              permissionId: '2-4',
              title: '项目可研性研究',
              url: '/subshenbao/#/keyan',
            },
            {
              permissionId: '2-5',
              title: '项目初设及概算',
              url: '/subshenbao/#/chushe',
            },
            {
              permissionId: '2-6',
              title: '设计公司查询',
              url: '/subshenbao/#/design',
              children: [
                {
                  permissionId: '2-6-1',
                  title: '设计公司列表',
                  url: '/subshenbao/#/design/company',
                },
                {
                  permissionId: '2-6-2',
                  title: '设计公司人员列表',
                  url: '/subshenbao/#/design/person',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      module: 'subapp-decl',
      title: '项目审批',
      defaultRegister: false,
      entry: declEntry,
      routerBase: '/subdecl',
      data: [
        {
          permissionId: '3',
          title: '项目审批',
          routerBase: '/subdecl',
          icon: 'menu-spgl@2x.png',
          children: [
            {
              permissionId: '3-1',
              title: '年度计划管理',
              url: '/subdecl/#/yearplanAudit',
            },
            {
              permissionId: '3-2',
              title: '年度计划项目审批',
              url: '/subdecl/#/planedProjectAudit',
            },
            {
              permissionId: '3-3',
              title: '计划外项目审批',
              url: '/subdecl/#/unplanedProjectAudit',
            },
            {
              permissionId: '3-4',
              title: '可研性研究审批',
              url: '/subdecl/#/keyanAudit',
            },
            {
              permissionId: '3-5',
              title: '初设及概算审批',
              url: '/subdecl/#/chusheAudit',
            },
            {
              permissionId: '3-6',
              title: '设计公司管理与评价',
              url: '/subdecl/#/designAudit',
              children: [
                {
                  permissionId: '3-6-1',
                  title: '设计公司列表',
                  url: '/subdecl/#/designAudit/companyAudit',
                },
                {
                  permissionId: '3-6-2',
                  title: '设计公司人员列表',
                  url: '/subdecl/#/designAudit/personAudit',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      module: 'subapp-impl',
      title: '实施管理',
      defaultRegister: true,
      entry: implEntry,
      routerBase: '/subimpl',
      data: [
        {
          permissionId: '4',
          title: '实施管理',
          routerBase: '/subimpl',
          icon: 'menu-ghgl@2x.png',
          children: [
            {
              permissionId: '4-1',
              title: '合同信息管理',
              url: '/subimpl/#/contract',
            },
            {
              permissionId: '4-2',
              title: '专家列表',
              url: '/subimpl/#/expert',
            },
          ],
        },
      ],
    },
    {
      module: 'subapp-dis',
      title: '调度管理',
      defaultRegister: true,
      entry: implEntry,
      routerBase: '/subdis',
      data: [
        {
          permissionId: '5',
          title: '调度管理',
          routerBase: '/subdis',
          icon: 'menu-ghgl@2x.png',
          children: [
            {
              permissionId: '5-1',
              title: '项目报送与报备',
              url: '/subdis/#/report',
            },
            {
              permissionId: '5-2',
              title: '风险问题管理',
              url: '/subdis/#/issue',
            },
            {
              permissionId: '5-3',
              title: '项目启停管理',
              url: '/subdis/#/startStop',
            },
          ],
        },
      ],
    },
  ]
  return new Promise((resolve) => {
    resolve({
      msg: {
        code: '0000',
        message: 'SUCCESS',
      },
      data: subApps,
    })
  })
}

export function api_queryNeedDoCount(data) {
  return request({
    url: `/Api/GetAppConfigs1`,
    method: 'post',
    data,
  })
}

export function api_queryDoList(data) {
  return request({
    url: `/Api/listSchdule`,
    method: 'post',
    data,
  })
}

export function api_getFullname(data, url) {
  return request({
    url: `${url}/jfzg/ucenter/users/queryAllUserRoleInfos`,
    method: 'post',
    data,
  })
}

export function is_quick(data, url) {
  return request({
    url: `${url}/jfzg/commonapi/dict/queryDictsIgnoreAuth`,
    method: 'post',
    data,
  })
}

export function is_yaoqing(url) {
  return request({
    url: `${url}/jfzg/uaa/validata/invitationCodeLoginSwitch`,
    method: 'get',
  })
}

//工作流按钮点击接口
export function api_afferentUrlOfGet(url, params) {
  return request({
    url: url,
    method: 'get',
    params,
  })
}
// 短信验证码
export function send_clyz(data) {
  return request({
    url: 'jfzg/commonapi/api/sms/sendClyz',
    method: 'post',
    data
  })
}
//获取自定义表单（单个模板）
export function api_getCustomFormTemplate(params) {
  return request({
    url: '/jfzg/opcenter/customFormTemplate/getCustomFormTemplate',
    method: 'get',
    params,
  })
}

// 表头接口
export function api_userSetQuery(params) {
  return request({
    url: `/jfzg/commonapi/api/userSet/query`,
    method: 'get',
    params,
  })
}

// 表头保存
export function api_userSetSave(data) {
  return request({
    url: `/jfzg/commonapi/api/userSet/save`,
    method: 'post',
    data,
  })
}

// 字典表
export function listByTopicAndItem(params) {
  return request({
    url: `/jfzg/commonapi/dict/listByTopicAndItem`,
    method: 'get',
    params,
  })
}

//获取项目库总体规划
export function queryAll(params) {
  return request({
    url: `/jfzg/pm-plan/api/globalPlan/queryAll`,
    method: 'get',
    params,
  })
}

//获取建设单位
export function queryBizunitsByProperty(data) {
  return request({
    url: '/jfzg/ucenter/bizUnit/queryBizunitsByProperty',
    method: 'post',
    data,
  })
}

// 根据项目Id获取交付物附件列表
export function api_getdeliverListById(params) {
  return request({
    url: `/jfzg/projectImpl/delivery/getDeliveryList`,
    method: 'get',
    params,
  })
}

//获取建设单位
export function queryBizunitsByProperties(data) {
  return request({
    url: '/jfzg/ucenter/bizUnit/queryBizunitsByProperties',
    method: 'post',
    data,
  })
}
