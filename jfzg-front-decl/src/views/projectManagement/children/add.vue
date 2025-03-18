<template>
  <!--发起立项 -->
  <div class="total-page">
    <!-- 基本信息 srview-->
    <div>
      <div class="text">基本信息</div>
      <div>
        <SrView :formData="followforms.config" :ruleForm="followforms.data" :ref="`form`">
          <template slot="name3" slot-scope="scope">
            <el-col style="display: flex">
              <label class="label-item ellipsis" title="项目名称" style="width: 50%">项目名称
              </label>

              <el-tooltip :content="followforms.data.projectName" placement="top" effect="light">
                <button style="
                    border: none;
                    float: left;
                    background: #fff;
                    margin-left: 10px;
                    line-height: 40px;
                  " @click="chakan(scope.scope)">
                  <div :class="buName.includes('豫信') ? 'table_unitName' : 'p_unitName'
                    ">
                    {{ followforms.data.projectName }}
                  </div>
                </button>
              </el-tooltip>
            </el-col>
          </template>
        </SrView>
      </div>
      <div class="text start">集团初审</div>
      <SrAdd class="sradd" :config="form.config" :enums="form.enums" :form="form.data" :otherConfig="form.otherConfig"
        ref="add1">
      </SrAdd>
    </div>
    <sr-work-flow :hideFrom="true" :clickMethods="clickmethods"
      :buttonList="buttonList" ref="work_flow" backName="projectManagement"></sr-work-flow>
    <!-- 审批留痕 -->
    <srStacetrack ref="track" class="track" :imgUrl="imgUrl" :trackData="trackData" :trackLoading="trackLoading"
      :srTraceActive="srTraceActive" :srTraceArr="srTraceArr"></srStacetrack>
  </div>
</template>

