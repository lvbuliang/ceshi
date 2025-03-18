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
              <div
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
              </div>
            </el-tooltip>
          </el-col>
        </template>
      </SrView>
    </div>

    <!-- <el-button class="goBackCss" size="small" @click="goBackList">
        返回列表
      </el-button> -->
    <WorkFlow1
      :lookStatus="lookStatus"
      :hideFrom="true"
      ref="work_flow"
      :buttonList="buttonList"
      backName="projectChangeManagement"
    ></WorkFlow1>
  </div>
</template>

<script>
// 基本信息组件
import WorkFlow1 from "../components/workflow.vue";
import srtracetrack from "@/api/executionManagement/strack.js";
import { api_getDetail } from "@/api/projectChangeManagement/index.js";
import store from "@/store";
export default {
  name: "project_initialView",
  components: { WorkFlow1 },
  provide() {
    return {
      baseUrl: "",
      imgBaseUrl: "",
      uploadRequest: "",
      uploadBaseUrl: "",
      srtracetrackRequest: srtracetrack,
    };
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    },
    changeId() {
      return this.$route.query.changeId;
    },
    id() {
      return this.$route.query.id;
    },
  },
  data() {
    return {
      lookStatus: null,
      userInfo: store.getters.userInfo,
      buName: store.getters.userInfo.currentBizunit.buName,
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
            label: "合同名称",
            value: "contractName",
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
            label: "变更发起人",
            value: "tjPerson",
            col: 12,
          },
          {
            type: "value",
            label: "发起时间",
            value: "tjTime",
            col: 12,
          },
        ],
        data: {
          systemName: "", //系统名称
          projectName: "", //项目名称
          projectCode: "", //项目编码
          contactName: "", // 项目负责人,
          programManagerName: "", // 方案经理,
          procurementManagerName: "", // 采购经理
          clientManagerName: "", // 客户经理
          projectId: "",
          projectInitialId: "",
          workflowId: "",
        },
      },
    };
  },
  created() {
    this.getDetailById();
    this.lookStatus = this.$route.query.lookStatus;
  },
  methods: {
    goBackList() {
      // this.$confirm("是否确认该操作", "提示", {
      // iconClass: "el-icon-question", //自定义图标样式
      // confirmButtonText: "确认", //确认按钮文字更换
      // cancelButtonText: "取消", //取消按钮文字更换
      // showClose: true, //是否显示右上角关闭按钮
      // type: "warning", //提示类型  success/info/warning/error
      // })
      //   .then(() => {
      //     //确认操作

      this.$router.push({ path: "/projectChangeManagement" });
      // })
      // .catch(() => {
      //   //取消操作
      // });
    },
    // 根据id获取详情
    getDetailById() {
      let newFlag =
        this.$route.query.status &&
        (this.$route.query.status == "203" ||
          this.$route.query.status == "303" ||
          this.$route.query.status == "2");
      api_getDetail({
        contractId: this.$route.query.contractId,
        changeId: this.changeId == "undefined" ? "" : this.changeId,
        projectId: this.$route.query.id,
        type: this.$route.query.type,
      }).then((res) => {

        if (res.data) {
          //回显数据
          var newObj = {};
          for (var key in res.data) {
            newObj[key] = res.data[key];
          }
          this.basicForm.data = newObj;
        }
      });
    },
    chakan(row) {
      if (this.buName.includes("豫信")) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.$route.query.id,
            processId: this.$route.query.processId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName: "变更",
          },
        });
      }
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
