<template>
  <div class="page-container">
    <div class="basic-title">采购管理</div>
    <SrAdd
      :config="purchaseForm.config"
      :otherConfig="purchaseForm.otherConfig"
      :form="purchaseForm.data"
      :enums="purchaseForm.enums"
      ref="purchaseForm"
      class="add"
    >
      <!-- 采购类型 下拉选 -->
      <template slot="deliveryType">
        <el-select
          v-model="purchaseForm.data.deliveryType"
          placeholder="请选择"
          @change="deliveryTypeChange"
        >
          <el-option
            v-for="item in purchaseForm.enums.deliveryTypeOptions"
            :key="item.dataValue"
            :label="item.dataName"
            :value="item.dataValue"
          >
          </el-option>
        </el-select>
      </template>
    </SrAdd>
    <div class="basic-title mt-20">合同管理</div>
    <SrAdd
      :config="contractForm.config"
      :otherConfig="contractForm.otherConfig"
      :form="contractForm.data"
      :enums="contractForm.enums"
      ref="contractForm"
      class="add"
    >
      <!-- 合同金额 万元 -->
      <template slot="contractAmount">
        <div class="slot-item">
          <el-input
            class="append-input"
            v-model="contractForm.data.contractAmount"
            placeholder="请输入"
            @input="numValid(contractForm.data.contractAmount)"
          ></el-input>
          <div style="display: inline-block; width: 40px">万元</div>
        </div>
      </template>

      <!-- 合同开始时间 年月日 -->
      <template slot="startTime">
        <div class="slot-item">
          <el-date-picker
            v-model="contractForm.data.startTime"
            :align="right"
            type="date"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            @change="startTimeChange"
          >
          </el-date-picker>
        </div>
      </template>

      <!-- 合同建设结束时间 年月日 -->
      <template slot="endTime">
        <div class="slot-item">
          <el-date-picker
            v-model="contractForm.data.endTime"
            :align="right"
            type="date"
            placeholder="请选择"
            :picker-options="endPickerOptions"
            value-format="yyyy-MM-dd"
            @change="endTimeChange"
          >
          </el-date-picker>
        </div>
      </template>

      <!-- 运维期限 年 -->
      <template slot="operationTime">
        <div class="slot-item">
          <el-input
            class="append-input"
            v-model="contractForm.data.operationTime"
            placeholder="请输入"
            @input="numValid2(contractForm.data.operationTime)"
          ></el-input>
          <span>年</span>
        </div>
      </template>
    </SrAdd>

    <!-- 付款信息节点 -->
    <div class="table-container">
      <el-table
        class="sr_table mt-20"
        :border="true"
        :data="paymentTableData"
        highlight-current-row
        style="width: 100%"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column label="付款点描述">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.description"
              placement="top"
            >
              <span>{{ scope.row.description || "-" }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="付款点比例(%)">
          <template slot-scope="scope">
            {{ scope.row.scale || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="付款点金额(万元)">
          <template slot-scope="scope">
            {{ scope.row.amount || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.remark"
              placement="top"
            >
              <span>{{ scope.row.remark || "-" }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="实际付款金额(万元)">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.actualAmount"
              placement="top"
            >
              <span>{{ scope.row.actualAmount || 0 }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="付款点状态">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.status"
              placement="top"
            >
              <span>{{ scope.row.status == "0" ? "已支付" : "未支付" }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              circle
              size="mini"
              class="danger-text-btn"
              @click="deleteItem(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button class="mt-20 add-btn" size="small" @click="addTableItem"
        >新增付款节点</el-button
      >
    </div>

    <!-- 新增付款节点弹框 -->
    <paymentDialog
      ref="paymentDialog"
      :isMutiple="false"
      @saveCallBack="saveCallBack"
    />

    <!-- 计算弹框 -->
    <computedDiaLog ref="computedDiaLog" @callbackFunc="callbackFunc" />
  </div>
</template>
<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
import paymentDialog from "./addPaymentInfo.vue";
import computedDiaLog from "./computedDiaLog.vue";
import { purchaseConfig1, purchaseConfig2 } from "../const";
import {
  api_saveProjectPurch,
  api_previewProjectPurch,
} from "@/api/purchasingManagement/index.js";
export default {
  name: "radio_form",
  components: { paymentDialog, computedDiaLog },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
      purchaseConfig1,
      purchaseConfig2,
      isPublic: true, // 是否为空开采购
      // 采购form
      purchaseForm: {
        otherConfig: {
          labelNum: 160,
        },
        config: [
          {
            type: "slot",
            slotName: "deliveryType",
            collapseTags: false,
            clearable: false,
            name: "采购类型",
            required: "请选择采购类型",
            placeholder: "请选择",
            bind: "deliveryType",
            dataList: "deliveryTypeOptions",
            trigger: "change",
            col: 8,
          },
          {
            type: "input",
            collapseTags: true,
            name: "中标单位",
            required: "请输入中标单位",
            placeholder: "请输入",
            bind: "successfulBuid",
            trigger: "blur",
            col: 8,
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "公告挂网时间",
            placeholder: "请选择",
            bind: "adInternetTime",
            required: "请选择公告挂网时间",
            format: "yyyy-MM-dd",
            col: 8,
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "开标时间",
            placeholder: "请选择",
            bind: "successfulTime",
            required: "请选择开标时间",
            format: "yyyy-MM-dd",
            col: 8,
          },
          {
            type: "upload",
            name: "招标文件",
            bind: "tenderFileList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 0,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "投标文件",
            bind: "bidFileList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 0,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "upload",
            name: "中标通知书",
            bind: "bidNotice",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            limit: 0,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          deliveryType: 0, // 采购类型
          successfulBuid: "", //中标单位
          togetherProcurementTime: null, //协同采购时间
          adInternetTime: null, // 公告挂网时间
          successfulTime: null, // 开标时间
          tenderFileList: [], // 招标文件
          bidFileList: [], // 投标文件
          bidNotice: [], // 中标通知书
        },
        enums: {
          deliveryTypeOptions: [
            { dataName: "公开采购", dataValue: 0 },
            { dataName: "协同采购", dataValue: 1 },
          ],
        },
      },
      // 合同form
      contractForm: {
        otherConfig: {
          labelNum: 160,
        },
        config: [
          {
            type: "input",
            collapseTags: true,
            name: "合同名称",
            required: "请输入合同名称",
            placeholder: "请输入",
            bind: "contractName",
            trigger: "blur",
            col: 8,
          },
          {
            type: "slot",
            slotName: "contractAmount",
            collapseTags: true,
            name: "合同金额",
            required: "请输入合同金额",
            placeholder: "请输入",
            bind: "contractAmount",
            trigger: "blur",
            col: 8,
          },
          {
            type: "slot",
            slotName: "startTime",
            timeType: "date",
            name: "合同开始日期",
            placeholder: "请选择",
            bind: "startTime",
            required: "请选择合同开始日期",
            format: "yyyy-MM-dd",
            col: 8,
          },
          {
            type: "slot",
            slotName: "endTime",
            timeType: "date",
            name: "合同建设期结束日期",
            placeholder: "请选择",
            bind: "endTime",
            required: "请选择合同建设期结束日期",
            format: "yyyy-MM-dd",
            col: 8,
          },
          {
            type: "slot",
            slotName: "operationTime",
            collapseTags: true,
            name: "运维期限",
            required: "请输入运维期限",
            placeholder: "请输入",
            bind: "operationTime",
            trigger: "blur",
            col: 8,
          },
          {
            type: "upload",
            name: "合同",
            bind: "contractFileList",
            required: "请上传附件",
            fileList: [],
            fileSize: 500,
            limit: 10,
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          contractName: "", // 合同名称
          contractId: '', //合同id
          contractAmount: "", //合同金额
          startTime: null, // 合同开始日期
          endTime: null, // 合同结束日期
          operationTime: "", //运维期限
          contractFileList: [], // 合同
        },
        enums: {},
      },
      // 付款信息table
      paymentTableData: [],
      endPickerOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() <
            new Date(this.contractForm.data.startTime).getTime() -
              8.64e7 +
              1 * 24 * 60 * 60 * 1000
          );
        },
      },
    };
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    },
  },
  methods: {
    callbackFunc() {
      this.paymentTableData.forEach((item) => {
        item.amount =
          (Number(this.contractForm.data.contractAmount) * Number(item.scale)) /
          100;
      });
    },
    totalSum(array, computedField) {
      if (!array || array.length === 0) {
        return 0;
      } else {
        return array.reduce((value, item) => value + +item[computedField], 0);
      }
    },
    // 统计数据
    getSummaries({ columns, data }) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "统计";
          return;
        }
        if (index === 2) {
          sums[index] = this.totalSum(data, "scale") + "%";
          return;
        }
        if (index === 3) {
          sums[index] =
            parseFloat(this.totalSum(data, "amount").toFixed(6)) + "万";
          return;
        }
        if (index === 5) {
          sums[index] =
            parseFloat(this.totalSum(data, "actualAmount").toFixed(6)) + "万";
          return;
        }
      });

      return sums;
    },
    deliveryTypeChange() {
      if (this.purchaseForm.data.deliveryType === 0) {
        // 公开采购
        this.isPublic = true;
        this.purchaseForm.config = purchaseConfig1;
      } else {
        // 协同采购
        this.isPublic = false;
        this.purchaseForm.config = purchaseConfig2;
      }
    },
    // 回显数据
    preview() {
      api_previewProjectPurch({ projectId: this.projectId }).then((res) => {
        if (res.msg.code == "0000") {
          this.purchaseForm.data.deliveryType =
            res.data[0].projectProcurementSubVo.deliveryType;
          this.purchaseForm.data.successfulBuid = res.data[0]
            .projectProcurementSubVo.successfulBuid
            ? res.data[0].projectProcurementSubVo.successfulBuid
            : "";
          if (res.data[0].projectProcurementSubVo.deliveryType == 1) {
            // 协同采购
            this.purchaseForm.config = purchaseConfig2;
            this.purchaseForm.data.togetherProcurementTime = res.data[0]
              .projectProcurementSubVo.togetherProcurementTime
              ? res.data[0].projectProcurementSubVo.togetherProcurementTime
              : "";
          } else {
            // 公开采购
            this.purchaseForm.config = purchaseConfig1;
            this.purchaseForm.data.adInternetTime = res.data[0]
              .projectProcurementSubVo.adInternetTime
              ? res.data[0].projectProcurementSubVo.adInternetTime
              : "";
            this.purchaseForm.data.successfulTime = res.data[0]
              .projectProcurementSubVo.successfulTime
              ? res.data[0].projectProcurementSubVo.successfulTime
              : "";
          }

          this.purchaseForm.data.tenderFileList = [];
          if (res.data[0].projectProcurementSubVo.tenderFileList !== null) {
            this.purchaseForm.data.tenderFileList.push({
              name:
                res.data[0].projectProcurementSubVo.tenderFileList.fileName ||
                "",
              id:
                res.data[0].projectProcurementSubVo.tenderFileList
                  .fileContext || "",
              size:
                res.data[0].projectProcurementSubVo.tenderFileList.fileSize ||
                "",
            });
          }

          this.purchaseForm.data.bidFileList = [];
          if (res.data[0].projectProcurementSubVo.bidFileList !== null) {
            this.purchaseForm.data.bidFileList.push({
              name:
                res.data[0].projectProcurementSubVo.bidFileList.fileName || "",
              id:
                res.data[0].projectProcurementSubVo.bidFileList.fileContext ||
                "",
              size:
                res.data[0].projectProcurementSubVo.bidFileList.fileSize || "",
            });
          }
          this.purchaseForm.data.bidNotice = [];
          if (res.data[0].projectProcurementSubVo.bidNotice !== null) {
            this.purchaseForm.data.bidNotice.push({
              name:
                res.data[0].projectProcurementSubVo.bidNotice.fileName || "",
              id:
                res.data[0].projectProcurementSubVo.bidNotice.fileContext || "",
              size:
                res.data[0].projectProcurementSubVo.bidNotice.fileSize || "",
            });
          }
          // decisionDocument 公司决策文件
          // negotiation 谈判纪要
          this.purchaseForm.data.decisionDocument = [];
          if (res.data[0].projectProcurementSubVo.decisionDocument !== null) {
            this.purchaseForm.data.decisionDocument.push({
              name:
                res.data[0].projectProcurementSubVo.decisionDocument.fileName ||
                "",
              id:
                res.data[0].projectProcurementSubVo.decisionDocument
                  .fileContext || "",
              size:
                res.data[0].projectProcurementSubVo.decisionDocument.fileSize ||
                "",
            });
          }
          this.purchaseForm.data.negotiation = [];
          if (res.data[0].projectProcurementSubVo.negotiation !== null) {
            this.purchaseForm.data.negotiation.push({
              name:
                res.data[0].projectProcurementSubVo.negotiation.fileName || "",
              id:
                res.data[0].projectProcurementSubVo.negotiation.fileContext ||
                "",
              size:
                res.data[0].projectProcurementSubVo.negotiation.fileSize || "",
            });
          }
          this.contractForm.data.contractName = res.data[0]
            .projectProcurementContractVo.contractName
            ? res.data[0].projectProcurementContractVo.contractName
            : "";
            this.contractForm.data.contractId = res.data[0]
            .projectProcurementContractVo.contractId
            ? res.data[0].projectProcurementContractVo.contractId
            : "";
          this.contractForm.data.contractAmount =
            res.data[0].projectProcurementContractVo.contractAmount;
          this.contractForm.data.startTime = res.data[0]
            .projectProcurementContractVo.startTime
            ? res.data[0].projectProcurementContractVo.startTime
            : "";
          this.contractForm.data.endTime =
            res.data[0].projectProcurementContractVo.endTime;
          this.contractForm.data.operationTime = res.data[0]
            .projectProcurementContractVo.operationTime
            ? res.data[0].projectProcurementContractVo.operationTime
            : "";
          this.contractForm.data.contractFileList = [];
          if (
            res.data[0].projectProcurementContractVo.deliveryEntityList
              .length == 1
          ) {
            this.contractForm.data.contractFileList.push({
              name: res.data[0].projectProcurementContractVo
                .deliveryEntityList[0].fileName,
              id: res.data[0].projectProcurementContractVo.deliveryEntityList[0]
                .fileContext,
              size: res.data[0].projectProcurementContractVo
                .deliveryEntityList[0].fileSize,
            });
          } else if (
            res.data[0].projectProcurementContractVo.deliveryEntityList == null
          ) {
            this.contractForm.data.contractFileList = [];
          } else {
            this.contractForm.data.contractFileList = [];
            res.data[0].projectProcurementContractVo.deliveryEntityList.map(
              (item) => {
                this.contractForm.data.contractFileList.push({
                  name: item.fileName,
                  id: item.fileContext,
                  size: item.fileSize,
                });
              }
            );
          }

          this.paymentTableData = res.data[0].projectPayPointVos;
        }
      });
    },
    getSize(size) {
      if (typeof size == "string") return size;
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },
    saveCallBack(cbObject) {
      console.log(cbObject);
      const { data } = cbObject;
      this.paymentTableData.push(data);
    },
    // 开始时间选择
    startTimeChange(time) {
      if (
        this.contractForm.data.endTime !== "" ||
        this.contractForm.data.endTime !== null
      ) {
        if (
          this.contractForm.data.startTime === null ||
          this.contractForm.data.startTime === ""
        ) {
          this.contractForm.data.endTime === null;
        }
      } else {
        this.contractForm.data.startTime === time;
      }
    },
    // 结束时间选择
    endTimeChange(time) {
      if (
        this.contractForm.data.startTime === "" ||
        this.contractForm.data.startTime === null
      ) {
        this.$message.warning("请先选择合同开始日期");
        this.contractForm.data.endTime = null;
      } else {
        this.contractForm.data.endTime = time;
      }
    },
    // 新增付款节点
    addTableItem() {
      let totalScale = this.paymentTableData.reduce((pre, cur) => {
        return pre + Number(cur.scale);
      }, 0);
      let totalAmount = this.paymentTableData.reduce((pre, cur) => {
        return pre + Number(cur.amount);
      }, 0);
      if (
        totalScale == 100 &&
        totalAmount == this.contractForm.data.contractAmount
      ) {
        this.$notify({
          title: "提示",
          type: "warning",
          dangerouslyUseHTMLString: true,
          message: `
          <div>当前标段下付款比例已经为 <span style="color: #1890FF;font-weight: bold;margin-left: 8px;">100%</span></div>
          <div style="color: #fa2">请重新分配付款比例后再新增付款节点</div>`,
          duration: 0,
        });
      } else if (this.contractForm.data.contractAmount == "") {
        this.$notify({
          title: "提示",
          type: "warning",
          dangerouslyUseHTMLString: true,
          message: `
          <div style="color: #333">请先设置当前标段下</div>
          <div>
            <span style="color: red; font-weight: bold;margin-right: 5px">合同金额</span>再添加付款节点信息
          </div>`,
          duration: 3000,
        });
      } else if (
        totalAmount == this.contractForm.data.contractAmount &&
        this.contractForm.data.contractAmount !== ""
      ) {
        this.$notify({
          title: "提示",
          type: "warning",
          dangerouslyUseHTMLString: true,
          message: `
          <div>当前标段下付款金额已经为合同金额的 <span style="color: #1890FF;font-weight: bold;margin-left: 8px;">100%</span></div>
          <div style="color: #fa2">请重新调整付款金额后再新增付款节点</div>`,
          duration: 0,
        });
      } else {
        this.$nextTick(() => {
          this.$refs.paymentDialog.open(
            null,
            this.paymentTableData,
            this.contractForm.data.contractAmount
          );
        });
      }
    },

    numValid(value) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value) == false) {
        this.contractForm.data.contractAmount = "";
      } else {
        this.contractForm.data.contractAmount = value;
        let totalAmount = this.paymentTableData.reduce((pre, cur) => {
          return pre + Number(cur.amount);
        }, 0);

        if (totalAmount !== 0 && value > totalAmount) {
          console.log(this.paymentTableData, "发现合同金额比计算的总数大了");
          this.$nextTick(() => {
            this.$refs.computedDiaLog.open();
          });
        }
      }
    },

    numValid2(value) {
      var reg = /^(\d{1,8}(\.\d{0,2})?)?$/;
      if (reg.test(value) == false) {
        this.contractForm.data.operationTime = "";
      } else {
        this.contractForm.data.operationTime = value;
      }
    },
    deleteItem(index) {
      this.paymentTableData.splice(index, 1);
    },

    // 保存方法
    saveFunc() {
      let projectPaymentInfoEntities = []; // 付款信息

      let projectContractEntities = [
        // 合同采购信息
        {
          deliveryType: this.purchaseForm.data.deliveryType, //采购类型
          successfulBuid: this.purchaseForm.data.successfulBuid, // 中标单位
          adInternetTime: this.purchaseForm.data.adInternetTime, // 广告挂网时间
          successfulTime: this.purchaseForm.data.successfulTime, // 开标时间
          togetherProcurementTime:
            this.purchaseForm.data.togetherProcurementTime, //协同采购时间
          contractName: this.contractForm.data.contractName, // 合同名称
          contractAmount: this.contractForm.data.contractAmount, // 合同金额
          startTime: this.contractForm.data.startTime, // 合同开始时间
          endTime: this.contractForm.data.endTime, // 合同建设期结束日期
          operationTime: this.contractForm.data.operationTime, // 运维期限
          isSection: 1,
          sectionSort: 1,
          projectId: this.projectId,
          contractId: this.contractForm.data.contractId
        },
      ];
      let deliverys = [];

      // tenderFileList 招标文件
      // bidFileList 投标文件
      // bidNotice 中标通知书
      // decisionDocument 公司决策文件
      // negotiation 谈判纪要
      if (this.purchaseForm.data.deliveryType == 0) {
        deliverys = [
          {
            fileContext: this.purchaseForm.data.tenderFileList == null ? '' : this.purchaseForm.data.tenderFileList[0]?.id,
            fileName: this.purchaseForm.data.tenderFileList == null ? '' : this.purchaseForm.data.tenderFileList[0]?.name,
            fileSize: this.purchaseForm.data.tenderFileList == null ? '' : 
              this.getSize(this.purchaseForm.data.tenderFileList[0]?.size),
            isMustUpload: 1,
            isSection: 1,
            name: "招标文件",
            isContractDelivery: 1,
            projectId: this.projectId || "",
            sectionSort: 1,
          },
          {
            fileContext:  this.purchaseForm.data.bidFileList == null ? '' : this.purchaseForm.data.bidFileList[0]?.id,
            fileName:  this.purchaseForm.data.bidFileList == null ? '' : this.purchaseForm.data.bidFileList[0]?.name,
            fileSize: this.purchaseForm.data.bidFileList == null ? '' : 
              this.getSize(this.purchaseForm.data.bidFileList[0]?.size),
            isMustUpload: 1,
            isSection: 1,
            name: "投标文件",
            isContractDelivery: 1,
            projectId: this.projectId || "",
            sectionSort: 1,
          },
          {
            fileContext:  this.purchaseForm.data.bidNotice == null ? '' : this.purchaseForm.data.bidNotice[0]?.id,
            fileName:  this.purchaseForm.data.bidNotice == null ? '' : this.purchaseForm.data.bidNotice[0]?.name,
            fileSize: this.purchaseForm.data.bidNotice == null ? '' : 
              this.getSize(this.purchaseForm.data.bidNotice[0]?.size),
            isMustUpload: 1,
            isSection: 1,
            name: "中标通知书",
            isContractDelivery: 1,
            projectId: this.projectId || "",
            sectionSort: 1,
          },
        ];
        if (
          this.contractForm.data.contractFileList !== [] &&
          this.contractForm.data.contractFileList !== null
        ) {
          this.contractForm.data.contractFileList.map((item) => {
            deliverys.push({
              fileContext: item.id,
              fileName: item.name,
              fileSize: this.getSize(item.size),
              isMustUpload: 1,
              isSection: 1,
              name: "合同",
              isContractDelivery: 0,
              projectId: this.projectId,
              sectionSort: 1,
            });
          });
        }
      } else {
        deliverys = [
          {
            fileContext:  this.purchaseForm.data.decisionDocument == null ? '' : this.purchaseForm.data.decisionDocument[0]?.id,
            fileName:  this.purchaseForm.data.decisionDocument == null ? '' : this.purchaseForm.data.decisionDocument[0]?.name,
            fileSize: this.purchaseForm.data.decisionDocument == null ? '' : 
              this.getSize(this.purchaseForm.data.decisionDocument[0]?.size)
      ,
            isMustUpload: 1,
            isSection: 1,
            name: "公司决策文件",
            isContractDelivery: 1,
            projectId: this.projectId || "",
            sectionSort: 1,
          },
          {
            fileContext:  this.purchaseForm.data.negotiation == null ? '' : this.purchaseForm.data.negotiation[0]?.id,
            fileName:  this.purchaseForm.data.negotiation == null ? '' : this.purchaseForm.data.negotiation[0]?.name,
            fileSize: this.purchaseForm.data.negotiation == null ? '' : 
              this.getSize(this.purchaseForm.data.negotiation[0]?.size),
            isMustUpload: 1,
            isSection: 1,
            name: "谈判纪要",
            isContractDelivery: 1,
            projectId: this.projectId || "",
            sectionSort: 1,
          },
        ];
        if (
          this.contractForm.data.contractFileList !== [] &&
          this.contractForm.data.contractFileList !== null
        ) {
          this.contractForm.data.contractFileList.map((item) => {
            deliverys.push({
              fileContext: item.id,
              fileName: item.name,
              fileSize: this.getSize(item.size),
              isMustUpload: 1,
              isSection: 1,
              name: "合同",
              isContractDelivery: 0,
              projectId: this.projectId,
              sectionSort: 1,
            });
          });
        }
      }

      // 付款table
      if (this.paymentTableData !== [] || this.paymentTableData !== null) {
        this.paymentTableData.map((item) => {
          projectPaymentInfoEntities.push({
            ...item,
            isSection: 1,
            projectId: this.projectId,
            sectionSort: 1,
          });
        });
      }

      let payLoad = {
        projectContractEntities,
        projectId: this.projectId,
        isSection: 1,
        projectPaymentInfoEntities,
        deliverys,
        sectionSorts: [1],
        isCommit: 1,
      };

      console.log("payLoad", payLoad);

      api_saveProjectPurch(payLoad).then((res) => {
        console.log(res);
        if (res.msg.code == "0000") {
          this.$message.success("保存成功!");
          this.$router.push({
            name: "purchasingManagement",
          });
        } else {
          this.$message.success(res.msg.message);
        }
      });
    },
    // 提交方法
    tjFunc() {
      const form1Valid = this.$refs.purchaseForm.validate();
      const form2Valid = this.$refs.contractForm.validate();
      if (form1Valid && form2Valid) {
        console.log(
          "全部校验通过",
          this.purchaseForm.data,
          this.contractForm.data,
          this.paymentTableData
        );

        let projectPaymentInfoEntities = []; // 付款table

        let projectContractEntities = [
          {
            deliveryType: this.purchaseForm.data.deliveryType, //采购类型
            successfulBuid: this.purchaseForm.data.successfulBuid, // 中标单位
            togetherProcurementTime:
              this.purchaseForm.data.togetherProcurementTime, //协同采购时间
            adInternetTime: this.purchaseForm.data.adInternetTime, // 广告挂网时间
            successfulTime: this.purchaseForm.data.successfulTime, // 开标时间
            contractName: this.contractForm.data.contractName, // 合同名称
            contractAmount: this.contractForm.data.contractAmount, // 合同金额
            startTime: this.contractForm.data.startTime, // 合同开始时间
            endTime: this.contractForm.data.endTime, // 合同建设期结束日期
            operationTime: this.contractForm.data.operationTime, // 运维期限
            isSection: 1,
            sectionSort: 1,
            projectId: this.projectId,
            contractId: this.contractForm.data.contractId
          },
        ];

        let deliverys = [];

        // tenderFileList 招标文件
        // bidFileList 投标文件
        // bidNotice 中标通知书
        // decisionDocument 公司决策文件
        // negotiation 谈判纪要
        if (this.purchaseForm.data.deliveryType == 0) {
          deliverys = [
            {
              fileContext: this.purchaseForm.data.tenderFileList[0].id,
              fileName: this.purchaseForm.data.tenderFileList[0].name,
              fileSize: this.getSize(
                this.purchaseForm.data.tenderFileList[0].size
              ),
              isMustUpload: 1,
              isSection: 1,
              name: "招标文件",
              isContractDelivery: 1,
              projectId: this.projectId,
              sectionSort: 1,
            },
            {
              fileContext: this.purchaseForm.data.bidFileList[0].id,
              fileName: this.purchaseForm.data.bidFileList[0].name,
              fileSize: this.getSize(
                this.purchaseForm.data.bidFileList[0].size
              ),
              isMustUpload: 1,
              isSection: 1,
              name: "投标文件",
              isContractDelivery: 1,
              projectId: this.projectId,
              sectionSort: 1,
            },
            {
              fileContext: this.purchaseForm.data.bidNotice[0].id,
              fileName: this.purchaseForm.data.bidNotice[0].name,
              fileSize: this.getSize(this.purchaseForm.data.bidNotice[0].size),
              isMustUpload: 1,
              isSection: 1,
              name: "中标通知书",
              isContractDelivery: 1,
              projectId: this.projectId,
              sectionSort: 1,
            },
            // {
            //   fileContext: this.contractForm.data.contractFileList[0].id,
            //   fileName: this.contractForm.data.contractFileList[0].name,
            //   fileSize: this.getSize(
            //     this.contractForm.data.contractFileList[0].size
            //   ),
            //   isMustUpload: 1,
            //   isSection: 1,
            //   name: "合同",
            //   isContractDelivery: 0,
            //   projectId: this.projectId,
            //   sectionSort: 1,
            // },
          ];
          this.contractForm.data.contractFileList.map((item) => {
            deliverys.push({
              fileContext: item.id,
              fileName: item.name,
              fileSize: this.getSize(item.size),
              isMustUpload: 1,
              isSection: 1,
              name: "合同",
              isContractDelivery: 0,
              projectId: this.projectId,
              sectionSort: 1,
            });
          });
        } else {
          deliverys = [
            {
              fileContext: this.purchaseForm.data.decisionDocument[0].id,
              fileName: this.purchaseForm.data.decisionDocument[0].name,
              fileSize: this.getSize(
                this.purchaseForm.data.decisionDocument[0].size
              ),
              isMustUpload: 1,
              isSection: 1,
              name: "公司决策文件",
              isContractDelivery: 1,
              projectId: this.projectId,
              sectionSort: 1,
            },
            {
              fileContext: this.purchaseForm.data.negotiation[0].id,
              fileName: this.purchaseForm.data.negotiation[0].name,
              fileSize: this.getSize(
                this.purchaseForm.data.negotiation[0].size
              ),
              isMustUpload: 1,
              isSection: 1,
              name: "谈判纪要",
              isContractDelivery: 1,
              projectId: this.projectId,
              sectionSort: 1,
            },
            // {
            //   fileContext: this.contractForm.data.contractFileList[0].id,
            //   fileName: this.contractForm.data.contractFileList[0].name,
            //   fileSize: this.getSize(
            //     this.contractForm.data.contractFileList[0].size
            //   ),
            //   isMustUpload: 1,
            //   isSection: 1,
            //   name: "合同",
            //   isContractDelivery: 0,
            //   projectId: this.projectId,
            //   sectionSort: 1,
            // },
          ];
          this.contractForm.data.contractFileList.map((item) => {
            deliverys.push({
              fileContext: item.id,
              fileName: item.name,
              fileSize: this.getSize(item.size),
              isMustUpload: 1,
              isSection: 1,
              name: "合同",
              isContractDelivery: 0,
              projectId: this.projectId,
              sectionSort: 1,
            });
          });
        }

        // 付款table
        this.paymentTableData.forEach((item) => {
          projectPaymentInfoEntities.push({
            ...item,
            isSection: 1,
            projectId: this.projectId,
            sectionSort: 1,
          });
        });

        let payLoad = {
          projectContractEntities,
          projectId: this.projectId,
          isSection: 1,
          projectPaymentInfoEntities,
          deliverys,
          sectionSorts: [1],
          isCommit: 0,
        };

        console.log("payLoad", payLoad);

        api_saveProjectPurch(payLoad).then((res) => {
          console.log(res);
          if (res.msg.code == "0000") {
            this.$message.success("提交成功!");
            this.$router.push({
              name: "purchasingManagement",
            });
          } else {
            this.$message.success(res.msg.message);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@media (min-width: 1366px) {
  .page-container {
    width: 100%;
  }
}

.append-input {
  width: 119% !important;
}

/*>=1366的设备*/

@media (min-width: 1680px) {
  .page-container {
    width: 70%;
  }
}

/*>=1680的设备*/

@media (min-width: 1920px) {
  .page-container {
    width: 100%;
  }
}

.basic-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
  padding-left: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.slot-item {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.table-container {
  padding-left: 15px;
  margin-bottom: 50px;
}

.append-input {
  width: 90%;
  margin-right: 2%;
}

.mr-3 {
  margin-right: 3px;
}

.danger-text-btn {
  color: #f56c6c;
}

.add-btn {
  border: 1px dashed #1890ff;
  color: #1890ff;
}
</style>
