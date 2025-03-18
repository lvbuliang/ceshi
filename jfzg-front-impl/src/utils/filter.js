import store from "../store";

//验证ip地址
export function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

/**
 * 根据 dataValue 获取 dataName
 * @param {String,Number} val
 * @param {String} type
 * @param {Array,Object} obj 选传，
 */
export function getDictValue(val, type, obj) {
    let dataName = val;
    let key = "dataValue";
    let arr = [];
    if (obj) {
        if (obj.constructor == Array) {
            arr = obj;
        } else if (obj.constructor == Object) {
            arr = obj.list;
            key = obj.key || "dataValue";
        }
        arr.map((res) => {
            if (res[key] == val) {
                dataName = res.dataName;
            }
        });
    } else {
        arr = store.getters.allSelect[type] || [];
        arr.map((res) => {
            if (res.dataValue == val) {
                dataName = res.dataName;
            }
        });
    }
    return dataName;
}
export function getProjectNameList(codeArr, list, key1 = 'dataValue', key2 = 'dataName', cut = "、") {
    let Array = []
    list.forEach(item => {
        codeArr.forEach(i => {
            if (i == item[key1]) {
                Array.push(item[key2])
            }

        })
    });
    return Array.join(cut)
}
export function getProjectTypeList(codeArr, list) {
    let Array = []
    list.forEach(item => {
        codeArr.forEach(i => {
            if (i == item.label) {
                Array.push(item.value)
            }
        })
    });
    return Array.join("、")
}
// 是否是客户经理
export function setManagerType(val) {
    if (val == "0") {
        return "<span class='wait round-state'>否</span>";
    } else if (val == "1") {
        return "<span class='enabled round-state'>是</span>";
    } else {
        return "";
    }
}

//全市（建设单位）项目状态
export function setPlanJSDW(val) {
    if (val == "1") {
        return "<span class='wait round-state'>待发布</span>";
    } else if (val == "3") {
        return "<span class='enabled round-state'>已发布</span>";
    }
}

/*
    审批状态status
*/
export function qsDStatus(val) {
    if (val == "1") {
        return "<span class='enabled round-state'>已提交</span>";
    } else if (val == "2") {
        return "<span class='enabled round-state'>已提审</span>";
    } else if (val == "3") {
        // 已发布，激活
        return "<span class='enabled round-state'>已发布</span>";
    } else if (val == "4") {
        return "<span class='disabled round-state'>停用</span>";
    } else if (val == "5") {
        return "<span class='disabled round-state'>驳回</span>";
    }
}

/*
    可研审批状态status
*/
export function kyDStatus(val) {
    if (val == "1") {
        return "<span class='enabled round-state'>待提审</span>";
    } else if (val == "2") {
        return "<span class='enabled round-state'>审批中</span>";
    } else if (val == "3") {
        // 已发布，激活
        return "<span class='enabled round-state'>审批通过</span>";
    } else if (val == "4") {
        return "<span class='disabled round-state'>停用</span>";
    } else if (val == "5") {
        return "<span class='disabled round-state'>驳回</span>";
    } else if (val == "6") {
        return "<span class='waites round-state'>整改</span>";
    }
}
/*
    可研审批状态currentStatus 2.0
*/
export function newKyStatus(val) {
    // if (val == "0") {
    //     return "<span class='enabled round-state'>待提审</span>";
    // } else if (val == "1") {
    //     return "<span class='enabled round-state'>待确认</span>";
    // } else if (val == "2") {
    //     return "<span class='enabled round-state'>待预审</span>";
    // } else if (val == "3") {
    //     return "<span class='enabled round-state'>待整改</span>";
    // } else if (val == "1") {
    //     return "<span class='enabled round-state'>待确认</span>";
    // } else if (val == "3") {
    //     // 已发布，激活
    //     return "<span class='enabled round-state'>审批通过</span>";
    // } else if (val == "4") {
    //     return "<span class='disabled round-state'>停用</span>";
    // } else if (val == "5") {
    //     return "<span class='disabled round-state'>驳回</span>";
    // } else if (val == "6") {
    //     return "<span class='waites round-state'>整改</span>";
    // }
}
/*
    资金来源
*/
export function capitalSource(val) {
    if (val == "CSBSJCZ") {
        return "<span class='enabled'>本市级财政预算资金</span>";
    } else if (val == "CSDFZF") {
        return "<span class='enabled '>地方政府债券资金</span>";
    } else if (val == "CSGJJR") {
        // 已发布，激活
        return "<span class='enabled'>政府主权外债资金</span>";
    } else if (val == "CSQT") {
        return "<span class='enabled'>其他纳入财政管理的资金或资产</span>";
    }
}
//中长期项目状态 ActivationStatus -未审批通过的，项目状态不显示
export function zxqActivationStatus(val, val1) {
    if (val == "1" && val1 == "3") {
        return "<span class='inProgress round-state'>激活</span>";
    } else if (val == "2" && val1 == "3") {
        return "<span class='disabled round-state'>停用</span>";
    } else {
        return "<span class='disabled round-state'>未激活</span>";
    }
}

