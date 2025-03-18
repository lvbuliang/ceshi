<template>
  <section class="form-config sr-qiankun-add">
    <div class="total-page">
      <el-tabs
        @tab-click="handleTabClick"
        v-model="activeName"
        :class="this.notab || this.notop ? 'notab' : ''"
      >
        <template v-if="slotList && slotList.length">
          <el-tab-pane
            v-for="(item, i) in slotList"
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
              >
                {{ item }}
              </span>
            </template>
            <slot :name="item"></slot>
          </el-tab-pane>
        </template>
        <el-tab-pane
          v-for="item in newEditableTabs"
          :key="item.name"
          :name="item.name"
        >
          <template slot="label" class="tabsLabel" v-if="item.title">
            <img
              style="vertical-align: middle"
              src="./../assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
              >{{ item.title }}</span
            ></template
          >
          <div v-if="item.formArr && item.formArr.length <= 1 && istab">
            <div
              v-for="(item1, index2) in item.formArr"
              :key="index2"
              class="tabsData"
            >
              <div class="tabsDataTitle">{{ item1.title }}</div>
              <div v-if="special">
                <SrAdd
                  :key="index2"
                  :config="item1.selectData.formAdd.config"
                  :enums="item1.selectData.formAdd.enums"
                  :form="fromData"
                  :otherConfig="item1.selectData.formAdd.otherConfig"
                  :ref="`add${index2}`"
                ></SrAdd>
              </div>
              <div v-else>
                <ProjectStageFormAdd
                  @selectData="selectData"
                  v-if="projectStage"
                ></ProjectStageFormAdd>
                <SrAdd
                  :key="index2"
                  :config="item1.selectData.formAdd.config"
                  :enums="item1.selectData.formAdd.enums"
                  :form="item1.selectData.formAdd.data"
                  :otherConfig="item1.selectData.formAdd.otherConfig"
                  :ref="`add${index2}`"
                ></SrAdd>
              </div>
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
                <span class="imgUrl_class_title">{{
                  item1.title || "多个标签请输入标题"
                }}</span>
                <div v-if="special">
                  <SrAdd
                    :key="'add' + index1"
                    :config="item1.selectData.formAdd.config"
                    :enums="item1.selectData.formAdd.enums"
                    :otherConfig="item1.selectData.formAdd.otherConfig"
                    :form="fromData"
                    :ref="`add${index1}`"
                  ></SrAdd>
                </div>
                <div v-else>
                  <SrAdd
                    :key="'add' + index1"
                    :config="item1.selectData.formAdd.config"
                    :enums="item1.selectData.formAdd.enums"
                    :form="item1.selectData.formAdd.data"
                    :otherConfig="item1.selectData.formAdd.otherConfig"
                    :ref="`add${index1}`"
                  ></SrAdd>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-timeline class="mgt28" v-if="customize.length > 0">
        <el-timeline-item
          v-for="(item3, index3) in customize"
          :key="index3"
          type="primary"
          class="timeline_class"
          size="large"
        >
          <img :src="imgUrl_timeline" alt="" class="imgUrl_class" />
          <span class="imgUrl_class_title">{{ item3 }}</span>
          <slot name="historyProjectFile"></slot>
        </el-timeline-item>
      </el-timeline>
      <div class="bz-traceTrackView loc">
        <sr-trace-track
          :imgUrl="imgUrl"
          :trackData="trackData"
          v-if="$route.query.processId && !hideTrackIcon"
        >
          <img src="@/assets/xuanting.png" alt />
        </sr-trace-track>
      </div>
    </div>
  </section>
