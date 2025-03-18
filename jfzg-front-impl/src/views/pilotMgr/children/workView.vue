<template>
  <div class="workView">
    <div v-if="!get_success">
      <viewBox ref="viewBox"
               @getDetail="getDetail"
               :WorkFlowIndex="true"
               :typeName="typeName"
               :hideTrackIcon="false" />
      <WorkFlow :hideFrom="true"
                :taskId="taskId"
                 :routerQuery="false"
                :clickMethods="clickmethods"
                :buttonList="buttonList"
                backName="pilotMgr"
                ref="work_flow"></WorkFlow>
    </div>
    <div v-else>
      <SuccessMsg :name="contractName" />
    </div>
  </div>
</template>

<script>
import viewBox from "./view.vue";
import WorkFlow from "@/components/SrWorkFlow";
import { api_pilotRunApply } from "@/api/pilotMgr/index.js";
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import workflows from "@/utils/workflow";
import { api_preliminaryMgrApply } from "@/api/preliminaryMgr/index.js";
import { api_activititodo } from "@/api/index";
import SuccessMsg from "@/components/success_msg.vue";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import { mapGetters } from "vuex";
import srtracetrack from "@/utils/srtracetrack";
export default {
  components: {
    viewBox,
    WorkFlow,
    SuccessMsg,
  },
  provide () {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows,
    };
  },
  data () {
    return {
      isNew: false,
      contractName: "试运行申请",
      get_success: false,
      typeName: "edit",
      workflowId: "",
      taskId: null,
      userInfo: store.getters.userInfo,
      clickmethods: { tg: this.tg, bc: this.bc },
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
              btnEventType: "bc",
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
      if (n == "主应用请求保存表单")
      {
        this.btg("close");
      }
    },
    get_success: function (n) {
      this.routeUpdata();
    },
    $route (to) {
      this.$set(this, "editableTabs", []);
      if (to.name == "pilotMgrAdd")
      {
        this.createdfunc();
      }
    },
  },
  created () {
    if (this.$route.name != "pilotMgrApplyFor" && this.$route.name != "pilotMgrAdd")
    {
      this.typeName = "view";
    }
    if (this.$route.query.processId && this.$route.name != "pilotMgrApplyFor" && this.$route.name != "pilotMgrAdd")
    {
      this.buttonList[0].showForm = true;
      this.getWorkFlow();
    }
  },
  methods: {
    routeUpdata () {
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
    routeClose (timeout) {
      var routepath = window.location.pathname.replace(/\//g,"")
      this.$SrUtils.routeClose.call(this, routepath, this.$setState, timeout);
    },
    getDetail (obj) {
      this.workflowId = obj.workflowId;
    },
    // 获取工作流
    getWorkFlow () {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;
      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.$route.query.processId,
      };
      api_activititodo(param).then((res) => {
        console.log("RES", res.data);
        if (res.data.length > 0)
        {
          let assignee = res.data[0].assignee;
          this.buttonList = JSON.parse(res.data[0].description).filter(
            (item) => {
              //按钮筛选  以assignee优先roleCode
              item.assignee = assignee;
              if (assignee == jfid)
              {
                return true;
              } else if (roleCode == item.role)
              {
                return true;
              }
            }
          );
          this.taskId = res.data[0].taskId;
        }
      });
    },
    tg () {
      let flag = this.$refs["viewBox"].getForm();
      if (flag)
      {
        let params = {
          ...flag,
          projectId: this.$route.query.projectId,
          annexes:[]
        };
        if (this.$route.query.id)
        {
          params.id = this.$route.query.id;
        }
        params.pilotRunFile =
          params.pilotRunFile && params.pilotRunFile.length > 0
            ? JSON.stringify(params.pilotRunFile)
            : "";
        params.status = 2;
        if (
          getSession(this.$route.name + this.$route.query.projectId) &&
          getSession(this.$route.name + this.$route.query.projectId) != "null"
        )
        {
          // params.id = getSession(
          //   this.$route.name + this.$route.query.projectId
          // );
          this.isNew = true;
        } else
        {
          this.isNew = true;
        }
        if (params.pilotRunFile && JSON.parse(params.pilotRunFile)) {
          params.annexes = [
            ...JSON.parse(params.pilotRunFile),
          ];
        }
        if (params.annexes && params.annexes.length) {
          params.annexes = JSON.stringify(params.annexes);
        } else {
          params.annexes = null;
        }
        api_pilotRunApply(params).then((res) => {
          if (res.msg.code == "0000")
          {
            if (this.$route.query.id)
            {
              this.$message.success("修改成功");
            } else
            {
              this.$message.success("新增成功");
            }
            if (this.$route.name == "pilotMgrApplyFor")
            {
              // this.$nextTick(() => {
                this.routeClose();
              // })
              this.$router.push({ name: "pilotMgr" });
            } else
            {
              if (this.isNew == true)
              {
                this.get_success = true;
              } else
              {
                // this.$nextTick(() => {
                  this.routeClose();
                // })
                this.$router.push({ name: "pilotMgr" });
              }
            }
          }
        });
      }
    },
    bc () {
      let flag = this.$refs["viewBox"].getForm();
      if (flag)
      {
        let params = {
          ...flag,
          projectId: this.$route.query.projectId,
        };
        if (this.$route.query.id)
        {
          params.id = this.$route.query.id;
        }
        params.pilotRunFile =
          params.pilotRunFile && params.pilotRunFile.length > 0
            ? JSON.stringify(params.pilotRunFile)
            : "";
        params.status = 1;
        if (
          getSession(this.$route.name + this.$route.query.projectId) &&
          getSession(this.$route.name + this.$route.query.projectId) != "null"
        )
        {
          // params.id = getSession(
          //   this.$route.name + this.$route.query.projectId
          // );
          this.isNew = true;
        } else
        {
          this.isNew = true;
        }
        api_pilotRunApply(params).then((res) => {
          if (res.msg.code == "0000")
          {
            if (this.$route.query.id)
            {
              this.$message.success("修改成功");
            } else
            {
              this.$message.success("新增成功");
            }
            if (this.$route.name == "pilotMgrApplyFor")
            {
              // this.$nextTick(() => {
                this.routeClose();
              // })
              this.$router.push({ name: "pilotMgr" });
            } else
            {
              if (this.isNew == true)
              {
                this.get_success = true;
              } else
              {
                // this.$nextTick(() => {
                  this.routeClose();
                // })
                this.$router.push({ name: "pilotMgr" });
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
