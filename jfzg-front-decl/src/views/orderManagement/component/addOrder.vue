<template>
  <div>
    <div class="orderTitle">
      <div class="orderBorder"></div>
      <span>订单信息</span>
    </div>
    <!-- form -->
    <div class="orderForm">
      <el-form
        :model="orderData"
        :rules="formRules"
        ref="orderForm"
        label-width="120px"
        class="demo-orderForm"
      >
        <el-row>
          <el-col :span="8">
            <div>
              <el-form-item
                label="服务名称:"
                prop="serveName"
                style="width: 90%"
                class="sys"
              >
                <el-input
                  v-model="orderData.serviceName"
                  placeholder="请输入订单名称"
                  style="width: 100%"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item
                label="招标单位:"
                prop="winningBidder"
                style="width: 90%"
                class="sys"
              >
                <el-input
                  v-model="orderData.winningBidder"
                  placeholder="招标单位"
                  style="width: 100%"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item
                label="框架合同:"
                prop="frameworkContracts"
                style="width: 90%"
                class="sys"
                v-if="$route.query.edit == 0"
              >
                <el-input
                  v-model="orderData.frameworkContracts"
                  placeholder="请输入框架合同"
                  style="width: 100%"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-else
                label="框架合同:"
                prop="frameworkContract"
                style="width: 90%"
                class="sys"
              >
                <el-input
                  v-model="orderData.frameworkContract"
                  placeholder="请输入框架合同"
                  style="width: 100%"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>
              <el-form-item
                label="订单名称:"
                prop="orderName"
                style="width: 90%"
                class="serviceNameClass"
              >
                <el-input
                  v-model="orderData.orderName"
                  placeholder="请输入订单名称"
                  style="width: 100%"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 3 }"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item
                label="订单签订时间:"
                prop="signingTime"
                style="width: 98%"
                class="sys"
              >
                <el-date-picker
                  v-if="$route.query.edit == 0"
                  v-model="orderData.signingTime"
                  :align="right"
                  type="date"
                  placeholder="请选择订单签订时间"
                  value-format="yyyy-MM-dd"
                  :picker-options="editTimeOPtion"
                >
                </el-date-picker>
                <el-date-picker
                  v-else
                  v-model="orderData.signingTime"
                  :align="right"
                  type="date"
                  placeholder="请选择订单签订时间"
                  value-format="yyyy-MM-dd"
                  :picker-options="expireTimeOPtion"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item
                label="订单金额:"
                prop="orderAmount"
                style="width: 90%"
                class="sys"
              >
                <el-input
                  v-model="orderData.orderAmount"
                  placeholder="请输入订单金额"
                  style="width: 90% !important"
                  @input="numValid3(orderData.orderAmount)"
                ></el-input
                >万元
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>
              <el-form-item
                label="关联项目:"
                prop="projectId"
                style="width: 90%"
                class="sys"
              >
                <!--                   filterable
                  :filter-method="handleInput" -->
                <el-select
                  v-model="orderData.projectId"
                  filterable
                  :filter-method="handleInput"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in orderEnum.options"
                    :key="item.projectId"
                    :label="item.projectName"
                    :value="item.projectId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <SrAdd
        :config="orderFiles.config"
        :otherConfig="orderFiles.otherConfig"
        :form="orderFiles.data"
        ref="orderFiles"
        class="add"
      ></SrAdd>
    </div>
    <div>
      <div class="addNodeClass">
        <div class="orderTable">
          <span> 付款节点: </span>
          <el-table
            class="formTable"
            :data="tableData"
            :border="true"
            style="width: 90%; margin-left: 12px"
            :header-cell-style="{
              color: '#000',
              backgroundColor: 'rgb(240, 240, 240)',
            }"
          >
            <el-table-column type="index" label="序号" width="60">
            </el-table-column>
            <el-table-column label="付款点描述">
              <template slot-scope="scope">
                <div v-if="scope.row.paymentDescription">
                  <el-tooltip
                    :content="scope.row.paymentDescription"
                    placement="top-start"
                    effect="light"
                  >
                    <div class="texts">
                      {{ scope.row.paymentDescription }}
                    </div>
                  </el-tooltip>
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="paymentProportion"
              label="付款点比例%"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="paymentAmount"
              label="付款点金额(万元)"
              width="140"
            >
            </el-table-column>
            <el-table-column
              prop="actualPaymentAmount"
              label="实际付款金额(万元)"
              width="160"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.actualPaymentAmount">
                  {{ scope.row.actualPaymentAmount }}
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="付款状态" 
            width="100">
              <template slot-scope="scope">
                {{
                  scope.row.paymentStatus == "1"
                    ? "已支付"
                    : scope.row.paymentStatus == "2"
                    ? "未支付"
                    : "-"
                }}
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <div v-if="scope.row.notes">
                  <el-tooltip
                    :content="scope.row.notes"
                    placement="top-start"
                    effect="light"
                  >
                    <div class="texts">
                      {{ scope.row.notes }}
                    </div>
                  </el-tooltip>
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column min-width="60" label="操作" >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="large"
                  @click="editNode(scope.row, scope.$index)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="large"
                  @click="deleteNode(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="addBtn">
          <el-button type="primary" size="small" @click="addTableNode"
            >新增付款节点</el-button
          >
        </div>
      </div>
    </div>
    <div class="btns">
      <!-- <el-button
        v-if="$route.query.edit != 0"
        type="primary"
        size="small"
        @click="allInAdd"
        >继续新增</el-button
      > -->
      <el-button type="primary" size="small" @click="saveOrder">暂存</el-button>
      <el-button type="success" size="small" @click="tjOrder">提交</el-button>
      <el-button type="info" size="small" @click="returnList"
        >返回列表</el-button
      >
    </div>
    <!-- 新增付款节点弹窗 -->
    <el-dialog title="新增付款节点" :visible.sync="nodeDialog">
      <el-form
        :model="paymentPointDtoList"
        ref="paymentPointDtoListref"
        :rules="addNodeFormRules"
      >
        <el-form-item
          label="付款点描述:"
          label-width="120px"
          prop="paymentDescription"
        >
          <el-input
            v-model="paymentPointDtoList.paymentDescription"
            style="width: 92% !important"
            autocomplete="off"
            placeholder="请输入付款点描述"
            type="textarea"
            class="serviceNameClass"
            :autosize="{ minRows: 1, maxRows: 3 }"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="付款点比例:"
          label-width="120px"
          prop="paymentProportion"
        >
          <el-input
            v-model="paymentPointDtoList.paymentProportion"
            style="width: 92% !important"
            autocomplete="off"
            placeholder="请输入付款点比例"
            @input="percentValid(paymentPointDtoList.paymentProportion)"
          ></el-input
          >%
        </el-form-item>
        <el-form-item
          label="付款点金额:"
          label-width="120px"
          prop="paymentAmount"
        >
          <el-input
            v-model="paymentPointDtoList.paymentAmount"
            style="width: 92% !important"
            autocomplete="off"
            placeholder="请输入付款点金额"
            @input="numValid(paymentPointDtoList.paymentAmount)"
          ></el-input
          >万元
        </el-form-item>
        <el-form-item label="实际付款金额:" label-width="120px">
          <el-input
            v-model="paymentPointDtoList.actualPaymentAmount"
            style="width: 92% !important"
            autocomplete="off"
            placeholder="请输入实际付款金额"
            @input="numValid2(paymentPointDtoList.actualPaymentAmount)"
          ></el-input
          >万元
        </el-form-item>
        <el-form-item label="付款状态:" label-width="120px">
          <el-select
            v-model="paymentPointDtoList.paymentStatus"
            style="width: 92% !important"
            placeholder="请选择付款状态"
            clearable
            @change="paymentStatusChange"
          >
            <el-option
              v-for="item in enumOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" label-width="120px" prop="notes">
          <el-input
            v-model="paymentPointDtoList.notes"
            style="width: 92% !important"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao" size="small">取 消</el-button>
        <el-button type="primary" @click="addFormH" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from "@/utils/debounce";
