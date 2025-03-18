<template>
  <div class="page-container">
    <div class="item" v-for="(item, index) in result" :key="index">
      <!-- 标段名称 -->
      <div class="purchase-name">
        <el-form :model="result[index].basicForm" label-width="140px">
          <el-form-item label="标段名称">
            <el-input
              style="width: 200px"
              :value="result[index].basicForm.name + (index + 1)"
              disabled
            ></el-input>

            <el-button
              v-if="index === result.length - 1"
              style="margin-left: 10px"
              @click="addRows"
              circle
              size="small"
              icon="el-icon-plus"
              class="add-btn"
            ></el-button>
            <el-button
              v-if="index !== 0"
              circle
              style="margin-left: 10px"
              @click="delRows(index)"
              icon="el-icon-minus"
              size="small"
              class="minus-btn"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="basic-title">采购管理</div>
      <SrAdd
        :config="result[index].purchaseForm.config"
        :otherConfig="result[index].purchaseForm.otherConfig"
        :form="result[index].purchaseForm.data"
        :enums="result[index].purchaseForm.enums"
        :ref="`purchaseForm${index + 1}`"
        class="add"
      >
        <!-- 中标单位 -->
        <template slot="successfulBuid">
          <el-input
            v-model="result[index].purchaseForm.data.successfulBuid"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 3 }"
            maxlength="500"
            show-word-limit
          ></el-input>
        </template>
        <!-- 采购类型 下拉选 -->
        <template slot="deliveryType">
          <el-select
            v-model="result[index].purchaseForm.data.deliveryType"
            placeholder="请选择"
            @change="deliveryTypeChange(index, $event)"
          >
            <el-option
              v-for="item in result[index].purchaseForm.enums
                .deliveryTypeOptions"
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
        :config="result[index].contractForm.config"
        :otherConfig="result[index].contractForm.otherConfig"
        :form="result[index].contractForm.data"
        :enums="result[index].contractForm.enums"
        :ref="`contractForm${index + 1}`"
        class="add"
      >
        <!-- 合同名称 -->
        <template slot="contractName">
          <el-input
            v-model="result[index].contractForm.data.contractName"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            maxlength="500"
            show-word-limit
          ></el-input>
        </template>
        <!-- 合同金额 万元 -->
        <template slot="contractAmount">
          <div class="slot-item">
            <el-input
              class="append-input"
              v-model="result[index].contractForm.data.contractAmount"
              placeholder="请输入"
              @input="
                numValid(result[index].contractForm.data.contractAmount, index)
              "
            ></el-input>
            <span style="display: inline-block; width: 40px">万元</span>
          </div>
        </template>

        <!-- 合同开始时间 年月日 -->
        <template slot="startTime">
          <div class="slot-item">
            <el-date-picker
              v-model="result[index].contractForm.data.startTime"
              :align="right"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              @change="startTimeChange($event, index)"
            >
            </el-date-picker>
          </div>
        </template>

        <!-- 合同建设结束时间 年月日 -->
        <template slot="endTime">
          <div class="slot-item">
            <el-date-picker
              v-model="result[index].contractForm.data.endTime"
              :align="right"
              type="date"
              placeholder="请选择"
              :picker-options="endPickerOptions(index)"
              value-format="yyyy-MM-dd"
              @change="endTimeChange($event, index)"
            >
            </el-date-picker>
          </div>
        </template>

        <!-- 运维期限 年 -->
        <template slot="operationTime">
          <div class="slot-item">
            <el-input
              class="append-input"
              v-model="result[index].contractForm.data.operationTime"
              placeholder="请输入"
              @input="
                numValid2(result[index].contractForm.data.operationTime, index)
              "
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
          :data="result[index].paymentTableData"
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
              {{ scope.row.amount }}
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
          <el-table-column label="实际付款点金额(万元)">
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
                @click="deleteItem(scope.$index, index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button
          class="mt-20 add-btn2"
          size="small"
          @click="addTableItem(index)"
          >+ 新增付款节点</el-button
        >
      </div>
    </div>

    <!-- 新增付款节点弹框 -->
    <paymentDialog
      ref="paymentDialog"
      :isMutiple="true"
      @saveCallBack="saveCallBack"
    />

    <!-- 计算弹框 -->
    <computedDiaLog ref="computedDiaLog" @callbackFunc="callbackFunc" />

    <!-- 返回顶部 -->
    <el-backtop
      :visibility-height="visibilityHeight"
      target=".total-page"
      :bottom="bottom"
    ></el-backtop>
  </div>
