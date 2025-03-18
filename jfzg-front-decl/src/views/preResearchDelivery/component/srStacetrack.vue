<template>
  <div class="sr-trace-track">
    <div class="sr-trace-track-dialog">
      <el-tabs v-model="activeName">
        <el-tab-pane name="first">
          <div slot="label">
            <span style="font-size: 14px">{{ trackForm.title }}</span>
          </div>

          <div>
            <div class="step_title">
              <div class="borders"></div>
              <div class="steps_text">审核流程</div>
            </div>
            <div class="step">
              <div class="steps">
                <el-steps
                  style="width: 100%"
                  :active="activeCurrent"
                  align-center
                  finish-status="success"
                  v-if="this.lookStatus != 1081"
                >
                  <el-step title="客户经理-发起预研交付" class="no-line" />
                  <el-step title="评审小组-预研交付评审" />
                  <el-step title="客户经理-通过预研交付" />
                </el-steps>
              </div>
            </div>
          </div>
          <!-- <div v-if="false"> -->
          <!-- <div>
            <SrStSteps
              :srTraceArr="SetsrTraceArr"
              :srTraceActive="srTraceActive"
              :trackData="srtrackData"
            ></SrStSteps>
          </div> -->
        </el-tab-pane>
        <el-tab-pane name="second" v-if="imgUrl">
          <div slot="label">
            <span style="font-size: 14px">流程图</span>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="dialog-content">
        <template v-if="activeName == 'first'">
          <div v-if="newtraclData.length">
            <el-timeline>
              <el-timeline-item
                :color="activity.color"
                class="track_content"
                v-for="(activity, index) in newtraclData"
                :key="index"
              >
                <div class="track_title title_track_title">
                  <span>
                    {{ activity.name }}
                  </span>
                  <div v-for="item in activity.list">
                    <div class="title_track_title_box">
                      <div
                        class="title_track_item"
                        v-for="(list, i) in item.basicList"
                        :key="i"
                      >
                        <!-- 审核结果通过不通过 -->
                        <div v-if="list.name && list.name.includes('结果')">
                          <span class="name">{{ list.name }}：</span>
                          <i
                            :class="[
                              list.color === 'SUCCESS'
                                ? 'el-icon-success success'
                                : 'el-icon-error error',
                            ]"
                            v-if="
                              ['SUCCESS', 'ERROR', 'FAIL'].includes(list.color)
                            "
                          ></i>
                          <span
                            :class="calculateColor(list)"
                            v-html="list.value"
                          ></span>
                        </div>
                        <!-- 操作人/操作时间 -->
                        <div v-else>
                          <span class="name">{{ list.name }}：</span>
                          <span class="value" v-html="list.value"></span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="track_box"
                      v-if="item.extendList && item.extendList.length"
                    >
                      <template>
                        <div
                          class="track_item"
                          v-for="(list, i) in item.extendList"
                          :key="i"
                        >
                          <div v-if="list.fileList" class="filelist">
                            <span class="name">{{ list.name }}：</span>
                            <ul>
                              <li
                                class="file_item"
                                v-for="(item, index) in typeof list.fileList ==
                                'string'
                                  ? JSON.parse(list.fileList)
                                  : list.fileList"
                                :key="index"
                              >
                                <!-- <div
                                  class="xian_left"
                                  v-if="origin.includes('xian')"
                                >
                                  <i class="icon-attachent"></i>
                                  <span
                                    class="file_name"
                                    :title="item.name || item.fileName"
                                    >{{ item.name || item.fileName }}</span
                                  >
                                  <div class="time" v-if="item.createTime">
                                    {{ item.createTime }}
                                  </div>
                                  <el-popover
                                    placement="top"
                                    width="54"
                                    trigger="hover"
                                    content="查看"
                                  >
                                    <div class="btn" slot="reference">
                                      <i
                                        @click="seeclick(item)"
                                        class="el-icon-view"
                                      ></i>
                                    </div>
                                  </el-popover>
                                  <el-popover
                                    placement="top"
                                    width="54"
                                    trigger="hover"
                                    content="下载"
                                  >
                                    <div class="btn" slot="reference">
                                      <i
                                        @click="download(item)"
                                        class="icon-download"
                                      ></i>
                                    </div>
                                  </el-popover>
                                </div> -->
                                <!-- 12.22 -->
                                <div class="left" @click="seeclick(item)">
                                  <i class="icon-attachent"></i>
                                  <span
                                    class="file_name"
                                    :title="item.name || item.fileName"
                                    >{{ item.name || item.fileName }}</span
                                  >
                                  <i
                                    @click.stop="download(item)"
                                    class="icon-download"
                                  ></i>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div v-else>
                            <span class="name">{{ list.name }}：</span>
                            <span class="value" v-html="list.value"></span>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div class="emptyBox" v-else>
            <img src="@/assets/empty.png" alt />
            <div v-if="trackLoading">数据加载中，请稍后！</div>
            <div v-else>暂无数据</div>
          </div>
        </template>

        <template v-if="activeName == 'second'">
          <viewer
            style="background: #fff"
            class="viewer"
            :images="[`data:text/html;base64,${imgUrl}`]"
            alt="流程图"
          >
            <img
              class="flow_img"
              :src="`data:text/html;base64,${imgUrl}`"
              alt="流程图"
            />
          </viewer>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SrStSteps from "@/components/srStaceTrackSteps.vue";
