<template>
  <div class="sr-trace-track">
    <div class="sr-trace-track-dialog">
      <el-tabs v-model="activeName">
        <el-tab-pane name="first">
          <div slot="label">
            <span style="font-size: 14px">审核过程</span>
          </div>
          <div>
            <SrStSteps
              :srTraceArr="srTraceArr"
              :srTraceActive="srTraceActive"
              :trackData="srtrackData"
            ></SrStSteps>
          </div>
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

import config from "@/settings.js";
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
      baseUrl: config.uploadBaseUrl,
      srtrackData: [],
      srTraceActive: 0,
      srTraceArr: [
        {
          description: "承建单位项目经理-发起开工申请",
          title: "承建单位项目经理提交",
        },
        {
          description: "监理工程师通过",
          title: "监理工程师通过",
        },
        {
          description: "项目负责人通过",
          title: "项目负责人通过",
        },
        {
          description: "监理工程师-同意开工",
          title: "同意开工",
        },
      ],
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
      this.exportFile(
        `${this.baseUrl}/jfzg/file/api/file/downloadStream?key=${file.id}&access_token=${token}`
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
          "xls",
          "xlsx",
        ].includes(file.name.split(".").pop())
      ) {
        window.open(`${this.baseUrl}/viewPdf?id=${file.id}`);
      } else if (
        ["bmp", "jpg", "jpeg", "gif", "png", "zip", "rar"].includes(
          file.name.split(".").pop()
        )
      ) {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      }else {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
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
      console.log(this.srtrackData)
      console.log(this.srtrackData, "this.srtrackData");
      this.newtraclData = this.trackData.map((item) => {
        item.list.map((item2) => {
          item2.basicList = [];
          item2.extendList = [];

          if (["操作人", "操作时间", "审批结果"].includes(item2.name)) {
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
</style>
