// 全部数据 管理员 FZGHC_JBRBF
export const statusListAll = [
  {
    value: 1,
    label: "未提交",
  },
  {
    value: 3,
    label: "已提交",
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
    value: 401,
    label: "同意开工-待审核",
  },
  {
    value: 402,
    label: "同意开工-退回修改",
  },
  {
    value: 403,
    label: "同意开工-不通过",
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
  {
    value: 3,
    label: "已提交",
  },
];

// 监理工程师审批 JLGCS
export const statusList2 = [
  {
    value: 2,
    label: "待审核",
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
    value: 401,
    label: "同意开工-待审核",
  },
  {
    value: 402,
    label: "同意开工-退回修改",
  },
  {
    value: 403,
    label: "同意开工-不通过",
  },
];

// 项目负责人审核 XMFZR
export const statusList3 = [
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

  if (roleCode == "XMFZR") {
    // 项目负责人
    return statusList3;
  }
};


// 根据code码返回状态中文
export const returnStatusNameByValue = (code) => {
  return statusListAll.find(item => item.value == code)?.label || '未提交'
}