export default {
  components: {
    SrStSteps,
  },
  props: {
    defaultProps: {
      type: Object,
      default() {
        return {};
      },
    },
    trackLoading: {
      type: Boolean,
      default: () => false,
    },
    imgUrl: {
      type: String,
      default() {
        return "";
      },
    },
    trackData: {
      type: Array,
      default() {
        return [];
      },
    },
    theme: {
      type: String,
      default() {
        return "default";
      },
    },
    trackForm: {
      type: Object,
      default() {
        return {
          title: "审核过程",
          isShow: true,
        };
      },
    },
  },
  watch: {
    trackData: {
      handler() {
        this.trackDataIsShow();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      activeName: "first",
      dialogVisible: false,
      newtraclData: [],
      srTraceArr: [],
      srTraceActive: 0,
      srtrackData: [],
      // preStatus: sessionStorage.getItem("preStatus") || "",
      preStatus: this.$route.query.status||'',
    };
  },
  created() {
    if (
      this.preStatus == "1" ||
      this.preStatus == "202" ||
      this.preStatus == "302"
    ) {
      this.activeCurrent = 0;
    } else if (this.preStatus == "2") {
      this.activeCurrent = 1;
    } else if (this.preStatus == "301") {
      this.activeCurrent = 2;
    } else if (this.preStatus == "1000") {
      this.activeCurrent = 3;
    }
  },
  computed: {
    origin() {
      return sessionStorage.getItem("origin") || "";
    },
    SetsrTraceArr() {
      if (this.$route && this.$route.fullPath.includes("projectDisclosure")) {
        return [
          {
            description: "客户经理-发起交底",
            title: "发起交底",
          },
          {
            description: "方案经理-交底确认",
            title: "交底确认",
          },
          {
            description: "项目负责人-交底审核",
            title: "交底审核",
          },
        ];
      }
      if (this.$route && this.$route.fullPath.includes("preResearchDelivery")) {
        return [
          {
            description: "客户经理-发起预研交付",
            title: "预研交付申请",
          },
          {
            description: "评审小组-预研交付评审",
            title: "预研交付评审",
          },
          {
            description: "客户经理-通过预研交付",
            title: "通过申请",
          },
        ];
      }
    },
  },
  methods: {
    download(file) {
      let token = sessionStorage.getItem("token");
      this.exportFile(
        `${window.location.origin}/jfzg/file/api/file/downloadStream?key=${file.id}&access_token=${token}`
      );
    },
    seeclick(file) {
      let token = sessionStorage.getItem("token");
      if (
        //12.27
        [
          "doc",
          "docx",
          "txt",
          "html",
          "pdf",
          "ppt",
          "pptx",
          "html",
          "ofd",
        ].includes(file.name.split(".").pop())
      ) {
        window.open(`${window.location.origin}/viewPdf?id=${file.id}`);
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
          `${window.location.origin}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      }
    },
    //无闪烁跳转
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    calculateColor(item) {
      let color;
      if (item.value == "通过") {
        color = "success";
      } else if (item.value == "不通过") {
        color = "error";
      }

      return color;
    },
    open() {
      this.dialogVisible = true;
    },
    trackDataIsShow() {
      this.srtrackData = this.trackData;
      this.newtraclData = this.trackData.map((item) => {
        item.list.map((item2) => {
          item2.basicList = [];
          item2.extendList = [];
          if (["操作人", "操作时间", "审批结果", "单位"].includes(item2.name)) {
            item2.basicList.push(item2);
          } else {
            item2.extendList.push(item2);
          }
          // item.list.forEach((res) => {

          // });
          return item2;
        });
        return item;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.track_title {
  width: 100%;
}
.track_box .track_item {
  font-weight: normal;
  font-size: 14px;
}
.title_track_title_box {
  margin-bottom: 8px;
  margin-top: 8px;
}
// 解决查看页面最后一个时间线不显示问题
::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  display: block;
}
.emptyBox {
  text-align: center;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.flow_img {
  object-fit: cover;
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
.step {
  display: flex;
  justify-content: center;
  .steps {
    width: 75%;
    ::v-deep .el-step.is-center .el-step__description {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      margin-top: 10px;
    }
  }
}
.step_title {
  display: flex;
  align-items: center;
  width: 50%;
  font-weight: 700;
  font-size: 16px;
  margin: 0 0 10px 0;
  padding-top: 10px;
  .borders {
    width: 4px;
    height: 14px;
    border-radius: 5px;
    background: rgb(1, 118, 255);
    margin: 0 5px;
  }
  .steps_text {
    font-size: 16px;
    font-weight: 500;
  }
}
::v-deep .el-step__line {
  // border-color: #d3dce6; /* 未完成的颜色 */
  // border-style: dashed; /* 虚线 */
  border: 1.5px dashed #d3dce6;
}

::v-deep .el-step__line-inner {
  // border-color: #409eff; /* 已完成的颜色 */
  // border: 2px dashed #409eff !important;
  // height: 1px !important;
  border: 0;
}

::v-deep .el-step__icon {
  background: #fff; // 未完成的背景色
  color: #d3dce6;
}

::v-deep .is-process .el-step__icon {
  // background-color: #409eff; /* 进行中的背景色 */
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

::v-deep .is-finish .el-step__icon {
  // background-color: #409eff; /* 已完成的背景色 */
  // color: #fff;
  // background: #000 !important;

  // background-color: #409eff; /* 进行中的背景色 */
  background: #409eff;
  border-color: #409eff;
}
::v-deep .el-step__title {
  color: black; /* 完成步骤的文字颜色为黑色 */
}

.no-line .el-step__line {
  display: none;
}
::v-deep.el-step.is-horizontal .el-step__line {
  // height: 0.1px !important;
  background: #fff !important;
}
::v-deep.el-step .is-process-done {
  background-color: blue !important;
}
::v-deep .is-success .is-text {
  background: #409eff !important;
  border: none;
}
::v-deep .is-success .el-step__line {
  border: 1.5px dashed #409eff;
}
::v-deep .el-step__head.is-success {
  .el-icon-check:before {
    color: #fff;
  }
}
.name_loader {
  display: flex;
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