//不带点的专项项目状态
export function zxDStatusText(val) {
    if (val == "1") {
        return "待提审";
    } else if (val == "2") {
        return "待审核";
    } else if (val == "3") {
        return "已审核";
    } else if (val == "5") {
        return "驳回";
    }
}

//工单状态 1：未开始 2：进行中3：结束 4：驳回
export function stateFlagStatus(val) {
    if (val == "1") {
        return "未开始";
    } else if (val == "2") {
        return "进行中";
    } else if (val == "3") {
        return "结束";
    } else if (val == "4") {
        return "驳回";
    }
}
//专项中的审核状态
export function zxStatus(val) {
    if (val == "1") {
        return "<span class='wait round-state'>待提审</span>";
    } else if (val == "2") {
        return "<span class='waitAudit round-state'>审批中</span>";
    } else if (val == "3") {
        return "<span class='enabled round-state'>审批通过</span>";
    } else if (val == "5") {
        return "<span class='disabled round-state'>驳回</span>";
    }
}

export function zxYuHuaStatus(val) {
    if (val == "1") {
        return "<span class='wait round-state'>待提审</span>";
    } else if (val == "4") {
        return "<span class='waitAudit round-state'>待审批</span>";
    } else if (val == "2") {
        return "<span class='waitAudit round-state'>审批中</span>";
    } else if (val == "3") {
        return "<span class='enabled round-state'>审批通过</span>";
    } else if (val == "5") {
        return "<span class='disabled round-state'>驳回</span>";
    }
}

//项目实施
export function approvalDescStatus(val) {
    if (val == "待发起" || val == "待检查" || val == "待审查" || val == "待确认") {
        return "<span class='wait round-state'>" + val + "</span>";
    } else if (val == "通过") {
        return "<span class='enabled round-state'>" + val + "</span>";
    } else if (val == "检查驳回" || val == "审查驳回" || val == "确认驳回") {
        return "<span class='disabled round-state'>" + val + "</span>";
    }
}


//专项中的审核状态
export function djStatus(val) {
    if (val) {
        return "<span class='enabled round-state'>已登记</span>";
    } else {
        return "<span class='wait round-state'>待登记</span>";
    }
}

//登记中的设置状态
export function ssStatus(val) {
    if (val) {
        return "<span class='enabled round-state'>已设置</span>";
    } else {
        return "<span class='wait round-state'>待设置</span>";
    }
}

