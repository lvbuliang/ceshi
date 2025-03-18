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

    <!-- 初验申请 -->
    <div class="file_list">
      <div class="basic-title">初验申请</div>
      <SrAdd
        class="sradd"
        :config="firstStepForm.config"
        :enums="firstStepForm.enums"
        :form="firstStepForm.data"
        :otherConfig="firstStepForm.otherConfig"
        ref="projectInitialAddRef"
      >
      </SrAdd>
    </div>

    <WorkFlow1
      :hideFrom="true"
      ref="work_flow"
      :buttonList="buttonList"
      backName="projectInitial"
      :clickMethods="clickmethods"
    ></WorkFlow1>

    <!-- <srStacetrack
      :imgUrl="imgUrl"
      :trackLoading="trackLoading"
      :trackData="trackData"
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

import { api_saveOrUpdate, api_getDetail } from "@/api/projectInitial/index.js";
import { getJSONStr, setFile } from "@/utils/workflowList.js";
export default {
  name: "project_initialAdd",
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
      return this.$route ? this.$route.query.projectInitalId : "";
    },
    projectInitalId() {
      return this.$route ? this.$route.query.projectInitalId : "";
    },
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    projectId() {
      return this.$route ? this.$route.query.id : "";
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
      isSection: null,
      // 初验申请
      firstStepForm: {
        otherConfig: {
          labelNum: 200,
        },
        config: [
          {
            type: "upload",
            name: "初验报审表",
            bind: "initialApplicationReportList",
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
            name: "试运行方案",
            bind: "operationSchemeList",
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
            name: "初验工作总结报告",
            bind: "initialSummaryReportList",
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
            name: "软件功能完整性检查报告",
            bind: "initialSoftwareReportList",
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
            name: "业务应用系统部署清单",
            bind: "initialServiceReportList",
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
            name: "共性能力对接验证报告",
            bind: "commonCapabilityReportList",
            // required: "请上传附件",
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
          initialApplicationReportList: [], // 初验报审表
          operationSchemeList: [], // 试运行方案
          initialSummaryReportList: [], // 初验工作总结报告
          initialSoftwareReportList: [], // 软件功能完整性检查报告
          initialServiceReportList: [], // 业务应用系统部署清单
          commonCapabilityReportList: [], // 共性能力对接验证报告
          otherFileList: [], //其他附件
          auditOpinion: "", // 说明
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
          {
            type: "value",
            label: "合同名称",
            value: "contractName",
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
          contractName: "", //合同名称
          contractId: "", //合同id
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
      timer: null,
    };
  },
  mounted() {
    this.getDetailById();
  },
  methods: {
    //留痕轨迹
    getTraceTrack() {
      if (!this.processId) {
        this.trackLoading = false;
      }
      if (!this.busiType || !this.busiId) {
        this.trackLoading = false;
      } else {
        this.trackLoading = true;
        this.srtracetrackRequest.getTraceTrackList(
          { busiId: this.busiId, busiType: this.busiType },
          (res) => {
            this.trackData = res.data;
            this.trackLoading = false;
          }
        );
      }
    },
    // 根据id获取详情
    getDetailById() {
      let newFlag = [203, 303, 306, 410].includes(this.$route.query.status);
      api_getDetail({
        id: this.$route.query.id,
        contractId:
          this.$route.query.contractId == "null" ||
          !this.$route.query.contractId
            ? null
            : Number(this.$route.query.contractId),
        newFlag,
      }).then((res) => {
        if (res.data) {
          //回显数据
          if (
            res.data.initialSpectFilesEntityList !== null &&
            res.data.initialSpectFilesEntityList[0]
          ) {
            const {
              plaf,
              trialOperationPlan,
              plafReport,
              sficr,
              basdc,
              ccivr,
              otherFileFirst,
            } = res.data.initialSpectFilesEntityList[0];

            // 初验报审表
            if (plaf == null || plaf == "") {
              this.firstStepForm.data.initialApplicationReportList = [];
            } else {
              this.firstStepForm.data.initialApplicationReportList =
                setFile(plaf);
            }
            // 试运行方案
            if (trialOperationPlan == null || trialOperationPlan == "") {
              this.firstStepForm.data.operationSchemeList = [];
            } else {
              this.firstStepForm.data.operationSchemeList =
                setFile(trialOperationPlan);
            }
            // 初验工作总结报告
            if (plafReport == null || plafReport == "") {
              this.firstStepForm.data.initialSummaryReportList = [];
            } else {
              this.firstStepForm.data.initialSummaryReportList =
                setFile(plafReport);
            }
            // 软件功能完整性检查报告 initialSoftwareReportList
            if (sficr == null || sficr == "") {
              this.firstStepForm.data.initialSoftwareReportList = [];
            } else {
              this.firstStepForm.data.initialSoftwareReportList =
                setFile(sficr);
            }
            // 业务应用系统部署清单 initialServiceReportList
            if (basdc == null || basdc == "") {
              this.firstStepForm.data.initialServiceReportList = [];
            } else {
              this.firstStepForm.data.initialServiceReportList = setFile(basdc);
            }
            // 共性能力对接验证报告 commonCapabilityReportList
            if (ccivr == null || ccivr == "") {
              this.firstStepForm.data.commonCapabilityReportList = [];
            } else {
              this.firstStepForm.data.commonCapabilityReportList =
                setFile(ccivr);
            }

            //其他交付物(附件) otherFileFirst
            if (otherFileFirst == null || otherFileFirst == "") {
              this.firstStepForm.data.otherFileList = [];
            } else {
              this.firstStepForm.data.otherFileList = setFile(otherFileFirst);
            }
          }

          var newObj = {};
          for (var key in res.data) {
            newObj[key] = res.data[key];
          }

          this.isSection = res.data.isSection;
          console.log(res.data.isSection,'res.data.isSection')
          this.basicForm.data = newObj;
          this.projectInitalId = res.data.projectInitalId;

          this.firstStepForm.data.auditOpinion =
            res.data.opinionEntityList[0].opinionInfo;
        }
      });
    },
    getSize(size) {
      if (typeof size == "string") return size;
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },
    // 提交
    tg() {
      let data = this.$refs.projectInitialAddRef.validate();
      if (data) {
        let plaf = getJSONStr(
          this.firstStepForm.data.initialApplicationReportList,
          "初验报审表"
        );
        let trialOperationPlan = getJSONStr(
          this.firstStepForm.data.operationSchemeList,
          "试运行方案"
        );
        let plafReport = getJSONStr(
          this.firstStepForm.data.initialSummaryReportList,
          "项目初验工作总结报告"
        );
        let sficr = getJSONStr(
          this.firstStepForm.data.initialSoftwareReportList,
          "软件功能完整性检查报告"
        );
        let basdc = getJSONStr(
          this.firstStepForm.data.initialServiceReportList,
          "业务应用系统部署清单"
        );
        let ccivr = getJSONStr(
          this.firstStepForm.data.commonCapabilityReportList,
          "共性能力对接对接验证报告"
        );
        let otherFileFirst = getJSONStr(
          this.firstStepForm.data.otherFileList,
          "其他附件"
        );
        api_saveOrUpdate({
          plaf, // 初验报审表
          trialOperationPlan, // 试运行方案
          plafReport, // 项目初验工作总结
          sficr, // 软件功能完整性检查报告地址
          basdc, // 业务应用系统部署清单
          ccivr, // 共性能力对接对接验证报告
          otherFileFirst,
          projectId: this.basicForm.data.projectId || "",
          // projectInitialId: this.basicForm.data.projectInitialId || "",
          workflowId: this.basicForm.data.workflowId || "",
          projectInitalId: this.projectInitalId,
          contractId: this.basicForm.data.contractId,
          isSection: this.isSection,
          status: 2,
          auditOpinion: this.firstStepForm.data.auditOpinion,
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("操作成功");
            this.$router.push({ name: "projectInitial" });
          }
        });
      }
    },
    // 保存
    btg() {
      if (this.$refs.projectInitialAddRef.validate() == null) return;
      let plaf = getJSONStr(
        this.firstStepForm.data.initialApplicationReportList,
        "初验报审表"
      );
      let trialOperationPlan = getJSONStr(
        this.firstStepForm.data.operationSchemeList,
        "试运行方案"
      );
      let plafReport = getJSONStr(
        this.firstStepForm.data.initialSummaryReportList,
        "项目初验工作总结报告"
      );
      let sficr = getJSONStr(
        this.firstStepForm.data.initialSoftwareReportList,
        "软件功能完整性检查报告"
      );
      let basdc = getJSONStr(
        this.firstStepForm.data.initialServiceReportList,
        "业务应用系统部署清单"
      );
      let ccivr = getJSONStr(
        this.firstStepForm.data.commonCapabilityReportList,
        "共性能力对接对接验证报告"
      );
      let otherFileFirst = getJSONStr(
        this.firstStepForm.data.otherFileList,
        "其他附件"
      );
      api_saveOrUpdate({
        plaf, // 初验报审表
        trialOperationPlan, // 试运行方案
        plafReport, // 项目初验工作总结
        sficr, // 软件功能完整性检查报告地址
        basdc, // 业务应用系统部署清单
        ccivr, // 共性能力对接对接验证报告
        otherFileFirst,
        projectId: this.basicForm.data.projectId || "",
        // projectInitialId: this.basicForm.data.projectInitialId || "",
        workflowId: this.basicForm.data.workflowId || "",
        projectInitalId: this.projectInitalId,
        contractId: this.basicForm.data.contractId,
        isSection: this.isSection,
        status: 1,
        auditOpinion: this.firstStepForm.data.auditOpinion,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("操作成功");
          this.$router.push({ name: "projectInitial" });
        }
      });
    },
    // 查看相关逻辑
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
            lookName: "初验",
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
  // background-image: url('../components/finger.gif');
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
