<template>
  <div>
    <div class="content-header">
      <div class="serve">
        <div class="title">
          <div class="border"></div>
          <span>服务信息</span>
        </div>
        <el-form
          :model="contractForms"
          :rules="contractRules"
          ref="contractForms"
          label-width="90px"
        >
          <el-row :span="24">
            <el-col :span="8">
              <el-form-item label="服务类别:" style="width: 100%">
                <el-select
                  v-model="contractForms.serviceType"
                  placeholder="请选择服务类别"
                >
                  <el-option
                    v-for="item in contracterveTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="服务名称:"
                style="width: 100%"
                prop="serviceName"
              >
                <el-input
                class="serviceNameClass"
                  v-model="contractForms.serviceName"
                  :disabled="$route.query.edit == 0"
                  placeholder="请输入服务名称"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 3 }"
                  maxlength="200"
                  show-word-limit
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="8">
              <el-form-item label="创建时间:" style="width: 100%">
                <el-date-picker
                  v-model="contractForms.createTime"
                  :align="right"
                  type="date"
                  placeholder="请选择创建时间"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
      </div>
      <div class="contract page-container">
        <div class="title">
          <div class="border"></div>
          <span>合同信息</span>
        </div>
        <div class="item" v-for="(item, index) in result" :key="index">
          <div style="display: flex">
            <el-button
              v-if="index === result.length - 1"
              style="margin-left: 10px"
              @click="addRows"
              circle
              size="small"
              icon="el-icon-plus"
              class="add-btn"
              :style="{ display: displayAdd }"
              >新增合同信息</el-button
            >
            <el-button
              v-if="index !== 0"
              circle
              style="margin-left: 10px"
              @click="delRows(index)"
              icon="el-icon-minus"
              size="small"
              class="minus-btn"
              >删除合同信息</el-button
            >
          </div>
          <SrAdd
            :config="result[index].contractForm.config"
            :otherConfig="result[index].contractForm.otherConfig"
            :form="result[index].contractForm.data"
            :enums="result[index].contractForm.enum"
            :ref="`contractForm${index + 1}`"
            class="add"
          >
            <!-- 采购类型 下拉选 -->
            <template slot="frameworkContract">
              <el-input
                v-model="result[index].contractForm.data.frameworkContract"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                maxlength="200"
                show-word-limit
              ></el-input>
            </template>
            <template slot="contractCode">
              <el-input
                v-model="result[index].contractForm.data.contractCode"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                maxlength="200"
                show-word-limit
              ></el-input>
            </template>
            <template slot="winningBidder">
              <el-input
                v-model="result[index].contractForm.data.winningBidder"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                maxlength="200"
                show-word-limit
              ></el-input>
            </template>
            <template slot="biddingYear">
              <el-select
                v-model="result[index].contractForm.data.biddingYear"
                placeholder="请选择"
                @change="deliveryTypeChange(index, $event)"
              >
                <el-option
                  v-for="item in result[index].contractForm.enum
                    .biddingYearList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
            <!-- 合同金额 万元 -->
            <template slot="contractAmount">
              <div class="slot-item">
                <el-input
                  class="append-input"
                  v-model="result[index].contractForm.data.contractAmount"
                  placeholder="请输入"
                  @blur="
                    numValid(
                      result[index].contractForm.data.contractAmount,
                      index
                    )
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
          </SrAdd>
        </div>
      </div>
      <div class="btns">
        <el-button
          type="primary"
          size="small"
          :disabled="btnDis"
          @click="saveFunc"
          >暂存</el-button
        >
        <el-button
          type="success"
          size="small"
          @click="tjFunc"
          :disabled="btnDis"
          >提交</el-button
        >
        <el-button type="info" size="small" @click="returnList"
          >返回列表</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "@/utils/debounce";
