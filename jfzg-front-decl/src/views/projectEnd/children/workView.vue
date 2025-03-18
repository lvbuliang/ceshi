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

    <!--  -->
    <WorkFlow
      ref="work_flow"
      v-if="buttonList.length"
      :statuss="status"
      :buttonList="buttonList"
      :todoData="todoData"
      :taskId="taskId"
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
import srtracetracks from "@/utils/srtracetrackProEnd.js";
import workflows from "@/utils/workflow";
// import { api_activititodo } from "@/api/index";
import { api_activititodoV2 } from "@/api/index";
import { api_getDetailById } from "@/api/projectLibrary/index";
import { getSeePorManagment } from "@/api/projectManagement/index.js";
import { api_getViewList } from "@/api/projectEnd/index.js";
export default {
  components: {
    TestFormView,
    WorkFlow,
    ProjectBaseMessage,
  },
  computed: {},
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetracks,
      workflowRequest: workflows,
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
          needDeliveryTime: "",
          source: "",
          yearPlanName: "",
          handlapplicationUniteTime: "",
          projectCode: "",
          projectName: "",
          systemName: "",
          contractName: "",
          clientManagerName: "",
          projectId: "",
        },
        enums: {},
      },
      processId: null,
      projeciId: null,
      todoData: null,
      // rowDatas: {},
      status: "",
      projectIntiaonIds: "",
      taskId: "",
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

      // api_activititodo(param).then((res) => {
      api_activititodoV2(param).then((res) => {
        console.log(res, "todores");
        if (res.data[0]) {
          // this.todoData = res.data[0];
          // let assignee = res.data[0]?.assignee;
          // this.buttonList = [res.data[0].curDesc].filter((item) => {
          //   //按钮筛选  以assignee优先roleCode
          //   item.assignee = assignee;
          //   if (assignee == jfid) {
          //     return true;
          //   } else if (roleCode == item.role) {
          //     return true;
          //   }
          // });
          if (res.data.length == 1) {
            this.taskId = res.data[0].taskId;
          } else {
            res.data.map((item) => {
              if (Number(item.assignee) == this.userInfo.jfid) {
                this.taskId = item.taskId;
              }
            });
          }
          console.log(this.taskId, "this.taskId");
          // this.taskname = res.data[0].taskName;
        }
      });
    },
    // 获取项目基本信息
    // init() {
    //   this.getinfo();
    // },
    async getSee() {
      let dataPar = {
        id: this.$route.query.id,
        contractId: this.$route.query.contractId,
      };
      const res = await api_getViewList(dataPar);
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
        this.followforms.data.projectCode = res.data.projectCode
          ? res.data.projectCode
          : "";
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
        this.followforms.data.clientManagerName = res.data.clientManagerName
          ? res.data.clientManagerName
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
        this.status = res.data.status;
        console.log(res.data, "curDesc");
        this.buttonList = res.data.curDesc.btns;
      }
    },
    chakan(row) {
      if (this.buName.includes("豫信")) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.followforms.data.projectId,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName: "终验",
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
    this.getinfo();
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
