// 问题
export const moduleCode = '17009';// 模板code
export const permissionCode = 'M005_008';// table header code


export const TYPELIST = [// 类型
  { label: "进度风险", value: 1 },
  { label: "质量风险", value: 2 },
  { label: "流程风险", value: 3 },
]
export const TROUBLETYPE = [// 类型
  { label: "内部问题", value: 1 },
  { label: "外部问题", value: 2 },
  { label: "云网问题", value: 3 },
]
export const TYPESTATUS = [// 状态
  { label: "处理中", value: 1 },
  { label: "已解决", value: 2 },
  // { label: "已解决", value: 3 },
  // { label: "未解决", value: 1 },
  // { label: "处理中", value: 2 },
  // { label: "已解决", value: 3 },
]
export const LEVEILIST = [// 等级
  { label: "轻微", value: 1 },
  { label: "一般", value: 2 },
  { label: "严重", value: 3 },
]

export const LEVEIIMGLIST = [// 等级图片
  { label: "轻度", img: `<img class="iconImg" src="require('@/assets/riskTrouble/low.png')" />` },
  { label: "中度", img: `<img class="iconImg" src="require('@/assets/riskTrouble/middle.png')" />` },
  { label: "高度", img: `<img class="iconImg" src="require('@/assets/riskTrouble/high.png')" />` },
]
export const MILESTONELIST = [// 所属里程碑
  { label: "启动", value: 1 },
  { label: "验收", value: 2 },
]

export const SOURCELIST = [// 风险来源（出处）
  { label: "进度检查", value: 1 },
  { label: "质量检查", value: 2 },
  { label: "其他", value: 0 },
]