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
                @click="chakan(scope.scope)"
              >
                <div :class="buName.includes('豫信') ? 'table_unitName' : 'p_unitName'">
                  {{ followforms.data.projectName }}
                </div>
              </button>
            </el-tooltip>
          </el-col>
        </template>

    </SrView>
    </div>

    <WorkFlow
      v-if="buttonList.length"
      ref="work_flow"
      :taskId="taskId"
      :buttonList="buttonList"
      :todoData="todoData"
      :processId="processId"
      :projeciId="projeciId"
      :needDeliveryTime="followforms"
      :taskNames="taskname"
      :viewForm="viewForms"
    ></WorkFlow>
  </div>
</template>

<script>
import ProjectBaseMessage from "@/components/projectBaseMessage";
import TestFormView from "../../../components/srFormView.vue";
import WorkFlow from "../components/workflow";
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";
import { api_activititodo } from "@/api/index";
import { api_getDetailById } from "@/api/projectLibrary/index";
import { getSeePorManagment } from "@/api/projectManagement/index.js";
export default {
  components: {
    TestFormView,
    WorkFlow,
    ProjectBaseMessage,
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows,
      // rowDatas: this.rowDatas,
    };
  },
  data() {
    return {
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
          }
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
          projectProcurementName: "",
          applicationUnit: "",
        },
        enums: {},
      },
      processId: null,
      projeciId: null,
      todoData: null,
      // rowDatas: {},
      taskname: "",
      viewForms: {},
      projectIntiaonIds: "",
    };
  },

  methods: {
    getinfo() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;

      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.processId,
      };

      api_activititodo(param).then((res) => {
        if (res.data[0]) {
          this.todoData = res.data[0];
          let assignee = res.data[0]?.assignee;
          this.buttonList = [res.data[0].curDesc].filter((item) => {
            //按钮筛选  以assignee优先roleCode
            item.assignee = assignee;
            if (assignee == jfid) {
              return true;
            } else if (roleCode == item.role) {
              return true;
            }
          });

          this.taskId = res.data[0].taskId;

          this.taskname = res.data[0].taskName;
        }
      });
    },
    // 获取项目基本信息
    init() {
      this.getinfo();
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
        this.viewForms = res.data;
      }
    },
    chakan(row) {
      if(this.buName.includes('豫信')) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.$route.query.projectId,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName:"立项"
          },
          // 查看相关逻辑
        });
      }
    },
  },
  created() {
    let query = this.$route.query;
    // this.rowDatas = JSON.parse(this.$route.query.rowData);
    const { projectId, processId } = query;
    this.projeciId = projectId;
    this.processId = processId;
  },
  mounted() {
    this.init();
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
.text {
  padding: 0 20px;
  padding-top: 20px;
  font-size: 16px;
  font-weight: 700;
}
.start {
  padding-top: 10px;
}
.sr-view {
  padding: 10px 40px;
}
::v-deep .sr-view .el-col-24 .label-item {
  width: 50% !important;
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
