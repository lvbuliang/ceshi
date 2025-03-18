<template>
  <div class="container">
    <div class="item" v-for="(item, index) in result" :key="index">
      <div v-if="result.length > 1" class="basic-title">标段{{ index + 1 }}</div>
      <div class="sub-item">
        <div class="sub-title">采购管理</div>
        <SrView
          class="ml-60"
          :formData="item.projectProcurementSubVo.config"
          :ruleForm="item.projectProcurementSubVo.data"
        >
          <template slot="11" slot-scope="scope">
            <el-col class="value_box">
              <label for="" class="itm_label">招标文件</label>
              <div
                class="itm_content"
                v-if="item.projectProcurementSubVo.data.tenderFileList == null"
              >
                暂无附件
              </div>
              <div v-else class="itm_content primary">
                <el-button
                  class="icon-view"
                  size="mini"
                  type="text"
                  @click="
                    seeclick(item.projectProcurementSubVo.data.tenderFileList)
                  "
                  icon="el-icon-view"
                ></el-button>
                <div class="file_name">
                  {{
                    item.projectProcurementSubVo.data.tenderFileList.fileName
                  }}
                </div>

                <i
                  @click="
                    download(item.projectProcurementSubVo.data.tenderFileList)
                  "
                  class="icon-download"
                ></i>
              </div>
            </el-col>
          </template>
          <template slot="22" slot-scope="scope">
            <el-col class="value_box">
              <label for="" class="itm_label">投标文件</label>
              <div
                class="itm_content"
                v-if="item.projectProcurementSubVo.data.bidFileList == null"
              >
                暂无附件
              </div>
              <div v-else class="itm_content primary">
                <el-button
                  class="icon-view"
                  size="mini"
                  type="text"
                  @click="
                    seeclick(item.projectProcurementSubVo.data.bidFileList)
                  "
                  icon="el-icon-view"
                ></el-button>
                <div class="file_name">
                  {{ item.projectProcurementSubVo.data.bidFileList.fileName }}
                </div>
                <i
                  @click="
                    download(item.projectProcurementSubVo.data.bidFileList)
                  "
                  class="icon-download"
                ></i>
              </div>
            </el-col>
          </template>
          <template slot="33" slot-scope="scope">
            <el-col class="value_box">
              <label for="" class="itm_label">中标通知书</label>
              <div
                class="itm_content"
                v-if="item.projectProcurementSubVo.data.bidNotice == null"
              >
                暂无附件
              </div>
              <div v-else class="itm_content primary">
                <el-button
                  class="icon-view"
                  size="mini"
                  type="text"
                  @click="seeclick(item.projectProcurementSubVo.data.bidNotice)"
                  icon="el-icon-view"
                ></el-button>
                <div class="file_name">
                  {{ item.projectProcurementSubVo.data.bidNotice.fileName }}
                </div>
                <i
                  @click="download(item.projectProcurementSubVo.data.bidNotice)"
                  class="icon-download"
                ></i>
              </div>
            </el-col>
          </template>
          <template slot="44" slot-scope="scope">
            <el-col class="value_box">
              <label for="" class="itm_label">公司决策文件</label>
              <div
                class="itm_content"
                v-if="
                  item.projectProcurementSubVo.data.decisionDocument == null
                "
              >
                暂无附件
              </div>
              <div v-else class="itm_content primary">
                <el-button
                  class="icon-view"
                  size="mini"
                  type="text"
                  @click="
                    seeclick(item.projectProcurementSubVo.data.decisionDocument)
                  "
                  icon="el-icon-view"
                ></el-button>
                <div class="file_name">
                  {{
                    item.projectProcurementSubVo.data.decisionDocument.fileName
                  }}
                </div>
                <i
                  @click="
                    download(item.projectProcurementSubVo.data.decisionDocument)
                  "
                  class="icon-download"
                ></i>
              </div>
            </el-col>
          </template>
          <template slot="55" slot-scope="scope">
            <el-col class="value_box">
              <label for="" class="itm_label">谈判纪要</label>
              <div
                class="itm_content"
                v-if="item.projectProcurementSubVo.data.negotiation == null"
              >
                暂无附件
              </div>
              <div
                v-else
                class="itm_content primary"
                @click="seeclick(item.projectProcurementSubVo.data.negotiation)"
              >
                <el-button
                  class="icon-view"
                  size="mini"
                  type="text"
                  @click="
                    seeclick(item.projectProcurementSubVo.data.negotiation)
                  "
                  icon="el-icon-view"
                ></el-button>
                <div class="file_name">
                  {{ item.projectProcurementSubVo.data.negotiation.fileName }}
                </div>
                <i
                  @click="
                    download(item.projectProcurementSubVo.data.negotiation)
                  "
                  class="icon-download"
                ></i>
              </div>
            </el-col>
          </template>
        </SrView>
      </div>
      <div class="sub-item">
        <div class="sub-title">合同管理</div>
        <SrView
          class="ml-60"
          :formData="item.projectProcurementContractVo.config"
          :ruleForm="item.projectProcurementContractVo.data"
        >
          <template slot="00" slot-scope="scope">
            <el-col class="value_box">
              <label for="" class="itm_label">合同</label>
              <div
                class="itm_content_contractFile"
                v-if="
                  item.projectProcurementContractVo.data.contractFileList ==
                  null
                "
              >
                暂无附件
              </div>
              <div v-else class="itm_content_contractFile primary">
                <div
                  class="files-item-content"
                  v-for="(c, cIndex) in item.projectProcurementContractVo.data
                    .contractFileList"
                  :key="cIndex"
                >
                  <el-button
                    class="icon-view"
                    size="mini"
                    type="text"
                    @click="seeclick(c)"
                    icon="el-icon-view"
                  ></el-button>
                  <div class="file_name">
                    {{ c.fileName }}
                  </div>
                  <i @click="download(c)" class="icon-download"></i>
                </div>
              </div>
            </el-col>
          </template>
        </SrView>
      </div>

      <div class="table-container" v-if="item.projectPayPointVos.length !== 0">
        <el-table
          class="sr_table mt-20 ml-60"
          :border="true"
          :data="item.projectPayPointVos"
          highlight-current-row
          style="width: 91%"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column label="序号" type="index" width="55">
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
          <el-table-column label="付款点比例(%)" width="120">
            <template slot-scope="scope">
              {{ scope.row.scale || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="付款点金额(万元)" width="180">
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
          <el-table-column label="实际付款点金额(万元)" width="180">
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
          <el-table-column label="付款点状态" width="120">
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
        </el-table>
      </div>
    </div>

    <!-- 底部按钮组 -->
    <div class="bottom_btns">
      <el-button class="gobackList" size="small" @click="returnList"
        >返回列表</el-button
      >
      <el-button  v-if=isFromWorkBench type='success' size="small" @click="backWorkBench">前往工作台</el-button>
    </div>
  </div>
</template>

<script>
import { api_previewProjectPurch } from "@/api/purchasingManagement/index.js";
import { previewRowItem1, previewRowItem2 } from "../const";
import config from "@/settings";
export default {
  name: "purchasingManagement_view",
  data() {
    return {
      isFromWorkBench: false,//是否从工作台进入
      result: [],
      previewRowItem1,
      previewRowItem2,
      baseUrl: config.baseUrl,
      widthB: "",
    };
  },
  mounted() {
    if(this.$route.query.activeName=='已办'){ 
      this.isFromWorkBench = true
    }
    this.getDetailById();
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    },
  },
  methods: {
    backWorkBench(){
    this.$router.go(-1)
    },
    initResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.widthB = entry.contentRect.width + "px";
        });
      });
      this.resizeObserver.observe(document.querySelector(".main-menu-box"));
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
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
    getDetailById() {
      api_previewProjectPurch({ projectId: this.projectId }).then((res) => {
        if (res.msg.code == "0000") {
          res.data.forEach((item) => {
            console.log("item", item);

            let data = {};
            let config = [];
            if (
              item.projectProcurementSubVo.deliveryEntities.length === 3 ||
              item.projectProcurementSubVo.deliveryEntities.length === 0
            ) {
              config = this.previewRowItem1.projectProcurementSubVo.config;
              data = {
                deliveryType:
                  (item.projectProcurementSubVo &&
                    item.projectProcurementSubVo.deliveryType) === 0
                    ? "公开采购"
                    : "协同采购",
                successfulBuid:
                  (item.projectProcurementSubVo &&
                    item.projectProcurementSubVo.successfulBuid) ||
                  null,
                adInternetTime:
                  (item.projectProcurementSubVo &&
                    item.projectProcurementSubVo.adInternetTime) ||
                  null,
                successfulTime:
                  (item.projectProcurementSubVo &&
                    item.projectProcurementSubVo.successfulTime) ||
                  null,
                tenderFileList: item.projectProcurementSubVo.tenderFileList
                  .fileName
                  ? item.projectProcurementSubVo.tenderFileList
                  : null,
                bidFileList: item.projectProcurementSubVo.bidFileList.fileName
                  ? item.projectProcurementSubVo.bidFileList
                  : null,
                bidNotice: item.projectProcurementSubVo.bidNotice.fileName
                  ? item.projectProcurementSubVo.bidNotice
                  : null,
              };
            } else {
              config = this.previewRowItem2.projectProcurementSubVo.config;
              data = {
                deliveryType:
                  (item.projectProcurementSubVo &&
                    item.projectProcurementSubVo.deliveryType) === 0
                    ? "公开采购"
                    : "协同采购",
                successfulBuid:
                  (item.projectProcurementSubVo &&
                    item.projectProcurementSubVo.successfulBuid) ||
                  null,
                togetherProcurementTime:
                  (item.projectProcurementSubVo &&
                    item.projectProcurementSubVo.togetherProcurementTime) ||
                  null,
                decisionDocument: item.projectProcurementSubVo.decisionDocument
                  .fileName
                  ? item.projectProcurementSubVo.decisionDocument
                  : null,
                negotiation: item.projectProcurementSubVo.negotiation.fileName
                  ? item.projectProcurementSubVo.negotiation
                  : null,
              };
            }
            const newItem = {
              projectProcurementSubVo: {
                otherConfig:
                  this.previewRowItem1.projectProcurementSubVo.otherConfig,
                config: config,
                data: data,
                enums: this.previewRowItem1.projectProcurementSubVo.enums,
              },
              projectProcurementContractVo: {
                otherConfig:
                  this.previewRowItem1.projectProcurementContractVo.otherConfig,
                config:
                  this.previewRowItem1.projectProcurementContractVo.config,
                data: {
                  contractName:
                    (item.projectProcurementContractVo &&
                      item.projectProcurementContractVo.contractName) ||
                    null,
                  contractAmount:
                    (item.projectProcurementContractVo &&
                      item.projectProcurementContractVo.contractAmount) ||
                    null,
                  startTime:
                    (item.projectProcurementContractVo &&
                      item.projectProcurementContractVo.startTime) ||
                    null,
                  endTime:
                    (item.projectProcurementContractVo &&
                      item.projectProcurementContractVo.endTime) ||
                    null,
                  operationTime:
                    (item.projectProcurementContractVo &&
                      item.projectProcurementContractVo.operationTime) ||
                    null,
                  contractFileList: null,
                },
                enums: this.previewRowItem1.projectProcurementContractVo.enums,
              },
              projectPayPointVos: item.projectPayPointVos || null,
            };
            newItem.projectProcurementContractVo.data.contractFileList = [];
            console.log(
              "xxx",
              item.projectProcurementContractVo.deliveryEntityList,
              newItem.projectProcurementContractVo.data
            );

            if (
              item.projectProcurementContractVo.deliveryEntityList.length > 0
            ) {
              item.projectProcurementContractVo.deliveryEntityList.map((c) => {
                newItem.projectProcurementContractVo.data.contractFileList.push(
                  c
                );
              });
            } else {
              newItem.projectProcurementContractVo.data.contractFileList = null;
            }

            this.result.push(newItem);
          });
          console.log("最终回显数据", this.result);
        }
      });
    },
    seeclick(file) {
      let token = sessionStorage.getItem("token");
      if (
        //12.27
        ["doc", "docx", "txt", "html", "pdf", "ppt", "pptx", "html"].includes(
          file.fileName.split(".").pop()
        )
      ) {
        window.open(`${this.baseUrl}/viewPdf?id=${file.fileContext}`);
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
        ].includes(file.fileName.split(".").pop())
      ) {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.fileContext}&access_token=${token}`
        );
      }
    },
    //无闪烁跳转
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    download(file) {
      console.log("id, ", file);

      let token = sessionStorage.getItem("token");
      this.exportFile(
        `${this.baseUrl}/jfzg/file/api/file/downloadStream?key=${file.fileContext}&access_token=${token}`
      );
    },
    // 返回列表
    returnList() {
      this.$router.push({
        name: "purchasingManagement",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  padding: 20px;
  height: calc(100% - 70px);
  overflow-y: auto;
}

.value_box {
  // height: 44px;
  display: flex;
  align-items: center;
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
  .itm_content_contractFile {
    .files-item-content {
      display: flex;
      align-items: center;
      line-height: 22px;
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
  }
  .primary {
    color: #1890ff;
    cursor: pointer;
  }
}


.sub-item {
  width: 95%;
}

.basic-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
  padding-left: 40px;
  padding-top: 20px;
}

.table-container {
  margin-bottom: 50px;
}

.sub-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
  padding-left: 60px;
}

.mt-20 {
  margin-top: 20px;
}

.ml-60 {
  margin-left: 60px;
}

.bottom_btns {
  text-align: center;
  .gobackList {
    display: inline-block;
    margin-left: 20px;
  }

  .workflow_button {
    box-sizing: border-box;
    display: inline-block;
    margin: 0 4px;

    button {
      padding: 0px 24px;
      line-height: 32px;
      border-radius: 16px;
    }
  }
}
</style>
