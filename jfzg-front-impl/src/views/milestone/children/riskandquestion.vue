<template>
  <div class="riskAndPues">
    <div class="title">
      <img :src="imgUrl" alt="" />
      <span class="left"> 项目的风险</span>
      <span class="right"
        >（高度：<b style="color: #ff0019">{{ risk_height }}</b> 中度：<b
          style="color: #ffaa22"
          >{{ risk_medium }}</b
        >轻度： <b style="color: #1890ff">{{ risk_low }}</b
        >）
      </span>
    </div>
    <div class="box_list">
      <div class="line"></div>
      <Risk class="Table" :hideSearchBtn="true" :viewProjectId="$route.query.projectId" />
    </div>
    <div class="title">
      <img :src="imgUrl" alt="" />
      <span class="left"> 项目的问题</span>
      <span class="right"
        >（高度：<b style="color: #ff0019">{{ problem_height }}</b> 中度：<b
          style="color: #ffaa22"
          >{{ problem_medium }}</b
        >轻度： <b style="color: #1890ff">{{ problem_low }}</b
        >）
      </span>
    </div>
    <div class="box_list">
      <div class="line"></div>
      <Trouble
        class="Table"
        :hideSearchBtn="true"
        :viewProjectId="$route.query.projectId"
      />
    </div>
  </div>
</template>

<script>
import { projectRiskProblemCount } from "@/api/milestone/index";
import Risk from "@/views/riskAndIssue/risk/index";
import Trouble from "@/views/riskAndIssue/trouble/index";
export default {
  components: {
    Risk,
    Trouble,
  },

  data() {
    return {
      risk_height: 0,
      risk_medium: 0,
      risk_low: 0,
      imgUrl: require("@/assets/title_lg.png"),
      problem_height: 0,
      problem_medium: 0,
      problem_low: 0,
    };
  },
  mounted() {
    this.projectRiskProblemCount_risk();
    this.projectRiskProblemCount_problem();
  },
  methods: {
    // 获取风险问题数量
    projectRiskProblemCount_risk() {
      let data = {
        belongType: "risk",
        stageId:this.$route.query.stageId,
        projectId: this.$route.query.projectId,
      };
      projectRiskProblemCount(data).then((res) => {
        if (res.msg.code == "0000") {
          this.risk_height = res.data.heightLevelCount;
          this.risk_medium = res.data.moderateLevelCount;
          this.risk_low = res.data.lightLevelCount;
        }
      });
    },
    // 获取风险问题数量
    projectRiskProblemCount_problem() {
      let data = {
        belongType: "problem",
        stageId:this.$route.query.stageId,
        projectId: this.$route.query.projectId,
      };
      projectRiskProblemCount(data).then((res) => {
        if (res.msg.code == "0000") {
          this.problem_height = res.data.heightLevelCount;
          this.problem_medium = res.data.moderateLevelCount;
          this.problem_low = res.data.lightLevelCount;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.riskAndPues {
  .title {
    margin: 16px 0 8px 0;
    display: flex;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
      margin-right: 5px;
    }
    .left {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      margin-right: 10px;
    }
    .right {
      b {
        margin: 0 10px;
      }
    }
  }
  .box_list {
    display: -webkit-box;
    .line {
      border-left: 1px dotted #cccccc;
      margin: 0 16px 0 10px;
    }
    .Table {
      width: 99%;
    }
  }
}
</style>
