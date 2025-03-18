<template>
  <section class="form-config sr-qiankun-add" v-loading="loading">
    <div class="total-page">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabList"
          :disabled="true"
          :key="item.code"
          :name="item.code"
          ><template slot="label" class="tabsLabel">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
              >{{ item.title }}</span
            ></template
          >
        </el-tab-pane>
        <one
          v-show="activeName == 1"
          ref="stepOne"
          :detailedParams="detailedParams"
        ></one>
        <!-- <two
          v-show="activeName == 2"
          ref="stepTwo"
          :detailedParams="detailedParams"
        >
        </two>
        <tree
          v-show="activeName == 3"
          ref="stepTree"
          :detailedParams="detailedParams"
        >
        </tree> -->
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          backName="expert"
          ref="work_flow"
        ></sr-work-flow>
      </el-tabs>
    </div>
  </section>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年07月05日 16:34:17
  版本：v1.0
-->
<script>
import one from "./addStep/one.vue";
import two from "./addStep/two.vue";
import tree from "./addStep/tree.vue";
import { subAndSave, detail } from "@/api/expert";
import { setState } from "@/utils/app-store";
import { mapGetters } from "vuex";
import { getProfessionalLevel } from "@/api/expert";
export default {
  components: { one, two, tree },
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
  props: {},
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

    activeName(value) {
      let arr = [];
      if (value == 1) {
        this.buttonList[0].btns = [
          // {
          //   btnValue: "next",
          //   btnName: "下一步",
          //   btnType: "primary",
          //   btnEventType: "next",
          // },
          {
            btnValue: "btg",
            btnName: "保存",
            btnType: "primary",
            btnEventType: "btg",
          },
        ];
      }
      // else if (value == 2) {
      //   this.buttonList[0].btns = [
      //     {
      //       btnName: "上一步",
      //       btnValue: "last",
      //       btnType: "default",
      //       btnEventType: "last",
      //     },
      //     {
      //       btnValue: "next",
      //       btnName: "下一步",
      //       btnType: "primary",
      //       btnEventType: "next",
      //     },
      //     {
      //       btnValue: "btg",
      //       btnName: "保存",
      //       btnType: "primary",
      //       btnEventType: "btg",
      //     },
      //   ];
      // } else if (value == 3) {
      //   this.buttonList[0].btns = [
      //     {
      //       btnName: "上一步",
      //       btnValue: "last",
      //       btnType: "default",
      //       btnEventType: "last",
      //     },
      //     {
      //       btnName: "提交",
      //       btnValue: "tg",
      //       btnType: "primary",
      //       btnEventType: "tg",
      //     },
      //     {
      //       btnValue: "btg",
      //       btnName: "保存",
      //       btnType: "default",
      //       btnEventType: "btg",
      //     },
      //   ];
      // }
    },
  },
  provide() {
    return {
      activeName: this.activeName,
    };
  },
  data() {
    return {
      loading: false,
      tabList: [
        { title: "基本信息", code: "1" },
        // { title: "行业领域", code: "2" },
        // { title: "其他信息", code: "3" },
      ],
      activeName: "",
      clickmethods: {
        tg: this.tg,
        btg: this.btg,
        last: this.last,
        next: this.next,
      },
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
      oneParams: {},
      twoParams: {},
      treeParams: {},
      detailedParams: {},
      basePriceList: [], //职称列表
    };
  },
  mounted() {
    this.activeName = "1";
    if (this.$route.query.id) {
      this.getDetail();
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.$route.query.id) {
        this.getDetail();
      }
    });
    this.getProfessionalLevelList();
  },

  methods: {
    // 获取职称列表
    getProfessionalLevelList() {
      getProfessionalLevel().then((res) => {
        this.basePriceList = res.data;
        console.log("职称列表", this.basePriceList);
      });
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subexpert", this.$setState);
    },
    routeUpdata() {
      var routerBase = "/subexpert";
      setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },
    //上一步
    last() {
      --this.activeName;
      this.activeName = String(this.activeName);
    },
    //提交
    tg() {
      this.modificationParams();
      let params = this.modificationParams();
      params.status = "2";
      subAndSave(params).then(({ msg }) => {
        if (msg.code == "0000") {
          this.$message.success("提交成功");
          this.routeClose();
          this.$router.push({ name: "expert" });
        }
      });
    },
    //保存
    btg() {
      this.$refs.stepOne.$refs.step_one.validate((valid) => {
        console.log("valid", valid);
        if (!valid) return;
        const expertId = this.$route.query.id;
        // let params = this.modificationParams(false);
        const params = { ...this.$refs.stepOne.form.data };
        params.expertIndustryDtoList = [
          ...params.standards,
          ...params.planReview,
          ...params.govInfoField,
          ...params.ICTField,
          ...params.appField,
        ].map((value) => ({
          ...(expertId && { expertId }),
          itemCode: value,
        }));
        params.headPhoto = JSON.stringify(params.headPhoto);
        params.identityFrontPhone = JSON.stringify(params.identityFrontPhone);
        params.identityReversePhone = JSON.stringify(
          params.identityReversePhone
        );
        delete params.standards;
        delete params.planReview;
        delete params.govInfoField;
        delete params.ICTField;
        delete params.appField;
        console.log(params);
        // params.status = "2";
        subAndSave(params).then(({ msg }) => {
          if (msg.code == "0000") {
            this.$message.success("保存成功");
            this.routeClose();
            this.$router.push({ name: "expert" });
          } else {
            this.$message.error(msg.message);
          }
        });
      });
    },
    //下一步
    next() {
      if (this.activeName == 1) {
        let flag = this.$refs.stepOne.verification();
        if (flag) {
          console.log(flag, "oneFlag");
          this.oneParams = flag;
          ++this.activeName;
          this.activeName = String(this.activeName);
        }
      } else if (this.activeName == 2) {
        let flag = this.$refs.stepTwo.verification();
        if (flag) {
          console.log(flag, "twoFlag");
          this.twoParams = flag;
          ++this.activeName;
          this.activeName = String(this.activeName);
        }
      }
    },
    //提交保存时整合数据交给后台
    //根据isvalidate 判断从$refs里面拿数据还是从验证里面拿
    modificationParams(isvalidate = true) {
      let params;
      if (isvalidate) {
        params = {
          ...this.oneParams,
          ...this.twoParams,
          ...this.$refs.stepTree.form.data,
        };
      } else {
        params = {
          ...this.$refs.stepOne.form.data,
          ...this.$refs.stepTwo.form.data,
          ...this.$refs.stepTree.form.data,
        };
      }

      let one = [],
        two = [],
        tree = [];
      let enums = this.$refs.stepTwo.form.enums;
      console.log(params);
      console.log(enums, "enums");
      params.expertTechnicalDirectionDtoList = [];
      params.expertIndustryDtoList = [];
      params.headPhoto = JSON.stringify(params.headPhoto);
      params.identityFrontPhone = JSON.stringify(params.identityFrontPhone);
      params.identityReversePhone = JSON.stringify(params.identityReversePhone);
      params.educationPhone = JSON.stringify(params.educationPhone);
      params.diplomaPhone = JSON.stringify(params.diplomaPhone);
      params.professionalPhoto = JSON.stringify(params.professionalPhoto);
      params.technologyPhoto = JSON.stringify(params.technologyPhoto);
      params.file = JSON.stringify(params.file);
      params.careerPhoto = JSON.stringify(params.careerPhoto);
      if (params.expertLabelTime.length) {
        params.expertLabelStartDate = params.expertLabelTime[0];
        params.expertLabelEndDate = params.expertLabelTime[1];
      }
      if (params.expertTime.length) {
        params.expertStartDate = params.expertTime[0];
        params.expertEndDate = params.expertTime[1];
      }
      console.log(enums.oneList, "oneList");
      //技术方向下拉数据整合
      if (params.one) {
        enums.oneList.forEach((item) => {
          if (item.itemCode == params.one) {
            item.num = "1";
            one.push(JSON.parse(JSON.stringify(item)));
          }
        });
      }
      if (params.two) {
        enums.oneList.forEach((item) => {
          if (item.itemCode == params.two) {
            item.num = "2";
            two.push(JSON.parse(JSON.stringify(item)));
          }
        });
      }
      if (params.tree) {
        enums.oneList.filter((item) => {
          if (item.itemCode == params.tree) {
            item.num = "3";
            tree.push(JSON.parse(JSON.stringify(item)));
          }
        });
      }
      console.log(one, two, tree);
      params.expertTechnicalDirectionDtoList = [...one, ...two, ...tree];
      console.log(params.expertTechnicalDirectionDtoList);

      //行业领域数据整合
      console.log(params.dtoList, "params.dtoList");
      let list1 = [];
      if (enums.expertIndustryVoList && enums.expertIndustryVoList.length > 0) {
        enums.expertIndustryVoList.forEach((list) => {
          console.log(list, "list");
          if (params.dtoList && params.dtoList.length > 0) {
            params.dtoList.forEach((i) => {
              if (list.itemCode == i) {
                list1.push(list);
              }
            });
          }
        });
      }

      params.expertIndustryDtoList = list1;
      console.log(params.expertIndustryDtoList);
      console.log(params);
      return params;
    },

    //获取详情 拆分属性给组件使用

    getDetail() {
      this.loading = true;
      detail({ id: this.$route.query.id })
        .then(({ data, msg }) => {
          this.$nextTick(() => {
            console.log("详情信息", data);
            // let enums = this.$refs.stepTwo.form.enums;
            if (data.headPhoto) {
              data.headPhoto = JSON.parse(data.headPhoto);
            }
            if (data.identityFrontPhone) {
              data.identityFrontPhone = JSON.parse(data.identityFrontPhone);
            }
            if (data.identityReversePhone) {
              data.identityReversePhone = JSON.parse(data.identityReversePhone);
            }
            const standards = [];
            const planReview = [];
            const govInfoField = [];
            const ICTField = [];
            const appField = [];
            data.expertIndustryVoList &&
              data.expertIndustryVoList.forEach((item) => {
                if (item.itemCode.startsWith("1")) {
                  standards.push(item.itemCode);
                }
                if (item.itemCode.startsWith("2")) {
                  planReview.push(item.itemCode);
                }
                if (item.itemCode.startsWith("3")) {
                  govInfoField.push(item.itemCode);
                }
                if (item.itemCode.startsWith("4")) {
                  ICTField.push(item.itemCode);
                }
                if (item.itemCode.startsWith("5")) {
                  appField.push(item.itemCode);
                }
              });
            data.standards = standards;
            data.planReview = planReview;
            data.govInfoField = govInfoField;
            data.ICTField = ICTField;
            data.appField = appField;
            this.basePriceList.map((item) => {
              console.log("item", item);
              if (item.id == data.professionalLevelId) {
                data.professionalLevelName = item.name;
                data.basePrice = item.price;
              }
            });
            // data.professionalLevelName = data.professionalLevelId.toString();
            // if (data.educationPhone) {
            //   data.educationPhone = JSON.parse(data.educationPhone);
            // }
            // if (data.diplomaPhone) {
            //   data.diplomaPhone = JSON.parse(data.diplomaPhone);
            // }
            // if (data.professionalPhoto) {
            //   data.professionalPhoto = JSON.parse(data.professionalPhoto);
            // }
            // if (data.technologyPhoto) {
            //   data.technologyPhoto = JSON.parse(data.technologyPhoto);
            // }

            // if (data.careerPhoto) {
            //   data.careerPhoto = JSON.parse(data.careerPhoto);
            // }
            // if (data.file) {
            //   data.file = JSON.parse(data.file);
            // }
            // if (!data.birthDate) {
            //   data.birthDate = "";
            // }
            // if (!data.careerDate) {
            //   data.careerDate = "";
            // }
            // if (!data.careerDate) {
            //   data.careerDate = "";
            // }
            // if (!data.examineDate) {
            //   data.examineDate = "";
            // }
            // if (!data.expertEndDate) {
            //   data.expertEndDate = "";
            // }
            // if (!data.expertLabelEndDate) {
            //   data.expertLabelEndDate = "";
            // }
            // if (!data.expertLabelName) {
            //   data.expertLabelName = "";
            // }
            // if (!data.expertLabelStartDate) {
            //   data.expertLabelStartDate = "";
            // }
            // if (!data.expertStartDate) {
            //   data.expertStartDate = "";
            // }
            // if (!data.majorDate) {
            //   data.majorEndDate = "";
            // }
            // if (!data.professionalDate) {
            //   data.professionalDate = "";
            // }
            // if (!data.technologyDate) {
            //   data.technologyDate = "";
            // }
            // if (!data.workEndDate) {
            //   data.workEndDate = "";
            // }
            // if (!data.workStartDate) {
            //   data.workStartDate = "";
            // }
            // data.expertLabelTime = [
            //   data.expertLabelStartDate,
            //   data.expertLabelEndDate,
            // ];
            // data.expertTime = [data.expertStartDate, data.expertEndDate];
            // if (
            //   data.expertIndustryVoList &&
            //   data.expertIndustryVoList.length > 0
            // ) {
            //   data.dtoList = data.expertIndustryVoList.map(
            //     (item) => item.itemCode
            //   );
            // }

            // if (
            //   data.expertTechnicalDirectionVoList &&
            //   data.expertTechnicalDirectionVoList.length
            // ) {
            //   data.expertTechnicalDirectionVoList.forEach((item) => {
            //     if (item.num == 1) {
            //       data.one = item.itemCode;
            //     } else if (item.num == 2) {
            //       data.two = item.itemCode;
            //     } else if (item.num == 3) {
            //       data.tree = item.itemCode;
            //     }
            //   });
            //   enums.oneList = enums.oneList.map((item) => {
            //     const arrs = data.expertTechnicalDirectionVoList.find(
            //       (i) => item.itemCode == i.itemCode
            //     );
            //     return {
            //       ...item,
            //       ...arrs,
            //     };
            //   });
            // } else {
            //   data.one = "";
            //   data.two = "";
            //   data.tree = "";
            // }
            console.log(data, "data");
            this.detailedParams = data;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style  lang="scss">
.sr-qiankun-add {
  .el-tabs__content {
    padding: 0;
  }
  .sr-add {
    .rightSlot {
      font-weight: 500;
      color: #333333;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
