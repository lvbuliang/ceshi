<template>
  <div class="basic-container">
    <div class="basic-info">
      <div class="basic-title">基本信息</div>
      <SrView
        :formData="basicForm.config"
        :ruleForm="basicForm.data"
        :ref="`form`"
      >
        <template slot="name3" slot-scope="scope">
          <el-col style="display: flex">
            <label
              class="label-item ellipsis"
              title="项目名称"
              style="width: 50%"
              >项目名称
            </label>

            <el-tooltip
              :content="basicForm.data.projectName"
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
                  {{ basicForm.data.projectName }}
                </div>
              </button>
            </el-tooltip>
          </el-col>
        </template>
      </SrView>
    </div>

    <WorkFlow1
      :hideFrom="true"
      ref="work_flow"
      :buttonList="buttonList"
      backName="projectStart"
    ></WorkFlow1>

    <srStacetrack
      :imgUrl="imgUrl"
      :trackData="trackData"
      ref="track"
      v-if="trackData"
    >
    </srStacetrack>
  </div>
</template>

<script>
// 基本信息组件
import WorkFlow1 from "../components/workflow2.vue";
import srtracetrack from "@/api/executionManagement/strack.js";
import srStacetrack from "../components/srStacetrack.vue";

import { executionManagementDetail } from "@/api/executionManagement/index.js";

import store from "@/store";
export default {
  name: "project_preview",
  components: { WorkFlow1, srStacetrack },
  provide() {
    return {
      baseUrl: "",
      imgBaseUrl: "",
      uploadRequest: "",
      uploadBaseUrl: "",
      srtracetrackRequest: srtracetrack,
    };
  },
  data() {
    return {
      buName: store.getters.userInfo.currentBizunit.buName,
      userInfo: store.getters.userInfo,
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
      basicForm: {
        otherConfig: {
          labelNum: 160,
        },
        config: [
          {
            type: "value",
            label: "系统名称",
            value: "systemName",
            col: 12,
          },
          {
            type: "slot",
            slotName: "name3",
            span: 12,
          },
          {
            type: "value",
            label: "项目编码",
            value: "projectCode",
            col: 12,
          },
          {
            type: "value",
            label: "承建单位项目经理",
            value: "contractorName",
            col: 12,
          },
          {
            type: "value",
            label: "监理工程师",
            value: "controlName",
            col: 12,
          },
          {
            type: "value",
            label: "项目负责人",
            value: "contactName",
            col: 12,
          },
          {
            type: "value",
            label: "所属阶段",
            value: "statusName",
            col: 12,
          },
        ],
        data: {
          systemName: "", //系统名称
          projectName: "", //项目名称
          projectCode: "", //项目编码
          contactName: "", // 项目负责人,
          programManagerName: "", // 方案经理,
          contractorName: "", // 采购经理
          projectMaturity: "", // 所属阶段
          projectId: "",
        },
      },
    };
  },
  created() {
    this.getDetailById();
  },
  methods: {
    chakan(row) {
      this.$router.push({
        name: "planProjectView",
        query: {
          id: this.$route.query.id,
          processId: this.$route.query.processId,
          // templateId: row.templateId,
          spanaActive: this.spanaActive,
          testId2: 1,
          lookName: "终验",
        },
        // 查看相关逻辑
      });
    },
    // 根据id获取详情
    // 根据id获取详情
    getDetailById() {
      let newFlag =
        this.$route.query.statusFlag &&
        (this.$route.query.statusFlag == "203" ||
          this.$route.query.statusFlag == "303");

      executionManagementDetail({
        projectId: this.$route.query.projectId,
        contractId: this.$route.query.contractId,
        sectionCount:this.$route.query.sectionCount,
      }).then((res) => {
        if (res.data) {
          //回显数据
          // const { applyZzfa, applyZzfaName, workApply, workApplyName, workApplySize, applyZzfaSize } = res.data
          var newObj = {};
          for (var key in res.data) {
            newObj[key] = res.data[key];
          }
          this.basicForm.data = newObj;

          // if (workApply == null) {
          //     this.firstStepForm.data.workApplyList = []
          // } else {
          //     this.firstStepForm.data.workApplyList.push({
          //         id: workApply, name: workApplyName, size: workApplySize
          //     })
          // }

          // if (applyZzfa == null) {
          //     this.firstStepForm.data.applyZzfaList = []
          // } else {
          //     this.firstStepForm.data.applyZzfaList.push({
          //         id: applyZzfa, name: applyZzfaName, size:applyZzfaSize
          //     })
          // }
        }
      });
    },
    getTraceTrack(val) {
      if (!this.busiType || !val) return;
      this.srtracetrackRequest.getTraceTrackList(
        { busiId: val, busiType: this.busiType },
        (res) => {
          this.trackData = res.data;
        }
      );
    },
    //留痕轨迹图片
    // getTraceTrackImage() {
    //   if (!this.processId) return;
    //   this.srtracetrackRequest.getTraceTrackImage(
    //     { processId: this.processId },
    //     (res) => {
    //       this.imgUrl = res.data;
    //     }
    //   );
    // },
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
  },
};
</script>

<style lang="scss" scoped>
.basic-container {
  padding: 20px;
  height: 100%;
}

.basic-info {
  padding: 20px 40px 14px 40px;

  .basic-title {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .label-item {
    border-left: none !important;
    border-right: none !important;
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
