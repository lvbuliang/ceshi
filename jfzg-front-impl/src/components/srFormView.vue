<template>
  <section class="form-config sr-qiankun-view">
    <div class="total-page">
      <el-tabs v-if="flag" v-model="activeName" @click="handleClick">
        <template v-if="jibenxinxislotList && jibenxinxislotList.length">
          <el-tab-pane
            v-for="(item, i) in jibenxinxislotList"
            :label="item"
            :name="item"
            :key="item + i"
          >
            <template slot="label" class="tabsLabel">
              <img
                style="vertical-align: middle"
                src="./../assets/barrage_fill@2x.png"
                width="24px"
                height="auto"
                alt
              />
              <span
                style="color: #333; vertical-align: middle; padding-left: 4px"
                >{{ item }}</span
              >
            </template>
            <slot :name="item"></slot>
          </el-tab-pane>
        </template>
        <el-tab-pane
          v-for="(item, index) in newEditableTabs"
          :key="String(index)"
          :label="item.title"
          :name="String(index)"
        >
          <template v-if="item.title" slot="label" class="tabsLabel">
            <img
              style="vertical-align: middle"
              src="./../assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
              >{{ item.title }}</span
            >
          </template>
          <div v-if="item.formArr && item.formArr.length <= 1">
            <div
              v-for="(item1, index1) in item.formArr"
              :key="index1"
              class="tabsData"
            >
              <div class="tabsDataTitle" v-if="item1.title">
                {{ item1.title }}
              </div>
              <SrView
                v-if="item1.selectData.formView"
                :formData="item1.selectData.formView.config"
                :ruleForm="item1.selectData.formView.data"
              >
                <template :slot="slotSrView" slot-scope="{ value }">
                  <slot :name="slotSrView" :value="value"></slot>
                </template>
              </SrView>
            </div>
          </div>
          <div v-else>
            <el-timeline class="mgt28">
              <el-timeline-item
                v-for="(item1, index1) in item.formArr"
                :key="index1"
                :type="item1.type || 'primary'"
                :color="item1.color"
                class="timeline_class"
                :size="item1.size || 'large'"
              >
                <img :src="imgUrl_timeline" alt="" class="imgUrl_class" />
                <span class="imgUrl_class_title" v-if="item1.title">{{
                  item1.title
                }}</span>
                <SrView
                  v-if="item1.selectData.formView"
                  :formData="item1.selectData.formView.config"
                  :ruleForm="item1.selectData.formView.data"
                >
                  <template :slot="slotSrView" slot-scope="{ value }">
                    <slot :name="slotSrView" :value="value"></slot>
                  </template>
                </SrView>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
        <template v-if="otherslotList && otherslotList.length">
          <el-tab-pane
            v-for="(item, i) in otherslotList"
            :label="item"
            :name="item"
            :key="item + i"
          >
            <template slot="label" class="tabsLabel">
              <img
                style="vertical-align: middle"
                src="./../assets/barrage_fill@2x.png"
                width="24px"
                height="auto"
                alt
              />
              <span
                style="color: #333; vertical-align: middle; padding-left: 4px"
                >{{ item }}</span
              >
            </template>
            <slot :name="item"></slot>
          </el-tab-pane>
        </template>
      </el-tabs>
      <div class="bz-traceTrackView">
        <sr-trace-track
          :imgUrl="imgUrl"
          :trackData="trackData"
          v-if="$route.query.processId && !hideTrackIcon"
        >
          <img src="@/assets/xuanting.png" alt />
        </sr-trace-track>
      </div>
      <div class="com-traceTrackView" v-if="hideTrackIconActivity">
        <sr-trace-track-record
          :trackData="trackData2"
          ref="srTrackTrackRecord"
          class="sr-trace-track-process"
        >
        </sr-trace-track-record>
        <div class="traceTrackBtn" @click="open">
          <img src="@/assets/xuanting.png" alt />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { api_afferentUrlOfGet, api_workFlowimage } from "@/api/index";
