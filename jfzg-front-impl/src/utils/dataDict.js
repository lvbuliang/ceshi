/**
 * 带审批的状态下拉
 */
const stateList = [{
    dataName: '已提交',
    dataValue: 1
  },
  {
    dataName: '已提审',
    dataValue: 2
  },
  {
    dataName: '已发布',
    dataValue: 3
  },
  {
    dataName: '停用',
    dataValue: 4
  },
  {
    dataName: '驳回',
    dataValue: 5
  },
  {
    dataName: '整改',
    dataValue: 6
  }
]

const stateListcopy = [{
    dataName: '待提审',
    dataValue: 1
  },
  {
    dataName: '审批中',
    dataValue: 2
  },
  {
    dataName: '审批通过',
    dataValue: 3
  },
  {
    dataName: '驳回',
    dataValue: 5
  }
]

// 可研审批状态
const keyanStatus = [{
    dataName: '待提审',
    dataValue: 1
  },
  {
    dataName: '审批中',
    dataValue: 2
  },
  {
    dataName: '审批通过',
    dataValue: 3
  },
  {
    dataName: '驳回',
    dataValue: 5
  },
  {
    dataName: '整改',
    dataValue: 6
  }
]

// 项目的登记状态
const djStatusList = [{
    dataName: "已登记",
    dataValue: 1,
    color: '#35A7FF'
  },
  {
    dataName: "待登记",
    dataValue: 2,
    color: '#52C41A'
  }
]


// 专项/中长期项目中的审批状态
const zxStatusList = [{
    dataName: "待提审",
    dataValue: 1,
    color: '#FF9535'
  },
  {
    dataName: "审批中",
    dataValue: 2,
    color: '#35A7FF'
  },
  {
    dataName: "审批通过",
    dataValue: 3,
    color: '#52C41A'
  },
  {
    dataName: "驳回",
    dataValue: 5,
    color: '#52C41A'
  },

]

/**
 * 中长期是否开发区项目
 */
const developmentFlagList = [{
    dataName: "否",
    dataValue: 0,
    color: '#5856D6'
  },
  {
    dataName: "是",
    dataValue: 1,
    color: '#1890FF'
  },
]

// 专家职称
const positionalTitleList = [{
    dataName: '初级职称',
    dataValue: 1
  },
  {
    dataName: '中级职称',
    dataValue: 2
  },
  {
    dataName: '副高职称',
    dataValue: 3
  },
  {
    dataName: '正高职称',
    dataValue: 4
  },
]

// 服务内容
const serviceContent = [{
    dataName: '服务内容一',
    dataValue: 1
  },
  {
    dataName: '服务内容二',
    dataValue: 2
  },
  {
    dataName: '服务内容三',
    dataValue: 3
  },
  {
    dataName: '服务内容四',
    dataValue: 4
  },
]
const meetingType = [{
    dataValue: 1,
    dataName: "变更评审会"
  },
  {
    dataValue: 2,
    dataName: "验收评审会"
  },
  {
    dataValue: 3,
    dataName: "技术方案评审会"
  },
  {
    dataValue: 4,
    dataName: "专业技术委员会"
  },
  {
    dataValue: 5,
    dataName: "专家咨询委员会"
  }
]
// 建设性质
const yhnatureConstruction = [{
    dataValue: '1',
    dataName: "新建"
  },
  {
    dataValue: '2',
    dataName: "续建"
  }, {
    dataValue: '3',
    dataName: "改建"
  }, {
    dataValue: '4',
    dataName: "扩建"
  }, {
    dataValue: '5',
    dataName: "运维"
  },
]

// 建设性质
const natureConstruction = [{
    dataValue: '1',
    dataName: "新建"
  },
  {
    dataValue: '2',
    dataName: "续建"
  }
]

//上云管理申请-审批状态-wtt
const shangyunStatus = [{
    dataValue: '1',
    dataName: "待提交"
  },
  {
    dataValue: '2',
    dataName: "待审核"
  },
  {
    dataValue: '3',
    dataName: "驳回"
  },
  {
    dataValue: '4',
    dataName: "受理"
  },
]

//云化测试-流程状态
const syTestStatus = [{
    dataValue: '1',
    dataName: "待发起"
  },
  {
    dataValue: '2',
    dataName: "待测试"
  },
  {
    dataValue: '3',
    dataName: "待汇总"
  },
  {
    dataValue: '4',
    dataName: "测试通过"
  },

]

//上云割接状态
const syCutoverSatus = [{
    dataValue: '0',
    dataName: "待割接"
  },
  {
    dataValue: '1',
    dataName: "已割接"
  },
]
// 信息采集 项目状态
const projectStatus = [{
    dataValue: 0,
    dataName: "启动"
  },
  {
    dataValue: 1,
    dataName: "暂停"
  },
  {
    dataValue: 2,
    dataName: "取消"
  }
]

