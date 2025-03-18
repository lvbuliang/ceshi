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

    <WorkFlow
      v-if="buttonList.length"
      ref="work_flow"
      :statuss="statuss"
      :buttonList="buttonList"
      :processId="processId"
      :projeciId="projeciId"
      :todoData="todoData"
      :taskId="taskId"
      :taskName="taskName"
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
import { api_projectCloseView } from "@/api/projectClose/index.js";
export default {
  components: {
    TestFormView,
    WorkFlow,
    ProjectBaseMessage,
  },
  computed: {
    id() {
      return this.$route ? this.$route.query.id : "";
    },
    statuss() {
      return this.$route ? this.$route.query.status : "";
    },
    processId() {
      return this.$route ? this.$route.query.processId : "";
    },
    projectCloseId() {
      return this.$route ? this.$route.query.projectCloseId : "";
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
            value: "projectMaturity",
            label: "所属阶段",
            span: 12,
            type: "value",
          },
          // {
          //   value: "clientManagerName",
          //   label: "客户经理",
          //   span: 12,
          //   type: "value",
          // },
        ],

        data: {
          yearPlanName: "",
          handlapplicationUniteTime: "",
          projectCode: "",
          projectName: "",
          systemName: "",
          clientManagerName: "",
          projectMaturity: "",
        },
        enums: {},
      },
      processId: null,
      projeciId: null,
      todoData: null,
      // rowDatas: {},
      viewForms: {},
      projectIntiaonIds: "",
      todoData: null,
      taskId: "",
      taskName: "",
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
          let assignee = res.data[0].assignee;
          this.taskId = res.data[0].taskId;
          this.taskName = res.data[0].taskName;
          this.buttonList = [res.data[0].curDesc].filter((item) => {
            //按钮筛选  以assignee优先roleCode
            item.assignee = assignee;
            if (assignee == jfid) {
              return true;
            } else if (roleCode == item.role) {
              return true;
            }
          });
        }
      });
    },
    // 获取项目基本信息
    init() {
      this.getinfo();
    },
    async getSee() {
      let dataPar = {
        id: this.id,
        newFlag: false,
      };
      const res = await api_projectCloseView(dataPar);
      if (res.msg.code == "0000") {
        Object.keys(res.data).forEach((item) => {
          if (res.data[item]) {
            this.followforms.data[item] = res.data[item];
          }
        });
      }
    },
    chakan(row) {
      if (this.buName.includes("豫信")) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.$route.query.id,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName: "结项",
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