// 中长期的审核状态-计划外
export function zcqStatus(val) {
    if (val == "1") {
        return "<span class='wait round-state'>待提审</span>";
    } else if (val == "2") {
        return "<span class='waitAudit round-state'>审批中</span>";
    } else if (val == "3") {
        return "<span class='enabled round-state'>审批通过</span>";
    } else if (val == "5") {
        return "<span class='disabled round-state'>驳回</span>";
    }
}
// 中长期的审核状态-计划外
export function gzStatus(val) {
    if (val == "true") {
        return "<span class=''>是</span>";
    } else {
        return "<span class=''>否</span>";
    }
}

// 可研状态
export function keyanStatusText(val) {
    if (val == "1") {
        return "未发起";
    } else if (val == "2") {
        return "可研评审中";
    } else if (val == "3") {
        return "可研通过";
    } else if (val == "4") {
        return "审批不通过";
    }
}

//初设状态
export function chusheStatusText(val) {
    if (val == "1") {
        return "未发起";
    } else if (val == "2") {
        return "初设评审中";
    } else if (val == "3") {
        return "初设通过";
    } else if (val == "4") {
        return "审批不通过";
    }
}

//上云管理评审状态 -wtt
export function shangYunReviewStatus(val) {
    if (val == "1") {
        return "<span class='waites round-state'>待审核</span>";
    } else if (val == "2") {
        return "<span class='enabled round-state'>通过</span>";
    } else if (val == "3") {
        return "<span class='disabled round-state'>驳回</span>";
    }
}


/**质量检查得分 -wtt*/
export function zljcScore(val) {
    if (val == "1") {
        return `<span class='redDeng round-state round-state1'>${val}分</span>`;
    } else if (val == "2") {
        return `<span class='yellowDeng round-state round-state1'>${val}分</span>`;
    } else if (val == "3") {
        return `<span class='lvDeng round-state round-state1'>${val}分</span>`;
    } else if (val == "5") {
        return `<span class='redDeng round-state round-state1'>${val}分</span>`;
    }
}

/**验收管理100万下 -wxx*/
export function checkMillionDown(val) {
    if (val == "1") {
        return `<span class='waites round-state round-state1'>未备案</span>`;
    } else if (val == "2") {
        return `<span class='enabled round-state round-state1'>待确认</span>`;
    } else if (val == "3") {
        return `<span class='enabled round-state round-state1'>已备案</span>`;
    } else if (val == "5") {
        return `<span class='disabled round-state round-state1'>已驳回</span>`;
    }
}

// 调度-风险管控-是否为整改项
export function isDispatch(val) {
    if (val == 1) {
        return "<span class=''>是</span>";
    } else if (val == 0) {
        return "<span class=''>否</span>";
    } else {
        return "";
    }
}
// 调度-风险管控-风险状态
export function getRiskStatus(val) {
    if (val == 0) {
        return "<span class=''>处理中</span>";
    } else if (val == 1) {
        return "<span class=''>关闭</span>";
    } else if (val == 3) {
        return "<span class=''>已处理</span>";
    } else {
        return "";
    }
}
/**验收管理100万上 -wxx*/
export function checkMillionUp(val) {
    if (val == "1") {
        return `<span class='invalid round-state round-state1'>验收申请</span>`;
    } else if (val == "2") {
        return `<span class='waites round-state round-state1'>待会前预审</span>`;
    } else if (val == "3") {
        return `<span class='waites round-state round-state1'>待会前复审</span>`;
    } else if (val == "4") {
        return `<span class='waites round-state round-state1'>待专家评审</span>`;
    } else if (val == "5") {
        return `<span class='waites round-state round-state1'>待会后预审</span>`;
    } else if (val == "6") {
        return `<span class='waites round-state round-state1'>待会后复审</span>`;
    } else if (val == "7") {
        return `<span class='enabled round-state round-state1'>项目结项</span>`;
    }
}

