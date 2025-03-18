// // 全部数据 管理员 FZGHC_JBRBF
export const statusListAll = [
  {
    value: 0,
    label: "未提交",
  },
  {
    value: 2,
    label: "审核中",
  },
  {
    value: 4,
    label: "不通过",
  },
  {
    value: 5,
    label: "已完成",
  },
];

// 承建单位_项目经理 CJDW_XMJL
export const statusList1 = [
  {
    value: 0,
    label: "未提交",
  },
  {
    value: 4,
    label: "不通过",
  },
  {
    value: 3,
    label: "退回修改",
  },
  {
    value: 5,
    label: "审批完成",
  },
];

// 监理工程师审批 JLGCS
export const statusList2 = [
  {
    value: 1,
    label: "待审批",
  },
  {
    value: 5,
    label: "审批完成",
  },
  {
    value: 3,
    label: "退回修改",
  },
  {
    value: 4,
    label: "不通过",
  },
];

// 评审小组
export const statusList3 = [
  {
    value: 1,
    label: "待审批",
  },
  {
    value: 5,
    label: "审批完成",
  },
  {
    value: 3,
    label: "退回修改",
  },
  {
    value: 4,
    label: "不通过",
  },
];

// 项目负责人审核 XMFZR
export const statusList4 = [
  {
    value: 1,
    label: "待审批",
  },
  {
    value: 5,
    label: "审批完成",
  },
  {
    value: 3,
    label: "退回修改",
  },
  {
    value: 4,
    label: "不通过",
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
  return statusListAll.find((item) => item.value == code)?.label || "未提交";
};