// 项目所处阶段
const projectStages = [{
    dataValue: '1',
    dataName: "建设阶段"
  },
  {
    dataValue: '2',
    dataName: "初步验收阶段"
  },
  {
    dataValue: '3',
    dataName: "试运行"
  },
  {
    dataValue: '4',
    dataName: "竣工验收"
  },
]
// 风险关闭状态
const riskCloseStatus = [{
    dataValue: 0,
    dataName: "已关闭"
  },
  {
    dataValue: 1,
    dataName: "未关闭"
  }
]

// 风险管控 状态
const riskStatus = [{
    dataValue: 0,
    dataName: "处理中"
  },
  {
    dataValue: 1,
    dataName: "未处理"
  },
  {
    dataValue: 3,
    dataName: "已处理"
  },
  {
    dataValue: 4,
    dataName: "进入工单审核流程"
  },
  {
    dataValue: 5,
    dataName: "已关闭"
  }
]

// 风险等级
const riskLevels = [{
    dataValue: 2,
    dataName: "高度"
  },
  {
    dataValue: 1,
    dataName: "中度"
  },
  {
    dataValue: 0,
    dataName: "轻度"
  }
]
// 风险类型
const riskTypes = [{
    dataValue: 0,
    dataName: "进度风险"
  },
  {
    dataValue: 1,
    dataName: "质量风险"
  },
  {
    dataValue: 2,
    dataName: "流程风险"
  }
]
const riskSource1 = [{
    dataValue: 1,
    dataName: "通过评估项目实施方案科学性"
  },
  {
    dataValue: 2,
    dataName: "管理计划可行性"
  },
  {
    dataValue: 3,
    dataName: "里程碑设置合理性"
  },
  {
    dataValue: 4,
    dataName: "应急预案科学性"
  },
  {
    dataValue: 5,
    dataName: "组织机构设置情况"
  },
  {
    dataValue: 6,
    dataName: "进度控制情况等识别项目进度风险"
  }
]

const riskSource2 = [{
    dataValue: 7,
    dataName: "通过评估项目建设内容完整性"
  },
  {
    dataValue: 8,
    dataName: "需求确定性"
  },
  {
    dataValue: 9,
    dataName: "技术路线合理性"
  },
  {
    dataValue: 10,
    dataName: "信息安全测评情况"
  },
  {
    dataValue: 11,
    dataName: "数据共享情况等识别项目质量风险"
  }
]

const riskSource3 = [{
    dataValue: 12,
    dataName: "通过评估项目建设流程合理性"
  },
  {
    dataValue: 13,
    dataName: "项目变更程序完备性"
  },
  {
    dataValue: 14,
    dataName: "第三方咨询服务执行情况"
  }
]
// 问题
const problemLevels = [{
    dataValue: 2,
    dataName: "高度"
  },
  {
    dataValue: 1,
    dataName: "中度"
  },
  {
    dataValue: 0,
    dataName: "轻度"
  }
]
// 问题状态
const problemStatus = [{
    dataValue: 0,
    dataName: "处理中"
  },
  {
    dataValue: 1,
    dataName: "未关闭"
  },
  {
    dataValue: 3,
    dataName: "已处理"
  },
  {
    dataValue: 4,
    dataName: "进入工单审核流程"
  },
  {
    dataValue: 5,
    dataName: "已关闭"
  }
]

const problemTypes = [{
    dataValue: '1',
    dataName: "进度问题"
  },
  {
    dataValue: '2',
    dataName: "质量问题"
  },
  {
    dataValue: '3',
    dataName: "流程问题"
  }
]
// 调度类型
const resourceType = [{
    dataValue: 0,
    dataName: "基础资源调度"
  },
  {
    dataValue: 1,
    dataName: "跨资源调度"
  },
]
// 业务关联/系统复杂度
const REALX_TYPE = [{
    dataValue: "A",
    dataName: "A类，独立系统"
  },
  {
    dataValue: "B",
    dataName: "B类，部门内业务简单关联系统"
  },
  {
    dataValue: "C",
    dataName: "C类，部门内业务复杂关联系统、跨部门跨层级业务关联系统"
  }
]
// 上云申请状态
const SHANGYUN_STATUS = [{
    dataValue: '0',
    dataName: "待提交",
    class: "invalid round-state"
  },
  {
    dataValue: '1',
    dataName: "待受理",
    class: "inProgress round-state"
  },
  // {
  //   dataValue: '2',
  //   dataName: "审查",
  //   class: "waitAudit round-state"
  // },
  {
    dataValue: '3',
    dataName: "驳回",
    class: "disabled round-state"
  },
  {
    dataValue: '4',
    dataName: "受理",
    class: "enabled round-state"
  },
  {
    dataValue: '5',
    dataName: "扩容中",
    class: "enabled round-state"
  },
]

