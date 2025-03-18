<!-- 订单信息详情 -->
<template>
  <div class="all">
    <div class="divBottom">
      <div class="title">订单信息</div>
      <SrView
        class="formTable"
        :formData="orderForm.config"
        :ruleForm="orderForm.data"
        :ref="`form`"
      >
        <template slot="orderFile">
          <el-col class="value_box">
            <label for="" class="itm_label">订单文件</label>
            <div
              class="itm_content_File"
              v-if="
                orderForm.data.orderFile == null ||
                orderForm.data.orderFile.length == 0
              "
            >
              &nbsp;&nbsp;&nbsp;暂无附件
            </div>
            <div v-else class="itm_content_File primary">
              <div
                class="files-item-content"
                v-for="(c, cIndex) in orderForm.data.orderFile"
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
                orderForm.data.otherFile == null ||
                orderForm.data.otherFile.length == 0
              "
            >
              &nbsp;&nbsp;&nbsp;暂无附件
            </div>
            <div v-else class="itm_content_File primary">
              <div
                class="files-item-content"
                v-for="(c, cIndex) in orderForm.data.otherFile"
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
        <div style="font-size: 16px; margin-bottom: 7px">付款节点</div>
        <el-table
          class="formTable"
          :data="oederTableData"
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
      </div>
    </div>
    <div class="btns">
      <el-button size="small" @click="returnList">返回列表</el-button>
    </div>
  </div>
</template>

<script>
import { api_getOrderDetail } from "@/api/orderManagement/index.js";
import config from "@/settings";
export default {
  data() {
    return {
      baseUrl: config.baseUrl,
      // 合同信息
      contractForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "框架合同",
            value: "systemName",
            col: 8,
            type: "value",
          },
          {
            value: "projectCode",
            label: "合同金额",
            span: 8,
            type: "value",
          },
          {
            value: "applicationUnit",
            label: "所属年度",
            span: 8,
            type: "value",
          },
          {
            label: "合同开始时间:",
            value: "systemName",
            col: 8,
            type: "value",
          },
          {
            value: "projectCode",
            label: "合同结束时间",
            span: 8,
            type: "value",
          },
          {
            value: "applicationUnit",
            label: "合同编码",
            span: 8,
            type: "value",
          },
          {
            value: "applicationUnit",
            label: "中标单位",
            span: 8,
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
      //   订单信息
      orderForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "订单名称",
            value: "orderName",
            col: 8,
            type: "value",
          },
          {
            value: "signingTime",
            label: "订单签订时间",
            span: 8,
            type: "value",
          },
          {
            value: "orderAmount",
            label: "订单金额(万元)",
            span: 8,
            type: "value",
          },
          {
            value: "projectName",
            label: "关联项目",
            span: 8,
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
          signingTime: "",
          orderAmount: "",
          projectId: "",
          projectName: "",
          orderFile: [],
          otherFile: [],
        },
        enums: {},
      },
      // 订单付款点信息
      oederTableData: [],
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
    };
  },
  created() {
    if (this.$route.query && this.$route.query.orderId) {
      this.getorderDetail(this.$route.query.orderId);
    }
  },
  methods: {
    getorderDetail(ids) {
      api_getOrderDetail({ id: ids }).then((res) => {
        Object.keys(res.data).forEach((item) => {
          if (res.data[item]) {
            this.orderForm.data[item] = res.data[item];
          }
        });
        this.orderForm.data.orderFile = res.data.orderFile
          ? JSON.parse(res.data.orderFile)
          : [];
        this.orderForm.data.otherFile = res.data.otherFile
          ? JSON.parse(res.data.otherFile)
          : [];
        this.oederTableData = res.data.paymentPointDtoList;
        this.orderForm.data.signingTime = this.changeTime(res.data.signingTime);
      });
    },
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
    returnList() {
      this.$router.push({
        name: "orderManagement",
      });
    },
    // 附件预览
    seeclick(file) {
      let token = sessionStorage.getItem("token");
      if (
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
.all {
  padding: 10px 20px 0 20px;
  .divBottom {
    margin-bottom: 10px;
    .formTable {
      margin-bottom: 10px;
      padding-left: 15px;
    }
    .payment {
      padding-left: 15px;
    }
    .title {
      font-size: 18px;
      font-weight: bolder;
    }
  }
  .divTitleBottom {
    margin-bottom: 5px;
  }
  .divBottomFour {
    margin-bottom: 20px;
    padding-bottom: 20px;
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
</style>
