<template>
  <section class="projectBaseMessage">
    <!--  <SrView :formData="config" :ruleForm="data"></SrView> -->
    <el-timeline class="mgt28">
      <el-timeline-item
        v-for="(item1, index1) in editableTabs[0].formArr"
        :key="index1"
        :type="item1.type || 'primary'"
        :color="item1.color"
        class="timeline_class"
        :size="item1.size || 'large'"
      >
        <img :src="imgUrl_timeline" alt="" class="imgUrl_class" />
        <span class="imgUrl_class_title" v-if="item1.title">{{
          item1.title
        }}</span>
        <SrView
          v-if="item1.selectData.formView"
          :formData="item1.selectData.formView.config"
          :ruleForm="item1.selectData.formView.data"
        >
          <template :slot="slotSrView" slot-scope="{ value }">
            <slot :name="slotSrView" :value="value"></slot>
          </template>
        </SrView>
      </el-timeline-item>
    </el-timeline>
  </section>
</template>
<script>
import { api_getDetailById, api_queryChildExist } from "@/api/projectLibrary";
import { api_afferentUrlOfGet, api_getCustomFormTemplate } from "@/api/index";
import { api_getServiceTypeList } from "@/api/biangeng";
export default {
  props: {
    projectId: [String, Number], // 项目id
  },
  watch: {
    projectId(val) {
      if (val) {
        this.init(val);
        this.getServerList(); //服务类型
        this.getProjectCoverageList(); //业务覆盖面
        this.getConstructionCategoryList(); //建设类别
        this.getConstructionBasisList(); //建设依据
        this.getProjectMaturityList(); //项目成熟度
      }
    },
  },
  mounted() {
    if (this.projectId) {
      this.init(this.projectId);
      this.getServerList();
      this.getProjectCoverageList();
      this.getConstructionCategoryList();
      this.getConstructionBasisList();
      this.getProjectMaturityList();
    }
  },
  data() {
    return {
      constructionUnitList: [
        { dataName: "无", dataValue: 0 },
        { dataName: "专项规划", dataValue: 1 },
        { dataName: "总体规划", dataValue: 2 },
      ],
      config: [
        {
          label: "计划总投资(万元)",
          span: 8,
          value: "totalInvestmentAmount",
        },
        {
          label: "项目类型",
          span: 8,
          value: "projectTypeName",
        },
        // {
        //   label: "项目性质",
        //   span: 8,
        //   value: "projectNature",
        // },
        {
          label: "计划开始年份",
          span: 8,
          value: "beginDate",
        },
        {
          label: "计划结束年份",
          span: 8,
          value: "endDate",
        },
        {
          label: "建设单位",
          span: 8,
          value: "constructionUnit",
        },
        {
          label: "建设地点",
          span: 8,
          value: "constructionSite",
        },
        {
          label: "联系人",
          span: 8,
          value: "contactName",
        },
        {
          label: "联系电话",
          span: 8,
          value: "contactMobile",
        },
        {
          label: "是否存在子项目",
          span: 8,
          value: "isChildExist",
        },
        {
          value: "contentFile",
          label: "附件",
          span: 24,
          type: "uploader",
          colNum: 3, // 一行几个附件
          maxFeild: 15, // 单个附件显示几个字
        },
      ],
      data: {},
      editableTabs: [],
      fromData: {},
      imgUrl_timeline: require("@/assets/title_lg.png"),
      serverList: [], //服务类型
      projectCoverageList: [], //业务覆盖面
      constructionCategoryList: [], //建设类别
      constructionBasisList: [], //建设依据
      projectMaturityList: [], //项目成熟度
      projectScopePublicSideList: [], //公众侧
      projectScopeGovernmentSideList: [], //政务侧
    };
  },
  methods: {
    async init(id) {
      let res = await api_getDetailById({ id });
      console.log("res", res);
      let res1 = await api_getCustomFormTemplate({
        // moduleCode: "3001",
        moduleCode: "18008",
      });
      if (!res.data || res.msg.code != "0000") return;
      if (!res1.data || !res1.msg.code != "0000") return;
      let editableTabs = JSON.parse(res1.data.templateDetail);
      let formArr = [];
      if (editableTabs && editableTabs.length) {
        formArr = JSON.parse(editableTabs[0].formArr);
      }

      editableTabs.forEach((item) => {
        item.formArr = JSON.parse(item.formArr);
        /* // item.formArr[0].selectData.formView.data = res.data;
        console.log(item, ".....");
        item.formArr = JSON.parse(item.formArr); */
        // item.formArr[0].selectData.formView.data = res.data;
        item.formArr.forEach((item1, index) => {
          item.formArr[index].selectData.formView.data = res.data;
          for (let k = 0; k < item1.selectData.formView.config.length; k++) {
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
          }
        });
        // 隐藏计划完成时间
        /* for (let k = 0; k < formArr[0].selectData.formView.config.length; k++) {
          // 处理计划完成时间为空时不显示
          if (
            formArr[0].selectData.formView.config[k] &&
            formArr[0].selectData.formView.config[k].value ==
              "projectPlanFinishTime" &&
            !res.data.projectPlanFinishTime
          ) {
            formArr[0].selectData.formView.config[k].isHide = true;
          }
        } */
      });
      this.editableTabs = editableTabs;
      console.log("editableTabs", editableTabs);
      if (formArr.length) {
        this.config = formArr[0].selectData.formView.config;
      }
      // 年度计划
      res.data.yearPlanId = res.data.yearPlanName;
      console.log("config", this.config);
      // 建设周期格式化-至-
      res.data.constructionCycle =
        (res.data.beginDate || "-") + "至" + (res.data.endDate || "-");

      if (res.data.serviceType) {
        // 服务类型的处理
        let list = [];
        res.data.serviceType.map((item) => {
          console.log(item);
          this.serverList.map((item2) => {
            console.log(item2);
            if (item == item2.value) {
              list.push(item2.label);
            }
          });
        });
        res.data.serviceType = list.toString();
        console.log("list", list);
      }
      // 业务覆盖面
      this.projectCoverageList.map((item) => {
        if (item.value == res.data.projectCoverage) {
          res.data.projectCoverage = item.label;
        }
      });
      // 建设类别
      this.constructionCategoryList.map((item) => {
        if (item.value == res.data.constructionCategory) {
          res.data.constructionCategory = item.label;
        }
      });
      // 建设依据
      this.constructionBasisList.map((item) => {
        if (item.value == res.data.constructionBasis) {
          res.data.constructionBasis = item.label;
        }
      });
      // 项目成熟度
      this.projectMaturityList.map((item) => {
        if (item.value == res.data.projectMaturity) {
          res.data.projectMaturity = item.label;
        }
      });
      // 业务范围-公众侧
      if (
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
      let childRes = await api_queryChildExist({ id });
      console.log("chilRes", childRes);
      res.data.name = res.data.projectName;
      res.data.mainProjectCode = res.data.projectCode;
      // res.data.projectType = res.data.projectTypeName;
      res.data.totalinvestmentAmount = res.data.totalInvestmentAmount;
      let obj = {
        ...res.data,
        contentFile: res.data.contentFile
          ? JSON.parse(res.data.contentFile)
          : [],
        isChildExist: childRes?.data ? "是" : " 否",
      };
      this.config.forEach((item2) => {
        if (item2.dataConfig && item2.dataConfig.url) {
          this.dataConfigAjax(item2.dataConfig, item2.value, obj);
        }
      });
      this.$set(this, "data", obj);
      this.isProjectLibrary();
      this.$emit("projectInit", obj);
    },
    //服务类型
    getServerList() {
      let publicServerList = [];
      let personServerList = [];
      let projectScopePublicSideList = []; //公众侧
      let projectScopeGovernmentSideList = []; //政务侧
      api_getServiceTypeList({ topic: "JHXMK_SERVICE_TYPE_PUBLIC" }).then(
        (res) => {
          console.log("服务类型公共", res);
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
          console.log("服务类型专业", res);
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
    },
    // 业务覆盖面
    getProjectCoverageList() {
      let projectCoverageList = [];
      api_getServiceTypeList({ topic: "JHXMK_PROJECT_COVERAGE" }).then(
        (res) => {
          console.log("业务覆盖面", res);
          res.data.map((item) => {
            console.log(item);
            projectCoverageList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.projectCoverageList.push(...projectCoverageList);
        }
      );
    },
    // 建设类别
    getConstructionCategoryList() {
      let constructionCategoryList = [];
      api_getServiceTypeList({ topic: "JHXMK_CONSTRUCTION_CATEGORY" }).then(
        (res) => {
          console.log("建设类型", res);
          res.data.map((item) => {
            console.log(item);
            constructionCategoryList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.constructionCategoryList.push(...constructionCategoryList);
        }
      );
    },
    // 建设依据
    getConstructionBasisList() {
      let constructionBasisList = [];
      api_getServiceTypeList({ topic: "JHXMK_CONSTRUCTION_BASIS" }).then(
        (res) => {
          console.log("建设依据", res);
          res.data.map((item) => {
            console.log(item);
            constructionBasisList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.constructionBasisList.push(...constructionBasisList);
        }
      );
    },
    // 项目成熟度
    getProjectMaturityList() {
      let projectMaturityList = [];
      api_getServiceTypeList({ topic: "JHXMK_PROJECT_MATURITY" }).then(
        (res) => {
          console.log("项目成熟度", res);
          res.data.map((item) => {
            console.log(item);
            projectMaturityList.push({
              label: item.chName,
              value: item.itemCode,
            });
          });
          this.projectMaturityList.push(...projectMaturityList);
        }
      );
    },
    //专项规划 行业方向
    dataConfigAjax(config, bind, data) {
      this.flag = false;
      if (config.params[0]) {
        var param = {
          [config.params[0].key]: config.params[0].value,
        };
      } else {
        var param = {};
      }
      api_afferentUrlOfGet(config.url, param).then((res) => {
        res.data.forEach((item) => {
          if (data[bind] == item.itemCode) {
            data[bind] = item.chName;
          }
        });
        this.flag = true;
      });
    },
    //根据规划type  设置字段显示
    isProjectLibrary() {
      let form = this;
      console.log("form", form);
      if (form.data.planType == "0") {
        form.data.planType = "";
      }
      // this.$set(form.data, "projectType", form.data.projectTypeName);
      this.$set(form.data, "constructionUnit", form.data.unitName || "");
      if (form.data.planType == "") {
        this.$set(form.config[3], "isHideView", true);
        this.$set(form.config[4], "isHideView", true);
        this.$set(form.config[5], "isHideView", true);
        // this.$set(form.config[3], "isHide", true);
        // this.$set(form.config[4], "isHide", true);
        // this.$set(form.config[5], "isHide", true);
        this.$set(form.data, "planType", "无");
      } else if (form.data.planType == "1") {
        this.$set(form.config[3], "isHideView", false);
        this.$set(form.config[4], "isHideView", false);
        this.$set(form.config[5], "isHideView", true);
        this.$set(form.config[3], "isHide", false);
        this.$set(form.config[4], "isHide", false);
        this.$set(form.config[5], "isHide", true);
        this.$set(form.data, "planType", "专项发展规划");
        this.$set(form.data, "planId", form.data.planName);
      } else if (form.data.planType == "2") {
        this.$set(form.config[3], "isHideView", true);
        this.$set(form.config[4], "isHideView", true);
        this.$set(form.config[5], "isHideView", false);
        this.$set(form.config[3], "isHide", true);
        this.$set(form.config[4], "isHide", true);
        this.$set(form.config[5], "isHide", false);
        this.$set(form.data, "planType", "总体发展规划");
        this.$set(form.data, "planId", form.data.planName);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-timeline-item__tail:last-child {
  display: flex !important;
  border-left: 2px dashed #efefef;
}
::v-deep .el-timeline-item__tail {
  display: flex !important;
  border-left: 2px dashed #efefef;
}
// .mgt28 {
//   margin-top: 28px;
// }
.timeline_class {
  position: relative;
}
.imgUrl_class {
  position: absolute;
  height: 22px;
  width: 22px;
  left: -5px;
  top: -1px;
}
</style>