import store from "@/store";
import upload from "@/utils/upload";
import config from "@/settings.js";
import {
  api_getOrderDetail,
  api_selectProject,
  api_addOrder,
  api_getDetail,
} from "@/api/orderManagement/index.js";

export default {
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      uploadFileUrl: config.uploadFileUrl,
      previewUrl: config.previewUrl,
    };
  },
  computed: {
    // 新建，编辑订单
    contractId() {
      return this.$route.query ? this.$route.query.serviceId : "";
    },
    contractName() {
      return this.$route.query ? this.$route.query.frameworkContract : "";
    },
    serviceId() {
      return this.$route.query ? this.$route.query.serviceId : "";
    },
    expireTimeOPtion() {
      let _this = this;
      return {
        disabledDate(time) {
          let isDis =
            time.getTime() < new Date(_this.$route.query.startTime).getTime();
          let afterDis =
            time.getTime() > new Date(_this.$route.query.endTime).getTime();
          return isDis || afterDis;
        },
      };
    },
  },
  // watch: {
  //   "paymentPointDtoList.actualPaymentAmount": {
  //     handler(val) {
  //       if(val != '') {
  //         this.paymentPointDtoList.paymentStatus = '1'
  //       }else {
  //         this.paymentPointDtoList.paymentStatus = '2'
  //       }
  //     },
  //     immediate: true
  //   },
  // },
  data() {
    return {
      userInfo: store.getters.userInfo,
      roleCode: store.getters.userInfo.currentRole.roleCode,
      // 订单信息
      orderData: {
        orderName: "",
        signingTime: "",
        orderAmount: "",
        projectId: "",
        projectName: "",
        serviceName: "",
        frameworkContract: "",
        frameworkContracts: "",
        winningBidder: "",
      },
      orderFiles: {
        otherConfig: {
          labelNum: 115,
        },
        config: [
          {
            type: "upload",
            name: "订单附件",
            bind: "orderFile",
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
            bind: "otherFile",
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
        ],
        data: {
          orderFile: [], // 合同
          otherFile: [], // 其他
        },
      },
      // 类型枚举
      orderEnum: {
        options: [],
      },
      formRules: {
        orderName: [
          { required: true, message: "请输入订单名称", trigger: "blur" },
        ],
        signingTime: [
          { required: true, message: "请选择订单签订日期", trigger: "blur" },
        ],
        orderAmount: [
          { required: true, message: "请输入订单金额", trigger: "blur" },
        ],
        projectId: [
          { required: true, message: "请选择关联项目", trigger: "blur" },
        ],
      },
      // 新增付款节点
      tableData: [],
      // 新增付款节点弹窗
      nodeDialog: false,
      enumOptions: [
        {
          label: "未支付",
          value: "2",
        },
        {
          label: "已支付",
          value: "1",
        },
      ],
      // 付款信息
      paymentPointDtoList: {
        paymentDescription: "",
        paymentProportion: "",
        paymentAmount: "",
        actualPaymentAmount: "",
        paymentStatus: "",
        notes: "",
      },
      addNodeFormRules: {
        paymentProportion: [
          { required: true, message: "请输入付款比例", trigger: "blur" },
        ],
        paymentAmount: [
          { required: true, message: "请输入付款金额", trigger: "blur" },
        ],
        actualPaymentAmount: [
          { required: true, message: "请输入实际付款金额", trigger: "blur" },
        ],
        paymentStatus: [
          { required: true, message: "请输入付款点状态", trigger: "blur" },
        ],
      },
      // 编辑时订单时间限制
      orderStartTime: "",
      orderEndTime: "",
      editTimeOPtion: {
        disabledDate: this.disabledDate,
      },
      // 订单金额判断
      orderAmountstr: "",
      selectParams: {
        projectName: "",
      },
      // 编辑付款节点
      editPointDtoList: {
        paymentDescription: "",
        paymentProportion: "",
        paymentAmount: "",
        actualPaymentAmount: "",
        paymentStatus: "",
        notes: "",
      },
      // 编辑节点Id
      editNodeId: null,
    };
  },
  mounted() {
    this.handleInput("");
    // 新增订单
    if (this.$route.query.serviceId && this.$route.query.new == "0") {
      this.getDetail(this.$route.query.serviceId);
    }
    // 编辑订单
    if (this.$route.query.orderId && this.$route.query.edit == "0") {
      this.getorderDetail(this.$route.query.orderId);
      this.getDetail(this.$route.query.serviceId);
    }
  },
  methods: {
    changeTime(time) {
      var date = new Date(time);
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
    // 编辑时间校验
    disabledDate(time) {
      let isDis = time.getTime() < new Date(this.orderStartTime).getTime();
      let afterDis = time.getTime() > new Date(this.orderEndTime).getTime();
      return isDis || afterDis;
    },
    handleInput(val) {
      this.selectParams.projectName = val;
      api_selectProject(this.selectParams).then((res) => {
        if (res.data) {
          this.orderEnum.options = res.data;
        }
      });
    },
    getDetail(ids) {
      api_getDetail({ id: ids, type: "2" }).then((res) => {
        if (res.data) {
          this.orderEndTime = res.data.endTime;
          this.orderStartTime = res.data.startTime;
          // 合同剩余
          this.orderAmountstr = res.data.contractAmountLast;
          this.orderData.frameworkContract = res.data.frameworkContract;
          this.orderData.frameworkContracts = res.data.frameworkContract;
          this.orderData.serviceName = res.data.serviceName;
          this.orderData.winningBidder = res.data.winningBidder;
          if (res.data.detailVoList.length > 0) {
            Object.keys(res.data.detailVoList[0]).forEach((item) => {
              if (res.data.detailVoList[0][item]) {
                this.orderData[item] = res.data.detailVoList[0][item];
              }
            });
            this.tableData = res.data.detailVoList[0].paymentPointDtoList;
            if (res.data.detailVoList && res.data.detailVoList[0].signingTime) {
              this.orderData.signingTime = this.changeTime(
                res.data.detailVoList[0].signingTime
              );
            }
            if (res.data.detailVoList && res.data.detailVoList[0].orderFile) {
              this.orderFiles.data.orderFile = JSON.parse(
                res.data.detailVoList[0].orderFile
              );
            }
            if (res.data.detailVoList && res.data.detailVoList[0].otherFile) {
              this.orderFiles.data.otherFile = JSON.parse(
                res.data.detailVoList[0].otherFile
              );
            }
          }
        }
      });
    },
    getorderDetail(ids) {
      api_getOrderDetail({ id: ids }).then((res) => {
        if (res.data) {
          this.orderData.frameworkContract = res.data.frameworkContract;
          this.orderData.serviceName = res.data.serviceName;
          this.orderData.winningBidder = res.data.winningBidder;
          this.orderAmountstr = res.data.contractAmountLast;
          Object.keys(res.data).forEach((item) => {
            if (res.data[item]) {
              this.orderData[item] = res.data[item];
            }
          });
          this.tableData = res.data.paymentPointDtoList;
          if (res.data.signingTime) {
            this.orderData.signingTime = this.changeTime(res.data.signingTime);
          }
          if (res.data.orderFile) {
            this.orderFiles.data.orderFile = JSON.parse(res.data.orderFile);
          }
          if (res.data.otherFile) {
            this.orderFiles.data.otherFile = JSON.parse(res.data.otherFile);
          }
        }
      });
    },
    // 比例
    percentValid(value) {
      if (Number(value)) {
        if (value > 100) {
          this.$message({
            type: "warning",
            message: "付款点比例不能超过100%",
          });
          this.paymentPointDtoList.paymentProportion = "";
        } else {
          this.paymentPointDtoList.paymentAmount = parseFloat(
            ((this.orderData.orderAmount * value) / 100).toFixed(6)
          );
          this.paymentPointDtoList.paymentProportion = value;
          // 付款点金额 < 实际付款金额
          if (
            this.paymentPointDtoList.paymentAmount <
            this.paymentPointDtoList.actualPaymentAmount
          ) {
            this.$message({
              type: "warning",
              message: "实际付款金额不能大于付款点金额",
            });
            this.paymentPointDtoList.actualPaymentAmount = "";
          }
        }
      } else {
        this.$message({
          type: "warning",
          message: "付款节点请输入数字",
        });
        this.paymentPointDtoList.paymentProportion = "";
      }
    },
    // 金额
    numValid(value, index) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value) == false) {
        this.$message({
          type: "warning",
          message: "最大支持小数点后六位",
        });
        this.paymentPointDtoList.paymentAmount = "";
      } else {
        this.paymentPointDtoList.paymentAmount = value;
      }
    },
    numValid2(value, index) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value) == false) {
        this.$message({
          type: "warning",
          message: "最大支持小数点后六位",
        });
        this.paymentPointDtoList.actualPaymentAmount = "";
      } else {
        // paymentAmount付款点金额
        if (value > this.paymentPointDtoList.paymentAmount) {
          this.$message.warning("实际付款金额不能大于付款点金额");
          this.paymentPointDtoList.actualPaymentAmount = "";
        } else {
          this.paymentPointDtoList.actualPaymentAmount = value;
        }
      }
    },
    setNumber(value1) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value1) == false) {
        this.$message({
          type: "warning",
          message: "最大支持小数点后六位",
        });
        this.orderData.orderAmount = "";
      } else {
        this.orderData.orderAmount = value1;
      }
    },
    numValid3(value, index) {
      if (["", null, "null"].includes(this.orderAmountstr)) {
        this.setNumber(value);
      } else if (Number(this.orderAmountstr) >= Number(value)) {
        this.setNumber(value);
      } else {
        this.$message.warning("订单金额不能大于该合同的剩余金额");
        this.orderData.orderAmount = "";
      }
    },
    addTableNode() {
      this.nodeDialog = true;
    },
    quxiao() {
      this.nodeDialog = false;
    },
    // 新增付款节点弹窗
    paymentStatusChange(val) {
      if (
        val == "1" &&
        (this.paymentPointDtoList.actualPaymentAmount == "" ||
          this.paymentPointDtoList.actualPaymentAmount == 0)
      ) {
        this.paymentPointDtoList.paymentStatus = "";
        this.$message.warning("实际付款金额为零或者为空,不能选择已支付");
      }
    },
    addFormH() {
      this.$refs["paymentPointDtoListref"].validate((valid) => {
        if (valid) {
          let obj = Object.assign({}, this.paymentPointDtoList);
          if (obj.type === "edit") {
            this.tableData.splice(obj.index, 1, obj);
          } else {
            this.paymentPointDtoList = {
              paymentDescription: "",
              paymentProportion: "",
              paymentAmount: "",
              actualPaymentAmount: "",
              paymentStatus: "",
              notes: "",
            };
            this.tableData.push(obj);
          }

          const validateAndWarn = (condition, message) => {
            if (condition) {
              this.$message.warning(message);
              if (obj.type !== "edit") {
                this.tableData.pop();
              }
              return true;
            }
            return false;
          };

          const totalPaymentProportion = this.tableData.reduce(
            (acc, cur) => acc + Number(cur.paymentProportion),
            0
          );
          const totalActualPaymentAmount = this.tableData.reduce(
            (sum, item) => sum + Number(item.actualPaymentAmount),
            0
          );
          const totalPaymentAmount = this.tableData.reduce(
            (sum, item) => sum + Number(item.paymentAmount),
            0
          );

          if (
            validateAndWarn(
              totalPaymentProportion > 100,
              "付款比例总和不能超过100%"
            )
          )
            return;
          if (
            validateAndWarn(
              totalActualPaymentAmount > this.orderData.orderAmount,
              "实际付款金额不能超过订单总金额"
            )
          )
            return;
          if (
            validateAndWarn(
              totalPaymentAmount > this.orderData.orderAmount,
              "付款金额不能超过订单总金额"
            )
          )
            return;

          this.$refs["paymentPointDtoListref"].resetFields();
          this.nodeDialog = false;
          this.paymentPointDtoList = {
            paymentDescription: "",
            paymentProportion: "",
            paymentAmount: "",
            actualPaymentAmount: "",
            paymentStatus: "",
            notes: "",
          };
        }
      });
    },
    // 编辑付款节点
    editNode(value, index) {
      this.nodeDialog = true;
      value.index = index;
      this.editNodeId = null;
      this.editNodeId = index;
      value.type = "edit";
      this.paymentPointDtoList = Object.assign({}, value);
    },

    // 判断钱数
    valAmount(sub) {
      // 计算实际付款金额和付款金额
      let amounts = 0;
      let paymentamounts = 0;

      if (this.tableData.length > 0) {
        amounts = this.tableData.reduce(
          (item, ele) => item + Number(ele.actualPaymentAmount),
          0
        );
        paymentamounts = this.tableData.reduce(
          (item, ele) => item + Number(ele.paymentAmount),
          0
        );
      }

      const orderAmount = Number(this.orderData.orderAmount);
      const orderAmountstr = Number(this.orderAmountstr);

      // 验证实际付款金额和付款金额是否超过订单总金额
      if (amounts > orderAmount) {
        this.$message.warning("实际付款金额不能超过订单总金额");
      } else if (paymentamounts > orderAmount) {
        this.$message.warning("付款金额不能超过订单总金额");
      } else if (orderAmountstr < orderAmount) {
        this.$message.warning("订单金额不能大于该合同的剩余金额");
        this.orderData.orderAmount = "";
      } else {
        this.subMit("tj", sub);
      }
    },

    // 继续新增
    allInAdd() {
      this.valAmount("allIn");
    },
    getSize(size) {
      if (typeof size == "string") return size;
      let size1 = (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    },
    // 暂存订单
    saveOrder() {
      this.subMit("save", "no");
    },
    // 提交订单
    tjOrder() {
      this.valAmount("no");
    },
    subMit: debounce(function (save, addIn) {
      let obj = Object.assign({}, this.orderData);

      if (!this.$route.query.orderId) {
        obj.contractId = this.contractId;
        obj.serviceId = Number(this.serviceId);
        obj.contractName = this.contractName;
      }
      obj.status = save == "tj" ? 1 : 0;
      let arr = [];
      let paymentPointDtoList = arr.concat(this.tableData);
      obj.paymentPointDtoList = paymentPointDtoList;
      this.orderEnum.options.forEach((item) => {
        if (item.projectId == obj.projectId) {
          obj.projectName = item.projectName;
          obj.contactId = item.contactId;
          obj.contactName = item.contactName;
        }
      });
      obj.orderFile = JSON.stringify(this.orderFiles.data.orderFile);
      obj.otherFile = JSON.stringify(this.orderFiles.data.otherFile);

      if (save == "tj") {
        obj.id = obj.id ? obj.id : null;
        let params = [];
        // 提交校验
        let val = this.$refs["orderFiles"].validate();
        this.$refs["orderForm"].validate((valid) => {
          if (valid && val) {
            params.push(obj);
            api_addOrder(params).then((res) => {
              if (res.msg.code == "0000") {
                this.orderAmountstr = res.data.contractAmountLast
                  ? res.data.contractAmountLast
                  : 0;
                if (addIn != "allIn") {
                  this.$message({
                    type: "success",
                    message: "提交订单成功!",
                  });
                  this.$router.push({
                    name: "orderManagement",
                  });
                } else {
                  if (!["", null, "null"].includes(res.data.errMsg)) {
                    this.$message({
                      type: "error",
                      message: res.data.errMsg,
                    });
                  } else {
                    // 重复新增
                    this.$message({
                      type: "success",
                      message: "继续新增订单成功!",
                    });
                  }
                }
              } else {
                this.$message({
                  type: "error",
                  message: "提交订单失败!",
                });
              }
            });
          }
        });
      } else {
        let saveParams = [];
        saveParams.push(obj);
        obj.id = obj.id ? obj.id : null;
        api_addOrder(saveParams).then((res) => {
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "暂存订单成功!",
            });
            this.$router.push({
              name: "orderManagement",
            });
          } else {
            this.$message({
              type: "error",
              message: res.data,
            });
          }
        });
      }
    }, 1000),

    // 删除表格付款节点
    deleteNode(index) {
      this.tableData.splice(index, 1);
    },
    returnList() {
      this.$router.push({
        name: "orderManagement",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.orderTitle {
  display: flex;
  align-items: center;
  margin: 20px 0 0 15px;
  span {
    font-size: 14px;
    font-weight: bolder;
  }
  .orderBorder {
    width: 4px;
    height: 14px;
    border-radius: 5px;
    background: #0176ff;
    margin: 0 5px;
  }
}
.orderForm {
  margin: 15px 0 10px 0;
}
.addNodeClass {
  padding-bottom: 60px;
  .orderTable {
    display: flex;
    padding: 0px 30px;
  }
  .addBtn {
    margin: 10px 0 0 60px;
  }
}
::v-deep .el-input {
  width: 100% !important;
}
::v-deep .el-form-item {
  width: 98% !important;
}
::v-deep .el-button {
  width: 100px !important;
}
.btns {
  position: fixed;
  bottom: 0;
  width: calc(100% - 181px);
  border-left: 2px solid rgb(230, 230, 230);
  background: #fff;
  z-index: 10;
  right: 0;
  padding: 10px 0;
  text-align: center;
  border-top: 1px solid #e6e6e6;
  // position: fixed;
  // bottom: 20px;
  // right: 40%;
  ::v-deep .el-button {
    margin: 0 15px;
    width: 100px !important;
  }
}
::v-deep .el-select {
  width: 100% !important;
}
::v-deep .el-cascader {
  width: 100% !important;
}
::v-deep .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border-color: #efefef;
  color: black;
  cursor: not-allowed;
}
::v-deep .serviceNameClass .el-input__count {
  height: 20px;
}
::v-deep .serviceNameClass .el-textarea .el-input__count {
  bottom: 12px;
}
.texts {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
