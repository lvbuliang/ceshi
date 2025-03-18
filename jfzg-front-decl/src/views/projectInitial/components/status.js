// 全部数据 管理员 FZGHC_JBRBF
export const statusListAll = [
  {
    value: 1,
    label: "未提交",
  },
  {
    value: 2,
    label: "监理工程师-待审核",
  },
  {
    value: 202,
    label: "监理工程师-退回修改",
  },
  {
    value: 203,
    label: "监理工程师-不通过",
  },
  {
    value: 204,
    label: "监理工程师-通过",
  },
  {
    value: 301,
    label: "项目负责人-待审核",
  },
  {
    value: 302,
    label: "项目负责人-退回修改",
  },
  {
    value: 303,
    label: "项目负责人-不通过",
  },
  {
    value: 304,
    label: "项目负责人-通过",
  },
  {
    value: 305,
    label: "评审小组-待审核",
  },
  {
    value: 306,
    label: "评审小组-不通过",
  },
  {
    value: 307,
    label: "评审小组-退回修改",
  },
  {
    value: 308,
    label: "评审小组-通过",
  },
  {
    value: 309,
    label: "通过初验-待审核",
  },
  {
    value: 410,
    label: "通过初验-不通过",
  },
  {
    value: 411,
    label: "通过初验-退回修改",
  },
  {
    value: 1000,
    label: "通过",
  },
];

// 承建单位_项目经理 CJDW_XMJL
export const statusList1 = [
  {
    value: 1,
    label: "未提交",
  },
];

// 监理工程师审批 JLGCS
export const statusList2 = [
  {
    value: 202,
    label: "监理工程师-退回修改",
  },
  {
    value: 203,
    label: "监理工程师-不通过",
  },
  {
    value: 204,
    label: "监理工程师-通过",
  },
];

// 评审小组 
export const statusList3 = [
  {
    value: 305,
    label: "评审小组-待审核",
  },
  {
    value: 306,
    label: "评审小组-不通过",
  },
  {
    value: 307,
    label: "评审小组-退回修改",
  },
  {
    value: 308,
    label: "评审小组-通过",
  },
]

// 项目负责人审核 XMFZR
export const statusList4 = [
  {
    value: 301,
    label: "项目负责人-待审核",
  },
  {
    value: 302,
    label: "项目负责人-退回修改",
  },
  {
    value: 303,
    label: "项目负责人-不通过",
  },
  {
    value: 304,
    label: "项目负责人-通过",
  },
  {
    value: 309,
    label: "通过初验-待审核",
  },
  {
    value: 410,
    label: "通过初验-不通过",
  },
  {
    value: 411,
    label: "通过初验-退回修改",
  },
];

// 根据用户角色获取状态下拉选数据
export const getStatusListByRoleCode = (roleCode, status) => {
  if (roleCode == "FZGHC_JBRBF") {
    return statusListAll;
  }

  if (roleCode == "CJDW_XMJL") {
    // 承建单位_项目经理
    return statusList1;
  }

  if (roleCode == "JLGCS") {
    // 监理工程师
    return statusList2;
  }

  if (roleCode == "PSXZ_CY") {
    // 评审小组
    return statusList3;
  }

  if (roleCode == "XMFZR") {
    // 项目负责人
    return statusList4;
  } 
};


// 根据code码返回状态中文
export const returnStatusNameByValue = (code) => {
  return statusListAll.find(item => item.value == code)?.label || '未提交'
}
