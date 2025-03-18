<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView
      v-if="editableTabs.length"
      :hideTrackIcon="true"
      slotSrView="riskLevel"
      :editableTabs="editableTabs"
      :fromData="fromData"
    >
      <template slot="riskLevel" slot-scope="{ value }">
        <div>
          <img
            v-if="levelImgFun(value)"
            style="width:14px; height:14px; margin-right: 4px;vertical-align: middle;"
            :src="levelImgFun(value)"
            alt
          />
          {{ levelImgFun(value)?value:'-'}}
        </div>
      </template>
    </TestFormView>
    <sr-work-flow
      v-if="buttonList.length && taskId"
      ref="work_flow"
      :taskId="taskId"
      :params="{ projectId: this.$route.query.projectId }"
      :buttonList="buttonList"
      backName="risk"
    ></sr-work-flow>
  </div>
</template>

<script>
import store from "@/store";
import workflows from "@/utils/workflow";
import { moduleCode, TYPELIST, FROMLIST, BASISLIST } from "./const.js";
import srtracetrack from "@/utils/srtracetrack";
import TestFormView from "@/components/srFormView.vue";
import {
  api_activititodo,
  api_getCustomFormTemplate,
  listByTopicAndItem,
} from "@/api/index";
import { api_getDetailById } from "@/api/projectLibrary";
import { api_getRiskDelitail } from "@/api/issue";

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
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows,
    };
  },
  data() {
    return {
      editableTabs: [],
      srNavPageObj: { name: "", code: "" },
      userInfo: store.getters.userInfo,
      fromData: {},
      buttonList: [],
      riskList: [],
      riskBasis: [],
      riskFrom: [],
      taskId: "",
    };
  },

  methods: {
    levelImgFun(val) {
      if (!val || !isNaN(val)) return;
      let index = null;
      if (val.includes("轻") || val.includes("低")) {
        index = 0;
      } else if (val.includes("中")) {
        index = 1;
      } else if (val.includes("高")) {
        index = 2;
      }
      let imgArr = [
        require("@/assets/riskTrouble/low.png"),
        require("@/assets/riskTrouble/middle.png"),
        require("@/assets/riskTrouble/high.png"),
      ];
      return typeof index == "number" ? imgArr[index] : "";
    },
    async getListByTopicAndItem() {
      // 获取风险等级
      let res = await listByTopicAndItem({ topic: "JFZG_DISPATCHRISK_LEVEL" });
      // 依据
      let res2 = await listByTopicAndItem({ topic: "DISPATCH_BASIC" });
      // 来源
      let res3 = await listByTopicAndItem({ topic: "DISPATCH_FORM" });
      if (res?.data) {
        this.$set(this, "riskList", res.data);
      }

      if (res2?.data) {
        this.$set(this, "riskBasis", res2.data);
      }

      if (res3?.data) {
        this.$set(this, "riskFrom", res3.data);
      }
      this.init();
    },
    async projectInit() {
      let res = await api_getDetailById({ id: this.$route.query.projectId });
      if (res?.data) {
        this.srNavPageObj = res.data;
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    async init() {
      let res = await api_getRiskDelitail({ riskId: this.$route.query.id });
      if (res?.data) {
        this.changeSelectData(res.data);
        this.getTemplate(res.data);
      }
    },
    buttonInit() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;
      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.$route.query.processId,
      };
      api_activititodo(param).then((res) => {
        let assignee = res.data[0].assignee;
        this.buttonList = JSON.parse(res.data[0].description).filter((item) => {
          //按钮筛选  以assignee优先roleCode
          item.assignee = assignee;
          if (assignee == jfid) {
            return true;
          } else if (roleCode == item.role) {
            return true;
          }
        });
        this.taskId = res.data[0].taskId;
      });
    },
    changeSelectData(data) {
      if (!data && typeof data !== "object") return data;
      for (const key in data) {
        if (key == "riskType") {
          data[key] = this.$utils.arrFind(TYPELIST, data[key], "value")?.label;
        } else if (key == "riskLevel") {
          data[key] = this.$utils.arrFind(
            this.riskList,
            data[key],
            "itemCode"
          )?.chName;
        } else if (key == "riskFrom") {
          data[key] = this.$utils.arrFind(
            this.riskFrom,
            data[key],
            "itemCode"
          )?.chName;
        } else if (key == "riskBasis") {
          data[key] = this.$utils.arrFind(
            this.riskBasis,
            data[key],
            "itemCode"
          )?.chName;
        }
      }
    },
    //  获取模板
    getTemplate(Data) {
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
        // templateId: this.templateId,
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          this.$set(item, "formArr", JSON.parse(item.formArr));

          item.formArr.forEach((item1, index) => {
            if (item1.selectData.formView) {
              item1.selectData.formView.config = this.addSlot(
                item1.selectData.formView.config,
                "riskLevel",
                { valueSlot: true }
              );
            }
            item.formArr[index].selectData.formView.data = Data;
          });
        });
        let obj = {
          title: "处理",
          formArr: [
            {
              selectData: {
                formView: {
                  config: [
                    {
                      className: "",
                      isHide: false,
                      key: "1625724561000_38961",
                      label: "整改内容",
                      span: 24,
                      type: "value",
                      value: "msgContent",
                    },
                    {
                      className: "",
                      colNum: 3,
                      isHide: false,
                      key: "1625724985000_57366",
                      label: "整改附件",
                      maxFeild: 15,
                      showExpand: true,
                      span: 24,
                      type: "uploader",
                      value: "improveFile",
                    },
                  ],
                  data: Data,
                },
              },
              type: "basicForm",
            },
          ],
        };
        this.editableTabs.push(obj);
        console.log(this.editableTabs);
      });
    },
    addSlot(arr, val, obj, key = "value") {
      return arr.map((item) => {
        if (val == item[key]) {
          return { ...item, ...obj };
        } else {
          return item;
        }
      });
    },
  },

  created() {
    this.getListByTopicAndItem();
    this.projectInit();
    this.buttonInit();
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
