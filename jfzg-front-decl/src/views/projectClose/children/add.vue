<template>
  <!--发起 -->
  <div class="total-page">
    <!-- 基本信息 srview-->
    <div>
      <div class="text">基本1信息</div>
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
      <div class="text start">结项申请</div>
      <SrAdd class="sradd" :config="form.config" :enums="form.enums" :form="form.data" :otherConfig="form.otherConfig"
        ref="add1">
        <div slot="group" class="group">
          <el-tag v-for="(item, index) in form.data.reviewList" :key="index">{{
            item.fullName
          }}</el-tag>
        </div>
      </SrAdd>
    </div>
    <sr-work-flow :hideFrom="true" :clickMethods="clickmethods" :buttonList="buttonList" ref="work_flow"
      backName="projectClose"></sr-work-flow>

    <!-- 审批留痕 -->
    <srStacetrack ref="track" class="track" :imgUrl="imgUrl" :trackData="trackData" :trackLoading="trackLoading">
    </srStacetrack>
  </div>
</template>

<script>
import srStacetrack from "../components/srStacetrack";
import store from "@/store";
// 上传工具包
import config from "@/settings.js";
import upload from "@/utils/upload";
import {
  api_projectCloseView,
  api_projectCloseSave,
} from "@/api/projectClose/index.js";
import {
  api_getFixedGroupMembers,
  getAddedGroupMembers,
} from "@/api/preResearchDelivery/index.js";
import { getJSONStr, setFile } from "@/utils/workflowList.js"
import srtracetrack from "@/utils/srtracetrack";
export default {
  name: "projectAdd",
  components: { srStacetrack },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      srtracetrackRequest: srtracetrack,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },

  data() {
    return {
      imgUrl: "",

      trackData: [],
      markData: [],
      trackLoading: true,
      userInfo: store.getters.userInfo,
      buName: store.getters.userInfo.currentBizunit.buName,

      validate: false,
      projeciId: null,
      // processInstanceId: null,
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
        yearPlanName: "",
      },
      // sradd
      form: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "upload",
            name: "结项申请",
            bind: "approvalList1",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 0,
            // limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "总结报告",
            bind: "approvalList2",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 0,
            // limit: 999,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "其他附件",
            bind: "otherFile",
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
            type: "slot",
            slotName: "group",
            name: "评审小组",
            placeholder: "请选择评审小组",
            bind: "reviewList",
            maxLength: 16,
            class: "gg",
            col: 16,
            // required: "评审小组必填",
          },
          {
            type: "select",
            name: "添加评审人员",
            placeholder: "请选择评审人员",
            bind: "reviewPerson",
            dataList: "reviewPersonList",
            maxLength: 20,
            class: "forminter",
            // required: "请选择评审人员",
            col: 24,
            multiple: true,
          },
        ],
        data: {
          approvalTime: "",
          // 结项申请
          approvalList1: [],
          // 总结报告
          approvalList2: [],
          accessoryList: [],
          // 评审小组
          reviewList: [],
          // 添加评审人员
          reviewPerson: [],
          otherFile: [],
        },
        enums: {
          // 添加评审人员
          reviewPersonList: [],
        },
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
          needDeliveryTime: "",
          contactName: "",
          procurementManagerName: "",
          programManagerName: "",
          projectCode: "",
          projectName: "",
          systemName: "",
          clientManagerName: "",
          projectMaturity: "",
          workflowId: "",
          projectId: "",
          // processInstanceId: "",
        },
        enums: {},
      },
      taskId: "", // 任务id
      taskName: "", //任务名称// 点击通过或者不通过的方法
      auditJson: {}, // 编辑json
      currentStatus: null, // 子任务的当前状态
      // rowDatas: {},
      workflowId: "",
      projectId: "",
      // 评审小组选人
      PSXZList: [],
      srtracetrackRequest: srtracetrack,
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
        console.log('1111111111111', this.buttonList);
      },
      immediate: true
    },
  },
  computed: {
    id() {
      return this.$route ? this.$route.query.id : "";
    },
    processId() {
      return this.$route ? this.$route.query.processId : "";
    },
    projectCloseId() {
      return this.$route ? this.$route.query.projectCloseId : "";
    },
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    processId() {
      return this.$route ? this.$route.query.processId : "";
    },
  },
  methods: {
    //留痕轨迹

    getTraceTrack(val) {
      console.log('this.busiType', this.busiType, val);

      if (!this.busiType || !val) {
        this.trackLoading = false;
        console.log('90909');

      } else {
        this.trackLoading = true;
        this.srtracetrackRequest.getTraceTrackList(
          console.log('---------------------------------------------------', val),
          { busiId: val, busiType: this.busiType },
          (res) => {
            this.trackData = res.data;
            this.trackLoading = false;
          }
        );
      }
    },
    // 评审小组
    getBaseMembers() {
      api_getFixedGroupMembers({ type: 1 }).then((res) => {
        this.form.data.reviewList = res.data;
      });
    },
    getUserByCode() {
      api_getFixedGroupMembers({ type: 2 }).then((res) => {
        res.data.map((element) => {
          this.form.enums.reviewPersonList.push({
            buName: element.userInfoVos[0].buName,
            fullName: String(element.userInfoVos[0].fullName),
            jfid: element.userInfoVos[0].jfid,
            buid: element.userInfoVos[0].buid,
            roleCode: String(element.userInfoVos[0].roleCode),
            roleName: element.userInfoVos[0].roleName,
            dataName: String(element.fullName),
            dataValue: element.jfid,
          });
        });
      });
    },

    // 提交
    saveOpen() {
      let fixedGroupMembers = [];
      let additionalGroupMembers = [];
      this.form.data.reviewList.forEach((item) => {
        fixedGroupMembers.push({
          buName: item.userInfoVos[0].buName,
          buid: item.userInfoVos[0].buid,
          first: 0,
          jfid: item.jfid,
          fullname: item.userInfoVos[0].fullName,
          roleCode: item.userInfoVos[0].roleCode,
          userName: item.userInfoVos[0].roleName,
        });
      });
      // 反复选择评审小组成员
      let arr = this.form.data.reviewPerson.concat();
      if (this.PSXZList.length != 0) {
        this.PSXZList.forEach((item) => {
          arr.forEach((i, index) => {
            if (i == item.jfid) {
              additionalGroupMembers.push(item);
              arr.splice(index, 1);
            }
          });
        });
      }
      this.form.enums.reviewPersonList.forEach((item) => {
        arr.forEach((i) => {
          if (i == item.dataValue) {
            additionalGroupMembers.push({
              buName: item.buName,
              buid: item.buid,
              first: 1,
              jfid: item.jfid,
              fullname: item.fullName,
              roleCode: item.roleCode,
              userName: item.roleName,
            });
          }
        });
      });

      // 交付物上传 otherFile空
      let closingAppliList = getJSONStr(this.form.data.approvalList1, this.form.config[0].name);
      let sumReportList = getJSONStr(this.form.data.approvalList2, this.form.config[1].name);
      let otherFileList = getJSONStr(this.form.data.otherFile, this.form.config[2].name);

      let data = {
        projectId: this.followforms.data.projectId
          ? this.followforms.data.projectId
          : "",
        workflowId: this.followforms.data.workflowId
          ? this.followforms.data.workflowId
          : "",
        projectCloseId: this.followforms.data.projectCloseId
          ? this.followforms.data.projectCloseId
          : "",
        processInstanceId: this.processId,
        status: 2,
        // 其他附件 otherFile
        // 结项申请
        closingAppli: closingAppliList,
        // 总结报告
        sumReport: sumReportList,
        otherFile: otherFileList,
        additionalGroupMembers,
        fixedGroupMembers,
      };
      console.log(data, "ssss");
      // 提交
      api_projectCloseSave(data).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("提交成功");
          this.$router.push({
            name: "projectClose",
          });
        }
      });
    },
    // 提交
    tg() {
      let val = this.$refs["add1"].validate();
      if (val) {
        this.$confirm("确认提交结项申请?", "提示", {
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
    getSize(size) {
      if (typeof size == "string") {
        return size;
      } else {
        let size1 = (size / 1024 / 1024).toFixed(2) + "mb";
        return size1;
      }
    },
    // 保存
    btg() {
      let val = this.$refs["add1"].validate();
      if (val) {
        let fixedGroupMembers = [];
        let additionalGroupMembers = [];
        // 固定
        this.form.data.reviewList.forEach((item) => {
          fixedGroupMembers.push({
            buName: item.userInfoVos[0].buName,
            buid: item.userInfoVos[0].buid,
            first: 0,
            jfid: item.jfid,
            fullname: item.userInfoVos[0].fullName,
            roleCode: item.userInfoVos[0].roleCode,
            userName: item.userInfoVos[0].roleName,
          });
        });
        // 反复选择评审小组成员
        let arr = this.form.data.reviewPerson.concat();
        if (this.PSXZList.length != 0) {
          this.PSXZList.forEach((item) => {
            arr.forEach((i, index) => {
              if (i == item.jfid) {
                additionalGroupMembers.push(item);
                arr.splice(index, 1);
              }
            });
          });
        }
        this.form.enums.reviewPersonList.forEach((item) => {
          arr.forEach((i) => {
            if (i == item.dataValue) {
              additionalGroupMembers.push({
                buName: item.buName,
                buid: item.buid,
                first: 1,
                jfid: item.jfid,
                fullname: item.fullName,
                roleCode: item.roleCode,
                userName: item.roleName,
              });
            }
          });
        });

        // 交付物上传 otherFile空
        let closingAppliList = getJSONStr(this.form.data.approvalList1, this.form.config[0].name);
        let sumReportList = getJSONStr(this.form.data.approvalList2, this.form.config[1].name);
        let otherFileList = getJSONStr(this.form.data.otherFile, this.form.config[2].name);

        let data = {
          projectId: this.followforms.data.projectId
            ? this.followforms.data.projectId
            : "",
          workflowId: this.followforms.data.workflowId
            ? this.followforms.data.workflowId
            : "",
          projectCloseId: this.followforms.data.projectCloseId
            ? this.followforms.data.projectCloseId
            : "",
          processInstanceId: this.processId,
          status: 1,
          // 其他附件 otherFile
          // 结项申请
          closingAppli: closingAppliList,
          // 总结报告
          sumReport: sumReportList,
          otherFile: otherFileList,
          additionalGroupMembers,
          fixedGroupMembers,
        };
        console.log(data, "baocun");
        this.$confirm("确认保存结项申请?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            api_projectCloseSave(data).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("保存成功");
                this.$router.push({
                  name: "projectClose",
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
        name: "projectClose",
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

        if (res.data?.additionalGroupMembers?.length > 0) {
          let addInfo = res.data.additionalGroupMembers.map((item) => {
            return item.jfid;
          });
          this.$set(this.form.data, "reviewPerson", addInfo);
        }

        if (
          res.data.initialSpectFilesEntityList &&
          res.data.initialSpectFilesEntityList.length > 0
        ) {
          this.form.data.approvalList1 = setFile(
            res.data.initialSpectFilesEntityList[0].closingAppli
          );
          this.form.data.approvalList2 = setFile(
            res.data.initialSpectFilesEntityList[0].sumReport
          );
          if (res.data.initialSpectFilesEntityList[0].otherFile) {
            this.form.data.otherFile = setFile(
              res.data.initialSpectFilesEntityList[0].otherFile
            );
          }
        }
      }
      console.log('============================');

      this.getTraceTrack(this.projectCloseId);
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
    // 评审小组
    this.getBaseMembers();
    this.getUserByCode();
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
  padding: 40px 10px 0 40px;
  font-size: 16px;
  font-weight: 700;
}

.start {
  padding-top: 10px;
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

// ::v-deep .forminter .el-input__inner {
//   width: 80% !important;
// }

::v-deep .el-textarea {
  width: 80% !important;
}

.group {
  padding-top: 0;
}

.el-tag {
  border-radius: 16px;
  margin-right: 10px;
}

::v-deep .el-input--suffix {
  width: 80% !important;
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
  padding: 0 20px;
}
</style>
