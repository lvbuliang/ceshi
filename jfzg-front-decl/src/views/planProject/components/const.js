export const cjdwConfig = {
  otherConfig: {
    labelNum: 155,
  },
  config: [
    {
      type: "slot",
      slotName: "contractUnit",
      name: "承建单位",
      placeholder: "请选择",
      col: 8,
      filterable: true,
    },
    {
      type: "slot",
      slotName: "contractor",
      name: "承建单位项目经理",
      placeholder: "请选择",
      maxLength: 20,
      filterable: true,
      col: 8,
    },
    {
      type: "slot",
      slotName: "contractorPhoneNumber",
      name: "承建单位项目经理电话",
      placeholder: "请输入",
      bind: "contractorPhoneNumber",
      maxLength: 20,
      col: 8,
    },
    {
      type: "slot",
      slotName: "reportWriter",
      name: "周报填报人",
      placeholder: "请选择",
      bind: "weeklyPerson",
      maxLength: 16,
      class: "gg",
      col: 16,
    },
  ],
  data: {
    projectId: "", //项目id
    controlUnit: "", // 承建单位id
    contractUnitFullName: "", // 承建单位名称
    contractor: "", // 承建单位项目经理id
    contractorName: "", // 承建单位项目经理名称
    contractorPhoneNumber: "", // 承建单位项目经理电话
    weeklyPerson: "", // 周报审批人
    weeklyPersonId: "", // 周报审批人id
  },
  enums: {
    controlUnitFullName: [], // 承建单位
    contractorNameList: [], // 承建单位项目经理
  },
};

export const cjdwConfigData = {
  projectId: "", //项目id
    controlUnit: "", // 承建单位id
    contractUnitFullName: "", // 承建单位名称
    contractor: "", // 承建单位项目经理id
    contractorName: "", // 承建单位项目经理名称
    contractorPhoneNumber: "", // 承建单位项目经理电话
    weeklyPerson: "", // 周报审批人
    weeklyPersonId: "", // 周报审批人id
}

const a = {
  clientManagerId: 0,
  clientManagerName: "",
  contactId: 0,
  contactName: "",
  contractUnit: 0,
  contractUnitFullName: "",
  contractor: 0,
  contractorName: "",
  contractorPhoneNumber: "",
  controlJfid: 0,
  controlName: "",
  controlUnit: 0,
  controlUnitFullName: "",
  controlorPhoneNumber: "",
  memberFieldInfoDtos: [
    {
      contractUnit: 0,
      contractUnitFullName: "",
      contractor: 0,
      contractorName: "",
      contractorPhoneNumber: "",
      fieldNo: 0,
      projectId: 0,
      weeklyPerson: "",
      weeklyPersonId: 0,
    },
  ],
  procurementManagerId: 0,
  procurementManagerName: "",
  programManagerId: 0,
  programManagerName: "",
  projectIds: [],
  weeklyPerson: "",
  weeklyPersonId: 0,
};