/**验收管理100万上全 -wxx*/
export function checkMillionUpAll(val) {

    if (val == "1") {
        return `<span class='invalid round-state round-state1'>验收申请</span>`;
    } else if (val == "2") {
        return `<span class='waites round-state round-state1'>待会前预审</span>`;
    } else if (val == "3") {
        return `<span class='waites round-state round-state1'>待会前预审确认</span>`;
    } else if (val == "4") {
        return `<span class='waites round-state round-state1'>待会前预审整改</span>`;
    } else if (val == "5") {
        return `<span class='waites round-state round-state1'>待会前复审</span>`;
    } else if (val == "6") {
        return `<span class='waites round-state round-state1'>待会前复审确认</span>`;
    } else if (val == "7") {
        return `<span class='waites round-state round-state1'>待会前复审整改</span>`;
    } else if (val == "8") {
        return `<span class='waites round-state round-state1'>待专家评审</span>`;
    } else if (val == "9") {
        return `<span class='waites round-state round-state1'>待专家评审整改</span>`;
    } else if (val == "10") {
        return `<span class='waites round-state round-state1'>待会后预审</span>`;
    } else if (val == "11") {
        return `<span class='waites round-state round-state1'>待会后预审确认</span>`;
    } else if (val == "12") {
        return `<span class='waites round-state round-state1'>待会后预审整改</span>`;
    } else if (val == "13") {
        return `<span class='waites round-state round-state1'>待会后复审</span>`;
    } else if (val == "14") {
        return `<span class='waites round-state round-state1'>待会后复审确认</span>`;
    } else if (val == "15") {
        return `<span class='waites round-state round-state1'>待会后复审整改</span>`;
    } else if (val == "16") {
        return `<span class='waites round-state round-state1'>待结项</span>`;
    } else if (val == "19") {
        return `<span class='enabled round-state round-state1'>项目结项</span>`;
    } else if (val == "17") {
        return `<span class='waites round-state round-state1'>待分配</span>`;
    } else if (val == "18") {
        return `<span class='waites round-state round-state1'>待受理</span>`;
    }
}

//上云管理-部署实施状态 -wxx
export function implementStatus(val) {

    if (val == 0 || val == null) {
        return "<span class='invalid round-state'>待发起</span>";
    } else if (val == "1") {
        return "<span class='invalid round-state'>待资源部署</span>";
    } else if (val == "2") {
        return "<span class='inProgress round-state'>待系统部署</span>";
    } else if (val == "3") {
        return "<span class='disabled round-state'>系统部署不通过</span>";
    } else if (val == "4") {
        return "<span class='enabled round-state'>系统部署通过</span>";
    } else if (val == "99") {
        return "<span class='disabled round-state'>中止</span>";
    }
}

//上云管理-上云申请 -wxx
export function applyStatus(val) {
    if (val == 0) {
        return "<span class='invalid round-state'>待申请</span>";
    } else if (val == 1) {
        return "<span class='inProgress round-state'>提交资源申请</span>";
    } else if (val == 2) {
        return "<span class='enabled round-state'>审查</span>";
    } else if (val == 3) {
        return "<span class='disabled round-state'>审查驳回</span>";
    } else if (val == 4) {
        return "<span class='disabled round-state'>通过</span>";
    }
}

//上云管理-云化方案评审 -wxx
export function reviewStatus(val) {
    if (val == "1") {
        return "<span class='invalid round-state'>方案编制</span>";
    } else if (val == "2") {
        return "<span class='inProgress round-state'>待审核</span>";
    } else if (val == "3") {
        return "<span class='enabled round-state'>待分发</span>";
    } else if (val == "4") {
        return "<span class='disabled round-state'>待评审</span>";
    } else if (val == "3") {
        return "<span class='enabled round-state'>待汇总</span>";
    } else if (val == "4") {
        return "<span class='disabled round-state'>完成评审</span>";
    } else if (val == "99") {
        return "<span class='disabled round-state'>中止</span>";
    }
}

