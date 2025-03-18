<template>
  <div class="total-page workview">
    <srNavPage :type="3" :project="srNavPageObj"></srNavPage>
    <tabFormView
      class="tabFormView"
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :hideTrackIcon="hideTrackIcon"
    >
      <!-- <innerList slot="年度内项目信息"></innerList> -->
    </tabFormView>
    <sr-work-flow
      v-if="buttonList.length"
      ref="work_flow"
      :taskId="taskId"
      :buttonList="buttonList"
      :backName="`yearplanAudit`"
    ></sr-work-flow>
  </div>
</template>

<script>
import tabFormView from "@/components/srFormView.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import store from "@/store";
import {
  api_specialDetail,
  api_activititodo,
  api_getCustomFormTemplate,
  api_workFlowImage,
} from "@/api/index";
import { viewYearPlan } from "@/api/yearPlan/index";
export default {
  components: {
    tabFormView,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
  data() {
    return {
      imgUrl: require("@/assets/yearplan/yearPlan.png"),
      type: null,
      hideTrackIcon: true,
      editableTabs: [],
      srNavPageObj: {
        projectName: "",
        projectCode: "",
      },
      activeName: "0",
      userInfo: store.getters.userInfo,
      fromData: {},
      taskId: "",
      buttonList: [],
    };
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  created() {
    viewYearPlan({ id: this.$route.query.id }).then((res) => {
      if (res.data.yearPlanFiles) {
        res.data.yearPlanFiles = JSON.parse(res.data.yearPlanFiles);
      }
      if (res.data.files) {
        res.data.files = JSON.parse(res.data.files);
      }
      this.srNavPageObj = res.data;
      console.log("res.data", res.data);

      let data = res.data.data;
      api_getCustomFormTemplate({
        moduleCode: "4001",
        // templateId: this.templateId,
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          item.formArr = JSON.parse(item.formArr);
          item.formArr[0].selectData.formView.data = res.data;
          if (data) {
            JSON.parse(data).forEach((item1, index) => {
              item.formArr[index + 1].selectData.formView.data = item1;
            });
          }
        });
      });
    });
    // api_workFlowImage({processId:this.$route.query.processId}).then(res=>{
    //   console.log(res)
    // })
    // let userinfo = sessionStorage.getItem("userInfo");

    let { roleCode } = this.userInfo.currentRole;
    let { jfid } = this.userInfo;

    let param = {
      owner: jfid,
      role: roleCode,
      processId: this.$route.query.processId,
    };

    api_activititodo(param).then((res) => {
      console.log("RES", res.data);
      let assignee = res.data[0].assignee;

      this.buttonList = [res.data[0].curDesc].filter((item) => {
        //按钮筛选  以assignee优先roleCode
        item.assignee = assignee;
        if (assignee == jfid) {
          return true;
        } else if (roleCode == item.role) {
          return true;
        }
      });
      console.log("this.buttonList", this.buttonList);
      if (this.buttonList[0].operationBtns[0].btnName == "发布") {
        this.hideTrackIcon = false;
      } else {
        this.hideTrackIcon = true;
      }
      this.taskId = res.data[0].taskId;
      console.log(this.buttonList[0].operationBtns[0].btnName, "buttonList");
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
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}
::v-deep .el-tabs {
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
