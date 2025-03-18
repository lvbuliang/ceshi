<template>
  <div class="acceptance">
    <div class="acceptance-tabs">
      <div
        v-for="item in tabs"
        @click="handleCheckTab(item.id)"
        :key="item.id"
        class="acceptance-tabs-item"
        :class="{ active: activeTabindex == item.id }"
        @mouseover="selectStyle(item)"
        @mouseout="outStyle(item)"
      >
        <img
          :src="
            activeTabindex == item.id || item.hoverIndex
              ? item.activeicon
              : item.icon
          "
          alt=""
        />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="acceptance-content">
      <Steps
        class="steps"
        :defaultIndex="stepIndex"
        @stepClick="stepClick"
        v-if="logoInfo && logoInfo.length"
        :list="stepTabs"
      ></Steps>
      <div class="acceptance-content-mess" v-if="logoInfo && logoInfo.length">
        <div v-if="logoInfo.length">
          <el-timeline class="srTrace">
            <el-timeline-item
              :color="activity.color"
              class="track_content"
              v-for="(activity, index) in logoInfo"
              :key="index"
            >
              <div v-if="index < 3">
                <div class="track_title title_track_title">
                  <span>
                    {{ activity.name }}
                  </span>
                  <div class="title_track_title_box">
                    <div
                      class="track_item title_track_item"
                      :class="{
                        result:
                          list[defaultProps.name] &&
                          list[defaultProps.name].includes('结果'),
                        people:
                          list[defaultProps.name] &&
                          list[defaultProps.name].includes('人'),
                        time:
                          list[defaultProps.name] &&
                          list[defaultProps.name].includes('时间'),
                      }"
                      v-for="(list, i) in activity[defaultProps.list]"
                      :key="i"
                    >
                      <div
                        v-if="
                          list[defaultProps.name] &&
                          list[defaultProps.name].includes('结果')
                        "
                      >
                        <span class="name"
                          >{{ list[defaultProps.name] }}：</span
                        >
                        <i
                          :class="[calculateColor(list), calculateIcon(list)]"
                        ></i>
                        <span
                          class="value"
                          :class="calculateColor(list)"
                          v-html="list[defaultProps.value]"
                        ></span>
                      </div>
                      <div
                        v-else-if="
                          list[defaultProps.name] &&
                          list[defaultProps.name].includes('人')
                        "
                      >
                        <span class="name"
                          >{{ list[defaultProps.name] }}：</span
                        >
                        <span
                          class="value"
                          v-html="list[defaultProps.value]"
                        ></span>
                      </div>
                      <div
                        v-if="
                          list[defaultProps.name] &&
                          list[defaultProps.name].includes('时间')
                        "
                      >
                        <span class="name"
                          >{{ list[defaultProps.name] }}：</span
                        >
                        <span
                          class="value"
                          v-html="list[defaultProps.value]"
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="track_box" v-if="activity.flag">
                  <template>
                    <div
                      class="track_item"
                      :class="{
                        advice:
                          list[defaultProps.name] &&
                          list[defaultProps.name].includes('意见'),
                        file: list[defaultProps.fileList],
                      }"
                      v-for="(list, i) in activity[defaultProps.list]"
                      :key="i"
                      v-if="i > 2"
                    >
                      <div v-if="list[defaultProps.fileList]">
                        <span
                          class="name"
                          v-if="list[defaultProps.name] === 'fileId'"
                          >附件：</span
                        >
                        <span class="name" v-else
                          >{{ list[defaultProps.name] }}：</span
                        >
                        <ul class="fileListStyle">
                          <li
                            class="file_item"
                            v-for="(item, index) in typeof list[
                              defaultProps.fileList
                            ] == 'string'
                              ? JSON.parse(list[defaultProps.fileList])
                              : list[defaultProps.fileList]"
                            :key="index"
                          >
                            <div class="left" @click="download(item)">
                              <i class="sr-icon-attachent"></i>
                              <span
                                class="file_name"
                                :title="item.name || item.fileName"
                                >{{ item.name || item.fileName }}</span
                              >
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div
                        v-else-if="
                          list[defaultProps.name] &&
                          list[defaultProps.name].includes('意见')
                        "
                      >
                        <div class="name">{{ list[defaultProps.name] }}：</div>
                        <span
                          class="value"
                          v-html="list[defaultProps.value]"
                        ></span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="seeMore" @click="seeMore" v-else>
                <p>查看更多...</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="acceptance-content-noData" v-else>
        <EmptyFile :title="'暂无内容'"></EmptyFile>
      </div>
    </div>
    <sr-trace-track
      ref="sr-trace-track"
      :imgUrl="''"
      :trackData="logoInfoAll"
    ></sr-trace-track>
  </div>
