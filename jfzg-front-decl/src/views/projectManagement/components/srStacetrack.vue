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
        <!-- <el-tab-pane name="second" v-if="imgUrl">
          <div slot="label">
            <span style="font-size: 14px">流程图</span>
          </div>
        </el-tab-pane> -->
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
                  <div v-for="(item, index) in activity.list" :key="index">
                    <div class="title_track_title_box">
                      <div
                        class="title_track_item"
                        v-for="(list, i) in item.basicList"
                        :key="i"
                      >
                        <!-- 审核结果通过不通过 -->
                        <div v-if="list.name && list.name.includes('结果') && !activity.name.includes('发起')">
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
                          <div v-if="list.name && !list.name.includes('结果')">
                            <span class="name">{{ list.name }}：</span>
                            <span class="value" v-html="list.value"></span>
                          </div>
                        </div>
                        <!-- 审核结果通过不通过  v-if="(activity.color && list.name=='操作时间') || (activity.color && list.name=='操作人')"-->
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
                                <div
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
                                  <!-- <el-popover
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
                                  </el-popover> -->
                                </div>
                                <!-- 12.22 -->
                                <div class="left">
                                  <i class="icon-attachent"></i>
                                  <span
                                    class="file_name"
                                    :title="item.name || item.fileName"
                                    @click="seeclick(item)"
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
          description: "客户经理-发起立项",
          title: "客户经理发起立项提审",
        },
        {
          description: "客户经理-集团审议",
          title: "集团审议通过",
        },
        {
          description: "方案经理-内部立项",
          title: "内部立项通过",
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
    getNowTime(date) {
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    download(file) {
    const noSpaceStr = file.id.replace(/\s+/g, '');
      let token = sessionStorage.getItem("token");
      this.exportFile(
        `${this.baseUrl}/jfzg/file/api/file/downloadStream?key=${noSpaceStr}&access_token=${token}`
      );
    },
    seeclick(file) {
      const newSee = file.id.replace(/\s+/g, '');
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
        window.open(`${this.baseUrl}/viewPdf?id=${newSee}`);
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
          `${this.baseUrl}/jfzg/file/api/file/download?key=${newSee}&access_token=${token}`
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
      if (item.color == "SUCCESS") {
        return "success";
      } else {
        return "error";
      }
    },
    setSpan(val) {
      if (val.color == "SUCCESS") {
        return "通过";
      } else {
        if(val.name.includes("不通过")) {
          return "不通过";
        }else if(val.name.includes("退回") || val.name.includes("退回修改")) {
          return "退回修改"
        }
      }
    },
    open() {
      this.dialogVisible = true;
    },
    trackDataIsShow() {
      this.srtrackData = this.trackData;
      this.trackData.forEach((ele) => {
        ele.list.forEach((ele1) => {
          if (ele1.fileList) {
            if (JSON.parse(ele1.fileList)[0] && JSON.parse(ele1.fileList)[0].id == "") {
              ele1.fileList = null;
            }
          }
        });
      });
      this.newtraclData = this.trackData.map((item) => {
        item.list.map((item2) => {
          item2.basicList = [];
          item2.extendList = [];
          if (["操作人", "操作时间", "审批结果"].includes(item2.name)) {
          // if (["操作人", "操作时间", "审批结果"].includes(item2.name) || item2.name.includes("日期") || item2.name.includes("时间") ) {
            item2.basicList.push(item2);
          } else {
            item2.extendList.push(item2);
          }
          return item2;
        });
        return item;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.success {
  color: rgb(24, 144, 255);
}
.error {
  color: rgb(245, 34, 45);
}
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
.icon-download {
  cursor: pointer;
  color: black;
  font-size: 20px;
}
</style>
