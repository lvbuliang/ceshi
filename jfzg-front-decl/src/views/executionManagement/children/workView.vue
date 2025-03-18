<template>
  <div class="work-view total-page">
    <!-- 当前子任务标题 -->
    <h3 class="title">
      {{ taskName }}
    </h3>

    <!-- table表格 -->
    <SrTable
      class="sr-approve-table"
      :data="table.dataList"
      :config="table.config"
      ref="approveTable"
    >
      <div class slot="cellSlot" slot-scope="scope">
        <!-- 子任务进度 -->
        <div v-if="scope.scope.item.prop == 'subTaskProgress'">
          <span>{{ isNull(scope.scope.row.subTaskProgress) }}</span>
        </div>
      </div>
    </SrTable>

    <!-- 工作流 -->
    <WorkFlow1
      v-if="buttonList.length"
      ref="work_flow"
      :taskId="taskId"
      :buttonList="buttonList"
      backName="planProject"
      :auditJson="auditJson"
      :currentStatus="currentStatus"
      :clickMethods="clickmethods"
    ></WorkFlow1>
  </div>
</template>

<script>
import workflow from "@/api/executionManagement/workflow.js";
import WorkFlow1 from "../components/workflow.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import srtracetrack from "@/api/executionManagement/strack.js";

// api
import { api_activititodo } from "@/api/executionManagement/index.js";
export default {
  name: "work-view",
  components: {
    WorkFlow1,
  },
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
  // 在路由离开之前的操作
  beforeRouteLeave(to, form, next) {
    // 重置dom工作流组件对象
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
  computed: {
    templateId() {
      // 模板id
      return this.$route.query.templateId;
    },
    processId() {
      return this.$route.query.processId;
    },
    projectId() {
      return this.$route.query.projectId;
    },
    userInfo() {
      // 用户信息
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  data() {
    return {
      // processId: '', // 流程id
      taskId: "", // 任务id
      taskName: "", //任务名称
      buttonList: [], // 审批按钮组
      clickmethods: { firsttrial: this.firsttrial }, // 点击通过或者不通过的方法
      // 表格
      table: {
        dataList: [], // 表格数据
        config: {
          load: this.updateTableList,
          header: [
            { label: "子任务名称", prop: "subTaskName" },
            { label: "计划开始时间", prop: "planStartTime" },
            { label: "计划结束时间", prop: "planEndTime" },
            { label: "实际开始时间", prop: "actualStartTime" },
            { label: "实际结束时间", prop: "actualEndTime" },
            { label: "子任务进度", prop: "subTaskProgress", cellSlot: true },
            { label: "状态", prop: "status" },
          ],
          indexConfig: {
            // 不显示序号列
            display: false,
          },
          innerBtn: false,
        },
      },
      auditJson: {}, // 编辑json
      currentStatus: null, // 子任务的当前状态
    };
  },
  mounted() {
    console.log("当前子任务详细信息", this.$route.query.rowData);
    this.table.dataList = [];
    this.table.dataList.push(this.$route.query.rowData);
    this.taskName = this.$route.query.rowData.taskName;
    // this.processId = JSON.parse(this.$route.query.rowData).processId
    this.initBtnList(); //初始化审批按钮
  },
  methods: {
    isNull(str) {
      str = [null, undefined, "null", "undefined"].includes(str)
        ? "-"
        : str + "%";
      return str;
    },
    // 审批按钮组初始化
    initBtnList() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;
      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.processId,
      };

      api_activititodo(param).then((res) => {
        console.log("res--------审批按钮组", res, this.userInfo);
        if (res.msg.code == "0000") {
          let assignee = res.data[0]?.assignee; // 5515

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
        }
      });
    },

    // 点击通过 | 不通过 按钮的事件
    firsttrial() {
      // 二次提示
      this.$EventBus.$emit("drawerisshow", true);
    },
  },
};
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>

<style lang="scss" scoped>
.work-view {
  padding: 20px;
}

// 标题
.title {
  padding-bottom: 20px;
  font-size: 22px;
  line-height: 30px;
  color: rgba(78, 89, 105, 1);
  letter-spacing: 0.1em;
}
</style>
