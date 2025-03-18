<template>
  <section class="form-config sr-qiankun-view">
    <div class="total-page">
      <el-tabs v-if="flag" v-model="activeName" v-debounce="[() => handleClick(), config.deTime]">
        <!-- <el-tab-pane
          v-for="(item, index) in newEditableTabs"
          :key="String(index)"
          :label="item.title"
          :name="String(index)"
        >
          <template v-if="item.title" slot="label" class="tabsLabel">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt
            />
            <span style="color: #333; vertical-align: middle; padding-left: 4px">{{
              item.title
            }}</span>
          </template>

          <div v-for="(item1, index1) in item.formArr" :key="index1" class="tabsData">
            <div class="tabsDataTitle" v-if="item1.title">{{ item1.title }}</div>
            <SrView
              v-if="item1.selectData.formView"
              :formData="item1.selectData.formView.config"
              :ruleForm="item1.selectData.formView.data"
            ></SrView>
          </div>
        </el-tab-pane> -->
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
                src="@/assets/barrage_fill@2x.png"
                width="24px"
                height="auto"
                alt
              />
              <span style="color: #333; vertical-align: middle; padding-left: 4px">{{
                item
              }}</span>
            </template>
            <slot :name="item"></slot>
          </el-tab-pane>
        </template>
        <template v-if="yearPlanslotList && yearPlanslotList.length">
          <el-tab-pane
            v-for="(item, i) in yearPlanslotList"
            :label="item"
            :name="item"
            :key="item + i"
          >
            <template slot="label" class="tabsLabel">
              <img
                style="vertical-align: middle"
                src="@/assets/barrage_fill@2x.png"
                width="24px"
                height="auto"
                alt
              />
              <span style="color: #333; vertical-align: middle; padding-left: 4px">{{
                item
              }}</span>
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
    </div>
  </section>
</template>
<script>
import {
  api_afferentUrlOfGet,
  api_workFlowimage,
  queryBizunitsByProperty,
  listByTopicAndItem,
  queryAll,
} from "@/api/index";
import { getList } from "@/api/srtracetrack";
import store from "@/store";
import config from "@/settings.js";
export default {
  name: "SrQiankunView",
  inject: ["baseUrl", "imgBaseUrl", "uploadBaseUrl"],
  props: {
    editableTabs: {
      type: Array,
    },
    slotList: {
      type: Array,
      default: () => {
        return []
      }
    },
    slotLyearPlanslotListist: {
      type: Array,
      default: () => {
        return []
      }
    },
    hideTrackIcon: {
      type: Boolean,
      default: false,
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
      config,
      userInfo: store.getters.userInfo,
      activeName: "里程碑审查汇报",
      fromData: {},
      flag: true,
      imgUrl: "",
      newEditableTabs: [],
      bizunitsByPropertyList: [],
      type_list: [],
      zxPlanList: [],
      ztPlanList: [],
      constructionUnitList: [
        { dataName: "无", dataValue: 0 },
        { dataName: "专项规划", dataValue: 1 },
        { dataName: "总体规划", dataValue: 2 },
      ],
      trackData: [],
    };
  },
  created() {
    this.newEditableTabs = this.editableTabs.map((item) => {
      return item;
    });
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
    console.log("this.newEditableTabs", this.newEditableTabs);
    if (this.$route.query.processId) {
      api_workFlowimage({ processId: this.$route.query.processId }).then((res) => {
        this.imgUrl = res.data;
      });
    }
  },
  mounted() {
    this.isProjectLibrary();
    this.getTraceTrack();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
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
        console.log(res);
        res.data.forEach((item) => {
          if (data[bind] == item.itemCode) {
            data[bind] = item.chName;
          }
        });
        this.flag = true;
        console.log(this.editableTabs);
      });
    },
    isProjectLibrary() {
      if (
        this.$route.name == "projectLibraryView" ||
        this.$route.name == "projectLibraryWorkView"
      ) {
        let form = this.newEditableTabs[0].formArr[0].selectData.formView;
        console.log(form, "form");
        if (form.data.planType == "0") {
          form.data.planType = "";
        }
        this.$set(form.data, "projectType", form.data.projectTypeName);
        if (form.data.planType == "") {
          this.$set(form.config[3], "isHideView", true);
          this.$set(form.config[4], "isHideView", true);
          this.$set(form.config[5], "isHideView", true);
          this.$set(form.config[3], "isHide", true);
          this.$set(form.config[4], "isHide", true);
          this.$set(form.config[5], "isHide", true);
          this.$set(form.data, "industryDirection", "");
          this.$set(form.data, "industryDirection", "");
          this.$set(form.data, "planType", "无");
        } else if (form.data.planType == "1") {
          this.$set(form.config[3], "isHideView", false);
          this.$set(form.config[4], "isHideView", false);
          this.$set(form.config[5], "isHideView", true);
          this.$set(form.config[3], "isHide", false);
          this.$set(form.config[4], "isHide", false);
          this.$set(form.config[5], "isHide", true);
          this.$set(form.data, "planType", "专项发展规划");
          this.$set(form.data, "planId", form.data.planName);
        } else if (form.data.planType == "2") {
          this.$set(form.config[3], "isHideView", true);
          this.$set(form.config[4], "isHideView", true);
          this.$set(form.config[5], "isHideView", false);
          this.$set(form.config[3], "isHide", true);
          this.$set(form.config[4], "isHide", true);
          this.$set(form.config[5], "isHide", false);
          this.$set(form.data, "industryDirection", "");
          this.$set(form.data, "planType", "总体发展规划");
          this.$set(form.data, "planId", form.data.planName);
        }
      }
    },
    getQueryBizunitsByProperty() {
      let buPropertyEnum = this.userInfo.currentRole.roleCode.split("_")[0];
      queryBizunitsByProperty({ buPropertyEnum: buPropertyEnum }).then((res) => {
        this.bizunitsByPropertyList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.buName;
          emunObj.dataValue = item.buid;
          return emunObj;
        });
        console.log(this.bizunitsByPropertyList);
      });
    },
    getListByTopicAndItem(callback) {
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        this.type_list = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = String(item.chName);
          emunObj.dataValue = String(item.codeId);
          return emunObj;
        });
        callback(this.type_list);
      });
    },
    getQueryAll(callback) {
      queryAll().then((res) => {
        this.ztPlanList = res.data.zt.map((item) => {
          let ztObj = {};
          ztObj.dataName = String(item.name);
          ztObj.dataValue = String(item.id);
          return ztObj;
        });
        this.zxPlanList = res.data.zx.map((item) => {
          let zxObj = {};
          zxObj.dataName = String(item.name);
          zxObj.dataValue = String(item.id);
          return zxObj;
        });
      });
      callback(this.ztPlanList, this.zxPlanList);
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
  ::v-deep{
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
