<template>
  <div class="riskIssue">
    <div class="title">
      <img :src="imgUrl" alt="" />
      <span class="left"> 项目的风险</span>
      <span class="right"
        >（ 高度：<b style="color: #ff0019">{{ riskList.heightLevelCount }}</b>
        中度：<b style="color: #ffaa22">{{ riskList.moderateLevelCount }}</b>
        轻度： <b style="color: #1890ff">{{ riskList.lightLevelCount }}</b> ）
      </span>
    </div>
    <div class="box_list">
      <div class="line"></div>
      <Risk
        :hideSearchBtn="true"
        :backName="backName"
        :viewProjectId="viewProjectId"
      />
    </div>
    <div class="title">
      <img :src="imgUrl" alt="" />
      <span class="left"> 项目的问题</span>
      <span class="right"
        >（ 高度：<b style="color: #ff0019">{{
          troubleList.heightLevelCount
        }}</b>
        中度：<b style="color: #ffaa22">{{ troubleList.moderateLevelCount }}</b
        >轻度：
        <b style="color: #1890ff">{{ troubleList.lightLevelCount }}</b> ）
      </span>
    </div>
    <div class="box_list">
      <div class="line"></div>
      <Trouble
        :hideSearchBtn="true"
        :backName="backName"
        :viewProjectId="viewProjectId"
      />
    </div>
  </div>
</template>

<script>
import Risk from "@/views/riskAndIssue/risk/index";
import Trouble from "@/views/riskAndIssue/trouble/index";
import { api_getCount } from "@/api/pilotMgr/index.js";
export default {
  props: {
    backName: String,
  },
  data() {
    return {
      viewProjectId: this.$route.query.projectId + "",
      riskList: {},
      troubleList: {},
      imgUrl: require("@/assets/title_lg.png"),
    };
  },
  components: {
    Risk,
    Trouble,
  },
  mounted() {
    this.getCount("risk");
    this.getCount("problem");
  },
  methods: {
    getCount(belongType) {
      let params = {
        projectId: this.$route.query.projectId,
        belongType,
      };
      api_getCount(params).then((res) => {
        if (res.msg.code == "0000") {
          if (belongType == "risk") {
            this.riskList = res.data;
          } else if (belongType == "problem") {
            this.troubleList = res.data;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.riskIssue {
  .title {
    margin: 16px 0 8px 0;
    display: flex;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
    }
    .left {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    .right {
      b {
        margin: 0 5px;
      }
    }
  }
  .box_list {
    margin-left: 9px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    height: 100%;
    border-left: 1px dotted #cccccc;
    // .line {
    //   height: 100%;
    //   margin-right: 16px;
    // }
    .risk {
      width: 98.5%;
    }
    .trouble {
      width: 98.5%;
    }
  }
}
</style>
<style lang="scss">
.riskIssue {
  .el-table__fixed-right {
    height: 100%!important;
  }
}
</style>