import { getList } from "@/api/srtracetrack";
import store from "@/store";
import srTraceTrackRecord from "./srTraceTrackRecord.vue";
export default {
  components: { srTraceTrackRecord },
  name: "SrQiankunView",
  inject: ["baseUrl", "imgBaseUrl", "uploadBaseUrl"],
  props: {
    slotSrView: {
      type: String,
    },
    editableTabs: {
      type: Array,
    },
    slotList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    hideTrackIcon: {
      type: Boolean,
      default: false,
    },
    activeNameT: String, // 展示那个tab栏
    formType: {
      type: String,
      default() {
        return "tabs";
      },
    },
    hideTrackIconActivity: {
      type: Boolean,
      default: false,
    },
    trackData2: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    busiId() {
      return this.$route.query.id;
    },
    busiType() {
      return this.$route.meta.busiType;
    },
  },
  data() {
    return {
      userInfo: store.getters.userInfo,
      jibenxinxislotList: [],
      otherslotList: [],
      activeName: "0",
      fromData: {},
      flag: true,
      imgUrl: "",
      newEditableTabs: [],
      trackData: [],
      imgUrl_timeline: require("@/assets/title_lg.png"),
    };
  },
  mounted() {
    if (this.activeNameT) {
      this.activeName = this.activeNameT;
    }
    if (this.editableTabs && this.editableTabs.length > 0) {
      this.newEditableTabs = this.editableTabs.map((item) => {
        return item;
      });
    }
    this.newEditableTabs.forEach((item) => {
      item.formArr.forEach((item1) => {
        item1.selectData.formView.config.forEach((item2) => {
          if (item2.dataConfig && item2.dataConfig.url) {
            this.dataConfigAjax(
              item2.dataConfig,
              item2.value,
              item1.selectData.formView.data
            );
          }
        });
      });
    });
    if (this.$route.query.processId) {
      api_workFlowimage({ processId: this.$route.query.processId }).then(
        (res) => {
          this.imgUrl = res.data;
        }
      );
      this.getTraceTrack();
    }
    //基本信息特殊处理，永远放在最前面
    if (this.slotList && this.slotList.length > 0) {
      for (var i = 0; i < this.slotList.length; i++) {
        if (this.slotList[i] == "基本信息") {
          this.jibenxinxislotList.push("基本信息");
          this.slotList.splice(i, 1);
          break;
        }
      }
      this.otherslotList = JSON.parse(JSON.stringify(this.slotList));
    }
  },
  methods: {
    open() {
      console.log("$refs", this.$refs);
      this.$refs.srTrackTrackRecord.open();
    },
    handleClick(tab, event) {},
    dataConfigAjax(config, bind, data) {
      this.flag = false;
      if (config.params[0]) {
        var param = {
          [config.params[0].key]: config.params[0].value,
        };
      } else {
        var param = {};
      }
      api_afferentUrlOfGet(config.url, param).then((res) => {
        res.data.forEach((item) => {
          if (data[bind] == item.itemCode) {
            data[bind] = item.chName;
          }
        });
        this.flag = true;
      });
    },
    //留痕轨迹
    getTraceTrack() {
      getList({ busiId: this.busiId, busiType: this.busiType }).then((data) => {
        this.trackData = data.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-timeline-item__tail:last-child {
  display: flex !important;
  border-left: 2px dashed #efefef;
}
::v-deep .el-timeline-item__tail {
  display: flex !important;
  border-left: 2px dashed #efefef;
}
.com-traceTrackView {
  position: absolute;
  right: -24px;
  text-align: right;
  z-index: 999;
  // top: -35px;
  top: 0px;
  width: 106px;
  height: 32px;

  .sr-trace-track-process {
    width: 106px;
    height: 32px;
    background: #e6f7ff;
    border-radius: 16px 0px 0px 16px;
    position: relative;
  }

  .traceTrackBtn {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 12px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #1890ff;
    cursor: pointer;

    &::after {
      // content: '留痕轨迹'
      content: "过程记录";
    }
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 2px;
  }
}
.sr-qiankun-view {
  position: relative;
  .searchPage {
    display: flex;
    justify-content: space-between;
  }
  .searchRightBtn {
    display: inline-block;
    button {
      width: 76px;
      height: 32px;
      border-radius: 16px;
      padding: 5px 24px;
    }
  }
  .tabsLabel {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    i {
      margin-right: 4px;
    }
  }
  .mgt28 {
    margin-top: 28px;
  }
  .timeline_class {
    position: relative;
  }
  .imgUrl_class {
    position: absolute;
    height: 22px;
    width: 22px;
    left: -5px;
    top: -1px;
  }
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 16px;
    }
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
  }

  .tabsDataTitle {
    margin-top: 8px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
    margin-bottom: 13px;
    font-size: 14px;
  }
}
</style>