</template>
<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
import paymentDialog from "./addPaymentInfo.vue";
import computedDiaLog from "./computedDiaLog.vue";
import {
  api_previewProjectPurch,
  api_saveProjectPurch,
} from "@/api/purchasingManagement/index.js";
import { purchaseConfig1, purchaseConfig2, contractConfig } from "../const";
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
      visibilityHeight: 600,
      bottom: 160,
      purchaseConfig1, // 公开采购-采购部分配置项
      purchaseConfig2, // 协同采购-采购部分配置项
      contractConfig, // 合同部分配置项
      isPublic: true, // 是否为空开采购
      result: [],
      previewList: [], // 回显数据
      defaultObj: {
        basicForm: {
          name: "标段", //标段名称
        },
        // 采购form
        purchaseForm: {
          otherConfig: {
            labelNum: 140,
          },
          config: [
            {
              type: "slot",
              slotName: "deliveryType",
              collapseTags: true,
              name: "采购类型",
              required: "请选择采购类型",
              placeholder: "请选择",
              bind: "deliveryType",
              trigger: "change",
              col: 12,
            },
            {
              type: "slot",
              slotName: "successfulBuid",
              collapseTags: true,
              name: "中标单位",
              required: "请输入中标单位",
              placeholder: "请输入",
              bind: "successfulBuid",
              trigger: "blur",
              col: 12,
            },
            {
              type: "dateSelect",
              timeType: "date",
              name: "公告挂网时间",
              placeholder: "请选择",
              bind: "adInternetTime",
              required: "请选择公告挂网时间",
              format: "yyyy-MM-dd",
              col: 12,
            },
            {
              type: "dateSelect",
              timeType: "date",
              name: "开标时间",
              placeholder: "请选择",
              bind: "successfulTime",
              required: "请选择开标时间",
              format: "yyyy-MM-dd",
              col: 12,
            },
            // 公开采购
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
              type: "slot",
              slotName: "contractName",
              collapseTags: true,
              name: "合同名称",
              required: "请输入合同名称",
              placeholder: "请输入",
              bind: "contractName",
              trigger: "blur",
              col: 24,
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
              col: 12,
            },
            {
              // type: "dateSelect",
              type: "slot",
              slotName: "startTime",
              timeType: "date",
              name: "合同开始日期",
              placeholder: "请选择",
              bind: "startTime",
              required: "请选择合同开始日期",
              format: "yyyy-MM-dd",
              col: 12,
            },
            {
              // type: "dateSelect",
              type: "slot",
              slotName: "endTime",
              timeType: "date",
              name: "合同建设期结束日期",
              placeholder: "请选择",
              bind: "endTime",
              required: "请选择合同建设期结束日期",
              format: "yyyy-MM-dd",
              col: 12,
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
              col: 12,
            },
            {
              type: "upload",
              name: "合同",
              bind: "contractFileList",
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
          ],
          data: {
            contractName: "", // 合同名称
            contractId: "", // 合同id
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
      },
      endPickerOptions: (index) => {
        let that = this;
        return {
          disabledDate(time) {
            return (
              time.getTime() <
              new Date(
                that.result[index].contractForm.data.startTime
              ).getTime() -
                8.64e7 +
                1 * 24 * 60 * 60 * 1000
            );
          },
        };
      },
    };
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    },
  },
  mounted() {
    this.result = [];
    this.result.push(this.defaultObj);
    // 进来之后默认显示第一条空数据
  },
  methods: {
    callbackFunc(index) {
      this.result[index].paymentTableData.forEach((item) => {
        item.amount =
          (Number(this.result[index].contractForm.data.contractAmount) *
            Number(item.scale)) /
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
    // 遍历处理数据
    operationData(item) {
      let newItem = {};
      // 公开采购
      if (item.projectProcurementSubVo.deliveryType == 0) {
        newItem = {
          basicForm: {
            name: "标段", //标段名称
          },
          purchaseForm: {
            otherConfig: {
              labelNum: 140,
            },
            config: this.purchaseConfig1,
            data: {
              deliveryType: "", // 采购类型
              successfulBuid: "", //中标单位
              adInternetTime: "", // 公告挂网时间
              successfulTime: "", // 开标时间
              tenderFileList: [
                {
                  name: "",
                  id: "",
                  size: "",
                },
              ], // 招标文件
              bidFileList: [
                {
                  name: "",
                  id: "",
                  size: "",
                },
              ], // 投标文件
              bidNotice: [
                {
                  name: "",
                  id: "",
                  size: "",
                },
              ], // 中标通知书
            },
            enums: {
              deliveryTypeOptions: [
                { dataName: "公开采购", dataValue: 0 },
                { dataName: "协同采购", dataValue: 1 },
              ],
            },
          },
          contractForm: {
            otherConfig: {
              labelNum: 160,
            },
            config: this.contractConfig,
            data: {
              contractName: "", // 合同名称
              contractId: "", // 合同id
              contractAmount: "", //合同金额
              startTime: "", // 合同开始日期
              endTime: "", // 合同结束日期
              operationTime: "", //运维期限
              contractFileList: [
                {
                  name: "",
                  id: "",
                  size: "",
                },
              ], // 合同
            },
            enums: {},
          },
          paymentTableData: item.projectPayPointVos,
        };
        newItem.purchaseForm.data.deliveryType =
          item.projectProcurementSubVo.deliveryType; // 采购类型
        newItem.purchaseForm.data.successfulBuid = item.projectProcurementSubVo
          .successfulBuid
          ? item.projectProcurementSubVo.successfulBuid
          : ""; //中标单位
        newItem.purchaseForm.data.adInternetTime = item.projectProcurementSubVo
          .adInternetTime
          ? item.projectProcurementSubVo.adInternetTime
          : ""; // 公告挂网时间
        newItem.purchaseForm.data.successfulTime = item.projectProcurementSubVo
          .successfulTime
          ? item.projectProcurementSubVo.successfulTime
          : ""; // 开标时间

        // // 招标文件
        if (item.projectProcurementSubVo.tenderFileList == null) {
          newItem.purchaseForm.data.tenderFileList = [];
        } else {
          newItem.purchaseForm.data.tenderFileList[0].name =
            item.projectProcurementSubVo.tenderFileList.fileName || null;
          newItem.purchaseForm.data.tenderFileList[0].id =
            item.projectProcurementSubVo.tenderFileList.fileContext || null;
          newItem.purchaseForm.data.tenderFileList[0].size =
            item.projectProcurementSubVo.tenderFileList.fileSize || null;
        }

        // // 投标文件
        if (item.projectProcurementSubVo.bidFileList == null) {
          newItem.purchaseForm.data.bidFileList = [];
        } else {
          newItem.purchaseForm.data.bidFileList[0].name =
            item.projectProcurementSubVo.bidFileList.fileName || null;
          newItem.purchaseForm.data.bidFileList[0].id =
            item.projectProcurementSubVo.bidFileList.fileContext || null;
          newItem.purchaseForm.data.bidFileList[0].size =
            item.projectProcurementSubVo.bidFileList.fileSize || null;
        }

        // // 中标通知书
        if (item.projectProcurementSubVo.bidNotice == null) {
          newItem.purchaseForm.data.bidNotice = [];
        } else {
          newItem.purchaseForm.data.bidNotice[0].name =
            item.projectProcurementSubVo.bidNotice.fileName || null;
          newItem.purchaseForm.data.bidNotice[0].id =
            item.projectProcurementSubVo.bidNotice.fileContext || null;
          newItem.purchaseForm.data.bidNotice[0].size =
            item.projectProcurementSubVo.bidNotice.fileSize || null;
        }

        newItem.contractForm.data.contractName = item
          .projectProcurementContractVo.contractName
          ? item.projectProcurementContractVo.contractName
          : ""; // 合同名称
        newItem.contractForm.data.contractId = item.projectProcurementContractVo
          .contractId
          ? item.projectProcurementContractVo.contractId
          : ""; // 合同id
        newItem.contractForm.data.contractAmount = item
          .projectProcurementContractVo.contractAmount
          ? item.projectProcurementContractVo.contractAmount
          : ""; //合同金额
        newItem.contractForm.data.startTime = item.projectProcurementContractVo
          .startTime
          ? item.projectProcurementContractVo.startTime
          : ""; // 合同开始日期
        newItem.contractForm.data.endTime = item.projectProcurementContractVo
          .endTime
          ? item.projectProcurementContractVo.endTime
          : ""; // 合同结束日期
        newItem.contractForm.data.operationTime = item
          .projectProcurementContractVo.operationTime
          ? item.projectProcurementContractVo.operationTime
          : ""; //运维期限

        // // 合同
        if (item.projectProcurementContractVo.deliveryEntityList.length === 1) {
          newItem.contractForm.data.contractFileList[0].name =
            item.projectProcurementContractVo.deliveryEntityList[0].fileName;
          newItem.contractForm.data.contractFileList[0].id =
            item.projectProcurementContractVo.deliveryEntityList[0].fileContext;
          newItem.contractForm.data.contractFileList[0].size =
            item.projectProcurementContractVo.deliveryEntityList[0].fileSize;
        } else if (
          item.projectProcurementContractVo.deliveryEntityList == null
        ) {
          newItem.contractForm.data.contractFileList = [];
        } else {
          newItem.contractForm.data.contractFileList = [];
          item.projectProcurementContractVo.deliveryEntityList.map((c) => {
            newItem.contractForm.data.contractFileList.push({
              name: c.fileName,
              id: c.fileContext,
              size: c.fileSize,
            });
          });
        }
      } else {
        newItem = {
          basicForm: {
            name: "标段", //标段名称
          },
          purchaseForm: {
            otherConfig: {
              labelNum: 140,
            },
            config: this.purchaseConfig2,
            data: {
              deliveryType: "", // 采购类型
              successfulBuid: "", //中标单位
              togetherProcurementTime: null, //协同采购时间
              decisionDocument: [
                {
                  name: "",
                  id: "",
                  size: "",
                },
              ], // 公司决策文件
              negotiation: [
                {
                  name: "",
                  id: "",
                  size: "",
                },
              ], // 谈判纪要
            },
            enums: {
              deliveryTypeOptions: [
                { dataName: "公开采购", dataValue: 0 },
                { dataName: "协同采购", dataValue: 1 },
              ],
            },
          },
          contractForm: {
            otherConfig: {
              labelNum: 160,
            },
            config: this.contractConfig,
            data: {
              contractName: "", // 合同名称
              contractId: "", // 合同id
              contractAmount: "", //合同金额
              startTime: "", // 合同开始日期
              endTime: "", // 合同结束日期
              operationTime: "", //运维期限
              contractFileList: [
                {
                  name: "",
                  id: "",
                  size: "",
                },
              ], // 合同
            },
            enums: {},
          },
          paymentTableData: item.projectPayPointVos,
        };

        newItem.purchaseForm.data.deliveryType =
          item.projectProcurementSubVo.deliveryType; // 采购类型
        newItem.purchaseForm.data.successfulBuid = item.projectProcurementSubVo
          .successfulBuid
          ? item.projectProcurementSubVo.successfulBuid
          : ""; //中标单位
        newItem.purchaseForm.data.togetherProcurementTime = item
          .projectProcurementSubVo.togetherProcurementTime
          ? item.projectProcurementSubVo.togetherProcurementTime
          : ""; // 协同采购时间

        // // 公司决策文件
        if (item.projectProcurementSubVo.decisionDocument == null) {
          newItem.purchaseForm.data.decisionDocument = [];
        } else {
          newItem.purchaseForm.data.decisionDocument[0].name =
            item.projectProcurementSubVo.decisionDocument.fileName || null;
          newItem.purchaseForm.data.decisionDocument[0].id =
            item.projectProcurementSubVo.decisionDocument.fileContext || null;
          newItem.purchaseForm.data.decisionDocument[0].size =
            item.projectProcurementSubVo.decisionDocument.fileSize || null;
        }

        // // 谈判纪要
        if (item.projectProcurementSubVo.negotiation == null) {
          newItem.purchaseForm.data.negotiation = [];
        } else {
          newItem.purchaseForm.data.negotiation[0].name =
            item.projectProcurementSubVo.negotiation.fileName || null;
          newItem.purchaseForm.data.negotiation[0].id =
            item.projectProcurementSubVo.negotiation.fileContext || null;
          newItem.purchaseForm.data.negotiation[0].size =
            item.projectProcurementSubVo.negotiation.fileSize || null;
        }

        newItem.contractForm.data.contractName = item
          .projectProcurementContractVo.contractName
          ? item.projectProcurementContractVo.contractName
          : ""; // 合同名称
        newItem.contractForm.data.contractId = item.projectProcurementContractVo
          .contractId
          ? item.projectProcurementContractVo.contractId
          : ""; // 合同id
        newItem.contractForm.data.contractAmount = item
          .projectProcurementContractVo.contractAmount
          ? item.projectProcurementContractVo.contractAmount
          : ""; //合同金额
        newItem.contractForm.data.startTime = item.projectProcurementContractVo
          .startTime
          ? item.projectProcurementContractVo.startTime
          : ""; // 合同开始日期
        newItem.contractForm.data.endTime = item.projectProcurementContractVo
          .endTime
          ? item.projectProcurementContractVo.endTime
          : ""; // 合同结束日期
        newItem.contractForm.data.operationTime = item
          .projectProcurementContractVo.operationTime
          ? item.projectProcurementContractVo.operationTime
          : ""; //运维期限

        // // 合同
        if (item.projectProcurementContractVo.deliveryEntityList.length === 1) {
          newItem.contractForm.data.contractFileList[0].name =
            item.projectProcurementContractVo.deliveryEntityList[0].fileName;
          newItem.contractForm.data.contractFileList[0].id =
            item.projectProcurementContractVo.deliveryEntityList[0].fileContext;
          newItem.contractForm.data.contractFileList[0].size =
            item.projectProcurementContractVo.deliveryEntityList[0].fileSize;
        } else if (
          item.projectProcurementContractVo.deliveryEntityList == null
        ) {
          newItem.contractForm.data.contractFileList = [];
        } else {
          newItem.contractForm.data.contractFileList = [];
          item.projectProcurementContractVo.deliveryEntityList.map((c) => {
            newItem.contractForm.data.contractFileList.push({
              name: c.fileName,
              id: c.fileContext,
              size: c.fileSize,
            });
          });
        }
      }
      return newItem;
    },
    // 回显数据
    preview() {
      api_previewProjectPurch({ projectId: this.projectId }).then((res) => {
        if (res.msg.code == "0000") {
          this.result = [];
          res.data.forEach((item) => {
            this.result.push(this.operationData(item));
          });
        }
      });
    },

    // 标段下付款信息添加
    saveCallBack(cbObject) {
      const { data, index } = cbObject;
      this.result[index].paymentTableData.push(data);
    },
    // 开始时间选择
    startTimeChange(time, index) {
      // 合同开始时间为空时
      if (
        this.result[index].contractForm.data.endTime !== "" ||
        this.result[index].contractForm.data.endTime !== null
      ) {
        // 如果选择开始时间时，结束时间有值，且开始时间大于结束时间，那么便提示合同开始日期不能大于结束日期
        if (
          this.result[index].contractForm.data.endTime <
          this.result[index].contractForm.data.startTime
        ) {
          this.$message.warning("合同开始日期不能大于结束日期");
          this.result[index].contractForm.data.startTime = null;
        }
        if (
          this.result[index].contractForm.data.startTime === null ||
          this.result[index].contractForm.data.startTime === ""
        ) {
          this.result[index].contractForm.data.endTime === null;
        }
      } else {
        this.result[index].contractForm.data.startTime === time;
      }
    },
    // 结束时间选择
    endTimeChange(time, index) {
      if (
        this.result[index].contractForm.data.startTime === "" ||
        this.result[index].contractForm.data.startTime === null
      ) {
        this.$message.warning("请先选择该标段合同开始日期");
        this.result[index].contractForm.data.endTime = null;
      } else {
        this.result[index].contractForm.data.endTime = time;
      }
    },
    // 新增付款节点
    addTableItem(index) {
      let totalScale = this.result[index].paymentTableData.reduce(
        (pre, cur) => {
          return pre + Number(cur.scale);
        },
        0
      );
      let totalAmount = this.result[index].paymentTableData.reduce(
        (pre, cur) => {
          return pre + Number(cur.amount);
        },
        0
      );
      if (totalScale == 100) {
        this.$notify({
          title: "提示",
          type: "warning",
          dangerouslyUseHTMLString: true,
          message: `
          <div>当前标段下付款比例已经为 <span style="color: #1890FF;font-weight: bold;margin-left: 8px;">100%</span></div>
          <div style="color: #fa2">请重新分配付款比例后再新增付款节点</div>`,
          duration: 0,
        });
      } else if (this.result[index].contractForm.data.contractAmount == "") {
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
        totalAmount == this.result[index].contractForm.data.contractAmount &&
        this.result[index].contractForm.data.contractAmount !== ""
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
            index,
            this.result[index].paymentTableData,
            this.result[index].contractForm.data.contractAmount
          );
        });
      }
    },

    numValid(value, index) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value) == false) {
        this.$message({
          type: "warning",
          message: "最大支持小数点后六位",
        });
        this.result[index].contractForm.data.contractAmount = "";
      } else {
        this.result[index].contractForm.data.contractAmount = value;
        let totalAmount = this.result[index].paymentTableData.reduce(
          (pre, cur) => {
            return pre + Number(cur.amount);
          },
          0
        );
        if (totalAmount !== 0 && value > totalAmount) {
          this.$nextTick(() => {
            this.$refs.computedDiaLog.open(index);
          });
        }
      }
    },

    numValid2(value, index) {
      var reg = /^(\d{1,8}(\.\d{0,2})?)?$/;
      if (reg.test(value) == false) {
        this.result[index].contractForm.data.operationTime = "";
      } else {
        this.result[index].contractForm.data.operationTime = value;
      }
    },

    // 标段名称添加子节点
    addRows() {
      let row = {
        basicForm: {
          name: "标段", //标段名称
        },
        // 采购form
        purchaseForm: {
          otherConfig: {
            labelNum: 140,
          },
          config: [
            {
              type: "slot",
              slotName: "deliveryType",
              collapseTags: true,
              name: "采购类型",
              required: "请选择采购类型",
              placeholder: "请选择",
              bind: "deliveryType",
              trigger: "change",
              col: 12,
            },
            {
              type: "slot",
              slotName: "successfulBuid",
              collapseTags: true,
              name: "中标单位",
              required: "请输入中标单位",
              placeholder: "请输入",
              bind: "successfulBuid",
              trigger: "blur",
              col: 12,
            },
            {
              type: "dateSelect",
              timeType: "date",
              name: "公告挂网时间",
              placeholder: "请选择",
              bind: "adInternetTime",
              required: "请选择公告挂网时间",
              format: "yyyy-MM-dd",
              col: 12,
            },
            {
              type: "dateSelect",
              timeType: "date",
              name: "开标时间",
              placeholder: "请选择",
              bind: "successfulTime",
              required: "请选择开标时间",
              format: "yyyy-MM-dd",
              col: 12,
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
              tipPopover: true,
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
              tipPopover: true,
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
              tipPopover: true,
              col: 24,
            },
          ],
          data: {
            deliveryType: 0, // 采购类型
            successfulBuid: "", //中标单位
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
              type: "slot",
              slotName: "contractName",
              collapseTags: true,
              name: "合同名称",
              required: "请输入合同名称",
              placeholder: "请输入",
              bind: "contractName",
              trigger: "blur",
              col: 24,
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
              col: 12,
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
              col: 12,
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
              col: 12,
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
              col: 12,
            },
            {
              type: "upload",
              name: "合同",
              bind: "contractFileList",
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
          ],
          data: {
            contractName: "", // 合同名称
            contractId: "", // 合同id
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
      };

      this.result.push(row);
    },

    // 删除标段
    delRows(index) {
      this.$confirm(
        `此操作将移除  标段${index + 1}  下的所有信息, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定移除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.result.splice(index, 1);
          this.$message({
            type: "success",
            message: `标段${index + 1} 已移除`,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 采购类型切换
    deliveryTypeChange(index, e) {
      if (this.result[index].purchaseForm.data.deliveryType === 0) {
        // 公开采购
        this.isPublic = true;
        this.result[index].purchaseForm.config = purchaseConfig1;
      } else {
        // 协同采购
        this.isPublic = false;
        this.result[index].purchaseForm.config = purchaseConfig2;
      }
    },

    // 付款信息删除
    deleteItem(rowIndex, index) {
      this.result[index].paymentTableData.splice(rowIndex, 1);
    },
    // 保存方法
    saveFunc() {
      this.checkForm("save");
    },
    // 提交方法
    tjFunc() {
      this.checkForm("tj");
    },

    // 判断合同名称是否有重复
    isRepeat(arr) {
      var hash = {};
      for (var i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },

    getSize(size) {
      if (typeof size == "string") return size;
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },

    // 表单校验
    checkForm(saveType) {
      if (saveType == "save") {
        // 保存不校验
        let contractNameArr = []; // 存放合同名称的数据集合
        this.result.map((item) => {
          if (item.contractForm.data.contractName !== "") {
            contractNameArr.push(item.contractForm.data.contractName);
          }
        });
        let flag = this.isRepeat(contractNameArr);
        if (flag) {
          // 合同名称有重复
          this.$message.warning("合同名称有重复, 请修改后再次提交");
          return false;
        }
        this.saveFinal(saveType);
      } else {
        // 提交校验
        let newPromise = [];
        let self = this;
        for (var i = 0; i < this.result.length; i++) {
          newPromise[i] = new Promise((resolve, reject) => {
            if (
              this.$refs[`purchaseForm${i + 1}`] &&
              this.$refs[`purchaseForm${i + 1}`].length > 0 &&
              this.$refs[`contractForm${i + 1}`] &&
              this.$refs[`contractForm${i + 1}`].length > 0
            ) {
              let validate1 = this.$refs[`contractForm${i + 1}`][0].validate();
              let validate2 = this.$refs[`purchaseForm${i + 1}`][0].validate();
              if (validate1 && validate2) {
                resolve();
              } else {
                reject();
              }
            }
          });
        }

        Promise.all(newPromise).then(() => {
          let contractNameArr = []; // 存放合同名称的数据集合
          self.result.map((item) => {
            contractNameArr.push(item.contractForm.data.contractName);
          });
          let flag = this.isRepeat(contractNameArr);
          if (flag) {
            // 合同名称有重复
            this.$message.warning("合同名称有重复, 请修改后再次提交");
            return false;
          }
          this.saveFinal(saveType);
        });
      }
    },
    // 最终提交
    saveFinal(saveType) {
      // 保存 | 提交
      let sectionSorts = [];
      let projectContractEntities = []; // 合同采购信息
      let projectPaymentInfoEntities = []; // 付款信息
      let deliverys = []; //交付物信息

      this.result.forEach((item, index) => {
        if (index > this.result.length - 1) return;
        sectionSorts.push(index + 1);
        projectContractEntities.push({
          deliveryType: item.purchaseForm.data.deliveryType, //采购类型
          successfulBuid: item.purchaseForm.data.successfulBuid, // 中标单位
          togetherProcurementTime:
            item.purchaseForm.data.togetherProcurementTime,
          adInternetTime: item.purchaseForm.data.adInternetTime, // 广告挂网时间
          successfulTime: item.purchaseForm.data.successfulTime, // 开标时间
          contractName: item.contractForm.data.contractName, // 合同名称
          contractAmount: item.contractForm.data.contractAmount, // 合同金额
          startTime: item.contractForm.data.startTime, // 合同开始时间
          endTime: item.contractForm.data.endTime, // 合同建设期结束日期
          operationTime: item.contractForm.data.operationTime, // 运维期限
          isSection: 0,
          sectionSort: index + 1,
          projectId: this.projectId,
          contractId: item.contractForm.data.contractId,
        });

        if (
          item.purchaseForm.data.decisionDocument &&
          item.purchaseForm.data.decisionDocument.length > 0
        ) {
          deliverys.push({
            fileContext: item.purchaseForm.data.decisionDocument[0].id,
            fileName: item.purchaseForm.data.decisionDocument[0].name,
            fileSize: this.getSize(
              item.purchaseForm.data.decisionDocument[0].size
            ),
            isMustUpload: 1,
            isSection: 0,
            name: "公司决策文件",
            isContractDelivery: 1,
            projectId: this.projectId,
            sectionSort: index + 1,
          });
        }

        if (
          item.purchaseForm.data.negotiation &&
          item.purchaseForm.data.negotiation.length > 0
        ) {
          deliverys.push({
            fileContext: item.purchaseForm.data.negotiation[0].id,
            fileName: item.purchaseForm.data.negotiation[0].name,
            fileSize: this.getSize(item.purchaseForm.data.negotiation[0].size),
            isMustUpload: 1,
            isSection: 0,
            name: "谈判纪要",
            isContractDelivery: 1,
            projectId: this.projectId,
            sectionSort: index + 1,
          });
        }

        if (
          item.purchaseForm.data.tenderFileList &&
          item.purchaseForm.data.tenderFileList.length > 0
        ) {
          deliverys.push({
            fileContext: item.purchaseForm.data.tenderFileList[0].id,
            fileName: item.purchaseForm.data.tenderFileList[0].name,
            fileSize: this.getSize(
              item.purchaseForm.data.tenderFileList[0].size
            ),
            isMustUpload: 1,
            isSection: 0,
            name: "招标文件",
            isContractDelivery: 1,
            projectId: this.projectId,
            sectionSort: index + 1,
          });
        }

        if (
          item.purchaseForm.data.bidFileList &&
          item.purchaseForm.data.bidFileList.length > 0
        ) {
          deliverys.push({
            fileContext: item.purchaseForm.data.bidFileList[0].id,
            fileName: item.purchaseForm.data.bidFileList[0].name,
            fileSize: this.getSize(item.purchaseForm.data.bidFileList[0].size),
            isMustUpload: 1,
            isSection: 0,
            name: "投标文件",
            isContractDelivery: 1,
            projectId: this.projectId,
            sectionSort: index + 1,
          });
        }
        if (
          item.purchaseForm.data.bidNotice &&
          item.purchaseForm.data.bidNotice.length > 0
        ) {
          deliverys.push({
            fileContext: item.purchaseForm.data.bidNotice[0].id,
            fileName: item.purchaseForm.data.bidNotice[0].name,
            fileSize: this.getSize(item.purchaseForm.data.bidNotice[0].size),
            isMustUpload: 1,
            isSection: 0,
            name: "中标通知书",
            isContractDelivery: 1,
            projectId: this.projectId,
            sectionSort: index + 1,
          });
        }

        if (item.contractForm.data.contractFileList.length == 1) {
          deliverys.push({
            fileContext: item.contractForm.data.contractFileList[0].id,
            fileName: item.contractForm.data.contractFileList[0].name,
            fileSize: this.getSize(
              item.contractForm.data.contractFileList[0].size
            ),
            isMustUpload: 1,
            isSection: 0,
            name: "合同",
            isContractDelivery: 0,
            projectId: this.projectId,
            sectionSort: index + 1,
          });
        } else {
          item.contractForm.data.contractFileList.map((c) => {
            deliverys.push({
              fileContext: c.id,
              fileName: c.name,
              fileSize: this.getSize(c.size),
              isMustUpload: 1,
              isSection: 0,
              name: "合同",
              isContractDelivery: 0,
              projectId: this.projectId,
              sectionSort: index + 1,
            });
          });
        }

        // 付款table
        item.paymentTableData.map((cItem) => {
          projectPaymentInfoEntities.push({
            ...cItem,
            isSection: 0,
            projectId: this.projectId,
            sectionSort: index + 1,
          });
        });
      });

      // tenderFileList 招标文件
      // bidFileList 投标文件
      // bidNotice 中标通知书

      let payLoad = {
        projectContractEntities,
        projectId: this.projectId,
        isSection: 0,
        projectPaymentInfoEntities,
        deliverys,
        sectionSorts,
        isCommit: saveType == "tj" ? 0 : 1,
      };
      api_saveProjectPurch(payLoad).then((res) => {
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
  },
};
</script>
<style lang="scss" scoped>
@media (min-width: 1366px) {
  .page-container {
    width: 100%;
  }
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

.append-input {
  width: 119% !important;
}

.item {
  margin-bottom: 30px;
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

.append-input {
  width: 90%;
  margin-right: 2%;
}

.mr-3 {
  margin-right: 3px;
}

.table-container {
  padding-left: 15px;
  margin-bottom: 50px;
}

.danger-text-btn {
  color: #f56c6c;
}

.add-btn {
  border: 1px dashed #1890ff;
  color: #1890ff;
  border-radius: 50% !important;
}

.add-btn2 {
  border: 1px dashed #1890ff;
  color: #1890ff;
}

.minus-btn {
  border: 1px dashed #f56c6c;
  color: #f56c6c;
  border-radius: 50% !important;
  &:hover {
    border: 1px dashed #f56c6c;
  }
}
</style>