const SHANGYUN_STAGE = [{
    dataValue: 0,
    dataName: "上云申请",
  },
  {
    dataValue: 1,
    dataName: "方案编制",
  },
  {
    dataValue: 2,
    dataName: "上云评审",
  },
  {
    dataValue: 3,
    dataName: "部署实施",

  },
  {
    dataValue: 4,
    dataName: "云化测试",

  },
  {
    dataValue: 5,
    dataName: "云化测试报告",

  },

  {
    dataValue: 6,
    dataName: "云化扩容",

  },
  {
    dataValue: 7,
    dataName: "云化割接",

  },
  // {
  //   dataValue: 6,
  //   dataName: "扩容进行中",

  // },
  // {
  //   dataValue: 99,
  //   dataName: "中止",

  // },
]

const SYSQ_STATUS = [{
    dataValue: 1,
    dataName: "上云申请",

  },
  {
    dataValue: 0,
    dataName: "扩容申请",

  },
]
// 上云评审状态
const REVIEW_STATUS = [{
    dataValue: '0',
    dataName: "待编制",
    class: "invalid round-state"
  },
  {
    dataValue: 1,
    dataName: "待确认",
    class: "invalid round-state"
  },
  {
    dataValue: 2,
    dataName: "待分发",
    class: "waites round-state"
  },
  {
    dataValue: 3,
    dataName: "重新编制",
    class: "wait round-state"
  },
  {
    dataValue: 4,
    dataName: "待评审",
    class: "inProgress round-state"
  },
  {
    dataValue: 5,
    dataName: "已评审(当前部门)",
    class: "inProgress round-state"
  },
  {
    dataValue: 6,
    dataName: "评审驳回",
    class: "disabled round-state"
  },
  {
    dataValue: 7,
    dataName: "待汇总",
    class: "inProgress round-state"
  },
  {
    dataValue: 8,
    dataName: "已总结",
    class: "enabled round-state"
  },
  {
    dataValue: 9,
    dataName: "总结驳回",
    class: "wait round-state"
  },
  {
    dataValue: 10,
    dataName: "确认总结",
    class: "enabled round-state"
  },
  // {
  //   dataValue: 99,
  //   dataName: "项目终止",
  //   class: "disabled round-state"
  // },
]
// 服务器类型
const SERVER_TYPE = [
  // {
  //   dataName: "云主机",
  //   dataValue: 1,
  // },
  // {
  //   dataName: "虚拟主机",
  //   dataValue: 2,
  // },
]
// 上云各部门评审
const ZT_OPINION = [{
    dataName: "完备",
    dataValue: 2,
  },
  {
    dataName: "限期完善",
    dataValue: 1,
  },
  {
    dataName: "不通过",
    dataValue: 0,
  }
]
// 评审总结
const PSZG_list = [{
    dataName: "通过实施",
    dataValue: 1
  },
  {
    dataName: "先行实施同步完善",
    dataValue: 0
  }
]
const GBM_OPINION = [{
    dataName: "完备",
    dataValue: 2,
  },
  {
    dataName: "限期完善",
    dataValue: 1,
  }
]
// 部署实施-wxx
const SHISHI_LIST = [{
    dataName: "待发起",
    dataValue: '0', //
  },
  {
    dataName: "待资源部署",
    dataValue: 1,
  },
  {
    dataName: "待系统部署",
    dataValue: 2,
  },
  {
    dataName: "系统部署不通过",
    dataValue: 3,
  },
  {
    dataName: "系统部署通过",
    dataValue: 4,
  }
]
const ORG_TYPE = {
  wgwlb: 1,
  aqywb: 2,
  sjfwb: 4,
  jlgs: 16,
  sjfxb: 8,
  jsdw: 32,
}

// 上云-云化测试wtt
const syTestSatus = [{
    dataName: "待发起",
    dataValue: 0,
  },
  {
    dataName: "待测试",
    dataValue: 1,
  },
  {
    dataName: "驳回",
    dataValue: 2,
  },
  {
    dataName: "待汇总",
    dataValue: 3,
  },
  {
    dataName: "测试通过",
    dataValue: 4,
  },
  {
    dataName: "中止",
    dataValue: 99,
  },

]

// 调度-启停管理—wxx
const startStopSatus = [{
    dataName: "启动",
    dataValue: 0,
  },
  {
    dataName: "暂停",
    dataValue: 1,
  },
]

