<template>
  <section class="form-config sr-qiankun-view tabs-view">
    <div class="total-page">
      <el-tabs v-if="true" v-model="activeName" @click="handleClick">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="String(index)"
          :label="item.title"
          :name="String(index)"
        >
          <div class="bz-traceTrackView">
            <sr-trace-track
              :imgUrl="imgUrl"
              :params="{ busiId: busiId, busiType: busiType }"
              v-if="$route.query.processId"
            >
              <img src="@/assets/xuanting.png" alt="" />
            </sr-trace-track>
          </div>
          <template slot="label" class="tabsLabel">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span style="color: #333; vertical-align: middle; padding-left: 4px">{{
              item.title
            }}</span></template
          >

          <div v-for="(item1, index1) in item.formArr" :key="index1" class="tabsData">
            <div class="tabsDataTitle">{{ item1.title }}</div>
            <SrView
              v-if="item1.selectData.formView"
              :formData="item1.selectData.formView.config"
              :ruleForm="item1.selectData.formView.data"
            >
            </SrView>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="$route.name == 'yearplanView' || $route.name == 'yearplanAuditView'"
          label="年度内项目信息"
          name="年度内项目信息"
        >
          <template slot="label" class="tabsLabel">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span style="color: #333; vertical-align: middle; padding-left: 4px">
              年度内项目信息
            </span></template
          >

          <innerList> </innerList>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import { api_afferentUrlOfGet } from "@/api/index";
import { api_workFlowimage } from "@/api/index";
import innerList from "../../planedProject/children/list.vue";
import traceTrack from "@/utils/srtracetrack";
export default {
  name: "SrQiankunView",
  inject: ["baseUrl", "imgBaseUrl", "uploadBaseUrl"],
  components: { innerList },
  props: {
    editableTabs: {
      type: Array,
    },
  },
  provide() {
    return {
      traceTrackRequest: traceTrack,
    };
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
      activeName: "0",
      fromData: {},
      flag: false,
      imgUrl: "",
    };
  },
  created() {
    this.editableTabs.forEach((item) => {
      item.formArr.forEach((item1) => {
        item1.selectData.formView.config.forEach((item2) => {
          console.log("selectData", item2.dataConfig);
          if (item2.dataConfig) {
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
      api_workFlowimage({ processId: this.$route.query.processId }).then((res) => {
        this.imgUrl = res.data;
      });
    }
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    dataConfigAjax(config, bind, data) {
      if(config.params[0]){
        var param = {
          [config.params[0].key]: config.params[0].value,
        };
      }else{
        var param = {}
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
<style lang="scss">
.sr-qiankun-view.tabs-view {
  .total-page {
    .searchPage {
      margin-top: 16px;
      .sr_search {
        .el-row {
          display: flex !important;
          align-items: center !important;
        }
        .search-btn {
          margin-top: 36px;
        }
      }
    }
    .el-tabs {
      .el-tabs__header {
        margin-bottom: 0 !important;
      }
      .el-tabs__content {
        padding: 0 !important;
        .tabsDataTitle {
          display: none !important;
        }
        .basicInfo {
          margin-top: 16px;
        }
      }
    }
    .el-tabs__nav-wrap {
      span {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }

      &::after {
        height: 1px;
      }
    }
    
  }
}
</style>
