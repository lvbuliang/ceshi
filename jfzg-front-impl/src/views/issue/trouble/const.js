// 问题
export const moduleCode = '18004';// 模板code
export const permissionCode = 'M007_M002_002';// table header code
export const TYPELIST = [// 进度风险
  { label: "进度风险", value: 1 },
  { label: "质量风险", value: 2 },
  { label: "流程风险", value: 3 },
]
export const QUESSTION_TYPELIST = [
  { label: "进度问题", value: 1 },
  { label: "质量问题", value: 2 },
  { label: "流程问题", value: 3 },
]
export const LEVEILIST = [// 优先级
  { label: "轻度风险", value: 1 },
  { label: "中度风险", value: 2 },
  { label: "高度风险", value: 3 },
]

export const LEVEIIMGLIST = [// 优先级图片
  { label: "轻度风险", img: `<img class="iconImg" src="require(@/assets/riskTrouble/low.png)" />` },
  { label: "中度风险", img: `<img class="iconImg" src="require(@/assets/riskTrouble/middle.png)" />` },
  { label: "高度风险", img: `<img class="iconImg" src="require(@/assets/riskTrouble/high.png)" />` },
]

export const FROMLIST = [// 风险来源
  { label: "项目建设内容完整性", value: 1 },
]

export const BASISLIST = [// 风险定级依据
  { label: "存在重复建设情况的", value: 1 },
]