<template>
  <div class="total-page">
    <div v-if="editableTabs.length > 0">
      <div v-if="!get_success">
        <navBox class="navBox" />
        <TestFormAdd
          v-if="!id || fromData"
          ref="formAdd"
          :fromData="fromData"
          :editableTabs="editableTabs"
        ></TestFormAdd>
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          :params="{ projectId: this.$route.query.projectId }"
          :backName="$route.query.routeName ? $route.query.routeName : 'risk'"
          ref="work_flow"
          :workFlowLoading="workFlowLoading"
        ></sr-work-flow>
      </div>
      <div v-else>
        <SuccessMsg name="风险" />
      </div>
    </div>
  </div>
</template>

<script>
import SuccessMsg from "@/components/success_msg.vue";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";

import { moduleCode } from "./const.js";
import TestFormAdd from "@/components/srFormAdd.vue";
import { api_getCustomFormTemplate, listByTopicAndItem } from "@/api/index";
import {
  api_submitRiskInfo,
  api_editRiskInfo_noLoading,
  api_getRiskDelitail,
} from "@/api/issue";
import navBox from "@/components/navBox.vue"
export default {
  components: {
    TestFormAdd,
    SuccessMsg,
    navBox
  },
  computed: {
    ...mapGetters(["msg"]),
  },
  watch: {
    msg: function (n, o, y) {
      if (n == "主应用请求保存表单") {
        this.btg("close");
      }
    },
    get_success: function (n) {
      this.routeUpdata();
    },
    $route(to) {
      this.$set(this, "editableTabs", []);
      if (to.name == "riskAdd") {
        this.createdfunc();
      }
    },
  },
  data() {
    return {
      projectId: this.$route.query.projectId,
      id: this.$route.query.id,
      workFlowLoading: false,
      slotName: "",
      projectObj: {},
      editableTabs: [],
      fromData: {},
      addRiskForm: {},
      activeName: "0",
      templateId: this.$route.query.templateId,
      clickmethods: { tg: this.tg, btg: this.btg },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交并下发",
              btnValue: "tg",
              btnType: "default",
              btnEventType: "tg",
            },
            {
              btnValue: "btg",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "btg",
            },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      // 自动化新增参数集
      timer: "",
      isNew: false,
      get_success: false,
      /************************************************/
    };
  },
  methods: {
    getRiskFromList() {
      // 风险来源
      listByTopicAndItem({ topic: "DISPATCH_FORM" }).then((res) => {
        if (res && res.success && res.data.length > 0) {
          this.addRiskForm.enums.riskFromList = this.$utils.enumsDataNameValue(
            res.data,
            "chName",
            "itemCode"
          );
        }
      });
    },
    getRiskBasisList() {
      // 风险定级依据
      listByTopicAndItem({ topic: "DISPATCH_BASIC" }).then((res) => {
        if (res && res.success && res.data.length > 0) {
          this.addRiskForm.enums.riskBasisList = this.$utils.enumsDataNameValue(
            res.data,
            "chName",
            "itemCode"
          );
        }
      });
    },
    /*
     * 自动化新增方法集
     */
    routeUpdata() {
      var routerBase = "/subdis";
      setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },
    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subdis", this.$setState, timeout);
    },

    createdfunc() {
      clearInterval(this.timer);
      this.isNew = false;
      this.get_success = false;

      if (this.$route.query.id) {
        this.init(this.$route.query.id);
      } else if (
        getSession("infoId_risk" + this.$route.query.projectId) &&
        getSession("infoId_risk" + this.$route.query.projectId) != "null"
      ) {
        this.init(getSession("infoId_risk" + this.$route.query.projectId));
        this.timer = setInterval(this.getsetInterval, this.$SrUtils.autoSaving());
      } else {
        api_getCustomFormTemplate({
          moduleCode: moduleCode,
          // templateId: this.templateId,
        }).then((res) => {
          if (res.data && res.msg.code == "0000") {
            this.editableTabs =
              typeof res.data.templateDetail == "string" &&
              JSON.parse(res.data.templateDetail);
            this.editableTabs.map((item, index) => {
              if (typeof item.formArr == "string") {
                item.formArr = JSON.parse(item.formArr);
              } else {
                item.formArr = item.formArr;
              }
              if (index == 0) {
                if (item.formArr.length > 0) {
                  this.addRiskForm = item.formArr[0].selectData.formAdd;
                }
              }
            });
            console.log(this.editableTabs, "editableTabs");
            debugger;
            this.getRiskFromList();
            this.getRiskBasisList();
            this.templateId = res.data.id;
          }
        });
        this.timer = setInterval(this.getsetInterval, this.$SrUtils.autoSaving());
      }
    },
    getsetInterval() {
      this.btg("linshi_current");
    },
    /********************************************************************/
    projectInit(val) {
      // 项目信息
      this.$set(this, "projectObj", val);
    },
    handleClick(tab, event) {},
    async tg() {
      let data = this.$refs["formAdd"]?.validateFun();
      if (!data) return;
      let obj = data.data
        ? this.$utils.resultObject(JSON.parse(data.data))
        : {};

      let params = {
        ...data,
        ...obj,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        otherFile: Array.isArray(data.otherFile)
          ? JSON.stringify(data.otherFile)
          : "",
      };

      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      } else if (
        getSession("infoId_risk" + this.$route.query.projectId) &&
        getSession("infoId_risk" + this.$route.query.projectId) != "null"
      ) {
        params.id = getSession("infoId_risk" + this.$route.query.projectId);
        this.isNew = true;
      }

      let res2 = await api_submitRiskInfo(params);

      if (res2.msg.code == "0000") {
        removeSession("infoId_risk" + this.$route.query.projectId);
        clearInterval(this.timer);
        if (this.isNew) {
          this.get_success = true;
        } else {
          this.$message.success("新增成功");
          this.routeClose();

          this.$router.push({
            name: "risk",
            query: { projectId: this.$route.query.projectId },
          });
        }
      }
    },
    async btg(str) {
      if (!this.$refs["formAdd"]) return;
      let data = this.$refs["formAdd"].validate();
      let obj = data.data
        ? this.$utils.resultObject(JSON.parse(data.data))
        : {};

      let params = {
        ...data,
        ...obj,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        otherFile: Array.isArray(data.otherFile)
          ? JSON.stringify(data.otherFile)
          : "",
      };

      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }

      if (str == "linshi_current") {
        // 是否是自动保存的数据
        params.editable = true;
      } else {
        params.editable = false;
      }
      if (
        getSession("infoId_risk" + this.$route.query.projectId) &&
        getSession("infoId_risk" + this.$route.query.projectId) != "null"
      ) {
        // 自动保存拿到的id
        params.id = getSession("infoId_risk" + this.$route.query.projectId);
        this.isNew = true;
      }

      this.workFlowLoading = true;
      let res = await api_editRiskInfo_noLoading(params);
      if (res.msg.code == "0000") {
        this.btgFun(str, res.data);
        this.workFlowLoading = false;
      }
    },
    btgFun(str, data) {
      if (str == "linshi_current") {
        setSession("infoId_risk" + this.$route.query.projectId, data);
      } else if (str == "close") {
        removeSession("infoId_risk" + this.$route.query.projectId);
        this.$message.success("保存成功");
      } else {
        clearInterval(this.timer);
        this.$message.success("保存成功");
        removeSession("infoId_risk" + this.$route.query.projectId);
        if (this.isNew) {
          this.get_success = true;
        } else {
          this.routeClose();

          this.$router.push({
            name: "risk",
            query: { projectId: this.$route.query.projectId },
          });
        }
      }
    },

    sumFun(obj) {
      let sum = 0;
      for (const key in obj) {
        sum += obj[key] * 1;
      }
      return sum;
    },
    async init(id) {
      let res = await api_getRiskDelitail({ riskId: id });
      if (res?.data) {
        let { otherFile, riskLevel, riskType, riskBasis, riskFrom } = res.data;
        res.data.otherFile = otherFile && JSON.parse(otherFile);

        // res.data.riskLevel =
        //   riskLevel && typeof riskLevel == "number"
        //     ? riskLevel.toString()
        //     : riskLevel;
        // res.data.riskType =
        //   riskType && typeof riskType == "number"
        //     ? riskType.toString()
        //     : riskType;
        // res.data.riskBasis =
        //   riskBasis && typeof riskBasis == "number"
        //     ? riskBasis.toString()
        //     : riskBasis;
        // res.data.riskFrom =
        //   riskFrom && typeof riskFrom == "number"
        //     ? riskFrom.toString()
        //     : riskFrom;
        console.log(Object.is(riskLevel, null));
        if (Object.is(riskLevel, null)) {
          riskLevel = 0;
        }
        res.data.riskLevel = riskLevel + "";
        res.data.riskType = riskType + "";
        res.data.riskBasis = riskBasis + "";
        res.data.riskFrom = riskFrom + "";
        this.getTemplate(res.data);
      }
    },
    //  获取模板
    getTemplate(Data) {
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
        // templateId: this.templateId,
      }).then((res) => {
        this.editableTabs =
          typeof res.data.templateDetail == "string" &&
          JSON.parse(res.data.templateDetail);
        this.editableTabs.map((item, index) => {
          if (typeof item.formArr == "string") {
            item.formArr = JSON.parse(item.formArr);
          } else {
            item.formArr = item.formArr;
          }
          if (index == 0) {
            if (item.formArr.length > 0) {
              this.addRiskForm = item.formArr[0].selectData.formAdd;
              if (Data) {
                this.addRiskForm.data = Data;
              }
            }
          }
        });
        this.getRiskFromList();
        this.getRiskBasisList();
        // this.editableTabs.forEach((item) => {
        //   this.$set(item, "formArr", JSON.parse(item.formArr));
        //   item.formArr.forEach((item1, index) => {
        //     item.formArr[index].selectData.formAdd.data = Data;
        //   });
        // });
        console.log("risk.add.editableTabs", this.editableTabs);
      });
    },
    getConfigBind(arr, key) {
      // 获取数组里对应键的值
      return Array.isArray(arr) && arr.map((item) => item[key]);
    },
    forInItem(obj, val) {
      // 根据对应字段获取对象里对应的键和值
      if (typeof obj != "object" && typeof val != "string") return false;
      let newObj = {};
      for (const key in obj) {
        if (val.includes(key)) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    },
  },
  created() {
    this.createdfunc();
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    clearInterval(this.timer);
    removeSession("infoId_risk" + this.$route.query.projectId);

    next();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    removeSession("infoId_risk" + this.$route.query.projectId);
  },
};
</script>
<style lang="scss" scoped>
.searchPage {
  display: flex;
  justify-content: space-between;
}
::v-deep .fundPlan {
  .sumTitle {
    display: inline-block;
    width: 190px;
    text-align: right;
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
</style>
