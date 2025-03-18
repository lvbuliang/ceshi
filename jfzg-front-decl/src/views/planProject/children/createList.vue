<template>
  <div class="total-page">
    <div class="info" v-if="editableTabs.length > 0">
      <div v-if="!get_success">
        <TestFormAdd
          ref="formAdd"
          :fromData="fromData"
          :editableTabs="editableTabs"
          :hideTrackIcon="false"
        ></TestFormAdd>
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          ref="work_flow"
          backName="planProject"
        ></sr-work-flow>
      </div>
      <div v-else>
        <SuccessMsg name="项目信息" :result_name="result_name" />
      </div>
    </div>
  </div>
</template>

<script>
import TestFormAdd from "../../../components/srFormAdd.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import {
  queryUpdate,
  querySave,
  getDetailById,
  saveDraft,
  api_getyearPlanList,
  api_getServiceTypeList,
  repeatCheck,
} from "@/api/planProject";
import {
  api_getCustomFormTemplate,
  queryAll,
  listByTopicAndItem,
  queryBizunitsByProperty,
  api_getAllPlan,
  queryAllChildUnitExcludeSelfWithSameParentUnit,
} from "@/api/index";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import SuccessMsg from "@/components/success_msg.vue";
import store from "@/store";
import {
  getCommonSource,
  getCommonAllTask,
  getCommonIds,
  getCommonplanName,
} from "@/api/planCommon/index";
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
    editableTabsParams() {
      return JSON.parse(JSON.stringify(this.editableTabs)); //JSON.parse(JSON.stringify(this.someVal)
    },
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
            /* {
              btnName: "提交",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            }, */
            {
              btnValue: "btg",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "btg",
            },
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
      userInfo: store.getters.userInfo,
      selectType: 0,
    };
  },
  methods: {
    routeUpdata() {
      var routerBase = "/subdecl";
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
      this.$SrUtils.routeClose.call(this, "subdecl", this.$setState, timeout);
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
        // this.timer = setInterval(
        //   this.getsetInterval,
        //   this.$SrUtils.autoSaving()
        // )
      } else {
        api_getCustomFormTemplate({
          moduleCode: "18201",
        }).then((res) => {
          this.editableTabs = JSON.parse(res.data.templateDetail);
          this.templateId = res.data.id;
          this.chuli();
        });
        // this.timer = setInterval(
        //   this.getsetInterval,
        //   this.$SrUtils.autoSaving()
        // )
      }
    },
    tg() {
      console.log("有什么", this.bizunitsByPropertyList);
      console.log("表格数据", this.tableData);
      let data = this.$refs["formAdd"].validateFun();
      console.log(data);
      console.log(this.$refs["formAdd"].$refs["add0"][0]);
      this.$refs["formAdd"].$refs["add0"][0].validate((valid) => {
        console.log(valid,'---------------------');
        if (valid) {
          if (data) {
            let obj = data.data
              ? this.$utils.resultObject(JSON.parse(data.data))
              : {};
            console.log(obj);
            let params = {
              ...data,
              ...obj,
              projectCode: this.$route.query.projectCode,
              // 幂等校验
              timestamp: this.$route.query.timestamp,
            };

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
              getSession("infoId_planProjectAdd") &&
              getSession("infoId_planProjectAdd") != "null"
            ) {
              params.id = getSession("infoId_planProjectAdd");
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
                    this.$router.push({ name: "planProject" });
                  }
                }
              });
            } else {
              querySave(params).then((res) => {
                // console.log(params);
                clearInterval(this.timer);
                if (res.msg.code == "0000") {
                  this.$message.success("新增成功");
                  if (this.isNew == true) {
                    this.get_success = true;
                  } else {
                    this.routeClose();
                    this.$router.push({ name: "planProject" });
                  }
                }
              });
            }
          }
        }
      });
    },
    // 清除富文本编辑器标签样式
    /* getTextFromHtml(str) {
      if (str) {
        str = str.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
        str = str.replace(/&nbsp;/gi, ""); //去掉&nbsp;
        return str;
      }
      return "";
    }, */
    // 保存
    btg(str) {
      console.log("保存");
      let data = this.$refs["formAdd"].validateFun();
      let systemName = data?.systemName;
      let projectName = data?.projectName;
      let projectDescriptionText = data?.projectDescriptionText;
      let businessNeeds = data?.businessNeeds;
      console.log(data, "创建项目的枚举", str);
if(data){


      repeatCheck({ systemName, projectName })
        .then((res) => {
          if (res.data == true) {
            this.$message({
              message: "系统名称和项目名称已存在",
              type: "warning",
            });
          } else {
            if (data) {
              let obj = data.data
                ? this.$utils.resultObject(JSON.parse(data.data))
                : {};
              console.log(obj, "obj");
              // //console.log('objobj', obj)
              let params = {
                ...data,
                ...obj,
                /*  projectDescriptionText: this.getTextFromHtml(
                  projectDescriptionText
                ),
                businessNeeds: this.getTextFromHtml(businessNeeds), */
                // projectCode: this.$route.query.projectCode,
                timestamp: this.$route.query.timestamp,
                selectType: this.selectType,
              };
              params.templateId = this.templateId;
              console.log("值", params);
              // return;
              if (this.$route.query.parentId) {
                params.isSubproject = 1;
                params.mainProjectId = this.$route.query.parentId;
              }
              if (this.$route.query.id) {
                params.id = this.$route.query.id;
              } else if (
                getSession("infoId_planProjectAdd") &&
                getSession("infoId_planProjectAdd") != "null"
              ) {
                params.id = getSession("infoId_planProjectAdd");
                this.isNew = true;
              } else {
                this.isNew = false;
              }
              if (this.$route.query.id) {
                queryUpdate(params, this.$route.query.id).then((res) => {
                  if (res.msg.code == "0000") {
                    if (str == "linshi_current") {
                      setSession("infoId_planProjectAdd", res.data);
                    } else if (str == "close") {
                      removeSession("infoId_planProjectAdd");
                      this.$message.success("保存成功");
                    } else {
                      this.$message.success("保存成功");
                      removeSession("infoId_planProjectAdd");
                      clearInterval(this.timer);
                      if (this.isNew == true) {
                        this.result_name = "保存成功";
                        this.get_success = true;
                      } else {
                        this.routeClose();
                        this.$router.push({ name: "planProject" });
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
                          this.$router.push({ name: "planProject" });
                        }
                      }
                    }
                  });
                }
              }
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
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
    // 处理年度计划下拉框
    getyearPlanList(callback) {
      api_getyearPlanList({ status: 1000, pageNum: 1, pageSize: 9999 }).then(
        (res) => {
          // console.log(res);
          this.yearPlanList = res.data.records.map((item) => {
            let emunObj = {};
            emunObj.dataName = item.planYear;
            emunObj.dataValue = item.id;
            return emunObj;
          });
          callback(this.yearPlanList);
        }
      );
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
        // console.log(res);
        this.serviceTypeList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = String(item.chName);
          emunObj.dataValue = String(item.itemCode);
          return emunObj;
        });
        callback(this.serviceTypeList);
      });
    },
    getQueryBizunitsByProperty(callback) {
      queryAllChildUnitExcludeSelfWithSameParentUnit().then((res) => {
        console.log("建设单位", res);
        this.bizunitsByPropertyList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.buName;
          emunObj.dataValue = item.buid;
          return emunObj;
        });
        console.log("结果", this.bizunitsByPropertyList);
        callback(this.bizunitsByPropertyList);
      });
    },
    init(id) {
      getDetailById({ id: id, flag: 1 }).then((res) => {
        if (res.data) {
          if (res.data && res.data.planType == 2) {
            res.data.ztplan = res.data.planId;
          }
          this.fromData = res.data;
          api_getCustomFormTemplate({
            moduleCode: "18201",
            // templateId: this.templateId,
          }).then((res) => {
            this.editableTabs = JSON.parse(res.data.templateDetail);
            this.templateId = res.data.id;
            this.chuli(this.fromData);
          });
        }
      });
    },
    chuli(Data) {
      this.editableTabs.forEach((item) => {
        this.$set(item, "formArr", JSON.parse(item.formArr));
        item.formArr.forEach((item1, index) => {
          // console.log(Data);
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
          // 处理年度计划下拉框
          this.getyearPlanList((rs) => {
            this.$set(item1.selectData.formAdd.enums, "yearPlanList", rs);
          });
          // 处理服务类型下拉框
          this.getServiceTypeList((rs) => {
            this.$set(item1.selectData.formAdd.enums, "serviceTypeList", rs);
          });
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
      console.log("模板", this.editableTabs);
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
        if (val == "jv75du7m") {
          // 计划完成时间是否显示
          if (configItem.bind == "projectPlanFinishTime") {
            configItem.isHide = false;
          }
        } else if (val !== "jv75du7m") {
          // 计划完成时间是否显示
          if (configItem.bind == "projectPlanFinishTime") {
            this.addTaskForm.data.projectPlanFinishTime = "";
            configItem.isHide = true;
          }
        }
      });
    },
    // 获取当前时间 0000-00-00
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.nowData = year + seperator1 + month + seperator1 + strDate;
    },
    //变更表格数据
    delPreDataList(data, data2) {
      this.tableData = data;
      this.seletedItemsList = data2;
    },
    // 项目规模有值,则总预算金额有值,也可修改
    totalmoneyCl(data) {
      this.editableTabs.forEach((item) => {
        item.formArr.forEach((item1, index) => {
          this.$set(
            item1.selectData.formAdd.data,
            "totalInvestmentAmount",
            data
          );
        });
      });
    },
  },
  created() {
    console.log("时间戳", new Date().getTime());
    this.createdfunc();
    this.selectType = this.$route.query.isConcern;
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
.total-page {
  background: #fff;
  padding: 20px;
  // border-radius: 0 0 10px 10px;
  height: 100%;
  // height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
  .info{
    height: 100vh;
  }
}
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
::v-deep .gobackList .el-button {
  border-radius: 4px;
  height: 34px;
}
::v-deep .el-input__inner, .el-textarea__inner {
  border-radius: 4px !important; 
}
::v-deep .sr-add .el-form-item__content {
  line-height: 42px !important; 
}
::v-deep .sr-add .el-form-item__label {
  line-height: 42px !important; 
}
::v-deep .ke-edit,.ke-edit-iframe {
  height: 15vh !important;
}
::v-deep .ke-statusbar {
  display: none !important;
}
::v-deep .ke-container {
  height: 100% !important;
  overflow-y: scroll !important;
}
</style>
