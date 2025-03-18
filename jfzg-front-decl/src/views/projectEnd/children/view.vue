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
            <el-col style='display: flex;'>
              <label
                class="label-item ellipsis"
                title="项目名称"
                style="width: 50%"
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
                  @click="chakan(scope)"
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
        </div>
      </div>
    </div>
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
import srtracetracks from "@/utils/srtracetrackProEnd.js";

// import { getSeePorManagment } from "@/api/projectManagement/index.js";
import { api_getViewList } from "@/api/projectEnd/index.js";
export default {
  components: { srStacetrack },
  computed: {},
  data() {
    return {
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
            label: "合同名称:",
            value: "contractName",
            col: 12,
            type: "value",
          },
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
            value: "contactName",
            label: "项目负责人",
            span: 12,
            type: "value",
          },
          {
            value: "programManagerName",
            label: "方案经理",
            span: 12,
            type: "value",
          },
          {
            value: "procurementManagerName",
            label: "采购经理",
            span: 12,
            type: "value",
          },
          {
            value: "clientManagerName",
            label: "客户经理",
            span: 12,
            type: "value",
          },
        ],

        data: {
          yearPlanName: "",
          projectCode: "",
          projectName: "",
          systemName: "",
          contactName: "",
          contractName: "",
          contactId: "",
          programManagerName: "",
          programManagerId: "",
          procurementManagerName: "",
          procurementManagerId: "",
          projectMaturity: "",
          clientManagerName: "",
          projectId:""
        },
        enums: {},
      },
      processId: null,
      projeciId: null,
      todoData: null,
      trackData: [],
      markData: [],
      imgUrl: "",
      srtracetrackRequest: srtracetracks,
    };
  },
  computed: {
    // busiId() {
    //   return this.userInfo.jfid;
    // },
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    id() {
      return this.$route ? this.$route.query.id : "";
    },
    contractId() {
      return this.$route ? this.$route.query.contractId : "";
    },
  },
  methods: {
    getTraceTrack(val) {
      if (!this.busiType || !val) {
        this.trackLoading = false;
      }else {
        this.trackLoading = true;
        this.srtracetrackRequest.getTraceTrackList({ busId: val }, (res) => {
          this.trackData = res.data;
          this.trackLoading = false;
        });
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
        name: "projectEnd",
      });
    },
    async getSee() {
      let dataPar = {
        id: this.id,
        contractId: this.contractId,
      };
      const res = await api_getViewList(dataPar);


      console.log(res.data,'res.data.contractName')
      if (res.msg.code == "0000") {
        this.followforms.data.systemName = res.data.systemName
          ? res.data.systemName
          : "";
        this.followforms.data.contractName = res.data.contractName
          ? res.data.contractName
          : "";
        this.followforms.data.projectName = res.data.projectName
          ? res.data.projectName
          : "";
        this.followforms.data.clientManagerName = res.data.clientManagerName
          ? res.data.clientManagerName
          : "";
        this.followforms.data.projectCode = res.data.projectCode
          ? res.data.projectCode
          : "";
        // if (Number(res.data.source) == 0) {
        //   this.followforms.data.source = "统建类项目";
        // } else {
        //   this.followforms.data.source = "承建类项目";
        // }
        this.followforms.data.contactName = res.data.contactName
          ? res.data.contactName
          : "";
        this.followforms.data.contactId = res.data.contactId
          ? res.data.contactId
          : "";
        this.followforms.data.programManagerName = res.data.programManagerName
          ? res.data.programManagerName
          : "";
        this.followforms.data.programManagerId = res.data.programManagerId
          ? res.data.programManagerId
          : "";
        this.followforms.data.procurementManagerName = res.data
          .procurementManagerName
          ? res.data.procurementManagerName
          : "";
        this.followforms.data.procurementManagerId = res.data
          .procurementManagerId
          ? res.data.procurementManagerId
          : "";
        this.followforms.data.projectMaturity = res.data.projectMaturity
          ? res.data.projectMaturity
          : "";
        this.followforms.data.projectId = res.data.projectId
          ? res.data.projectId
          : "";
        // if (res.data.projectIntiaonId) {
        this.getTraceTrack(this.id);
        // this.getHoverTraceTrack(this.id);
        // }
      }
    },
    chakan(row) {
      console.log(row,'123row')
      if(this.buName.includes('豫信')) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.followforms.data.projectId,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName:"终验"
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
