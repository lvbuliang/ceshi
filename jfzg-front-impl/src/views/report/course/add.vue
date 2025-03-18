<template>
  <div class="total-page">
    <div v-if="editableTabs.length > 0">
      <div v-if="!get_success">
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
          backName="course"
          ref="work_flow"
          :workFlowLoading="workFlowLoading"
        ></sr-work-flow>
      </div>
      <div v-else>
        <SuccessMsg name="过程文档报备" />
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
import { api_getCustomFormTemplate } from "@/api/index";
import {
  api_save,
  api_update,
  api_saveOrUpdate_noLoading,
  api_detail,
} from "@/api/course";
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
      if (to.name == "courseAdd") {
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
    };
  },
  methods: {
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
        getSession("infoId_course" + this.$route.query.projectId) &&
        getSession("infoId_course" + this.$route.query.projectId) != "null"
      ) {
        this.init(getSession("infoId_course" + this.$route.query.projectId));
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
      let params = {
        ...data,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        editable: false,
        file: Array.isArray(data.file) ? JSON.stringify(data.file) : "",
      };
      if (params.data == "[]") {
        delete params.data;
      }
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      } else if (
        getSession("infoId_course" + this.$route.query.projectId) &&
        getSession("infoId_course" + this.$route.query.projectId) != "null"
      ) {
        params.id = getSession("infoId_course" + this.$route.query.projectId);
        this.isNew = true;
      }
      if (params.id) {
        let res = await api_update(params);
        if (res.msg.code == "0000") {
          removeSession("infoId_course" + this.$route.query.projectId);
          clearInterval(this.timer);
          if (this.isNew) {
            this.get_success = true;
          } else {
            this.$message.success("修改成功");
            this.routeClose();

            this.$router.push({ name: "course" });
          }
        }
      } else {
        let res2 = await api_save(params);

        if (res2.msg.code == "0000") {
          removeSession("infoId_course" + this.$route.query.projectId);
          clearInterval(this.timer);
          if (this.isNew) {
            this.get_success = true;
          } else {
            this.$message.success("新增成功");
            this.routeClose();

            this.$router.push({ name: "course" });
          }
        }
      }
    },
    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subdis", this.$setState, timeout);
    },
    async btg(str) {
      if (!this.$refs["formAdd"]) return;
      let data = this.$refs["formAdd"].validate();

      let params = {
        ...data,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        file: Array.isArray(data.file) ? JSON.stringify(data.file) : "",
      };

      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }
      if (params.data == "[]") {
        delete params.data;
      }
      if (str == "linshi_current") {
        // 是否是自动保存的数据
        params.editable = true;
      } else {
        params.editable = false;
      }
      if (
        getSession("infoId_course" + this.$route.query.projectId) &&
        getSession("infoId_course" + this.$route.query.projectId) != "null"
      ) {
        // 自动保存拿到的id
        params.id = getSession("infoId_course" + this.$route.query.projectId);
        this.isNew = true;
      }
      let res = api_saveOrUpdate_noLoading(params, params.id);
      this.workFlowLoading = true;
      if (res.msg.code == "0000") {
        this.btgFun(str, res.data.id);
        this.workFlowLoading = false;
      }
    },
    btgFun(str, data) {
      if (str == "linshi_current") {
        setSession("infoId_course" + this.$route.query.projectId, data);
      } else if (str == "close") {
        removeSession("infoId_course" + this.$route.query.projectId);
        this.$message.success("保存成功");
      } else {
        clearInterval(this.timer);
        this.$message.success("保存成功");
        removeSession("infoId_course" + this.$route.query.projectId);
        if (this.isNew) {
          this.get_success = true;
        } else {
          this.$router.push({ name: "course" });
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
      let res = await api_detail({ id });
      if (res.data) {
        let { applyFile, researchFile, otherFile } = res.data;
        res.data.applyFile = applyFile && JSON.parse(applyFile);
        res.data.researchFile = researchFile && JSON.parse(researchFile);
        res.data.otherFile = otherFile && JSON.parse(otherFile);
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
</style>