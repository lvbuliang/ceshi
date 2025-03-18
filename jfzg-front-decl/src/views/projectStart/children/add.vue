<template>
  <div class="basic-container">
    <div class="basic-info">
      <div class="basic-title">基本信息</div>
      <SrView :formData="basicForm.config" :ruleForm="basicForm.data">
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

    <!-- 开工申请 -->
    <div class="file_list">
      <div class="basic-title">开工申请</div>
      <SrAdd
        class="sradd"
        :config="firstStepForm.config"
        :enums="firstStepForm.enums"
        :form="firstStepForm.data"
        :otherConfig="firstStepForm.otherConfig"
        ref="projectStartAddRef"
      >
      </SrAdd>
    </div>

    <WorkFlow1
      :hideFrom="true"
      ref="work_flow"
      :buttonList="buttonList"
      backName="projectStart"
      :clickMethods="clickmethods"
    ></WorkFlow1>

    <!-- <srStacetrack
      :imgUrl="imgUrl"
      :trackData="trackData"
      :trackLoading="trackLoading"
      ref="track"
    >
    </srStacetrack> -->
  </div>
</template>

<script>
// 基本信息组件
import srStacetrack from "../components/srStacetrack.vue";
import workflow from "@/api/executionManagement/workflow.js";
import WorkFlow1 from "../components/workflow.vue";
import srtracetrack from "@/api/executionManagement/strack.js";
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";

