// 风险
export const moduleCode = '17008';// 模板code
export const permissionCode = 'M005_003_002_001';// table header code

export const TYPELIST = [// 类型
  { label: "进度风险", value: 1 },
  { label: "质量风险", value: 2 },
  { label: "流程风险", value: 3 },
]

export const LEVEILIST = [// 等级
  { label: "轻度", value: 1 },
  { label: "中度", value: 2 },
  { label: "高度", value: 3 },
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