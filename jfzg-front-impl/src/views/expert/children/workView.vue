<template>
  <section class="form-config sr-qiankun-add expert_view">
    <sr-nav-page :project="srNavPageObj" :type="5"></sr-nav-page>
    <div class="total-page">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in tabList" :key="item.code" :name="item.code"
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
        <two
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
        </tree>
        <sr-work-flow
          :hideFrom="true"
          :buttonList="buttonList"
          backName="expert"
          ref="work_flow"
          :taskId="taskId"
          v-if="buttonList.length"
          :backFlag="false"
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
import one from "./viewStep/one.vue";
import two from "./viewStep/two.vue";
import tree from "./viewStep/tree.vue";
import { detail } from "@/api/expert";
import { api_activititodo } from "@/api/index";
import { getList, srtraceTrackImage } from "@/api/srtracetrack";
import store from "@/store";

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
      taskId: "",
      userInfo: store.getters.userInfo,
      tabList: [
        { title: "基本信息", code: "1" },
        { title: "行业领域", code: "2" },
        { title: "其他信息", code: "3" },
      ],
      activeName: "1",
      buttonList: [],
      detailedParams: {},
      trackData: [],
      imgUrl: "",
      srNavPageObj: {},
    };
  },
  mounted() {
    this.getDetail();
    this.getTodo();
    if (this.processId) {
      this.getTraceTrack();
      this.getTrackImage();
    }
  },
  methods: {
    //获取详情 拆分属性给组件使用
    getDetail() {
      detail({ id: this.id }).then(({ data, msg }) => {
        this.$nextTick(() => {
          if (data.headPhoto) {
            data.headPhoto = JSON.parse(data.headPhoto);
          }
          if (data.identityFrontPhone) {
            data.identityFrontPhone = JSON.parse(data.identityFrontPhone);
          }
          if (data.identityReversePhone) {
            data.identityReversePhone = JSON.parse(data.identityReversePhone);
          }
          if (data.educationPhone) {
            data.educationPhone = JSON.parse(data.educationPhone);
          }
          if (data.diplomaPhone) {
            data.diplomaPhone = JSON.parse(data.diplomaPhone);
          }
          if (data.professionalPhoto) {
            data.professionalPhoto = JSON.parse(data.professionalPhoto);
          }
          if (data.technologyPhoto) {
            data.technologyPhoto = JSON.parse(data.technologyPhoto);
          }

          if (data.careerPhoto) {
            data.careerPhoto = JSON.parse(data.careerPhoto);
          }
          if (data.file) {
            data.file = JSON.parse(data.file);
          }

          data.expertLabelTime =
            (data.expertLabelStartDate ? data.expertLabelStartDate : "") +
            " - " +
            (data.expertLabelEndDate ? data.expertLabelEndDate : "");
          data.expertTime =
            (data.expertStartDate ? data.expertStartDate : "") +
            " - " +
            (data.expertEndDate ? data.expertEndDate : "");

          if (!data.expertIndustryVoList) {
            data.expertIndustryVoList = [];
          }
          if (!data.expertTechnicalDirectionVoList) {
            data.expertTechnicalDirectionVoList = [];
          }

          data.dtoList = data.expertIndustryVoList.map((item) => item.chName);
          data.dtoList = data.dtoList.join(",");
          data.expertTechnicalDirectionVoList.forEach((item) => {
            if (item.num == 1) {
              data.one = item.chName;
            } else if (item.num == 2) {
              data.two = item.chName;
            } else if (item.num == 3) {
              data.tree = item.chName;
            }
          });
          console.log(data);
          this.detailedParams = data;
          this.srNavPageObj = data;
        });
      });
    },
    getTodo() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;

      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.$route.query.processId,
      };

      api_activititodo(param).then((res) => {
        let assignee = res.data[0].assignee;
        this.buttonList = JSON.parse(res.data[0].description).filter((item) => {
          item.assignee = assignee;
          //按钮筛选  以assignee优先roleCode
          if (assignee == jfid) {
            return true;
          } else if (roleCode == item.role) {
            return true;
          }
        });
        this.taskId = res.data[0].taskId;
        console.log(this.buttonList, "buttonList");
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

<style  lang="scss">
.sr-qiankun-add.expert_view {
  position: relative;
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
.expert_view {
  .sr_time_line_title {
    position: relative;
    .expert_tips_img {
      position: absolute;
      left: -30px;
    }
  }
}
</style>
