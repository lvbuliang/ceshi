<template>
  <div class="total-page">
    <div v-if="editableTabs.length > 0">
      <TestFormAdd
        v-if="!id || fromData"
        ref="formAdd"
        :fromData="fromData"
        :editableTabs="editableTabs"
        :showLineTitle="true"
        :project_Id="project_Id"
      ></TestFormAdd>
      <Table
        ref="tableRef"
        :tableUrl="tableUrl"
        :params="tableParams"
        :tableData="tableData"
        title="问题改进措施"
        @tableConfirm="tableConfirm"
        @tableEdit="tableEdit"
        @tableDelete="tableDelete"
        @clearInter="clearInter"
        :project_Id="project_Id"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        v-debounce="[() => tg(), config.deTime]"
        size="small"
        >确定</el-button
      >
      <el-button @click="cancel" size="small">取消</el-button>
    </div>
  </div>
</template>

<script>
import { queryByUnitType } from "@/api/bianzhi/index";
import { api_queryStageList } from "@/api/shishi/taskList.js";
import Table from "./components/table";
import SuccessMsg from "@/components/success_msg.vue";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";

import { moduleCode } from "./const.js";
import TestFormAdd from "@/components/srFormAdd.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { api_getCustomFormTemplate } from "@/api/index";
import store from "@/store";
import {
  api_insertProjectProblem,
  api_insertProjectProblem_noLoading,
  api_getMeasureListById,
  api_insertMeasure,
  api_deleteMeasureById,
  api_getSee,
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

  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {
    project_Id: {
      type: Number,
    },
  },
  data() {
    return {
      projectMemberFlag: false,
      stageFlag: false,
      userInfo: store.getters.userInfo,
      workFlowLoading: false,
      tableUrl: api_getMeasureListById,
      tableParams: {
        id: "",
      },
      config,
      projectObj: {},
      editableTabs: [],
      tableData: [],
      fromData: {},
      activeName: "0",
      templateId: "",
    };
  },
  methods: {
    setConfig() {
      this.editableTabs.forEach((item) => {
        this.$set(item, "formArr", JSON.parse(item.formArr));
        let form = item.formArr[0].selectData.formAdd;
        console.log(form);
        this.projectMember(form);
        this.stage(form);
      });
    },
    async stage(form) {
      if (!this.stageFlag) {
        // 里程碑
        let res = await api_queryStageList(this.project_Id);
        if (res?.data && res.msg.code == "0000") {
          this.$set(this, "stageFlag", true);
          this.$set(
            form.enums,
            "milestoneList",
            this.$utils.enumsDataNameValue(res.data, "stageName", "stageId")
          );
        }
      }
    },
    async projectMember(form) {
      let { buid } = this.userInfo.currentBizunit
        ? this.userInfo.currentBizunit
        : {};
      if (this.project_Id && !this.projectMemberFlag) {
        queryByUnitType({
          projectId: this.project_Id,
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
    clearInter() {
      clearInterval(this.timer);
    },
    async tableEdit(obj) {
      // 编辑措施
      let params = {
        ...obj,
      };
      let res = await api_insertMeasure(params);
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
      let res = await api_deleteMeasureById(params);
      if (res.msg.code == "0000") {
        this.$refs["tableRef"].getTbData();
        this.$message.success("删除措施成功！");
      }
    },
    async tableConfirm(obj) {
      // 新增措施

      let params = {
        problemId: this.tableParams.id,
        template: "", //"模板id",
        isDraft: false, //"是否为草稿，true-自动保存草稿",
        ...obj,
      };

      let res = await api_insertMeasure(params);
      if (res && res.msg.code == "0000") {
        this.$refs["tableRef"].$refs["formDialog"].$isShow();
        this.$refs["tableRef"].getTbData();
        this.$message.success("新增措施成功！");
      }
    },
    /*
     * 自动化新增方法集
     */
    routeUpdata() {},

    createdfunc() {
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
          this.btg();
        }
      });
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
      let projectMemberList = this.$refs["formAdd"].projectMemberList;
      let frontName = this.$utils.arrFind(
        projectMemberList,
        liabler,
        "jfid"
      )?.frontName;
      let params = {
        ...data,
        projectId: this.project_Id,
        isDraft: false,
        company: frontName ? frontName.split("-")[0] : "", // 单位类型
        isHandle: liabler && true, // 有处理责任人发送待办字段 否则不发
      };
      let res = await api_insertProjectProblem(params);
      if (res && res.msg.code == "0000") {
        this.$message.success("新增成功");
        this.$emit("cancel");
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    async btg(str) {
      let data = this.$refs["formAdd"] ? this.$refs["formAdd"].validate() : {};
      let params = {
        ...data,
        isHandle: false,
        projectId: this.project_Id,
      };
      // 是自动保存的数据
      params.isDraft = true;
      let res = await api_insertProjectProblem_noLoading(params);
      if (res && res.msg.code == "0000") {
        this.tableParams.id = res.data;
      }
    },

    routeClose(timeout) {},

    async init(id) {
      let res = await api_getSee({ id });
      if (res.data) {
        this.tableData = res.data.measures ? res.data.measures : [];
        if (res.data.milestone) {
          res.data.milestone = Number(res.data.milestone);
        }
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
  mounted() {
    this.createdfunc();
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
  beforeDestroy() {},
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
  .dialog-footer {
    text-align: center;
    button {
      border-radius: 16px;
      min-width: 76px;
      font-size: 14px;
    }
  }
}
</style>
