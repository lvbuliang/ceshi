<template>
  <div class="">
    <div v-if="!get_success">
      <viewBox
        ref="viewBox"
        :WorkFlowIndex="true"
        :routeName="'beCompleted'"
        :typeName="typeName"
        @getDetail="getDetail"
        @getTemplateId="getTemplateId"
        :hideTrackIcon="true"
      />
      <WorkFlow
        :hideFrom="true"
        :taskId="taskId"
        :routerQuery="false"
        :clickMethods="clickmethods"
        :buttonList="buttonList"
        backName="beCompleted"
        ref="work_flow"
      ></WorkFlow>
    </div>
    <div v-else>
      <SuccessMsg :name="contractName" />
    </div>
  </div>
</template>

<script>
import viewBox from "../../pilotMgr/children/view.vue";
import WorkFlow from "@/components/SrWorkFlow";
import store from "@/store";
import config from "@/settings.js";
import { api_saveOrUpdate } from "@/api/beCompleted/index.js";
import { api_activititodo } from "@/api/index";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import { mapGetters } from "vuex";
import SuccessMsg from "@/components/success_msg.vue";
import upload from "@/utils/upload";
import workflows from "@/utils/workflow";
import srtracetrack from "@/utils/srtracetrack";
export default {
  components: {
    viewBox,
    WorkFlow,
    SuccessMsg,
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
      isNew: false,
      get_success: false,
      contractName: "竣工验收申请信息",
      typeName: "edit",
      workflowId: "",
      templateId: "",
      status: "",
      taskId: null,
      userInfo: store.getters.userInfo,
      clickmethods: { tg: this.tg, btg: this.btg },
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
            {
              btnName: "保存",
              btnValue: "btg",
              btnType: "default",
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
      if (to.name == "beCompletedAdd") {
        this.createdfunc();
      }
    },
  },
  created() {
    if (
      this.$route.name == "beCompletedAffirm" ||
      this.$route.name == "beCompletedSupervisor" ||
      this.$route.name == "beCompletedApproval"
    ) {
      this.typeName = "view";
    }
    if (
      this.$route.query.processId &&
      this.$route.name != "beCompletedApplyFor" &&
      this.$route.name != "beCompletedAdd"
    ) {
      this.buttonList[0].showForm = true;
      this.getWorkFlow();
    }
  },
  mounted() {},
  methods: {
    routeUpdata() {
      var routerBase = "/subcheck";
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
      var routepath = window.location.pathname.replace(/\//g, "");
      this.$SrUtils.routeClose.call(this, routepath, this.$setState, timeout);
    },
    getTemplateId(id) {
      this.templateId = id;
    },
    getDetail(obj) {
      if (obj) {
        this.status = obj.status;
      }
      this.workflowId = obj.workflowId;
    },
    // 获取工作流
    getWorkFlow() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;
      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.$route.query.processId,
      };
      api_activititodo(param).then((res) => {
        if (res.data.length > 0) {
          let assignee = res.data[0].assignee;
          this.buttonList = JSON.parse(res.data[0].description).filter(
            (item) => {
              //按钮筛选  以assignee优先roleCode
              item.assignee = assignee;
              if (assignee == jfid) {
                return true;
              } else if (roleCode == item.role) {
                return true;
              }
            }
          );
          this.taskId = res.data[0].taskId;
        }
      });
    },
    tg() {
      let flag = this.$refs["viewBox"].getForm();
      if (flag) {
        let params = {
          ...flag,
          templateId: this.templateId,
          projectId: this.$route.query.projectId,
          annexes: [],
          type:2
        };
        if (this.$route.query.id) {
          params.id = this.$route.query.id;
        }
        params.applyFile =
          params.applyFile && params.applyFile.length > 0
            ? JSON.stringify(params.applyFile)
            : "";
        params.otherFile =
          params.otherFile && params.otherFile.length > 0
            ? JSON.stringify(params.otherFile)
            : "";
        params.status = 2;
        if (params.applyFile && JSON.parse(params.applyFile)) {
          params.annexes = [...params.annexes, ...JSON.parse(params.applyFile)];
        }
        if (params.otherFile && JSON.parse(params.otherFile)) {
          params.annexes = [...params.annexes, ...JSON.parse(params.otherFile)];
        }
        if (params.annexes && params.annexes.length) {
          params.annexes = JSON.stringify(params.annexes);
        } else {
          params.annexes = null;
        }
        if (
          getSession(this.$route.name + this.$route.query.projectId) &&
          getSession(this.$route.name + this.$route.query.projectId) != "null"
        ) {
          // params.id = getSession(
          //   this.$route.name + this.$route.query.projectId
          // );
          this.isNew = true;
        } else {
          this.isNew = true;
        }
        api_saveOrUpdate(params).then((res) => {
          if (res.msg.code == "0000") {
            if (this.$route.query.id) {
              this.$message.success("修改成功");
            } else {
              this.$message.success("新增成功");
            }
            if (this.$route.name == "beCompletedApplyFor") {
           
                this.routeClose();
          
              this.$router.push({ name: "beCompleted" });
            } else {
              if (this.isNew == true) {
                this.get_success = true;
              } else {
              
                  this.routeClose();
             
                this.$router.push({ name: "beCompleted" });
              }
            }
          }
        });
      }
    },
    btg() {
      let flag = this.$refs["viewBox"].getForm();
      if (flag) {
        let params = {
          ...flag,
          projectId: this.$route.query.projectId,
          templateId: this.templateId,
          type:2
        };
        if (this.$route.query.id) {
          params.id = this.$route.query.id;
        }
        params.applyFile =
          params.applyFile && params.applyFile.length > 0
            ? JSON.stringify(params.applyFile)
            : "";
        params.otherFile =
          params.otherFile && params.otherFile.length > 0
            ? JSON.stringify(params.otherFile)
            : "";
        params.status = this.status ? this.status : 1;
        if (
          getSession(this.$route.name + this.$route.query.projectId) &&
          getSession(this.$route.name + this.$route.query.projectId) != "null"
        ) {
          // params.id = getSession(
          //   this.$route.name + this.$route.query.projectId
          // );
          this.isNew = true;
        } else {
          this.isNew = true;
        }
        api_saveOrUpdate(params).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("保存成功");
            if (this.$route.name == "beCompletedApplyFor") {
              this.routeClose();
              this.$router.push({ name: "beCompleted" });
            } else {
              if (this.isNew == true) {
                this.get_success = true;
              } else {
                this.routeClose();
                this.$router.push({ name: "beCompleted" });
              }
            }
          }
        });
      }
    },
  },
};
</script>

<style></style>
