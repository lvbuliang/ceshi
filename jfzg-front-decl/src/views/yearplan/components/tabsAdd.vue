<template>
  <section class="form-config sr-qiankun-add">
    <div class="total-page">
      <el-tabs v-model="activeName" @click="handleClick">
        <el-tab-pane
          v-for="(item, index) in newEditableTabs"
          :key="String(index)"
          :name="String(index)"
        >
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
          <div v-for="(item1, index2) in item.formArr" :key="index2" class="tabsData">
            <div class="tabsDataTitle">{{ item1.title }}</div>
            <SrAdd
              :key="index2"
              :config="item1.selectData.formAdd.config"
              :enums="item1.selectData.formAdd.enums"
              :form="item1.selectData.formAdd.data"
              :ref="`add${index2}`"
            ></SrAdd>
          </div>
        </el-tab-pane>
      </el-tabs>
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
import { api_afferentUrlOfGet,api_workFlowimage } from "@/api/index";
import { getList } from "@/api/srtracetrack";
export default {
  name: "SrQiankunAdd",
  inject: ["baseUrl", "imgBaseUrl", "uploadBaseUrl"],
  props: {
    editableTabs: {
      type: Array,
    },
    fromData: {
      type: Object,
    },
    hideTrackIcon: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    newEditableTabs: {
      handler(el) {},
      deep: true, //true 深度监听
    },
    fromData: {
      handler: function (value) {
        if (value) {
          this.newEditableTabs[0].formArr[0].selectData.formAdd.data = value;
        }
      },
    },
  },
  data() {
    return {
      activeName: "0",
      newEditableTabs: [],
      trackData: [],
      imgUrl: "",
    };
  },
  created() {
    this.newEditableTabs = this.editableTabs.map((item) => {
      if(typeof item.formArr==='string' ){

        item.formArr = JSON.parse(item.formArr);
      }else{
        item.formArr=item.formArr
      }
      return item;
    });
    if (this.fromData) {
      this.newEditableTabs[0].formArr[0].selectData.formAdd.data = this.fromData;
    }

    this.newEditableTabs.forEach((item) => {
      item.formArr.forEach((item1) => {
        item1.selectData.formAdd.config.forEach((item2) => {
          if (item2.dataConfig && item2.dataConfig.url) {
            console.log(item2);
            this.dataConfigAjax(
              item2.dataConfig,
              item2.dataList,
              item1.selectData.formAdd.enums
            );
          }
        });
      });
    });
    this.getNowTime();
  },
  mounted() {
    if (this.$route.query.processId) {
      api_workFlowimage({ processId: this.$route.query.processId }).then(
        (res) => {
          this.imgUrl = res.data;
        }
      );
      this.getTraceTrack();
    }
    this.$forceUpdate();
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
    // 获取当前日期
    getNowTime() {
      var date = new Date();
      var nowMonth = date.getMonth() + 1;
      var strDate = date.getDate();
      var seperator = "-";
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
      var nowYear = date.getFullYear().toString();
      this.$set(
        this.newEditableTabs[0].formArr[0].selectData.formAdd.data,
        "planYear",
        nowYear
      );
      this.$set(
        this.newEditableTabs[0].formArr[0].selectData.formAdd.data,
        "startTime",
        nowDate
      );
    },
    dataConfigAjax(config, dataList, enums) {
      let param = {};
      config.params.forEach((item) => {
        param[item.key] = item.value;
      });

      api_afferentUrlOfGet(config.url, param).then((res) => {
        enums[dataList] = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.chName;
          emunObj.dataValue = item.itemCode;
          return emunObj;
        });
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
.sr-qiankun-add {
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
.loc {
  top: 0px;
}
.total-page {
  position: relative;
}
</style>
