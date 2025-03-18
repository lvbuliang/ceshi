<template>
  <div class="sr-trace-track">
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      top="5vh"
      append-to-body
      @close="dialogVisible = false"
      class="sr-trace-track-dialog"
    >
      <template slot="title">
        <el-tabs v-model="activeName">
          <el-tab-pane name="first">
            <div slot="label">
              <img
                width="24px"
                style="vertical-align: middle"
                height="auto"
                :src="`https://jfzgcsdev.jiefanghao.com/front-res/themes/${theme}/images/other/xuanting.png`"
                alt
              />
              <span>评审记录</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <div class="dialog-content">
        <template v-if="activeName == 'first'">
          <div v-if="lengthWithoutNull">
            <!-- :color="activity.color" -->
            <el-timeline>
              <el-timeline-item
                :color="reviewProgressVoData ? '#1890FF' : ''"
                class="track_content"
                v-if="reviewProgressVoData"
              >
                <div class="track_title title_track_title">
                  <span> 评审过程 </span>
                  <div class="title_track_title_box">
                    <div>
                      <!-- 操作人/操作时间 -->
                      <div class="title_track_item">
                        <span class="name">操作人：</span>
                        <span class="value">{{
                          reviewProgressVoData.creatorName
                        }}</span>
                      </div>
                      <div class="title_track_item">
                        <span class="name">评审时间：</span>
                        <span class="value">{{
                          reviewProgressVoData.startTime
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="track_box"
                  v-if="
                    reviewProgressVoData &&
                    reviewProgressVoData.opinionList &&
                    reviewProgressVoData.opinionList.length > 0
                  "
                >
                  <template>
                    <div
                      v-for="(list, i) in reviewProgressVoData.opinionList"
                      :key="i"
                    >
                      <div class="title_track_item_process">
                        <span class="name">专家姓名：</span>
                        <span class="value">{{ list.expertName }}</span>
                      </div>
                      <div class="title_track_item_process">
                        <span class="name">评审时间：</span>
                        <span class="value">{{ list.expertName }}</span>
                      </div>
                      <div class="title_track_item_process">
                        <span class="name">评审项目：</span>
                        <span class="value">{{ list.projectName }}</span>
                      </div>
                      <div class="track_item">
                        <span class="name">评审意见：</span>
                        <span class="value">{{ list.opinion }}</span>
                      </div>
                      <div class="track_item">
                        <span class="name">评审结论：</span>
                        <span class="value">{{ list.conclusion }}</span>
                      </div>
                      <div class="track_item">
                        <span class="name">评审附件：</span>
                        <ul>
                          <li
                            class="file_item"
                            v-for="(item, index) in typeof list.files ==
                            'string'
                              ? JSON.parse(list.files)
                              : list.files"
                            :key="index"
                          >
                            <div class="left" @click="seeclick(item)">
                              <i class="icon-attachent"></i>
                              <span
                                class="file_name"
                                :title="item.name || item.fileName"
                                >{{ item.name || item.fileName }}</span
                              >
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </template>
                </div>
              </el-timeline-item>
              <el-timeline-item
                :color="reviewProgressVoData ? '' : '#1890FF'"
                class="track_content"
                v-if="newtraclData && newtraclData.length > 0"
              >
                <div class="track_title title_track_title">
                  <span> 专家确认 </span>
                  <div class="title_track_title_box">
                    <div v-for="(list, i) in newtraclData" :key="i">
                      <!-- 操作人/确认时间 -->
                      <div class="title_track_item">
                        <span class="name">操作人：</span>
                        <span class="value">{{ list.expertName }}</span>
                      </div>
                      <div class="title_track_item">
                        <span class="name">确认时间：</span>
                        <span class="value">{{ list.confirmTime }}</span>
                      </div>
                      <!-- 邀请状态 -->
                      <div v-if="list.status != 2" class="title_track_item">
                        <i
                          :class="[
                            list.status == 1
                              ? 'el-icon-info info'
                              : list.status == 3
                              ? 'el-icon-error error'
                              : 'el-icon-success success',
                          ]"
                        ></i>
                        <span class="name">{{ list.statusName }}</span>
                      </div>

                      <!-- {{ list }} -->
                    </div>
                  </div>
                </div>
              </el-timeline-item>
              <el-timeline-item
                :color="newtraclData ? '' : '#1890FF'"
                class="track_content"
                v-if="expertExtractVoDaTa"
              >
                <div class="track_title title_track_title">
                  <span> 专家抽取 </span>
                  <div class="title_track_title_box">
                    <div>
                      <!-- 操作人/操作时间 -->
                      <div class="title_track_item">
                        <span class="name">操作人：</span>
                        <span class="value">{{
                          expertExtractVoDaTa.operatorName
                        }}</span>
                      </div>
                      <div class="title_track_item">
                        <span class="name">操作时间：</span>
                        <span class="value">{{
                          expertExtractVoDaTa.operateTime
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="track_box"
                  v-if="
                    expertExtractVoDaTa &&
                    expertExtractVoDaTa.expertVoList &&
                    expertExtractVoDaTa.expertVoList.length
                  "
                >
                  <template>
                    <div
                      class="track_item"
                      v-for="(list, i) in expertExtractVoDaTa.expertVoList"
                      :key="i"
                    >
                      <div v-if="list.fileList" class="filelist">
                        <!-- <span class="name">{{ 1111 }}：</span> -->
                        <ul>
                          <li
                            class="file_item"
                            v-for="(item, index) in typeof list.fileList ==
                            'string'
                              ? JSON.parse(list.fileList)
                              : list.fileList"
                            :key="index"
                          >
                            <div class="left" @click="seeclick(item)">
                              <i class="icon-attachent"></i>
                              <span
                                class="file_name"
                                :title="item.name || item.fileName"
                                >{{ item.name || item.fileName }}</span
                              >
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div v-else>
                        <span class="name">{{ list.expertName }}：</span>
                        <span class="value">{{ list.statusName }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </el-timeline-item>
              <el-timeline-item
                :color="expertExtractVoDaTa ? '' : '#1890FF'"
                class="track_content"
                v-if="reviewCreationVoData"
              >
                <div class="track_title title_track_title">
                  <span> 评审活动创建 </span>
                  <div class="title_track_title_box">
                    <div>
                      <!-- 操作人/操作时间 -->
                      <div class="title_track_item">
                        <span class="name">操作人：</span>
                        <span class="value">{{
                          reviewCreationVoData.operatorName
                        }}</span>
                      </div>
                      <div class="title_track_item">
                        <span class="name">操作时间：</span>
                        <span class="value">{{
                          reviewCreationVoData.operateTime
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div class="emptyBox" v-else-if="lengthWithoutNull == 0">
            <img
              :src="`https://jfzgcsdev.jiefanghao.com/front-res/themes/${theme}/images/other/empty.png`"
              alt
            />
            <div>暂无数据</div>
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
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  props: {
    defaultProps: {
      type: Object,
      default() {
        return {};
      },
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
      newtraclData: [], //专家确认
      lengthWithoutNull: null,
      expertExtractVoDaTa: null, //专家抽取
      reviewCreationVoData: null, //评审活动创建
      reviewProgressVoData: null, //评审过程
    };
  },
  computed: {
    origin() {
      return sessionStorage.getItem("origin") || "";
    },
  },
  methods: {
    download(file) {
      let token = sessionStorage.getItem("token");
      window.open(
        `${window.location.origin}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
      );
    },
    seeclick(file) {
      let token = sessionStorage.getItem("token");
      if (
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
    getObjectLengthWithoutNullValues(obj) {
      const keys = Object.keys(obj);
      let length = 0;

      for (const key of keys) {
        if (obj[key] !== null) {
          length++;
        }
      }

      return length;
    },
    trackDataIsShow() {
      console.log("shuju", this.trackData);
      this.lengthWithoutNull = this.getObjectLengthWithoutNullValues(
        this.trackData
      );
      console.log("长度", this.lengthWithoutNull);
      //评审过程
      if (this.trackData.reviewProgressVo) {
        this.reviewProgressVoData = this.trackData.reviewProgressVo;
      }
      // 专家确认
      if (
        this.trackData.expertConfirmVo &&
        this.trackData.expertConfirmVo.expertVoList.length > 0
      ) {
        this.newtraclData = this.trackData.expertConfirmVo.expertVoList;
      }
      // 专家抽取
      if (this.trackData.expertExtractVo) {
        this.expertExtractVoDaTa = this.trackData.expertExtractVo;
      }
      // 评审活动创建
      if (this.trackData.reviewCreationVo) {
        this.reviewCreationVoData = this.trackData.reviewCreationVo;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sr-trace-track-dialog {
  .success {
    padding-left: 3px;
    color: #1890ff !important;
  }

  .error {
    padding-left: 3px;
    color: #f5222d !important;
  }

  .warning {
    padding-left: 3px;
    color: #e6a33c !important;
  }
  .info {
    padding-left: 3px;
    color: #909399 !important;
  }

  .el-dialog {
    border-radius: 8px;

    .el-dialog__header {
      padding-bottom: 0;
      padding-top: 0;
      height: 56px;
      line-height: 56px;

      .el-tabs {
        margin: 0 auto;

        .el-tabs__header {
          margin: 0;

          .el-tabs__nav-wrap {
            .el-tabs__nav {
              left: 50%;
              transform: translateX(-50%) !important;
            }

            .el-tabs__item {
              span {
                vertical-align: middle;
                color: rgba(0, 0, 0, 0.85);
              }
            }

            &:after {
              background: transparent;
            }
          }
        }

        .el-tabs__content {
          padding: 0;
        }
      }
    }

    ::v-deep .el-dialog__body {
      padding-top: 24px;

      .dialog-content {
        max-height: 490px;
        text-align: left;

        .flow_img {
          object-fit: cover;
          display: block;
          margin: 0 auto;
          max-width: 100%;
        }
      }

      .emptyBox {
        text-align: center;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      /* 定义滚动条样式 */
      &::-webkit-scrollbar {
        width: 6px;
        height: 100%;
        background-color: #fff;
        border-radius: 50%;
      }

      // /*定义滚动条轨道 内阴影+圆角*/
      // ::-webkit-scrollbar-track {
      //   box-shadow: inset 0 0 0px red;
      //   border-radius: 10px;
      //   background-color: red;
      // }

      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        background: #bfcbda;
        border-radius: 2px;
      }
    }

    ::v-deep .el-dialog__footer {
      padding: 0;

      .dialog-footer {
        height: 56px;
        text-align: center;
        padding: 0;
        line-height: 56px;

        .el-button {
          padding: 8px 24px;
        }
      }
    }
  }

  ::v-deep .el-timeline {
    ::v-deep .el-timeline-item {
      text-align: left;
      padding: 0;
      margin-bottom: 16px;

      &:first-of-type {
        .el-timeline-item__node {
          border: none;
          background-color: #1890ff !important;
        }
      }

      .el-timeline-item__node {
        background-color: #fff;
        border: 1px solid #cccccc;
      }

      &:last-of-type {
        padding-bottom: 0;
      }

      .el-timeline-item__node--normal {
        top: 3px;
        width: 8px;
        height: 8px;
        left: 1px;
      }
    }
  }

  .el-timeline-item__tail {
    border-left: 1px dashed #cccccc;
    top: 12px;
    height: 105%;
  }
}

.left {
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
}
.xian_left {
  display: flex;
  align-items: center;
  .el-icon-view {
    margin: 0 24px;
  }
  .el-icon-view,
  .icon-download {
    cursor: pointer;
    display: none;
    &:hover {
      color: #1890ff;
    }
  }
  .file_name {
    color: #333 !important;
    margin-right: 40px;
  }
  .time {
    width: 135px;
    white-space: nowrap;
  }
  &:hover {
    cursor: inherit;
    .el-icon-view,
    .icon-download {
      display: inline-block;
    }
  }
}

.el-tabs__content {
  padding: 16px 0px;
  padding-top: 0;

  .el-tab-pane {
    height: 100%;

    .flow_img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}

.track_title {
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  width: 605px;
}
.title_track_item_process {
  display: inline-block;
  margin-left: 20px;

  .name {
    color: #666;
  }

  .value {
    color: #333;
  }
}
.track_box {
  background: #f7f7f7;
  padding: 16px 0;

  .track_item {
    display: inline-block;
    width: 95%;
    margin-left: 16px;
    margin-bottom: 8px;
    line-height: 22px;

    // >div {
    //   display: flex;
    // }
    .filelist {
      display: flex;
    }
    .name {
      color: #666;
    }

    .value {
      color: #333;
      word-break: break-all;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.title_track_title {
  // display: flex;

  .title_track_title_box {
    font-weight: 400;

    .title_track_item {
      display: inline-block;
      margin-left: 20px;

      .name {
        color: #666;
      }

      .value {
        color: #333;
      }
    }
  }
}

.br {
  width: 100%;
  display: flex;
  margin: 0;
  line-height: 0;

  .name {
    margin-bottom: 4px;
  }
}

.file {
  width: 95%;
  margin-left: 16px;

  > div {
    display: flex;

    .name {
      line-height: 32px;
    }
  }
}

.file_item {
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;

  .preview,
  .download {
    cursor: pointer;
    color: #40a9ff;
    margin-left: 16px;
  }

  .file_name {
    margin-left: 6px;
    display: inline-block;
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    .file_name {
      color: #40a9ff;
    }
  }
}

.viewer-backdrop {
  z-index: 999999 !important;
  background: #fff !important;
}

.viewer-navbar {
  background-color: rgba(255, 255, 255, 1) !important;
}
</style>
  