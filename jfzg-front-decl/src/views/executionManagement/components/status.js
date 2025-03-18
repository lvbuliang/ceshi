// 立项列表页面，状态查询条件枚举值优化
// 1、未提交：所有未发起流程；
// 2、审批中：所有在审批流程中的项目，包括退回修改的，只要在流程中。
// 3、已完成：所有流程通过的项目
// 4、不通过：所有流程为“不通过”的项目

// 全部数据 管理员 FZGHC_JBRBF
export const statusListAll = [
  {
    value: 0,
    label: "未提交",
  },
  {
    value: 2,
    label: "审批中",
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
    value: 2,
    label: "审批中",
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

// 监理工程师审批 JLGCS
export const statusList2 = [
  {
    value: 0,
    label: "未提交",
  },
  {
    value: 2,
    label: "审批中",
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

// 项目负责人审核 XMFZR
export const statusList3 = [
  {
    value: 0,
    label: "未提交",
  },
  {
    value: 2,
    label: "审批中",
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
  return statusListAll.find((item) => item.value == code)?.label || "未提交";
};
