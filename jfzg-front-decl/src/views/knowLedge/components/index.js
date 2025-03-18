let form1 = {
  otherConfig: {
    labelNum: 140,
  },
  config: [
    {
      type: "input",
      name: "标题",
      placeholder: "请输入",
      bind: "knowledgeName",
      col: 24,
      required: "名称必填",
    },
    {
      type: "slot",
      slotName: "notificationType",
      name: "通知类型",
      placeholder: "请选择",
      col: 24,
      class: "customClass",
    },
    // {
    //   type: "slot",
    //   slotName: "departScope",
    //   name: "按部门发布",
    //   placeholder: "请选择",
    //   col: 12,
    //   class: "customClass",
    // },
    // {
    //   type: "slot",
    //   slotName: "staffScope",
    //   name: "按人员发布",
    //   placeholder: "请选择",
    //   col: 12,
    //   class: "customClass",
    // },
    {
      type: "slot",
      slotName: "viewScope",
      name: "按角色发布",
      placeholder: "请选择",
      col: 24,
      class: "customClass",
    },

    {
      type: "slot",
      slotName: "validTime",
      name: "有效时间",
      placeholder: "请选择",
      col: 24,
      class: "customClass",
      required: "有效时间必填",
    },
    // {
    //   type: "slot",
    //   slotName: "remarks",
    //   name: "备注",
    //   col: 24,
    // },
    {
      slotName: "remarks",
      type: "slot",
      name: "正文",
      placeholder: "请输入正文",
      bind: "remarks",
      col: 24,
      maxlength: 1000,
      trigger: "blur",
      minHeight: 150,
      resize: "none",
      required: "正文不能为空",
      items: [
        "formatblock",
        // "fontname",
        "fontsize",
        "|",
        "forecolor", // 文字颜色
        "hilitecolor", // 背景颜色
        "bold", // 加粗
        "italic", // 斜体
        "underline", // 下划线
        // "strikethrough", // 删除线
        "lineheight", // 行距
        "|",
        "justifyleft",
        "justifycenter",
        "justifyright",
        "justifyfull",
        "insertorderedlist",
        "insertunorderedlist",
        "indent",
        "outdent",
      ],
    },
    {
      type: "upload",
      name: "相关附件",
      bind: "uploadFiles",
      fileList: [],
      fileSize: 500,
      fileType: FILE_TYPES,
      fileTip: `仅支持上传${FILE_TYPES}格式文件!`,
      limit: 10,
      tipPopover: true, // hover显示提示  默认外面显示
      col: 24,
      // required: "请上传附件",
    },
  ],
  data: {
    knowledgeName: "",
    notificationType: "0",
    // departScope: null, // 按部门发布
    // staffScope: null, // 按人员发布
    viewScope: null,
    remarks: "",
    uploadFiles: [], // 文件上传

    createTime: "", // 起始时间
    endTime: "", // 结束时间
  },
  enums: {},
};

let form2 = {
    otherConfig: {
      labelNum: 140,
    },
    config: [
      {
        type: "input",
        name: "标题",
        placeholder: "请输入",
        bind: "knowledgeName",
        col: 24,
        required: "名称必填",
      },
      {
        type: "slot",
        slotName: "notificationType",
        name: "通知类型",
        placeholder: "请选择",
        col: 24,
        class: "customClass",
      },
      // {
      //   type: "slot",
      //   slotName: "departScope",
      //   name: "按部门发布",
      //   placeholder: "请选择",
      //   col: 12,
      //   class: "customClass",
      // },
      // {
      //   type: "slot",
      //   slotName: "staffScope",
      //   name: "按人员发布",
      //   placeholder: "请选择",
      //   col: 12,
      //   class: "customClass",
      // },
      {
        type: "slot",
        slotName: "viewScope",
        name: "按角色发布",
        placeholder: "请选择",
        col: 24,
        class: "customClass",
      },
  
      {
        type: "slot",
        slotName: "validTime",
        name: "有效时间",
        placeholder: "请选择",
        col: 24,
        class: "customClass",
        required: "有效时间必填",
      },
      // {
      //   type: "slot",
      //   slotName: "remarks",
      //   name: "备注",
      //   col: 24,
      // },
      {
        slotName: "remarks",
        type: "slot",
        name: "正文",
        placeholder: "请输入正文",
        bind: "remarks",
        col: 24,
        maxlength: 1000,
        trigger: "blur",
        minHeight: 150,
        resize: "none",
        required: "正文不能为空",
        items: [
          "formatblock",
          // "fontname",
          "fontsize",
          "|",
          "forecolor", // 文字颜色
          "hilitecolor", // 背景颜色
          "bold", // 加粗
          "italic", // 斜体
          "underline", // 下划线
          // "strikethrough", // 删除线
          "lineheight", // 行距
          "|",
          "justifyleft",
          "justifycenter",
          "justifyright",
          "justifyfull",
          "insertorderedlist",
          "insertunorderedlist",
          "indent",
          "outdent",
        ],
      },
      {
        type: "upload",
        name: "相关附件",
        bind: "uploadFiles",
        fileList: [],
        fileSize: 500,
        fileType: FILE_TYPES,
        fileTip: `仅支持上传${FILE_TYPES}格式文件!`,
        limit: 10,
        tipPopover: true, // hover显示提示  默认外面显示
        col: 24,
        // required: "请上传附件",
      },
    ],
    data: {
      knowledgeName: "",
      notificationType: "0",
      // departScope: null, // 按部门发布
      // staffScope: null, // 按人员发布
      viewScope: null,
      remarks: "",
      uploadFiles: [], // 文件上传
  
      createTime: "", // 起始时间
      endTime: "", // 结束时间
    },
    enums: {},
  };
  