//上云管理-云化测试 -wxx
export function testStatus(val) {
    if (val == "1") {
        return "<span class='inProgress round-state'>待测试</span>";
    } else if (val == "2") {
        return "<span class='disabled round-state'>驳回</span>";
    } else if (val == "3") {
        return "<span class='wait round-state'>待汇总</span>";
    } else if (val == "4") {
        return "<span class='enabled round-state'>测试通过</span>";
    } else if (val == "99") {
        return "<span class='enabled round-state'>中止</span>";
    } else if (val == '11') {
        return "<span class='invalid round-state'>驳回</span>";
    } else {
        return "<span class='invalid round-state'>待发起</span>";
    }
}

//上云管理-业务割接 -wxx
export function cutoverStatus(val) {
    if (val == "0" || val == null) {
        return "<span class='wait round-state'>待割接</span>";
    } else if (val == "1") {
        return "<span class='inProgress round-state'>已割接</span>";
    }
}

export function zjPositionalTitleStatus(val) {
    if (val == "1") {
        return "<span class='invalid round-state'>初级职称</span>";
    } else if (val == "2") {
        return "<span class='inProgress round-state'>中级职称</span>";
    } else if (val == "3") {
        return "<span class='enabled round-state'>副高职称</span>";
    } else if (val == "4") {
        return "<span class='disabled round-state'>正高职称</span>";
    }
}
export function zjInquiryResultStatus(val) {
    if (val == "1") {
        return "<span>确认参加</span>";
    } else if (val == "2") {
        return "<span>不参加</span>";
    } else if (val == "3") {
        return "<span>无应答</span>";
    } else {
        return "<span>待确认</span>";
    }
}
// // 公共filter
export function publicFilter(key, val, row, dataLists) {
    if (Object.keys(dataLists).some(item => item == key)) {
        return `<span class="${this.$getClass(val, dataLists[key])}">${this.$getLabel(val, dataLists[key])}</span>`
    }

}
// 启停管理-wxx
export function startStop(val) {
    if (val == 3) {
        return "<span class='disabled round-state'>暂停</span>";
    } else if (val == 1) {
        return "<span class='disabled round-state'>暂停</span>";
    } else if (val == 2) {
        return "<span class='waites round-state'>申请中</span>";
    } else if (val == 0) {
        return "<span class='enabled round-state'>启动</span>";
    }
}

//工作台-专家日历 -wtt
export function workExpertsStatus(val) {
    if (val == "0") {
        return "待确认";
    } else if (val == "1") {
        return '已参加';
    } else if (val == "2") {
        return "已拒绝";
    } else if (val == "3") {
        return "无应答";
    }
}
//项目申报中的可研状态 -wtt
export function xmSbKyStatus(val) {
    //0表示没有进行过可研
    if (val == "0") {
        return "待可研";
    } else if (val == "1") {
        return '待可研';
    } else if (val == "2") {
        return "可研评审中";
    } else if (val == '3') {
        return "可研通过";
    } else if (val == '4') {
        return "审批不通过";
    }
}
//项目申报初设及概算评审状态 -wtt
export function preliminaryStatusList(val) {
    //0表示没有进行过初设
    if (val == "1" || val == "0") {
        return '待初设';
    } else if (val == "2") {
        return "初设评审中";
    } else if (val == '3') {
        return "初设通过";
    } else if (val == '4') {
        return "审批不通过";
    }
}

//里程碑任务状态
export function taskStatusList(val) {
    if (val == 1) {
        return "<span class='enabled round-state'>正常</span>";
    } else if (val == 0) {
        return "<span class='waites round-state'>逾期</span>";
    } else {
        return "<span class='disabled round-state'>滞后</span>";
    }
}

//专报-wtt
export function zbPaperType(val) {
    if (val == 0) {
        return "<span class='enabled round-state'>月报</span>";
    } else if (val == 1) {
        return "<span class='waites round-state'>季报</span>";
    } else {
        return "<span class='disabled round-state'>年报</span>";
    }
}
