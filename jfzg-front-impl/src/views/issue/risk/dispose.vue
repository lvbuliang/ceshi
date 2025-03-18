<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <TestFormView
      v-if='editableTabs.length>0'
      ref="srFormView"
      :editableTabs="editableTabs"
      :fromData="fromData"
      :slotList="['风险处理']"
      activeNameT="风险处理"
    >
      <SrAdd
        slot="风险处理"
        :config="form.config"
        :otherConfig="{ labelNum: 144 }"
        :form="form.data"
        ref="formAdd"
      ></SrAdd>
    </TestFormView>

    <sr-work-flow
      v-if="buttonList.length"
      ref="work_flow"
      :hideFrom="true"
      :clickMethods="clickmethods"
      :params="{ projectId: this.$route.query.projectId }"
      :buttonList="buttonList"
      backName="risk"
    ></sr-work-flow>
  </div>
</template>

<script>
import { moduleCode, TYPELIST, FROMLIST, BASISLIST } from "./const.js";

import config from "@/settings.js";
import upload from "@/utils/upload";
import store from "@/store";
import srtracetrack from "@/utils/srtracetrack";
import TestFormView from "@/components/srFormView.vue";
import { listByTopicAndItem, api_getCustomFormTemplate } from "@/api/index";
import { api_getDetailById } from "@/api/projectLibrary";
import { api_getRiskDelitail, api_uploadRectResult } from "@/api/issue";

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
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
    };
  },
  data() {
    return {
      taskId: "",
      userInfo: store.getters.userInfo,
      editableTabs: [],
      activeName: "0",
      srNavPageObj: { name: "", code: "" },
      fromData: {},
      clickmethods: { tg: this.tg },

      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
          ],
          nodes: [],
        },
      ],
      form: {
        config: [
          {
            type: "textarea",
            name: "处理结果",
            placeholder: "请输入处理结果",
            bind: "resultContext",
            append: true,
            maxLength: 500,
            col: 24,
          },
          {
            type: "upload",
            name: "附件",
            bind: "file",
            fileList: [],
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {},
      },
      riskList: [],
      riskBasis: [],
      riskFrom: [],
    };
  },

  methods: {
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
    async tg() {
      let data = this.$refs["formAdd"]?.validate();
      if (!data) return;
      let params = {
        ...data,
        projectId: this.$route.query.projectId,
        riskId: this.$route.query.id,
        file: Array.isArray(data.file) ? JSON.stringify(data.file) : "",
      };
      let res = await api_uploadRectResult(params);
      if (res.msg.code == "0000") {
        this.$message.success("处理成功");
        this.routeClose();

        this.$router.push({
          name: "risk",
          query: { projectId: this.$route.query.projectId },
        });
      }
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subdis", this.$setState);
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
            item.formArr[index].selectData.formView.data = Data;
          });
        });
      });
    },
  },

  created() {
    this.getListByTopicAndItem();
    this.projectInit();
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
