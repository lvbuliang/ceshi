<template>
  <div class="total-page">
    <div class="text">基本信息</div>
    <div>
      <SrView
        :formData="followforms.config"
        :ruleForm="followforms.data"
        :ref="`form`"
      >
        <template slot="name3" slot-scope="scope">
          <el-col style="display: flex">
            <label
              class="label-item ellipsis"
              title="项目名称"
              style="width: 70%"
              >项目名称
            </label>

            <el-tooltip
              :content="followforms.data.projectName"
              placement="top"
              effect="light"
            >
              <button
                style="
                  border: none;
                  float: left;
                  background: #fff;
                  margin-left: 10px;
                  line-height: 40px;
                "
                @click="chakan(scope.scope)"
              >
                <div
                  :class="
                    buName.includes('豫信') ? 'table_unitName' : 'p_unitName'
                  "
                >
                  {{ followforms.data.projectName }}
                </div>
              </button>
            </el-tooltip>
          </el-col>
        </template>
      </SrView>
    </div>
    <div class="bottom-btns">
      <div class="btns">
        <slot name="btnList"></slot>
        <div class="back-btn">
          <el-button plain size="medium" @click="onBackClick"
            >返回列表</el-button
          >
          <el-button  v-if=isFromWorkBench type='success' size="small" @click="backWorkBench">前往工作台</el-button>
        </div>
      </div>
    </div>
    <!-- v-if="trackData.length != 0" -->
    <srStacetrack
      ref="track"
      class="track"
      :imgUrl="imgUrl"
      :trackData="trackData"
      :srTraceArr="srTraceArr"
      :srTraceActive="srTraceActive"
      :trackLoading="trackLoading"
    ></srStacetrack>
  </div>
</template>
<script>
import srStacetrack from "../components/srStacetrack.vue";
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { api_activititodo } from "@/api/index";
import srtracetrack from "@/utils/srtracetrack";
import { setTack } from "../const.js";
import { getSeePorManagment } from "@/api/projectManagement/index.js";