</template>

<script>
import Steps from "@/components/steps.vue";
import { getCheckInfos } from "@/api/singleProject.js";
import EmptyFile from "./emptyFile.vue";
import config from "@/setting.js";
export default {
  props: {},
  data() {
    return {
      defaultProps: {
        name: "name",
        value: "value",
        fileList: "fileList",
        list: "list",
      },
      logoInfoAll: [],
      activeTabindex: 0,
      tabs: [
        {
          id: 0,
          name: "初验管理",
          icon: require("@/assets/singleProject/single_icon26.png"),
          activeicon: require("@/assets/singleProject/single_icon30.png"),
          hoverIndex: false,
        },
        {
          id: 1,
          name: "试运行管理",
          icon: require("@/assets/singleProject/single_icon07.png"),
          activeicon: require("@/assets/singleProject/single_icon08.png"),
          hoverIndex: false,
        },
        {
          id: 2,
          name: "终验管理",
          icon: require("@/assets/singleProject/single_icon48.png"),
          activeicon: require("@/assets/singleProject/single_icon47.png"),
          hoverIndex: false,
        },
      ],
      stepIndex: 1, // 步骤条当前位置
      stepTabs: [], // 步骤条的节点信息
      logoInfo: {}, // 验收环节的具体信息
      showCon: 1, // 展示第一个或者第二个节点
    };
  },
  created() {
    this.getCheckInfos();
  },
  methods: {
    seeMore() {
      this.$refs["sr-trace-track"].open();
    },
    selectStyle(item) {
      item.hoverIndex = true;
    },
    outStyle(item) {
      item.hoverIndex = false;
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
    calculateIcon(item) {
      let color;
      if (item.value == "通过") {
        color = "el-icon-success";
      } else if (item.value == "不通过") {
        color = "el-icon-error";
      }
      return color;
    },
    // 切换tab
    handleCheckTab(index) {
      this.activeTabindex = index;
      if (index == 0) {
        this.getCheckInfos("15001");
      } else if (index == 1) {
        this.getCheckInfos("15002");
      } else {
        this.getCheckInfos("15003");
      }
    },
    // 点击步骤条第一个节点和第二个节点
    stepClick(index) {
      if (index == 0) {
        this.showCon = 0;
      } else if (index == 1) {
        this.showCon = 1;
      } else {
      }
    },
    // 根据模板编号获取对应的验收管理信息
    getCheckInfos(moudleCode = "15001") {
      const Arr = [];
      getCheckInfos({
        projectId: this.$route.query.projectId,
        moduleCode: moudleCode,
      }).then((res) => {
        this.logoInfo = null;
        if (res.data.status == 1000) {
          this.stepIndex = 2;
        }
        Arr[0] = res.data.firstNode;
        Arr[1] = res.data.nextNode;
        Arr[2] = res.data.stopNode;
        this.stepTabs = Arr;
        if (res.data.logInfo && Array.isArray(res.data.logInfo)) {
          for (let index = 0; index < res.data.logInfo.length; index++) {
            if (res.data.logInfo[index].list[4]) {
              res.data.logInfo[index].list[4].fileList = JSON.parse(
                res.data.logInfo[index].list[4].fileList
              );
            }
          }
          res.data.logInfo = res.data.logInfo.map((item) => {
            if (item.name == "提交") {
              item.flag = false;
            } else if (item.list.length > 3) {
              item.flag = true;
            } else {
              item.flag = false;
            }
            return item;
          });
          if (res.data.logInfo.length > 3) {
            this.logoInfo = res.data.logInfo.slice(0, 4);
          } else {
            this.logoInfo = res.data.logInfo;
          }
          this.logoInfoAll = res.data.logInfo;
        } else {
          this.logoInfo = null;
          this.logoInfoAll = [];
        }
      });
    },
    // 下载文件
    download(item) {
      let token = sessionStorage.getItem("token");
      window.open(
        `${config.baseUrl}/jfzg/file/api/file/download?key=${item.id}&access_token=${token}`
      );
    },
    // 查看文件
    seeFile(item) {
      window.open(`${config.baseUrl}/viewPdf?id=${item.id}`);
    },
  },
  components: {
    // Newwenjian
    Steps,
    EmptyFile,
  },
};
</script>

<style lang="scss">
.acceptance {
  .acceptance-tabs {
    margin-bottom: 27px;
    display: flex;
    .acceptance-tabs-item {
      flex-grow: 1;
      height: 40px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #efefef;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #999999;
      margin-right: 8px;
      cursor: pointer;
      img {
        width: 14px;
        vertical-align: middle;
        margin-right: 3px;
      }
      span {
        display: inline-block;
        vertical-align: middle;
      }
      &.active {
        background: #e6f7ff;
        border-radius: 8px;
        border: 1px solid transparent;
        color: #1890ff;
      }
      &:hover {
        color: #1890ff;
      }
    }
  }
  .acceptance-content {
    .acceptance-content-mess {
      .title {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        margin-bottom: 8px;
        margin-top: 16px;
      }
      .mess {
        padding: 8px 12px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        margin-bottom: 8px;
        background: #fafafa;
      }
      .fileList {
        padding: 8px 12px;
        background: #fafafa;
        margin-bottom: 8px;
        .filebox {
          display: flex;
          align-items: center;
          position: relative;
          &:hover .fileUploadbox {
            .sr-icon-download {
              display: inline-block;
            }
          }
          .username {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            margin-right: 8px;
          }
          .date {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
          }
          .fileUploadbox {
            margin-left: 32px;
            .filename {
              cursor: pointer;
              &:hover {
                color: rgb(24, 144, 255);
              }
            }
            i {
              margin-right: 3px;
            }
            .sr-icon-download {
              display: none;
              position: absolute;
              cursor: pointer;
              right: 0;
              top: 24%;
            }
          }
        }
      }
    }
    .acceptance-content-noData {
      font-size: 16px;
      text-align: center;
      color: #999999;
    }
  }
}
</style>
<style lang="scss" scoped>
.acceptance {
  .seeMore {
    color: #1890ff;
    cursor: pointer;
    font-size: 14px;
    line-height: 22px;
  }
  ::v-deep .steps {
    margin-left: 120px;
    .round_active {
      background: #fff;
      border: 1px solid #1890ff;
      &::before {
        color: #1890ff;
        font-weight: 900;
      }
    }
    .round_current {
      background: #1890ff;
      &::after {
        background: #fff;
        width: 8px;
        height: 8px;
        left: 8px;
        top: 8px;
      }
    }
  }
  ::v-deep.srTrace {
    .fileListStyle {
      display: flex;
      align-items: center;
    }
    .el-timeline-item__tail {
      border-left: 1px dashed #ccc;
    }
    .el-timeline-item:first-of-type .el-timeline-item__node {
      background-color: #1890ff !important;
    }
    .el-timeline-item .el-timeline-item__node {
      background: #ffffff;
      border: 1px solid #cccccc;
    }
    .el-timeline-item {
      padding-bottom: 16px !important;
    }
    .el-timeline-item .el-timeline-item__timestamp.is-bottom {
      margin-top: 0 !important;
    }
    .el-timeline-item:nth-last-child(1) {
      padding-bottom: 0px !important;
    }
    .success {
      padding-left: 3px;
      color: #1890ff !important;
    }
    .error {
      padding-left: 3px;
      color: #ff1313 !important;
    }
  }
}
</style>
