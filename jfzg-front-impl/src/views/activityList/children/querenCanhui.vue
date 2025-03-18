<template>
  <div class="total-page">
    <!-- <sr-nav-page :project="srNavPageObj" :type="2"></sr-nav-page> -->
    <TestFormView
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :fromData="fromData"
    >
    </TestFormView>
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      backName="activityList"
    ></sr-work-flow>
  </div>
</template>

<script>
import TestFormView from "../../../components/srFormView.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import { detail, updateStatus } from "@/api/activityList";
export default {
  components: {
    TestFormView,
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
  provide() {
    return {
      baseUrl: "",
      imgBaseUrl: "",
      uploadRequest: "",
      uploadBaseUrl: "",
    };
  },
  data() {
    return {
      editableTabs: [],
      activeName: "0",
      srNavPageObj: {},
      fromData: {},
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "确认参会",
              btnValue: "queren",
              btnType: "primary",
              btnEventType: "queren",
            },
            {
              btnValue: "jujue",
              btnName: "拒绝参会",
              btnType: "danger",
              btnEventType: "jujue",
            },
          ],
          nodes: [],
        },
      ],
      clickmethods: {
        queren: this.queren,
        jujue: this.jujue,
      },
    };
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    jujue() {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "确认拒绝参会？",
        okFun: () => {
          updateStatus({ reviewId: this.$route.query.id, flag: false }).then(
            ({ data, msg }) => {
              if (data) {
                this.$router.push({ name: "activityList" });
              }
            }
          );
        },
        cancelFun: () => {},
      });
    },
    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subexpert", this.$setState, timeout);
    },
    queren() {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "是否确认参会？",
        okFun: () => {
          updateStatus({ reviewId: this.$route.query.id, flag: true }).then(
            ({ data, msg }) => {
              if (data) {
                this.routeClose();
                this.$router.push({ name: "activityList" });
              }
            }
          );
        },
        cancelFun: () => {},
      });
    },
  },

  created() {
    detail({ id: this.$route.query.id }).then((res) => {
      console.log("res", res);
      if (res.data.file) {
        res.data.file = JSON.parse(res.data.file);
      } else {
        res.data.file = [];
      }
      res.data.projectList = res.data.list
        .map((item) => {
          return item.projectName;
        })
        .join();
      res.data.reviewActivitiesType =
        res.data.reviewActivitiesType == "0"
          ? "函评"
          : res.data.reviewActivitiesType == "1"
          ? "现场评审"
          : "";
      res.data.meetingLength =
        res.data.meetingLength == "0"
          ? "4小时以下"
          : res.data.meetingLength == "1"
          ? "4小时以上"
          : "";
      res.data.meetingType =
        res.data.meetingType == "0"
          ? "线上评审"
          : res.data.meetingType == "1"
          ? "线下评审"
          : "";
      res.data.feePercentage = res.data.feePercentage
        ? res.data.feePercentage + "%"
        : "";
      api_getCustomFormTemplate({
        moduleCode: "24001",
        // templateId: this.templateId,
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          item.formArr = JSON.parse(item.formArr);
          item.formArr[0].selectData.formView.data = res.data;
        });
        for (
          let i = 0;
          i < this.editableTabs[0].formArr[0].selectData.formView.config.length;
          i++
        ) {
          // 会议方式线上评审隐藏线下评审地址
          if (
            this.editableTabs[0].formArr[0].selectData.formView.config[i] &&
            this.editableTabs[0].formArr[0].selectData.formView.config[i]
              .value == "meetingUrl"
          ) {
            if (
              this.editableTabs[0].formArr[0].selectData.formView.data
                .meetingType == "线下评审"
            ) {
              this.editableTabs[0].formArr[0].selectData.formView.config[
                i
              ].isHide = true;
            }
          }
          // 会议方式线下评审隐藏线上评审地址
          if (
            this.editableTabs[0].formArr[0].selectData.formView.config[i] &&
            this.editableTabs[0].formArr[0].selectData.formView.config[i]
              .value == "meetingAddress"
          ) {
            if (
              this.editableTabs[0].formArr[0].selectData.formView.data
                .meetingType == "线上评审"
            ) {
              this.editableTabs[0].formArr[0].selectData.formView.config[
                i
              ].isHide = true;
            }
          }
          // 现场评审时隐藏评审次数
          if (
            this.editableTabs[0].formArr[0].selectData.formView.config[i] &&
            this.editableTabs[0].formArr[0].selectData.formView.config[i]
              .value == "reviewTimes"
          ) {
            if (
              this.editableTabs[0].formArr[0].selectData.formView.data
                .reviewActivitiesType == "现场评审"
            ) {
              this.editableTabs[0].formArr[0].selectData.formView.config[
                i
              ].isHide = true;
            }
          }
        }
      });
    });
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
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
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
.sr-view {
  padding: 8px 0;
}
</style>
