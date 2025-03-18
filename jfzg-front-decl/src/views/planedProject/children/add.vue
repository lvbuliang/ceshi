<template>
  <div class="planedProject">
    <div v-if="editableTabs.length > 0">
      <div v-if="!get_success">
        <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
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
          backName="planedProject"
        ></WorkFlow>
      </div>
      <div v-else>
        <SuccessMsg name="计划内项目申报" />
      </div>
    </div>
  </div>
</template>

<script>
import { api_getlist_in_add, api_getlist_in_view } from "@/api/shenbao/index";
import { moduleCode } from "../const.js";
import SuccessMsg from "@/components/success_msg.vue";
import TestFormAdd from "@/components/srFormAdd.vue";
import WorkFlow from "@/components/SrWorkFlow";
import ProjectBaseMessage from "@/components/projectBaseMessage";
import config from "@/settings.js";
import upload from "@/utils/upload";
import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setIntervaltime } from "@/utils/common";

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
    msg: function(n, o, y) {
      if (n == "主应用请求保存表单") {
        this.btg("close");
      }
    },
    get_success: function(n) {
      this.routeUpdata();
    },
    $route(to) {
      this.$set(this, "editableTabs", []);
      if (to.name == "planedProjectAdd") {
        this.createdfunc();
      }
    },
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows,
    };
  },
  data() {
    return {
      srNavPageObj: { name: "", code: "" },
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
      workFlowLoading: false,
    };
  },
  methods: {
    projectInit(res) {
      this.srNavPageObj = res;
    },
    routeUpdata() {
      var routerBase = "/subshenbao";
      this.$setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },
    routeClose(timeout) {
      this.$SrUtils.routeClose.call(
        this,
        "subshenbao",
        this.$setState,
        timeout
      );
    },
    handleClick(tab, event) {},
    tg() {
      let data = this.$refs["formAdd"].validateFun();
      if (!data) return;
      data.projectId = this.$route.query.projectId || this.projectId;
      data.status = 2;
      if (data.file && data.file.length > 0) {
        data.file = JSON.stringify(data.file);
      } else {
        data.file = "";
      }
      data.templateId = this.templateId;
      if (this.$route.query.id) {
        data.id = this.$route.query.id;
      } else if (
        getSession("infoId_planedProject" + this.$route.query.projectId) &&
        getSession("infoId_planedProject" + this.$route.query.projectId) !=
          "null"
      ) {
        data.id = getSession(
          "infoId_planedProject" + this.$route.query.projectId
        );
      } else {
      }
      api_getlist_in_add(data).then((res) => {
        if (res.msg.code == "0000") {
          removeSession("infoId_planedProject" + this.$route.query.projectId);
          this.$message.success("提交成功");
          clearInterval(this.timer);
          if (!this.$route.query.id) {
            this.get_success = true;
          } else {
            this.routeClose();
            this.$router.push({ name: "planedProject" });
          }
        }
      });
    },
    btg(str) {
      if (this.$refs["formAdd"]) {
        let data = this.$refs["formAdd"].validate();
        data.status = "1";
        data.projectId = this.$route.query.projectId || this.projectId;
        data.templateId = this.templateId;
        if (str == "linshi_current") {
          data.isDelete = true;
        }
        if (this.$route.query.id) {
          data.id = this.$route.query.id;
        } else if (
          getSession("infoId_planedProject" + this.$route.query.projectId) &&
          getSession("infoId_planedProject" + this.$route.query.projectId) !=
            "null"
        ) {
          data.id = getSession(
            "infoId_planedProject" + this.$route.query.projectId
          );
        } else {
        }
        if (data.file && data.file.length > 0) {
          data.file = JSON.stringify(data.file);
        } else {
          data.file = "";
        }
        this.workFlowLoading = true;
        api_getlist_in_add(data).then((res) => {
          if (res.msg.code == "0000") {
            this.workFlowLoading = false;
            if (str == "linshi_current") {
              setSession(
                "infoId_planedProject" + this.$route.query.projectId,
                res.data
              );
            } else if (str == "close") {
              removeSession(
                "infoId_planedProject" + this.$route.query.projectId
              );
              this.$message.success("保存成功");
            } else {
              clearInterval(this.timer);
              this.$message.success("保存成功");
              removeSession(
                "infoId_planedProject" + this.$route.query.projectId
              );

              if (!this.$route.query.id) {
                this.get_success = true;
              } else {
                this.routeClose();
                this.$router.push({ name: "planedProject" });
              }
            }
          }
        });
      }
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
    async init(id) {
      let res = await api_getlist_in_view({ id: id });
      if (res.data) {
        if (res.data.file) {
          res.data.file = JSON.parse(res.data.file);
        } else {
          res.data.file = [];
        }
        if (res.data.projectNature) {
          res.data.projectNature = JSON.stringify(res.data.projectNature);
        }
        // if(res.data.capitalSource){
        //   res.data.capitalSource = JSON.stringify(res.data.capitalSource);
        // }
        this.projectId = res.data.projectId;
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

        let formArr =
          this.editableTabs && JSON.parse(this.editableTabs[0].formArr);
        this.templateId = res.data.id;
        this.editableTabs.forEach((item) => {
          this.$set(item, "formArr", JSON.parse(item.formArr));
          item.formArr.forEach((item1, index) => {
            let configArr = item1.selectData.formAdd.config;
            let configBind =
              this.getConfigBind(configArr, "bind") &&
              this.getConfigBind(configArr, "bind").join(",");
            let itemData = this.forInItem(Data, configBind);
            item.formArr[index].selectData.formAdd.data = itemData
              ? itemData
              : {};
          });
        });
      });
    },
    getsetInterval() {
      this.btg("linshi_current");
    },
    createdfunc() {
      clearInterval(this.timer);
      this.isNew = false;
      this.get_success = false;
      if (this.$route.query.id) {
        this.init(this.$route.query.id);
      } else if (
        getSession("infoId_planedProject" + this.$route.query.projectId) &&
        getSession("infoId_planedProject" + this.$route.query.projectId) !=
          "null"
      ) {
        this.init(
          getSession("infoId_planedProject" + this.$route.query.projectId)
        );
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      } else {
        api_getCustomFormTemplate({
          moduleCode: moduleCode,
          // templateId: this.templateId,
        }).then((res) => {
          this.editableTabs = JSON.parse(res.data.templateDetail);
          this.templateId = res.data.id;
        });
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      }
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
    next();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.planedProject {
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
}
</style>
