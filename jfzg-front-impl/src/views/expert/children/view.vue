<template>
  <div class="expert_view" v-loading="loading">
    <sr-nav-page
      :project="srNavPageObj"
      :type="5"
      class="top-info"
    ></sr-nav-page>
    <section class="form-config sr-qiankun-add expert_view">
      <div class="total-page">
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="item in tabList"
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
            :buttonList="buttonList"
            backName="expert"
            ref="work_flow"
          ></sr-work-flow>
        </el-tabs>
        <div class="bz-traceTrackView">
          <sr-trace-track
            :imgUrl="imgUrl"
            :trackData="trackData"
            v-if="$route.query.processId"
          >
            <img src="@/assets/xuanting.png" width="20px" alt />
          </sr-trace-track>
        </div>
      </div>
    </section>
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年07月05日 16:34:17
  版本：v1.0
-->
<script>
import one from "./viewStep/one.vue";
import two from "./viewStep/two.vue";
import tree from "./viewStep/tree.vue";
import { detail } from "@/api/expert";
import { getList, srtraceTrackImage } from "@/api/srtracetrack";
import { getProfessionalLevel } from "@/api/expert";
import { listByTopicAndItem } from "@/api/index";
export default {
  components: { one, two, tree },
  computed: {
    id() {
      return this.$route.query.id;
    },
    busiId() {
      return this.$route.query.id;
    },
    processId() {
      return this.$route.query.processId;
    },
    busiType() {
      return this.$route.meta.busiType;
    },
  },
  props: {},
  provide() {
    return {
      activeName: this.activeName,
    };
  },
  data() {
    return {
      loading: true,
      tabList: [
        { title: "基本信息", code: "1" },
        // { title: "行业领域", code: "2" },
        // { title: "其他信息", code: "3" },
      ],
      activeName: "1",
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
      detailedParams: {},
      trackData: [],
      imgUrl: "",
      srNavPageObj: {},
      basePriceList: [],
      nationList: [], //民族
    };
  },
  mounted() {
    if (this.id) {
      this.getDetail();
    }
    if (this.processId) {
      this.getTraceTrack();
      this.getTrackImage();
    }
    this.getProfessionalLevelList();
    this.getnationalityList();
  },
  methods: {
    // 获取民族
    getnationalityList() {
      listByTopicAndItem({ topic: "NATION_ENUM" }).then((res) => {
        this.nationList = res.data;
        console.log("民族", this.nationList);
      });
    },
    // 获取职称列表
    getProfessionalLevelList() {
      getProfessionalLevel().then((res) => {
        this.basePriceList = res.data;
        console.log("职称列表", this.basePriceList);
      });
    },
    getFileUrl(url) {
      let newUrl = JSON.parse(url);
      if (newUrl && typeof newUrl == "string") {
        return [newUrl];
      } else {
        return newUrl;
      }
    },
    //获取详情 拆分属性给组件使用
    getDetail() {
      this.loading = true;
      detail({ id: this.id })
        .then(({ data, msg }) => {
          console.log("data", data);
          this.$nextTick(() => {
            if (data.headPhoto) {
              data.headPhoto = this.getFileUrl(data.headPhoto);
            }
            if (data.identityFrontPhone) {
              data.identityFrontPhone = this.getFileUrl(
                data.identityFrontPhone
              );
            }
            if (data.identityReversePhone) {
              data.identityReversePhone = this.getFileUrl(
                data.identityReversePhone
              );
            }
            const standards = [];
            const planReview = [];
            const govInfoField = [];
            const ICTField = [];
            const appField = [];
            data.expertIndustryVoList &&
              data.expertIndustryVoList.forEach((item) => {
                if (item.itemCode.startsWith("1")) {
                  standards.push(item.chName);
                }
                if (item.itemCode.startsWith("2")) {
                  planReview.push(item.chName);
                }
                if (item.itemCode.startsWith("3")) {
                  govInfoField.push(item.chName);
                }
                if (item.itemCode.startsWith("4")) {
                  ICTField.push(item.chName);
                }
                if (item.itemCode.startsWith("5")) {
                  appField.push(item.chName);
                }
              });
            data.standardsName = standards.join(",");
            data.planReviewName = planReview.join(",");
            data.govInfoFieldName = govInfoField.join(",");
            data.ICTFieldName = ICTField.join(",");
            data.appFieldName = appField.join(",");
            data.isInSystem =
              data.isInSystem == "0"
                ? "体制外"
                : data.isInSystem == "1"
                ? "体制内"
                : "";
            this.basePriceList.map((item) => {
              if (item.id == data.professionalLevelId) {
                data.professionalLevelName = item.name;
                data.basePrice = item.price;
              }
            });
            this.nationList.map((item) => {
              if (item.itemCode == data.nationality) {
                data.nationality = item.chName;
              }
            });
            // if (data.educationPhone) {
            //   data.educationPhone = this.getFileUrl(data.educationPhone)
            // }
            // if (data.diplomaPhone) {
            //   data.diplomaPhone = this.getFileUrl(data.diplomaPhone)
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

            // data.expertLabelTime =
            //   (data.expertLabelStartDate ? data.expertLabelStartDate : "") +
            //   " - " +
            //   (data.expertLabelEndDate ? data.expertLabelEndDate : "");
            // data.expertTime =
            //   (data.expertStartDate ? data.expertStartDate : "") +
            //   " - " +
            //   (data.expertEndDate ? data.expertEndDate : "");

            // if (!data.expertIndustryVoList) {
            //   data.expertIndustryVoList = [];
            // }
            // if (!data.expertTechnicalDirectionVoList) {
            //   data.expertTechnicalDirectionVoList = [];
            // }

            // data.dtoList = data.expertIndustryVoList.map((item) => item.chName);
            // data.dtoList = data.dtoList.join(",");
            // data.expertTechnicalDirectionVoList.forEach((item) => {
            //   if (item.num == 1) {
            //     data.one = item.chName;
            //   } else if (item.num == 2) {
            //     data.two = item.chName;
            //   } else if (item.num == 3) {
            //     data.tree = item.chName;
            //   }
            // });
            console.log("data", data);
            this.detailedParams = data;
            this.srNavPageObj = data;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //留痕轨迹
    getTraceTrack() {
      getList({ busiId: this.busiId, busiType: this.busiType }).then((data) => {
        this.trackData = data.data;
      });
    },
    //留痕轨迹
    getTrackImage() {
      srtraceTrackImage({ processId: this.processId }).then((res) => {
        this.imgUrl = res.data;
      });
    },
  },
};
</script>

<style lang="scss">
.top-info {
  .workNumbering label:last-child {
    display: none;
  }
}
.sr-qiankun-add.expert_view {
  .total-page {
    position: relative;
  }
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
  .el-tabs__nav-wrap {
    &::after {
      height: 1px;
    }
  }
}
.expert_view {
  .sr_time_line_title {
    font-weight: 500;
    color: #333333;
    margin-bottom: 8px;
  }
}
</style>
