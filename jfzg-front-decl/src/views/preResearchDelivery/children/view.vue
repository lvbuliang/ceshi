<template>
  <div :class="['InitiateDetail_class', onlyShow ? 'noPadding' : '']">
    <h3 class="InitiateDetail_class_title">基本信息</h3>
    <div class="InitiateDetail_class_sradd">
      <SrView :formData="form.config" :ruleForm="form.data">
        <template slot="name3" slot-scope="scope">
          <el-col style='display: flex;'>
            <label
              class="label-item ellipsis"
              title="项目名称"
              style="width: 50%"
              >项目名称
            </label>

            <el-tooltip
              :content="form.data.projectName"
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
                  {{ form.data.projectName }}
                </div>
              </button>
            </el-tooltip>
          </el-col>
        </template>
      </SrView>
    </div>
    <WorkFlow1
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      ref="work_flow"
      backName="preResearchDelivery"
      :workFlowLoading="workFlowLoading"
    ></WorkFlow1>
  </div>
</template>

<script>
import store from "@/store";
import WorkFlow1 from "../component/workflow.vue";
import { api_getDetail } from "@/api/preResearchDelivery/index.js";
import srtracetrack from "@/utils/srtracetrack";
export default {
  components: {
    WorkFlow1,
  },
  props: {
    onlyShow: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
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
      form: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            value: "systemName",
            label: "系统名称",
            span: 12,
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
          },
          {
            value: "contactName",
            label: "项目负责人",
            span: 12,
          },
          {
            value: "programManagerName",
            label: "方案经理",
            span: 12,
          },
          {
            value: "procurementManagerName",
            label: "采购经理",
            span: 12,
          },
          {
            value: "clientManagerName",
            label: "客户经理",
            span: 12,
          },
        ],

        data: {
          systemName: "",
          projectName: "",
          projectCode: "",
          contactName: "",
          programManagerName: "",
          procurementManagerName: "",
          projectMaturity: "",
          clientManagerName: "",
        },
        enums: {},
      },
      clickmethods: { tg: this.tg, btg: this.btg },
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      api_getDetail({ id: this.$route.query.id }).then((res) => {
        //console.log("详情", res);
        if (res.data) {
          this.form.data = res.data;
        }
      });
    },
    chakan(row) {
      if(this.buName.includes('豫信')) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.$route.query.id,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName:"预研"
          },
          // 查看相关逻辑
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.InitiateDetail_class {
  padding: 20px;
  height: 100%;
  // padding-bottom: 40px;
  .InitiateDetail_class_title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    padding: 10px 0 5px 10px;
  }
  .title_box {
    display: flex;
    align-items: center;
    margin: 24px 0 14px 0;
    justify-content: space-between;
    .title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .btns {
      .el-button {
        width: 118px;
        height: 32px;
        border-radius: 16px;
        padding: 0 !important;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    left: 81px;
    width: 100%;
    height: 63px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    .el-button {
      width: 104px;
      height: 32px;
      padding: 0;
      border-radius: 16px;
    }
  }
}
.reportWriter {
  display: flex;

  ::v-deep .el-input {
    width: 25%;
  }
  .btn {
    margin-left: 5px;
    width: 30px;
    height: 30px;
    opacity: 1;
    color: rgba(66, 130, 255, 1);
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border: 1px dashed rgba(66, 130, 255, 1);
  }
}
.InitiateDetail_class_Application {
  // margin-left: 55px;
}
.noPadding {
  padding-bottom: 0px;
}
.dialog-footer {
  margin-left: 900px;
}
.InitiateDetail_class_sradd {
  // width: 1300px;
  // display: flex;
  // justify-content: flex-start;
}
.select-box {
  ::v-deep .el-select {
    width: 250px;
  }
  ::v-deep .el-input {
    width: 250px;
  }
  > div {
    margin-right: 20px;
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
