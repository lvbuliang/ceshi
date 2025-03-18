<template>
  <div class="">
    <div v-if="!get_success">
      <viewBox
        ref="viewBox"
        :WorkFlowIndex="true"
        :routeName="'preliminaryMgr'"
        :typeName="typeName"
        @getDetail="getDetail"
        :hideTrackIcon="false"
      />
      <WorkFlow
        :hideFrom="true"
        :taskId="taskId"
        :routerQuery="false"
        :clickMethods="clickmethods"
        :buttonList="buttonList"
        backName="preliminaryMgr"
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
import SuccessMsg from "@/components/success_msg.vue";
import { api_preliminaryMgrApply } from "@/api/preliminaryMgr/index.js";
import { api_activititodo, api_checkFile } from "@/api/index";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import { mapGetters } from "vuex";
import workflows from "@/utils/workflow";
import upload from "@/utils/upload";
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
      typeName: "edit",
      workflowId: "",
      taskId: null,
      get_success: false,
      userInfo: store.getters.userInfo,
      clickmethods: { tg: this.tg, btg: this.btg },
      contractName: "初验申请信息",
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
      if (to.name == "preliminaryMgrAdd") {
        this.createdfunc();
      }
    },
  },
  created() {
    if (
      this.$route.name == "preliminaryAffirm" ||
      this.$route.name == "preliminarySupervisor"
    ) {
      this.typeName = "view";
    }
    if (
      this.$route.query.processId &&
      this.$route.name != "preliminaryMgrApplyFor"
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
    getDetail(obj) {
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
      console.log("111", this.$refs);
      let flag = this.$refs["viewBox"].getForm();
      console.log("flag初验", flag);
      if (flag) {
        let params2 = {
          flag: 1,
          projectId: this.$route.query.projectId,
        };
        api_checkFile(params2).then((res) => {
          console.log("结果", res);
          if (res.data) {
            let params = {
              ...flag,
              projectId: this.$route.query.projectId,
              annexes: [],
            };
            if (this.$route.query.id) {
              params.id = this.$route.query.id;
            }
            params.firstCheckFile =
              params.firstCheckFile && params.firstCheckFile.length > 0
                ? JSON.stringify(params.firstCheckFile)
                : "";
            params.otherFile =
              params.otherFile && params.otherFile.length > 0
                ? JSON.stringify(params.otherFile)
                : "";
            params.status = 2;
            if (
              getSession(this.$route.name + this.$route.query.projectId) &&
              getSession(this.$route.name + this.$route.query.projectId) !=
                "null"
            ) {
              // params.id = getSession(
              //   this.$route.name + this.$route.query.projectId
              // );
              this.isNew = true;
            } else {
              this.isNew = true;
            }
            if (params.firstCheckFile && JSON.parse(params.firstCheckFile)) {
              params.annexes = [
                ...params.annexes,
                ...JSON.parse(params.firstCheckFile),
              ];
            }
            if (params.otherFile && JSON.parse(params.otherFile)) {
              params.annexes = [
                ...params.annexes,
                ...JSON.parse(params.otherFile),
              ];
            }
            if (params.annexes && params.annexes.length) {
              params.annexes = JSON.stringify(params.annexes);
            } else {
              params.annexes = null;
            }
            if (params.fileInstanceId) {
              params.fileInstanceId = "";
            }
            console.log(params);
            api_preliminaryMgrApply(params).then((res) => {
              if (res.msg.code == "0000") {
                if (this.$route.query.id) {
                  this.$message.success("修改成功");
                } else {
                  this.$message.success("新增成功");
                }
                if (this.$route.name == "preliminaryMgrApplyFor") {
                  // this.$nextTick(() => {
                  this.routeClose();
                  // })
                  this.$router.push({ name: "preliminaryMgr" });
                } else {
                  if (this.isNew == true) {
                    this.get_success = true;
                  } else {
                    // this.$nextTick(() => {
                    this.routeClose();
                    // })
                    this.$router.push({ name: "preliminaryMgr" });
                  }
                }
              }
            });
          } else {
            this.$confirm(
              "里程碑节点：合同初验下，缺少必要交付物材料，请于提交后再次提交初验申请。",
              "提示:",
              {
                // confirmButtonText: "返回列表",
                cancelButtonText: "返回列表",
                type: "warning",
                showConfirmButton: false,
                roundButton: true,
              }
            )
              .then(() => {
                console.log("1");
              })
              .catch(() => {
                console.log("2");
                this.$router.push({ name: "preliminaryMgr" });
              });
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
        };
        if (this.$route.query.id) {
          params.id = this.$route.query.id;
        }
        params.firstCheckFile =
          params.firstCheckFile && params.firstCheckFile.length > 0
            ? JSON.stringify(params.firstCheckFile)
            : "";
        params.otherFile =
          params.otherFile && params.otherFile.length > 0
            ? JSON.stringify(params.otherFile)
            : "";
        params.status = 1;
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
        api_preliminaryMgrApply(params).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("保存成功");
            if (this.$route.name == "preliminaryMgrApplyFor") {
              // this.$nextTick(() => {
              this.routeClose();
              // })
              this.$router.push({ name: "preliminaryMgr" });
            } else {
              if (this.isNew == true) {
                this.get_success = true;
              } else {
                // this.$nextTick(() => {
                this.routeClose();
                // })
                this.$router.push({ name: "preliminaryMgr" });
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
