import { listByTopicAndItem } from "@/api/index.js";
// 风险
export const moduleCode = '18003';// 模板code
export const permissionCode = 'M007_M002_001';// table header code
export const TYPELIST = [// 进度风险
  { label: "进度风险", value: 1 },
  { label: "质量风险", value: 2 },
  { label: "流程风险", value: 3 },
]


export const FROMLIST = [// 风险来源
  { label: "项目建设内容完整性", value: 1 },
]

export const BASISLIST = [// 风险定级依据
  { label: "存在重复建设情况的", value: 1 },
]