// 验收-100万上—wxx
const millionUpStatus = [{
    dataName: "验收申请",
    dataValue: 1,
  },
  {
    dataName: "待会前预审",
    dataValue: 2,
  },
  {
    dataName: "待会前复审",
    dataValue: 3,
  },
  {
    dataName: "待专家评审",
    dataValue: 4,
  },
  {
    dataName: "待会后预审",
    dataValue: 5,
  },
  {
    dataName: "待会后复审",
    dataValue: 6,
  },
  {
    dataName: "项目结项",
    dataValue: 7,
  }
]

// 验收-100万上全—wxx
const millionUpStatusAll = [{
    dataName: "验收申请",
    dataValue: 1,
  },
  {
    dataName: "待会前预审",
    dataValue: 2,
  },
  {
    dataName: "待会前预审确认",
    dataValue: 3,
  },
  {
    dataName: "待会前预审整改",
    dataValue: 4,
  },
  {
    dataName: "待会前复审",
    dataValue: 5,
  },
  {
    dataName: "待会前复审确认",
    dataValue: 6,
  },
  {
    dataName: "待会前复审整改",
    dataValue: 7,
  },
  {
    dataName: "待专家评审",
    dataValue: 8,
  },
  {
    dataName: "待专家评审整改",
    dataValue: 9,
  },
  {
    dataName: "待会后预审",
    dataValue: 10,
  },
  {
    dataName: "待会后预审确认",
    dataValue: 11,
  },
  {
    dataName: "待会后预审整改",
    dataValue: 12,
  },
  {
    dataName: "待会后复审",
    dataValue: 13,
  },
  {
    dataName: "待会后复审确认",
    dataValue: 14,
  },
  {
    dataName: "待会后复审整改",
    dataValue: 15,
  },
  {
    dataName: "待结项",
    dataValue: 16,
  },
  {
    dataName: "项目结项",
    dataValue: 17,
  },
]

// 设计公司——设计类型
const sjlxType = [{
    dataName: "可研",
    dataValue: 1,
  },
  {
    dataName: "初设及概算",
    dataValue: 2,
  },
]

// 评分筛选
const zhpfType = [{
    dataName: "0以上",
    dataValue: 1,
  },
  {
    dataName: "1以上",
    dataValue: 2,
  },
  {
    dataName: "2以上",
    dataValue: 3,
  },
  {
    dataName: "3以上",
    dataValue: 4,
  },
  {
    dataName: "4以上",
    dataValue: 5,
  },

]

//项目申报中的可研状态 -wtt
const xmSbKyStatus = [{
    dataName: "未可研",
    dataValue: 0,
  },
  {
    dataName: "未发起",
    dataValue: 1,
  },
  {
    dataName: "可研评审中",
    dataValue: 2,
  },
  {
    dataName: "可研通过",
    dataValue: 3,
  },
  {
    dataName: "审批不通过",
    dataValue: 4,
  },

]
const zxYuhuaStatusList = [{
    dataName: "待提审",
    dataValue: 1,
    color: '#FF9535'
  },
  {
    dataName: "待审批",
    dataValue: 4,
    color: '#35A7FF'
  },
  {
    dataName: "审批中",
    dataValue: 2,
    color: '#35A7FF'
  },
  {
    dataName: "审批通过",
    dataValue: 3,
    color: '#52C41A'
  },
  {
    dataName: "驳回",
    dataValue: 5,
    color: '#52C41A'
  },

]
//专报类型
const zbPaperType = [{
    dataName: "月报",
    dataValue: 0
  },
  {
    dataName: "季报",
    dataValue: 1,
  },
  {
    dataName: "年报",
    dataValue: 2,
  },
]
export default {
  stateList,
  zxStatusList,
  developmentFlagList,
  positionalTitleList,
  serviceContent,
  meetingType,
  shangyunStatus,
  natureConstruction,
  yhnatureConstruction,
  syTestStatus,
  projectStatus,
  projectStages,
  riskStatus,
  riskLevels,
  riskTypes,
  problemLevels,
  problemTypes,
  stateListcopy,
  resourceType,
  REALX_TYPE,
  REVIEW_STATUS,
  keyanStatus,
  syCutoverSatus,
  ORG_TYPE,
  GBM_OPINION,
  ZT_OPINION,
  syTestSatus,
  SHISHI_LIST,
  SHANGYUN_STATUS,
  SERVER_TYPE,
  PSZG_list,
  startStopSatus,
  millionUpStatus,
  millionUpStatusAll,
  sjlxType,
  zhpfType,
  xmSbKyStatus,
  problemStatus,
  riskSource1,
  riskSource2,
  riskSource3,
  riskCloseStatus,
  zxYuhuaStatusList,
  SHANGYUN_STAGE,
  SYSQ_STATUS,
  zbPaperType
}