<script>
import {
  saveOrupdate,
  submitUpdate,
  saveUpdate,
} from "@/api/projectManagement/saveProject.js";
import { api_activititodo } from "@/api/index.js";
import store from "@/store";
// 上传工具包
import config from "@/settings.js";
import upload from "@/utils/upload";
import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";
import { getSeePorManagment } from "@/api/projectManagement/index.js";
import srStacetrack from "../components/srStacetrack.vue";
import { setTack } from "../const.js";
import { getJSONStr, setFile } from "@/utils/workflowList.js";
export default {
  name: "projectAdd",
  components: {
    srStacetrack,
  },
  computed: {
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
      srTraceActive: 0,
      srTraceArr: [
        {
          description: "客户经理-发起立项",
          title: "客户经理发起立项提审",
        },
        {
          description: "客户经理-集团审议",
          title: "集团审议通过",
        },
        {
          description: "方案经理-内部立项",
          title: "内部立项通过",
        },
      ],
      trackLoading: true,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows,
      trackData: [],
      userInfo: store.getters.userInfo,
      buName: store.getters.userInfo.currentBizunit.buName,
      validate: false,
      projeciId: null,
      processInstanceId: null,
      clickmethods: { tg: this.tg, btg: this.btg },
      buttonList: [
        {
          role: "",
          isFromWorkBench: false,
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
      ],
      // 基本信息数据
      formInline: {
        systemName: "",
        projectName: "",
        projectCode: "",
        applicationUnit: "",
        yearPlanName: "",
        source: "",
        needDeliveryTime: "",
      },
      // sradd
      form: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "dateSelect",
            timeType: "date",
            name: "初审完成时间",
            placeholder: "请选择时间",
            bind: "approvalTime",
            required: "请选择时间",
            maxLength: 20,
            format: "yyyy-MM-dd",
            col: 12,
          },
          {
            type: "upload",
            name: "项目初审表",
            bind: "approvalList1",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "初审报告",
            bind: "approvalList2",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "OA审批单",
            bind: "approvalList3",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          // 立项附件
          {
            type: "upload",
            name: "其他附件",
            bind: "otherFileOne",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          approvalTime: "",
          // 项目初审表
          approvalList1: [],
          // 初审报告
          approvalList2: [],
          // OA审批单
          approvalList3: [],
          accessoryList: [],
          // // 立项附件
          otherFileOne: [],
        },
        enums: {},
      },
      // 基本信息
      followforms: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "系统名称:",
            value: "systemName",
            span: 12,
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
        },
        enums: {},
      },
      taskId: "", // 任务id
      taskName: "", //任务名称// 点击通过或者不通过的方法
      auditJson: {}, // 编辑json
      currentStatus: null, // 子任务的当前状态
      // rowDatas: {},
    };
  },
  watch: {
    $route: {
      handler(route) {
        const query = route.query;
        if (
          query.activeName == "待办" ||
          query.activeName == "周报填写" ||
          query.activeName == "已办"
        ) {
          this.buttonList[0].isFromWorkBench = true;
        }
      },
      immediate: true
    },
  },
  methods: {
    saveup() {
      let data = {
        auditOa: "",
        auditOaName: "",
        createRole: this.userInfo.jfid,
        createBuid: "",
        // createBuid: this.rowDatas.createBuid ? this.rowDatas.createBuid : "",
        fileContextPeroject: "",
        fileName: "",
        fileReport: "",
        fileReportName: "",
        firstAuditTime: "",
        projectAudit: "",
        projectId: this.projeciId,
        updateTime: "",
        uploadPerson: "",
        systemName: this.followforms.data.systemName,
        projectName: this.followforms.data.projectName,
        projectCode: this.followforms.data.projectCode,
        applicationUnit: this.followforms.data.applicationUnit,
        projectMaturity: "",
        status: "",
      };
      // 获取 processInstanceId
      saveOrupdate(data).then((res) => {
        if (res.msg.code == "0000") {
          this.processInstanceId = res.data;
        }
      });
    },
    // 提交
    saveOpen() {
      let roleCode = this.userInfo.currentRole.roleCode;
      let jfid = this.userInfo.jfid;
      let params = {
        owner: jfid,
        role: roleCode,
        processId: this.processInstanceId,
      };
      api_activititodo(params).then((res) => {
        if (res.msg.code == "0000") {
          let description = JSON.parse(res.data[0].description)[0].btns[0];
          let btns = res.data[0].curDesc.btns[0];
          this.taskId = res.data[0].taskId;
          let accessoryList = [];

          let fileContextPerojectList = getJSONStr(
            this.form.data.approvalList1,
            this.form.config[1].name
          );
          let fileReportList = getJSONStr(
            this.form.data.approvalList2,
            this.form.config[2].name
          );
          let auditOaList = getJSONStr(
            this.form.data.approvalList3,
            this.form.config[3].name
          );
          let otherFileOneList = [];
          if (this.form.data.otherFileOne.length > 0) {
            otherFileOneList = getJSONStr(
              this.form.data.otherFileOne,
              this.form.config[4].name
            );
          } else {
            otherFileOneList = "[]";
          }
          let data = {
            accessory: [],
            accessoryList: accessoryList,
            agencyId: description.agencyId,
            agencyNextrole: btns.agencyNextrole,
            assignee: res.data[0].assignee,
            // OA审批单
            auditOa: auditOaList,
            auditTime: this.getNowTime(),
            auditUserName: this.userInfo.fullname,
            beAssigner: "",
            beAssignerName: "",
            beAssignerRole: "",
            btnName: description.btnName,
            buId: "",
            createRole: this.userInfo.jfid,
            // 项目初审表
            fileContextPeroject: fileContextPerojectList,
            fileName: "",
            // 初审报告
            fileReport: fileReportList,
            firstAuditTime: this.form.data.approvalTime,
            messageId: "",
            nextBuCode: btns.nextBuCode,
            processInstanceId: this.processInstanceId,
            projectId: this.projeciId,
            status: "",
            taskId: this.taskId,
            updateTime: this.getNowTime(),
            uploadPerson: this.userInfo.jfid,
            vars: "",
            jtjcJySize: "",
            // // 立项附件 其他附件
            otherFileOne: otherFileOneList,
          };
          //console.log(data, "data");
          // 提交
          submitUpdate(data).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("提交成功");
              this.$router.push({
                name: "projectManagement",
              });
            }
          });
        }
      });
    },
    // 提交
    tg() {
      let val = this.$refs["add1"].validate();
      if (val) {
        this.$confirm("确认提交集团初审?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.saveOpen();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },


    // 保存
    btg() {
      let val = this.$refs["add1"].validate();
      if (val) {
        let fileContextPerojectList = getJSONStr(
          this.form.data.approvalList1,
          this.form.config[1].name
        );
        let fileReportList = getJSONStr(
          this.form.data.approvalList2,
          this.form.config[2].name
        );
        let auditOaList = getJSONStr(
          this.form.data.approvalList3,
          this.form.config[3].name
        );
        let otherFileOneList = [];
        if (this.form.data.otherFileOne.length > 0) {
          otherFileOneList = getJSONStr(
            this.form.data.otherFileOne,
            this.form.config[4].name
          );
        } else {
          otherFileOneList = "[]";
        }
        let data = {
          // OA审批单
          auditOa: auditOaList,
          createRole: this.userInfo.jfid,
          createBuid: "",
          // createBuid: this.rowDatas.createBuid ? this.rowDatas.createBuid : "",
          // 项目初审表
          fileContextPeroject: fileContextPerojectList,
          fileName: "",
          // 初审报告
          fileReport: fileReportList,
          firstAuditTime: this.form.data.approvalTime,
          jtjcDate: "",
          jtjcJy: "",
          jtjcJyName: "",
          needDeliveryTime: this.followforms.data.needDeliveryTime,
          processId: this.processInstanceId,
          projectFajlJfid: "",
          projectFajlName: "",
          projectId: this.projeciId,
          updateTime: this.getNowTime(),
          uploadPerson: this.userInfo.jfid,
          jtjcJySize: "",
          // // 立项附件 其他附件
          otherFileOne: otherFileOneList,
        };
        this.$confirm("确认保存集团初审?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            ////console.log(data, "保存");
            saveUpdate(data).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("保存成功");
                this.$router.push({
                  name: "projectManagement",
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    onBackClick() {
      this.$router.push({
        name: "projectManagement",
      });
    },
    getNowTime() {
      var date = new Date();
      var seperator1 = "-";

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;

      return currentdate;
    },
    async getSee() {
      let dataPar = {
        processId: this.processInstanceId,
        projectId: this.projeciId,
      };
      const res = await getSeePorManagment(dataPar);
      if (res.msg.code == "0000") {
        ////console.log(res, "查看");
        this.followforms.data.systemName = res.data.systemName
          ? res.data.systemName
          : "";
        this.followforms.data.projectName = res.data.projectName
          ? res.data.projectName
          : "";
        this.followforms.data.projectCode = res.data.projectCode
          ? res.data.projectCode
          : "";
        if (Number(res.data.source) == 0) {
          this.followforms.data.source = "统建类项目";
        } else {
          this.followforms.data.source = "承建类项目";
        }
        this.followforms.data.applicationUnit = res.data.applicationUnit
          ? res.data.applicationUnit
          : "";
        this.followforms.data.yearPlanName = res.data.yearPlanName
          ? res.data.yearPlanName
          : "";
        this.followforms.data.needDeliveryTime = res.data.needDeliveryTime
          ? res.data.needDeliveryTime
          : "";
        this.followforms.data.clientManagerName = res.data.clientManagerName
          ? res.data.clientManagerName
          : "";
        this.form.data.approvalTime = res.data.firstAuditTime
          ? res.data.firstAuditTime
          : "";
        if (res.data.fileContextPeroject) {
          this.form.data.approvalList1 = setFile(res.data.fileContextPeroject);
          this.form.data.approvalList2 = setFile(res.data.fileReport);
          this.form.data.approvalList3 = setFile(res.data.auditOa);
        }
        // 立项附件
        if (res.data.otherFileOne) {
          this.form.data.otherFileOne = setFile(res.data.otherFileOne);
        }
        // 留痕
        if (res.data.projectIntiaonId) {
          this.getTraceTrack(res.data.projectIntiaonId);
        } else {
          this.trackLoading = false;
          this.trackData = [];
        }
      }
    },
    chakan(row) {
      if (this.buName.includes("豫信")) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.$route.query.projectId,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName: "立项",
          },
          // 查看相关逻辑
        });
      }
    },
    getTraceTrack(val) {
      if (!this.busiType || !val) {
        this.trackLoading = false;
      } else {
        this.trackLoading = true;
        this.srtracetrackRequest.getTraceTrackList(
          { busiId: val, busiType: this.busiType },
          (res) => {
            this.trackData = res.data;
            this.trackLoading = false;
            setTack(this.trackData)
          }
        );
      }
    },
  },
  created() {
    let query = this.$route.query;
    // this.rowDatas = JSON.parse(this.$route.query.rowData);
    const { projectId, processId } = query;
    this.projeciId = projectId;
    this.processId = processId;
    this.saveup();
  },
  mounted() {
    this.getSee();
  },
};
</script>
<style lang="scss" scoped>
.sr-view {
  padding: 10px 40px;
}

.text {
  padding: 0 20px;
  padding-top: 20px;
  font-size: 16px;
  font-weight: 700;
}

.start {
  padding-top: 10px;
  padding-left: 40px;
}

::v-deep .el-form {
  padding: 10px 40px;
}

::v-deep .sr-view .el-col-24 .label-item {
  width: 50% !important;
}

::v-deep.el-date-picker__time-header {
  display: none !important;
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

.track {
  padding: 0 48px 45px 48px;
}
</style>
