<template>
  <div class="total-page">
    <div v-if="editableTabs.length > 0">
      <div v-if="!get_success">
        <TestFormAdd
          v-if="!id || fromData"
          ref="formAdd"
          :fromData="fromData"
          :editableTabs="editableTabs"
          :showLineTitle="true"
        ></TestFormAdd>
        <Table
          ref="tableRef"
          :tableUrl="tableUrl"
          :params="tableParams"
          :tableData="tableData"
          title="风险改进措施"
          @tableConfirm="tableConfirm"
          @tableEdit="tableEdit"
          @tableDelete="tableDelete"
        />
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          :params="{ projectId: this.$route.query.projectId }"
          :workFlowLoading="workFlowLoading"
          :backName="
            $route.query.routeName ? $route.query.routeName : 'everydayrisk'
          "
          ref="work_flow"
        ></sr-work-flow>
      </div>
      <div v-else>
        <SuccessMsg name="风险" />
      </div>
    </div>
  </div>
</template>

<script>
import { queryByUnitType } from "@/api/bianzhi/index";
import { api_queryStageList } from "@/api/shishi/taskList.js";
import Table from "../components/table";
import SuccessMsg from "@/components/success_msg.vue";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import store from "@/store";
import { moduleCode } from "./const.js";
import TestFormAdd from "@/components/srFormAdd.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { api_getCustomFormTemplate } from "@/api/index";
import {
  api_save,
  api_update,
  api_saveOrUpdate_noLoading,
  api_measure_listByRiskId,
  api_measure_saveOrUpdate,
  api_measure_delete,
  api_detail,
} from "@/api/riskAndIssue";
export default {
  components: {
    TestFormAdd,
    SuccessMsg,
    Table,
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
      if (to.name == "everydayriskAdd") {
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
      projectMemberList:[],
      projectMemberFlag: false,
      stageFlag: false,
      userInfo: store.getters.userInfo,
      projectId: this.$route.query.projectId,
      id: this.$route.query.id,
      workFlowLoading: false,
      tableUrl: api_measure_listByRiskId,
      tableParams: {
        riskId: this.$route.query.id,
      },
      projectObj: {},
      editableTabs: [],
      tableData: [],
      fromData: {},
      activeName: "0",
      templateId: this.$route.query.templateId,
      clickmethods: { tg: this.tg, btg: this.btg },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "保存",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
            // {
            //   btnValue: "btg",
            //   btnName: "保存",
            //   btnType: "primary",
            //   btnEventType: "btg",
            // },
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
    setConfig() {
      this.editableTabs.forEach((item) => {
        this.$set(item, "formArr", JSON.parse(item.formArr));
        let form = item.formArr[0].selectData.formAdd;
        this.projectMember(form);
        this.stage(form);
      });
    },
    async stage(form) {
        // 里程碑
        let res = await api_queryStageList(
          this.$route.query.projectId
        );
        if (res?.data && res.msg.code == "0000") {
          this.$set(
            form.enums,
            "milestoneList",
            this.$utils.enumsDataNameValue(res.data, "stageName", "stageId")
          );
        }
    },
    async projectMember(form) {
      let { buid } = this.userInfo.currentBizunit
        ? this.userInfo.currentBizunit
        : {};
      if (
        (this.$route.query.projectId) &&
        !this.projectMemberFlag
      ) {
        queryByUnitType({
          projectId: this.$route.query.projectId,
        }).then((res) => {
          if (res.msg.code == "0000") {
            let allmember = [
              ...res.data["JSDW"].members,
              ...res.data["JSDW"].principals,
              ...res.data["CJDW"].members,
              ...res.data["CJDW"].principals,
              ...res.data["JLDW"].members,
              ...res.data["JLDW"].principals,
            ];
            let Fzr_data = [];
            for (let i = 0; i < allmember.length; i++) {
              var map = {
                fullname: allmember[i].fullname,
                mobile: allmember[i].mobile,
                jfid: allmember[i].jfid,
                dataName: allmember[i].fullname,
                dataValue: allmember[i].jfid,
              };
              var cannotadd = false;
              for (var j = 0; j < Fzr_data.length; j++) {
                if (Fzr_data[j].jfid == allmember[i].jfid) {
                  cannotadd = true;
                  break;
                }
              }
              if (!cannotadd) {
                Fzr_data.push(map);
              }
            }
            this.$set(this, "projectMemberFlag", true);
            this.$set(this, "projectMemberList", Fzr_data);
            // 处理人
            this.$set(
              form.enums,
              "liablerList",
              this.$utils.enumsDataNameValue(Fzr_data, "fullname", "jfid")
            );
            // 跟踪人
            this.$set(
              form.enums,
              "trackerList",
              this.$utils.enumsDataNameValue(Fzr_data, "fullname", "jfid")
            );
          }
        });
      }
    },
    async tableEdit(obj) {
      // 编辑措施
      let params = {
        ...obj,
      };
      let res = await api_measure_saveOrUpdate(params);
      if (res.msg.code == "0000") {
        this.$refs["tableRef"].$refs["formDialog"].$isShow();
        this.$refs["tableRef"].getTbData();
        this.$message.success("编辑措施成功！");
      }
    },
    async tableDelete(obj) {
      // 删除措施
      let params = {
        id: obj.id,
      };
      let res = await api_measure_delete(params);
      if (res.msg.code == "0000") {
        this.$refs["tableRef"].getTbData();
        this.$message.success("删除措施成功！");
      }
    },
    async tableConfirm(obj) {
      // 新增措施
      let projectMemberList = this.$refs["formAdd"].projectMemberList;
      let { liabler } = obj;
      let frontName = this.$utils.arrFind(projectMemberList, liabler, "jfid")
        ?.frontName;

      let params = {
        riskId: this.tableParams.riskId,
        unitType: frontName ? frontName.split("-")[0] : "", // "单位类型：承建单位、建设单位、监理单位",
        memberType: "", //"成员类型：负责人、项目经理、成员",
        template: "", //"模板id",
        isDraft: false, //"是否为草稿，true-自动保存草稿",
        ...obj,
      };

      let res = await api_measure_saveOrUpdate(params);
      if (res.msg.code == "0000") {
        this.$refs["tableRef"].$refs["formDialog"].$isShow();
        this.$refs["tableRef"].getTbData();
        this.$message.success("新增措施成功！");
      }
    },
    /*
     * 自动化新增方法集
     */
    routeUpdata() {
      var routerBase = "/subimpl";
      setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },

    createdfunc() {
      clearInterval(this.timer);
      this.isNew = false;
      this.get_success = false;
      if (this.$route.query.id) {
        this.init(this.$route.query.id);
      } else if (
        getSession("infoId_everydayrisk" + this.$route.query.projectId) &&
        getSession("infoId_everydayrisk" + this.$route.query.projectId) !=
          "null"
      ) {
        this.init(
          getSession("infoId_everydayrisk" + this.$route.query.projectId)
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
          if (res.data && res.msg.code == "0000") {
            this.editableTabs =
              typeof res.data.templateDetail == "string" &&
              JSON.parse(res.data.templateDetail);
            this.templateId = res.data.id;
            this.setConfig();
          }
        });
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
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
      let { liabler } = data;
      let tableRef = this.$refs["tableRef"]
        ? this.$refs["tableRef"].table.data
        : [];
      let params = {
        ...data,
        measureList: tableRef,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        isDraft: false,
        isSend: liabler && true, // 有处理责任人发送待办字段 否则不发
      };

      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      } else if (
        getSession("infoId_everydayrisk" + this.$route.query.projectId) &&
        getSession("infoId_everydayrisk" + this.$route.query.projectId) !=
          "null"
      ) {
        params.id = getSession(
          "infoId_everydayrisk" + this.$route.query.projectId
        );
        this.isNew = true;
      }
      if (params.id) {
        let res = await api_update(params);
        if (res.msg.code == "0000") {
          removeSession("infoId_everydayrisk" + this.$route.query.projectId);
          clearInterval(this.timer);
          if (this.isNew) {
            this.get_success = true;
          } else {
            this.$message.success("修改成功");
            this.routeClose();

            this.$router.push({
              name: "everydayrisk",
              query: { projectId: this.$route.query.projectId },
            });
          }
        }
      } else {
        let res2 = await api_save(params);

        if (res2.msg.code == "0000") {
          removeSession("infoId_everydayrisk" + this.$route.query.projectId);
          clearInterval(this.timer);
          if (this.isNew) {
            this.get_success = true;
          } else {
            this.$message.success("新增成功");
            this.routeClose();

            this.$router.push({ name: "everydayrisk" });
          }
        }
      }
    },
    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subimpl", this.$setState, timeout);
    },
    async btg(str) {
      let data = this.$refs["formAdd"] ? this.$refs["formAdd"].validate() : {};
      let tableRef = this.$refs["tableRef"]
        ? this.$refs["tableRef"].table.data
        : [];
      let params = {
        ...data,
        measureList: tableRef,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
      };

      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }
      if (str == "linshi_current") {
        // 是否是自动保存的数据
        params.isDraft = true;
      } else {
        params.isDraft = false;
      }
      if (
        getSession("infoId_everydayrisk" + this.$route.query.projectId) &&
        getSession("infoId_everydayrisk" + this.$route.query.projectId) !=
          "null"
      ) {
        // 自动保存拿到的id
        params.id = getSession(
          "infoId_everydayrisk" + this.$route.query.projectId
        );
        this.isNew = true;
      }
      this.workFlowLoading = true;
      let res = await api_saveOrUpdate_noLoading(params, params.id);
      if (res.msg.code == "0000") {
        this.tableParams.riskId = res.data.id;
        this.btgFun(str, res.data);
        this.workFlowLoading = false;
      }
    },
    btgFun(str, data) {
      if (str == "linshi_current") {
        setSession(
          "infoId_everydayrisk" + this.$route.query.projectId,
          data.id
        );
      } else if (str == "close") {
        removeSession("infoId_everydayrisk" + this.$route.query.projectId);
        this.$message.success("保存成功");
      } else {
        clearInterval(this.timer);
        this.$message.success("保存成功");
        removeSession("infoId_everydayrisk" + this.$route.query.projectId);
        if (this.isNew) {
          this.get_success = true;
        } else {
          this.routeClose();

          this.$router.push({
            name: "everydayrisk",
            query: { projectId: this.$route.query.projectId },
          });
        }
      }
    },
    async init(id) {
      let res = await api_detail({ id });
      if (res.data) {
        res.data.milestone = +res.data.milestone;
        this.tableData = res.data.measureList ? res.data.measureList : [];
        console.log("res.data", res.data);
        console.log("tableData", this.tableData);
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
          let form = item.formArr[0].selectData.formAdd;
          this.projectMember(form);
          this.stage(form);
        });
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
    if (!this.$route.query.id) {
      this.btg("linshi_current");
    }
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    clearInterval(this.timer);
    removeSession("infoId_everydayrisk" + this.$route.query.projectId);
    next();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    removeSession("infoId_everydayrisk" + this.$route.query.projectId);
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-popover__reference-wrapper {
  display: none !important;
}
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

.total-page {
  ::v-deep .el-tabs__header {
    display: none;
  }
}
</style>