export default {
  components: { srStacetrack },
  computed: {},
  data() {
    return {
      isFromWorkBench: false,//是否从工作台进入
      trackLoading: true,
      buttonList: [],
      userInfo: store.getters.userInfo,
      buName: store.getters.userInfo.currentBizunit.buName,
      followforms: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "系统名称:",
            value: "systemName",
            col: 12,
            type: "value",
          },
          // {
          //   value: "projectName",
          //   label: "项目名称:",
          //   span: 12,
          //   type: "value",
          // },
          {
            type: "slot",

            slotName: "name3",
            span: 12,
          },
          {
            value: "projectCode",
            label: "项目编号",
            span: 12,
            type: "value",
          },
          {
            value: "applicationUnit",
            label: "需求部门",
            span: 12,
            type: "value",
          },
          {
            value: "yearPlanName",
            label: "所属年度计划",
            span: 12,
            type: "value",
          },
          {
            value: "source",
            label: "项目类型",
            span: 12,
            type: "value",
          },
          {
            value: "needDeliveryTime",
            label: "需交付使用时间",
            span: 12,
            type: "value",
          },
          {
            value: "clientManagerName",
            label: "客户经理",
            span: 12,
            type: "value",
          },
          {
            value: "projectProcurementName",
            label: "采购经理",
            span: 12,
            type: "value",
          },
        ],

        data: {
          needDeliveryTime: "",
          source: "",
          yearPlanName: "",
          handlapplicationUniteTime: "",
          projectCode: "",
          projectName: "",
          systemName: "",
          clientManagerName: "",
          applicationUnit: "",
        },
        enums: {},
      },
      processId: null,
      projeciId: null,
      todoData: null,
      trackData: [],
      markData: [],
      imgUrl: "",
      srtracetrackRequest: srtracetrack,
      srTraceActive: 1,
      srTraceArr: [
        {
          description: "客户经理-发起立项",
          name: "客户经理发起立项提审",
        },
        {
          description: "客户经理-集团审议",
          name: "集团审议通过",
        },
        {
          description: "方案经理-内部立项",
          name: "内部立项通过",
        },
      ],
    };
  },
  computed: {
    // busiId() {
    //   return this.userInfo.jfid;
    // },
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
  },
  methods: {
    backWorkBench(){
    this.$router.go(-1)
    },
    getTraceTrack(val) {
      if (!this.busiType || !val) {
        this.trackLoading = false;
      } else {
        this.trackLoading = true;
        this.srtracetrackRequest.getTraceTrackList(
          { busiId: val, busiType: this.busiType },
          (res) => {
            this.trackData = res.data;
            this.trackLoading = false;
            let tname = this.trackData[0].name;
            this.srTraceArr.forEach((item, index) => {
              if (item.name == tname) {
                this.srTraceActive = index + 1;
              }
            });
            setTack(this.trackData)
          }
        );
      }
    },
    //留痕轨迹图片
    getTraceTrackImage() {
      if (!this.processId) return;
      this.srtracetrackRequest.getTraceTrackImage(
        { processId: this.processId },
        (res) => {
          this.imgUrl = res.data;
        }
      );
    },
    //触摸留痕轨迹
    getHoverTraceTrack(val) {
      if (!this.busiType || !val) return;
      this.srtracetrackRequest.hoverTraceTrackList(
        {
          busiId: val,
          busiType: this.busiType,
          // projectId: this.projectId,
        },
        (res) => {
          this.markData = res.data;
          this.markData = res.data.map((item) => {
            if (item.operatorTime) {
              let str = item.operatorTime.split("-").splice(1, 2).join("-");
              item.operatorTime = str;
            }
            return item;
          });
        }
      );
    },
    onBackClick() {
      this.$router.push({
        name: "projectManagement",
      });
    },
    async getSee() {
      let dataPar = {
        processId: this.processId,
        projectId: this.projeciId,
      };
      const res = await getSeePorManagment(dataPar);
      if (res.msg.code == "0000") {
        Object.keys(res.data).forEach((item) => {
          if (res.data[item]) {
            this.followforms.data[item] = res.data[item];
          }
        });

        if (Number(res.data.source) == 0) {
          this.followforms.data.source = "统建类项目";
        } else {
          this.followforms.data.source = "承建类项目";
        }

        this.getTraceTrack(res.data.projectIntiaonId);
      }
    },
    chakan(row) {
      if (this.buName.includes("豫信")) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.$route.query.projectId,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName: "立项",
          },
          // 查看相关逻辑
        });
      }
    },
  },

  created() {
    let query = this.$route.query;
    const { projectId, processId } = query;

    this.projeciId = projectId;
    this.processId = processId;
  },
  mounted() {
    if(this.$route.query.activeName=='已办'){ 
      this.isFromWorkBench = true
    }
    this.getSee();
  },

  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
::v-deep .sr-view .el-col-24 .label-item {
  width: 50% !important;
}
.text {
  padding: 0 20px;
  padding-top: 20px;
  font-size: 16px;
  font-weight: 700;
}
.start {
  padding-top: 10px;
}
.track {
  padding: 20px 26px;
}
.sr-view {
  padding: 10px 40px;
}
.bottom-btns {
  height: 64px;
  text-align: center;
  padding-top: 16px;
  // position: fixed;
  // bottom: 5%;
  // left: 50%;
  .btns {
    height: 64px;
    text-align: center;
    position: relative;
    .btnList {
      display: inline-block;
    }
    .back-btn {
      display: inline-block;
      margin-left: 16px;
    }
    button {
      padding: 0px 24px;
      line-height: 32px;
    }
  }
}
.table_unitName {
  color: rgba(66, 130, 255, 1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:hover .table_unitName {
  cursor: pointer;
}
.p_unitName {
  color: #666;
}
</style>
