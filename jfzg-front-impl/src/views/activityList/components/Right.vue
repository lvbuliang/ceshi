<template>
  <div class="right-wrap">
    <sr-nav-page :project="srNavPageObj" :type="2"></sr-nav-page>
    <TestFormView
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :fromData="fromData"
      :tableData="tableData"
      :form="form"
      :hideData="hideData"
    >
    </TestFormView>
  </div>
</template>

<script>
import TestFormView from "./srFormView.vue";
import {
  api_getServiceTypeList,
  getDetailById,
  getDetailByIdJ,
} from "@/api/activityList";
import { api_getCustomFormTemplate } from "@/api/index";
export default {
  name: "",
  components: { TestFormView },
  props: {
    projectId: {
      type: Number,
      default: null,
    },
    source: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      srNavPageObj: {},
      serverList: [],
      tableData: [],
      form: {},
      constructionBasisList: [],
      projectScopePublicSideList: [],
      yearPlanId: "",
      projectScopeGovernmentSideList: [],
      editableTabs: [],
      hideData: {
        showElForm: true,
        showYearPlan: true,
        showPlan: true,
        showtreeTable: true,
        source: true,
        zrdw: true,
        ghmc: false,
        ghlx: false,
      },
      moduleCode: "",
    };
  },
  watch: {
    projectId: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.getProjectDetail();
        }
        console.log("newVal", newVal, "oldVal", oldVal);
      },
    },
  },
  created() {
    console.log("接收父传递的数据", this.projectId, this.source);
    // source:0方案,source :3清单
    this.getServerList();
    this.getProjectDetail();
  },

  methods: {
    // 项目详情
    getProjectDetail() {
      console.log("项目来源", this.source);
      this.editableTabs = [];
      if (this.source == 0) {
        console.log("方案");
        console.log("111", this.projectId);
        getDetailById({ id: this.projectId }).then((res) => {
          if (res.data) {
            // 密码应用
            res.data.isPwdProject = res.data.isPwdProject == 1 ? "是" : "否";
            // 重点列表
            this.tableData = res.data.keyTaskList;
            this.form = res.data.planDtos;
            console.log(res.data);
            res.data.constructionCycle =
              (res.data.beginDate || "-") + "至" + (res.data.endDate || "-");
            console.log("DHW2", res, res.data.serviceType);
            if (res.data.serviceType) {
              // 服务类型处理
              let list = [];
              res.data.serviceType.map((item1) => {
                this.serverList.map((item) => {
                  if (item.value == item1) {
                    list.push(item.label);
                  }
                });
                res.data.serviceType = list.toString();
              });
            }
            if (res.data.constructionBasis) {
              // 建设依据处理
              let list = [];
              res.data.constructionBasis.map((item1) => {
                this.constructionBasisList.map((item) => {
                  if (item1 == item.value) {
                    list.push(item.label);
                  }
                });
                res.data.constructionBasis = list.toString();
              });
            }
            // 业务范围-公众侧
            if (
              res.data.projectScopePublicSide &&
              res.data.projectScopePublicSide.indexOf("[") !== -1 &&
              res.data.projectScopePublicSide.indexOf("]") !== -1
            ) {
              let list = [];
              let pattern2 = new RegExp("[A-Za-z]+");
              res.data.projectScopePublicSide = JSON.parse(
                res.data.projectScopePublicSide
              ).map((item) => {
                console.log(item);
                if (!pattern2.test(item)) {
                  list.push(item);
                }
                this.projectScopePublicSideList.map((item1) => {
                  console.log(item1);
                  if (item1.value == item) {
                    list.push(item1.label);
                  }
                });
              });
              res.data.projectScopePublicSide = list.toString();
            } else {
              res.data.projectScopePublicSide = res.data.projectScopePublicSide;
            }
            // 业务范围-政务侧
            if (
              res.data.projectScopeGovernmentSide &&
              res.data.projectScopeGovernmentSide.indexOf("[") !== -1 &&
              res.data.projectScopeGovernmentSide.indexOf("]") !== -1
            ) {
              let list = [];
              let pattern2 = new RegExp("[A-Za-z]+");
              res.data.projectScopeGovernmentSide = JSON.parse(
                res.data.projectScopeGovernmentSide
              ).map((item) => {
                console.log(item);
                if (!pattern2.test(item)) {
                  list.push(item);
                }
                this.projectScopeGovernmentSideList.map((item1) => {
                  console.log(item1);
                  if (item1.value == item) {
                    list.push(item1.label);
                  }
                });
              });
              res.data.projectScopeGovernmentSide = list.toString();
            } else {
              res.data.projectScopeGovernmentSide =
                res.data.projectScopeGovernmentSide;
            }
            // res.data.selfInspectionAppendix = JSON.parse(
            //   res.data.selfInspectionAppendix
            // );
            // res.data.projectProposalAppendix = JSON.parse(
            //   res.data.projectProposalAppendix
            // );
            res.data.yearPlanId = res.data.yearPlanName; //处理查看页面年度计划字段
            if (res.data.yearPlanId) {
              this.yearPlanId = res.data.yearPlanId;
            }
            res.data.projectDescription = JSON.parse(
              res.data.projectDescription
            );
            res.data.otherAppendix = JSON.parse(res.data.otherAppendix);
            // res.data.contentFile = contentFile && JSON.parse(contentFile);
          }
          if (res.data && res.data.planType == 2) {
            // 规划类型0 无 1、专项规划 2、总体规划
            res.data.ztplan = res.data.planName;
            res.data.planName = "";
          }
          this.srNavPageObj = res.data;
          let data = res.data.data;
          // let data=res.data
          console.log(this.srNavPageObj);
          api_getCustomFormTemplate({
            moduleCode: "3001",
            // templateId: this.templateId,
          }).then((res1) => {
            console.log("res1", res1);
            this.editableTabs = JSON.parse(res1.data.templateDetail);
            this.editableTabs.forEach((item) => {
              item.formArr = JSON.parse(item.formArr);
              console.log("data", data);
              item.formArr.forEach((item1, index) => {
                item.formArr[index].selectData.formView.data = res.data;
                for (
                  let k = 0;
                  k < item1.selectData.formView.config.length;
                  k++
                ) {
                  // 处理计划完成时间为空时不显示
                  if (
                    item1.selectData.formView.config[k] &&
                    item1.selectData.formView.config[k].value ==
                      "projectPlanFinishTime" &&
                    (res.data.projectPlanFinishTime == "" ||
                      res.data.projectPlanFinishTime == null)
                  ) {
                    item1.selectData.formView.config[k].isHide = true;
                  }
                  // 处理市财政局意见附件字段sczjyj
                  if (
                    item1.selectData.formView.config[k] &&
                    item1.selectData.formView.config[k].value == "sczjyj" &&
                    (res.data.projectPlanFinishTime == "" ||
                      res.data.projectPlanFinishTime == null)
                  ) {
                    item1.selectData.formView.config[k].isHide = true;
                  }
                  // 处理密码应用附件字段mmyyshyj
                  if (
                    item1.selectData.formView.config[k] &&
                    item1.selectData.formView.config[k].value == "mmyyshyj" &&
                    (res.data.projectPlanFinishTime == "" ||
                      res.data.projectPlanFinishTime == null)
                  ) {
                    item1.selectData.formView.config[k].isHide = true;
                  }
                }
              });
              // if (data) {
              //   console.log("data", data);

              //   JSON.parse(data).forEach((item1, index) => {
              //     item.formArr[index].selectData.formView.data = item1;
              //   });
              // } else {
              //   item.formArr[0].selectData.formView.data = res.data;
              //   console.log('res.data',res.data)
              // }

              let form = item.formArr[0].selectData.formView;
              let arr = [];
              if (form.data.planType == "0") {
                form.data.planType = "";
              }
              // 处理项目类型不显示问题
              // this.$set(form.data, "projectType", form.data.projectTypeName);
              // this.$set(form.data, "projectType", res.data.projectType2.join(","));
              this.$set(
                form.data,
                "constructionUnit",
                form.data.unitName || ""
              );
              if (form.data.planType == "" || form.data.planType == "无") {
                arr = ["专项发展规划名称", "行业方向", "总体发展规划"];
                form.config.forEach((list) => {
                  arr.forEach((i) => {
                    if (list.label == i) {
                      this.$set(list, "isHide", true);
                      this.$set(list, "isHideView", true);
                    }
                  });
                });
                this.$set(form.data, "industryDirection", "");
                this.$set(form.data, "industryDirection", "");
                this.$set(form.data, "planType", "无");
              } else if (
                form.data.planType === 1 ||
                form.data.planType === "1"
              ) {
                arr = ["总体发展规划"];
                form.config.forEach((list) => {
                  arr.forEach((i) => {
                    if (list.label == i) {
                      this.$set(list, "isHide", true);
                      this.$set(list, "isHideView", true);
                    } else {
                      this.$set(list, "isHide", false);
                      this.$set(list, "isHideView", false);
                    }
                  });
                });
                this.$set(form.data, "planType", "专项发展规划");

                if (this.$route.name == "projectLibraryView") {
                  this.$set(form.data, "planId", form.data.planName);
                } else {
                  this.$set(form.data, "ztplan", form.data.planName);
                }
              } else if (
                form.data.planType === "2" ||
                form.data.planType === 2
              ) {
                arr = ["专项发展规划名称"];
                form.config.forEach((list) => {
                  arr.forEach((i) => {
                    if (list.label == "专项发展规划名称") {
                      this.$set(list, "isHide", true);
                      this.$set(list, "isHideView", true);
                    } else if (list.label == "行业方向") {
                      this.$set(list, "isHide", true);
                      this.$set(list, "isHideView", true);
                    } else {
                      this.$set(list, "isHide", false);
                      this.$set(list, "isHideView", false);
                    }
                  });
                });
                this.$set(form.data, "industryDirection", "");
                this.$set(form.data, "planType", "总体发展规划");
                if (this.$route.name == "projectLibraryView") {
                  this.$set(form.data, "planId", form.data.planName);
                } else {
                  this.$set(form.data, "ztplan", form.data.planName);
                }
              }
            });
          });
        });
      } else if (this.source == 3) {
        console.log("清单");
        console.log("222", this.projectId);
        this.hideData.ghmc = true;
        this.hideData.ghlx = true;
        console.log("this.ghlx", this.hideData);
        getDetailByIdJ({ id: this.projectId }).then((res) => {
          console.log("eeeee", res);
          if (res.data) {
            if (res.data.constructionUnit == res.data.createBuid) {
              res.data.constructionUnit = "";
            } else {
              res.data.constructionUnit = res.data.constructUnitFullName;
              console.log(res.data.constructUnitFullName);
            }
            console.log(res.data);
            // 密码应用
            res.data.isPwdProject = res.data.isPwdProject == 1 ? "是" : "否";
            // 重点列表
            this.tableData = res.data.keyTaskList ? res.data.keyTaskList : [];
            this.form = res.data.planDtos;
            console.log("+++", res.data);
            res.data.constructionCycle =
              (res.data.beginDate || "-") + "至" + (res.data.endDate || "-");
            if (res.data.serviceType) {
              // 服务类型处理
              let list = [];
              res.data.serviceType.map((item1) => {
                this.serverList.map((item) => {
                  if (item.value == item1) {
                    list.push(item.label);
                  }
                });
                res.data.serviceType = list.toString();
              });
            }
            if (res.data.constructionBasis) {
              // 建设依据处理
              let list = [];
              res.data.constructionBasis.map((item1) => {
                this.constructionBasisList.map((item) => {
                  if (item1 == item.value) {
                    list.push(item.label);
                  }
                });
                res.data.constructionBasis = list.toString();
              });
            }
            // 业务范围-公众侧
            if (
              res.data.projectScopePublicSide &&
              res.data.projectScopePublicSide.indexOf("[") !== -1 &&
              res.data.projectScopePublicSide.indexOf("]") !== -1
            ) {
              let list = [];
              let pattern2 = new RegExp("[A-Za-z]+");
              res.data.projectScopePublicSide = JSON.parse(
                res.data.projectScopePublicSide
              ).map((item) => {
                console.log(item);
                if (!pattern2.test(item)) {
                  list.push(item);
                }
                this.projectScopePublicSideList.map((item1) => {
                  console.log(item1);
                  if (item1.value == item) {
                    list.push(item1.label);
                  }
                });
              });
              res.data.projectScopePublicSide = list.toString();
            } else {
              res.data.projectScopePublicSide = res.data.projectScopePublicSide;
            }
            // 业务范围-政务侧
            if (
              res.data.projectScopeGovernmentSide &&
              res.data.projectScopeGovernmentSide.indexOf("[") !== -1 &&
              res.data.projectScopeGovernmentSide.indexOf("]") !== -1
            ) {
              let list = [];
              let pattern2 = new RegExp("[A-Za-z]+");
              res.data.projectScopeGovernmentSide = JSON.parse(
                res.data.projectScopeGovernmentSide
              ).map((item) => {
                console.log(item);
                if (!pattern2.test(item)) {
                  list.push(item);
                }
                this.projectScopeGovernmentSideList.map((item1) => {
                  console.log(item1);
                  if (item1.value == item) {
                    list.push(item1.label);
                  }
                });
              });
              res.data.projectScopeGovernmentSide = list.toString();
            } else {
              res.data.projectScopeGovernmentSide =
                res.data.projectScopeGovernmentSide;
            }
            res.data.yearPlanId = res.data.yearPlanName; //处理查看页面年度计划字段

            res.data.projectDescription = JSON.parse(
              res.data.projectDescription
            );
            res.data.otherAppendix = JSON.parse(res.data.otherAppendix);
            // res.data.contentFile = contentFile && JSON.parse(contentFile);
          }
          if (res.data && res.data.planType == 2) {
            // 规划类型0 无 1、专项规划 2、总体规划
            res.data.ztplan = res.data.planName;
            res.data.planName = "";
          }
          this.srNavPageObj = res.data;
          console.log(this.srNavPageObj);
          api_getCustomFormTemplate({
            moduleCode: "18008",
            // templateId: this.templateId,
          }).then((res2) => {
            this.editableTabs = JSON.parse(res2.data.templateDetail);
            this.editableTabs.forEach((item) => {
              item.formArr = JSON.parse(item.formArr);
              console.log(".........", item.formArr, res.data);
              item.formArr.forEach((item1, index) => {
                item.formArr[index].selectData.formView.data = res.data;
                console.log(
                  "muban..........",
                  item.formArr[index].selectData.formView
                );
                for (
                  let k = 0;
                  k < item1.selectData.formView.config.length;
                  k++
                ) {
                  // 处理计划完成时间为空时不显示
                  if (
                    item1.selectData.formView.config[k] &&
                    item1.selectData.formView.config[k].value ==
                      "projectPlanFinishTime" &&
                    res.data.projectPlanFinishTime == ""
                  ) {
                    item1.selectData.formView.config[k].isHide = true;
                  }
                }
              });

              let form = item.formArr[0].selectData.formView;
              let arr = [];
              if (form.data.planType == "0") {
                form.data.planType = "";
              }
              if (form.data.planType == "" || form.data.planType == "无") {
                arr = ["专项发展规划名称", "行业方向", "总体发展规划"];
                form.config.forEach((list) => {
                  arr.forEach((i) => {
                    if (list.label == i) {
                      this.$set(list, "isHide", true);
                      this.$set(list, "isHideView", true);
                    }
                  });
                });
                this.$set(form.data, "industryDirection", "");
                this.$set(form.data, "industryDirection", "");
                this.$set(form.data, "planType", "无");
              } else if (
                form.data.planType === 1 ||
                form.data.planType === "1"
              ) {
                arr = ["总体发展规划"];
                form.config.forEach((list) => {
                  arr.forEach((i) => {
                    if (list.label == i) {
                      this.$set(list, "isHide", true);
                      this.$set(list, "isHideView", true);
                    } else {
                      this.$set(list, "isHide", false);
                      this.$set(list, "isHideView", false);
                    }
                  });
                });
                this.$set(form.data, "planType", "专项发展规划");
                if (this.$route.name == "projectLibraryView") {
                  this.$set(form.data, "planId", form.data.planName);
                } else {
                  this.$set(form.data, "ztplan", form.data.planName);
                }
              } else if (
                form.data.planType === "2" ||
                form.data.planType === 2
              ) {
                arr = ["专项发展规划名称"];
                form.config.forEach((list) => {
                  arr.forEach((i) => {
                    if (list.label == "专项发展规划名称") {
                      this.$set(list, "isHide", true);
                      this.$set(list, "isHideView", true);
                    } else if (list.label == "行业方向") {
                      this.$set(list, "isHide", true);
                      this.$set(list, "isHideView", true);
                    } else {
                      this.$set(list, "isHide", false);
                      this.$set(list, "isHideView", false);
                    }
                  });
                });
                this.$set(form.data, "industryDirection", "");
                this.$set(form.data, "planType", "总体发展规划");
                if (this.$route.name == "projectLibraryView") {
                  this.$set(form.data, "planId", form.data.planName);
                } else {
                  this.$set(form.data, "ztplan", form.data.planName);
                }
              }
            });
          });
        });
      }
    },

    // 处理初始化项目类型问题
    getServerList() {
      let publicServerList = [];
      let personServerList = [];
      let projectScopePublicSideList = []; //公众侧
      let projectScopeGovernmentSideList = []; //政务侧
      let constructionBasisList = []; //建设依据
      api_getServiceTypeList({ topic: "JHXMK_SERVICE_TYPE_PUBLIC" }).then(
        (res) => {
          res.data.map((item) => {
            publicServerList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.serverList.push(...publicServerList);
        }
      );
      api_getServiceTypeList({ topic: "JHXMK_SERVICE_TYPE_PROFESSIONAL" }).then(
        (res) => {
          res.data.map((item) => {
            personServerList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.serverList.push(...personServerList);
        }
      );
      // 公众侧
      api_getServiceTypeList({ topic: "PROJECT_SCOPE_PUBLIC" }).then((res) => {
        res.data.map((item) => {
          projectScopePublicSideList.push({
            label: item.chName,
            value: item.itemCode,
          });
        });
        this.projectScopePublicSideList.push(...projectScopePublicSideList);
      });
      // 政务侧
      api_getServiceTypeList({ topic: "PROJECT_SCOPE_GOVERNMENT" }).then(
        (res) => {
          res.data.map((item) => {
            projectScopeGovernmentSideList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.projectScopeGovernmentSideList.push(
            ...projectScopeGovernmentSideList
          );
        }
      );
      // 建设依据
      api_getServiceTypeList({ topic: "JHXMK_CONSTRUCTION_BASIS" }).then(
        (res) => {
          res.data.map((item) => {
            constructionBasisList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.constructionBasisList.push(...constructionBasisList);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.right-wrap {
  flex: 1;
  padding-left: 16px;
}
</style>

