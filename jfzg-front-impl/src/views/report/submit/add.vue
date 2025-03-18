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
          :otherConfig="otherConfig"
        ></TestFormAdd>
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          :workFlowLoading="workFlowLoading"
          backName="submit"
          ref="work_flow"
        ></sr-work-flow>
      </div>
      <div v-else>
        <SuccessMsg name="项目周月报" />
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
import config from "@/settings.js";
import upload from "@/utils/upload";
import { api_getCustomFormTemplate, api_getDetailById } from "@/api/index";
import {
  api_insertProjectRP,
  api_insertProjectRP_noLoading,
  api_getProjectRPById,
  api_getMilestoneList,
} from "@/api/submit";
export default {
  components: {
    TestFormAdd,
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
      if (to.name == "submitAdd") {
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
      otherConfig: {
        labelNum: 160,
      },
      projectId: this.$route.query.projectId,
      id: this.$route.query.id,
      workFlowLoading: false,
      projectObj: {},
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
      projectStageList: [], //所属阶段
    };
  },
  methods: {
    getProjectStageList(callback) {
      api_getMilestoneList(this.$route.query.projectId).then((res) => {
        console.log("res", res);
        this.projectStageList = res.data.map(({ stageName, stageId }) => {
          return {
            dataName: String(stageName),
            dataValue: String(stageId),
          };
        });
        callback(this.projectStageList);
        console.log("this.projectStageList", this.projectStageList);
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

    createdfunc() {
      clearInterval(this.timer);
      this.isNew = false;
      this.get_success = false;

      if (this.$route.query.id) {
        this.init(this.$route.query.id);
      } else if (
        getSession("infoId_submit" + this.$route.query.projectId) &&
        getSession("infoId_submit" + this.$route.query.projectId) != "null"
      ) {
        this.init(getSession("infoId_submit" + this.$route.query.projectId));
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
            console.log("数据", this.editableTabs);
            this.editableTabs.forEach((item) => {
              this.$set(item, "formArr", JSON.parse(item.formArr));
              item.formArr.forEach((item1, index) => {
                this.getProjectStageList((rs) => {
                  this.$set(
                    item1.selectData.formAdd.enums,
                    "projectStageList",
                    this.projectStageList,
                    rs
                  );
                });
              });
            });
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

    async getProjectDetail(id) {
      let res = await api_getDetailById({ id });
      this.$set(this, "projectObj", res.data);
    },
    handleClick(tab, event) {},
    async tg() {
      let data = this.$refs["formAdd"].validateFun();
      if (!data) return;
      let obj = data.data
        ? this.$utils.resultObject(JSON.parse(data.data))
        : {};
      console.log("obj", obj);
      let projectStageName = null;
      let result = this.projectStageList.find(
        (item) => item.dataValue == obj.projectStage
      );
      if (result) {
        projectStageName = result.dataName;
      }
      console.log("projectStageName", projectStageName);
      let params = {
        ...data,
        ...obj,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        enclosureInfo: Array.isArray(obj.enclosureInfo)
          ? JSON.stringify(obj.enclosureInfo)
          : "",
        nextMonthPlanFile: Array.isArray(obj.nextMonthPlanFile)
          ? JSON.stringify(obj.nextMonthPlanFile)
          : "",
        editable: false,
        projectStageName: projectStageName,
        mark: true,
      };

      if (params.data) {
        delete params.data;
      }

      if (params.id) {
        params.id = this.$route.query.id;
      } else if (
        getSession("infoId_submit" + this.$route.query.projectId) &&
        getSession("infoId_submit" + this.$route.query.projectId) != "null"
      ) {
        params.id = getSession("infoId_submit" + this.$route.query.projectId);
        this.isNew = true;
      }
      console.log("params", params);
      debugger;
      let res = await api_insertProjectRP(params);
      if (res.msg.code == "0000") {
        removeSession("infoId_submit" + this.$route.query.projectId);
        clearInterval(this.timer);
        if (this.isNew) {
          // 新增返回列表
          this.get_success = true;
          this.routeClose();
          this.$router.push({
            name: "submit",
            query: {
              projectId: this.$route.query.projectId,
            },
          });
        } else {
          if (params.id) {
            this.$message.success("修改成功");
            this.routeClose();
            this.$router.push({
              name: "submit",
              query: {
                projectId: this.$route.query.projectId,
              },
            });
          } else {
            this.$message.success("新增成功");
            this.routeClose();

            this.$router.push({
              name: "submit",
              query: {
                projectId: this.$route.query.projectId,
              },
            });
          }
        }
      }
    },
    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subdis", this.$setState, timeout);
    },
    btg(str) {
      if (!this.$refs["formAdd"]) return;
      let data = this.$refs["formAdd"].validate();
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
        file: Array.isArray(obj.file) ? JSON.stringify(obj.file) : "",
      };
      params.enclosureInfo = Array.isArray(obj.enclosureInfo)
        ? JSON.stringify(obj.enclosureInfo)
        : "";
      params.nextMonthPlanFile = Array.isArray(obj.nextMonthPlanFile)
        ? JSON.stringify(obj.nextMonthPlanFile)
        : "";
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }
      if (params.data) {
        delete params.data;
      }

      if (str == "linshi_current") {
        // 是否是自动保存的数据
        params.editable = true;
        params.mark = false;
      } else {
        params.editable = false;
      }
      if (
        getSession("infoId_submit" + this.$route.query.projectId) &&
        getSession("infoId_submit" + this.$route.query.projectId) != "null"
      ) {
        // 自动保存拿到的id
        params.id = getSession("infoId_submit" + this.$route.query.projectId);
        this.isNew = true;
      }
      this.workFlowLoading = true;
      api_insertProjectRP_noLoading(params).then((res) => {
        if (res.msg.code == "0000") {
          if (str == "linshi_current") {
            setSession("infoId_submit" + this.$route.query.projectId, res.data);
          } else if (str == "close") {
            removeSession("infoId_submit" + this.$route.query.projectId);
            this.$message.success("保存成功");
          } else {
            clearInterval(this.timer);
            this.$message.success("保存成功");
            removeSession("infoId_submit" + this.$route.query.projectId);
            if (this.isNew) {
              this.get_success = true;
            } else {
              this.routeClose();

              this.$router.push({
                name: "submit",
                query: {
                  projectId: this.$route.query.projectId,
                },
              });
            }
          }
          this.workFlowLoading = false;
        }
      });
    },
    sumFun(obj) {
      let sum = 0;
      for (const key in obj) {
        sum += obj[key] * 1;
      }
      return sum;
    },
    async init(id) {
      let res = await api_getProjectRPById({ id });
      if (res?.data) {
        let { file } = res.data;
        res.data.file = file && JSON.parse(file);

        this.getTemplate(res.data);
      }
    },
    //  获取模板
    getTemplate(Data) {
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
        // templateId: this.templateId,
      }).then((res) => {
        console.log("这里");
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
            this.getProjectStageList((rs) => {
              this.$set(
                item1.selectData.formAdd.enums,
                "projectStageList",
                this.projectStageList,
                rs
              );
            });
          });
        });
        console.log("111", this.editableTabs);
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
    // this.getProjectStageList();
    this.createdfunc();
    if (this.projectId) {
      this.getProjectDetail(this.projectId);
    }
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
  // ::v-deep .el-tabs__header {
  //   display: none;
  // }
}
</style>