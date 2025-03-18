<template>
  <div class="all">
    <div class="divBottom divTitleBottom">
      <div class="title">服务信息</div>
      <SrView
        class="formTable"
        :formData="serviceForm.config"
        :ruleForm="serviceForm.data"
        :ref="`form`"
      >
      </SrView>
    </div>
    <div class="divBottom divTitleBottom">
      <div class="title">合同信息</div>
      <SrView
        class="formTable"
        :formData="contractForm.config"
        :ruleForm="contractForm.data"
        :ref="`form`"
      >
        <template slot="contractFile">
          <el-col class="value_box">
            <label for="" class="itm_label">合同文件</label>
            <div
              class="itm_content_File"
              v-if="
                contractForm.data.contractFile == null ||
                JSON.parse(contractForm.data.contractFile).length == 0
              "
            >
              &nbsp;&nbsp;&nbsp;暂无附件
            </div>
            <div v-else class="itm_content_File primary">
              <div
                class="files-item-content"
                v-for="(c, cIndex) in JSON.parse(
                  contractForm.data.contractFile
                )"
                :key="cIndex"
              >
                <el-tooltip effect="light" placement="top" content="预览">
                  <el-button
                    class="icon-view"
                    size="mini"
                    type="text"
                    @click="seeclick(c)"
                    icon="el-icon-view"
                  ></el-button
                ></el-tooltip>

                <el-tooltip
                  effect="light"
                  placement="top-start"
                  :content="c.name"
                  ><div class="file_name">
                    {{ c.name }}
                  </div></el-tooltip
                >
                <el-tooltip effect="light" placement="top" content="下载">
                  <i @click="download(c)" class="icon-download"></i>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </template>
        <template slot="otherFile">
          <el-col class="value_box">
            <label for="" class="itm_label">其他附件</label>
            <div
              class="itm_content_File"
              v-if="
                contractForm.data.otherFile == null ||
                JSON.parse(contractForm.data.otherFile).length == 0
              "
            >
              &nbsp;&nbsp;&nbsp;暂无附件
            </div>
            <div v-else class="itm_content_File primary">
              <div
                class="files-item-content"
                v-for="(c, cIndex) in JSON.parse(contractForm.data.otherFile)"
                :key="cIndex"
              >
                <el-tooltip effect="light" placement="top" content="预览">
                  <el-button
                    class="icon-view"
                    size="mini"
                    type="text"
                    @click="seeclick(c)"
                    icon="el-icon-view"
                  ></el-button
                ></el-tooltip>

                <el-tooltip
                  effect="light"
                  placement="top-start"
                  :content="c.name"
                  ><div class="file_name">
                    {{ c.name }}
                  </div></el-tooltip
                >
                <el-tooltip effect="light" placement="top" content="下载">
                  <i @click="download(c)" class="icon-download"></i>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </template>
      </SrView>
    </div>
    <div class="divBottom">
      <div v-if="result.length > 0">
        <div class="title">订单信息</div>
        <div class="item" v-for="(item, index) in result" :key="index">
          <p
            v-if="result.length > 1"
            style="font-size: 16px; font-weight: bold; margin: 5px 0 10px 10px"
          >
            订单{{ index + 1 }}
          </p>
          <SrView
            class="formTable"
            :formData="item.orderForm.config"
            :ruleForm="item.orderForm.data"
            :ref="`form`"
          >
            <template slot="orderFile">
              <el-col class="value_box">
                <label for="" class="itm_label">订单文件</label>
                <div
                  class="itm_content_File"
                  v-if="
                    item.orderForm.data.orderFile == null ||
                    JSON.parse(item.orderForm.data.orderFile).length == 0
                  "
                >
                  &nbsp;&nbsp;&nbsp;暂无附件
                </div>
                <div v-else class="itm_content_File primary">
                  <div
                    class="files-item-content"
                    v-for="(c, cIndex) in JSON.parse(
                      item.orderForm.data.orderFile
                    )"
                    :key="cIndex"
                  >
                    <el-tooltip effect="light" placement="top" content="预览">
                      <el-button
                        class="icon-view"
                        size="mini"
                        type="text"
                        @click="seeclick(c)"
                        icon="el-icon-view"
                      ></el-button
                    ></el-tooltip>

                    <el-tooltip
                      effect="light"
                      placement="top-start"
                      :content="c.name"
                      ><div class="file_name">
                        {{ c.name }}
                      </div></el-tooltip
                    >
                    <el-tooltip effect="light" placement="top" content="下载">
                      <i @click="download(c)" class="icon-download"></i>
                    </el-tooltip>
                  </div>
                </div>
              </el-col>
            </template>
            <template slot="otherFile">
              <el-col class="value_box">
                <label for="" class="itm_label">其他附件</label>
                <div
                  class="itm_content_File"
                  v-if="
                    item.orderForm.data.otherFile == null ||
                    JSON.parse(item.orderForm.data.otherFile).length == 0
                  "
                >
                  &nbsp;&nbsp;&nbsp;暂无附件
                </div>
                <div v-else class="itm_content_File primary">
                  <div
                    class="files-item-content"
                    v-for="(c, cIndex) in JSON.parse(
                      item.orderForm.data.otherFile
                    )"
                    :key="cIndex"
                  >
                    <el-tooltip effect="light" placement="top" content="预览">
                      <el-button
                        class="icon-view"
                        size="mini"
                        type="text"
                        @click="seeclick(c)"
                        icon="el-icon-view"
                      ></el-button
                    ></el-tooltip>

                    <el-tooltip
                      effect="light"
                      placement="top-start"
                      :content="c.name"
                      ><div class="file_name">
                        {{ c.name }}
                      </div></el-tooltip
                    >
                    <el-tooltip effect="light" placement="top" content="下载">
                      <i @click="download(c)" class="icon-download"></i>
                    </el-tooltip>
                  </div>
                </div>
              </el-col>
            </template>
          </SrView>
          <div class="payment">
            <div class="payment_title">付款节点</div>
            <el-table
              class="formTable"
              :data="item.orderForm.data.paymentPointDtoList"
              border
              style="width: 100%"
              :header-cell-style="{
                color: '#000',
                backgroundColor: 'rgb(240, 240, 240)',
              }"
            >
              <el-table-column type="index" label="序号"> </el-table-column>
              <el-table-column
                prop="paymentDescription"
                label="付款点描述"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="paymentProportion"
                label="付款点比例%"
                width="180"
              >
              </el-table-column>
              <el-table-column prop="paymentAmount" label="付款点金额(万元)">
              </el-table-column>
              <el-table-column
                prop="actualPaymentAmount"
                label="实际付款金额(万元)"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.actualPaymentAmount">
                    {{ scope.row.actualPaymentAmount }}
                  </div>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="付款状态">
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
              <el-table-column prop="notes" label="备注">
                <template slot-scope="scope">
                  <div v-if="scope.row.notes">
                    {{ scope.row.notes }}
                  </div>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="payment_title">项目支付信息</div>
            <el-table
              class="formTable"
              :data="item.orderForm.data.projectPaymentInfoEntities"
              border
              style="width: 100%"
              :header-cell-style="{
                color: '#000',
                backgroundColor: 'rgb(240, 240, 240)',
              }"
            >
              <el-table-column type="index" label="序号"> </el-table-column>
              <el-table-column
                prop="description"
                label="付款点描述"
                width="180"
              >
              </el-table-column>
              <el-table-column prop="scale" label="付款点比例%" width="180">
              </el-table-column>
              <el-table-column prop="amount" label="付款点金额(万元)">
              </el-table-column>
              <el-table-column prop="actualAmount" label="实际付款金额(万元)">
              </el-table-column>
              <el-table-column label="付款状态">
                <template slot-scope="scope">
                  {{ scope.row.status == 0 ? "已支付" : "未支付" }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="btns">
      <el-button size="small" @click="returnList">返回列表</el-button>
    </div>
  </div>
</template>

<script>
import { api_getDetail } from "@/api/orderManagement/index.js";
import config from "@/settings";
export default {
  data() {
    return {
      baseUrl: config.baseUrl,
      // 服务信息
      serviceForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "服务类别",
            value: "serviceType",
            col: 12,
            type: "value",
          },
          {
            value: "serviceName",
            label: "服务名称",
            span: 12,
            type: "value",
          },
          {
            value: "createTime",
            label: "创建时间",
            span: 12,
            type: "value",
          },
        ],

        data: {
          createTime: "",
          serviceName: "",
          serviceType: "",
        },
        enums: {},
      },
      //   合同信息
      contractForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "框架合同",
            value: "frameworkContract",
            col: 12,
            type: "value",
          },
          {
            value: "contractAmount",
            label: "合同金额(万元)",
            span: 12,
            type: "value",
          },
          {
            value: "biddingYear",
            label: "招标年度",
            span: 12,
            type: "value",
          },
          {
            label: "合同开始时间:",
            value: "startTime",
            col: 12,
            type: "value",
          },
          {
            value: "endTime",
            label: "合同结束时间",
            span: 12,
            type: "value",
          },
          {
            value: "contractCode",
            label: "合同编码",
            span: 12,
            type: "value",
          },
          {
            value: "winningBidder",
            label: "中标单位",
            span: 12,
            type: "value",
          },
          {
            span: 24,
            type: "slot",
            slotName: "contractFile",
          },
          {
            span: 24,
            type: "slot",
            slotName: "otherFile",
          },
        ],

        data: {
          winningBidder: "",
          contractCode: "",
          endTime: "",
          startTime: "",
          biddingYear: "",
          contractAmount: "",
          frameworkContract: "",
          contractFile: [],
          otherFile: [],
        },
        enums: {},
      },
      result: [],
      //   订单信息
      order: {
        orderForm: {
          otherConfig: {
            labelNum: 140,
          },
          config: [
            {
              label: "订单名称",
              value: "orderName",
              col: 12,
              type: "value",
            },
            {
              type: "value",
              value: "signingTime",
              label: "订单签订时间",
              span: 12,
            },
            {
              value: "orderAmount",
              label: "订单金额(万元)",
              span: 12,
              type: "value",
            },
            {
              value: "projectName",
              label: "关联项目",
              span: 12,
              type: "value",
            },
            {
              type: "value",
              value: "endTime",
              label: "合同结束时间",
              span: 12,
            },
            {
              value: "contractCode",
              label: "合同编码",
              span: 12,
              type: "value",
            },
            {
              value: "winningBidder",
              label: "中标单位",
              span: 12,
              type: "value",
            },
            {
              span: 24,
              type: "slot",
              slotName: "orderFile",
            },
            {
              span: 24,
              type: "slot",
              slotName: "otherFile",
            },
          ],
          data: {
            orderName: "",
            projectName: "",
            orderAmount: "",
            signingTime: "",
            paymentDescription: "",
            paymentProportion: "",
            paymentAmount: "",
            actualPaymentAmount: "",
            paymentStatus: "",
            notes: "",
            endTime: "",
            contractCode: "",
            winningBidder: "",
            paymentPointDtoList: [],
            projectPaymentInfoEntities: [],
          },
          enums: {},
        },
      },
      //   项目支付信息
      projectForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "系统名称:",
            value: "systemName",
            col: 8,
            type: "value",
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
        ],

        data: {
          applicationUnit: "",
          projectCode: "",
          systemName: "",
        },
        enums: {},
      },
      serviceTypeMap: {
        1: "等保",
        2: "密评",
        3: "其他",
        4: "监理",
        5: "三方测评",
      },
    };
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.getDetail(this.$route.query.id);
    }
  },
  mounted() {
    //this.result.push(this.order);
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

    getDetail(ids) {
      api_getDetail({ id: ids, type: "0" }).then((res) => {
        if (res.data) {
          // 服务合同
          var newObj = {};
          for (var key in res.data) {
            newObj[key] = res.data[key];
          }
          this.contractForm.data = newObj;
          this.contractForm.data.startTime = res.data.startTime.split(" ")[0];
          this.contractForm.data.endTime = res.data.endTime.split(" ")[0];
          this.serviceForm.data.createTime = res.data.createTime.split(" ")[0];
          this.serviceForm.data.serviceName = res.data.serviceName;

          this.serviceForm.data.serviceType =
            this.serviceTypeMap[res.data.serviceType] || "";

          // 订单
          if (res.data.detailVoList && res.data.detailVoList.length != 0) {
            this.result = [];
            res.data.detailVoList.forEach((item, index) => {
              const newItem = {
                orderForm: {
                  otherConfig: {
                    labelNum: 140,
                  },
                  config: this.order.orderForm.config,
                  data: item,
                  enums: {},
                },
              };
              newItem.orderForm.data.endTime = this.changeTime(
                res.data.endTime
              );
              newItem.orderForm.data.signingTime = this.changeTime(
                item.signingTime
              );
              newItem.orderForm.data.contractCode = res.data.contractCode;
              newItem.orderForm.data.winningBidder = res.data.winningBidder;
              this.result.push(newItem);
            });
          }
        }
      });
    },
    returnList() {
      this.$router.push({
        name: "orderManagement",
      });
    },
    // 附件预览
    seeclick(file) {
      let token = sessionStorage.getItem("token");
      if (
        //12.27
        ["doc", "docx", "txt", "html", "pdf", "ppt", "pptx", "html"].includes(
          file.name.split(".").pop()
        )
      ) {
        window.open(`${this.baseUrl}/viewPdf?id=${file.id}`);
      } else if (
        [
          "bmp",
          "jpg",
          "jpeg",
          "gif",
          "png",
          "zip",
          "rar",
          "xls",
          "xlsx",
        ].includes(file.name.split(".").pop())
      ) {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      }
    },

    // 附件下载
    download(file) {
      let token = sessionStorage.getItem("token");
      window.open(
        `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.all {
  padding: 10px 20px 50px 20px;
  .divBottom {
    margin-bottom: 10px;
    .formTable {
      margin-bottom: 15px;
      padding-left: 15px;
    }
    .payment {
      padding-left: 15px;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
      margin: 5px 0;
    }
  }
  .divTitleBottom {
    margin-bottom: 5px;
  }
}
::v-deep .el-table {
  margin-bottom: 10px;
  border-radius: 8px;
  padding-left: 0px !important;
  margin-left: 15px;
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
  ::v-deep .el-button {
    margin: 0 15px;
    width: 100px !important;
  }
}
.itm_label {
  height: 100%;
  width: 50%;
  background-color: #f7f7f7;
  padding: 10px 0 12px 12px;
  display: flex;
  align-items: center;
}
.value_box {
  min-height: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: none;
  .itm_label {
    height: 100%;
    width: 50%;
    background-color: #f7f7f7;
    padding: 10px 0 12px 12px;
    display: flex;
    align-items: center;
  }
  .itm_content {
    height: 100%;
    width: 50%;
    padding-left: 12px;
    display: flex;

    align-items: center;
    .file_name {
      overflow: hidden; //隐藏文字
      text-overflow: ellipsis; //显示...
      white-space: nowrap; //不换行
      flex: 1;
      height: 100%;
      line-height: 44px;
    }
    .icon-view {
      font-size: 24px;
      margin-right: 10px;
    }
    .icon-download {
      width: 30px;
      height: 100%;
      line-height: 44px;
      font-size: 26px;
      padding-right: 10px;
    }
  }
  .itm_value {
    width: 50%;
    height: 100%;
    padding: 9px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 1px solid #dedddd;
    .v {
      flex: 1;
      display: inline-block;
      margin-right: 5%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .more {
      width: 30px;
      cursor: pointer;
      color: #1890ff;
    }
  }
  .itm_content_File {
    width: 50%;
    .files-item-content {
      display: flex;
      align-items: center;
      line-height: 22px;
      border-bottom: 2px solid #eee;
      border-left: 1px solid #dedddd;
      padding: 0 10px;
      cursor: pointer;
      &:last-child {
        border-bottom: 0;
      }
      &:hover {
        background-color: #f5f5f5;
      }
      .file_name {
        text-decoration: underline;
        overflow: hidden; //隐藏文字
        text-overflow: ellipsis; //显示...
        white-space: nowrap; //不换行
        flex: 1;
        height: 100%;
        line-height: 44px;
        padding-left: 20px;
      }
      .icon-view {
        font-size: 24px;
        margin-right: 10px;
        &:hover {
          font-size: 26px;
        }
      }
      .icon-download {
        width: 30px;
        height: 100%;
        line-height: 44px;
        font-size: 26px;
        padding-right: 10px;
        &:hover {
          font-size: 28px;
        }
      }
    }
  }
  .primary {
    color: #1890ff;
    cursor: pointer;
  }
}
.payment_title {
  font-size: 16px;
  margin-bottom: 7px;
}
</style>
