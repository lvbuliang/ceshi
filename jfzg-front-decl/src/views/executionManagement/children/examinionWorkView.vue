<template>
  <div class="basic-container">
    <div class="basic-info">
      <div v-if="userInfo.currentRole.roleCode == 'JLGCS'">
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
    </div>
    <div class="file_list">
      <div class="basic-title">
        {{
          this.userInfo.currentRole.roleCode == "JLGCS"
            ? "监理工程师审核"
            : "项目负责人审核"
        }}
      </div>
    </div>
    <WorkFlow1
      :hideFrom="true"
      :buttonList="buttonList"
      :taskId="taskId"
      ref="work_flow"
      backName="executionManagement"
      :status="status"
      :currentStatus="currentStatus"
    >
    </WorkFlow1>
  </div>
</template>

<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
import workflow from "@/utils/workflow";
import WorkFlow1 from "../components/workflow1.vue";
import srtracetrack from "@/utils/srtracetrack";
import store from "@/store";
import { executionManagementDetail } from "@/api/executionManagement";

export default {
  components: {
    WorkFlow1,
  },
  name: "project_workView",
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflow,
    };
  },
  data() {
    return {
      buName: store.getters.userInfo.currentBizunit.buName,
      userInfo: store.getters.userInfo,
      taskId: "",
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
          // {
          //   type: "value",
          //   label: "项目名称",
          //   value: "projectName",
          //   col: 12,
          // },
          {
            type: "slot",
            slotName: "name3",
            span: 12,
          },
          {
            type: "value",
            label: "项目编号",
            value: "projectCode",
            col: 12,
          },
          {
            type: "value",
            label: "需求部门",
            value: "applicationUnit",
            col: 12,
          },
          {
            type: "value",
            label: "所属年度计划",
            value: "yearPlanName",
            col: 12,
          },
          {
            type: "value",
            label: "项目类型",
            value: "source",
            col: 12,
          },
          {
            type: "value",
            label: "需交付使用时间",
            value: "needDeliveryTime",
            col: 12,
          },
        ],
        data: {
          systemName: "", //系统名称
          projectName: "", //项目名称
          projectCode: "", //项目编码
          applicationUnit: "", //需求部门
          yearPlanName: "", // 年度计划名称
          source: "", // 项目类别
          needDeliveryTime: "",
          contactName: "", // 项目负责人,
          programManagerName: "", // 方案经理,
          procurementManagerName: "", // 采购经理
          projectMaturity: "", // 所属阶段
          projectId: "",
          id: "",
          workflowId: "",
        },
      },
      // 绑定事件
      clickmethods: { tg: this.tg, btg: this.btg },
      buttonList: [
        {
          role: "",
          btns: [
            // {
            //   btnName: "提交",
            //   btnValue: "tg00",
            //   btnType: "primary",
            //   btnEventType: "tg",
            // },
            // {
            //   btnValue: "btg",
            //   btnName: "保存",
            //   btnType: "primary",
            //   btnEventType: "btg",
            // },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
          showForm: true,
        },
      ],
      currentStatus: null, //当前状态
      status: null,
    };
  },
  created() {
    this.init();
    if (this.$route.query.status) {
      this.status = this.$route.query.status;
    }
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

    // 根据id获取数据详情
    init() {
      let params = {
        projectId: this.$route.query.projectId,
        contractId: this.$route.query.contractId,
        sectionCount: this.$route.query.sectionCount,
      };

      executionManagementDetail(params).then((res) => {
        if (res.msg.code == "0000") {
          this.buttonList = JSON.parse(res.data.description);
          //回显数据
          var newObj = {};
          for (var key in res.data) {
            newObj[key] = res.data[key];
          }
          this.basicForm.data = newObj;
          this.currentStatus = res.data.status;
          if (this.basicForm.data.source === 0) {
            this.basicForm.data.source = "统建类项目";
          } else if (this.basicForm.data.source === 1) {
            this.basicForm.data.source = "实施管理";
          } else if (this.basicForm.data.source === 2) {
            this.basicForm.data.source = "项目备案";
          } else if (this.basicForm.data.source === 3) {
            this.basicForm.data.source = "计划项目";
          } else if (this.basicForm.data.source === 4) {
            this.basicForm.data.source = "政府投资类项目";
          }
        }
      });
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

.file_list {
  margin-bottom: 40px;

  .basic-title {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
    padding-left: 40px;
    padding-top: 20px;
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