import upload from "@/utils/upload";
import config from "@/settings.js";
import { api_addContract, api_getDetail } from "@/api/orderManagement/index.js";
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
  data() {
    return {
      isContractAmountFalse:false,
      btnDis: false,
      displayAdd: "block",
      // 服务信息
      contractForms: {
        serviceType: "",
        serviceName: "",
        createTime: "", //创建时间
      },
      contracterveTypes: [
        {
          label: "监理",
          value: "4",
        },
        {
          label: "等保",
          value: "1",
        },
        {
          label: "密评",
          value: "2",
        },
        {
          label: "三方测评",
          value: "5",
        },
        {
          label: "其他",
          value: "3",
        },
      ],
      contractRules: {
        serviceName: [
          { required: true, message: "请输入服务名称", trigger: "blur" },
        ],
      },
      result: [],
      defaultObj: {
        // 合同form
        contractForm: {
          otherConfig: {
            labelNum: 160,
          },
          config: [
            {
              type: "slot",
              slotName: "frameworkContract",
              collapseTags: true,
              name: "框架合同",
              required: "请输入框架合同",
              placeholder: "请输入",
              bind: "frameworkContract",
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
              slotName: "biddingYear",
              name: "招标年度",
              placeholder: "请选择招标年度",
              bind: "biddingYear",
              col: 8,
              data: "biddingYearList",
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
              col: 8,
            },
            {
              // type: "dateSelect",
              type: "slot",
              slotName: "endTime",
              timeType: "date",
              name: "合同结束日期",
              placeholder: "请选择",
              bind: "endTime",
              required: "请选择合同结束日期",
              format: "yyyy-MM-dd",
              col: 8,
            },
            {
              type: "slot",
              slotName: "contractCode",
              collapseTags: true,
              name: "合同编码",
              placeholder: "请输入",
              bind: "contractCode",
              col: 8,
            },
            {
              type: "slot",
              slotName: "winningBidder",
              collapseTags: true,
              name: "中标单位",
              required: "请输入中标单位",
              placeholder: "请输入",
              bind: "winningBidder",
              trigger: "blur",
              col: 8,
            },
            {
              type: "upload",
              name: "上传合同",
              bind: "contractFile",
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
            id: null,
            frameworkContract: "", // 框架合同
            contractCode: "", // 合同编码
            biddingYear: "2024年度", // 招标年度
            contractAmount: "", //合同金额
            startTime: null, // 合同开始日期
            endTime: null, // 合同结束日期
            winningBidder: "", //中标单位
            contractFile: [], // 合同
            otherFile: [], // 其他
            serviceName: "", //服务名称
            serviceType: "", //服务类型
            status: 0,
            createTime: "",
          },
          enum: {
            biddingYearList: [
              {
                value: "2024年度计划",
                label: "2024年度计划",
              },
              {
                value: "2025年度计划",
                label: "2025年度计划",
              },
              {
                value: "2026年度计划 ",
                label: "2026年度计划 ",
              },
            ],
          },
        },
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
  created() {
    let newContract;
    // 点击后新增
    if (this.$route.query.contractNew) {
      newContract = JSON.parse(this.$route.query.contractNew);
    }

    if (this.$route.query.edit == 0) {
      this.displayAdd = "none";
    }
    if (this.$route.query && this.$route.query.id) {
      this.getDetail(this.$route.query.id);
    }

    if (
      newContract.serviceName &&
      (newContract.serviceName != "" || newContract.serviceName != null)
    ) {
      this.contractForms.serviceType = newContract.serviceType;
      this.contractForms.serviceName = newContract.serviceName;
      this.contractForms.createTime = newContract.createTime;
    }
  },
  mounted() {
    this.result = [];
    this.result.push(this.defaultObj);
  },
  methods: {
    // 查询回显
    getDetail(ids) {
      api_getDetail({ id: ids, type: "1" })
        .then((res) => {
          if (res.data) {
            // 提前解析 contractFile 和 otherFile
            const parsedContractFile = JSON.parse(res.data.contractFile);
            const parsedOtherFile = JSON.parse(res.data.otherFile);

            this.result.forEach((item) => {
              item.contractForm.data = { ...res.data };
              item.contractForm.data.contractFile = parsedContractFile;
              item.contractForm.data.otherFile = parsedOtherFile;
            });

            this.contractForms.serviceType = res.data.serviceType;
            this.contractForms.createTime = res.data.createTime;
            this.contractForms.serviceName = res.data.serviceName;
          }
        })
        .catch((error) => {
          console.error("获取详情失败:", error);
        });
    },
    // 判断名称是否有重复
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
    // 校验
    checkForm(saveType) {
      if(this.isContractAmountFalse){
        if (saveType == "tj") {
        let self = this;
        let newPromise = [];
        for (var i = 0; i < this.result.length; i++) {
          newPromise[i] = new Promise((resolve, reject) => {
            if (
              this.$refs[`contractForm${i + 1}`] &&
              this.$refs[`contractForm${i + 1}`].length > 0
            ) {
              let validate1 = this.$refs[`contractForm${i + 1}`][0].validate();
              if (validate1) {
                resolve();
              } else {
                reject(new Error());
              }
            }
          });
        }
        Promise.all(newPromise).then(() => {
          let contractNameArr = []; // 存放合同名称的数据集合
          self.result.map((item) => {
            contractNameArr.push(item.contractForm.data.frameworkContract);
          });
          let flag = this.isRepeat(contractNameArr);
          if (flag) {
            // 合同名称有重复
            this.$message.warning("框架名称有重复, 请修改后再次提交");
            return false;
          }
          this.saveFinal(saveType);
        });
      } else {
        let self = this;
        let contractNameArr = []; // 存放合同名称的数据集合
        self.result.map((item) => {
          contractNameArr.push(item.contractForm.data.frameworkContract);
        });
        let flag = this.isRepeat(contractNameArr);
        if (flag) {
          // 合同名称有重复
          this.$message.warning("框架名称有重复, 请修改后再次保存");
          return false;
        }
        this.saveFinal(saveType);
      }
      }else{
        this.$message({
          type: "warning",
          message: "合同金额最大支持小数点后六位",
        });
      }

    },
    saveFinal: debounce(function (saveType) {
      let saveParams = []; //交付物信息
      this.result.forEach((item, index) => {
        if (item.contractForm.data.contractFile.length == 1) {
          item.contractForm.data.contractFile[0].deliveryName = "上传合同";
          item.contractForm.data.contractFile[0].size = this.getSize(
            item.contractForm.data.contractFile[0].size
          );
        } else {
          item.contractForm.data.contractFile.map((c) => {
            c.deliveryName = "上传合同";
            c.size = this.getSize(c.size);
          });
        }
        if (item.contractForm.data.otherFile.length == 1) {
          item.contractForm.data.otherFile[0].deliveryName = "其他附件";
          item.contractForm.data.otherFile[0].size = this.getSize(
            item.contractForm.data.otherFile[0].size
          );
        } else {
          item.contractForm.data.otherFile.map((c) => {
            c.deliveryName = "其他附件";
            c.size = this.getSize(c.size);
          });
        }
        saveParams.push({
          id: item.contractForm.data.id ? item.contractForm.data.id : null,
          biddingYear: item.contractForm.data.biddingYear,
          frameworkContract: item.contractForm.data.frameworkContract,
          contractCode: item.contractForm.data.contractCode,
          contractAmount: item.contractForm.data.contractAmount,
          startTime: item.contractForm.data.startTime,
          endTime: item.contractForm.data.endTime,
          winningBidder: item.contractForm.data.winningBidder,
          contractFile: JSON.stringify(item.contractForm.data.contractFile),
          otherFile: JSON.stringify(item.contractForm.data.otherFile),
          status: saveType == "tj" ? 1 : 0,
          serviceName: this.contractForms.serviceName,
          serviceType: this.contractForms.serviceType,
          createTime: this.contractForms.createTime,
        });
      });
      // this.btnDis = true;
      api_addContract(saveParams).then((res) => {
        if (res.msg.code == "0000") {
          if ([null, "", "null"].includes(res.data)) {
            this.$message({
              type: "success",
              message: "提交成功",
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
          // this.btnDis = false;
        } else {
          this.$message({
            type: "error",
            message: "提交失败",
          });
          // this.btnDis = false;
        }
      });
    }, 2000),
    // saveFinal(saveType) {
    // },
    // 提交方法
    tjFunc() {
      this.checkForm("tj");
    },
    // 暂存
    saveFunc() {
      this.checkForm("save");
    },

    // 添加合同信息
    addRows() {
      let row = {
        // 合同form
        contractForm: {
          otherConfig: {
            labelNum: 160,
          },
          config: [
            {
              type: "slot",
              slotName: "frameworkContract",
              collapseTags: true,
              name: "框架合同",
              required: "请输入框架合同",
              placeholder: "请输入",
              bind: "frameworkContract",
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
              slotName: "biddingYear",
              name: "招标年度",
              placeholder: "请选择招标年度",
              bind: "biddingYear",
              col: 8,
              data: "biddingYearList",
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
              col: 8,
            },
            {
              // type: "dateSelect",
              type: "slot",
              slotName: "endTime",
              timeType: "date",
              name: "合同结束日期",
              placeholder: "请选择",
              bind: "endTime",
              required: "请选择合同结束日期",
              format: "yyyy-MM-dd",
              col: 8,
            },
            {
              type: "slot",
              slotName: "contractCode",
              collapseTags: true,
              name: "合同编码",
              placeholder: "请输入",
              bind: "contractCode",
              col: 8,
            },
            {
              type: "slot",
              slotName: "winningBidder",
              collapseTags: true,
              name: "中标单位",
              required: "请输入运维期限",
              placeholder: "请输入",
              bind: "winningBidder",
              trigger: "blur",
              col: 8,
            },
            {
              type: "upload",
              name: "上传合同",
              bind: "contractFile",
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
            id: null,
            frameworkContract: "", // 框架合同
            contractCode: "", // 合同编码
            biddingYear: "2024年度", // 招标年度
            contractAmount: "", //合同金额
            startTime: null, // 合同开始日期
            endTime: null, // 合同结束日期
            winningBidder: "", //中标单位
            contractFile: [], // 合同
            otherFile: [], // 其他
            serviceName: "", //服务名称
            serviceType: "", //服务类型
            createTime: "", //创建时间
            status: 0,
          },
          enum: {
            biddingYearList: [
              {
                value: "2024年度计划",
                label: "2024年度计划",
              },
              {
                value: "2025年度计划",
                label: "2025年度计划",
              },
              {
                value: "2026年度计划 ",
                label: "2026年度计划 ",
              },
            ],
          },
        },
      };
      this.result.push(row);
    },
    // 删除合同信息
    delRows(index) {
      this.$confirm(`此操作将移除此合同下的所有信息, 是否继续?`, "提示", {
        confirmButtonText: "确定移除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.result.splice(index, 1);
          this.$message({
            type: "success",
            message: `此合同已移除`,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 合同金额
    numValid(value, index) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value) == false) {
        this.isContractAmountFalse=false
        this.$message({
          type: "warning",
          message: "合同金额最大支持小数点后六位",
        });
      } else {
        this.isContractAmountFalse=true
      }
    },
    // 开始时间选择
    startTimeChange(time, index) {
      const contractForm = this.result[index].contractForm.data;

      if (contractForm.endTime) {
        if (!contractForm.startTime) {
          contractForm.endTime = null;
        }
      } else {
        contractForm.startTime = time;
      }
    },
    // 结束时间选择
    endTimeChange(time, index) {
      if (
        this.result[index].contractForm.data.startTime === "" ||
        this.result[index].contractForm.data.startTime === null
      ) {
        this.$message.warning("请先选择该合同开始日期");
        this.result[index].contractForm.data.endTime = null;
      } else {
        this.result[index].contractForm.data.endTime = time;
      }
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
.border {
  width: 4px;
  height: 14px;
  border-radius: 5px;
  background: #0176ff;
  margin: 0 5px;
}
.title {
  display: flex;
  align-items: center;
  margin: 20px 0 0 15px;
  span {
    font-size: 14px;
    font-weight: bolder;
  }
}
.contract {
  padding-bottom: 45px;
  .title {
    margin-top: 0;
  }
}
::v-deep .el-input {
  width: 100% !important;
}
::v-deep .el-select {
  width: 100% !important;
}
::v-deep .serve .el-form {
  padding: 0 30px;
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
  margin-bottom: 5px;
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
  //   justify-content: space-around;
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
  border: 1px solid #1890ff;
  color: #1890ff;
  border-radius: 4px !important;
  margin: 5px 0px 15px 20px !important;
}

.add-btn2 {
  border: 1px solid #1890ff;
  color: #1890ff;
  border-radius: 8px !important;
}

.minus-btn {
  border: 1px solid #f56c6c;
  color: #f56c6c;
  border-radius: 4px !important;
  margin: 5px 5px 15px 20px !important;
  &:hover {
    border: 1px dashed #f56c6c;
  }
}
::v-deep .serviceNameClass .el-input__count {
  height: 20px;
}
::v-deep .serviceNameClass.el-textarea .el-input__count {
  bottom: 10px;
}
</style>
