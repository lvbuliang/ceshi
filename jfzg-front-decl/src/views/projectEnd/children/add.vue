<template>
  <!--发起立项 -->
  <div class="total-page">
    <!-- 基本信息 srview-->
    <div>
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
      <div class="text start">终验申请</div>
      <SrAdd
        class="sradd"
        :config="form.config"
        :enums="form.enums"
        :form="form.data"
        :otherConfig="form.otherConfig"
        ref="add1"
      >
      </SrAdd>
    </div>
    <sr-work-flow
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      ref="work_flow"
      backName="projectEnd"
    ></sr-work-flow>

    <!-- 审批留痕 -->
    <srStacetrack
      ref="track"
      class="track"
      :imgUrl="imgUrl"
      :trackData="trackData"
      :srTraceArr="srTraceArr"
      :srTraceActive="srTraceActive"
      :trackLoading="trackLoading"
    ></srStacetrack>
  </div>
</template>

<script>
import srStacetrack from "../components/srStacetrack.vue";
import { api_activititodo } from "@/api/index.js";
import store from "@/store";
// 上传工具包
import config from "@/settings.js";
import upload from "@/utils/upload";
import {
  api_getViewList,
  api_saveProjectEnd,
  api_submitProjectEnd,
} from "@/api/projectEnd/index.js";
// import { getJSONStr, setFile } from "@/utils/workflowList";
import srtracetrack from "@/utils/srtracetrack";
import srtracetracks from "@/utils/srtracetrackProEnd.js";
export default {
  name: "projectEndAdd",
  components: { srStacetrack },
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
      imgUrl: "",
      trackData: [],
      srTraceActive: 1,
      srTraceArr: [
        {
          description: "承建单位项目经理-发起终验",
        },
        {
          description: "监理工程师审批",
        },
        {
          description: "项目负责人通过",
        },
        {
          description: "评审小组通过",
        },
        {
          description: "项目负责人终验通过",
        },
      ],
      markData: [],
      trackLoading: true,
      userInfo: store.getters.userInfo,
      buName: store.getters.userInfo.currentBizunit.buName,
      validate: false,
      projeciId: null,
      processInstanceId: null,
      clickmethods: { tg: this.tg, btg: this.btg },
      buttonList: [
        {
          isFromWorkBench:false,
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
              btnName: "保存草稿",
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
        contractName: "",
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
          labelNum: 240,
        },
        config: [
          {
            type: "upload",
            name: "终验报审表（附件）",
            bind: "approvalList1",
            required: "终验报审表（附件）",
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
            name: "源代码验收报告",
            bind: "approvalList2",
            required: "请上传源代码验收报告",
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
            name: "承建单位终验工作总结报告",
            bind: "approvalList3",
            required: "请上传承建单位终验工作总结报告",
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
            name: "系统总体评价意见",
            bind: "approvalList4",
            required: "请上传系统总体评价意见",
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
          // 终验附件
          {
            type: "upload",
            name: "终验申请其他附件",
            bind: "otherListOne",
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
            type: "textarea",
            name: "说明",
            placeholder: "请输入申请说明信息",
            bind: "jlRemark",
            append: true,
            maxlength: 500,
            col: 24,
            row: 3,
            className: "appointStyle customClass2",
          },
        ],
        data: {
          // 终验报审表盖章件
          approvalList1: [],
          // 源代码验收报告
          approvalList2: [],
          // 承建单位终验工作总结报告
          approvalList3: [],
          // 系统总体评价意见
          approvalList4: [],
          accessoryList: [],
          // 终验附件
          // // 其他附件
          otherListOne: [],
          jlRemark: "",
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
      taskId: "", // 任务id
      taskName: "", //任务名称// 点击通过或者不通过的方法
      auditJson: {}, // 编辑json
      currentStatus: null, // 子任务的当前状态
      // rowDatas: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
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
      immediate: true,
    },
  },
  computed: {
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    id() {
      return this.$route ? this.$route.query.id : "";
    },
    processId() {
      return this.$route ? this.$route.query.processId : "";
    },
    contractId() {
      return this.$route ? this.$route.query.contractId : "";
    },
  },
  methods: {
    getTraceTrack(val) {
      if (!this.busiType || !val) {
        this.trackLoading = false;
        this.trackLoading = [];
      } else {
        this.trackLoading = true;
        srtracetracks.getTraceTrackList({ busId: val }, (res) => {
          this.trackData = res.data;
          this.trackLoading = false;
        });
      }
    },

    // 提交
    tg() {
      let val = this.$refs["add1"].validate();
      if (val) {
        let deliverys = [];
        deliverys.push(
          ...this.setdeliverys(this.form.data.otherListOne, "终验申请其他附件")
        );
        deliverys.push(
          ...this.setdeliverys(
            this.form.data.approvalList1,
            "终验报审表（附件）"
          )
        );
        deliverys.push(
          ...this.setdeliverys(this.form.data.approvalList2, "源代码验收报告")
        );
        deliverys.push(
          ...this.setdeliverys(
            this.form.data.approvalList3,
            "承建单位终验工作总结报告"
          )
        );
        deliverys.push(
          ...this.setdeliverys(this.form.data.approvalList4, "系统总体评价意见")
        );
        let data = {
          id: this.id,
          deliverys,
          jlRemark: this.form.data.jlRemark,
        };
        console.log(data, "提交");
        api_submitProjectEnd(data).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("提交成功");
            this.$router.push({
              name: "projectEnd",
            });
          }
        });
      }
    },
    getSize(size) {
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },
    getdeliverys(files) {
      let data = [];
      files.forEach((ele) => {
        data.push({
          id: ele.fileContext,
          name: ele.fileName,
          size: ele.fileSize,
          ids: ele.id,
        });
      });
      return data;
    },
    setdeliverys(file, name) {
      let deliverys = [];
      file.forEach((ele) => {
        if (ele.ids) {
          deliverys.push({
            deliveryName: name,
            fileContext: ele.id,
            fileName: ele.name,
            fileSize: this.getSize(ele.size),
            uploadPerson: this.userInfo.fullname,
            id: ele.ids,
          });
        } else {
          deliverys.push({
            deliveryName: name,
            fileContext: ele.id,
            fileName: ele.name,
            fileSize: this.getSize(ele.size),
            uploadPerson: this.userInfo.fullname,
          });
        }
      });
      return deliverys;
    },
    // 保存
    btg() {
      // let val = this.$refs["add1"].validate();
      // if (val) {
      let deliverys = [];
      deliverys.push(
        ...this.setdeliverys(this.form.data.otherListOne, "终验申请其他附件")
      );
      deliverys.push(
        ...this.setdeliverys(this.form.data.approvalList1, "终验报审表（附件）")
      );
      deliverys.push(
        ...this.setdeliverys(this.form.data.approvalList2, "源代码验收报告")
      );
      deliverys.push(
        ...this.setdeliverys(
          this.form.data.approvalList3,
          "承建单位终验工作总结报告"
        )
      );
      deliverys.push(
        ...this.setdeliverys(this.form.data.approvalList4, "系统总体评价意见")
      );

      let data = {
        id: this.id,
        deliverys,
        jlRemark: this.form.data.jlRemark,
      };
      api_saveProjectEnd(data).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("保存成功");
          this.$router.push({
            name: "projectEnd",
          });
        }
      });
      // }
    },
    onBackClick() {
      this.$router.push({
        name: "projectEnd",
      });
    },
    getNowTime() {
      var date = new Date();
      var seperator1 = "-";

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var strDate = date.getDate();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      var currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds;
      return currentdate;
    },
    async getSee() {
      let dataPar = {
        id: this.id,
        contractId: this.contractId,
      };
      const res = await api_getViewList(dataPar);
      if (res.msg.code == "0000") {
        console.log(res.data, "res.data");
        this.followforms.data.systemName = res.data.systemName
          ? res.data.systemName
          : "";
        this.followforms.data.contractName = res.data.contractName
          ? res.data.contractName
          : "";
        this.followforms.data.projectName = res.data.projectName
          ? res.data.projectName
          : "";
        this.followforms.data.clientManagerName = res.data.clientManagerName
          ? res.data.clientManagerName
          : "";
        this.followforms.data.projectCode = res.data.projectCode
          ? res.data.projectCode
          : "";
        // if (Number(res.data.source) == 0) {
        //   this.followforms.data.source = "统建类项目";
        // } else {
        //   this.followforms.data.source = "承建类项目";
        // }
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
        this.form.data.jlRemark = res.data.jlRemark ? res.data.jlRemark : "";
        if (res.data.deliverys) {
          let filesapprovalList1 = [];
          let filesapprovalList2 = [];
          let filesapprovalList3 = [];
          let filesapprovalList4 = [];
          let filesotherListOne = [];
          res.data.deliverys.forEach((item) => {
            if (item.deliveryName == "终验报审表（附件）") {
              filesapprovalList1.push(item);
              this.form.data.approvalList1 =
                this.getdeliverys(filesapprovalList1);
            }
            if (item.deliveryName == "源代码验收报告") {
              filesapprovalList2.push(item);
              this.form.data.approvalList2 =
                this.getdeliverys(filesapprovalList2);
            }
            if (item.deliveryName == "承建单位终验工作总结报告") {
              filesapprovalList3.push(item);
              this.form.data.approvalList3 =
                this.getdeliverys(filesapprovalList3);
            }
            if (item.deliveryName == "系统总体评价意见") {
              filesapprovalList4.push(item);
              this.form.data.approvalList4 =
                this.getdeliverys(filesapprovalList4);
            }
            // 终验附件
            if (item.deliveryName == "终验申请其他附件") {
              filesotherListOne.push(item);
              this.form.data.otherListOne =
                this.getdeliverys(filesotherListOne);
            }
          });
        }
        this.getTraceTrack(this.id);
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
    // this.rowDatas = JSON.parse(this.$route.query.rowData);
    const { projectId, processId } = query;
    this.projeciId = projectId;
    this.processId = processId;
  },
  mounted() {
    console.log('0000000000000000000000');
    
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
  padding: 0 20px;
}

::v-deep .customClass .el-input__inner {
  width: 80% !important;
}

::v-deep .customClass2 .sr-textarea {
  width: 80% !important;

  .el-textarea {
    width: 100% !important;
  }

  .el-textarea__inner {
    min-height: 80px !important;
    max-height: 100px;
    width: 100% !important;
  }
}
</style>
