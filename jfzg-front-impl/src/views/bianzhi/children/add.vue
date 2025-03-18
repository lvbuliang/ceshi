<template>
  <div class="total-page">
    <div v-if="editableTabs.length > 0">
      <div v-if="!get_success">
        <TestFormAdd
          ref="formAdd"
          :fromData="fromData"
          :editableTabs="editableTabs"
        ></TestFormAdd>
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          ref="work_flow"
          backName="bianzhi"
        ></sr-work-flow>
      </div>
      <div v-else>
        <SuccessMsg name="项目库" :result_name="result_name" />
      </div>
    </div>
  </div>
</template>

<script>
import TestFormAdd from "../../../components/srFormAdd.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { queryUpdate, getDetailById, saveDraft } from "@/api/projectLibrary";
import { querySave, api_getServiceTypeList } from "@/api/bianzhi";
import {
  api_getCustomFormTemplate,
  queryAll,
  listByTopicAndItem,
  queryBizunitsByProperty,
} from "@/api/index";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import SuccessMsg from "@/components/success_msg.vue";
import store from "@/store";
export default {
  components: {
    TestFormAdd,
    SuccessMsg,
  },

  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  computed: {
    ...mapGetters(["msg"]),
  },
  watch: {
    msg: function (n, o, y) {
      if (n == "主应用请求保存表单") {
        this.btg("close");
      }
    },
    get_success: function (n) {
      this.routeUpdata();
    },
    $route(to) {
      this.$set(this, "editableTabs", []);
      if (to.name == "specialAdd") {
        this.createdfunc();
      }
    },
  },
  data() {
    return {
      result_name: "提交成功",
      timer: "",
      isNew: false,
      get_success: false,
      editableTabs: [],
      fromData: {},
      buName: {},
      activeName: "0",
      templateId: this.$route.query.templateId,
      clickmethods: { tg: this.tg, btg: this.btg },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
            // {
            //   btnValue: "btg",
            //   btnName: "保存",
            //   btnType: "primary",
            //   btnEventType: "btg",
            // },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      constructionUnitList: [
        { dataName: "无", dataValue: 0 },
        { dataName: "专项规划", dataValue: 1 },
        { dataName: "总体规划", dataValue: 2 },
      ],
      zxPlanList: [],
      ztPlanList: [],
      type_list: [],
      addTaskForm: {},
      userInfo: store.getters.userInfo,
    };
  },
  methods: {
    routeUpdata() {
      var routerBase = "/subplan";
      setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },
    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subplan", this.$setState, timeout);
    },
    getsetInterval() {
      this.btg("linshi_current");
    },
    createdfunc() {
      if (this.$route.query.id) {
        this.init(this.$route.query.id);
      } else if (
        getSession("infoId_projectLibraryAdd") &&
        getSession("infoId_projectLibraryAdd") != "null"
      ) {
        this.init(getSession("infoId_projectLibraryAdd"));
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      } else {
        api_getCustomFormTemplate({
          moduleCode: "18000",
        }).then((res) => {
          this.editableTabs = JSON.parse(res.data.templateDetail);
          this.templateId = res.data.id;
          this.chuli();
        });
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      }
    },
    tg() {
      let data = this.$refs["formAdd"].validateFun();
      console.log(data);
      console.log(this.$refs["formAdd"].$refs["add0"][0]);
      this.$refs["formAdd"].$refs["add0"][0].validate((valid) => {
        console.log(valid);
        if (valid) {
          if (data) {
            let obj = data.data
              ? this.$utils.resultObject(JSON.parse(data.data))
              : {};

            let params = {
              ...data,
              ...obj,
              applicationUnit: JSON.parse(this.buName).currentBizunit.buName,
              projectCode: this.$route.query.projectCode,
              projectType:
                this.userInfo.currentBizunit.buProperty == 2
                  ? "专业类"
                  : this.userInfo.currentBizunit.buProperty == 1
                  ? "公共类"
                  : "",
              // projectId: this.projectId,
              // templateId: this.templateId,
              // projectName: this.projectObj.projectName,
              // projectCode: this.projectObj.projectCode,
              // designUnitsName: designUnits && designUnitsObj?.companyName, // 设计公司中文
              // designerName: designer && designObj?.name, // 设计人中文
              //申报单位意见
              // applicantUnitOpinions:
              //   Array.isArray(obj.applicantUnitOpinions) &&
              //   JSON.stringify(obj.applicantUnitOpinions),
              //项目立项申请函
              xmlxsqh:
                Array.isArray(obj.xmlxsqh) && JSON.stringify(obj.xmlxsqh),
              //项目立项申请表
              xmlxsqb:
                Array.isArray(obj.xmlxsqb) && JSON.stringify(obj.xmlxsqb),
              //项目立项方案
              xmlxfa: Array.isArray(obj.xmlxfa) && JSON.stringify(obj.xmlxfa),
              //项目立项方案目录
              xmlxfaml:
                Array.isArray(obj.xmlxfaml) && JSON.stringify(obj.xmlxfaml),
              //项目论证意见
              xmlzyj: Array.isArray(obj.xmlzyj) && JSON.stringify(obj.xmlzyj),
              //市财政局意见
              sczjyj: Array.isArray(obj.sczjyj) && JSON.stringify(obj.sczjyj),
              //使用新增资金等的项目立项依据
              syxzzjddxmlxyj:
                Array.isArray(obj.syxzzjddxmlxyj) &&
                JSON.stringify(obj.syxzzjddxmlxyj),
              //密码应用审核意见
              mmyyshyj:
                Array.isArray(obj.mmyyshyj) && JSON.stringify(obj.mmyyshyj),
              // 项目说明
              projectDescription:
                Array.isArray(obj.projectDescription) &&
                JSON.stringify(obj.projectDescription),
              // 其他附件
              otherAppendix:
                Array.isArray(obj.otherAppendix) &&
                JSON.stringify(obj.otherAppendix),
            };
            console.log(params);
            // if (obj.status) {
            //   params.status = obj.status;
            // } else {
            //   params.status = "2";
            // }
            params.templateId = this.templateId;
            if (params.planType == 2) {
              params.planId = params.ztplan;
            }
            // data.contentFile = JSON.stringify(data.contentFile);

            if (this.$route.query.parentId) {
              params.isSubproject = 1;
              params.mainProjectId = this.$route.query.parentId;
            }
            if (this.$route.query.id) {
              params.id = this.$route.query.id;
            } else if (
              getSession("infoId_projectLibraryAdd") &&
              getSession("infoId_projectLibraryAdd") != "null"
            ) {
              params.id = getSession("infoId_projectLibraryAdd");
              this.isNew = true;
            } else {
              this.isNew = false;
            }
            if (this.$route.query.id) {
              queryUpdate(params, this.$route.query.id).then((res) => {
                if (res.msg.code == "0000") {
                  clearInterval(this.timer);
                  this.$message.success("提交成功");
                  if (this.isNew == true) {
                    this.get_success = true;
                  } else {
                    this.routeClose();
                    this.$router.push({ name: "bianzhi" });
                  }
                }
              });
            } else {
              querySave(params).then((res) => {
                console.log(params);
                clearInterval(this.timer);
                if (res.msg.code == "0000") {
                  this.$message.success("新增成功");
                  if (this.isNew == true) {
                    this.get_success = true;
                  } else {
                    this.routeClose();
                    this.$router.push({ name: "bianzhi" });
                  }
                }
              });
            }
          }
        }
      });
    },
    btg(str) {
      let data = this.$refs["formAdd"].validate();
      let obj = data.data
        ? this.$utils.resultObject(JSON.parse(data.data))
        : {};

      let params = {
        ...data,
        ...obj,
        applicationUnit: JSON.parse(this.buName).currentBizunit.buName,
        projectCode: this.$route.query.projectCode,
        projectType:
          this.userInfo.currentBizunit.buProperty == 2
            ? "专业类"
            : this.userInfo.currentBizunit.buProperty == 1
            ? "公共类"
            : "",
        // projectId: this.projectId,
        // templateId: this.templateId,
        // projectName: this.projectObj.projectName,
        // projectCode: this.projectObj.projectCode,
        // designUnitsName: designUnits && designUnitsObj?.companyName, // 设计公司中文
        // designerName: designer && designObj?.name, // 设计人中文
        // applicantUnitOpinions:
        //   Array.isArray(obj.applicantUnitOpinions) &&
        //   JSON.stringify(obj.applicantUnitOpinions),
        //项目立项申请函
        xmlxsqh: Array.isArray(obj.xmlxsqh) && JSON.stringify(obj.xmlxsqh),
        //项目立项申请表
        xmlxsqb: Array.isArray(obj.xmlxsqb) && JSON.stringify(obj.xmlxsqb),
        //项目立项方案
        xmlxfa: Array.isArray(obj.xmlxfa) && JSON.stringify(obj.xmlxfa),
        //项目立项方案目录
        xmlxfaml: Array.isArray(obj.xmlxfaml) && JSON.stringify(obj.xmlxfaml),
        //项目论证意见
        xmlzyj: Array.isArray(obj.xmlzyj) && JSON.stringify(obj.xmlzyj),
        //市财政局意见
        sczjyj: Array.isArray(obj.sczjyj) && JSON.stringify(obj.sczjyj),
        //使用新增资金等的项目立项依据
        syxzzjddxmlxyj:
          Array.isArray(obj.syxzzjddxmlxyj) &&
          JSON.stringify(obj.syxzzjddxmlxyj),
        //密码应用审核意见
        mmyyshyj: Array.isArray(obj.mmyyshyj) && JSON.stringify(obj.mmyyshyj),
        // 项目说明
        projectDescription:
          Array.isArray(obj.projectDescription) &&
          JSON.stringify(obj.projectDescription),
        // 其他附件
        otherAppendix:
          Array.isArray(obj.otherAppendix) && JSON.stringify(obj.otherAppendix),
      };
      console.log(params);
      // if (params.status == "5") {
      //   params.status = 5;
      // } else {
      //   params.status = 1;
      // }
      params.templateId = this.templateId;
      // 规划类型0 无 1、专项规划 2、总体规划
      if (data.planType == 2) {
        data.planId = data.ztplan;
      }
      // data.type = 1;
      // data.contentFile = data.contentFile
      //   ? JSON.stringify(data.contentFile)
      //   : JSON.stringify([]);
      //金额非数字改为数字
      if (
        params.totalInvestmentAmount &&
        typeof params.totalInvestmentAmount == "string"
      ) {
        params.totalInvestmentAmount = params.totalInvestmentAmount * 1;
      }
      if (this.$route.query.parentId) {
        params.isSubproject = 1;
        params.mainProjectId = this.$route.query.parentId;
      }
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      } else if (
        getSession("infoId_projectLibraryAdd") &&
        getSession("infoId_projectLibraryAdd") != "null"
      ) {
        params.id = getSession("infoId_projectLibraryAdd");
        this.isNew = true;
      } else {
        this.isNew = false;
      }
      if (this.$route.query.id) {
        if (params.status == "5") {
          params.status = null;
        }
        queryUpdate(params, this.$route.query.id).then((res) => {
          if (res.msg.code == "0000") {
            if (str == "linshi_current") {
              setSession("infoId_projectLibraryAdd", res.data);
            } else if (str == "close") {
              removeSession("infoId_projectLibraryAdd");
              this.$message.success("保存成功");
            } else {
              this.$message.success("保存成功");
              removeSession("infoId_projectLibraryAdd");
              clearInterval(this.timer);
              if (this.isNew == true) {
                this.result_name = "保存成功";
                this.get_success = true;
              } else {
                this.routeClose();
                this.$router.push({ name: "projectLibrary" });
              }
            }
          }
        });
      } else {
        if (str == "linshi_current") {
          // 调草稿接口
          // saveDraft(params).then((res) => {
          //   if (res.msg.code == "0000") {
          //     setSession("infoId_projectLibraryAdd", res.data);
          //   }
          // });
        } else {
          querySave(params).then((res) => {
            if (res.msg.code == "0000") {
              if (str == "linshi_current") {
                setSession("infoId_projectLibraryAdd", res.data);
              } else if (str == "close") {
                removeSession("infoId_projectLibraryAdd");
                this.$message.success("保存成功");
              } else {
                this.$message.success("保存成功");
                removeSession("infoId_projectLibraryAdd");
                clearInterval(this.timer);
                if (this.isNew == true) {
                  this.result_name = "保存成功";
                  this.get_success = true;
                } else {
                  this.routeClose();
                  this.$router.push({ name: "projectLibrary" });
                }
              }
            }
          });
        }
      }
    },
    getQueryAll(callback) {
      queryAll().then((res) => {
        this.ztPlanList = res.data.zt.map((item) => {
          let ztObj = {};
          ztObj.dataName = String(item.name);
          ztObj.dataValue = String(item.id);
          return ztObj;
        });
        this.zxPlanList = res.data.zx.map((item) => {
          let zxObj = {};
          zxObj.dataName = String(item.name);
          zxObj.dataValue = String(item.id);
          return zxObj;
        });
        callback(this.ztPlanList, this.zxPlanList);
      });
    },
    getListByTopicAndItem(callback) {
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        this.type_list = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = String(item.chName);
          emunObj.dataValue = String(item.itemCode);
          return emunObj;
        });
        callback(this.type_list);
      });
    },
    // 处理服务类型下拉框
    getServiceTypeList(callback) {
      api_getServiceTypeList({
        topic:
          this.userInfo.currentBizunit.buProperty == 2
            ? "JHXMK_SERVICE_TYPE_PROFESSIONAL"
            : this.userInfo.currentBizunit.buProperty == 1
            ? "JHXMK_SERVICE_TYPE_PUBLIC"
            : "",
      }).then((res) => {
        console.log(res);
        this.serviceTypeList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = String(item.chName);
          emunObj.dataValue = String(item.itemCode);
          return emunObj;
        });
        callback(this.serviceTypeList);
      });
    },
    /* // 处理业务范围-公众侧下拉框
    getprojectScopePublicSideList(callback) {
      api_getServiceTypeList({
        topic: "PROJECT_SCOPE_PUBLIC",
      }).then((res) => {
        console.log(res);
        this.projectScopePublicSideList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = String(item.chName);
          emunObj.dataValue = String(item.itemCode);
          return emunObj;
        });
        callback(this.projectScopePublicSideList);
      });
    },
    // 处理业务范围-政务侧下拉框
    getprojectScopeGovernmentSideList(callback) {
      api_getServiceTypeList({
        topic: "PROJECT_SCOPE_GOVERNMENT",
      }).then((res) => {
        console.log(res);
        this.projectScopeGovernmentSideList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = String(item.chName);
          emunObj.dataValue = String(item.itemCode);
          return emunObj;
        });
        callback(this.projectScopeGovernmentSideList);
      });
    }, */
    getQueryBizunitsByProperty(callback) {
      queryBizunitsByProperty({ buPropertyEnum: "JSDW" }).then((res) => {
        this.bizunitsByPropertyList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.buName;
          emunObj.dataValue = item.buid;
          return emunObj;
        });
        callback(this.bizunitsByPropertyList);
      });
    },
    init(id) {
      getDetailById({ id: id }).then((res) => {
        console.log(res.data);
        if (res.data) {
          // 建设依据处理
          if (!Array.isArray(res.data.constructionBasis)) {
            res.data.constructionBasis = [res.data.constructionBasis];
          }
          let {
            // selfInspectionAppendix,
            // projectProposalAppendix,
            // applicantUnitOpinions, //申报单位意见
            xmlxsqh, //项目立项申请函
            xmlxsqb, //项目立项申请表
            xmlxfa, //项目立项方案
            xmlxfaml, //项目立项方案目录
            xmlzyj, //项目论证意见
            sczjyj, //市财政局意见
            syxzzjddxmlxyj, //使用新增资金等的项目立项依据
            mmyyshyj, //密码应用审核意见
            projectDescription, //项目说明
            otherAppendix, //其他附件
            contentFile,
            beginDate,
            endDate,
          } = res.data;
          // res.data.selfInspectionAppendix =
          //   selfInspectionAppendix && JSON.parse(selfInspectionAppendix);
          // res.data.projectProposalAppendix =
          //   projectProposalAppendix && JSON.parse(projectProposalAppendix);
          // res.data.applicantUnitOpinions =
          //   applicantUnitOpinions && JSON.parse(applicantUnitOpinions);
          res.data.xmlxsqh = xmlxsqh && JSON.parse(xmlxsqh);
          res.data.xmlxsqb = xmlxsqb && JSON.parse(xmlxsqb);
          res.data.xmlxfa = xmlxfa && JSON.parse(xmlxfa);
          res.data.xmlxfaml = xmlxfaml && JSON.parse(xmlxfaml);
          res.data.xmlzyj = xmlzyj && JSON.parse(xmlzyj);
          res.data.sczjyj = sczjyj && JSON.parse(sczjyj);
          res.data.syxzzjddxmlxyj =
            syxzzjddxmlxyj && JSON.parse(syxzzjddxmlxyj);
          res.data.mmyyshyj = mmyyshyj && JSON.parse(mmyyshyj);
          res.data.projectDescription =
            projectDescription && JSON.parse(projectDescription); //项目说明
          res.data.otherAppendix = otherAppendix && JSON.parse(otherAppendix);
          res.data.contentFile = contentFile && JSON.parse(contentFile);
          // let implementationDate={beginDate:"",},
          res.data.constructionCycle = {};
          res.data.constructionCycle.beginDate = beginDate;
          res.data.constructionCycle.endDate = endDate;
          /* // 公众侧
          if (
            res.data.projectScopePublicSide.indexOf("[") !== -1 &&
            res.data.projectScopePublicSide.indexOf("]") !== -1
          ) {
            res.data.projectScopePublicSide = JSON.parse(
              res.data.projectScopePublicSide
            );
          } else {
            res.data.projectScopePublicSide = [res.data.projectScopePublicSide];
          }
          // 政务侧
          if (
            res.data.projectScopeGovernmentSide.indexOf("[") !== -1 &&
            res.data.projectScopeGovernmentSide.indexOf("]") !== -1
          ) {
            res.data.projectScopeGovernmentSide = JSON.parse(
              res.data.projectScopeGovernmentSide
            );
          } else {
            res.data.projectScopeGovernmentSide = [
              res.data.projectScopeGovernmentSide,
            ];
          } */
          // res.data.implementationDate.endDate =endDate

          //  res.data.contentFile = JSON.parse(res.data.contentFile);
          //  selfInspectionAppendix:
          //       Array.isArray(obj.selfInspectionAppendix) && JSON.stringify(obj.selfInspectionAppendix),
          //     projectProposalAppendix:
          //       Array.isArray(obj.projectProposalAppendix) &&
          //       JSON.stringify(obj.projectProposalAppendix),
          //     otherAppendix:
          //       Array.isArray(obj.otherAppendix) && JSON.stringify(obj.otherAppendix),
          //   };
        }
        if (res.data && res.data.planType == 2) {
          res.data.ztplan = res.data.planId;
        }
        this.fromData = res.data;
        console.log(res.data, this.fromData);
        // this.fromData.applicationUnit=JSON.parse(this.buName).userRoleFrontShowInfos[0].buName
        // console.log(this.fromData)
        api_getCustomFormTemplate({
          moduleCode: "18000",
          // templateId: this.templateId,
        }).then((res) => {
          console.log(this.fromData);
          console.log(res);
          this.editableTabs = JSON.parse(res.data.templateDetail);
          this.templateId = res.data.id;
          console.log(this.editableTabs);
          this.chuli(this.fromData);
        });
      });
    },
    chuli(Data) {
      this.editableTabs.forEach((item) => {
        this.$set(item, "formArr", JSON.parse(item.formArr));
        item.formArr.forEach((item1, index) => {
          console.log(Data);
          let configArr = item1.selectData.formAdd.config;
          let configBind =
            this.getConfigBind(configArr, "bind") &&
            this.getConfigBind(configArr, "bind").join(",");
          let itemData = this.forInItem(Data, configBind);
          item.formArr[index].selectData.formAdd.data = itemData
            ? itemData
            : {};
          this.addTaskForm = item.formArr[0].selectData.formAdd;
          if (item1.selectData.formAdd.data.planType == "") {
            item1.selectData.formAdd.data.planType = 0;
          }
          this.$set(
            item1.selectData.formAdd.enums,
            "constructionUnitList",
            this.constructionUnitList
          );
          this.$set(
            item1.selectData.formAdd.data,
            "constructionUnit",
            // this.userInfo.bizunitInfos[0].buid
            this.userInfo.currentBizunit.buid
          );
          // this.$set(this,'fromData',item1.selectData.formAdd.data)
          this.getQueryAll((ztPlanList, zxPlanList) => {
            this.$set(item1.selectData.formAdd.enums, "zxPlanList", zxPlanList);
            this.$set(item1.selectData.formAdd.enums, "ztplanList", ztPlanList);
          });
          this.getListByTopicAndItem((rs) => {
            this.$set(
              item1.selectData.formAdd.data,
              "planType",
              Number(item1.selectData.formAdd.data.planType)
            );
            this.resetChecker(Number(item1.selectData.formAdd.data.planType));
            this.$set(item1.selectData.formAdd.enums, "type_list", rs);
          });
          // 处理服务类型下拉框
          this.getServiceTypeList((rs) => {
            this.$set(item1.selectData.formAdd.enums, "serviceTypeList", rs);
          });
          /* // 处理业务范围-公众侧 下拉框
          this.getprojectScopePublicSideList((rs) => {
            this.$set(
              item1.selectData.formAdd.enums,
              "projectScopePublicSideList",
              rs
            );
          });
          // 处理业务范围-政务侧下拉框
          this.getprojectScopeGovernmentSideList((rs) => {
            this.$set(
              item1.selectData.formAdd.enums,
              "projectScopeGovernmentSideList",
              rs
            );
          }); */
          this.getQueryBizunitsByProperty((rs) => {
            this.$set(
              item1.selectData.formAdd.enums,
              "queryBizunitsByPropertyList",
              rs
            );
          });
          if (
            item1.selectData.formAdd.data.planType == 2 &&
            item1.selectData.formAdd.data.planId
          ) {
            this.$set(
              item1.selectData.formAdd.data,
              "ztplan",
              item1.selectData.formAdd.data.planId
            );
          }
          for (let k = 0; k < item1.selectData.formAdd.config.length; k++) {
            if (
              item1.selectData.formAdd.config[k] &&
              item1.selectData.formAdd.config[k].bind == "planType"
            ) {
              item1.selectData.formAdd.config[k]["change"] = this.onRadioChange;
            }
            // 处理项目成熟度选择控制计划完成是否显示
            if (
              item1.selectData.formAdd.config[k] &&
              item1.selectData.formAdd.config[k].bind == "projectMaturity"
            ) {
              item1.selectData.formAdd.config[k]["change"] =
                this.onRadioChange1;
            }
            // 处理计划完成初始化不显示
            if (
              item1.selectData.formAdd.config[k] &&
              item1.selectData.formAdd.config[k].bind ==
                "projectPlanFinishTime" &&
              (item1.selectData.formAdd.data.projectPlanFinishTime == "" ||
                this.fromData.projectPlanFinishTime == "")
            ) {
              item1.selectData.formAdd.config[k].isHide = true;
            }
            if (item1.selectData.formAdd.config[k].bind === "endDate") {
              item1.selectData.formAdd.config[k]["picker-options"] = {
                disabledDate: (time) => {
                  if (item1.selectData.formAdd.data.beginDate) {
                    return (
                      time.getTime() <
                      new Date(
                        item1.selectData.formAdd.data.beginDate
                      ).getTime()
                    ); //如果没有后面的-8.64e7就是不可以选择今天的
                  }
                },
              };
            }
            if (item1.selectData.formAdd.config[k].bind === "beginDate") {
              item1.selectData.formAdd.config[k]["picker-options"] = {
                disabledDate: (time) => {
                  if (item1.selectData.formAdd.data.beginDate) {
                    return (
                      time.getTime() >
                      new Date(item1.selectData.formAdd.data.endDate).getTime()
                    ); //如果没有后面的-8.64e7就是不可以选择今天的
                  }
                },
              };
            }
          }
        });
      });
      console.log(this.editableTabs);
    },
    getConfigBind(arr, key) {
      // 获取数组里对应键的值
      return Array.isArray(arr) && arr.map((item) => item[key]);
    },
    forInItem(obj, val) {
      // 根据对应字段获取对象里对应的键和值
      if (typeof obj != "object" && typeof val != "string") return false;
      let newObj = {};
      for (const key in obj) {
        if (val.includes(key)) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    },
    onRadioChange(val, item) {
      // 是否需要检查人的值切换
      if (item.bind == "planType") {
        this.resetChecker(val);
      }
    },
    // 项目成熟度切换值
    onRadioChange1(val, item) {
      // 是否需要隐藏计划完成时间
      if (item.bind == "projectMaturity") {
        this.resetChecker(val);
      }
    },
    resetChecker(val) {
      this.addTaskForm.config.map((configItem) => {
        let arr = [];
        if (val == 0 || !val) {
          arr = ["专项发展规划名称", "行业方向", "总体发展规划"];
          this.addTaskForm.config.forEach((list) => {
            arr.forEach((i) => {
              if (list.name == i) {
                this.$set(list, "isHide", true);
              }
            });
          });
          this.$set(this.addTaskForm.data, "industryDirection", "");
        } else if (val == "1") {
          arr = ["总体发展规划"];
          this.addTaskForm.config.forEach((list) => {
            arr.forEach((i) => {
              if (list.name == i) {
                this.$set(list, "isHide", true);
              } else {
                this.$set(list, "isHide", false);
              }
            });
          });
        } else if (val == "2") {
          arr = ["专项发展规划名称"];
          this.addTaskForm.config.forEach((list) => {
            arr.forEach((i) => {
              if (list.name == "专项发展规划名称") {
                this.$set(list, "isHide", true);
              } else if (list.name == "行业方向") {
                this.$set(list, "isHide", true);
              } else {
                this.$set(list, "isHide", false);
              }
            });
          });
          this.$set(this.addTaskForm.data, "industryDirection", "");
        } else if (val == "jv75du7m") {
          // 计划完成时间是否显示
          if (configItem.bind == "projectPlanFinishTime") {
            configItem.isHide = false;
          }
        } else if (
          val !== "jv75du7m"
          // val !== "us8iee5s" ||
          // val == "q4d2vncw" ||
          // val == "9u6vxtj6"
        ) {
          // 计划完成时间是否显示
          if (configItem.bind == "projectPlanFinishTime") {
            this.addTaskForm.data.projectPlanFinishTime = "";
            configItem.isHide = true;
          }
        }
      });
    },
  },
  created() {
    this.buName = getSession("userInfo");
    // console.log(JSON.parse(this.buName).userRoleFrontShowInfos[0].buName);
    this.$set(
      this.fromData,
      "applicationUnit",
      JSON.parse(this.buName).currentBizunit.buName
    );
    this.$set(this.fromData, "projectCode", this.$route.query.projectCode);
    // 初始化计划完成时间为空
    this.$set(this.fromData, "projectPlanFinishTime", "");
    // 项目类型初始化
    this.$set(
      this.fromData,
      "projectType",
      this.userInfo.currentBizunit.buProperty == 2
        ? "专业类"
        : this.userInfo.currentBizunit.buProperty == 1
        ? "公共类"
        : ""
    );
    // 初始化服务类型处理,公众侧,政务侧
    this.$set(this.fromData, "serviceType", []);
    /* this.$set(this.fromData, "projectScopePublicSide", []);
    this.$set(this.fromData, "projectScopeGovernmentSide", []); */
    // 处理建设依据
    this.$set(this.fromData, "constructionBasis", []);
    console.log(this.fromData);
    this.createdfunc();
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    clearInterval(this.timer);
    next();
  },
  beforeDestroy() {
    removeSession("infoId_projectLibraryAdd");
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.searchPage {
  display: flex;
  justify-content: space-between;
}
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}
.tabsLabel {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 24px;
  i {
    margin-right: 4px;
  }
}
::v-deep .el-tabs__header {
  margin-bottom: 8px;
}
.tabsDataTitle {
  margin-top: 8px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
</style>
