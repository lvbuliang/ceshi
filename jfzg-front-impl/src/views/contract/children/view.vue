<template>
  <div class="contractView">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <div class="total-page">
      <el-tabs v-model="activeName" @click="handleClick">
        <el-tab-pane
          v-for="(item, index) in newEditableTabs"
          :key="String(index)"
          :label="item.title"
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
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
              >{{ item.title }}</span
            ></template
          >

          <div v-if="item.formView" class="tabsData">
            <!-- <div class="tabsDataTitle">{{ item.title }}</div> -->
            <SrView
              v-if="item.formView"
              :formData="item.formView.config"
              :ruleForm="item.formView.data"
            >
            </SrView>
          </div>
          <div v-if="item.fundListIdnex">
            <fundList
              :projectId="$route.query.projectId"
              :parentId="$route.query.id"
              :viewType="viewType"
            />
          </div>
          <div v-if="item.subcontractIndex">
            <subcontractList
              :projectId="$route.query.projectId"
              :parentId="$route.query.id"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <WorkFlow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      :backName="'contract'"
    ></WorkFlow>
  </div>
</template>

<script>
import moment from "moment";
import TestFormView from "../../../components/srFormView.vue";
import WorkFlow from "../../../components/SrWorkFlow";
import subcontractList from "./subcontract/subcontractList.vue";
import fundList from "./fund/fundList.vue";
import {
  api_getCustomFormTemplate,
  queryBizunitsByProperty,
} from "@/api/index";
import { getDetailById } from "@/api/projectLibrary/index.js";
import {
  api_getContractDetail,
  api_getFundList,
  api_getTableList,
} from "@/api/contract/index.js";
export default {
  components: {
    TestFormView,
    WorkFlow,
    subcontractList,
    fundList,
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
      viewType: "view",
      subcontractIndex: false,
      fundListIdnex: false,
      formView: {
        config: [],
        data: {},
      },
      newEditableTabs: [],
      moduleCode: "13001",
      editableTabs: [],
      activeName: "0",
      srNavPageObj: { name: "", code: "" },
      fromData: {},
      statusList: {
        1: "已签订",
        2: "未签订",
      },
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
    };
  },

  methods: {
    handleClick(val) {
      console.log(val);
    },
    async init() {
      let res = "";
      let resProject = await getDetailById({ id: this.$route.query.projectId });
      if (this.$route.query.type == "fundList") {
        this.viewType = "edit";
        this.newEditableTabs = [
          {
            title: "资金使用计划",
            fundListIdnex: true,
          },
        ];
      } else {
        res = await api_getContractDetail({ id: this.$route.query.id });
      }
      if (res?.data) {
        res.data.contractFile = res.data.contractFile
          ? JSON.parse(res.data.contractFile)
          : [];
        res.data.otherFile = res.data.otherFile
          ? JSON.parse(res.data.otherFile)
          : [];
        this.getTemplate(res.data);
        // 处理承建单位回显
        if (res.data.contractUnitName) {
          res.data.contractUnit = res.data.contractUnitName;
        }
        // 处理监理单位回显
        if (res.data.controlUnitName) {
          res.data.controlUnit = res.data.controlUnitName;
        }
      }
      if (resProject?.data) {
        this.srNavPageObj = {
          projectName: resProject.data.projectName,
          projectCode: resProject.data.projectCode,
        };
      }
    },
    getTableList() {
      let params = {
        parentId: this.$route.query.id,
        pageNo: 1,
        pageSize: 10,
      };
      api_getTableList(params).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data.records.length) {
            this.newEditableTabs.push({
              title: "子合同",
              subcontractIndex: true,
            });
          }
        }
      });
    },
    getFundList() {
      let params = {
        contractId: this.$route.query.id,
        pageNo: 1,
        pageSize: 10,
      };
      api_getFundList(params).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data.records.length) {
            this.newEditableTabs.push({
              title: "资金使用计划",
              fundListIdnex: true,
            });
          }
        }
      });
    },
    //  获取模板
    getTemplate(Data) {
      api_getCustomFormTemplate({
        moduleCode: this.moduleCode,
      }).then((res1) => {
        let editableTabs = JSON.parse(res1.data.templateDetail);
        let formView = {};
        editableTabs.forEach((item) => {
          this.$set(item, "formArr", JSON.parse(item.formArr));
          item.formArr.forEach((item1, index) => {
            if (Data.contractDuration) {
              let contractDuration = JSON.parse(Data.contractDuration);
              if (contractDuration && contractDuration.length > 0) {
                Data.contractDuration =
                  moment(contractDuration[0]).format("YYYY-MM-DD") +
                  " ~ " +
                  moment(contractDuration[1]).format("YYYY-MM-DD");
              } else {
                Data.contractDuration = "";
              }
            } else {
              Data.contractDuration = "";
            }

            Data.signTime = Data.signTime
              ? moment(Data.signTime).format("YYYY-MM-DD")
              : "";
            Data.status = Data.statusName;
            item.formArr[index].selectData.formView.data = Data;
            formView = item.formArr[index].selectData.formView;
          });
        });
        if (this.$route.query.parentId) {
          this.newEditableTabs = [
            ...this.newEditableTabs,
            {
              title: "子合同信息",
              formView: formView,
            },
          ];
        } else {
          this.newEditableTabs = [
            ...this.newEditableTabs,
            {
              title: "合同信息",
              formView: formView,
            },
          ];
        }
        if (this.$route.query.type != "fundList") {
          this.getTableList();
          this.getFundList();
        }
        console.log(this.newEditableTabs);
      });
    },
  },

  created() {
    this.init();
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
.contractView {
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
    margin-bottom: 16px;
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
  ::v-deep .total-page {
    position: relative;
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
    .el-tabs__content {
      padding: 0;
    }
  }
}
</style>
