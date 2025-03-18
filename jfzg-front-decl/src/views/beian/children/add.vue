<template>
  <div class="total-page">
    <div v-if="editableTabs.length > 0">
      <div v-if="!get_success">
           <sr-nav-page :type="2" :project="projectObj"></sr-nav-page>
        <TestFormAdd
          v-if="!id || fromData"
          ref="formAdd"
          :fromData="fromData"
          :editableTabs="editableTabs"
          :slotList="['基本信息']"
        >
          <ProjectBaseMessage
            slot="基本信息"
            :projectId="$route.query.projectId"
             @projectInit="projectInit"
          />
        </TestFormAdd>
        <WorkFlow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          :workFlowLoading="workFlowLoading"
          ref="work_flow"
          backName="beianList"
        ></WorkFlow>
      </div>
      <div v-else>
        <SuccessMsg name="项目备案申报" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  saveBeian,
  submitBeian,
  queryBeianDetail,
  getChengjianUnit,
} from "@/api/beian/index";
import { moduleCode } from "../const.js";
import TestFormAdd from "@/components/srFormAdd.vue";
import WorkFlow from "@/components/SrWorkFlow";
import ProjectBaseMessage from "@/components/projectBaseMessage";
import config from "@/settings.js";
import upload from "@/utils/upload";
import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import { setIntervaltime } from "@/utils/common";
import SuccessMsg from "@/components/success_msg.vue";
import {
  api_getCustomFormTemplate,
  api_specialDetail,
  api_getSpecialSave,
  api_getSpecialUpdate,
} from "@/api/index";
export default {
  components: {
    TestFormAdd,
    WorkFlow,
    ProjectBaseMessage,
    SuccessMsg,
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
      if (to.name == "beianAdd") {
        this.createdfunc();
      }
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
      workFlowLoading:false,
      timer: "",
      isNew: false,
      get_success: false,
      projectId: this.$route.query.projectId,
      id: this.$route.query.id,
      editableTabs: [],
      fromData: {},
      activeName: "0",
      templateId: this.$route.query.templateId,
      clickmethods: { tg: this.tg, btg: this.btg },
      projectObj:{},
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
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
    };
  },
  methods: {
        projectInit(val) {
      // 项目信息
      this.$set(this, "projectObj", val);
    },
    routeUpdata() {
      var routerBase = "/subshenbao";
      setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },
    handleClick(tab, event) {
    },
    getsetInterval() {
      this.btg("linshi_current");
    },
    createdfunc() {
      clearInterval(this.timer);
      this.isNew = false;
      this.get_success = false;
      if (this.$route.query.id) {
        this.init();
      } else if (
        getSession("infoId_beianProject" + this.$route.query.projectId) &&
        getSession("infoId_beianProject" + this.$route.query.projectId) !=
          "null"
      ) {
        // this.init(
        //   getSession("infoId_beianProject" + this.$route.query.projectId)
        // );
        this.timer = setInterval(this.getsetInterval, this.$SrUtils.autoSaving());
      } else {
        api_getCustomFormTemplate({
          moduleCode: moduleCode,
          // templateId: this.templateId,
        }).then((res) => {
          this.editableTabs = JSON.parse(res.data.templateDetail);
          this.templateId = res.data.id;
          this.chuli();
        });
        this.timer = setInterval(this.getsetInterval, this.$SrUtils.autoSaving());
      }
    },
    // 获取承建单位列表
    getChengjianUnit(callback) {
      let data = {
        buPropertyEnum: "CJDW",
      };
      getChengjianUnit(data).then((res) => {
        let type_list = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.buName;
          emunObj.dataValue = item.buid;
          return emunObj;
        });
        callback(type_list);
      });
    },
    chuli(){
      this.editableTabs.forEach((item) => {
            this.$set(item, "formArr", JSON.parse(item.formArr));  
            this.getChengjianUnit((rs) => {
              this.$set(item.formArr[0].selectData.formAdd.enums, "responsibilityUnitList", rs)
            });
          });
    },
    // 提交
    tg() {
      let data = this.$refs["formAdd"].validateFun();
      if(!data) return
      data.projectId = this.$route.query.projectId || this.projectId;
      if (data.constructionPlanFile && data.constructionPlanFile.length > 0) {
        data.constructionPlanFile = JSON.stringify(data.constructionPlanFile);
      } else {
        data.constructionPlanFile = "";
      }
      if (data.contractFile && data.contractFile.length > 0) {
        data.contractFile = JSON.stringify(data.contractFile);
      } else {
        data.contractFile = "";
      }
      if (data.otherFile && data.otherFile.length > 0) {
        data.otherFile = JSON.stringify(data.otherFile);
      } else {
        data.otherFile = "";
      }
      data.templateId = this.templateId;
      data.status = "2";
      if (this.$route.query.id) {
        data.id = this.$route.query.id;
      } else if (
        getSession("infoId_beianProject" + this.$route.query.projectId) &&
        getSession("infoId_beianProject" + this.$route.query.projectId) !=
          "null"
      ) {
        data.id = Number(
          getSession("infoId_beianProject" + this.$route.query.projectId)
        );
        this.isNew = true;
      }
      else {
        this.isNew = false;
      }
      submitBeian(data).then((res) => {
        if (res.msg.code == "0000") {
          removeSession("infoId_beianProject" + this.$route.query.projectId);
          this.$message.success("提交成功");
          clearInterval(this.timer);
          if (this.isNew == true) {
            this.get_success = true;
          } else {
            this.routeClose()
            this.$router.push({ name: "beianList" });
          }
        }
      });
    },
    // 保存
    btg(str) {
      let data = this.$refs["formAdd"].validate();
      data.projectId = this.$route.query.projectId || this.projectId;
      data.templateId = this.templateId;

      if (data.constructionPlanFile && data.constructionPlanFile.length > 0) {
        data.constructionPlanFile = JSON.stringify(data.constructionPlanFile);
      } else {
        data.constructionPlanFile = "";
      }
      if (data.contractFile && data.contractFile.length > 0) {
        data.contractFile = JSON.stringify(data.contractFile);
      } else {
        data.contractFile = "";
      }
      if (data.otherFile && data.otherFile.length > 0) {
        data.otherFile = JSON.stringify(data.otherFile);
      } else {
        data.otherFile = "";
      }
      if (str == "linshi_current") {
        data.temporary = 1;
      }
      if (this.$route.query.id) {
        data.id = this.$route.query.id;
      }
      if (
        getSession("infoId_beianProject" + this.$route.query.projectId) &&
        getSession("infoId_beianProject" + this.$route.query.projectId) !=
          "null"
      ) {
        data.id = Number(
          getSession("infoId_beianProject" + this.$route.query.projectId)
        );
        this.isNew = true;
      }
      else {
        this.isNew = false;
      }
      data.status = data.status?data.status:"1";
      this.workFlowLoading = true
      saveBeian(data).then((res) => {
        if (res.msg.code == "0000") {
          if (str == "linshi_current") {
            setSession(
              "infoId_beianProject" + this.$route.query.projectId,
              res.data
            );
          } else if (str == "close") {
            removeSession("infoId_beianProject" + this.$route.query.projectId);
            this.$message.success("保存成功");
          } else {
            clearInterval(this.timer);
            this.$message.success("保存成功");
            removeSession("infoId_beianProject" + this.$route.query.projectId);
            if (this.isNew == true) {
              this.get_success = true;
            } else {
              this.routeClose()
              this.$router.push({ name: "beianList" });
            }
          }
          this.workFlowLoading = false
        }
      });
    },

    routeClose(timeout){
      this.$SrUtils.routeClose.call(this,'subshenbao',this.$setState,timeout)
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
    async init() {
      let res = await queryBeianDetail({ id: this.$route.query.id });
      if (res.data) {
        let data = res.data;
        if (data.constructionPlanFile && data.constructionPlanFile.length > 0) {
          data.constructionPlanFile = JSON.parse(data.constructionPlanFile);
        }
        if (data.contractFile && data.contractFile.length > 0) {
          data.contractFile = JSON.parse(data.contractFile);
        }
        if (data.otherFile && data.otherFile.length > 0) {
          data.otherFile = JSON.parse(data.otherFile);
        }
        this.$set(this, "fromData", data);
        this.projectId = data.projectId;
        this.getTemplate(data);
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
          this.chuli();
        // let formArr = this.editableTabs && JSON.parse(this.editableTabs[0].formArr);

        // this.templateId = res.data.id;

        // this.editableTabs.forEach((item) => {
        //   this.$set(item, "formArr", JSON.parse(item.formArr));
        //   item.formArr.forEach((item1, index) => {
        //     let configArr = item1.selectData.formAdd.config;
        //     let configBind =
        //       this.getConfigBind(configArr, "bind") &&
        //       this.getConfigBind(configArr, "bind").join(",");
        //     let itemData = this.forInItem(Data, configBind);
        //     item.formArr[index].selectData.formAdd.data = itemData ? itemData : {};
        //   });
        // });
      });
    },
  },
  created() {
    this.createdfunc();
    if (this.$route.query.id) {
      this.init();
    } else {
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
        // templateId: this.templateId,
      }).then((res) => {
        this.editableTabs = JSON.parse(res.data.templateDetail);
        this.templateId = res.data.id;
        this.chuli();
      });
    }
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    clearInterval(this.timer);
    getSession("infoId_beianProject" + this.$route.query.projectId);
    next();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    getSession("infoId_beianProject" + this.$route.query.projectId);
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
::v-deep .el-tabs {
  // .el-tabs__header {
  //   margin-bottom: 0 !important;
  // }
  .el-tabs__content {
    padding: 0 !important;
    .basicInfo {
      margin-top: 16px;
    }
  }
}
</style>
