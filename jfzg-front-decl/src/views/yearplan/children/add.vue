<template>
  <div class="yearPlanAdd">
    <div v-if="editableTabs.length > 0">
      <div v-if="!get_success">
        <FormAdd
          v-if="fromData"
          ref="formAdd"
          :fromData="fromData"
          :editableTabs="editableTabs"
          :hideTrackIcon="false"
        ></FormAdd>
        <WorkFlow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          :workFlowLoading="workFlowLoading"
          backName="yearplanAudit"
          ref="work_flow"
        ></WorkFlow>
      </div>
      <div v-else>
        <SuccessMsg name="计划内项目申报" :result_name="result_name" />
      </div>
    </div>
  </div>
</template>

<script>
import FormAdd from "../components/tabsAdd.vue";
import WorkFlow from "@/components/SrWorkFlow";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { api_getCustomFormTemplate } from "@/api/index";
import {
  saveOrEditYearPlan,
  viewYearPlan,
  submitOrEditYearPlan,
} from "@/api/yearPlan/index";
import SuccessMsg from "@/components/success_msg.vue";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import { setIntervaltime } from "@/utils/common";
export default {
  components: {
    FormAdd,
    WorkFlow,
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
      if (to.name == "yearplanAuditAdd") {
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
    };
  },
  data() {
    return {
      result_name:'提交成功',
      workFlowLoading: false,
      timer: "",
      isNew: false,
      get_success: false,
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
    };
  },
  created() {
    this.createdfunc();
  },
  methods: {
    routeUpdata() {
      var routerBase = "/subdecl";
      setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },
    routeClose() {
      var routerBase = "/subdecl";
      setState({
        ignore: "closeAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: this.$route.meta,
        },
      });
    },
    getsetInterval() {
      this.btg("linshi_current");
    },
    createdfunc() {
      this.getTemplateData();
      if (this.$route.query.id) {
        this.getDetail(this.$route.query.id);
      } else if (
        getSession("infoId_yearplanAuditAdd") &&
        getSession("infoId_yearplanAuditAdd") != "null"
      ) {
        this.getDetail(getSession("infoId_yearplanAuditAdd"));
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      } else {
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      }
    },
    // 编辑获取详情
    getDetail(id) {
      viewYearPlan({ id: id }).then((res) => {
        if (res.data.yearPlanFiles) {
          res.data.yearPlanFiles = JSON.parse(res.data.yearPlanFiles);
        }
        if (res.data.files) {
          res.data.files = JSON.parse(res.data.files);
        }
        this.$set(this, "fromData", res.data);
      });
    },
    // 获取模板数据
    getTemplateData() {
      api_getCustomFormTemplate({
        moduleCode: "4001",
        // templateId: this.templateId,
      }).then((res) => {
        this.$set(this, "editableTabs", JSON.parse(res.data.templateDetail));
        this.templateId = res.data.id;
        this.chuli();
      });
    },
    chuli() {
      this.editableTabs.forEach((item) => {
        this.$set(item, "formArr", JSON.parse(item.formArr));
        item.formArr.forEach((item1, index) => {
          for (let k = 0; k < item1.selectData.formAdd.config.length; k++) {
            if (item1.selectData.formAdd.config[k].bind === "endTime") {
              item1.selectData.formAdd.config[k]["picker-options"] = {
                disabledDate: (time) => {
                  if (item1.selectData.formAdd.data.startTime) {
                    return (
                      time.getTime() <
                      new Date(
                        item1.selectData.formAdd.data.startTime
                      ).getTime()
                    ); //如果没有后面的-8.64e7就是不可以选择今天的
                  }
                },
              };
            }
            if (item1.selectData.formAdd.config[k].bind === "startTime") {
              item1.selectData.formAdd.config[k]["picker-options"] = {
                disabledDate: (time) => {
                  if (item1.selectData.formAdd.data.endTime) {
                    return (
                      time.getTime() >
                      new Date(item1.selectData.formAdd.data.endTime).getTime()
                    ); //如果没有后面的-8.64e7就是不可以选择今天的
                  }
                },
              };
            }
          }
        });
      });
    },
    // 提交
    tg() {
      let data = this.$refs["formAdd"].validate();

      this.$refs["formAdd"].$refs["add0"][0].validate((valid) => {
        if (valid) {
          data.status = "2";
          data.templateId = this.templateId;
          if (data.startTime) {
            data.startTime = data.startTime + " " + "00:00:00";
          }
          if (data.endTime) {
            data.endTime = data.endTime + " " + "00:00:00";
          }
          data.yearPlanFiles = JSON.stringify(data.yearPlanFiles);
          data.files = JSON.stringify(data.files);
          if (this.$route.query.id) {
            data.id = this.$route.query.id;
          } else if (
            getSession("infoId_yearplanAuditAdd") &&
            getSession("infoId_yearplanAuditAdd") != "null"
          ) {
            data.id = getSession("infoId_yearplanAuditAdd");
            this.isNew = true;
          } else {
            this.isNew = true;
          }
          submitOrEditYearPlan(data).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("提交成功");
              clearInterval(this.timer);
              if (this.isNew == true) {
                this.get_success = true;
                this.$router.push({ name: "yearplanAudit" });

              } else {
                this.$router.push({ name: "yearplanAudit" });
              }
            }
          });
        }
      });
    },
    // 保存
    btg(str) {
      if (this.$refs["formAdd"]) {
        let data = this.$refs["formAdd"].validate();
        data.status = "1";
        data.templateId = this.templateId;
        if (data.startTime) {
          data.startTime = data.startTime + " " + "00:00:00";
        }
        if (data.endTime) {
          data.endTime = data.endTime + " " + "00:00:00";
        }
        if (this.$route.query.id) {
          data.id = this.$route.query.id;
        }
        //
        if (str == "linshi_current") {
          data.temporary = 1;
        }
        if (
          getSession("infoId_yearplanAuditAdd") &&
          getSession("infoId_yearplanAuditAdd") != "null"
        ) {
          data.id = getSession("infoId_yearplanAuditAdd");
          this.isNew = true;
        } else {
          this.isNew = false;
        }
        data.yearPlanFiles = JSON.stringify(data.yearPlanFiles);
        data.files = JSON.stringify(data.files);
        this.workFlowLoading = true;
        saveOrEditYearPlan(data).then((res) => {
          if (res.msg.code == "0000") {
            if (str == "linshi_current") {
              setSession("infoId_yearplanAuditAdd", res.data);
            } else if (str == "close") {
              removeSession("infoId_yearplanAuditAdd");
            } else {
              this.result_name='保存成功'
              this.$message.success("保存成功");
              removeSession("infoId_yearplanAuditAdd");
              clearInterval(this.timer);
              if (this.isNew == true) {
                this.get_success = true;
                this.$router.push({ name: "yearplanAudit" });

              } else {
                this.$router.push({ name: "yearplanAudit" });
              }
            }
            this.workFlowLoading = false;
          }
        });
      }
    },
  },

  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    clearInterval(this.timer);
    next();
  },
  beforeDestroy() {
    removeSession("infoId_yearplanAuditAdd");
    clearInterval(this.timer);
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
</style>
