<template>
  <div class="total-page">
    <sr-nav-page :type="3" :project="srNavPageObj"></sr-nav-page>
    <tabFormView
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :fromData="fromData"
      :slotList="slotList"
    >
    <!-- :yearPlanId="yearPlanId" -->
      <innerList
        :ifHideAddBtn="true"
        :year="yearPlanId"
        slot="年度内项目信息"
      ></innerList>
    </tabFormView>
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      :backName="$route.name.includes('Audit') ? 'yearplanAudit' : 'yearplan'"
    ></sr-work-flow>
  </div>
</template>

<script>
import tabFormView from "@/components/srFormView.vue";
// import innerList from "../../planedProject/children/list.vue";
// import innerList from "../components/list.vue";
import innerList from "../components/planedList.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import { viewYearPlan } from "@/api/yearPlan/index";
export default {
  components: {
    tabFormView,
    innerList,
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
      imgUrl: require("@/assets/yearplan/yearPlan.png"),
      editableTabs: [],
      slotList: [],
      srNavPageObj: {
        projectName: "",
        projectCode: "",
      },
      activeName: "0",
      fromData: {},
      project: {
        projectName: "年度项目计划名称",
        projectCode: "年度项目计划编号",
        name: "123",
        code: "123",
      },
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
      backName: "",
      yearPlanId: null,
    };
  },

  methods: {
    //  获取模板
    getTemplate(Data) {
      api_getCustomFormTemplate({
        moduleCode: "4001",
        // templateId: this.templateId,
      }).then((res1) => {
        if (res1.data.templateDetail) {
          this.editableTabs = JSON.parse(res1.data.templateDetail);
        }
        this.editableTabs.forEach((item) => {
          this.$set(item, "formArr", JSON.parse(item.formArr));
          item.formArr[0].selectData.formView.data = Data;
          if (Data.data) {
            Data.data.forEach((item1, index) => {
              item.formArr[index + 1].selectData.formView.data = item1;
            });
          }
        });
      });
    },
    // 获取详情
    getDetail() {
      viewYearPlan({ id: this.$route.query.id }).then((res) => {
        console.log("res.data", res.data);
        this.srNavPageObj = res.data;
        // this.yearPlanId = res.data.id;
        this.yearPlanId=res.data.planYear
        // 发布后才可看到年度内项目信息
        if (res.data.status === "1000") {
          this.$set(this, "slotList", ["年度内项目信息"]);
        } else {
          this.$set(this, "slotList", []);
        }

        if (res.data.yearPlanFiles) {
          res.data.yearPlanFiles = JSON.parse(res.data.yearPlanFiles);
        }
        if (res.data.files) {
          res.data.files = JSON.parse(res.data.files);
        }
        this.getTemplate(res.data);
      });
    },
  },

  created() {
    this.getDetail();
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
::v-deep .searchPage {
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
::v-deep .el-tabs {
  .el-tabs__header {
    margin-bottom: 0 !important;
  }
  .el-tabs__content {
    padding: 0 !important;
    .sr_table {
      .el-table__fixed-right {
        height: 100% !important;
      }
    }
    .tabsDataTitle {
      display: none !important;
    }
    .basicInfo {
      margin-top: 16px;
    }
  }
}
</style>