</template>
<script>
import { api_afferentUrlOfGet, api_workFlowimage } from "@/api/index";
import { getList } from "@/api/srtracetrack";
import config from "@/settings.js";
import upload from "@/utils/upload";
import ProjectStageFormAdd from "./ProjectStageFormAdd.vue";
export default {
  name: "SrQiankunAdd",
  components: { ProjectStageFormAdd },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      previewUrl: config.previewUrl,
    };
  },
  props: {
    editableTabs: {
      type: Array,
    },
    customize: {
      type: Array,
      default: () => {
        return [];
      },
    },
    hideTrackIcon: {
      type: Boolean,
      default: false,
    },
    fromData: {
      type: Object,
    },
    istab: {
      type: Boolean,
      default: true,
    },
    notop: {
      type: Boolean,
      default: false,
    },
    slotList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //预留节点，一般不使用
    special: {
      type: Boolean,
      default: false,
    },
    activeNameT: String, // 展示那个tab栏
    projectStage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      notab: false,
      activeName: "0",
      trackData: [],
      newEditableTabs: [],
      imgUrl: "",
      imgUrl_timeline: require("@/assets/title_lg.png"),
    };
  },
  watch: {
    newEditableTabs: {
      handler(el) {},
      deep: true, //true 深度监听
    },
    fromData: {
      handler(val) {
        this.setFormData();
      },
      deep: true,
    },
  },
  mounted() {
    if (this.activeNameT) {
      this.activeName = this.activeNameT;
    }
    if (this.$route.query.processId) {
      api_workFlowimage({ processId: this.$route.query.processId }).then(
        (res) => {
          this.imgUrl = res.data;
        }
      );
      this.getTraceTrack();
    }
    this.$nextTick(() => {
      this.newEditableTabs = this.editableTabs.map((item) => {
        if (typeof item.formArr == "string") {
          item.formArr = JSON.parse(item.formArr);
        } else {
          item.formArr = item.formArr;
        }
        return item;
      });
      this.newEditableTabs.forEach((item) => {
        if (item.title == "") {
          this.notab = true;
        }
      });
      this.handleTabClick(this.newEditableTabs[0]);
      this.setFormData();
    });
  },
  computed: {
    busiId() {
      return this.$route.query.id;
    },
    busiType() {
      return this.$route.meta.busiType;
    },
  },
  methods: {
    selectData(val1, val2) {
      console.log("接收子传递", val1, val2);
      this.$emit("selectData", val1, val2);
    },
    validate() {
      let arr = [];
      this.newEditableTabs[0].formArr.forEach((item, index) => {
        if (index != 0) {
          arr.push(item.selectData.formAdd.data);
        }
      });
      let param = {
        ...this.newEditableTabs[0].formArr[0].selectData.formAdd.data,
        data: JSON.stringify(arr),
      };
      return param;
    },
    resetForm() {
      this.$refs.add0[0].resetForm();
    },
    validateFun() {
      // 校验多个form表单
      let flagArr = [];
      let arr = [];
      let param = {};
      this.newEditableTabs.forEach((child, i) => {
        child.formArr.forEach((item, index) => {
          arr.push(item.selectData.formAdd.data);
          let flag = this.$refs["add" + index][0].validate();
          param = {
            ...item.selectData.formAdd.data,
            data: JSON.stringify(arr),
          };
          flagArr.push(flag);
        });
      });
      return flagArr.some((item) => !item) ? false : param;
    },
    dataConfigAjax(config, dataList, enums) {
      let param = {};
      config.params.forEach((item) => {
        param[item.key] = item.value;
      });
      api_afferentUrlOfGet(config.url, param).then((res) => {
        enums[dataList] = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.chName || item.yearPlanName;
          emunObj.dataValue = item.itemCode || item.id;
          return emunObj;
        });
      });
    },
    setFormData() {
      if (JSON.stringify(this.fromData) !== "{}") {
        this.$set(
          this.newEditableTabs[0].formArr[0].selectData.formAdd,
          "data",
          this.fromData
        );
        this.$forceUpdate();
      }
    },
    handleTabClick(e) {
      this.activeName = e.name;
      this.newEditableTabs.forEach((item) => {
        if (item.name === e.name) {
          item.formArr.forEach((item1) => {
            item1.selectData.formAdd.config.forEach((item2) => {
              if (item2.dataConfig && item2.dataConfig.url) {
                this.dataConfigAjax(
                  item2.dataConfig,
                  item2.dataList,
                  item1.selectData.formAdd.enums
                );
              }
            });
          });
        }
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
.loc {
  top: 0px;
}
.total-page {
  position: relative;
}
</style>
<style lang="scss">
.sr-qiankun-add {
  .notab {
    .el-tabs__header {
      display: none;
    }
  }

  .el-tabs__nav-wrap {
    &::after {
      height: 1px;
    }
  }

  .el-tabs__content {
    padding: 0;
  }

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

  ::v-deep .el-tabs__header {
    margin-bottom: 8px;
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
