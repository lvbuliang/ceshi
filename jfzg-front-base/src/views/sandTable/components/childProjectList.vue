<template>
  <div v-if="show" class="child_project">
    <!-- <div class="child_project_head"> 2.25 -->
    <!-- <div class="menuBtns"> 2.25 -->
    <!-- <el-button
          v-for="(item, index) in menuBtns"
          :key="index"
          size="mini"
          round
          @click="toProjectPath(item)"
          >{{ item.permissionName }}</el-button
        > 2.25-->
    <!-- <el-popover
                    popper-class="child_project_popover"
                    placement="bottom"
                    width="141"
                    trigger="hover"
                    v-if="menuBtns.length > 5"
                >
                    <ul>
                        <li
                            class="more_file_list"
                            v-for="(fitem, index) in menuBtns.slice(5)"
                            :key="'fitem_' + index"
                            @click="projectBtn(fitem)"
                        >
                            {{ fitem.buttonName }}
                        </li>
                    </ul>
                    <div class="more_file" slot="reference">
                        <i class="el-icon-more"></i>
                    </div>
                </el-popover> -->
    <!-- </div>2.25 -->
    <!-- <div class="right">
        <i class="el-icon-close" @click="close"></i>
      </div> 2.25 -->
    <!-- </div>2.25 -->
    <div class="child_project_content">
      <el-row>
        <el-col :span="6" class="child_project_content_left">
          <div class="jindu" v-if="result.deliveryProcess">
            <div class="title">进度情况</div>
            <span>{{ result.days > 0 ? "逾期" : "正常" }}</span>
            <!-- <el-progress
              :width="52"
              :percentage="50"
              :color="result.days > 0 ? 'red' : '#1890FF'"
            ></el-progress> -->
            <div v-if="result.days > 0">
              当前已超期: <span>{{ result.days }}天</span>
            </div>
            <div class="title" style="margin-top: 20px">最新周报</div>
            <div v-if="fileList&&fileList.length>0">
              <div
                class="filebox"
                v-for="(item, index) in fileList"
                :key="index"
              >
                <div class="mess">
                  <el-tooltip
                    v-if="item.name.length > 25"
                    :content="item.name"
                    placement="top"
                    effect="light"
                  >
                    <p>
                      <span @click.stop="seeFile(item)">{{
                        "..." + item.name.substring(item.name.length - 10)
                      }}</span>
                      <i
                        @click="download(item, dataUp)"
                        class="icon-download download"
                      ></i>
                    </p>
                  </el-tooltip>
                  <p v-else>
                    <span @click.stop="seeFile(item)">{{ item.name }}</span>
                    <i
                      @click="download(item, dataUp)"
                      class="icon-download download"
                    ></i>
                  </p>
                  <!-- <span>{{item.fileSize}}</span> -->
                </div>
              </div>
            </div>
            <div v-else>暂无附件</div>
          </div>
          <!-- 2.25<div class="child_project_content_left_riskAndQuestion">
            <div class="title">风险/问题</div>
            <div class="imgs">
              <div style="visibility: hidden">图标</div>
              <div style="width: 35px; text-align: right">
                <img
                  src="./../../../assets/images/sendTableChildren/high.png"
                  width="11px"
                  height="auto"
                  alt=""
                />
                <span style="color: #f5222d">高</span>
              </div>
              <div>
                <img
                  src="./../../../assets/images/sendTableChildren/middle.png"
                  width="11px"
                  height="auto"
                  alt=""
                />
                <span style="color: #ffaa22">中</span>
              </div>
              <div>
                <img
                  src="./../../../assets/images/sendTableChildren/low.png"
                  width="11px"
                  height="auto"
                  alt=""
                />
                <span style="color: #1890ff">低</span>
              </div>
            </div>
            <div class="list">
              <div>风险</div>
              <div v-for="(item, index) in riskList" :key="'riskList' + index">
                <span :style="item.amount == 0 ? 'color:#CCCCCC' : ''">
                  {{ item.amount }}</span
                >
              </div>
            </div>
            <div class="list">
              <div>问题</div>
              <div v-for="(item, index) in question" :key="'riskList' + index">
                <span> {{ item.amount }}</span>
              </div>
            </div>
          </div> -->
        </el-col>
        <el-col :span="8" class="child_project_content_right">
          <div class="child_project_content_right_huibao">
            <div class="title">汇报情况</div>
            <div class="num" v-if="result.stageProcess">
              {{ result.stageProcess.length || 0 }}
              <span>次</span>
            </div>
            <!-- 隐藏折线图3.29 -->
            <!-- <div><huibaoCharts></huibaoCharts></div> -->
          </div>
          <!--2.25 <div class="child_project_content_right_box">
            <div class="jiaofuwu">
              <div class="title">交付物情况</div>
              <div class="num">
                {{ result.deliveryFileNum || 0 }}
                <span>次</span>
              </div>
              <div><jiaofuwuDetail></jiaofuwuDetail></div>
            </div>
            <div class="success">
              <echartsLiquidfill :num="num"></echartsLiquidfill>
              <div class="wancheng">完成情况</div>
            </div>
          </div> -->
        </el-col>
        <el-col :span="10" class="child_project_content_left">
          <div class="child_project_content_left_riskAndQuestion">
            <div class="title">风险/问题</div>
            <div class="imgs">
              <div style="visibility: hidden">图标</div>
              <div style="width: 35px; text-align: right">
                <img
                  src="./../../../assets/images/sendTableChildren/high.png"
                  width="11px"
                  height="auto"
                  alt=""
                />
                <span style="color: #f5222d">高</span>
              </div>
              <div>
                <img
                  src="./../../../assets/images/sendTableChildren/middle.png"
                  width="11px"
                  height="auto"
                  alt=""
                />
                <span style="color: #ffaa22">中</span>
              </div>
              <div>
                <img
                  src="./../../../assets/images/sendTableChildren/low.png"
                  width="11px"
                  height="auto"
                  alt=""
                />
                <span style="color: #1890ff">低</span>
              </div>
            </div>
            <div class="list">
              <div>风险</div>
              <div v-for="(item, index) in riskList" :key="'riskList' + index">
                <span :style="item.amount == 0 ? 'color:#CCCCCC' : ''">
                  {{ item.amount }}</span
                >
              </div>
            </div>
            <div class="list">
              <div>问题</div>
              <div v-for="(item, index) in question" :key="'riskList' + index">
                <span> {{ item.amount }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<!--
  功能：沙盘子功能 子功能
  汪振涛
  时间：2021年07月22日 10:00:05
  版本：v1.0
-->
<script>
import config from "@/setting.js";
import huibaoCharts from "./Charts/huibaoDetail.vue";
import jiaofuwuDetail from "./Charts//jiaofuwuDetail.vue";
import echartsLiquidfill from "./Charts/echartsLiquidfill.vue";
import {
  getImplementStaticInfo,
  getOperatorNameAndDetailUrl,
} from "@/api/home";
export default {
  components: { huibaoCharts, jiaofuwuDetail, echartsLiquidfill },
  props: {
    index: {
      type: Number,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      menuBtns: [],
      riskList: [
        {
          riskLevel: 0,
          amount: 0,
        },
        {
          riskLevel: 1, //1-轻度 2-中度 3-高度
          amount: 0,
        },
        {
          riskLevel: 2, //1-轻度 2-中度 3-高度
          amount: 0,
        },
      ],
      question: [
        {
          riskLevel: 0,
          amount: 0,
        },
        {
          riskLevel: 1, //1-轻度 2-中度 3-高度
          amount: 0,
        },
        {
          riskLevel: 2, //1-轻度 2-中度 3-高度
          amount: 0,
        },
      ],
      result: {},
      num: null,
      show: false,
      // 文件
      fileList: [],
    };
  },
  methods: {
    format(percentage) {
      return `${percentage}`;
    },
    getQueryOperatorNameAndDetailUrl(projectId) {
      getOperatorNameAndDetailUrl({
        projectId: projectId,
        itemId: 3,
      }).then(
        ({
          data,
          msg,
          data: {
            studyAndPreliminaryNameAndDetailUrlList, //菜单信息
            implementAnddeliveryNameAndDetailUrlList, // btn信息
          },
        }) => {
          if (
            studyAndPreliminaryNameAndDetailUrlList &&
            studyAndPreliminaryNameAndDetailUrlList.length
          ) {
          } else if (
            implementAnddeliveryNameAndDetailUrlList &&
            implementAnddeliveryNameAndDetailUrlList.length
          ) {
            this.menuBtns = implementAnddeliveryNameAndDetailUrlList;
          }
        }
      );
    },
    getQueryImplementStaticInfo(projectId) {
      getImplementStaticInfo({ projectId: projectId }).then(({ data, msg }) => {
        this.result = data;
        this.num = Number(data.deliveryFinishNum) / 100;
        if (data.questionAmountOfLevel) {
          this.question = data.questionAmountOfLevel.reverse();
        }
        if (data.riskAmountOfLevel) {
          this.riskList = data.riskAmountOfLevel.reverse();
        }
          this.fileList =data.weeklyPublication
          && JSON.parse(data.weeklyPublication) || [];
      });
    },
    // 查看文件
    seeFile(file) {
      let token = sessionStorage.getItem("token");
      if (
        //12.27
        ["doc", "docx", "txt", "html", "pdf", "ppt", "pptx", "html"].includes(
          file.name.split(".").pop()
        )
      ) {
        window.open(`${config.baseUrl}/viewPdf?id=${file.id}`);
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
          `${config.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      }
    },
    // 下载文件
    download(file) {
      let token = sessionStorage.getItem("token");
      debugger;
      this.exportFile(
        `${config.baseUrl}/jfzg/file/api/file/downloadStream?key=${file.id}&access_token=${token}`
      );
    },
    //无闪烁跳转
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    //数组填充 倒序
    getLevelAmount(paramsList = [], resultParams = []) {
      resultParams.forEach((item) => {
        paramsList[item.riskLevel + 1].amount = item.amount;
      });
      return paramsList;
    },
    close() {
      this.show = false;
      this.$emit("close");
    },
    open(projectDetail) {
      this.show = true;
      this.getQueryImplementStaticInfo(projectDetail.id);
      this.getQueryOperatorNameAndDetailUrl(projectDetail.id);
    },
    toProjectPath(item) {
      this.$router.push({
        path: item.url,
      });
      let element = {
        url: item.url,
        title: item.permissionName,
      };
      // 更新tabs页签
      this.$store.commit("tabs/UPDATE_TABS_LIST", element);
      this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
    },
  },
};
</script>

<style lang="scss">
.child_project_popover {
  overflow-x: hidden;
  padding: 6px 9px;
  ul {
    li {
      height: 24px;
      line-height: 24px;
      cursor: pointer;
      &:hover {
        background: #f7f7f7;
      }
    }
  }
}
.child_project_popover::-webkit-scrollbar {
  width: 0 !important;
}
.child_project {
  width: calc(100% + 2px);
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.11);
  position: absolute;
  background: #fff;
  z-index: 100;
  border: none;
  overflow: hidden;
  right: -1px;
  top: 180px;
  border-radius: 0 0 8px 8px;
  .child_project_head {
    border-bottom: 1px solid #efefef;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    .menuBtns {
      flex-grow: 1;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .child_project_content {
    height: calc(100% - 40px);
    padding: 0 16px;
    .el-row {
      height: 100%;
      .el-col {
        border-right: 1px solid #efefef;
      }
      .el-col:nth-child(3) {
        border-right: 0px solid #efefef;
      }
      .child_project_content_left {
        height: 100%;

        display: flex;
        justify-content: center;
        > div {
          // width: 50%;
          width: 100%;
          padding: 16px 0;
          .title {
            font-weight: 400;
            color: #999999;
            line-height: 1;
            margin-bottom: 10px;
            font-size: 11px;
          }
        }
        .jindu {
          font-weight: 500;
          color: #333333;
          > span {
            font-weight: 500;
            color: #333333;
            font-size: 28px;
            line-height: 1;
          }
          .el-progress {
            line-height: 1;
            margin: 13px 0;
            .el-progress-bar__outer {
              background: #efefef;
              height: 8px;
            }
            .el-progress__text {
              display: none;
              visibility: hidden;
            }
          }
        }
        .child_project_content_left_riskAndQuestion {
          .title {
            margin-bottom: 12px;
          }
          // border-left: 1px solid #efefef;
          padding: 16px;
          // border-right: 1px solid #efefef;
          .list {
            display: flex;
            justify-content: space-around;
            height: 32px;
            background: #f7f7f7;
            border-radius: 12px;
            align-items: center;
            margin-top: 6px;
            div {
              > span {
                color: #ccc;
              }
            }
            :nth-child(1) {
              div {
                color: red;
              }
            }
          }
          .imgs {
            display: flex;
            justify-content: space-around;
            line-height: 1;
            span {
              font-size: 12px;
              vertical-align: baseline;
            }
          }
        }
      }
      .child_project_content_right {
        height: 100%;
        display: flex;
        justify-content: center;
        .title {
          font-weight: 400;
          color: #999999;
          line-height: 1;
          margin-bottom: 8px;
          font-size: 11px;
        }
        .child_project_content_right_huibao {
          // width: 40%;
          // width: 80%;
          width: 100%;
          padding: 16px;
          .num {
            line-height: 1;
            // font-size: 24px;
            font-size: 28px;
            color: #333333;
            span {
              font-size: 12px;
              color: #333333;
            }
          }
        }
        .child_project_content_right_box {
          // width: 60%;

          padding: 16px;
          border-left: 1px solid #efefef;
          display: flex;
          justify-content: center;
          padding-right: 0;
          .num {
            line-height: 1;
            font-size: 24px;
            color: #333333;
            span {
              font-size: 12px;
              color: #333333;
            }
          }
          .jiaofuwu {
            width: 70%;
          }
          .success {
            width: 30%;
            .wancheng {
              color: #999999;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
// 附件样式
.mess {
  cursor: pointer;
  p {
    span {
      background-color: #f7f7f7;
      display: inline-block;
      // height: 32px;
      // line-height: 32px;
      padding: 5px 10px;
      border-radius: 12px;
    }
    span:hover {
      color: blue;
    }
  }
}
.download:hover {
  color: blue;
}
</style>