import {
  api_saveOrUpdate,
  api_getDetail,
  api_queryOpinion,
} from "@/api/projectStart/index.js";
import { getJSONStr, setFile } from "@/utils/workflowList.js";
export default {
  name: "project_startAdd",
  components: { WorkFlow1, srStacetrack },
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
    busiId() {
      return this.$route ? this.$route.query.projectStartId : null;
    },
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    projectId() {
      return this.$route ? this.$route.query.projectId : "";
    },
    processId() {
      return this.$route ? this.$route.query.processId : "";
    },
  },
  data() {
    return {
      trackLoading: true,
      trackData: [],
      markData: [],
      imgUrl: "",
      buName: store.getters.userInfo.currentBizunit.buName,
      // 开工申请
      firstStepForm: {
        otherConfig: {
          labelNum: 160,
        },
        config: [
          {
            type: "upload",
            name: "开工申请",
            bind: "workApplyList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "实施组织方案",
            bind: "applyZzfaList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "其他附件",
            bind: "otherFileList",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "textarea",
            name: "说明",
            placeholder: "请输入申请说明",
            bind: "auditOpinion",
            append: true,
            maxlength: 2000,
            col: 24,
            className: "appointStyle customClass2",
          },
        ],
        data: {
          workApplyList: [], // 开工申请
          applyZzfaList: [], // 实施组织方案
          otherFileList: [], // 其他附件
          auditOpinion: "", // 备注
        },
        enums: {},
      },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
            {
              btnValue: "btg",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "btg",
            },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ], // 审批按钮组
      clickmethods: { tg: this.tg, btg: this.btg },
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
          //   value: "projectName",
          //   label: "项目名称",
          //   span: 12,
          // },
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
            label: "项目编码",
            value: "projectCode",
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
            label: "方案经理",
            value: "programManagerName",
            col: 12,
          },
          {
            type: "value",
            label: "采购经理",
            value: "procurementManagerName",
            col: 12,
          },
          {
            type: "value",
            label: "客户经理",
            value: "clientManagerName",
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
          projectStartId: "",
          workflowId: "",
          isSection: "",
        },
      },
      timer: null,
    };
  },
  mounted() {
    this.getDetailById();
    this.getAuditOpinion();
    if (!this.$route.query.projectStartId) {
    }
  },
  methods: {
    // 根据id获取详情
    getDetailById() {
      let newFlag = false;
      if (
        this.$route.query.statusFlag &&
        (this.$route.query.statusFlag == "203" ||
          this.$route.query.statusFlag == "303")
      ) {
        newFlag = true;
      } else {
        newFlag = false;
      }
      let start_contractId = sessionStorage.getItem("start_contractId");
      console.log(start_contractId, "start_contractId");
      api_getDetail({
        id: this.$route.query.id,
        newFlag,
        contractId:
          this.$route.query.contractId == "null" ||
          !this.$route.query.contractId
            ? null
            : Number(this.$route.query.contractId),
      }).then((res) => {
        if (res.data) {
          //回显数据
          const { applyZzfa, workApply, otherFileOne } = res.data;
          var newObj = {};
          for (var key in res.data) {
            newObj[key] = res.data[key];
          }
          this.basicForm.data = newObj;

          if (workApply == null) {
            this.firstStepForm.data.workApplyList = [];
          } else {
            this.firstStepForm.data.workApplyList = setFile(res.data.workApply);
          }

          if (applyZzfa == null) {
            this.firstStepForm.data.applyZzfaList = [];
          } else {
            this.firstStepForm.data.applyZzfaList = setFile(res.data.applyZzfa);
          }
          if (otherFileOne == null) {
            this.firstStepForm.data.otherFileList = [];
          } else {
            this.firstStepForm.data.otherFileList = setFile(
              res.data.otherFileOne
            );
          }
        }
      });
    },
    getSize(size) {
      if (typeof size == "string") return size;
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },
    // 获取审核保存意见
    getAuditOpinion() {
      let params = {
        projectStartId: this.busiId == undefined ? "" : this.busiId,
      };
      api_queryOpinion(params).then((res) => {
        if (res.data) {
          this.firstStepForm.data.auditOpinion = res.data.opinionInfo;
        }
      });
    },
    // 提交
    tg() {
      let data = this.$refs.projectStartAddRef.validate();
      console.log(this.basicForm.data.isSection);
      console.log(this.basicForm.data.contractId);

      let applyZzfa = getJSONStr(
        this.firstStepForm.data.applyZzfaList,
        "实施组织方案"
      );
      let workApply = getJSONStr(
        this.firstStepForm.data.workApplyList,
        "开工申请"
      );
      let otherFileOne = getJSONStr(
        this.firstStepForm.data.otherFileList,
        "其他附件"
      );
      console.log("xxxxxx", applyZzfa, workApply, otherFileOne);
      if (data) {
        api_saveOrUpdate({
          applyZzfa: applyZzfa, //data.applyZzfaList[0].id
          // applyZzfaName: data.applyZzfaList[0].name,
          // applyZzfaSize: this.getSize(data.applyZzfaList[0].size),
          workApply: workApply, // data.workApplyList[0].id,
          // workApplyName: data.workApplyList[0].name,
          // workApplySize: this.getSize(data.workApplyList[0].size),
          otherFileOne: otherFileOne,
          // otherFile: data.otherFileList[0] ? data.otherFileList[0].id : "",
          // otherFileName: data.otherFileList[0] ? data.otherFileList[0].name : "",
          // otherFileSize: data.otherFileList[0] ? this.getSize(data.otherFileList[0].size) : "",
          projectId: this.basicForm.data.projectId || "",
          projectStartId: this.basicForm.data.projectStartId || "",
          workflowId: this.basicForm.data.workflowId || "",
          status: 2,
          isSection: this.basicForm.data.isSection,
          contractId: this.basicForm.data.contractId,
          auditOpinion: this.firstStepForm.data.auditOpinion,
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("操作成功");
            this.$router.push({ name: "projectStart" });
          }
        });
      }
    },
    // 保存
    btg() {
      if (this.$refs.projectStartAddRef.validate() == null) return;
      // let data = this.firstStepForm.data;
      let applyZzfa = getJSONStr(
        this.firstStepForm.data.applyZzfaList,
        "实施组织方案"
      );
      let workApply = getJSONStr(
        this.firstStepForm.data.workApplyList,
        "开工申请"
      );
      let otherFileOne = getJSONStr(
        this.firstStepForm.data.otherFileList,
        "其他附件"
      );
      console.log("xxxxxx", applyZzfa, workApply, otherFileOne);

      api_saveOrUpdate({
        applyZzfa: applyZzfa, //data.applyZzfaList[0].id
        // applyZzfaName: data.applyZzfaList[0].name,
        // applyZzfaSize: this.getSize(data.applyZzfaList[0].size),
        workApply: workApply, // data.workApplyList[0].id,
        // workApplyName: data.workApplyList[0].name,
        // workApplySize: this.getSize(data.workApplyList[0].size),
        otherFileOne: otherFileOne,
        // otherFile: data.otherFileList[0] ? data.otherFileList[0].id : "",
        // otherFileName: data.otherFileList[0] ? data.otherFileList[0].name : "",
        // otherFileSize: data.otherFileList[0] ? this.getSize(data.otherFileList[0].size) : "",
        projectId: this.basicForm.data.projectId || "",
        projectStartId: this.basicForm.data.projectStartId || "",
        workflowId: this.basicForm.data.workflowId || "",
        status: 1,
        isSection: this.basicForm.data.isSection,
        contractId: this.basicForm.data.contractId,
        auditOpinion: this.firstStepForm.data.auditOpinion,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("操作成功");
          this.$router.push({ name: "projectStart" });
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
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName: "启动",
          },
          // 查看相关逻辑
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

.file_list {
  margin-bottom: 40px;

  .basic-title {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
    padding-left: 40px;
  }
}

.finger-tip {
  background-image: url("../components/finger.gif");
  background-repeat: no-repeat;
  background-size: contain;
  background-color: transparent;
  width: 140px;
  height: 140px;
  position: fixed;
  bottom: 140px;
  left: 46%;
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
  width: 90px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:hover .table_unitName {
  cursor: pointer;
}
.p_unitName {
  color: #666;
  width: 90px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .customClass .el-input__inner {
  width: 80% !important;
}
::v-deep .customClass2 .sr-textarea {
  width: 80% !important;
  .el-textarea {
    width: 100%  !important;
  }
  .el-textarea__inner {
    min-height: 80px !important;
    max-height: 100px;
    width: 100% !important;
  }
}
</style>
